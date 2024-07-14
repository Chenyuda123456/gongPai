import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '区域编码',
    dataIndex: 'areaCode',
    width: 120,
  },
  {
    title: '区域名称',
    dataIndex: 'areaName',
    width: 120,
  },
  {
    title: '区域类型',
    dataIndex: 'areaType',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 120,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 160,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'areaCode',
    label: '区域编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入区域编码',
    },
  },
  {
    field: 'areaName',
    label: '区域名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入区域名称',
    },
  },
];
