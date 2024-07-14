<template>
  <BasicModal v-bind="$attrs" @register="register" title="设置通知人" @ok="handleOk">
    当有客户待审核时，自动给以下邮件列表中收件人发送通知邮件。
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { ref } from 'vue';
  import { noticeMailsSet, noticeMailsGet } from '/@/api/admin/admin';
  import { useMessage } from '/@/hooks/web/useMessage';
  const schemas: FormSchema[] = [
    {
      required: true,
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('请输入邮箱');
            }
            let arr = value.split(',');
            let message = '';
            arr.forEach((item, index) => {
              if (
                !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  item,
                )
              ) {
                message = `第${index + 1}个邮箱格式错误！`;
              }
            });
            if (message) {
              return Promise.reject(message);
            }
          },
          trigger: 'blur',
        },
      ],
      field: 'mails',
      label: '',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请用英文逗号分割邮箱',
        rows: '8',
      },
      colProps: {
        span: 24,
      },
    },
  ];
  const { createMessage } = useMessage();
  const value = ref('');
  const [registerForm, { validate, setFieldsValue, clearValidate }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const [register, { closeModal }] = useModalInner(async () => {
    onDataReceive();
  });
  const onDataReceive = async () => {
    let res = await noticeMailsGet();
    if (res.code == 0) {
      await setFieldsValue({ mails: res.data });
      await clearValidate();
    } else {
      createMessage.error(res.message);
    }
  };
  const handleOk = async () => {
    const validateRes = await validate();
    let res = await noticeMailsSet(validateRes);
    if (res.code == 0) {
      value.value = res.data;
      closeModal();
      createMessage.success('设置成功！');
    } else {
      createMessage.error(res.message);
    }
  };
</script>
