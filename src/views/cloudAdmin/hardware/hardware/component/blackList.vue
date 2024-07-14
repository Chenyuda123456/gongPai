<template>
  <BasicModal v-bind="$attrs" @register="register" title="黑名单" :footer="null" :width="1200">
    <BasicTable @register="registerTable" :data-source="data.result" />
  </BasicModal>
</template>
<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { blackForm, blackColumn } from '../schemas.ts';
  import { nextTick, reactive } from 'vue';
  import { blackList, deviceType } from '/@/api/admin/admin';
  const data = reactive({
    taskId: '',
    result: [],
  });
  const [register] = useModalInner((option) => {
    data.taskId = option.taskId;
    nextTick(async () => {
      await getForm().resetFields();
      await getForm().updateSchema([
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
      setPagination({ current: 1 });
      getList();
    });
  });
  const getList = async () => {
    let deviceTypeRes = await deviceType({});
    data.deviceTypeList = deviceTypeRes.data;
    const formData = getForm().getFieldsValue();
    let res = await blackList({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      ...formData,
      taskId: data.taskId,
    });
    if (res.code == 0) {
      data.result = res.data.list;
      setPagination({
        total: res.data.total,
      });
    }
  };
  const [registerTable, { getForm, setPagination, getPaginationRef }] = useTable({
    // canResize: false,
    resizeHeightOffset: 110,
    columns: blackColumn,
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
        span: 24,
      },
      labelWidth: 100,
      schemas: blackForm,
    },
    // showIndexColumn: false,
    autoCreateKey: true,
    pagination: {
      onChange() {
        nextTick(() => {
          getList();
        });
      },
    },
  });
</script>
