import { FormSchema } from '/@/components/Form/index';
import { BasicColumn } from '/@/components/Table';
import { deviceCustomers, deviceType } from '/@/api/admin/admin';

export const tableColumns: BasicColumn[] = [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    ellipsis: false,
  },
  {
    title: '拷贝时间',
    dataIndex: 'copyTime',
    width: 220,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
  },
  {
    title: '大小',
    dataIndex: 'size',
    width: 100,
  },
];
export const desData = [
  {
    field: 'df',
    label: '可用存储',
  },
  {
    field: 'usedStore',
    label: '已用存储',
  },
  {
    field: 'recordLight',
    label: '录音指示灯',
  },
  {
    field: 'autoRecord',
    label: '开机自动录音',
  },
  {
    field: 'recordMode',
    label: '录音模式',
  },
  {
    field: 'recordFormat',
    label: '录音格式',
  },
  {
    field: 'logLevel',
    label: '日志等级',
  },
  {
    field: 'recordTime',
    label: '录音切片时长',
  },
  {
    field: 'recordSectionTime',
    label: '录音自动保存时长',
  },
  {
    field: 'recordOrigin',
    label: '原始录音开关',
  },
  {
    field: 'ignoreTime',
    label: '录音忽略时长',
  },
  {
    field: 'algoModel',
    label: '算法模型',
  },
  {
    field: 'time',
    label: '系统时间',
  },
];
export const tableDataDes = [
  {
    title: '拷贝时间',
    dataIndex: 'copyTime',
  },
  {
    title: '文件名',
    dataIndex: 'fileName',
  },
  {
    title: '文件大小',
    width: 80,
    dataIndex: 'fileSize',
  },
];
