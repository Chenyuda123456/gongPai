<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="data.shopId ? '编辑门店' : '新增门店'"
    @ok="handleOk"
  >
    <BasicForm @register="registerForm">
      <template #area="{ model, field }">
        <a-cascader
          @change="cascaderChange"
          v-model:value="model[field]"
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
  import { shopsParent, shopsEdit, shopsAdd } from '/@/api/manage/manage';
  import { defineEmits, nextTick, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const options = window.pcasCode;
  const emit = defineEmits(['reload', 'register']);
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
        api: shopsParent,
        params: {
          customerId: '',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
      },
    },
    {
      field: 'name',
      label: '门店名称',
      componentProps: {
        maxlength: 30,
      },
      required: true,
      component: 'Input',
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
  const [registerForm, { validate, resetFields, setFieldsValue, updateSchema }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const data = reactive({
    shopId: '',
    title: '',
    district: '',
  });
  const [register, { closeModal }] = useModalInner((res) => {
    updateSchema({
      field: 'parentShopId',
      componentProps: {
        params: {
          time: new Date(),
        },
      },
    });
    nextTick(() => {
      resetFields();
      if (res.record) {
        data.shopId = res.record.id;
        setFieldsValue(res.record);
      } else {
        data.shopId = '';
      }
    });
  });
  const cascaderChange = (val, val2) => {
    let arr: string[] = [];
    val2.forEach((item) => {
      arr.push(item.label);
    });
    data.district = arr.join('-');
    console.log(data.district);
  };
  const handleOk = async () => {
    const validateRes = await validate();
    let res: any = '';
    let parameter = { ...validateRes, ...data };
    if (data.shopId) {
      res = await shopsEdit(parameter);
    } else {
      res = await shopsAdd(parameter);
    }
    if (res.code == 0) {
      closeModal();
      if (data.shopId) {
        createMessage.success('编辑成功！');
      } else {
        createMessage.success('新增成功！');
      }
      emit('reload', parameter.name);
    } else {
      console.log(res);
      createMessage.error(res.message);
    }
  };
</script>
