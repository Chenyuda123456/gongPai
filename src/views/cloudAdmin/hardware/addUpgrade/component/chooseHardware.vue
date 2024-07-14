<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="选择固件"
    :footer="null"
    @ok="handleOk"
    :width="1200"
  >
    <BasicTable @register="registerTable" :dataSource="data.result">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '下载',
                onClick: handleDownLoad.bind(null, record),
              },
              {
                label: '添加',
                popConfirm: {
                  title: '是否确认添加',
                  confirm: handleAdd.bind(null, record),
                },
                ifShow: () => {
                  return record.id != allData.hardware.id;
                },
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                ifShow: () => {
                  return record.id == allData.hardware.id;
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { chooseHardwareForm, chooseHardwareColumn } from '../schemas.ts';
  import { defineEmits, inject, nextTick, reactive } from 'vue';
  import { resourcePage } from '/@/api/admin/admin';
  const emit = defineEmits(['ChooseHardwareRes', 'register']);
  const allData = inject('allData');
  const data = reactive({
    deviceType: '',
    result: [],
  });

  const [register, { closeModal }] = useModalInner(async (option) => {
    data.deviceType = option.deviceType;
    await getForm().resetFields();
    getList();
  });
  // 用的资源管理列表
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await resourcePage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      resourceType: 0, //资源类型，0-固件，1-配置
      deviceType: data.deviceType,
      ...formData,
    });
    if (res.code == 0) {
      data.result = res.data.records;
      setPagination({
        total: res.data.total,
      });
    }
  };
  const [registerTable, { getForm, getPaginationRef, setPagination }] = useTable({
    // canResize: false,
    resizeHeightOffset: 110,
    columns: chooseHardwareColumn,
    useSearchForm: true,
    footer: null,
    formConfig: {
      submitFunc: () => {
        setPagination({ current: 1 });
        getList();
      },
      showAdvancedButton: false,
      actionColOptions: {
        span: 12,
      },
      labelWidth: 100,
      schemas: chooseHardwareForm,
    },
    // showIndexColumn: false,
    autoCreateKey: true,
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
  const handleDownLoad = async (record) => {
    if (window.location.origin.includes('https')) {
      window.open(record.fileUrl.replace('http', 'https'), '_blank');
    } else {
      window.open(record.fileUrl, '_blank');
    }
  };
  const handleAdd = async (record) => {
    emit('ChooseHardwareRes', record);
    closeModal();
  };
  const handleDelete = async () => {
    emit('ChooseHardwareRes', { id: undefined });
  };
  const handleOk = async () => {};
</script>
