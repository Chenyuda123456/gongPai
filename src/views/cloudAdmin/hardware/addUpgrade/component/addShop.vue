<template>
  <BasicModal v-bind="$attrs" @register="register" title="添加门店" :footer="null" :width="1200">
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
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { addShopForm, baseColumnTwo } from '../schemas.ts';
  import { defineEmits, inject, nextTick, reactive, ref } from 'vue';
  import { taskShopPage } from '/@/api/admin/admin';
  const emit = defineEmits(['addShopRes', 'register']);
  const allData = inject('allData');
  const checkedKeys = ref([]);
  const checkedList = ref([]);
  const data = reactive({
    deviceType: '',
    result: [],
  });
  const [register, { closeModal }] = useModalInner(async (option) => {
    data.deviceType = option.deviceType;
    checkedKeys.value = JSON.parse(JSON.stringify(allData.shopIds));
    checkedList.value = JSON.parse(JSON.stringify(allData.shopList));
    await getForm().resetFields();
    nextTick(() => {
      getForm().updateSchema([
        {
          field: 'customerId',
          componentProps: {
            onChange: (val) => {
              console.log(val);
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
  });
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await taskShopPage({
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
    columns: baseColumnTwo,
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
      schemas: addShopForm,
    },
    rowKey: 'shopId',
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
      checkedKeys.value = [...checkedKeys.value, record.shopId];
      checkedList.value = [...checkedList.value, record];
    } else {
      checkedKeys.value = checkedKeys.value.filter((shopId) => shopId !== record.shopId);
      checkedList.value = checkedList.value.filter((shop) => shop.shopId !== record.shopId);
    }
  }
  function onSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.shopId);
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, ...changeIds];
      selectedRows.map((item) => {
        let flag = checkedList.value.some((per) => per?.shopId == item?.shopId);
        if (!flag) {
          item && checkedList.value.push(item);
        }
      });
    } else {
      checkedKeys.value = checkedKeys.value.filter((shopId) => {
        return !changeIds.includes(shopId);
      });
      checkedList.value = checkedList.value.filter((item) => {
        let flag = changeIds.some((per) => per == item.shopId);
        return !flag;
      });
    }
  }
  function getCheckboxProps(record) {
    return {
      disabled: record.id === '0', // Column configuration not to be checked
    };
  }
  const batchAdd = async () => {
    emit('addShopRes', {
      ids: checkedKeys.value,
      list: checkedList.value,
    });
    closeModal();
  };
</script>
