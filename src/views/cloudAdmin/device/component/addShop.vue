<template>
  <BasicModal v-bind="$attrs" @register="register" title="新增门店" @ok="handleOk">
    <BasicForm @register="registerForm">
      <template #area="{ model, field }">
        <a-cascader
          v-model:value="model[field]"
          @change="cascaderChange"
          :show-search="{ filter }"
          :options="options"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { deviceShops, deviceShop } from '/@/api/admin/admin';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineEmits, reactive } from 'vue';
  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();
  const options = window.pcasCode;
  const filter = (inputValue, path) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };
  const schemas: FormSchema[] = [
    {
      field: `parentShopId`,
      label: `上一级`,
      component: 'ApiSelect',
      colProps: {
        span: 24,
      },
      componentProps: {
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        showSearch: true,
        api: deviceShops,
        params: {
          customerId: '',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        style: {},
      },
    },
    {
      field: 'name',
      label: '门店名称',
      required: true,
      component: 'Input',
      componentProps: {
        maxlength: 30,
      },
      colProps: {
        span: 24,
      },
    },
    {
      field: 'district',
      label: '所属区域',
      component: 'Input',
      slot: 'area',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'note',
      label: '备注',
      component: 'InputTextArea',
      componentProps: {
        maxlength: 200,
      },
      colProps: {
        span: 24,
      },
    },
  ];
  const data = reactive({
    district: '',
    customerId: '',
  });
  const [registerForm, { validate, updateSchema, resetFields }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const [register, { closeModal }] = useModalInner((res) => {
    resetFields();
    data.customerId = res.customerId;
    updateSchema([
      {
        field: 'parentShopId',
        componentProps: {
          params: {
            customerId: res.customerId,
          },
        },
      },
    ]);
  });

  const cascaderChange = (val, val2) => {
    let arr: string[] = [];
    val2.forEach((item) => {
      arr.push(item.label);
    });
    data.district = arr.join('-');
  };
  const handleOk = async () => {
    const validateRes = await validate();
    console.log(validateRes);
    console.log(data);
    let parameter = { ...validateRes, ...data };
    let res = await deviceShop(parameter);
    if (res.code == 0) {
      closeModal();
      createMessage.success(res.message);
      emit('reload', parameter.name);
    } else {
      console.log(res);
      createMessage.error(res.message);
    }
  };
</script>
