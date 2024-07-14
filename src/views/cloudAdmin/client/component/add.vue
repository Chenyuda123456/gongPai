<template>
  <BasicModal v-bind="$attrs" @register="register" :title="data.title + '客户'" @ok="handleOk">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import {
    accountCheck,
    customerAdd,
    customerEdit,
    detectionList,
    businessManagers,
    customerBind,
  } from '/@/api/admin/admin';
  import { reactive, defineEmits } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { daRole, deployType, yunRole, platformsCheckBox } from '/@/views/cloudAdmin/code';
  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();
  const data = reactive({
    title: '',
    id: '',
    detectionList: [],
  });
  const schemas: FormSchema[] = [
    {
      field: 'companyName',
      label: '客户名称',
      component: 'Input',
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('请输入客户名称');
            }
            if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/g.test(value)) {
              return Promise.reject('请输入汉字、英文字母、数字符号');
            }
          },
          trigger: 'blur',
        },
      ],
      colProps: {
        span: 24,
      },
      componentProps: {
        maxlength: 50,
      },
    },
    {
      field: 'contactName',
      label: '联系人',
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('请输入联系人');
            }
            if (!/^[a-zA-Z\u4e00-\u9fa5]+$/g.test(value)) {
              return Promise.reject('请输入汉字、英文字母');
            }
          },
          trigger: 'blur',
        },
      ],
      component: 'Input',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'contactPhone',
      label: '手机号',
      rules: [
        {
          required: true,
          // @ts-ignore
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('请输入手机号');
            }
            if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
              return Promise.reject('手机号码有误，请重填');
            }
          },
          trigger: 'blur',
        },
      ],
      component: 'Input',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'deployType',
      label: '使用方式',
      required: true,
      component: 'RadioGroup',
      colProps: {
        span: 24,
      },
      defaultValue: 1,
      componentProps: {
        options: deployType,
      },
    },
    {
      field: 'businessManager',
      label: '所属商务',
      component: 'ApiSelect',
      colProps: {
        span: 24,
      },
      componentProps: {
        api: businessManagers,
        resultField: 'data',
        labelField: 'name',
        valueField: 'name',
      },
    },
    {
      field: 'note',
      label: '备注',
      component: 'InputTextArea',
      colProps: {
        span: 24,
      },
      componentProps: {
        maxlength: 200,
      },
    },
    {
      field: 'account',
      label: '绑定登录账号',
      rules: [
        {
          required: true,
          // @ts-ignore
          validator: async (_, value) => {
            const deployType = getFieldsValue().deployType;
            if (deployType == 2) {
              if (!value) {
                return Promise.reject('请输入绑定登录账号');
              } else {
                return true;
              }
              return true;
            } else {
              let result = await accountCheck({ account: value, customerId: data.id });
              console.log(result);
              if (result.data !== true) {
                return Promise.reject('该账号尚未注册，请先注册后再绑定。');
              }
            }
          },
          trigger: 'change',
        },
      ],
      component: 'Input',
      colProps: {
        span: 24,
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
      ifShow: ({ values }) => {
        return values?.openPlatforms?.includes(1);
      },
      defaultValue: 0,
      componentProps: {
        options: yunRole,
      },
    },
    {
      field: 'cid',
      label: '统一质检账号',
      rules: [
        {
          required: true,
          // @ts-ignore
          validator: async (_, value) => {
            const deployType = getFieldsValue().deployType;
            if (deployType == 2) {
              if (!value) {
                return Promise.reject('请选择质检账号！');
              } else {
                return true;
              }
              return true;
            } else {
              let result = await customerBind({ cid: value, customerId: data.id });
              console.log(result);
              if (result.data == true) {
                return Promise.reject('该账号已绑定！');
              }
            }
          },
          trigger: 'blur',
        },
      ],
      component: 'Select',
      colProps: {
        span: 24,
      },
      ifShow: ({ values }) => {
        return values?.openPlatforms?.includes(2);
      },
      componentProps: {
        options: [],
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
      },
    },
  ];
  const [registerForm, { validate, resetFields, setFieldsValue, updateSchema, getFieldsValue }] =
    useForm({
      labelWidth: 100,
      schemas,
      showActionButtonGroup: false,
      actionColOptions: {
        span: 24,
      },
    });

  const [register, { closeModal, changeOkLoading }] = useModalInner(async (option) => {
    resetFields();
    data.title = option.title;
    data.id = option.id;
    const res = await detectionList({});
    // 质检list
    data.detectionList = res.data.map((item) => {
      return {
        ...item,
        label: item.detectionName + '(' + item.detectionAccount + ')',
        value: item.cid,
      };
    });
    console.log(data.detectionList);

    if (option?.record?.openPlatform == 1) {
      option.record.openPlatforms = [1];
    }
    if (option?.record?.openPlatform == 2) {
      option.record.openPlatforms = [2];
    }
    if (option?.record?.openPlatform == 3) {
      option.record.openPlatforms = [1, 2];
    }
    if (option.record) {
      setFieldsValue(option.record);
    } else {
    }

    if (data.title == '审核') {
      updateSchema([
        {
          field: `companyName`,
          componentProps: {
            disabled: true,
          },
        },
        {
          field: `contactName`,
          componentProps: {
            disabled: true,
          },
        },
        {
          field: `contactPhone`,
          componentProps: {
            disabled: true,
          },
        },
        {
          field: 'deployType',
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
          field: `businessManager`,
          componentProps: {
            disabled: true,
          },
        },
        {
          field: `note`,
          componentProps: {
            disabled: true,
          },
        },
        {
          field: `account`,
          componentProps: {
            disabled: true,
          },
        },
        {
          field: `cid`,
          componentProps: {
            options: data.detectionList,
          },
        },
      ]);
    } else {
      updateSchema([
        {
          field: `companyName`,
          componentProps: {
            disabled: false,
          },
        },
        {
          field: `contactName`,
          componentProps: {
            disabled: false,
          },
        },
        {
          field: `contactPhone`,
          componentProps: {
            disabled: false,
          },
        },
        {
          field: `businessManager`,
          componentProps: {
            disabled: false,
          },
        },
        {
          field: `note`,
          componentProps: {
            disabled: false,
          },
        },
        {
          field: `account`,
          componentProps: {
            disabled: false,
          },
        },
        {
          field: `cid`,
          componentProps: {
            options: data.detectionList,
          },
        },
      ]);
    }
  });

  const handleOk = async () => {
    let validateRes = await validate();
    changeOkLoading(true);
    let res;
    let findRes;
    if (validateRes.openPlatforms.includes(2)) {
      findRes = data.detectionList.find((item) => {
        return item.cid == validateRes.cid;
      });
    }
    validateRes = { ...validateRes, ...findRes };
    if (data.title == '新增') {
      res = await customerAdd(validateRes);
    } else if (data.title == '编辑') {
      res = await customerEdit({
        customerId: data.id,
        ...validateRes,
      });
    } else {
      res = await customerEdit({
        customerId: data.id,
        ...validateRes,
      });
    }
    changeOkLoading(false);
    if (res.code == 0) {
      closeModal();
      if (data.title == '新增') {
        createMessage.success('新增成功！');
      } else if (data.title == '编辑') {
        createMessage.success('编辑成功！');
      } else {
        createMessage.success('审核成功！');
      }

      emit('reload');
    } else {
      createMessage.error(res.message);
    }
  };
</script>
