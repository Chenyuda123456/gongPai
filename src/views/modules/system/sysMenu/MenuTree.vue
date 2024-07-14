<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      ref="treeRef"
      title="菜单列表"
      toolbar
      search
      :treeData="treeData"
      :clickRowToExpand="false"
      :fieldNames="{ key: 'id', title: 'name' }"
      showIcon
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { BasicTree } from '/@/components/Tree';

  import { listMenuTree } from '/@/api/modules/system/sysMenuApi';
  import { getAllParentKeys } from '/@/utils';

  const emit = defineEmits(['select']);

  const treeData = ref([]);
  const treeRef = ref();
  onBeforeMount(() => {
    getTreeData();
  });

  // 查询树数据
  async function getTreeData() {
    treeData.value = await listMenuTree();
  }

  // 选中树节点事件
  function handleSelect(keys: string, e) {
    console.log(keys, e);
    emit('select', keys[0]);
  }

  // 刷新树，并选中节点
  async function refresh(nodeId) {
    await getTreeData();
    // 选中nodeId
    const keys = !nodeId ? [] : [nodeId];
    treeRef.value.setSelectedKeys(keys);
    const parentIds = getAllParentKeys(treeData.value, nodeId);
    treeRef.value.setExpandedKeys(!nodeId ? [] : [...parentIds, nodeId]);
  }

  // 暴露内部方法
  defineExpose({ refresh });
</script>
