<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <AreaTree ref="treeRef" class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <SysAreaTable ref="tableRef" class="w-3/4 xl:w-4/5" :nodeId="nodeId" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import AreaTree from './AreaTree.vue';
  import SysAreaTable from './sysAreaTable/index.vue';

  const nodeId = ref();

  // 选中树节点事件
  function handleSelect(value) {
    nodeId.value = value;
  }
</script>
