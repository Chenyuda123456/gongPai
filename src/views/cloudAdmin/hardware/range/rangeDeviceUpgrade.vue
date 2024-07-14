<template>
  <BasicDrawer v-bind="$attrs" @register="register" :isDetail="true" :title="props.title + '升级'">
    <div class="p-16px">
      <BasicTable
        :data-source="data.result"
        @register="registerTable"
        :title="`设备类型：${data.record.deviceType} | ${
          $route.path.includes('admin-hardware/hardwareList')
            ? '升级版本：' + data.record.version + '|'
            : ''
        } 升级范围：按${props.title}，以下为要升级的设备列表（合计 ${
          data.record.deviceCount || data.record.deviceCount || data.statistic.deviceNum
        } 台设备）`"
      />
    </div>
    <rangeDeviceUpgrade @reload="getList" @register="registerDrawerRangeDevice" />
  </BasicDrawer>
</template>
<script setup lang="ts">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicDrawer, useDrawer, useDrawerInner } from '/@/components/Drawer';
  import rangeDeviceUpgrade from '/@/views/cloudAdmin/hardware/range/rangeDeviceUpgrade.vue';
  import { deviceColumn } from './schemas.ts';
  import { rangeDevicePage, rangeStatistics } from '/@/api/admin/admin';
  import { nextTick, reactive } from 'vue';
  const [registerDrawerRangeDevice, { openDrawer: openDrawerRangeDevice }] = useDrawer();
  const props = defineProps({
    title: String,
  });
  const data = reactive({
    result: [],
    statistic: {},
    record: {},
    rangeType: 1,
    taskId: '',
  });
  const [registerTable, { getForm, getPaginationRef, setPagination }] = useTable({
    columns: deviceColumn,
    clickToRowSelect: false,
    autoCreateKey: true,
    pagination: {
      onChange() {
        nextTick(() => {
          getList();
        });
      },
    },
  });
  const [register] = useDrawerInner(async (option) => {
    data.record = option;
    const rangeStatisticsRes = await rangeStatistics(data.record);
    data.statistic = rangeStatisticsRes.data;
    getList();
  });
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    console.log(getPaginationRef()['current']);
    let res = await rangeDevicePage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      ...data.record,
      ...formData,
    });
    if (res.code == 0) {
      res.data.list.forEach((item) => {
        item.version = data.record.version;
      });
      data.result = res.data.list;

      setPagination({
        total: res.data.total,
      });
    }
  };
</script>

<style scoped></style>
