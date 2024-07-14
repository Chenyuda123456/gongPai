<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :minHeight="0"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { resetPwd } from '/@/api/modules/system/sysUserApi';

  const getTitle = computed(() => '重置密码');
  const rowId = ref();

  const { createMessage, createConfirm } = useMessage();
  const [registerForm, { resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: [
      {
        field: 'password',
        label: '密码',
        component: 'Input',
        required: true,
        componentProps: {
          placeholder: '请输入密码',
        },
        colProps: { lg: 24, md: 24 },
      },
    ],
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
    baseColProps: { lg: 12, md: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    rowId.value = data.record.id;
  });

  // 提交按钮事件
  async function handleSubmit() {
    try {
      const values = await validate();
      createConfirm({
        iconType: 'warning',
        title: '提示',
        content: '确认重置密码？',
        onOk: async () => {
          setModalProps({ confirmLoading: true });
          await resetPwd({ ...values, id: rowId.value });
          createMessage.success('重置成功！');
          closeModal();
          emit('success', rowId.value);
        },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
