<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :width="700"
    title="导入设备"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <BasicForm @register="registerForm">
      <template #one>下载所需的模板 <a @click="exportBatchTemplateFn()">下载模板</a></template>
      <template #two>在下载的excel中 填写设备，保存 </template>
      <template #three>上传附件，保存即可</template>
      <template #upload="{ model, field }">
        <a-upload
          name="file"
          class="avatar-uploader"
          :file-list="model[field]"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          :accept="'.xls,.xlsx'"
          :action="data.action"
        >
          <a-button> 点击上传 </a-button>
        </a-upload>
        <div class="mt-20px">
          <div>导入说明</div>
          <div>1、模板中，字段不能为空</div>
          <div>2、模板中，第一行是示例，请参照该行示例进行信息填写</div>
          <div>3、单次最多上传1000行数据，如有超过1000条数据，请分批次上传</div>
        </div>
      </template>
    </BasicForm>

    <div v-if="data.errTipText" v-html="data.errTipText"></div>
  </BasicModal>
</template>
<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { importBatchDevice } from '/@/api/manage/manage';
  import { defineEmits, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const emit = defineEmits(['reload', 'register']);
  const schemas = [
    {
      field: '第一步',
      label: '第一步',
      component: 'Input',
      slot: 'one',
      colProps: {
        span: 24,
      },
    },
    {
      field: '第二步',
      label: '第二步',
      component: 'Input',
      slot: 'two',
      colProps: {
        span: 24,
      },
    },
    {
      field: '第三步',
      label: '第三步',
      component: 'Input',
      slot: 'three',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'fileList',
      label: '上传',
      component: 'Select',
      required: true,
      slot: 'upload',
      defaultValue: [],
      colProps: {
        span: 24,
      },
    },
  ];
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const data = reactive({});
  const [register, { changeOkLoading, closeModal, setModalProps }] = useModalInner(() => {
    resetFields();
    setModalProps({ okText: '保存' });
  });
  const exportBatchTemplateFn = async () => {
    let link = document.createElement('a');
    link.style.display = 'none';
    link.target = 'blank';
    link.href = './resource/exportDevice.xlsx';
    link.setAttribute('download', '模板.xlsx');
    document.body.appendChild(link);
    link.click();
  };

  function handleRemove() {
    resetFields();
    // const index = getFieldsValue().fileList.indexOf(file);
    // const newFileList = getFieldsValue().fileList.slice();
    // newFileList.splice(index, 1);
    // setFieldsValue({
    //   fileList: newFileList,
    // });
  }
  function beforeUpload(file) {
    const isExeal =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';
    if (isExeal) {
      setFieldsValue({
        fileList: [file],
      });
    } else {
      createMessage.warn('请上传.xls或者.xlsx文件！');
    }
    // getFieldsValue().fileList.push(file);
    return false;
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   this.$message.error('You can only upload JPG file!');
    // }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   this.$message.error('Image must smaller than 2MB!');
    // }
    // return isJpgOrPng && isLt2M;
  }
  const handleOk = async () => {
    const validateRes = await validate();
    changeOkLoading(true);
    createMessage.success('正在上传中');
    const { fileList } = validateRes;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    let res;
    res = await importBatchDevice({}, formData);
    changeOkLoading(false);
    if (res.code == 0) {
      closeModal();
      createMessage.success(res.message);
      emit('reload');
    } else {
      createMessage.error(res.message);
    }
  };
  const handleCancel = () => {};
</script>
