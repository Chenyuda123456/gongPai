<template>
  <BasicModal
    :width="800"
    @register="register"
    title="在线记录"
    :showOkBtn="false"
    :canFullscreen="false"
    cancelText="关闭"
  >
    <BasicTable :dataSource="data.result" @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'online'">
          {{ record.online == 0 ? '离线' : '在线' }}
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { nextTick, reactive } from 'vue';
  import { onlineRecords } from '/@/api/admin/admin';

  const data = reactive({
    result: [],
    opt: {},
  });
  const [register] = useModalInner(async (opt) => {
    data.opt = opt;
    nextTick(() => {
      setPagination({
        pageSize: 100,
        current: 1,
      });
      getList();
    });
  });
  const getList = async () => {
    const res = await onlineRecords({
      snCode: data.opt.snCode,
      page: getPaginationRef()['current'],
      pageSize: getPaginationRef()['pageSize'],
    });
    if (res.code == 0) {
      data.result = res.data.list;
      setPagination({
        total: res.data.total,
      });
    }
  };
  const [registerTable, { getPaginationRef, setPagination }] = useTable({
    columns: [
      {
        title: '时间',
        dataIndex: 'eventTime',
      },
      {
        title: '状态',
        dataIndex: 'online',
      },
    ],
    resizeHeightOffset: 150,
    bordered: true,
    pagination: {
      onChange() {
        nextTick(() => {
          getList();
        });
      },
    },
  });
</script>
<style lang="less" scoped>
  .img {
    width: 110px;
    height: 60px;
  }
</style>
