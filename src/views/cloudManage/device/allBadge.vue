<template>
  <div>
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
      <template #toolbar>
        <a-button type="primary" @click="addDeviceFn('allBadge')">新增设备</a-button>
        <a-button type="primary" @click="batchDeviceFn">批量导入设备</a-button>
        <a-button type="primary" @click="jumpShopManage">门店管理</a-button>
        <a-button type="primary" @click="batchExport">批量导出</a-button>
        <a-button type="primary" @click="batchEnrollFn">批量登记使用者</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'registerStatus'">
          <span v-if="record.registerStatus == 0" style="color: red">未登记</span>
          <span v-if="record.registerStatus == 1" style="color: green">已登记</span>
        </template>
        <template v-if="column.key === 'useStatus'">
          <span v-if="record.useStatus == 0">未使用</span>
          <span v-if="record.useStatus == 1">已使用</span>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '登记使用者',
                onClick: openEnroll.bind(null, record),
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <addDevice @register="registerModalAdd" @reload="getList" />
    <batchDevice @register="registerModalBatchDevice" @reload="getList" />
    <enroll @register="registerDrawer" @reload="getList" />
    <BatchEnroll @register="registerModal" @reload="getList" />
  </div>
</template>
<script setup lang="ts">
  import Enroll from './component/enroll.vue';
  import BatchEnroll from './component/batchEnroll.vue';
  import { nextTick, onMounted, reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getBasicColumnsAll, getFormConfigAll } from './tableData';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { devicePage, exportBatch, deviceDelete } from '/@/api/manage/manage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';
  import addDevice from './component/addDevice.vue';
  import batchDevice from './component/batchDevice.vue';
  const router = useRouter();
  const { createMessage } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerModalBatchDevice, { openModal: openModalDevice }] = useModal();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const checkedKeys = ref([]);
  const [registerModalAdd, { openModal: openModalAdd }] = useModal();
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    // formData.updateTimeStart = formData.updateTimeStart
    //   ? formData.updateTimeStart.split(' ')[0]
    //   : '';
    // formData.updateTimeEnd = formData.updateTimeEnd ? formData.updateTimeEnd.split(' ')[0] : '';
    let res = await devicePage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      ...formData,
      // 排序:1、按照更新时间降序排列 2、按照设备SN码降序排列,示例值(1) 必传？
      orderBy: '1',
      category: 2, //设备类别，1胸牌，2胸牌坞,示例值(1)
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
    columns: getBasicColumnsAll(),
    useSearchForm: true,
    formConfig: {
      submitFunc: () => {
        setPagination({ current: 1 });
        getList();
      },
      ...getFormConfigAll(),
      actionColOptions: {
        span: 6,
      },
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
  const data = reactive({
    result: [],
  });
  function addDeviceFn(val) {
    openModalAdd(true, {
      title: '新增设备',
      type: val,
    });
  }
  // 导出
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
  const batchExport = async () => {
    if (checkedKeys.value.length) {
      createMessage.success('下载中请勿刷新或关闭页面！');
      await exportBatch({ ids: checkedKeys.value.join(','), category: 2 });
    } else {
      createMessage.warning('请先选择！');
    }
  };
  // 登记使用者
  const openEnroll = (record) => {
    openDrawer(true, { record });
  };
  // 登记使用者
  const handleDelete = async (record) => {
    let res = await deviceDelete({ id: record.id });
    if (res.code == 0) {
      createMessage.success('删除成功！');
      getList();
    } else {
      console.log(res);
      createMessage.error(res.message);
    }
  };
  // 批量导入设备
  const batchDeviceFn = () => {
    openModalDevice(true, {
      test: 'test',
    });
  };
  // 批量导入
  const batchEnrollFn = () => {
    openModal(true, {
      test: 'test',
      deviceCategory: 2,
    });
  };
  const jumpShopManage = () => {
    router.push('/userManage/userManagePage');
  };
  onMounted(async () => {
    getForm().updateSchema([
      {
        field: 'type',
        componentProps: {
          params: {
            category: 2, // 1: 胸牌 2: 胸牌坞
          },
        },
        componentProps: {
          onChange: (val) => {
            getForm().updateSchema([
              {
                field: 'firmwareVersion',
                componentProps: {
                  params: {
                    deviceType: val,
                  },
                },
              },
            ]);
            getForm().setFieldsValue({ firmwareVersion: undefined });
          },
        },
      },
    ]);
    getList();
  });
</script>
