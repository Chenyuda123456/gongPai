<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="['system:sysMenu:add']"
          type="primary"
          @click="handleCreate"
          preIcon="ant-design:plus-outlined"
          >新增</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'menuType'">
          <Tag color="warning" v-if="record.menuType === 'dir'">
            {{ formatDictValue(sysMenuTypeOptions, record.menuType) }}
          </Tag>
          <Tag color="processing" v-if="record.menuType === 'menu'">
            {{ formatDictValue(sysMenuTypeOptions, record.menuType) }}
          </Tag>
          <Tag color="default" v-if="record.menuType === 'button'">
            {{ formatDictValue(sysMenuTypeOptions, record.menuType) }}
          </Tag>
        </template>
        <template v-if="column.key === 'icon'">
          <Icon :icon="record.icon" />
        </template>
        <template v-if="column.key === 'keepalive'">
          <Tag v-if="record.keepalive" :color="record.keepalive === '0' ? 'processing' : 'error'">
            {{ formatDictValue(sysKeepaliveOptions, record.keepalive) }}
          </Tag>
        </template>
        <template v-if="column.key === 'linkExternal'">
          <Tag
            v-if="record.linkExternal"
            :color="record.linkExternal === '0' ? 'processing' : 'error'"
          >
            {{ formatDictValue(sysLinkExternalOptions, record.linkExternal) }}
          </Tag>
        </template>
        <template v-if="column.key === 'visible'">
          <Tag v-if="record.visible" :color="record.visible === '0' ? 'processing' : 'error'">
            {{ formatDictValue(sysVisibleOptions, record.visible) }}
          </Tag>
        </template>
        <template v-if="column.key === 'frame'">
          <Tag v-if="record.frame" :color="record.frame === '0' ? 'processing' : 'error'">
            {{ formatDictValue(sysFrameOptions, record.frame) }}
          </Tag>
        </template>
        <template v-if="column.key === 'status'">
          <Tag v-if="record.status" :color="record.status === '0' ? 'processing' : 'error'">
            {{ formatDictValue(sysStatusOptions, record.status) }}
          </Tag>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                auth: ['system:sysMenu:edit'],
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                auth: ['system:sysMenu:remove'],
                icon: 'ant-design:delete-outlined',
                tooltip: '删除',
                color: 'error',
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
    <FormModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { nextTick, onBeforeMount, ref, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon/index';
  import FormModal from './FormModal.vue';
  import { columns, searchFormSchema } from './data';

  import { fetchList, removeObj } from '/@/api/modules/system/sysMenuApi';
  import { listDictModel } from '/@/api/common';
  import { formatDictValue } from '/@/utils';

  const emit = defineEmits(['refresh-tree']);

  const props = defineProps({
    nodeId: { type: String },
  });

  const sysMenuTypeOptions = ref([]);
  const sysKeepaliveOptions = ref([]);
  const sysLinkExternalOptions = ref([]);
  const sysVisibleOptions = ref([]);
  const sysFrameOptions = ref([]);
  const sysStatusOptions = ref([]);
  onBeforeMount(async () => {
    sysMenuTypeOptions.value = await listDictModel({ dictCode: 'sys_menu_type' });
    sysKeepaliveOptions.value = await listDictModel({ dictCode: 'sys_keepalive' });
    sysLinkExternalOptions.value = await listDictModel({ dictCode: 'sys_link_external' });
    sysVisibleOptions.value = await listDictModel({ dictCode: 'sys_visible' });
    sysFrameOptions.value = await listDictModel({ dictCode: 'sys_frame' });
    sysStatusOptions.value = await listDictModel({ dictCode: 'sys_status' });
  });

  const { createMessage } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '菜单列表',
    api: fetchList,
    rowKey: 'id',
    columns,
    formConfig: {
      baseColProps: { sm: 24, lg: 6 },
      labelWidth: 90,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      resetButtonOptions: {
        preIcon: 'ant-design:delete-outlined',
      },
      submitButtonOptions: {
        preIcon: 'ant-design:search-outlined',
      },
    },
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      auth: ['system:sysMenu:edit', 'system:sysMenu:remove'],
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
    beforeFetch: handleBeforeFetch,
  });

  // 新增按钮事件
  function handleCreate() {
    const record = {
      parentId: props.nodeId,
    };
    openModal(true, {
      record,
      isUpdate: false,
    });
  }

  // 编辑按钮事件
  function handleEdit(record: Recordable) {
    console.log(record);
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  // 删除按钮事件
  async function handleDelete(record: Recordable) {
    console.log(record);
    await removeObj({ ids: record.id });
    createMessage.success('删除成功！');
    emit('refresh-tree', record.parentId === '0' ? undefined : record.parentId);
    // 表格刷新，在refresh-tree事件之后，执行
    // await reload();
  }

  // 弹窗回调事件
  function handleSuccess({ isUpdate, values }) {
    console.log(isUpdate);
    console.log(values);
    emit('refresh-tree', values.parentId);
    // 表格刷新，在refresh-tree事件之后，执行
    // reload();
  }

  // 表格请求之前，对参数进行处理
  function handleBeforeFetch(params) {
    return { ...params, parentId: !props.nodeId ? '0' : props.nodeId };
  }

  // 刷新表格
  function refresh() {
    reload();
  }

  watch(
    () => props.nodeId,
    () => {
      nextTick(() => {
        reload();
      });
    },
  );

  // 暴露内部方法
  defineExpose({ refresh });
</script>
