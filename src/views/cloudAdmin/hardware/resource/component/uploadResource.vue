<template>
  <BasicModal v-bind="$attrs" @register="register" title="上传资源" @ok="handleOk" :width="600">
    <BasicForm @register="registerForm">
      <template #fileUrl>
        <a-space :size="16">
          <a-upload
            name="multipartFile"
            :file-list="form.fileList"
            :before-upload="beforeUpload"
            @remove="handleRemove"
            @change="handleChange"
            accept=".zip"
            :headers="{
              Authorization: pageData.token,
            }"
            :action="pageData.action"
          >
            <a-button type="primary">上传</a-button>
          </a-upload>
        </a-space>
      </template>
    </BasicForm>
    <Loading :loading="pageData.loading" tip="文件上传中，请勿关闭页面！" />
  </BasicModal>
</template>
<script setup>
  import { Loading } from '/@/components/Loading';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { defineEmits, onMounted, reactive } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { deviceType, resourceCreate } from '/@/api/admin/admin';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { resourceType } from '/@/views/cloudAdmin/code';
  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();
  const globSetting = useGlobSetting();
  import { useUserStoreWithOut } from '/@/store/modules/user';
  const userStore = useUserStoreWithOut();
  console.log(userStore.getToken);
  const pageData = reactive({
    action: `${
      globSetting.apiUrl ? globSetting.apiUrl : window.location.origin + ''
    }/admin/ota/resource/upload`,
    loading: false,
    deviceTypeList: [],
    token: userStore.getToken,
  });
  const uploadForm = [
    {
      field: 'resourceType',
      label: '升级类型',
      component: 'RadioGroup',
      required: true,
      colProps: {
        span: 24,
      },
      defaultValue: 0,
      componentProps: {
        options: resourceType,
      },
    },
    {
      field: `deviceType`,
      label: `设备类型`,
      required: true,
      component: 'ApiSelect',
      colProps: {
        span: 24,
      },
      componentProps: {
        api: deviceType,
        resultField: 'data',
        labelField: 'name',
        valueField: 'type',
        onChange: (val) => {
          if (getFieldsValue().resourceType == 1) {
            console.log(val);
            let res = pageData.deviceTypeList.find((item) => {
              return item.type == val;
            });
            setFieldsValue({
              fileName: res.configName,
            });
          }
          clearValidate('deviceType');
        },
      },
    },
    {
      field: 'fileName',
      label: '固件名称',
      component: 'Input',
      ifShow: ({ values }) => {
        return values.resourceType == 0;
      },
      required: true,
      colProps: {
        span: 24,
      },
    },
    {
      field: 'fileName',
      label: '文件名称',
      component: 'Input',
      ifShow: ({ values }) => {
        return values.resourceType == 1;
      },
      componentProps: {
        // disabled: true,
      },
      required: true,
      colProps: {
        span: 24,
      },
    },
    {
      field: 'fileUrl',
      label: '上传固件',
      component: 'Select',
      slot: 'fileUrl',
      ifShow: ({ values }) => {
        return values.resourceType == 0;
      },
      required: true,
      colProps: {
        span: 24,
      },
    },
    {
      field: 'version',
      label: '版本号',
      component: 'Input',
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('请输入版本号');
            }
            if (/[^a-zA-Z\d.]/g.test(value)) {
              return Promise.reject('请输入数字英文或者小数点');
            }
          },
          trigger: 'blur',
        },
      ],
      ifShow: ({ values }) => {
        return values.resourceType == 0;
      },
      colProps: {
        span: 24,
      },
    },
    {
      field: 'configContent',
      label: '配置单',
      component: 'InputTextArea',
      ifShow: ({ values }) => {
        return values.resourceType == 1;
      },
      componentProps: {},
      required: true,
      colProps: {
        span: 24,
      },
    },
    {
      field: 'updateDesc',
      label: '更新说明',
      component: 'InputTextArea',
      required: true,
      colProps: {
        span: 24,
      },
      componentProps: {
        maxlength: 200,
      },
    },
    {
      field: 'remark',
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
  const [registerForm, { validate, setFieldsValue, clearValidate, resetFields, getFieldsValue }] =
    useForm({
      labelWidth: 100,
      schemas: uploadForm,
      showActionButtonGroup: false,
      actionColOptions: {
        span: 24,
      },
    });
  const form = reactive({
    fileList: [],
  });
  const [register, { closeModal }] = useModalInner(() => {
    resetFields();
    form.fileList = [];
    pageData.loading = false;
  });
  const handleRemove = (file) => {
    const index = form.fileList.indexOf(file);
    const newFileList = form.fileList.slice();
    newFileList.splice(index, 1);
    form.fileList = newFileList;
    setFieldsValue({ fileUrl: null });
  };
  const beforeUpload = async (file) => {
    const isExeal = file.type.includes('zip');
    console.log(file.type, isExeal);
    if (isExeal) {
      pageData.loading = true;
      form.fileList.length = 0;
      form.fileList.push(file);
    } else {
      createMessage.warn('请上传后缀为.zip文件！');
    }
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   this.$message.error('You can only upload JPG file!');
    // }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   this.$message.error('Image must smaller than 2MB!');
    // }
    // return isJpgOrPng && isLt2M;
  };
  const handleChange = async ({ file }) => {
    if (file.status == 'done') {
      if (file.response.code == 0) {
        await setFieldsValue({ fileUrl: file.response.data });
        await clearValidate('fileUrl');
        createMessage.success('上传成功！');
      } else {
        createMessage.warn('上传失败！');
      }
      pageData.loading = false;
    }
  };
  const handleOk = async () => {
    const validateRes = await validate();
    const res = await resourceCreate(validateRes);
    console.log(res);
    if (res.code == 0) {
      closeModal();
      createMessage.success(res.message);
      emit('reload');
    } else {
      createMessage.error(res.message);
    }
  };
  deviceType().then((res) => {
    pageData.deviceTypeList = res.data;
  });
</script>
