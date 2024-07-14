<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <DeptTree ref="treeRef" class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <SysDeptTable
      ref="tableRef"
      class="w-3/4 xl:w-4/5"
      :nodeId="nodeId"
      @refresh-tree="handleRefreshTree"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';
  import SysDeptTable from './sysDeptTable/index.vue';

  const treeRef = ref();
  const tableRef = ref();
  const nodeId = ref();

  // 选中树节点事件
  function handleSelect(value) {
    // 子组件watch该属性，触发表格刷新
    nodeId.value = value;
  }

  // 表格变化，刷新树
  function handleRefreshTree(value) {
    // 刷新左侧树
    treeRef.value.refresh(value);
    // nodeId未改变，主动触发表格刷新
    if (value === nodeId.value) {
      tableRef.value.refresh();
    }
    // 子组件watch该属性，触发表格刷新
    nodeId.value = value;
  }
</script>
