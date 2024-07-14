<template>
  <BasicDrawer v-bind="$attrs" @register="registerDescDrawer" title="操作日志详情" width="60%">
    <Description @register="registerDesc" :data="viewObject" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description, useDescription } from '/@/components/Description';
  import { descFormSchema } from './data';

  import { viewObj } from '/@/api/modules/system/sysLogApi';
  import { listDictModel } from '/@/api/common';
  import { formatDictValue } from '/@/utils';

  const viewObject = ref();
  const sysLogStatusOptions = ref([]);
  const sysUerPlatformOptions = ref([]);
  onBeforeMount(async () => {
    sysLogStatusOptions.value = await listDictModel({ dictCode: 'sys_log_status' });
    sysUerPlatformOptions.value = await listDictModel({ dictCode: 'sys_user_platform' });
  });

  const [registerDescDrawer] = useDrawerInner(async (data) => {
    const resData = await viewObj({ id: data.record.id });
    viewObject.value = {
      ...resData,
      logStatusDesc: formatDictValue(sysLogStatusOptions.value, resData.logStatus),
      userPlatformDesc: formatDictValue(sysUerPlatformOptions.value, resData.userPlatform),
    };
  });
  const [registerDesc] = useDescription({
    schema: descFormSchema,
    column: 2,
    labelStyle: {
      width: '120px',
    },
  });
</script>
