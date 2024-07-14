<template>
  <BasicModal v-bind="$attrs" @register="register" title="编辑" @ok="handleOk">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { noticeInfo } from '/@/api/manage/manage';
  import { defineEmits } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const emit = defineEmits(['reload', 'register']);

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
      field: 'noticeEmails',
      label: '邮箱',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请用英文逗号分割邮箱',
      },
      colProps: {
        span: 24,
      },
    },
    {
      field: 'noticePhones',
      label: '手机号',
      component: 'InputTextArea',
      colProps: {
        span: 24,
      },
    },
  ];
  const [registerForm, { validate, setFieldsValue, clearValidate }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const [register, { closeModal }] = useModalInner(async (res) => {
    await setFieldsValue(res.baseInfo);
    await clearValidate();
  });

  const handleOk = async () => {
    const validateRes = await validate();
    let res = await noticeInfo(validateRes);
    if (res.code == 0) {
      closeModal();
      createMessage.success(res.message);
      emit('reload');
    } else {
      console.log(res);
      createMessage.error(res.message);
    }
  };
</script>
