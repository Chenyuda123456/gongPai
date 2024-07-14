<template>
  <div>
    <div class="flex">
      <page-wrapper title="基本信息" class="flex-1 bg-white">
        <template #headerContent>
          <BasicForm @register="registerFormBaseInfo">
            <template #name>{{ data.baseInfo.companyName }}</template>
            <template #count>{{ data.baseInfo.account }} </template>
            <template #id>{{ data.baseInfo.id }} </template>
            <template #time>{{ data.baseInfo.createTime }} </template>
            <template #modify> <a-button type="primary"> 修改密码 </a-button></template>
          </BasicForm>
        </template>
      </page-wrapper>
      <page-wrapper title="消息管理" class="flex-1 bg-white">
        <template #headerContent>
          <BasicForm @register="registerFormMessageManage">
            <template #mail>
              <div class="flex">
                <div class="w-[300px]">
                  <div style="word-wrap: break-word; white-space: normal; word-break: break-all">
                    {{ data.baseInfo.noticeEmails }}
                  </div>
                </div>
                <div class="ml-[20px]">
                  <a @click="mailModify">修改</a>
                </div>
              </div>
            </template>
            <template #phone>
              <div class="flex">
                <div class="w-[300px]">
                  <div> {{ data.baseInfo.noticePhones }} </div>
                </div>
                <div class="ml-[20px]">
                  <a @click="mailModify">修改</a>
                </div>
              </div>
            </template>
          </BasicForm>
        </template>
      </page-wrapper>
    </div>
    <BasicTable
      class="p-[16px] bg-white mt-[1px]"
      @register="registerTable"
      :dataSource="data.result"
    >
      <template #toolbar>
        <a-button type="primary" @click="addShopFn()">新增门店</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'"> {{ record.name }}(ID{{ record.id }}) </template>
        <template v-if="column.key === 'parentShopName'">
          {{ record.parentShopName ? `${record.parentShopName}(ID${record.parentShopId})` : '' }}
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: addShopFn.bind(null, record),
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title:
                    '删除门店后，绑定账号登录后会变成初始化，所有该门店下的设备也不能继续使用。',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <addShop @reload="getList" @register="registerModal" />
    <Modify @reload="getBaseInfo" @register="registerModalModify" />
  </div>
</template>

<script setup lang="ts">
  import addShop from './component/addShop.vue';
  import Modify from './component/modify.vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { baseInfo, messageManage, column } from './schemas';
  import { nextTick, onMounted, reactive } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { basicInfo, customerShops, shopsRemove } from '/@/api/manage/manage';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const data = reactive({
    mail: false,
    phone: false,
    result: [],
    baseInfo: {
      companyName: '',
      account: '',
      contactName: '',
      contactPhone: '',
      createTime: '',
      id: '',
      noticeEmails: '',
      noticePhones: '',
    },
  });
  const [registerModal, { openModal }] = useModal();
  const [registerModalModify, { openModal: openModalModify }] = useModal();

  const [registerFormBaseInfo] = useForm({
    labelWidth: 140,
    schemas: baseInfo,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const [registerFormMessageManage] = useForm({
    labelWidth: 140,
    schemas: messageManage,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const [registerTable, { getPaginationRef, setPagination }] = useTable({
    title: '门店管理',
    columns: column,
    showIndexColumn: true,
    rowKey: 'id',
    actionColumn: {
      width: 160,
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
  const mailModify = () => {
    openModalModify(true, {
      baseInfo: data.baseInfo,
    });
  };

  const addShopFn = (record) => {
    openModal(true, {
      record,
    });
  };
  const handleDelete = async (record) => {
    let res = await shopsRemove({ id: record.id });
    if (res.code == 0) {
      createMessage.success('删除成功！');
      getList();
    } else {
      console.log(res);
      createMessage.error(res.message);
    }
  };
  const getBaseInfo = async () => {
    const res = await basicInfo({});
    if (res.code == 0) {
      data.baseInfo = res.data;
    } else {
      createMessage.error(res.message);
    }
  };
  const getList = async () => {
    let res = await customerShops({
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
    });
    console.log(res);
    if (res.code == 0) {
      data.result = res.data.list;
      setPagination({
        total: res.data.total,
      });
    }
  };
  onMounted(() => {
    getBaseInfo();
    getList();
  });
</script>

<style scoped></style>
