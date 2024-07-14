<template>
  <div class="allBox">
    <div>
      <div class="border-[16px] border-white px-[16px] pb-[16px]">
        <div class="title">今日总览</div>
        <a-row :gutter="16" class="monitor-head">
          <a-col :span="8">
            <a-card class="item">
              <div class="item-t">
                <div class="icon1"></div>
                <div> 胸牌坞在线情况</div>
              </div>
              <div class="flex align-center text-center">
                <div class="flex-1">
                  <div class="text-[30px]">{{ data.todayStatistics.onlineHubNum }}</div>
                  <div class="flex items-center justify-center flex-wrap">
                    <div class="w-[8px] h-[8px] rounded-full bg-[#14ca7d]"></div>
                    <div class="mx-[8px]">在线</div>
                    <a-tooltip placement="topLeft">
                      <template #title>
                        <span>当前处于在线状态的胸牌坞总数</span>
                      </template>
                      <question-circle-outlined />
                    </a-tooltip>
                  </div>
                </div>
                <a-divider type="vertical" style="height: 80px" />
                <div class="flex-1" style="filter: grayscale(100%); color: #999999">
                  <div class="text-[30px]">{{ data.todayStatistics.offlineHubNum }}</div>
                  <div class="flex items-center justify-center flex-wrap">
                    <div class="w-[8px] h-[8px] rounded-full bg-[#14ca7d]"></div>
                    <div class="mx-[8px]">离线</div>
                    <a-tooltip placement="topLeft">
                      <template #title>
                        <span>当前处于离线状态的胸牌坞总数</span>
                      </template>
                      <question-circle-outlined />
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card class="item">
              <div class="item-t">
                <div class="icon2"></div>
                <div>胸牌活跃情况</div>
              </div>
              <div class="flex align-center text-center">
                <div class="flex-1">
                  <div class="text-[30px]">{{ data.todayStatistics.onLineCardNum }}</div>
                  <div class="flex items-center justify-center flex-wrap">
                    <div class="mx-[8px]">在线胸牌数</div>
                    <a-tooltip placement="topLeft">
                      <template #title>
                        <span>当前与在线胸牌坞连接的胸牌总数</span>
                      </template>
                      <question-circle-outlined />
                    </a-tooltip>
                  </div>
                </div>
                <a-divider type="vertical" style="height: 80px" />
                <div class="flex-1">
                  <div class="text-[30px]">{{ data.todayStatistics.activeCardNum }}</div>
                  <div class="flex items-center justify-center flex-wrap">
                    <div class="mx-[8px]">今日活跃胸牌数</div>
                    <a-tooltip placement="topLeft">
                      <template #title>
                        <span>今日已上传过录音的胸牌总数</span>
                      </template>
                      <question-circle-outlined />
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card class="item">
              <div class="item-t">
                <div class="icon3"></div>
                <div>今日已上传录音</div>
              </div>
              <div class="flex align-center text-center">
                <div class="flex-1">
                  <div class="text-[30px]">{{ data.todayStatistics.uploadNum }}</div>
                  <div class="flex items-center justify-center flex-wrap">
                    <div class="mx-[8px]">条</div>
                  </div>
                </div>
                <a-divider type="vertical" style="height: 80px" />
                <div class="flex-1">
                  <div class="text-[30px]">{{ data.todayStatistics.audioSize }}</div>
                  <div class="flex items-center justify-center flex-wrap">
                    <div class="mx-[8px]">小时</div>
                  </div>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
        <div class="title">今日胸牌坞明细</div>
        <BasicForm @register="registerForm" @submit="getList" />
        <a-radio-group v-model:value="data.online" button-style="solid" @change="getList('change')">
          <a-radio-button :value="null">全部</a-radio-button>
          <a-radio-button :value="1">在线</a-radio-button>
          <a-radio-button :value="0">离线</a-radio-button>
        </a-radio-group>
      </div>
      <div class="bg-white px-[16px]">
        <div class="flex justify-center">
          <a-empty v-if="data.result.length == 0" :image="data.simpleImage" />
        </div>
        <a-row :gutter="16" class="card-list">
          <a-col :span="8" v-for="(item, index) in data.result" :key="item.snCode">
            <div class="per rounded-[6px] border-[1px] border-[#dcdee0] mb-[16px]">
              <div class="flex items-center justify-between p-[12px] bg-[#f0f2f5]">
                <div
                  >类型：{{ item.deviceType }} | SN：<span
                    class="cursor-pointer"
                    @click="copyFn(item.snCode)"
                  >
                    <a-tooltip placement="topLeft" :title="item.snCode">
                      {{ item.snCode }}
                    </a-tooltip></span
                  ></div
                >
                <div class="flex items-center justify-end">
                  <img v-if="item.online" class="w-[22px] mr-[8px]" :src="onlineSvg" />
                  <img v-else class="w-[22px] mr-[8px]" :src="downlineSvg" />
                  <div v-if="item.online" class="text-[#169BD5]">在线</div>
                  <div v-else>离线</div>
                </div>
              </div>
              <div class="px-[12px]">
                <div class="my-[12px]"
                  >门店：{{ item.shopName || '未登记'
                  }}{{ item.userName ? '(' + item.userName + ')' : '' }}</div
                >
                <div class="my-[12px]">版本：{{ item.version }}| MAC地址：{{ item.mac }}</div>
                <div class="my-[12px]">
                  存储空间：{{ (item.totalDf / 1024).toFixed(1) }}GB 已用：{{
                    ((item.totalDf - item.df) / 1024).toFixed(1)
                  }}GB 还剩：{{ (item.df / 1024).toFixed(1) }}GB</div
                >
                <div class="my-[12px]">
                  在线胸牌：<span style="color: #ff0000">{{ item?.cardList?.length || 0 }}</span> |
                  已传音频：{{ item.audioNum }} 条（{{ item.audioDuration }}）小时
                </div>
              </div>
              <div class="p-12px flex justify-around text-[#169BD5] bg-[#f2f2f2]">
                <div class="cursor-pointer" @click="openDetail('b', item)">上传队列</div>
                <div class="cursor-pointer" @click="openDetail('a', item)">胸牌坞详情</div>
                <a-popconfirm
                  title="确定要重启这个设备吗？"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="reboot(item)"
                  v-if="item.online"
                >
                  <div class="cursor-pointer">重启</div>
                </a-popconfirm>
                <div v-else class="text-[#999999]">重启</div>
              </div>
            </div>
          </a-col>
        </a-row>
        <div class="flex py-[16px] justify-end">
          <a-pagination
            @change="getList"
            show-quick-jumper
            :size="'small'"
            v-model:current="data.current"
            v-model:page-size="data.pageSize"
            :total="data.total"
            show-size-changer
            :show-total="(total) => `共 ${total} 条数据`"
            :pageSizeOptions="['6', '9', '12', '15']"
          />
        </div>
      </div>
    </div>
    <Detail @reload="getList" @register="register" />
  </div>
</template>

<script setup lang="ts">
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';
  import onlineSvg from '/@/assets/images/icononline.png';
  import downlineSvg from '/@/assets/images/iconoffline.png';
  import Detail from './component/detail.vue';
  import { reactive, onMounted, nextTick, provide, computed, onUnmounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicModal } from '/@/components/Modal';
  import { todayStatistics, monitorPage, customerShops, deviceType } from '/@/api/manage/manage';
  import { remoteSet } from '/@/api/manage/manage';
  import { Empty } from 'ant-design-vue';
  const { createMessage } = useMessage();
  const data = reactive({
    detail: true,
    online: null,
    current: 1,
    pageSize: 6,
    total: 0,
    result: [],
    todayStatistics: {},
    simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
  });

  const result = computed(() => data.result);
  provide('result', result);

  const formSchemas = [
    {
      field: 'snCode',
      component: 'Input',
      label: '胸牌坞设备码',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入胸牌坞设备码',
        onChange: () => {
          data.current = 1;
        },
      },
    },
    {
      field: 'shopId',
      component: 'ApiSelect',
      label: '所属门店',
      colProps: {
        span: 6,
      },
      componentProps: {
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        showSearch: true,
        onChange: () => {
          data.current = 1;
        },
        api: customerShops,
        resultField: 'data.list',
        labelField: 'name',
        valueField: 'id',
      },
    },
    {
      field: 'deviceType',
      label: '胸牌坞类型',
      component: 'ApiSelect',
      colProps: {
        span: 6,
      },
      componentProps: {
        onChange: () => {
          data.current = 1;
        },
        params: {
          category: 2,
        },
        api: deviceType,
        resultField: 'data',
        labelField: 'name',
        valueField: 'type',
      },
    },
  ];
  const [registerForm, { getFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: formSchemas,
    actionColOptions: {
      span: 6,
    },
    submitButtonOptions: {
      text: '查询',
    },
    resetFunc: () => {
      return getList('reset');
    },
  });
  // 打开抽屉
  const [register, { openDrawer }] = useDrawer();
  const openDetail = (type, item) => {
    openDrawer(true, {
      type,
      item,
    });
  };
  const todayStatisticsFn = async () => {
    const res = await todayStatistics();
    if (res.code == 0) {
      data.todayStatistics = res.data;
    }
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

  const getList = async (val = '') => {
    const formData = val == 'reset' ? {} : getFieldsValue();
    val == 'reset' || val == 'change' ? (data.current = 1) : '';
    let res = await monitorPage({
      page: data.current,
      pageSize: data.pageSize,
      ...formData,
      online: data.online,
    });
    if (res.code == 0) {
      data.result = res.data.list;
      data.total = res.data.total;
    }
  };
  const reboot = async (record) => {
    if (record.online) {
      let res = await remoteSet({
        command: 'reboot',
        deviceType: record.deviceType,
        snCode: record.snCode,
      });
      if (res.code == 0) {
        createMessage.success(res.message);
      } else {
        createMessage.error(res.message);
      }
    }
  };

  let timer: any = '';
  onMounted(() => {
    todayStatisticsFn();
    getList();
    timer = setInterval(() => {
      getList();
      todayStatisticsFn();
    }, 5000);
    nextTick(() => {
      let el = document.documentElement.querySelector('.allBox');
      console.log(document.documentElement.clientHeight);
      el.style.height = document.documentElement.clientHeight - 50 + 'px';
      el.style.overflow = 'scroll';
    });
  });
  onUnmounted(() => {
    timer && clearInterval(timer);
  });
</script>

<style scoped lang="less">
  .monitor-head {
    .item {
      .item-t {
        display: flex;
        align-items: center;

        .icon1 {
          margin-right: 8px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(78, 130, 255, 0.16) 50% no-repeat
            url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsUlEQVQ4T62Suw3CMBiE7yIWYAQKCnq6ZAU8EAIjxVQsQ+J0tAQaFmANFuAQUhykEBobV37d99//IBIXE/VIBxinM4QiygnR0pRSlLgT/RVQeMvL0I0plQNou/uQajijd8AMeb3hNRoQWwcmdyFEfndDEyyaNe+/3Ji9lnji5i37+ek3XTtrAI8hICOO1ZbVymlG4eQt5+HPB+B0kDAdi54Jvt6xGXtLH+XY6n+lEAt6AT9tQj3B+4FeAAAAAElFTkSuQmCC);
        }

        .icon2 {
          margin-right: 8px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(254, 75, 75, 0.16) 50% no-repeat
            url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABmklEQVQ4T5XSv0tbURQH8O/3JUMg0aHtpEOLg2DA0h9TttBMefcZN6F0FMzuYoduXdS/oHRqlyxZbHw3gUhdXAodapeKiBQKRnRyUBCTvG951YQ8fQn2jpdzPveccw8x4qhYHEcmc8lq9WpYGEcCxqxKKrLdLnJrqxUXOxRQqTShbncfQIbkNn2/8H+AMV8ElMIkAgL5hL7/5zYSW4HC0oGVwWA6zkt0OmKj8SNyf1uMSwYQEHgEaRnAIev1T728SAVy3Xci398pk/xG3891PW+dQbDETmeazebpTXvX4fK8nKQdAIk7gPSG9XpFnvdV0isCa7T2bRQwpiLgdcyk9xxrs3LdWZFh/+EDvx1rpyJA4Lo/QT6NAc4JrANYFPC433u7nWGzedGfQWDMLwAzoxYrMv1EYpK1WmsQ2AAwf0/gjNY+CPejD8h1yyI/3AcQ8DFhbTk6xHw+iXT6u4BnIxHpmMnkc9ZqJxHg31cWCg+RSn0WYIbs/S7IBfr+Qewi9S41N/cCQRAiWQFjAo4cx2kgldpktdodxP8CofyVEbButT8AAAAASUVORK5CYII=);
        }

        .icon3 {
          margin-right: 8px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(250, 173, 19, 0.16) 50% no-repeat
            url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABu0lEQVQ4T32TMWsUURSFz5mZt1FUlJ2xDlYSsLFQUglKMGkiZHZNCgnBdP6BgKSwCRZCGn+AsiRp4s6QEIN2wUrQLp2ljSjZ0W1ilp3dd2SQhN3Zydzu3Xv53nvnnkucE51mMOtQM1nZih8v1Ft7Ra3MJyUwjf0GgMVcbcOEyRIJDeZHAL2oWrfgu6LbHOixV/vdLAfE/hsrPC0EEG+9MFkuBaSxH0kIC/9LxCZMaoWAbvP6bTm24wBrZYA+3RX200tj9T+HGehMgzSqvhfxg6BfBqB0JPKmCZP7w4DY3xH0F2AXwlLhdIUGHFUIBiZMHuYAwTqkeRKrNmssCMfBohVewmK/Uk+eDQG6UXUS4GeXeG6FuwLmcmI1QX6R9IrgA1NrHQwBskM38rcILABcE/kdsveyvEMcSBoX+ILE7uAkhoykbVzsef5mJiKBNoiv+u+7OwCuEdr3LpsFTv86Pn3diBOzQi8KHklaFjBFomeBTy7R8MIkzktTCDhtSqPgg6hWJUzye3HGGV2m2J9IhdegxiDcApiC+kax0+mbJ1fmfx6VWvlk++oN45pVmwEGw+rEuHaFc+32YPofDwGzEQ4U1yYAAAAASUVORK5CYII=);
        }
      }
    }
  }

  .title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 16px;
    margin-top: 16px;
  }
</style>
