<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #deptIds>
        <BasicTree
          :checkedKeys="checkedKeys"
          :treeData="treeData"
          checkable
          @check="handleCheck"
          title="选择部门"
          :fieldNames="{ key: 'id', title: 'name' }"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, onBeforeMount } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTree } from '/@/components/Tree';
  import { dataFormSchema } from './data';

  import { addObj, editObj, listRoleDepts } from '/@/api/modules/system/sysRoleApi';
  import { listDeptTree } from '/@/api/modules/system/sysDeptApi';

  const emit = defineEmits(['success', 'register']);

  const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));
  const isUpdate = ref(false);
  const rowId = ref();
  const treeData = ref([]);
  const checkedKeys = ref([]);
  const halfCheckedKeys = ref([]);
  const parentIds = ref(new Set());
  const treeCheck = ref(false);
  onBeforeMount(() => {
    getTreeData();
  });

  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: dataFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
    baseColProps: { span: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    // TODO，待优化
    if (unref(isUpdate)) {
      rowId.value = data.record.id;

      const roleDeptList = (await listRoleDepts({ roleId: rowId.value })) as any;
      // 找出菜单的所有父节点ID
      parentIds.value = new Set(
        roleDeptList.filter((item) => item.parentId !== '0').map((item) => item.parentId),
      );
      console.log(parentIds.value);
      // 因为antd树插件勾选父节点会导致所有子节点选中,所以过滤所有父节点
      checkedKeys.value = roleDeptList
        .filter((item) => !parentIds.value.has(item.id))
        .map((item) => item.id);
      await setFieldsValue({
        ...data.record,
      });
    }
  });

  // 提交按钮事件
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      // 如果没有check过，半选节点是拿不到的，只能通过预先设置的pidSet获取
      const deptIds = unref(treeCheck)
        ? [...checkedKeys.value, ...halfCheckedKeys.value]
        : [...checkedKeys.value, ...Array.from(parentIds.value)];
      !unref(isUpdate)
        ? await addObj({ ...values, deptIds })
        : await editObj({ ...values, id: rowId.value, deptIds });
      !unref(isUpdate) ? createMessage.success('新增成功！') : createMessage.success('编辑成功！');
      closeModal();
      emit('success', {
        isUpdate: unref(isUpdate),
        values: { ...values, id: rowId.value, deptIds },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  // 树节点选中事件
  function handleCheck(keys, e) {
    console.log('onChecked', keys, e);
    if (!unref(treeCheck)) {
      treeCheck.value = true;
    }
    checkedKeys.value = keys;
    halfCheckedKeys.value = e.halfCheckedKeys;
  }

  // 查询树数据
  async function getTreeData() {
    treeData.value = await listDeptTree();
  }
</script>
