<template>
  <div>
    <BasicTable @register="registerTable" :dataSource="data.result">
      <template #toolbar>
        <!--<a-button type="primary" @click="batchCheckFn">批量审核</a-button>-->
        <a-button type="primary" @click="setClient">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'auditStatus'">
          <a-button style="color: green" v-if="record.auditStatus == 1" type="link"
            >已审核</a-button
          >
          <a-button v-if="record.auditStatus == 0" type="link" danger>待审核</a-button>
        </template>
        <template v-if="column.key === 'deployType'">
          <span v-if="record.deployType == 1">公有云</span>
          <a-button v-if="record.deployType == 2" type="link">私有云</a-button>
        </template>
        <template v-if="column.key === 'source'">
          <span v-if="record.source == 0">管理后台</span>
          <span v-if="record.source == 1">云管平台</span>
          <span v-if="record.source == 2">统一质检</span>
        </template>
        <template v-if="column.key === 'openPlatform'">
          <span v-if="record.openPlatform == 0">暂未开通</span>
          <span v-if="record.openPlatform == 1">云管平台</span>
          <span v-if="record.openPlatform == 2">统一质检</span>
          <span v-if="record.openPlatform == 3">云管平台|统一质检</span>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '审核',
                onClick: handleAudit.bind(null, record),
                ifShow: () => {
                  return record.auditStatus == 0;
                },
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                popConfirm: {
                  title: '确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <Add @reload="getList" @register="registerModalAdd" />
    <BatchCheck @register="registerModalBatchCheck" @reload="getList" />
  </div>
</template>
<script setup lang="ts">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getBasicColumns, getFormConfig } from './tableData';
  import { customerPage, customerRemove } from '/@/api/admin/admin';
  import Add from './component/add.vue';
  import BatchCheck from './component/BatchCheck.vue';
  import { useModal } from '/@/components/Modal';
  import { onMounted, reactive, nextTick, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const checkedKeys = ref([]);
  const { createMessage } = useMessage();
  const [registerModalAdd, { openModal: openModalAdd }] = useModal();
  const [registerModalBatchCheck, { openModal: openModalBatchCheck }] = useModal();
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await customerPage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      ...formData,
      auditStatus: 0, // 审核状态，0待审核 1审核通过 2审核不通过
    });
    console.log(res);
    if (res.code == 0) {
      data.result = res.data.list;
      setPagination({
        total: res.data.total,
      });
    }
  };
  const [registerTable, { getForm, setPagination, getPaginationRef }] = useTable({
    title: '客户列表',
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: {
      submitFunc: () => {
        setPagination({ current: 1 });
        getList();
      },
      ...getFormConfig(),
    },
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: checkedKeys,
      onSelect: onSelect,
      onSelectAll: onSelectAll,
    },
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
    pagination: {
      onChange() {
        nextTick(() => {
          getList();
        });
      },
    },
  });
  // 批量审核
  function onSelect(record, selected) {
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, record.id];
    } else {
      checkedKeys.value = checkedKeys.value.filter((id) => id !== record.id);
    }
  }
  function onSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.id);
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, ...changeIds];
    } else {
      checkedKeys.value = checkedKeys.value.filter((id) => {
        return !changeIds.includes(id);
      });
    }
  }
  const data = reactive({
    result: [],
  });
  onMounted(() => {
    getList();
  });
  const batchCheckFn = () => {
    if (checkedKeys.value.length) {
      openModalBatchCheck(true, {
        title: '',
        checkedKeys: checkedKeys,
      });
    } else {
      createMessage.warn('请先选择！');
    }
  };
  const setClient = () => {
    openModalAdd(true, {
      title: '新增',
      id: null,
    });
  };
  const handleEdit = (record) => {
    openModalAdd(true, {
      title: '编辑',
      id: record.id,
      record: record,
    });
  };
  const handleAudit = (record) => {
    openModalAdd(true, {
      title: '审核',
      id: record.id,
      record: record,
    });
  };
  const handleDelete = async (record) => {
    const res = await customerRemove({
      id: record.id,
    });
    if (res.code == 0) {
      createMessage.success('删除成功！');
      await getList();
    } else {
      createMessage.error(res.message);
    }
  };
</script>
