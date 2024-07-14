import { BasicColumn, FormSchema } from '/@/components/Table';
import { listDictModel } from '/@/api/common';

export const columns: BasicColumn[] = [
  {
    title: '参数名称',
    dataIndex: 'configName',
    width: 150,
    align: 'left',
  },
  {
    title: '参数键名',
    dataIndex: 'configKey',
    width: 150,
    align: 'left',
  },
  {
    title: '参数键值',
    dataIndex: 'configValue',
    width: 200,
    align: 'left',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
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
    field: 'configName',
    label: '参数名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入参数名称',
    },
  },
  {
    field: 'configKey',
    label: '参数键名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入参数键名',
    },
  },
];

export const dataFormSchema: FormSchema[] = [
  {
    field: 'configName',
    label: '参数名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入参数名称',
      maxlength: 100,
    },
  },
  {
    field: 'configKey',
    label: '参数键名',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入参数键名',
      maxlength: 100,
    },
  },
  {
    field: 'configKey',
    label: '参数键名',
    component: 'Upload',
    required: true,
    componentProps: {
      placeholder: '请输入参数键名',
      maxlength: 100,
      emptyHidePreview: true,
    },
  },
  {
    field: 'configValue',
    label: '参数键值',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入参数键值',
      maxlength: 500,
    },
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    required: true,
    defaultValue: '1',
    componentProps: {
      placeholder: '请输入排序',
      min: 1,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: listDictModel,
      params: {
        dictCode: 'sys_status',
      },
    },
    defaultValue: '0',
  },
  {
    label: '备注',
    field: 'remarks',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入备注',
      maxlength: 500,
    },
  },
];
