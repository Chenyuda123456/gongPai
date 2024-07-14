<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      ref="treeRef"
      title="区域列表"
      toolbar
      search
      :treeData="treeData"
      :clickRowToExpand="false"
      :fieldNames="{ key: 'id', title: 'name' }"
      showIcon
      :renderIcon="createIcon"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { BasicTree } from '/@/components/Tree';
  import { listAreaTree } from '/@/api/modules/system/sysAreaApi';

  const emit = defineEmits(['select']);

  const treeData = ref([]);
  onBeforeMount(() => {
    getTreeData();
  });

  // 查询树数据
  async function getTreeData() {
    treeData.value = await listAreaTree();
  }

  // 格式化图标
  function createIcon() {
    return 'ant-design:environment-outlined';
  }

  // 选中树节点事件
  function handleSelect(keys: string, e) {
    console.log(keys, e);
    emit('select', keys[0]);
  }
</script>
