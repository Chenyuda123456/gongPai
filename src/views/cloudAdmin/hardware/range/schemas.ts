import { BasicColumn } from '/@/components/Table/src/types/table';

export const clientColumn: BasicColumn[] = [
  {
    title: '所属客户',
    dataIndex: 'customerName',
  },
  {
    title: '客户账号',
    dataIndex: 'account',
  },
  {
    title: '所属商务',
    dataIndex: 'business',
  },
  {
    title: '设备数',
    dataIndex: 'deviceCount',
  },
];

export const shopColumn: BasicColumn[] = [
  {
    title: '所属客户',
    dataIndex: 'customerName',
  },
  {
    title: '客户账号',
    dataIndex: 'account',
  },
  {
    title: '所属商务',
    dataIndex: 'business',
  },
  {
    title: '所属门店',
    dataIndex: 'shopName',
  },
  {
    title: '设备数',
    dataIndex: 'deviceCount',
  },
];

export const deviceColumn: BasicColumn[] = [
  {
    title: '设备SN码',
    dataIndex: 'snCode',
    ellipsis: false,
  },

  {
    title: '当前版本',
    dataIndex: 'currentVersion',
  },
  {
    title: '所属客户',
    dataIndex: 'customerName',
  },
  {
    title: '客户账号',
    dataIndex: 'account',
  },
  {
    title: '所属门店',
    dataIndex: 'shopName',
  },
  {
    title: '使用者',
    dataIndex: 'userName',
  },
];
