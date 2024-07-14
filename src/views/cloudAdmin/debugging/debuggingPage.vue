<template>
  <div>
    <a-layout style="padding: 16px">
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0 16px">
          <a-space>
            <a-select
              ref="select"
              v-model:value="data.badge"
              style="width: 160px"
              placeholder="请选择胸牌类型"
              @change="getOperateList"
            >
              <a-select-option
                v-for="(item, index) in data.deviceTypeList"
                :key="index"
                :value="item.type"
                >{{ item.name }}</a-select-option
              >
            </a-select>
            <a-input
              allowClear
              v-model:value="data.snCode"
              @change="data.result = ''"
              style="width: 160px"
              placeholder="请输入snCode"
            />
            <a-button type="primary" @click="open">操作记录列表</a-button>
          </a-space>
        </a-layout-header>
        <a-layout-content
          class="bg-white mt-[16px] p-[16px] overflow-auto"
          :style="{ height: data.height - 160 + 'px' }"
        >
          <a-textarea v-model:value="data.result" :disabled="true" style="height: 100%" />
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        style="background: #fff; margin-left: 16px; overflow: auto"
        :width="440"
        :style="{ height: data.height - 80 + 'px' }"
      >
        <div class="p-[16px]">
          <div>
            <div class="flex justify-between font-bold">查询指令</div>
            <div
              class="flex justify-between my-[12px]"
              v-for="(item, index) in data.operateList[0]"
              :key="index"
            >
              <div class="leading-[32px]">{{ item.command }}</div>
              <a-button type="primary" @click="setRemote(item)">{{ item.cmdName }}</a-button>
            </div>
          </div>
          <div>
            <div class="flex justify-between font-bold">设置指令</div>
            <div class="my-[12px]" v-for="(item, index) in data.operateList[1]" :key="index">
              <div class="flex justify-between mb-[10px]">
                <div class="leading-[32px]">{{ item.command }}</div>
                <a-button type="primary" @click="setRemote(item)">{{ item.cmdName }}</a-button>
              </div>
              <a-textarea
                v-if="item.command.includes('=')"
                class="mt-[10px]"
                v-model:value="item.commandValue"
                :maxlength="100"
              />
            </div>
          </div>
        </div>
      </a-layout-sider>
    </a-layout>

    <record @register="registerModal" />
    <Loading :loading="data.loading" tip="拼命加载中！" />
  </div>
</template>

<script setup>
  import { deviceType, operateList, remoteSet } from '/@/api/admin/admin';
  import record from './component/record.vue';
  import { useModal } from '/@/components/Modal';
  import { nextTick, reactive } from 'vue';
  import { useMessage } from '../../../hooks/web/useMessage';
  const { createMessage } = useMessage();
  import { Loading } from '/@/components/Loading';
  const [registerModal, { openModal: openModal }] = useModal();
  const data = reactive({
    loading: false,
    badge: undefined,
    snCode: '',
    deviceTypeList: [],
    operateList: [],
    result: '',
    height: document.documentElement.clientHeight,
  });
  deviceType({}).then((deviceTypeRes) => {
    data.deviceTypeList = deviceTypeRes.data;
    data.badge = data.deviceTypeList[0].type;
    getOperateList(data.badge);
  });
  const open = (record) => {
    openModal(true, record);
  };
  const getOperateList = async (deviceType) => {
    data.result = '';
    let res = await operateList({ deviceType });
    if (res.code == 0) {
      if (res.data.length) {
        res.data.some((item) => {
          item.forEach((per) => {
            per.commandValue = '';
          });
        });
      }
      data.operateList = res.data;
    } else {
      data.operateList = [];
    }
  };
  const scrollTop = () => {
    let a = document.querySelectorAll('.ant-input-disabled');
    a[0].scrollTop = a[0].scrollHeight;
  };
  const setRemote = async (item) => {
    if (!data.snCode) return createMessage.warn('请输入snCode');
    data.loading = true;
    let res = await remoteSet({ ...item, snCode: data.snCode });
    data.loading = false;
    if (res.code == 0) {
      if (res.data) {
        data.result = data.result + '\n' + res.data;
      }
      nextTick(() => {
        scrollTop();
      });
      createMessage.success(item.cmdName + res.message);
    } else {
      createMessage.warn(res.message);
    }
  };
</script>

<style scoped></style>
