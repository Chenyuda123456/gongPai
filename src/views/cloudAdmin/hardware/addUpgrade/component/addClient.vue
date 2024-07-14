<template>
  <BasicModal v-bind="$attrs" @register="register" title="添加客户" :footer="null" :width="1200">
    <BasicTable @register="registerTable" :dataSource="data.result">
      <template #headerTop>
        <a-alert type="info" show-icon>
          <template #message>
            <template v-if="checkedKeys.length > 0">
              <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
            </template>
            <template v-else>
              <span>未选中任何项目</span>
            </template>
          </template>
        </a-alert>
      </template>
      <template #toolbar> <a-button type="primary" @click="batchAdd">批量添加</a-button></template>
      <template #bodyCell="{ column, record }"> </template>
    </BasicTable>
  </BasicModal>
</template>
<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { addClientForm, baseColumnOne } from '../schemas.ts';
  import { defineEmits, inject, nextTick, reactive, ref } from 'vue';
  import { taskCustomerPage } from '/@/api/admin/admin';
  const emit = defineEmits(['addClientRes', 'register']);
  const allData = inject('allData');
  const checkedKeys = ref([]);
  const checkedList = ref([]);
  const data = reactive({
    deviceType: '',
    result: [],
  });
  const [register, { closeModal }] = useModalInner(async (option) => {
    data.deviceType = option.deviceType;
    checkedKeys.value = JSON.parse(JSON.stringify(allData.clientIds));
    checkedList.value = JSON.parse(JSON.stringify(allData.clientList));
    await getForm().resetFields();
  });
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await taskCustomerPage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      deviceType: data.deviceType,
      ...formData,
    });
    if (res.code == 0) {
      data.result = res.data.list;
      data.result.forEach((item) => {
        item.deviceType = data.deviceType;
      });
      setPagination({
        total: res.data.total,
      });
    }
  };
  const [registerTable, { getForm, getPaginationRef, setPagination }] = useTable({
    // canResize: false,
    resizeHeightOffset: 140,
    clickToRowSelect: false,
    columns: baseColumnOne,
    useSearchForm: true,
    formConfig: {
      submitFunc: () => {
        setPagination({ current: 1 });
        getList();
      },
      showAdvancedButton: false,
      actionColOptions: {
        span: 6,
      },
      labelWidth: 100,
      schemas: addClientForm,
    },
    rowKey: 'customerId',
    showIndexColumn: false,
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: checkedKeys,
      onSelect: onSelect,
      onSelectAll: onSelectAll,
      getCheckboxProps: getCheckboxProps,
    },
    pagination: {
      onChange() {
        nextTick(() => {
          getList();
        });
      },
    },
  });

  function onSelect(record, selected) {
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, record.customerId];
      checkedList.value = [...checkedList.value, record];
    } else {
      checkedKeys.value = checkedKeys.value.filter(
        (customerId) => customerId !== record.customerId,
      );
      checkedList.value = checkedList.value.filter(
        (customer) => customer.customerId !== record.customerId,
      );
    }
  }
  function onSelectAll(selected, selectedRows, changeRows) {
    console.log(selected);
    console.log(selectedRows);
    const changeIds = changeRows.map((item) => item.customerId);
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, ...changeIds];
      selectedRows.map((item) => {
        let flag = checkedList.value.some((per) => per?.customerId == item?.customerId);
        if (!flag) {
          item && checkedList.value.push(item);
        }
      });
      console.log(selectedRows);
      console.log(checkedList.value);
    } else {
      checkedKeys.value = checkedKeys.value.filter((customerId) => {
        return !changeIds.includes(customerId);
      });
      checkedList.value = checkedList.value.filter((item) => {
        let flag = changeIds.some((per) => per == item.customerId);
        return !flag;
      });
    }
  }

  function getCheckboxProps(record) {
    return {
      disabled: record.customerId === '0', // Column configuration not to be checked
    };
  }
  const batchAdd = async () => {
    console.log(checkedList.value);
    emit('addClientRes', {
      ids: checkedKeys.value,
      list: checkedList.value,
    });
    closeModal();
  };
</script>
