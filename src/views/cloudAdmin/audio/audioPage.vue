<template>
  <div>
    <BasicTable @register="registerTable" :dataSource="data.result">
      <template #headerTop>
        <a-alert type="info" show-icon>
          <template #message>
            <template v-if="checkedKeys.length > 0">
              <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
            </template>
            <template v-else>
              <span>未选中任何项目</span>
            </template>
          </template>
        </a-alert>
      </template>
      <template #toolbar>
        <span style="color: red; margin-left: 10px">
          <!--          重推音频是把选中的音频重新转写和送质检。-->
        </span>
        <a-button type="primary" :loading="data.chooseLoading" @click="batchPush(true)"
          >重推选中音频</a-button
        >
        <a-popconfirm
          title="请确认重推全部查询结果。"
          ok-text="确认"
          cancel-text="取消"
          @confirm="batchPush(false)"
        >
          <a-button :loading="data.allChooseLoading" type="primary">重推全部查询结果</a-button>
        </a-popconfirm>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'fileName'">
          <div class="cursor-pointer ant-table-cell-ellipsis" @click="copyFn(record.fileName)">
            {{ record.fileName }}</div
          >
        </template>
        <template v-if="column.key === 'storeType'">
          {{ record.storeType == 0 ? 'oss' : record.storeType == 1 ? 'minio' : 'tos' }}
        </template>
        <template v-if="column.key === 'action' && record.storeType != 1">
          <div class="flex align-center justify-center">
            <TableAction
              :actions="[
                {
                  label: '播放',
                  onClick: play.bind(null, record),
                },
              ]"
            />
            <a-divider style="margin-top: 6px" type="vertical" />
            <span class="text-[#0960bd]" v-if="data.downloadList.includes(record.fileName)">
              <LoadingOutlined /> 下载
            </span>
            <span v-else class="text-[#0960bd] cursor-pointer" @click="singleDownLoad(record)"
              >下载</span
            >
          </div>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script setup>
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { baseInfo, baseColumn } from './schemas.ts';
  import { nextTick, onMounted, reactive, ref } from 'vue';
  import { audioPage, pushAgain, logDownload, logLook } from '/@/api/admin/admin';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const checkedKeys = ref([]);
  const data = reactive({
    deviceType: '',
    result: [],
    chooseLoading: false,
    allChooseLoading: false,
    downloadList: [],
  });
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await audioPage({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
      deviceType: data.deviceType,
      ...formData,
    });
    if (res.code == 0) {
      data.result = res.data.records;
      setPagination({
        total: res.data.total,
      });
    }
  };

  const [registerTable, { getForm, getPaginationRef, setPagination }] = useTable({
    // canResize: false,
    clickToRowSelect: false,
    columns: baseColumn,
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
        span: 6,
      },
      labelWidth: 100,
      schemas: baseInfo,
    },
    rowKey: 'id',
    showIndexColumn: false,
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: checkedKeys,
      onSelect: onSelect,
      onSelectAll: onSelectAll,
      getCheckboxProps: getCheckboxProps,
    },
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
    pagination: {
      onChange() {
        nextTick(() => {
          getList();
        });
      },
    },
  });

  function onSelect(record, selected) {
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, record.id];
    } else {
      checkedKeys.value = checkedKeys.value.filter((id) => id !== record.id);
    }
  }
  function onSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.id);
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, ...changeIds];
    } else {
      checkedKeys.value = checkedKeys.value.filter((id) => {
        return !changeIds.includes(id);
      });
    }
  }

  function getCheckboxProps(record) {
    return {
      disabled: record.customerId === '0', // Column configuration not to be checked
    };
  }
  // 推送
  const batchPush = async (val) => {
    if (val) {
      if (!checkedKeys.value.length) {
        createMessage.warn('请先选择！');
        return;
      } else {
        data.chooseLoading = true;
        let res = await pushAgain({ fileIds: checkedKeys.value.join(',') });
        if (res.code == 0) {
          createMessage.success(res.message);
        } else {
          createMessage.error(res.message);
        }
        data.chooseLoading = false;
      }
    } else {
      data.allChooseLoading = true;
      let res = await pushAgain(getForm().getFieldsValue());
      if (res.code == 0) {
        createMessage.success(res.message);
      } else {
        createMessage.error(res.message);
      }
      data.allChooseLoading = false;
    }
  };
  const play = async (record) => {
    let res = await logLook({ storeType: record.storeType, storeUrl: record.storeUrl, type: 0 });
    if (res.code == 0) {
      window.open(res.data, '_blank');
    } else {
      createMessage.error(res.message);
    }
  };
  const singleDownLoad = async (record) => {
    createMessage.success('下载中请勿刷新或关闭页面！');
    data.downloadList.push(record.fileName);
    let res = await logDownload({ fileIds: record.id, type: 1 });
    if (!res.fileName) {
      const reader = new FileReader();
      reader.readAsText(res, 'utf-8');
      reader.onload = () => {
        const json = JSON.parse(reader.result);
        console.log(json);
        createMessage.error(json.message);
        data.downloadList = data.downloadList.filter((item) => {
          return !json.message.includes(item);
        });
      };
    } else {
      data.downloadList = data.downloadList.filter((item) => {
        return item != res.fileName;
      });
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
  onMounted(async () => {
    let obj = route.query;
    if (route.query.startTime) {
      obj['[uploadStartTime, uploadEndTime]'] = [route.query.startTime, route.query.endTime];
    }
    await getForm().setFieldsValue(obj);

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
    nextTick(() => {
      getList();
    });
  });
</script>
