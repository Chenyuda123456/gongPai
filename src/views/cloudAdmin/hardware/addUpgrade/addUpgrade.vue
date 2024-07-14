<template>
  <BasicDrawer v-bind="$attrs" @register="register" :isDetail="true" title="新增升级任务">
    <page-wrapper title="一、新增升级类型" class="flex-1 bg-white">
      <template #headerContent>
        <BasicForm @register="registerFormBaseInfo">
          <template #chooseHardware>
            <div class="bg-[#fafafa] p-16px">
              <a-space :size="16">
                <div>{{ data.hardware.fileName || '--' }}</div>
                <a @click="ChooseHardwareFn">更换</a>
              </a-space>
              <div class="mt-16px">
                <a-space>
                  <div>版本号：</div>
                  <div>{{ data.hardware.version || '--' }}</div>
                </a-space>
                <br />
                <a-space>
                  <div>更新说明：</div>
                  <div>{{ data.hardware.updateDesc || '--' }}</div>
                </a-space>
              </div>
            </div>
          </template>
          <template #chooseConfigFile>
            <div class="bg-[#fafafa] p-16px">
              <a-space :size="16">
                <div>{{ data.config.fileName || '--' }}</div>
                <a @click="ChooseConfigFileFn">更换</a>
              </a-space>
              <a-textarea
                style="margin-top: 10px"
                v-model:value="data.configInfo"
                :disabled="true"
                :rows="4"
              />
            </div>
          </template>
        </BasicForm>
      </template>
    </page-wrapper>
    <page-wrapper title="二、设置升级范围" class="flex-1 bg-white" id="page-wrapper">
      <template #headerContent>
        <div class="flex">
          <div>
            <BasicForm @register="registerFormBaseInfoTwo">
              <template #rangeType="{ model, field }">
                <a-radio-group v-model:value="model[field]" name="radioGroup" @change="typeChange">
                  <a-radio :value="1">按客户</a-radio>
                  <a-radio :value="2">按客户门店</a-radio>
                  <a-radio :value="3">按设备</a-radio>
                  <a-radio :value="4">全部升级</a-radio>
                </a-radio-group>
              </template>
            </BasicForm>
            <div v-if="data.rangeType == 4" class="text-[red] ml-140px"
              >全部升级，是所有设备均进行升级，请谨慎选择。
            </div>
          </div>
          <div style="margin-right: 34px">
            <a-button type="primary" v-if="data.rangeType == 1" @click="addClientFn()">
              添加客户
            </a-button>
            <a-button type="primary" v-if="data.rangeType == 2" @click="addShopFn()">
              添加客户门店
            </a-button>
            <a-button type="primary" v-if="data.rangeType == 3" @click="addDeviceFn()">
              添加设备
            </a-button>
          </div>
        </div>
        <a-divider />
        <div class="px-16px">
          <a-alert type="info" show-icon v-if="data.rangeType != 4">
            <template #message>
              <template v-if="checkedKeys && checkedKeys.length > 0">
                <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
              </template>
              <template v-else>
                <span>未选中任何项目</span>
              </template>
            </template>
          </a-alert>
        </div>

        <BasicTable
          clsss="selfTable"
          @register="registerTable"
          v-if="data.rangeType != 4"
          :dataSource="data.displayDataSource"
        >
          <template #form-advanceBefore>
            <a-popconfirm
              :getPopupContainer="getPopupContainer"
              title="确认删除?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="batchDelete()"
            >
              <a-button type="primary" danger ghost>批量删除</a-button>
            </a-popconfirm>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction
                :actions="[
                  {
                    label: '删除',
                    popConfirm: {
                      title: '是否确认删除',
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
        <BasicForm @register="registerFormBlack">
          <template #black="{ model, field }">
            <div class="leading-36px">填写在黑名单里的设备则不升级。</div>
            <a-textarea
              :maxlength="200"
              placeholder="请折行输入设备SN码"
              v-model:value="model[field]"
            />
          </template>
        </BasicForm>
        <div class="text-center">
          <a-popconfirm
            :getPopupContainer="getPopupContainer"
            title="请确认上述内容已经填写正确，确定后即可生效，不能撤回。"
            ok-text="确认"
            cancel-text="取消"
            @confirm="saveAll()"
          >
            <a-button class="m-auto" type="primary">保存</a-button>
          </a-popconfirm>
        </div>
      </template>
    </page-wrapper>
    <chooseHardware @register="registerModalAddHardware" @ChooseHardwareRes="ChooseHardwareRes" />
    <chooseConfigFile @register="registerModalAddConfigFile" @ChooseConfigRes="ChooseConfigRes" />
    <addClient @register="registerModalAddClient" @addClientRes="addClientRes" />
    <addShop @register="registerModalAddShop" @addShopRes="addShopRes" />
    <addDevice @register="registerModalAddDevice" @addDeviceRes="addDeviceRes" />
  </BasicDrawer>
</template>

<script setup lang="ts">
  import chooseHardware from './component/chooseHardware.vue';
  import chooseConfigFile from './component/chooseConfigFile.vue';
  import addClient from './component/addClient.vue';
  import addShop from './component/addShop.vue';
  import addDevice from './component/addDevice.vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import {
    baseInfo,
    baseInfoBlack,
    baseInfoTwo,
    baseFormConfigOne,
    baseFormConfigTwo,
    baseFormConfigThree,
    baseColumnOne,
    baseColumnTwo,
    baseColumnThree,
  } from './schemas';
  import { reactive, watch, computed, onMounted, nextTick, provide, defineEmits, ref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deviceType, taskCreate, configInfo, taskDetail } from '/@/api/admin/admin';

  const scrollTop = () => {
    let a = document.querySelectorAll('.scrollbar__wrap');
    a[1].scrollTop = 0;
  };
  const { createMessage } = useMessage();
  const emit = defineEmits(['reload', 'register']);
  // 第二步的key
  const rowKey = ref('customerId');
  const [register, { closeDrawer }] = useDrawerInner(async (option) => {
    let deviceTypeRes = await deviceType({});
    data.deviceTypeList = deviceTypeRes.data;
    resetInitData();
    rowKey.value = 'customerId';
    nextTick(async () => {
      await resetFields();
      await resetFieldsBlackList();
      data.deviceTypeName = undefined;
      await setFieldsValueTwo({
        rangeType: 1,
      });
      await setFieldsValue({
        upgradeType: option.upgradeType || 0,
      });
      data.rangeType = 1;
      if (option.taskId) {
        let res = await taskDetail(option);
        if (res.code == 0) {
          let otaRange = res.data.otaRange;
          let otaResource = res.data.otaResource;

          // 新增升级类型
          await setFieldsValue({
            upgradeType: otaRange.upgradeType,
            deviceType: option.deviceType,
            taskName: res.data.taskName,
            remark: res.data.remark,
          });
          // 资源有可能会被删除掉
          if (otaResource) {
            await setFieldsValue({
              hardwareId: otaRange.upgradeType ? undefined : otaResource.id,
              configId: otaRange.upgradeType ? otaResource.id : undefined,
            });
            data.hardware = otaRange.upgradeType == 0 ? otaResource : {};
            data.config = otaRange.upgradeType == 1 ? otaResource : {};
            if (otaRange.upgradeType == 1) {
              getConfigInfo(otaResource.id);
            }
          }
          data.deviceTypeName = data.deviceTypeList.filter(
            (item) => (item.type = option.deviceType),
          )[0]['name'];

          // 设置升级范围
          await setFieldsValueTwo({
            rangeType: otaRange.rangeType,
          });
          data.rangeType = otaRange.rangeType;
          if (otaRange.rangeType == 1) {
            rowKey.value = 'customerId';
            data.clientList = otaRange.selectValueList;
            data.deviceIds = otaRange.selectValueList.map((item) => {
              return item.customerId;
            });
          } else if (otaRange.rangeType == 2) {
            rowKey.value = 'shopId';
            data.shopList = otaRange.selectValueList;
            data.deviceIds = otaRange.selectValueList.map((item) => {
              return item.shopId;
            });
            getForm().updateSchema([
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
          } else if (otaRange.rangeType == 3) {
            rowKey.value = 'snCode';
            data.deviceList = otaRange.selectValueList.map((item) => {
              return {
                ...item,
                snCode: item.value,
              };
            });
            data.deviceIds = otaRange.selectValueList.map((item) => {
              return item.value;
            });
          }
          // 黑名单
          await setFieldsValueBlack({
            blackList: res.data.blackList.join('\n'),
          });
        }
      }
      updateSchema([
        {
          field: 'deviceType',
          componentProps: {
            onChange: (val) => {
              if (val) {
                data.deviceTypeName = data.deviceTypeList.filter((item) => (item.type = val))[0][
                  'name'
                ];
              } else {
                data.deviceTypeName = null;
              }
              clearValidate('deviceType');
              resetInitData();
            },
          },
        },
      ]);
    });
  });

  const data: any = reactive({
    // 第一部分
    deviceTypeList: [], // 设备类型列表
    deviceType: undefined, // 设备类型
    deviceTypeName: '', // 设备类型name
    hardware: {}, // 选择的固件
    config: {}, // 选择的配置
    configInfo: '', //选择的配置信息
    // 第二部分
    rangeType: 1, // 升级范围类型
    clientIds: [], // 添加的客户id 同步子组件客户的选择数据
    clientList: [], // 添加的客户列表
    shopIds: [], // 添加的门店id 同步子组件商店的选择数据
    shopList: [], // 添加的门店列表
    deviceIds: [], // 添加的设备id 同步子组件设备的选择数据
    deviceList: [], // 添加的设备列表
    displayDataSource: [], // table显示的数据
    checkedKeysClient: [], // 选择的客户
    checkedKeysShop: [], // 选择的门店
    checkedKeysDevice: [], // 选择的设备
  });
  provide('allData', data);
  const getPopupContainer = computed(() => {
    return () => document.getElementById('page-wrapper');
  });
  // 重置
  const resetInitData = async () => {
    console.log('resetInitData');
    // 重置选择的 固件或者配置
    await setFieldsValue({ hardwareId: undefined, configId: undefined });
    await clearValidate(['hardwareId', 'configId']);
    data.hardware = {};
    data.config = {};
    data.configInfo = '';
    data.clientIds = [];
    data.clientList = [];
    data.shopIds = [];
    data.shopList = [];
    data.deviceIds = [];
    data.deviceList = [];
    data.displayDataSource = [];
    data.checkedKeysClient = [];
    data.checkedKeysShop = [];
    data.checkedKeysDevice = [];
  };
  const [registerModalAddHardware, { openModal: openModalChooseHardware }] = useModal();
  const [registerModalAddConfigFile, { openModal: openModalChooseConfigFile }] = useModal();
  const [registerModalAddClient, { openModal: openModalAddClient }] = useModal();
  const [registerModalAddShop, { openModal: openModalAddShop }] = useModal();
  const [registerModalAddDevice, { openModal: openModalAddDevice }] = useModal();
  // 第一步 form
  const [
    registerFormBaseInfo,
    { validate, updateSchema, setFieldsValue, clearValidate, resetFields, getFieldsValue },
  ] = useForm({
    labelWidth: 140,
    schemas: baseInfo,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  // 选择固件
  const ChooseHardwareFn = () => {
    if (!getFieldsValue().deviceType) return createMessage.warn('请先选择设备类型！');
    openModalChooseHardware(true, {
      deviceType: getFieldsValue().deviceType,
    });
  };
  const ChooseHardwareRes = (res) => {
    data.hardware = res;
    setFieldsValue({ hardwareId: res.id });
  };

  // 选择配置文件
  const ChooseConfigFileFn = () => {
    if (!getFieldsValue().deviceType) return createMessage.warn('请先选择设备类型！');
    openModalChooseConfigFile(true, {
      deviceType: getFieldsValue().deviceType,
    });
  };
  const ChooseConfigRes = (res) => {
    data.config = res;
    setFieldsValue({ configId: res.id });
    getConfigInfo(res.id);
  };
  // 第二步的类型选择
  const typeChange = (rangeType) => {
    data.rangeType = rangeType.target.value;
    nextTick(() => {
      if (data.rangeType == 2) {
        rowKey.value = 'shopId';
        getForm().updateSchema([
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
      }
      getForm().resetFields();
    });
  };
  // 第二步 form
  const [registerFormBaseInfoTwo, { setFieldsValue: setFieldsValueTwo }] = useForm({
    labelWidth: 140,
    compact: true,
    schemas: baseInfoTwo,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  // 第二步的form配置
  const formConfig = computed(() => {
    if (data.rangeType == 1) {
      return { ...baseFormConfigOne, submitFunc };
    } else if (data.rangeType == 2) {
      return {
        ...baseFormConfigTwo,
        submitFunc,
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
      };
    } else if (data.rangeType == 3) {
      return { ...baseFormConfigThree, submitFunc };
    }
  });
  // 第二步的column配置
  const tableColumn = computed(() => {
    if (data.rangeType == 1) {
      return baseColumnOne;
    } else if (data.rangeType == 2) {
      return baseColumnTwo;
    } else if (data.rangeType == 3) {
      return baseColumnThree;
    }
  });

  // 第二步过滤数据
  function filterClient() {
    let getFormRes: any = getForm?.()?.getFieldsValue();
    if (getFormRes?.customerName) {
      return data.clientList.filter((item: any) =>
        item.customerName.includes(getFormRes.customerName),
      );
    } else {
      return data.clientList;
    }
  }

  function filterShop() {
    let getFormRes: any = getForm?.()?.getFieldsValue();
    let res = Object.values(getFormRes)?.filter((item) => item);

    if (Object.keys(getFormRes)?.length && res.length) {
      return data.shopList.filter((item) => {
        let flag = true;
        Object.keys(getFormRes).map((per) => {
          if (getFormRes[per] != undefined && getFormRes[per] && item[per] != getFormRes[per]) {
            flag = false;
          }
        });
        return flag;
      });
    } else {
      return data.shopList;
    }
  }

  function filterDevice() {
    let getFormRes: any = getForm?.()?.getFieldsValue();
    if (getFormRes?.snCode) {
      return data.deviceList.filter((item: any) => item.snCode.includes(getFormRes.snCode));
    } else {
      return data.deviceList;
    }
  }

  watch(
    () => data.clientList,
    () => {
      // console.log('watch-data.clientList', data.clientList);
      data.displayDataSource = filterClient();
    },
  );
  watch(
    () => data.shopList,
    () => {
      // console.log('watch-data.clientList', data.shopList);
      data.displayDataSource = filterShop();
    },
  );
  watch(
    () => data.deviceList,
    () => {
      data.displayDataSource = filterDevice();
    },
  );
  function submitFunc(val) {
    console.log(val);
    console.log(rowKey.value);
    if (data.rangeType == 1) {
      data.displayDataSource = filterClient();
      nextTick(() => {
        rowKey.value = 'customerId';
      });
    } else if (data.rangeType == 2) {
      data.displayDataSource = filterShop();
      nextTick(() => {
        rowKey.value = 'shopId';
      });
    } else if (data.rangeType == 3) {
      data.displayDataSource = filterDevice();
      nextTick(() => {
        rowKey.value = 'snCode';
      });
    }
  }

  // 第二步选择的key
  let checkedKeys: any = computed({
    get: () => {
      if (data.rangeType == 1) {
        return data.checkedKeysClient;
      } else if (data.rangeType == 2) {
        return data.checkedKeysShop;
      } else if (data.rangeType == 3) {
        return data.checkedKeysDevice;
      } else {
        return [];
      }
    },
    set: (val) => {
      if (data.rangeType == 1) {
        data.checkedKeysClient = val;
      } else if (data.rangeType == 2) {
        data.checkedKeysShop = val;
      } else if (data.rangeType == 3) {
        data.checkedKeysDevice = val;
      }
    },
  });

  function onSelect(record, selected) {
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, record[rowKey.value]];
    } else {
      checkedKeys.value = checkedKeys.value.filter((id) => id !== record[rowKey.value]);
    }
  }

  function onSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item[rowKey.value]);
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, ...changeIds];
    } else {
      checkedKeys.value = checkedKeys.value.filter((id) => {
        return !changeIds.includes(id);
      });
    }
  }

  // 配置table
  const [registerTable, { getForm }] = useTable({
    canResize: false,
    columns: tableColumn,
    clickToRowSelect: false,
    useSearchForm: true,
    formConfig: formConfig,
    showIndexColumn: false,
    rowKey: rowKey,
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: checkedKeys,
      onSelect: onSelect,
      onSelectAll: onSelectAll,
    },
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
  });
  // 第二步批量删除
  const batchDelete = () => {
    console.log(checkedKeys.value);
    console.log(rowKey.value);
    console.log(data.rangeType);
    if (checkedKeys.value.length == 0) {
      return createMessage.warn('请先选择！');
    }
    if (data.rangeType == 1) {
      data.clientList = data.clientList.filter((item) => {
        return !checkedKeys.value.some((per) => per == item[rowKey.value]);
      });
      console.log(data.clientList);
      data.clientIds = data.clientIds.filter((item) => {
        return !checkedKeys.value.some((per) => per == item);
      });
    } else if (data.rangeType == 2) {
      data.shopList = data.shopList.filter((item) => {
        return !checkedKeys.value.some((per) => per == item[rowKey.value]);
      });
      data.shopIds = data.shopIds.filter((item) => {
        return !checkedKeys.value.some((per) => per == item);
      });
    } else {
      data.deviceList = data.deviceList.filter((item) => {
        return !checkedKeys.value.some((per) => per == item[rowKey.value]);
      });
      data.deviceIds = data.deviceIds.filter((item) => {
        return !checkedKeys.value.some((per) => per == item);
      });
    }
    checkedKeys.value = [];
  };
  // 第二步删除
  const handleDelete = (record) => {
    console.log(record);
    console.log(rowKey.value);
    if (data.rangeType == 1) {
      data.clientList = data.clientList.filter(
        (item) => item[rowKey.value] !== record[rowKey.value],
      );
      data.clientIds = data.clientIds.filter((item) => item !== record[rowKey.value]);
    } else if (data.rangeType == 2) {
      data.shopList = data.shopList.filter((item) => item[rowKey.value] !== record[rowKey.value]);
      data.shopIds = data.shopIds.filter((item) => item !== record[rowKey.value]);
    } else {
      data.deviceList = data.deviceList.filter(
        (item) => item[rowKey.value] !== record[rowKey.value],
      );
      data.deviceIds = data.deviceIds.filter((item) => item !== record[rowKey.value]);
    }
    checkedKeys.value = checkedKeys.value.filter((item) => {
      return item != record[rowKey.value];
    });
  };

  // 黑名单
  const [
    registerFormBlack,
    {
      getFieldsValue: getFieldsValueBlack,
      setFieldsValue: setFieldsValueBlack,
      resetFields: resetFieldsBlackList,
    },
  ] = useForm({
    labelWidth: 140,
    schemas: baseInfoBlack,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  // 添加客户
  const addClientFn = () => {
    if (!getFieldsValue().deviceType) {
      createMessage.warn('请先选择设备类型！');
      scrollTop();
      return;
    }
    openModalAddClient(true, {
      deviceType: getFieldsValue().deviceType,
    });
  };
  const addClientRes = (res) => {
    data.clientIds = res.ids;
    data.clientList = res.list;
  };
  // 添加门店
  const addShopFn = () => {
    if (!getFieldsValue().deviceType) {
      createMessage.warn('请先选择设备类型！');
      scrollTop();
      return;
    }
    openModalAddShop(true, {
      deviceType: getFieldsValue().deviceType,
    });
  };
  const addShopRes = (res) => {
    data.shopIds = res.ids;
    data.shopList = res.list;
  };
  // 添加设备
  const addDeviceFn = () => {
    if (!getFieldsValue().deviceType) {
      createMessage.warn('请先选择设备类型！');
      scrollTop();
      return;
    }
    openModalAddDevice(true, {
      deviceType: getFieldsValue().deviceType,
    });
  };
  const addDeviceRes = (res) => {
    data.deviceIds = res.ids;
    data.deviceList = res.list;
  };
  const getConfigInfo = async (resourceId) => {
    const configInfoRes = await configInfo({ resourceId });
    data.configInfo = configInfoRes.data;
  };
  const saveAll = async () => {
    // 第一步的数据
    const getFieldsValueRes = await getFieldsValue();
    console.log(getFieldsValueRes);
    if (getFieldsValueRes.upgradeType == 0) {
      if (
        !getFieldsValueRes.taskName ||
        !getFieldsValueRes.deviceType ||
        !getFieldsValueRes.hardwareId
      ) {
        scrollTop();
        createMessage.warn('请填写完整！');
      }
    } else {
      if (
        !getFieldsValueRes.taskName ||
        !getFieldsValueRes.deviceType ||
        !getFieldsValueRes.configId
      ) {
        scrollTop();
        createMessage.warn('请填写完整！');
      }
    }

    const validateData = await validate();
    // 第二步的数据
    const selectValueList: any = [];
    if (data.rangeType == 1) {
      data.clientList.forEach((item) => {
        selectValueList.push({
          customerId: item.customerId,
          shopId: null,
          value: item.customerId,
        });
      });
      if (!selectValueList.length) {
        createMessage.warn('请添加客户！');
        return;
      }
    } else if (data.rangeType == 2) {
      data.shopList.forEach((item) => {
        selectValueList.push({
          customerId: item.customerId,
          shopId: item.shopId,
          value: item.shopId,
        });
      });
      if (!selectValueList.length) {
        createMessage.warn('请添加客户门店！');
        return;
      }
    } else if (data.rangeType == 3) {
      data.deviceList.forEach((item) => {
        selectValueList.push({
          customerId: item.customerId,
          shopId: item.shopId,
          value: item.snCode,
        });
      });
      if (!selectValueList.length) {
        createMessage.warn('请添加设备！');
        return;
      }
    }
    // 黑名单
    const blackList = getFieldsValueBlack()
      ?.blackList?.split('\n')
      .filter((item) => {
        return item;
      });
    const subObj = {
      rangeType: data.rangeType,
      ...validateData,
      selectValueList,
      blackList,
      resourceId: validateData.upgradeType ? validateData.configId : validateData.hardwareId,
    };

    const res = await taskCreate(subObj);
    if (res.code == 0) {
      emit('reload');
      closeDrawer();
      createMessage.success('新增升级任务成功！');
    } else {
      createMessage.warn(res.message);
    }
  };
  onMounted(async () => {});
</script>

<style lang="less"></style>
