<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="900px"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { dataFormSchema } from './data';

  import {
    addObj,
    editObj,
    viewObj,
    selectMenuTreeAndExcludeNode,
  } from '/@/api/modules/system/sysMenuApi';

  const emit = defineEmits(['success', 'register']);

  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));
  const isUpdate = ref(false);
  const rowId = ref();

  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: dataFormSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
    actionColOptions: {
      span: 23,
    },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    const treeData = await selectMenuTreeAndExcludeNode({ nodeId: data.record.id });
    await updateSchema([
      {
        field: 'parentId',
        componentProps: { treeData },
      },
    ]);

    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      const resData = await viewObj({ id: data.record.id });
      await setFieldsValue({
        ...resData,
        // 设置默认值
        parentId: resData.parentId === '0' ? null : resData.parentId,
        visible: !resData.visible ? '0' : resData.visible,
        keepalive: !resData.keepalive ? '0' : resData.keepalive,
        linkExternal: !resData.linkExternal ? '1' : resData.linkExternal,
        frame: !resData.frame ? '0' : resData.frame,
      });
    } else {
      await setFieldsValue({
        parentId: data.record.parentId,
      });
    }
  });

  // 提交按钮事件
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      !unref(isUpdate)
        ? await addObj({ ...values })
        : await editObj({ ...values, id: rowId.value });
      !unref(isUpdate) ? createMessage.success('新增成功！') : createMessage.success('编辑成功！');
      closeModal();
      emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
