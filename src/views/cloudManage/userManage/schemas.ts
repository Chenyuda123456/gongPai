import { FormSchema } from '/@/components/Form';

export const baseInfo: FormSchema[] = [
  {
    field: 'name',
    label: '客户名称',
    component: 'Input',
    slot: 'name',
    colProps: {
      span: 24,
    },
    componentProps: {
      maxlength: 50,
    },
  },
  {
    field: 'count',
    label: '客户账号',
    component: 'Input',
    slot: 'count',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'id',
    label: '客户ID',
    component: 'Input',
    slot: 'id',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'time',
    label: '创建时间',
    component: 'Input',
    slot: 'time',
    colProps: {
      span: 24,
    },
  },
];
export const messageManage: FormSchema[] = [
  {
    field: 'mail',
    label: '消息通知邮箱',
    component: 'Input',
    slot: 'mail',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'phone',
    label: '消息通知手机',
    component: 'Input',
    slot: 'phone',
    colProps: {
      span: 24,
    },
  },
];
export const column = [
  {
    title: '门店',
    dataIndex: 'name',
  },
  {
    title: '上一级',
    dataIndex: 'parentShopName',
  },
  {
    title: '所在地区',
    dataIndex: 'district',
  },
  {
    title: '备注',
    dataIndex: 'note',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];
