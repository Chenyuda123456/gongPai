import { BasicColumn, FormSchema } from '/@/components/Table';
import { listDictModel } from '/@/api/common';

export const columns: BasicColumn[] = [
  {
    title: '字典名称',
    dataIndex: 'dictName',
  },
  {
    title: '字典编码',
    dataIndex: 'dictCode',
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
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'dictName',
    label: '字典名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入字典名称',
    },
  },
  {
    field: 'dictCode',
    label: '字典编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入字典编码',
    },
  },
];

export const dataFormSchema: FormSchema[] = [
  {
    field: 'dictName',
    label: '字典名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入字典名称',
      maxlength: 100,
    },
  },
  {
    field: 'dictCode',
    label: '字典编码',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入字典编码',
      maxlength: 100,
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
