<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="['system:sysConfig:add']"
          preIcon="ant-design:plus-outlined"
          type="primary"
          @click="handleCreate"
          >新增
        </a-button>
        <a-button
          v-auth="['system:sysConfig:export']"
          color="warning"
          preIcon="ant-design:download-outlined"
          @click="handleExport"
          >导出
        </a-button>
        <a-button
          v-auth="['system:sysConfig:refresh']"
          color="success"
          preIcon="ant-design:redo-outlined"
          @click="handleRefresh"
          >刷新缓存
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag :color="record.status === '0' ? 'processing' : 'error'">
            {{ formatDictValue(sysStatusOptions, record.status) }}
          </Tag>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                auth: 'system:sysConfig:edit',
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                auth: ['system:sysConfig:remove'],
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
    <Test ref="TestRef" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onBeforeMount, onMounted } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import FormModal from './FormModal.vue';
  import Test from './test.vue';
  import { columns, searchFormSchema } from './data';

  import { exportList, fetchList, refresh, removeObj } from '/@/api/modules/system/sysConfigApi';
  import { listDictModel } from '/@/api/common';
  import { formatDictValue } from '/@/utils';
  import { downloadByData } from '/@/utils/file/download';

  const sysStatusOptions = ref([]);
  onBeforeMount(async () => {
    sysStatusOptions.value = await listDictModel({ dictCode: 'sys_status' });
  });
  const TestRef = ref();
  onMounted(() => {
    console.log((TestRef.value.visible = true));
  });
  const { createMessage, createConfirm } = useMessage();
  const [registerTable, { reload, getForm }] = useTable({
    title: '参数列表',
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
      auth: ['system:sysConfig:edit', 'system:sysConfig:remove'],
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
  });
  const [registerModal, { openModal }] = useModal();

  // 新增按钮事件
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  // 编辑按钮事件
  function handleEdit(record: Recordable) {
    console.log(record);
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
    await reload();
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

  // 刷新缓存按钮事件
  async function handleRefresh() {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: '确认刷新所有参数缓存？',
      onOk: async () => {
        await refresh();
        createMessage.success('刷新成功！');
      },
    });
  }

  // 弹窗回调事件
  async function handleSuccess({ isUpdate, values }) {
    console.log(isUpdate);
    console.log(values);
    await reload();
  }
</script>
