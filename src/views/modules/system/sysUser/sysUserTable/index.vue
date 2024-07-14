<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="['system:sysUser:add']"
          type="primary"
          @click="handleCreate"
          preIcon="ant-design:plus-outlined"
          >新增</a-button
        >
        <a-button
          v-auth="['system:sysUser:export']"
          color="warning"
          @click="handleExport"
          preIcon="ant-design:download-outlined"
          >导出</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'sex'">
          <Tag color="processing" v-if="record.sex === '1'">
            {{ formatDictValue(sysSexOptions, record.sex) }}
          </Tag>
          <Tag color="error" v-if="record.sex === '2'">
            {{ formatDictValue(sysSexOptions, record.sex) }}
          </Tag>
          <Tag color="default" v-if="record.sex === '3'">
            {{ formatDictValue(sysSexOptions, record.sex) }}
          </Tag>
        </template>
        <template v-if="column.key === 'lockFlag'">
          <Tag :color="record.lockFlag === '0' ? 'processing' : 'error'">
            {{ formatDictValue(sysLockFlagOptions, record.lockFlag) }}
          </Tag>
        </template>
        <template v-if="column.key === 'status'">
          <Tag :color="record.status === '0' ? 'processing' : 'error'">
            {{ formatDictValue(sysStatusOptions, record.status) }}
          </Tag>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                auth: ['system:sysUser:resetPwd'],
                icon: 'ant-design:key-outlined',
                tooltip: '重置密码',
                onClick: handleResetPwd.bind(null, record),
              },
              {
                auth: ['system:sysUser:edit'],
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                auth: ['system:sysUser:remove'],
                icon: 'ant-design:delete-outlined',
                tooltip: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <FormModal @register="registerModal" @success="handleSuccess" />
    <FormModalResetPwd @register="registerModalResetPwd" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, onBeforeMount, ref, watch } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import FormModal from './FormModal.vue';
  import FormModalResetPwd from './FormModalResetPwd.vue';
  import { columns, searchFormSchema } from './data';

  import { fetchList, removeObj, exportList } from '/@/api/modules/system/sysUserApi';
  import { listDictModel } from '/@/api/common';
  import { formatDictValue } from '/@/utils';
  import { downloadByData } from '/@/utils/file/download';

  const emit = defineEmits(['refresh-tree']);

  const props = defineProps({
    nodeId: { type: String },
  });

  const sysStatusOptions = ref([]);
  const sysLockFlagOptions = ref([]);
  const sysSexOptions = ref([]);
  onBeforeMount(async () => {
    sysStatusOptions.value = await listDictModel({ dictCode: 'sys_status' });
    sysLockFlagOptions.value = await listDictModel({ dictCode: 'sys_lock_flag' });
    sysSexOptions.value = await listDictModel({ dictCode: 'sys_sex' });
  });

  const { createMessage, createConfirm } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerModalResetPwd, { openModal: openModalResetPwd }] = useModal();
  const [registerTable, { reload, getForm }] = useTable({
    title: '用户列表 ',
    api: fetchList,
    rowKey: 'id',
    columns,
    formConfig: {
      baseColProps: { sm: 24, lg: 6 },
      labelWidth: 90,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      resetButtonOptions: {
        preIcon: 'ant-design:delete-outlined',
      },
      submitButtonOptions: {
        preIcon: 'ant-design:search-outlined',
      },
    },
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      auth: ['system:sysUser:resetPwd', 'system:sysUser:edit', 'system:sysUser:remove'],
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
    beforeFetch: handleBeforeFetch,
  });

  // 新增按钮事件
  function handleCreate() {
    const record = {
      deptId: props.nodeId,
    };
    openModal(true, {
      record,
      isUpdate: false,
    });
  }

  // 编辑按钮事件
  function handleEdit(record: Recordable) {
    console.log(record);
    record.deptId = record.deptId === '' ? null : record.deptId;
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  // 删除按钮事件
  async function handleDelete(record: Recordable) {
    console.log(record);
    await removeObj({ ids: record.id });
    createMessage.success('删除成功！');
    emit('refresh-tree', record.deptId);
    // 表格刷新，在refresh-tree事件之后，执行
    // await reload();
  }

  // 导出按钮事件
  async function handleExport() {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: '确认导出？',
      onOk: async () => {
        const params = getForm().getFieldsValue();
        const res = await exportList(params);
        const blob = res.data;
        const headerFilename = res.headers['content-disposition'].split(';')[1].split('=')[1];
        const filename = decodeURIComponent(escape(headerFilename));
        downloadByData(blob, filename);
      },
    });
  }

  // 弹窗回调事件
  async function handleSuccess({ isUpdate, values }) {
    console.log(isUpdate);
    console.log(values);
    emit('refresh-tree', values.deptId);
    // 表格刷新，在refresh-tree事件之后，执行
    // reload();
  }

  // 表格请求之前，对参数进行处理
  function handleBeforeFetch(params) {
    return Object.assign(params, { deptId: props.nodeId });
  }

  // 刷新表格
  function refresh() {
    reload();
  }

  // 重置密码按钮事件
  function handleResetPwd(record: Recordable) {
    console.log(record);
    openModalResetPwd(true, {
      record,
    });
  }

  watch(
    () => props.nodeId,
    () => {
      nextTick(() => {
        reload();
      });
    },
  );

  // 暴露内部方法
  defineExpose({ refresh });
</script>
