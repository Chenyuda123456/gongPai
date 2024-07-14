<template>
  <div class="bg-white px-[16px] allBox">
    <div class="pt-[30px]">
      <div class="mb-[30px]" style="display: flex; justify-content: space-around">
        <a-card hoverable style="width: 300px" class="card">
          <div class="title">在线客户数</div>
          <div class="number">{{ data.todayStatistics.onlineCustomerNum }}</div>
          <div class="unit">家</div>
        </a-card>
        <a-card hoverable style="width: 300px" class="card">
          <div class="title">在线胸牌坞</div>
          <div class="number">{{ data.todayStatistics.onlineHubNum }}</div>
          <div class="unit">个</div>
        </a-card>
        <a-card hoverable style="width: 300px" class="card">
          <div class="title">在线胸牌</div>
          <div class="number">{{ data.todayStatistics.onLineCardNum }}</div>
          <div class="unit">个</div>
        </a-card>
        <a-card hoverable style="width: 300px" class="card">
          <div class="title">今日上传录音</div>
          <div class="number">{{ data.todayStatistics.uploadNum }}</div>
          <div class="unit">条（{{ data.todayStatistics.audioSize }}小时）</div>
        </a-card>
      </div>
      <BasicForm @register="registerForm" @submit="getList" />
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
    <Detail @reload="getList" @register="register" />
  </div>
</template>

<script setup lang="ts">
  import { Empty } from 'ant-design-vue';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';
  import onlineSvg from '/@/assets/images/icononline.png';
  import downlineSvg from '/@/assets/images/iconoffline.png';
  import Detail from './component/detail.vue';
  import { reactive, onMounted, provide, computed, onUnmounted, nextTick } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import {
    todayStatistics,
    monitorPage,
    remoteSet,
    deviceType,
    deviceCustomers,
    deviceShops,
  } from '/@/api/admin/admin';
  const { createMessage } = useMessage();
  const data = reactive({
    detail: true,
    current: 1,
    pageSize: 6,
    total: 0,
    result: [],
    todayStatistics: {},
    simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
  });
  const result = computed(() => data.result);
  provide('result', result);
  const formSchemas: FormSchema[] = [
    {
      field: 'snCode',
      component: 'Input',
      label: '胸牌坞SN',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入胸牌坞SN',
        onChange: () => {
          data.current = 1;
        },
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
    {
      field: `customerId`,
      label: `所属客户`,
      component: 'ApiSelect',
      colProps: {
        span: 6,
      },
      componentProps: {
        onChange: (val) => {
          data.current = 1;
          updateSchema([
            {
              field: 'shopId',
              componentProps: {
                params: {
                  customerId: val,
                },
              },
            },
          ]);
          setFieldsValue({ shopId: undefined });
        },
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        showSearch: true,
        api: deviceCustomers,
        resultField: 'data',
        labelField: 'companyName',
        valueField: 'id',
      },
    },
    {
      field: `shopId`,
      label: `所属门店`,
      component: 'ApiSelect',
      colProps: {
        span: 6,
      },
      componentProps: {
        onClick: () => {
          if (!getFieldsValue().customerId) {
            createMessage.warning('请先选择客户后再选门店!');
          }
        },
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        showSearch: true,
        api: deviceShops,
        params: {
          customerId: '',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
      },
    },
    {
      field: 'account',
      component: 'Input',
      label: '客户账号',
      colProps: {
        span: 6,
      },
      componentProps: {
        onChange: () => {
          data.current = 1;
        },
        placeholder: '请输入客户账号',
      },
    },

    {
      field: 'online',
      label: '设备状态',
      component: 'Select',
      colProps: {
        span: 6,
      },
      componentProps: {
        onChange: () => {
          data.current = 1;
        },
        options: [
          {
            label: '在线',
            value: 1,
          },
          {
            label: '离线',
            value: 0,
          },
        ],
      },
    },
  ];

  const [registerForm, { getFieldsValue, updateSchema, setFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: formSchemas,
    actionColOptions: {
      span: 12,
    },
    submitButtonOptions: {
      text: '查询',
    },
    resetFunc: () => {
      updateSchema([
        {
          field: 'shopId',
          componentProps: {
            params: {
              customerId: null,
            },
          },
        },
      ]);
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
  const getList = async (val = '') => {
    const formData = val == 'reset' ? {} : getFieldsValue();
    val == 'reset' || val == 'change' ? (data.current = 1) : '';
    let res = await monitorPage({
      page: data.current,
      pageSize: data.pageSize,
      ...formData,
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
  let timer: any = '';
  onMounted(() => {
    console.log(document.documentElement.clientHeight);

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
  .card {
    text-align: center;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .number {
      font-size: 30px;
      font-weight: bold;
    }
  }
</style>
