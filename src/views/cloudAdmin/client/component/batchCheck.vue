<template>
  <BasicModal v-bind="$attrs" @register="register" title="批量审核" @ok="handleOk">
    <div style="text-indent: 30px" class="mt-10px"
      >审核通过后，已选择的客户则直接开通以下选择的权限</div
    >
    <BasicForm class="mt-[16px]" @register="registerForm" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { customerAudit } from '/@/api/admin/admin';
  import { defineEmits, reactive } from 'vue';
  import { daRole, deployType, platformsCheckBox, yunRole } from '/@/views/cloudAdmin/code';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();
  const schemas: FormSchema[] = [
    {
      field: 'deployType',
      label: '使用方式',
      required: true,
      component: 'RadioGroup',
      defaultValue: 1,
      colProps: {
        span: 24,
      },
      componentProps: {
        options: [
          {
            label: '公有云',
            value: 1,
          },
        ],
      },
    },
    {
      field: 'openPlatforms',
      label: '开通平台',
      required: true,
      component: 'CheckboxGroup',
      colProps: {
        span: 24,
      },
      componentProps: {
        options: platformsCheckBox,
      },
    },
    {
      field: 'yunRole',
      label: '云管角色',
      component: 'Select',
      colProps: {
        span: 24,
      },
      componentProps: {
        options: yunRole,
      },
    },
    {
      field: 'daRole',
      label: '统一质检角色',
      component: 'Select',
      colProps: {
        span: 24,
      },
      componentProps: {
        options: daRole,
      },
    },
  ];
  const [registerForm, { validate }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const data = reactive({
    checkedKeys: [],
  });
  const [register, { changeOkLoading, closeModal }] = useModalInner((option) => {
    data.checkedKeys = option.checkedKeys;
  });

  const handleOk = async () => {
    const validateRes = await validate();
    changeOkLoading(true);
    let res = await customerAudit({ ...validateRes, customerIds: data.checkedKeys });
    changeOkLoading(false);
    if (res.code == 0) {
      closeModal();
      createMessage.success('批量审核成功！');
      emit('reload');
    } else {
      createMessage.error(res.message);
    }
  };
</script>
