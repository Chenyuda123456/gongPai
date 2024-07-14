<template>
  <div>
    <Loading :loading="data.loading" tip="文件下载中，请勿关闭页面！" />
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
        <a-button :loading="data.chooseLoading" type="primary" @click="batchAdd(true)"
          >导出选中</a-button
        >
        <a-button :loading="data.allChooseLoading" type="primary" @click="batchAdd(false)"
          >导出全部查询结果</a-button
        >
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
                  label: '查看',
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
  import { Loading } from '/@/components/Loading';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { baseInfo, baseColumn } from './schemas.ts';
  import { nextTick, onMounted, reactive, ref } from 'vue';
  import { logPage, logDownload, logLook, logDownloadBatch } from '/@/api/admin/admin';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const checkedKeys = ref([]);
  const data = reactive({
    deviceType: '',
    result: [],
    loading: false,
    downloadList: [],
    chooseLoading: false,
    allChooseLoading: false,
  });
  const getList = async () => {
    const formData = getForm().getFieldsValue();
    let res = await logPage({
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
        span: 24,
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
    let res = await logDownload({ fileIds: record.id, type: 0 });
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
  const batchAdd = async (val) => {
    if (val) {
      if (!checkedKeys.value.length) {
        createMessage.warn('请先选择！');
      } else {
        createMessage.success('下载中请勿刷新或关闭页面！');
        data.chooseLoading = true;
        let res = await logDownloadBatch({ fileIds: checkedKeys.value.join(','), type: 0 }); // 0-日志，1-音频
        console.log(res);
        data.chooseLoading = false;
        if (!res.fileName) {
          const reader = new FileReader();
          reader.readAsText(res, 'utf-8');
          reader.onload = () => {
            const json = JSON.parse(reader.result);
            console.log(json);
            createMessage.error(json.message);
          };
        }
      }
    } else {
      createMessage.success('下载中请勿刷新或关闭页面！');
      data.allChooseLoading = true;
      let res = await logDownloadBatch({ type: 0, ...getForm().getFieldsValue() });
      data.allChooseLoading = false;
      if (!res.fileName) {
        const reader = new FileReader();
        reader.readAsText(res, 'utf-8');
        reader.onload = () => {
          const json = JSON.parse(reader.result);
          console.log(json);
          createMessage.error(json.message);
        };
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
  onMounted(() => {
    getList();
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
  });
</script>
