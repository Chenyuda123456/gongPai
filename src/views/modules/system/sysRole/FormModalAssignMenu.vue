<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    title="分配菜单"
    @ok="handleSubmit"
  >
    <BasicTree
      :checkedKeys="checkedKeys"
      :treeData="treeData"
      checkable
      @check="handleCheck"
      :fieldNames="{ key: 'id', title: 'name' }"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTree } from '/@/components/Tree';

  import { selectMenuTree } from '/@/api/modules/system/sysMenuApi';
  import { assignMenu, listRoleMenus } from '/@/api/modules/system/sysRoleApi';

  const emit = defineEmits(['success', 'register']);

  const treeData = ref([]);
  const rowId = ref();
  const checkedKeys = ref([]);
  const halfCheckedKeys = ref([]);
  const parentIds = ref(new Set());
  const treeCheck = ref(false);
  onBeforeMount(() => {
    getTreeData();
  });

  const { createMessage, createConfirm } = useMessage();
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    rowId.value = data.record.id;

    // TODO，待优化
    const roleMenuList = (await listRoleMenus({ roleId: rowId.value })) as any;
    // 找出菜单的所有父节点ID
    parentIds.value = new Set(
      roleMenuList.filter((item) => item.parentId !== '0').map((item) => item.parentId),
    );
    console.log(parentIds.value);
    // 因为antd树插件勾选父节点会导致所有子节点选中,所以过滤所有父节点
    checkedKeys.value = roleMenuList
      .filter((item) => !parentIds.value.has(item.id))
      .map((item) => item.id);
    console.log(checkedKeys.value);
  });

  // 树节点选中事件
  function handleCheck(keys, e) {
    console.log('onChecked', keys, e);
    if (!unref(treeCheck)) {
      treeCheck.value = true;
    }
    checkedKeys.value = keys;
    halfCheckedKeys.value = e.halfCheckedKeys;
  }

  // 提交按钮事件
  async function handleSubmit() {
    try {
      createConfirm({
        iconType: 'warning',
        title: '提示',
        content: '确认分配菜单？',
        onOk: async () => {
          setModalProps({ confirmLoading: true });
          // 如果没有check过，半选节点是拿不到的，只能通过预先设置的pidSet获取
          const menuIds = unref(treeCheck)
            ? [...checkedKeys.value, ...halfCheckedKeys.value]
            : [...checkedKeys.value, ...Array.from(parentIds.value)];
          console.log(menuIds);
          await assignMenu({
            menuIds: menuIds,
            roleId: rowId.value,
          });
          createMessage.success('分配成功！');
          closeModal();
          emit('success', rowId.value);
        },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  // 查询树数据
  async function getTreeData() {
    treeData.value = await selectMenuTree();
  }
</script>
