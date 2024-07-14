<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'logStatus'">
          <Tag :color="record.logStatus === '0' ? 'processing' : 'error'">
            {{ formatDictValue(sysLogStatusOptions, record.logStatus) }}
          </Tag>
        </template>
        <template v-if="column.key === 'userPlatform'">
          <Tag :color="record.userPlatform === 'WEB' ? 'processing' : 'error'">
            {{ formatDictValue(sysUerPlatformOptions, record.userPlatform) }}
          </Tag>
        </template>
        <template v-if="column.key === 'requsetTime'">
          {{ record.requsetTime && record?.requsetTime + 'ms' }}
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                auth: 'system:sysLog:view',
                icon: 'ant-design:eye-twotone',
                tooltip: '查看',
                onClick: handleView.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DescDrawer @register="registerDrawerDesc" />
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import DescDrawer from './DescDrawer.vue';
  import { columns, searchFormSchema } from './data';

  import { fetchList } from '/@/api/modules/system/sysLogApi';
  import { listDictModel } from '/@/api/common';
  import { formatDictValue } from '/@/utils';

  const sysLogStatusOptions = ref([]);
  const sysUerPlatformOptions = ref([]);
  onBeforeMount(async () => {
    sysLogStatusOptions.value = await listDictModel({ dictCode: 'sys_log_status' });
    sysUerPlatformOptions.value = await listDictModel({ dictCode: 'sys_user_platform' });
  });

  const [registerTable] = useTable({
    title: '操作日志列表',
    api: fetchList,
    rowKey: 'id',
    columns,
    formConfig: {
      baseColProps: { sm: 24, lg: 6 },
      labelWidth: 90,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      resetButtonOptions: {
        preIcon: 'ant-design:delete-outlined',
      },
      submitButtonOptions: {
        preIcon: 'ant-design:search-outlined',
      },
    },
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      auth: ['system:sysLog:view'],
      width: 50,
      title: '操作',
      dataIndex: 'action',
    },
  });
  const [registerDrawerDesc, { openDrawer: openDrawerDesc }] = useDrawer();

  // 详情按钮事件
  function handleView(record: Recordable) {
    console.log(record);
    openDrawerDesc(true, {
      record,
    });
  }
</script>
