<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="新增设备"
    @cancel="handleCancel"
    @ok="handleOk"
    :minHeight="400"
  >
    <BasicForm @register="registerForm">
      <template #area="{ model, field }">
        <a-cascader v-model:value="model[field]" :show-search="{ filter }" :options="options" />
      </template>
    </BasicForm>
    <div v-if="data.errTipText" v-html="data.errTipText"></div>
  </BasicModal>
</template>
<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { deviceAdd } from '/@/api/admin/admin';
  import { deviceCustomers, deviceType } from '../../../../api/admin/admin';
  import { defineEmits, nextTick, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();
  const options = window.pcasCode;
  const filter = (inputValue, path) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };
  const schemas = [
    {
      field: `customerId`,
      label: `所属客户`,
      component: 'ApiSelect',
      colProps: {
        span: 24,
      },
      componentProps: {
        filterOption: (input, option) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        showSearch: true,
        api: deviceCustomers,
        resultField: 'data',
        labelField: 'companyName',
        valueField: 'id',
      },
    },
    {
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('请折行输入');
            }
            let index = [];
            let isStr = false;
            value.split('\n').forEach((item, i) => {
              if (!/^[a-zA-Z0-9]+$/.test(item) && item) {
                index.push(i + 1);
              }
              if (item) {
                isStr = true;
              }
            });
            if (index.length) {
              return Promise.reject('第' + index.join(',') + '行请输入英文字母、数字');
            } else if (!isStr) {
              return Promise.reject('请折行输入');
            }
          },
          trigger: 'blur',
        },
      ],
      field: `type`,
      label: `设备类型`,
      component: 'ApiSelect',
      colProps: {
        span: 24,
      },
      componentProps: {
        api: deviceType,
        resultField: 'data',
        labelField: 'name',
        valueField: 'type',
        onChange: () => {
          clearValidate('type');
        },
      },
    },
    {
      rules: [{ required: true }],
      field: 'snCodeListText',
      label: '设备SN码',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请折行输入',
      },
      colProps: {
        span: 24,
      },
    },
  ];
  const data = reactive({
    errTipText: '',
    againSub: false,
  });
  const [registerForm, { validate, resetFields, clearValidate }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const [register, { closeModal, setModalProps, changeOkLoading }] = useModalInner((data) => {
    data.errTipText = '';
    data.againSub = false;
    resetFields();
    setModalProps({ okText: '保存' });
  });

  const handleOk = async () => {
    const validateRes = await validate();
    validateRes.snCodeList = validateRes.snCodeListText.split('\n').filter((item) => {
      return item;
    });
    let res = '';
    changeOkLoading(true);
    if (data.againSub) {
      res = await deviceAdd({ ...validateRes, cover: true });
    } else {
      res = await deviceAdd({ ...validateRes, cover: false });
    }
    changeOkLoading(false);
    if (res.code == 0) {
      handleCancel();
      closeModal();
      createMessage.success('新增设备成功！');
      emit('reload');
    } else {
      createMessage.error(res.message);
      data.errTipText = res.message;
      data.againSub = res.message.includes('请确认是否保存');
      if (data.againSub) {
        setModalProps({ okText: '确认保存' });
      }
    }
  };
  const handleCancel = () => {
    console.log('handleCancel');
    data.errTipText = null;
    data.againSub = false;
  };
</script>
