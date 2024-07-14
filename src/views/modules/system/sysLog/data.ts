import { BasicColumn, FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { listDictModel } from '/@/api/common';
export const columns: BasicColumn[] = [
  {
    title: '操作模块',
    dataIndex: 'logModule',
    width: 100,
  },
  {
    title: '操作内容',
    dataIndex: 'logTitle',
    width: 150,
  },
  {
    title: '日志状态',
    dataIndex: 'logStatus',
    width: 120,
  },
  {
    title: '用户平台',
    dataIndex: 'userPlatform',
    width: 120,
  },
  {
    title: '请求地址',
    dataIndex: 'requsetUri',
    width: 200,
  },
  {
    title: '请求方式',
    dataIndex: 'requsetType',
    width: 120,
  },
  {
    title: '请求方法',
    dataIndex: 'requsetMethod',
    width: 200,
  },
  {
    title: '请求参数',
    dataIndex: 'requsetParams',
    width: 200,
  },
  {
    title: '请求耗时',
    dataIndex: 'requsetTime',
    width: 120,
  },
  {
    title: '操作人员',
    dataIndex: 'operName',
    width: 120,
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    width: 120,
  },
  {
    title: '操作地点',
    dataIndex: 'operLocation',
    width: 150,
  },
  {
    title: '浏览器类型',
    dataIndex: 'browser',
    width: 150,
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    width: 300,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 120,
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    width: 160,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'logModule',
    label: '操作模块',
    component: 'Input',
    componentProps: {
      placeholder: '请输入操作模块',
    },
  },
  {
    field: 'logTitle',
    label: '操作内容',
    component: 'Input',
    componentProps: {
      placeholder: '请输入操作内容',
    },
  },
  {
    field: 'logStatus',
    label: '日志状态',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择日志状态',
      api: listDictModel,
      params: {
        dictCode: 'sys_log_status',
      },
    },
  },
  {
    field: 'userPlatform',
    label: '用户平台',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择用户平台',
      api: listDictModel,
      params: {
        dictCode: 'sys_user_platform',
      },
    },
  },
  {
    field: 'operName',
    label: '操作人员',
    component: 'Input',
    componentProps: {
      placeholder: '请输入操作人员',
    },
  },
];

export const descFormSchema: DescItem[] = [
  {
    field: 'logModule',
    label: '操作模块',
    labelMinWidth: 80,
  },
  {
    field: 'logTitle',
    label: '操作内容',
    labelMinWidth: 80,
  },
  {
    field: 'logStatusDesc',
    label: '日志状态',
  },
  {
    field: 'userPlatformDesc',
    label: '用户平台',
  },
  {
    field: 'requsetUri',
    label: '请求地址',
  },
  {
    field: 'requsetType',
    label: '请求方式',
  },
  {
    field: 'requsetMethod',
    label: '请求方法',
  },
  {
    field: 'requsetParams',
    label: '请求参数',
  },
  {
    field: 'requsetTime',
    label: '请求耗时',
  },
  {
    field: 'operName',
    label: '操作人员',
  },
  {
    field: 'ipAddress',
    label: 'IP地址',
  },
  {
    field: 'operLocation',
    label: '操作地点',
  },
  {
    field: 'browser',
    label: '浏览器类型',
  },
  {
    field: 'os',
    label: '操作系统',
  },
  {
    field: 'remarks',
    label: '备注',
  },
  {
    field: 'createTime',
    label: '操作时间',
  },
];
