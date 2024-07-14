<template>
  <BasicModal v-bind="$attrs" @register="register" title="添加设备" :footer="null" :width="1200">
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
  import { addDeviceForm, baseColumnThree } from '../schemas.ts';
  import { defineEmits, inject, nextTick, reactive, ref } from 'vue';
  import { taskDevicePage } from '/@/api/admin/admin';
  const emit = defineEmits(['addDeviceRes', 'register']);
  const allData = inject('allData');
  const checkedKeys = ref([]);
  const checkedList = ref([]);
  const data = reactive({
    deviceType: '',
    result: [],
  });
  const [register, { closeModal }] = useModalInner(async (option) => {
    data.deviceType = option.deviceType;
    checkedKeys.value = JSON.parse(JSON.stringify(allData.deviceIds));
    checkedList.value = JSON.parse(JSON.stringify(allData.deviceList));
    getList();
    getForm().updateSchema([
      {
        field: 'customerId',
        componentProps: {
          onChange: (val) => {
            getForm().updateSchema([
              {
                field: 'shopId',
                componentProps: {
                  params: {
                    customerId: val,
                  },
                },
              },
            ]);
            getForm().setFieldsValue({ shopId: undefined });
          },
        },
      },
      {
        field: 'shopId',
        componentProps: {
          onClick: () => {
            if (!getForm().getFieldsValue().customerId) {
              createMessage.warning('请先选择客户后再选门店!');
            }
          },
        },
      },
    ]);
  });
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await taskDevicePage({
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
    columns: baseColumnThree,
    useSearchForm: true,
    formConfig: {
      submitFunc: () => {
        setPagination({ current: 1 });
        getList();
      },
      resetFunc: () => {
        getForm().updateSchema([
          {
            field: 'shopId',
            componentProps: {
              params: {
                customerId: null,
              },
            },
          },
        ]);
      },
      showAdvancedButton: false,
      actionColOptions: {
        span: 6,
      },
      labelWidth: 100,
      schemas: addDeviceForm,
    },
    rowKey: 'snCode',
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
      checkedKeys.value = [...checkedKeys.value, record.snCode];
      checkedList.value = [...checkedList.value, record];
    } else {
      checkedKeys.value = checkedKeys.value.filter((snCode) => snCode !== record.snCode);
      checkedList.value = checkedList.value.filter((customer) => customer.snCode !== record.snCode);
    }
  }
  function onSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.snCode);
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, ...changeIds];
      selectedRows.map((item) => {
        let flag = checkedList.value.some((per) => per?.snCode == item?.snCode);
        if (!flag) {
          item && checkedList.value.push(item);
        }
      });
    } else {
      checkedKeys.value = checkedKeys.value.filter((snCode) => {
        return !changeIds.includes(snCode);
      });
      checkedList.value = checkedList.value.filter((item) => {
        let flag = changeIds.some((per) => per == item.snCode);
        return !flag;
      });
    }
  }

  function getCheckboxProps(record) {
    return {
      disabled: record.snCode === '0', // Column configuration not to be checked
    };
  }
  const batchAdd = async () => {
    emit('addDeviceRes', {
      ids: checkedKeys.value,
      list: checkedList.value,
    });
    closeModal();
  };
</script>
