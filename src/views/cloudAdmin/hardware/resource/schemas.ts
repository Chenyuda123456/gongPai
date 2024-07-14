import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { resourceType } from '/@/views/cloudAdmin/code';
import { deviceType } from '/@/api/admin/admin';

export const baseInfo: FormSchema[] = [
  {
    field: `deviceType`,
    label: `设备类型`,
    component: 'ApiSelect',
    colProps: {
      span: 6,
    },
    componentProps: {
      api: deviceType,
      resultField: 'data',
      labelField: 'name',
      valueField: 'type',
    },
  },
  {
    field: 'fileName',
    label: '名称',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  {
    field: 'version',
    label: '固件版本',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  {
    field: 'resourceType',
    label: '资源类型',
    component: 'Select',
    colProps: {
      span: 6,
    },
    componentProps: {
      options: resourceType,
    },
  },
  {
    field: '[startTime, endTime]',
    label: '发布时间',
    colProps: {
      span: 6,
    },
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
];
export const baseColumn1: BasicColumn[] = [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    ellipsis: false,
  },
  {
    title: '资源类型',
    dataIndex: 'resourceType',
  },
  {
    title: '固件版本',
    width: 80,
    dataIndex: 'version',
  },
  {
    title: '设备类型',
    width: 80,
    dataIndex: 'deviceType',
  },
  {
    title: '更新说明',
    dataIndex: 'updateDesc',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '上传人',
    dataIndex: 'uploader',
  },
];
export const baseColumn2: BasicColumn[] = [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    ellipsis: false,
  },
  {
    title: '资源类型',
    dataIndex: 'resourceType',
  },
  {
    title: '固件版本',
    width: 80,
    dataIndex: 'version',
  },
  {
    title: '设备类型',
    width: 80,
    dataIndex: 'deviceType',
  },
  {
    title: '更新说明',
    dataIndex: 'updateDesc',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '上传人',
    dataIndex: 'uploader',
  },
];
