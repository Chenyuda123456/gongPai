<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="['system:sysPost:add']"
          type="primary"
          @click="handleCreate"
          preIcon="ant-design:plus-outlined"
          >新增</a-button
        >
        <a-button
          v-auth="['system:sysPost:export']"
          color="warning"
          @click="handleExport"
          preIcon="ant-design:download-outlined"
          >导出</a-button
        >
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
                auth: ['system:sysPost:edit'],
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                auth: ['system:sysPost:remove'],
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
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import FormModal from './FormModal.vue';
  import { columns, searchFormSchema } from './data';

  import { fetchList, removeObj, exportList } from '/@/api/modules/system/sysPostApi';
  import { listDictModel } from '/@/api/common';
  import { formatDictValue } from '/@/utils';
  import { downloadByData } from '/@/utils/file/download';

  const sysStatusOptions = ref([]);
  onBeforeMount(async () => {
    sysStatusOptions.value = await listDictModel({ dictCode: 'sys_status' });
  });

  const { createMessage, createConfirm } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, getForm }] = useTable({
    title: '岗位列表 ',
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
      auth: ['system:sysPost:edit', 'system:sysPost:remove'],
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
  });

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

  // 弹窗回调事件
  async function handleSuccess({ isUpdate, values }) {
    console.log(isUpdate);
    console.log(values);
    await reload();
  }
</script>
