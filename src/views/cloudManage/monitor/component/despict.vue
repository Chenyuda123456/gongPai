<template>
  <BasicModal
    :width="800"
    @register="register"
    title="胸牌详情"
    :showOkBtn="false"
    cancelText="关闭"
    @cancel="closeHandle"
    :canFullscreen="false"
    :okButtonProps="{ disabled: true }"
  >
    <div class="flex justify-around items-center">
      <div class="flex items-center">
        <img class="img mr-4" src="../../../../assets/images/badge-2.png" />
        <div>
          <div>SN：{{ currentData.snCode }}</div>
          <div>蓝牙版本：{{ currentData.vBle }}</div>
          <div>门店：{{ currentData.shopName }}</div>
        </div>
      </div>
      <div>
        <div>胸牌坞端口：{{ currentData.usbIndex }}</div>
        <div>固件版本：{{ currentData.firmwareVersion }}</div>
        <div>使用者：{{ currentData.userName }}</div>
      </div>
      <div>
        <div>电量：{{ currentData.rsoc }}</div>
        <div v-if="currentData.status == 1">状态：设备接入中</div>
        <div v-if="currentData.status == 2">状态：空闲</div>
        <div v-if="currentData.status == 3">状态：充电中</div>
        <div v-if="currentData.status == 4">状态：文件拷贝中</div>
        <div v-if="currentData.status == 5">状态：升级中</div>
        <div v-if="!currentData.status">状态：尚未连接胸牌</div>
      </div>
      <div
        class="cursor-pointer flex items-center text-lg"
        @click="refresh('hand')"
        :style="{
          color: data.refreshStatus ? '#0960bd !important' : '#999',
        }"
      >
        <UndoOutlined />
        <div>刷新</div>
      </div>
    </div>
    <Description class="mt-4" :column="2" :data="baseInfo" :schema="desData" />
    <a-divider />
    <BasicTable
      @register="registerTable"
      :pagination="false"
      :dataSource="currentData.fileInfos || []"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div>
            <TableAction
              v-if="record.status == 1"
              :actions="[
                {
                  label: record.status ? '已上传-查看记录' : '未上传',
                  onClick: handleLook.bind(null, record),
                },
              ]"
            />
            <div v-else class="text-center">未上传</div>
          </div>
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script setup>
  import { UndoOutlined } from '@ant-design/icons-vue';
  import { computed, onUnmounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Description } from '/@/components/Description/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { desData, tableDataDes } from '../schema';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { cardRefresh } from '/@/api/manage/manage';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  // 当前的 currentData|胸牌坞 和 cardList|胸牌list
  const props = defineProps(['currentData', 'cardList']);
  const router = useRouter();
  const data = reactive({
    tableData: [],
    index: 0,
    refreshStatus: true,
    refreshTimer: '',
    timer: '',
  });
  // 当前胸牌的信息
  const currentData = ref({});
  const baseInfo = computed(() => {
    let obj = {};
    obj.recordLight = currentData.value.recordLight == 0 ? '关' : '开';
    obj.autoRecord = currentData.value.autoRecord == 0 ? '关' : '开';
    obj.recordOrigin = currentData.value.recordOrigin == 0 ? '关' : '开';
    obj.ignoreTime = currentData.value.ignoreTime + '秒';
    obj.recordMode =
      currentData.value.recordMode == 1
        ? '双录模式'
        : currentData.value.recordMode == 2
        ? '单录模式'
        : '混合模式';
    obj.recordFormat = currentData.value.recordFormat == 0 ? 'ogg ' : 'wav';
    obj.recordTime =
      currentData.value.recordTime <= 60
        ? currentData.value.recordTime + '秒'
        : parseInt(currentData.value.recordTime / 60) + '分钟';
    obj.recordSectionTime =
      currentData.value.recordSectionTime <= 60
        ? currentData.value.recordSectionTime + '秒'
        : parseInt(currentData.value.recordSectionTime / 60) + '分钟';
    obj.logLevel =
      currentData.value.logLevel == 1
        ? 'debug '
        : currentData.value.logLevel == 2
        ? 'info'
        : currentData.value.logLevel == 3
        ? 'warning'
        : currentData.value.logLevel == 4
        ? 'error'
        : 'no';
    return { ...currentData.value, ...obj };
  });
  const [register] = useModalInner((option) => {
    data.refreshStatus = true;
    data.refreshTimer ? clearTimeout(data.refreshTimer) : '';
    currentData.value = option.item;
    console.log(currentData);
    refresh();
    data.timer && clearInterval(data.timer);
    data.timer = setInterval(() => {
      refresh();
    }, 5000);
  });
  const [registerTable] = useTable({
    title: '今日录音文件拷贝记录',
    canResize: false,
    columns: tableDataDes,
    bordered: true,
    actionColumn: {
      width: 250,
      title: '状态',
      dataIndex: 'action',
    },
  });
  const handleLook = (record) => {
    if (record.status) {
      router.push({
        path: '/audioManagePage',
        query: {
          fileName: record.fileName,
        },
      });
    }
  };

  const refresh = async (hand) => {
    if (!data.refreshStatus) return;
    if (hand) {
      data.refreshStatus = false;
    }
    let res = await cardRefresh({
      snCode: currentData.value.snCode,
    });
    if (res.code == 0) {
      currentData.value = res.data;
      if (hand) {
        createMessage.success('刷新成功！');
        data.refreshTimer = setTimeout(() => {
          data.refreshStatus = true;
        }, 5000);
      }
    } else {
      createMessage.error(res.message);
    }
  };
  onUnmounted(() => {
    clearInterval(data.timer);
  });
  const closeHandle = () => {
    console.log('clear');
    clearInterval(data.timer);
  };
</script>
<style lang="less" scoped>
  .img {
    width: 110px;
    height: auto;
  }
</style>
