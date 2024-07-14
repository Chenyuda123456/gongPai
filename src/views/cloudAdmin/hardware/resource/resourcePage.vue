<template>
  <div>
    <BasicTable @register="registerTable" :dataSource="data.result">
      <template #toolbar>
        <a-button type="primary" @click="openModalFn">上传资源</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'resourceType'">
          {{ record.resourceType == 0 ? '固件' : '配置' }}
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '查看配置',
                onClick: downloadFn.bind(null, record),
                ifShow: () => {
                  return record.resourceType == 1;
                },
              },
              {
                label: '下载',
                onClick: handleDownload.bind(null, record),
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除这一个资源',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <uploadResource @reload="getList" @register="registerModal" />
    <configDetile @reload="getList" @register="registerModalConfigDetail" />
  </div>
</template>
<script setup lang="ts">
  import configDetile from '/@/views/cloudAdmin/hardware/config/component/configDetile.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { baseInfo, baseColumn1, baseColumn2 } from './schemas';
  import { resourcePage, resourceDelete } from '/@/api/admin/admin';
  import uploadResource from './component/uploadResource.vue';
  import { useModal } from '/@/components/Modal';
  import { nextTick, onMounted, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const [registerModal, { openModal: openModal }] = useModal();
  const data = reactive({
    result: [],
    resourceType: '固件',
  });
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    if (data.resourceType == '固件') {
      setColumns(baseColumn1);
    } else {
      setColumns(baseColumn2);
    }
    let res = await resourcePage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      ...formData,
    });
    if (res.code == 0) {
      data.result = res.data.records;
      setPagination({
        total: res.data.total,
      });
    }
  };
  const [registerModalConfigDetail, { openModal: openModalConfigDetail }] = useModal();
  const [registerTable, { getForm, setPagination, getPaginationRef, setColumns }] = useTable({
    columns: baseColumn1,
    clickToRowSelect: false,
    useSearchForm: true,
    formConfig: {
      submitFunc: () => {
        setPagination({ current: 1 });
        getList();
      },
      showAdvancedButton: false,
      actionColOptions: {
        span: 18,
      },
      labelWidth: 100,
      schemas: baseInfo,
    },
    rowKey: 'id',
    actionColumn: {
      width: 200,
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
  const downloadFn = (record) => {
    openModalConfigDetail(true, record);
  };
  const handleDownload = (record) => {
    if (window.location.origin.includes('https')) {
      window.open(record.fileUrl.replace('http', 'https'), '_blank');
    } else {
      window.open(record.fileUrl, '_blank');
    }
  };
  const handleDelete = async (record) => {
    const res = await resourceDelete({ id: record.id });
    if (res.code == 0) {
      createMessage.success(res.message);
      getList();
    } else {
      createMessage.error(res.message);
    }
  };
  const openModalFn = () => {
    openModal(true, {
      upload: true,
    });
  };
  onMounted(() => {
    getList();
    getForm().updateSchema([
      {
        field: 'resourceType',
        componentProps: {
          onChange: (val) => {
            console.log(val);
            if (val == 0) {
              data.resourceType = '固件';
            } else {
              data.resourceType = '配置';
            }
          },
        },
      },
    ]);
  });
</script>

<style scoped></style>
