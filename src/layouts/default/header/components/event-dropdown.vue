<template>
  <a-dropdown>
    <a-badge class="badgeHover" :count="data.total">
      <a-avatar style="background: transparent; transform: scale(0.9)">
        <template #icon>
          <BellOutlined style="transform: scale(1.1)" />
        </template>
      </a-avatar>
    </a-badge>
    <template #overlay>
      <a-menu>
        <div v-for="item in data.list" :key="item.eventId">
          <a-menu-item>
            <div>
              <a-row type="flex" justify="space-between" align="middle">
                <a-col>{{ item.eventTime }}</a-col>
                <a-col>
                  <a-button size="small" @click="handler(item)">处理</a-button>
                </a-col>
              </a-row>
              <a-row class="blueColor" type="flex" align="middle" style="margin-top: 6px">
                <a-col style="margin-right: 6px">
                  <VideoCameraTwoTone style="cursor: pointer" @click="play(item)" />
                </a-col>
                <a-col @click="jump()"
                  >{{ item.position }}监听到‘{{ item.eventName }}’，点击查看预警记录
                </a-col>
              </a-row>
            </div>
          </a-menu-item>
          <a-divider style="margin: 2px" />
        </div>
        <div :key="data.current" style="display: flex; justify-content: flex-end; padding: 12px">
          <a-pagination
            v-model:current="data.current"
            :total="data.total"
            size="small"
            :showSizeChanger="false"
            :showQuickJumper="false"
            @change="paginationChange"
          />
        </div>
      </a-menu>
    </template>
  </a-dropdown>
  <FormModal @register="registerModal" />
  <Teleport to="body" />
  <div ref="waveform" style="height: 0; width: 0; overflow: hidden"></div>
</template>
<script lang="ts" setup>
  import { useWarnStore } from '/@/store/modules/warn';
  import { VideoCameraTwoTone } from '@ant-design/icons-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import { useRouter } from 'vue-router';
  import FormModal from '/@/views/modules/monitor/alarmRecord/FormModal.vue';
  import AButton from '/@/components/Button/src/BasicButton.vue';
  import { eventList } from '/@/api/modules/monitor/alarmRecord';
  import { reactive, onMounted, ref, watch } from 'vue';

  const router = useRouter();
  const [registerModal, { openModal }] = useModal();
  const warnStore = useWarnStore();
  watch(
    () => warnStore.isUpdate,
    () => {
      init();
    },
  );
  const waveform = ref();
  const data = reactive({
    list: [],
    current: 1,
    total: 0,
    videoUrl: '',
    videoId: '',
  });
  onMounted(() => {
    init();
  });
  const init = async () => {
    let res = await eventList({
      status: 0,
      current: data.current,
      size: 10,
    });
    data.total = res.total;
    data.list = res.records;
  };

  const handler = (record) => {
    openModal(true, {
      eventId: [record.eventId],
      isUpdate: true,
    });
  };
  const play = (record) => {
    data.videoUrl = record.videoUrl;
    data.videoId = record.videoId;
  };

  const paginationChange = (val) => {
    data.current = val;
    init();
  };
  const restoreUrl = () => {
    data.videoUrl = '';
    data.videoId = '';
  };
  const jump = () => {
    router.push('AlarmRecord');
  };
</script>
<style lang="less">
  .badgeHover {
    cursor: pointer;
    height: 48px;
    width: 36px;
    display: flex !important;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #485573;
    }

    .ant-badge-count {
      transform: scale(0.8);
      right: 0px;
      top: 6px;
    }
  }

  .blueColor {
    color: #1890ff;
  }
</style>
