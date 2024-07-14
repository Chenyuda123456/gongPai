<template>
  <div>
    <BasicTable
      @register="registerTable"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <template #toolbar>
        <a-button
          v-auth="['system:sysDict:add']"
          type="primary"
          @click="handleCreate"
          preIcon="ant-design:plus-outlined"
          >新增</a-button
        >
        <a-button
          v-auth="['system:sysDict:export']"
          color="warning"
          @click="handleExport"
          preIcon="ant-design:download-outlined"
          >导出</a-button
        >
        <a-button
          v-auth="['system:sysDict:refresh']"
          color="success"
          @click="handleRefresh"
          preIcon="ant-design:redo-outlined"
          >刷新缓存</a-button
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
                auth: ['system:sysDict:edit'],
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                auth: ['system:sysDict:remove'],
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

  import { fetchList, removeObj, exportList, refresh } from '/@/api/modules/system/sysDictApi';
  import { formatDictValue } from '/@/utils';
  import { listDictModel } from '/@/api/common';
  import { downloadByData } from '/@/utils/file/download';

  const emit = defineEmits(['dict-change']);

  const sysStatusOptions = ref([]);
  onBeforeMount(async () => {
    sysStatusOptions.value = await listDictModel({ dictCode: 'sys_status' });
  });

  const { createMessage, createConfirm } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, getForm, getDataSource, getSelectRowKeys, setSelectedRowKeys }] =
    useTable({
      title: '字典列表',
      api: fetchList,
      rowKey: 'id',
      columns,
      rowSelection: { type: 'radio' },
      formConfig: {
        baseColProps: { sm: 24, lg: 12 },
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
        auth: ['system:sysDict:edit', 'system:sysDict:remove'],
        width: 80,
        title: '操作',
        dataIndex: 'action',
      },
      afterFetch: handleAfterFetch,
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
    // after delete, select first row
    const list = getDataSource();
    if (list.length > 0) {
      setSelectedRowKeys([list[0].id]);
    } else {
      setSelectedRowKeys([]);
    }
    console.log('handleDelete');
    emitDictChange();
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
      content: '确认刷新所有数据字典缓存？',
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
    if (isUpdate) {
      // after update, select updated row
      setSelectedRowKeys([values.id]);
    } else {
      // after create, select first row
      const list = getDataSource();
      if (list.length > 0) {
        setSelectedRowKeys([list[0].id]);
      } else {
        setSelectedRowKeys([]);
      }
    }
    console.log('handleSuccess', isUpdate ? 'update' : 'create');
    emitDictChange();
  }

  // 表格请求之后，对返回值进行处理
  function handleAfterFetch(data) {
    // after fetch, select first row
    if (data.length > 0) {
      setSelectedRowKeys([data[0].id]);
    } else {
      setSelectedRowKeys([]);
    }
    console.log('handleAfterFetch', data);
    emitDictChange();
  }

  // 表格行点击事件
  function handleRowClick(record: Recordable) {
    console.log('handleRowClick', record);
    setSelectedRowKeys([record.id]);
    emitDictChange();
  }

  // 表格行选中事件
  function handleSelectionChange({ keys, rows }) {
    console.log('handleSelectionChange', keys, rows);
    emitDictChange();
  }

  // 字典变化事件
  function emitDictChange() {
    const selectedKeys = getSelectRowKeys();
    console.log(selectedKeys);
    emit('dict-change', selectedKeys.length > 0 ? selectedKeys[0] : '');
  }
</script>
