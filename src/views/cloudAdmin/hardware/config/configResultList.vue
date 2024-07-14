<template>
  <BasicDrawer v-bind="$attrs" @register="register" :isDetail="true" title="配置升级结果">
    <div>
      <div class="flex mb-0 bg-white">
        <div class="left">
          <div class="head flex">
            <div class="item">设备类型</div>
            <div class="item">配置文件</div>
          </div>
          <div class="content flex">
            <div class="item">{{ data.record.deviceType }}</div>
            <div class="item text-[#0960bd] cursor-pointer" @click="lookConfig(data.record)">{{
              data.record.fileName
            }}</div>
          </div>
        </div>
        <div class="right flex-1">
          <div class="top">
            <div class="head flex">
              <div class="item">已升级设备数</div>
              <div class="item">待升级设备数</div>
              <div class="item">升级中设备数</div>
              <div class="item">升级范围</div>
            </div>
            <div class="content flex">
              <div class="item">{{ data.statistic.successNum }}</div>
              <div class="item">{{ data.statistic.waitNum }}</div>
              <div class="item">{{ data.statistic.upgradingNum }}</div>
              <div class="item cursor-pointer text-[#0960bd]" @click="openRange(data.record)"
                >{{ getRange(data.record.rangeType) }}
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="head flex">
              <div class="item">取消升级设备数</div>
              <div class="item">升级失败设备数</div>
              <div class="item">文件下载中</div>
              <div class="item">无需升级设备数</div>
            </div>
            <div class="content flex">
              <div class="item">{{ data.statistic.cancelNum }}</div>
              <div class="item">{{ data.statistic.failureNum }}</div>
              <div class="item">{{ data.statistic.downloadingNum }}</div>
              <div class="item">{{ data.statistic.noRequiredNum }}</div>
            </div>
          </div>
        </div>
      </div>

      <BasicTable @register="registerTable" :data-source="data.result">
        <template #toolbar>
          <a-button type="primary" @click="fileExoport">导出全部结果</a-button>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'resultCode'">
            <span
              :style="{
                color: getStatusColor(record.resultCode),
              }"
              >{{ getStatus(record.resultCode) }}</span
            >
          </template>

          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: '再次推送',
                  onClick: again.bind(null, record),
                  disabled:
                    (record.resultCode != -1 && record.resultCode != 0) ||
                    !record.isLatest ||
                    record.btn
                      ? true
                      : false,
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
      <rangeClientUpgrade @reload="getList" @register="registerDrawerRangeClient" />
      <rangeShopUpgrade @reload="getList" @register="registerDrawerRangeShop" />
      <rangeDeviceUpgrade :title="'设备'" @reload="getList" @register="registerDrawerRangeDevice" />
      <configDetile @register="registerModalConfigDetail" />
    </div>
    <Loading :loading="data.loading" tip="文件下载中，请勿关闭页面！" />
  </BasicDrawer>
</template>
<script setup lang="ts">
  import { Loading } from '/@/components/Loading';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { baseSuccessInfo, baseSuccessColumn } from './schemas.ts';
  import { nextTick, onMounted, reactive } from 'vue';
  import { BasicDrawer, useDrawer, useDrawerInner } from '/@/components/Drawer';
  import { otaResultExport, resultCount, resultPage, taskAgain } from '/@/api/admin/admin';
  import rangeClientUpgrade from '/@/views/cloudAdmin/hardware/range/rangeClientUpgrade.vue';
  import rangeShopUpgrade from '/@/views/cloudAdmin/hardware/range/rangeShopUpgrade.vue';
  import rangeDeviceUpgrade from '/@/views/cloudAdmin/hardware/range/rangeDeviceUpgrade.vue';
  import configDetile from '/@/views/cloudAdmin/hardware/config/component/configDetile.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  const { createMessage } = useMessage();
  const [registerDrawerRangeClient, { openDrawer: openDrawerRangeClient }] = useDrawer();
  const [registerDrawerRangeShop, { openDrawer: openDrawerRangeShop }] = useDrawer();
  const [registerDrawerRangeDevice, { openDrawer: openDrawerRangeDevice }] = useDrawer();
  const [registerModalConfigDetail, { openModal: openModalConfigDetail }] = useModal();
  const data = reactive({
    result: [],
    record: {},
    statistic: {},
    loading: false,
  });
  const [register] = useDrawerInner(async (option) => {
    data.record = option;
    const rangeStatisticsRes = await resultCount({
      rangeType: data.record.rangeType,
      taskId: data.record.taskId,
    });
    data.statistic = { ...rangeStatisticsRes.data };
    nextTick(async () => {
      await getForm().resetFields();
      await getForm().updateSchema([
        {
          field: 'customerId',
          componentProps: {
            onChange: (val) => {
              getForm().updateSchema([
                {
                  field: 'shopId',
                  componentProps: {
                    params: {
                      customerId: val,
                    },
                  },
                },
              ]);
              getForm().setFieldsValue({ shopId: undefined });
            },
          },
        },
        {
          field: 'shopId',
          componentProps: {
            onClick: () => {
              if (!getForm().getFieldsValue().customerId) {
                createMessage.warning('请先选择客户后再选门店!');
              }
            },
          },
        },
      ]);
    });
  });
  const getRange = (val) => {
    if (val == 1) {
      return '按客户';
    } else if (val == 2) {
      return '按客户门店';
    } else if (val == 3) {
      return '按设备';
    } else if (val == 4) {
      return '全部升级';
    }
  };
  const getStatus = (val) => {
    if (val == 1) {
      return '成功';
    } else if (val == -1) {
      return '失败';
    } else if (val == 0) {
      return '待升级';
    } else if (val == 2) {
      return '取消升级';
    } else if (val == 3) {
      return '无需升级';
    } else if (val == 4) {
      return '文件下载中';
    } else if (val == 5) {
      return '升级中';
    }
  };
  const getStatusColor = (val) => {
    if (val == 1) {
      return '#0960bd';
    } else if (val == -1) {
      return 'red';
    } else {
      return 'green';
    }
  };
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await resultPage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      ...formData,
      taskId: data.record.taskId,
      resourceType: 1, // 升级类型 0-固件；1-配置单
    });
    if (res.code == 0) {
      res.data.list.forEach((item) => {
        item.btn = false;
      });
      data.result = res.data.list;
      setPagination({
        total: res.data.total,
      });
    }
  };
  const [registerTable, { getForm, setPagination, getPaginationRef }] = useTable({
    columns: baseSuccessColumn,
    clickToRowSelect: false,
    useSearchForm: true,
    formConfig: {
      submitFunc: () => {
        setPagination({ current: 1 });
        getList();
      },
      resetFunc: () => {
        getForm().updateSchema([
          {
            field: 'shopId',
            componentProps: {
              params: {
                customerId: null,
              },
            },
          },
        ]);
      },
      showAdvancedButton: false,
      actionColOptions: {
        span: 18,
      },
      labelWidth: 100,
      schemas: baseSuccessInfo,
    },
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
    pagination: {
      onChange() {
        nextTick(() => {
          getList();
        });
      },
    },
  });
  const again = async (record) => {
    record.btn = true;
    let res = await taskAgain({
      deviceCategory: record.deviceCategory,
      resourceId: data.record.resourceId,
      snCodeList: [record.snCode],
      taskId: data.record.taskId,
      otaResultId: record.id,
    });
    res.message && createMessage.warning(res.message);
    setTimeout(() => {
      record.btn = false;
    }, 2000);
  };
  const openRange = (record) => {
    if (record.rangeType == 1) {
      openDrawerRangeClient(true, record);
    } else if (record.rangeType == 2) {
      openDrawerRangeShop(true, record);
    } else if (record.rangeType == 3) {
      openDrawerRangeDevice(true, record);
    }
  };
  const fileExoport = async () => {
    createMessage.success('下载中请勿刷新或关闭页面！');
    await otaResultExport({ taskId: data.record.taskId });
  };
  const lookConfig = (record) => {
    openModalConfigDetail(true, record);
  };
  onMounted(() => {});
</script>

<style scoped lang="less">
  .left {
    border: 1px solid #e5e7eb;
    text-align: center;
    width: 40%;

    .item {
      width: 50%;
      padding: 12px 8px;
    }

    .head {
      background: #fafafa;
      border-bottom: 1px solid #e5e7eb;

      .item {
      }
    }

    .content {
      .item {
        background: #fff;
        height: 137px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .right {
    border: 1px solid #e5e7eb;
    border-left: 0;
    border-top: 0;
    text-align: center;

    .item {
      width: 50%;
      padding: 12px 8px;
    }

    .head {
      background: #fafafa;
      border-bottom: 1px solid #e5e7eb;
      border-top: 1px solid #e5e7eb;

      .item {
      }
    }

    .content {
      .item {
        background: #fff;
      }
    }
  }
</style>
