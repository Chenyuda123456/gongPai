<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'areaType'">
          <Tag color="processing">
            {{ formatDictValue(sysAreaTypeOptions, record.areaType) }}
          </Tag>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, onBeforeMount, ref, watch } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './data';

  import { fetchList } from '/@/api/modules/system/sysAreaApi';
  import { listDictModel } from '/@/api/common';
  import { formatDictValue } from '/@/utils';

  const props = defineProps({
    nodeId: { type: String },
  });

  const sysAreaTypeOptions = ref([]);
  onBeforeMount(async () => {
    sysAreaTypeOptions.value = await listDictModel({ dictCode: 'sys_area_type' });
  });

  const [registerTable, { reload }] = useTable({
    title: '行政区域列表',
    api: fetchList,
    rowKey: 'areaCode',
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
    beforeFetch: handleBeforeFetch,
  });

  // 表格请求之前，对参数进行处理
  function handleBeforeFetch(params) {
    return { ...params, parentCode: !props.nodeId ? '0' : props.nodeId };
  }

  watch(
    () => props.nodeId,
    () => {
      nextTick(() => {
        reload();
      });
    },
  );
</script>
