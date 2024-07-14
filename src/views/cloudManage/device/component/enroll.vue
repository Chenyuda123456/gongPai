<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="登记使用者"
    width="500px"
    showFooter
    @ok="handleOk"
  >
    <BasicForm @register="registerForm">
      <template #add>
        <div class="flex items-center">
          <a class="ml-[16px]" @click="addShopFn">新增</a>
        </div>
      </template>
    </BasicForm>
    <addShop @reload="reload" @register="registerModal" />
  </BasicDrawer>
</template>
<script setup lang="ts">
  import addShop from '../../userManage/component/addShop.vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { useModal } from '/@/components/Modal';
  import { customerShops, deviceRegister, checkRegister } from '/@/api/manage/manage';
  import { defineEmits, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage, createConfirm } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const emit = defineEmits(['reload', 'register']);
  const schemas: FormSchema[] = [
    {
      required: true,
      field: 'snCode',
      label: '设备SN',
      component: 'Input',
      colProps: {
        span: 24,
      },
      componentProps: {
        disabled: true,
      },
    },
    {
      required: true,
      field: `shopId`,
      label: `所属门店`,
      component: 'ApiSelect',
      colProps: {
        span: 21,
      },
      componentProps: {
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        showSearch: true,
        api: customerShops,
        params: {
          customerId: '',
        },
        resultField: 'data.list',
        labelField: 'name',
        valueField: 'id',
        style: {
          width: '300px',
        },
      },
    },
    {
      field: `''`,
      label: ``,
      component: 'Input',
      colProps: {
        span: 3,
      },
      slot: 'add',
    },
    {
      field: 'userName',
      label: '使用者',
      component: 'Input',
      colProps: {
        span: 24,
      },
    },
  ];
  const [registerForm, { validate, updateSchema, setFieldsValue, resetFields }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const data = reactive({
    id: '',
    customerId: '',
    category: '',
    customerShopList: [],
  });
  const [register, { closeDrawer }] = useDrawerInner((res) => {
    console.log(res);
    data.id = res.record.id;
    data.category = res.record.category;
    data.customerId = res.record.customerId;
    resetFields();
    setFieldsValue(res.record);
    if (res.record.type.includes('H')) {
      updateSchema([
        {
          field: 'userName',
          required: false,
        },
      ]);
    } else {
      updateSchema([
        {
          field: 'userName',
          required: true,
        },
      ]);
    }
  });
  // 新增门店
  const addShopFn = () => {
    openModal(true, {});
  };
  const customerShopsGet = async (name) => {
    let res = await customerShops({});
    data.customerShopList = res.data.list;
    setFieldsValue({ shopId: data.customerShopList.find((item) => item.name == name).id });
  };
  const reload = (name) => {
    updateSchema([
      {
        field: 'shopId',
        componentProps: {
          params: {
            time: new Date(),
          },
        },
      },
    ]);
    customerShopsGet(name);
  };
  const handleOk = async () => {
    const validateData = await validate();
    const bindRes = await checkRegister({ ...validateData, id: data.id, category: data.category });
    if (bindRes.code == 0) {
      if (bindRes.data) {
        createConfirm({
          mask: true,
          iconType: 'warning',
          style: 'top:-260px',
          title: bindRes.data + '已绑定用户，确认绑定当前用户？',
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            const res = await deviceRegister({ ...validateData, id: data.id });
            if (res.code == 0) {
              closeDrawer();
              createMessage.success(res.message);
              emit('reload');
            } else {
              createMessage.error(res.message);
            }
          },
        });
      } else {
        const res = await deviceRegister({ ...validateData, id: data.id });
        if (res.code == 0) {
          closeDrawer();
          createMessage.success(res.message);
          emit('reload');
        } else {
          createMessage.error(res.message);
        }
      }
    } else {
      createMessage.error(bindRes.message);
    }
  };
</script>
