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

  import { addObj, editObj, viewObj } from '/@/api/modules/system/sysUserApi';
  import { getConfigValue } from '/@/api/common';

  const emit = defineEmits(['success', 'register']);

  const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));
  const isUpdate = ref(false);
  const rowId = ref();

  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: dataFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
    baseColProps: { lg: 12, md: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    await updateSchema([
      {
        field: 'password',
        ifShow: !unref(isUpdate),
      },
    ]);

    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      const resData = await viewObj({ id: data.record.id });
      await setFieldsValue({
        ...resData,
      });
    } else {
      const sysInitPassword = await getConfigValue({ key: 'sys_init_password' });
      await setFieldsValue({
        password: sysInitPassword,
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
