<template>
  <BasicDrawer
    @close="closeHandle"
    v-bind="$attrs"
    @register="register"
    :isDetail="true"
    title="胸牌坞详情"
  >
    <div>
      <div class="px-[16px] bg-[#f0f2f5]">
        <a-row>
          <a-col :span="16">
            <div class="flex items-center">
              <img
                v-if="currentData?.deviceType == 'H2'"
                class="w-[70px] h-[70px] mr-[16px]"
                src="../../../../assets/images/H2.png"
              />
              <img
                v-else
                class="w-[70px] h-[70px] mr-[16px]"
                src="../../../../assets/images/badge-1.jpg"
              />
              <div>
                <div class="flex items-center my-3">
                  <div>版本：{{ currentData?.version }}</div>
                  <a-divider type="vertical" style="border-color: rgba(0, 0, 0, 0.85)" />
                  <div>类型：{{ currentData?.deviceType }}</div>
                  <a-divider type="vertical" style="border-color: rgba(0, 0, 0, 0.85)" />
                  <div>SN：{{ currentData?.snCode }}</div>
                  <a-divider type="vertical" style="border-color: rgba(0, 0, 0, 0.85)" />
                  <div>MAC地址：{{ currentData?.mac }}</div>
                </div>
                <div class="flex items-center my-3">
                  <div>所属客户：{{ currentData?.customerName }}</div>
                  <a-divider type="vertical" style="border-color: rgba(0, 0, 0, 0.85)" />
                  <div> 账号：{{ currentData?.account }}</div>
                  <a-divider type="vertical" style="border-color: rgba(0, 0, 0, 0.85)" />
                  <div>门店：{{ currentData?.shopName }}</div>
                  <a-divider type="vertical" style="border-color: rgba(0, 0, 0, 0.85)" />
                  <div>使用者：{{ currentData?.userName }}</div>
                </div>
                <div class="flex items-center my-2">
                  <div>存储空间：{{ (currentData?.totalDf / 1024 || 0).toFixed(1) }}GB</div>
                  <a-divider type="vertical" style="border-color: rgba(0, 0, 0, 0.85)" />
                  <div
                    >已用：{{
                      ((currentData?.totalDf - currentData?.df) / 1024 || 0).toFixed(1)
                    }}GB</div
                  >
                  <a-divider type="vertical" style="border-color: rgba(0, 0, 0, 0.85)" />
                  <div>还剩：{{ (currentData?.df / 1024 || 0).toFixed(1) }}GB</div>
                  <a-divider type="vertical" style="border-color: rgba(0, 0, 0, 0.85)" />
                  <div
                    class="cursor-pointer flex items-center"
                    @click="refresh('hand')"
                    :style="{
                      color: baseInfo.refreshStatus ? '#0960bd !important' : '#999',
                    }"
                  >
                    <UndoOutlined />
                    <div>刷新</div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="flex items-center justify-end h-[100%]">
              <div
                class="flex items-center justify-end mr-6 cursor-pointer"
                :style="{
                  color: currentData?.net == '1' ? 'green' : 'red',
                }"
                @click="openOnlineRecord"
              >
                <div
                  class="text-6xl mr-2 w-[70px] h-[70px] flex items-center justify-center bg-white rounded-full"
                >
                  <img
                    v-if="currentData?.netType == 0"
                    class="w-[50px] h-[50]"
                    src="../../../../assets/svg/u1009.svg"
                  />
                  <img v-else class="w-[50px] h-[50]" src="../../../../assets/svg/u172.svg" />
                </div>

                <div
                  v-if="currentData?.net == '1'"
                  class="text-xl leading-5 font-bold mr-1"
                  style="color: #333"
                >
                  <div>{{ currentData?.netType == 0 ? currentData?.networkName : '有线' }}</div>
                  <div class="text-12px mt-[14px] leading-5 font-bold mr-1">
                    <div>上行：{{ (currentData.upSpeed / 1024).toFixed(2) }}Kbps/S</div>
                    <div>下行：{{ (currentData.downSpeed / 1024).toFixed(2) }}Kbps/S</div>
                  </div>
                </div>
                <div v-else class="text-xl leading-5 font-bold mr-1"> 未连接互联网 </div>
              </div>
              <a-popconfirm
                v-if="currentData.online"
                title="确定要重启这个设备吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="reboot()"
              >
                <a-button type="primary" :disabled="baseInfo.rebootStatus">重启</a-button>
              </a-popconfirm>
              <div v-else class="text-[#999999]">
                <a-button type="primary" :disabled="true">重启</a-button></div
              >
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="mt-[16px]">
        <a-radio-group v-model:value="baseInfo.radioValue">
          <a-radio-button value="a">胸牌管理</a-radio-button>
          <a-radio-button value="b">上传队列</a-radio-button>
        </a-radio-group>

        <a-row v-if="baseInfo.radioValue == 'a'" :gutter="16" class="mt-[16px]">
          <a-col class="mb-4" :span="6" v-for="(item, index) in baseInfo.cardList" :key="index">
            <a-card
              :class="{
                gray: item.status == 1 || 2 || undefined,
                red: item.status == 3,
                green: item.status == 4,
                blue: item.status == 5,
              }"
              hoverable
              class="cardSelf"
              :style="{ background: item.status ? '#fff' : '#f5f5f5' }"
            >
              <template #title>
                <div
                  v-if="!item.status"
                  style="font-size: 14px; text-align: center; line-height: 44px"
                  >如已经放置胸牌，则可能是接触不良，请拿起重放</div
                >
                <div v-else style="font-size: 14px">
                  <div>
                    <span>{{ item.deviceType }}</span> | SN:
                    <span class="cursor-pointer" @click="copyFn(item.snCode)">
                      <a-tooltip placement="topLeft" :title="item.snCode">
                        {{ item.snCode }}
                      </a-tooltip>
                    </span>
                  </div>
                  <div>蓝牙: {{ item.vBle }} | 固件: {{ item.firmwareVersion }}</div>
                </div>
              </template>
              <template #extra v-if="item.status !== -1 && item.rsoc != -1">
                <div :style="{ visibility: item.status ? 'initial' : 'hidden' }">
                  <div class="battery flex items-center">
                    <ThunderboltOutlined class="mr-[6px]" />
                    {{ item.rsoc }}
                  </div>
                </div>
              </template>
              <div class="flex justify-between items-center">
                <div class="text-3xl font-bold">{{ item.usbIndex }}</div>
                <div class="process text-sm flex justify-center items-center flex-col">
                  <div
                    class="content"
                    v-if="item.status == 3"
                    :style="'width:' + item.rsoc + '%'"
                  ></div>
                  <div class="contentAni" v-if="item.status == 4 || item.status == 5"></div>
                  <div class="text-base" v-if="item.status == 4 || item.status == 5">请勿移动</div>
                  <div v-if="item.status == 1">设备接入中</div>
                  <div v-if="item.status == 2">空闲</div>
                  <div v-if="item.status == 3">充电中-{{ item.rsoc }}%</div>
                  <div v-if="item.status == 4">文件拷贝中</div>
                  <div v-if="item.status == 5">升级中</div>
                  <div v-if="!item.status">尚未连接胸牌</div>
                </div>
                <a-button
                  v-if="
                    item.status == 2 || item.status == 3 || item.status == 4 || item.status == 5
                  "
                  type="primary"
                  @click="jumpDetail(item)"
                  >查看</a-button
                >
              </div>
            </a-card>
          </a-col>
        </a-row>
        <div v-else>
          <div class="mt-16px">
            待上传音频文件个数总量:
            {{ currentData?.unUploadSize || 0 }}&nbsp;&nbsp;&nbsp;&nbsp; 待上传音频文件大小总量:
            <span>{{ (currentData?.totalRecsize / 1024)?.toFixed(2) || 0 }}</span> MB
            &nbsp;&nbsp;&nbsp;&nbsp; 待上传日志文件大小总量:
            <span>{{ (currentData?.totalLogSize / 1024)?.toFixed(2) || 0 }}</span> MB
          </div>
          <!--<div class="flex items-center">
            <div>上传进度：</div>
            <div class="blue flex-1" style="border: 0">
              <div
                class="process text-sm flex justify-center items-center flex-col"
                style="height: 30px"
              >
                <div class="content" :style="'width:' + '%'"></div>
                <div>共10个文件，已上传4，还剩6个，上传进度已完成47%</div>
              </div>
            </div>
          </div>-->
          <BasicTable
            :columns="tableColumns"
            :dataSource="currentData.fileInfos"
            :pagination="false"
          >
            <template #toolbar>
              <a-button type="primary" @click="lookUpload()">查看已经上传音频</a-button>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                {{ record.status == 0 ? '待上传' : '上传失败' }}
              </template>
            </template>
          </BasicTable>
        </div>
      </div>
    </div>
    <Despict
      @reload="getList"
      :cardList="baseInfo.cardList"
      :currentData="currentData"
      @register="registerModal"
    />
    <OnlineRecord @register="registerModalOnline" />
  </BasicDrawer>
</template>

<script setup>
  import dayjs from 'dayjs';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { UndoOutlined, ThunderboltOutlined } from '@ant-design/icons-vue';
  import { computed, defineEmits, ref, onUnmounted, reactive } from 'vue';
  import { tableColumns } from '../schema.ts';
  import { BasicTable } from '/@/components/Table';
  import Despict from './despict.vue';
  import { useModal } from '/@/components/Modal';
  import { cardList, hubRefresh, remoteSet } from '../../../../api/manage/manage';
  import OnlineRecord from './record.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const emit = defineEmits(['reload', 'register']);
  const baseInfo = reactive({
    radioValue: 'a',
    cardList: [],
    timer: '',
    refreshStatus: true,
    refreshTimer: '',
    rebootStatus: true,
    rebootTimer: '',
  });
  // 现在这个胸牌坞的信息
  const currentData = ref({});
  // 未上传文件个数
  const noUploadFile = computed(() => {
    return currentData?.value?.fileInfos?.filter((item) => item.status == 0);
  });
  const [register, { closeDrawer }] = useDrawerInner((option) => {
    console.log(currentData.value);
    clearTimeout(baseInfo.refreshTimer);
    clearTimeout(baseInfo.rebootTimer);
    baseInfo.refreshStatus = true;
    baseInfo.rebootStatus = false;
    baseInfo.radioValue = option.type;
    currentData.value = option.item;
    console.log(option.item);
    refresh();
    getList();
    baseInfo.timer && clearInterval(baseInfo.timer);
    baseInfo.timer = setInterval(() => {
      getList();
      refresh();
    }, 5000);
  });
  onUnmounted(() => {
    baseInfo.timer && clearInterval(baseInfo.timer);
  });
  const getList = async () => {
    const res = await cardList({
      snCodes: currentData.value.cardList.join(','),
      hubType: currentData.value.deviceType,
    });
    if (res.code == 0) {
      baseInfo.cardList = res.data || [];
    }
  };
  const [registerModal, { openModal }] = useModal();
  const [registerModalOnline, { openModal: openModalOnline }] = useModal();
  const openOnlineRecord = () => {
    openModalOnline(true, {
      snCode: currentData.value.snCode,
    });
  };

  const lookUpload = () => {
    router.push({
      path: '/audioManagePage',
      query: {
        startTime: dayjs().startOf('date').format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        hubCode: currentData.value.snCode, // 胸牌坞code
      },
    });
  };
  const reboot = async () => {
    if (baseInfo.rebootStatus) return;
    baseInfo.rebootStatus = true;
    let res = await remoteSet({
      command: 'reboot',
      deviceType: currentData.value.deviceType,
      snCode: currentData.value.snCode,
    });
    if (res.code == 0) {
      createMessage.success('重启成功！');
      baseInfo.rebootTimer = setTimeout(() => {
        baseInfo.rebootStatus = false;
        console.log(baseInfo.rebootStatus);
      }, 5000);
    } else {
      createMessage.error(res.message);
    }
  };

  const refresh = async (hand) => {
    if (!baseInfo.refreshStatus) return;
    if (hand) {
      baseInfo.refreshStatus = false;
    }
    let res = await hubRefresh({
      snCode: currentData.value.snCode,
    });

    if (res.code == 0) {
      if (!res.data) {
        baseInfo.timer && clearInterval(baseInfo.timer);
        createMessage.warn('该胸牌坞不在贵单位名下！');
        closeDrawer();
      }
      currentData.value = res.data;
      emit('reload');
      if (hand) {
        createMessage.success('刷新成功！');
        baseInfo.refreshTimer = setTimeout(() => {
          baseInfo.refreshStatus = true;
        }, 5000);
      }
    } else {
      createMessage.error(res.message);
    }
  };
  const jumpDetail = (item) => {
    openModal(true, {
      item,
    });
  };
  const copyFn = (val) => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', 'readonly');
    textarea.value = val;
    document.body.appendChild(textarea);
    textarea.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      createMessage.success('复制成功！');
    } else {
      createMessage.warn('不支持复制，请手动复制！');
    }
    document.body.removeChild(textarea);
  };
  onUnmounted(() => {
    clearInterval(baseInfo.timer);
  });
  const closeHandle = () => {
    console.log('clear');
    baseInfo.timer && clearInterval(baseInfo.timer);
  };
</script>

<style scoped lang="less">
  .process {
    flex: 1;
    border: 1px solid #999999;
    margin: 10px;
    height: 50px;
    border-radius: 50px;
    position: relative;
    overflow: hidden;

    > div {
      position: relative;
      z-index: 9;
    }

    .content {
      position: absolute;
      z-index: 1;
      height: 100%;
      left: 0;
    }
    .contentAni {
      position: absolute;
      z-index: 1;
      height: 100%;
      left: 0;
      width: 100%;
      animation: change 3s ease-in infinite;
    }
  }

  .gray {
    border: 2px solid gray;
    border-radius: 8px;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
      0 5px 12px 4px rgba(0, 0, 0, 0.09);
  }
  .cardSelf {
    ::v-deep(.ant-card-head) {
      border-bottom: 0 !important;
    }
  }
  .red {
    border: 2px solid red;

    .battery {
      color: red;
    }

    .process {
      border-color: red;

      .content {
        background: red;
      }
      .contentAni {
        background: red;
      }
    }
  }

  .green {
    border: 2px solid green;

    .battery {
      color: green;
    }

    .process {
      border-color: green;

      .content {
        background: green;
      }
      .contentAni {
        background: green;
      }
    }
  }

  .blue {
    border: 2px solid #0960bd;

    .battery {
      color: #0960bd;
    }

    .process {
      border-color: #0960bd;

      .content {
        background: #0960bd;
      }

      .contentAni {
        background: #0960bd;
      }
    }
  }
  @keyframes change {
    0% {
      left: -100%;
      opacity: 0;
    }

    100% {
      left: 100%;
      opacity: 1;
    }
  }
</style>
