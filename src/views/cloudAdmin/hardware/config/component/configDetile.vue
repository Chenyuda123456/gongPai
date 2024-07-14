<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :showCancelBtn="false"
    title="查看配置单"
    :okText="'复制配置单'"
    @ok="copyFn"
    :width="600"
  >
    <div class="mb-14px">配置文件：{{ data.record.fileName }}</div>
    <a-textarea v-model:value="data.configInfo" :rows="6" />
  </BasicModal>
</template>
<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive } from 'vue';
  import { configInfo } from '/@/api/admin/admin';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const data = reactive({
    record: {},
    configInfo: '',
  });
  const [register, { closeModal }] = useModalInner(async (option) => {
    data.record = option;
    const configInfoRes = await configInfo({ resourceId: option.resourceId || option.id });
    data.configInfo = configInfoRes.data;
    console.log(data.configInfo);
  });
  const copyFn = () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', 'readonly');
    textarea.value = data.configInfo;
    document.body.appendChild(textarea);
    textarea.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      createMessage.success('复制成功！');
      closeModal();
    } else {
      createMessage.warn('不支持复制，请手动复制！');
    }
    document.body.removeChild(textarea);
  };
</script>
