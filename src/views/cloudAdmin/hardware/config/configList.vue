<template>
  <div>
    <BasicTable @register="registerTable" :dataSource="data.result">
      <template #toolbar>
        <a-button type="primary" @click="addTask">新增升级任务</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'rangeType'">
          {{ getRange(record.rangeType) }}
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '查看配置',
                onClick: downloadFn.bind(null, record),
              },
              {
                label: '升级结果',
                onClick: openResult.bind(null, record),
              },
            ]"
          />
          <TableAction
            :actions="[
              {
                label: '升级范围',
                onClick: openRange.bind(null, record),
                ifShow: () => {
                  return record.rangeType !== 4;
                },
              },
              {
                label: '黑名单',
                onClick: openBlockList.bind(null, record),
              },
              {
                label: '复制',
                onClick: duplicate.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <blackList @register="registerModal" />
    <addUpgrade @reload="getList" @register="registerDrawer" />
    <configResultList @reload="getList" @register="registerDrawerResult" />
    <rangeClientUpgrade @reload="getList" @register="registerDrawerRangeClient" />
    <rangeShopUpgrade @reload="getList" @register="registerDrawerRangeShop" />
    <rangeDeviceUpgrade :title="'设备'" @reload="getList" @register="registerDrawerRangeDevice" />
    <configDetile @register="registerModalConfigDetail" />
  </div>
</template>
<script setup lang="ts">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { baseInfo, baseColumn } from './schemas.ts';
  import blackList from '/@/views/cloudAdmin/hardware/hardware/component/blackList.vue';
  import addUpgrade from '/@/views/cloudAdmin/hardware/addUpgrade/addUpgrade.vue';
  import configResultList from '/@/views/cloudAdmin/hardware/config/configResultList.vue';
  import rangeClientUpgrade from '/@/views/cloudAdmin/hardware/range/rangeClientUpgrade.vue';
  import rangeShopUpgrade from '/@/views/cloudAdmin/hardware/range/rangeShopUpgrade.vue';
  import rangeDeviceUpgrade from '/@/views/cloudAdmin/hardware/range/rangeDeviceUpgrade.vue';
  import configDetile from '/@/views/cloudAdmin/hardware/config/component/configDetile.vue';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { deviceType, upgradeTaskPage } from '/@/api/admin/admin';
  import { nextTick, onMounted, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const data = reactive({
    result: [],
    deviceTypeList: [],
  });
  const getList = async () => {
    let deviceTypeRes = await deviceType({});
    data.deviceTypeList = deviceTypeRes.data;
    const formData = getForm().getFieldsValue();
    if (formData.rangeValue && !formData.rangeType) {
      return createMessage.warning('请选择对应的升级范围！');
    }
    let res = await upgradeTaskPage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      ...formData,
      upgradeType: 1, // 升级类型 0-固件；1-配置单
    });
    if (res.code == 0) {
      data.result = res.data.list;
      setPagination({
        total: res.data.total,
      });
    }
  };
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDrawerResult, { openDrawer: openDrawerResult }] = useDrawer();
  const [registerDrawerRangeClient, { openDrawer: openDrawerRangeClient }] = useDrawer();
  const [registerDrawerRangeShop, { openDrawer: openDrawerRangeShop }] = useDrawer();
  const [registerDrawerRangeDevice, { openDrawer: openDrawerRangeDevice }] = useDrawer();
  const [registerModal, { openModal: openModal }] = useModal();
  const [registerModalConfigDetail, { openModal: openModalConfigDetail }] = useModal();
  const [registerTable, { getForm, setPagination, getPaginationRef }] = useTable({
    columns: baseColumn,
    clickToRowSelect: false,
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
      schemas: baseInfo,
    },
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
  // const getDeviceType = (val) => {
  //   return data.deviceTypeList.filter((item) => (item.type = val))[0]['name'];
  // };
  const getRange = (val) => {
    if (val == 1) {
      return '按客户';
    } else if (val == 2) {
      return '按客户门店';
    } else if (val == 3) {
      return '按设备';
    } else if (val == 4) {
      return '全部升级';
    }
  };
  const downloadFn = (record) => {
    openModalConfigDetail(true, record);
  };
  const openResult = (record) => {
    console.log(record);
    openDrawerResult(true, record);
  };
  const openRange = (record) => {
    if (record.rangeType == 1) {
      openDrawerRangeClient(true, record);
    } else if (record.rangeType == 2) {
      openDrawerRangeShop(true, record);
    } else if (record.rangeType == 3) {
      openDrawerRangeDevice(true, record);
    }
  };
  const openBlockList = (record) => {
    openModal(true, record);
  };
  const duplicate = (option) => {
    openDrawer(true, option);
  };
  const addTask = () => {
    openDrawer(true, {
      upgradeType: 1, // 升级类型 0-固件；1-配置单
    });
  };
  onMounted(() => {
    getList();
  });
</script>

<style scoped></style>
