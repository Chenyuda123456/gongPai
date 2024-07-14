<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="操作记录列表"
    :footer="null"
    :width="1200"
  >
    <BasicTable @register="registerTable" :data-source="data.result">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'resultCode'">
          <div>
            {{ record.resultCode == 1 ? '成功' : '失败' }}
          </div>
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { blackForm, blackColumn } from '../schemas.ts';
  import { nextTick, reactive } from 'vue';
  import { operatePage } from '/@/api/admin/admin';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const data = reactive({
    taskId: '',
    result: [],
  });
  const [register] = useModalInner((option) => {
    data.taskId = option.taskId;
    setPagination({
      current: 1,
    });
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
      getList();
    });
  });
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await operatePage({
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
        setPagination({
          current: 1,
        });
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
        span: 12,
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
