<template>
  <BasicDrawer v-bind="$attrs" @register="register" :isDetail="true" title="客户升级">
    <div class="p-16px">
      <BasicTable
        :data-source="data.result"
        @register="registerTable"
        :title="`设备类型：${data.record.deviceType} | ${
          $route.path.includes('admin-hardware/hardwareList')
            ? '升级版本：' + data.record.version + '|'
            : ''
        } 升级范围：按客户 ，以下为要升级的客户列表（合计 ${data.statistic.customerNum} 家客户，${
          data.statistic.deviceNum
        } 台设备）`"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: '查看设备列表',
                  onClick: lookDevice.bind(null, record),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
    <rangeDeviceUpgrade :title="'客户'" @reload="getList" @register="registerDrawerRangeDevice" />
  </BasicDrawer>
</template>
<script setup lang="ts">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicDrawer, useDrawer, useDrawerInner } from '/@/components/Drawer';
  import rangeDeviceUpgrade from '/@/views/cloudAdmin/hardware/range/rangeDeviceUpgrade.vue';
  import { clientColumn } from './schemas.ts';
  import { rangePage, rangeStatistics } from '/@/api/admin/admin';
  import { nextTick, reactive } from 'vue';
  const [registerDrawerRangeDevice, { openDrawer: openDrawerRangeDevice }] = useDrawer();
  const data = reactive({
    result: [],
    statistic: {},
    record: {},
    rangeType: 1,
    taskId: '',
  });
  const [register] = useDrawerInner(async (option) => {
    data.record = option;
    const rangeStatisticsRes = await rangeStatistics({
      rangeType: data.record.rangeType,
      taskId: data.record.taskId,
    });
    data.statistic = { ...rangeStatisticsRes.data };
    getList();
  });
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await rangePage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      rangeType: data.record.rangeType, // 升级范围类型 1-按客户 2-按门店 3-按设备 4-全部范围
      taskId: data.record.taskId,
      ...formData,
    });
    if (res.code == 0) {
      data.result = res.data.list;
      setPagination({
        total: res.data.total,
      });
    }
  };
  const [registerTable, { getForm, getPaginationRef, setPagination }] = useTable({
    columns: clientColumn,
    clickToRowSelect: false,
    autoCreateKey: true,
    pagination: {
      onChange() {
        nextTick(() => {
          getList();
        });
      },
    },
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
    },
  });
  const lookDevice = (record) => {
    openDrawerRangeDevice(true, {
      taskId: data.record.taskId,
      customerId: record.customerId,
      deviceType: data.record.deviceType,
      version: data.record.version,
      rangeType: 3,
      deviceCount: record.deviceCount,
    });
  };
</script>

<style scoped></style>
