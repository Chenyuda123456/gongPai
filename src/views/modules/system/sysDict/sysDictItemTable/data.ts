import { BasicColumn, FormSchema } from '/@/components/Table';
import { listDictModel } from '/@/api/common';

export const columns: BasicColumn[] = [
  {
    title: '字典项名称',
    dataIndex: 'dictItemName',
    width: 120,
  },
  {
    title: '字典项编码',
    dataIndex: 'dictItemCode',
    width: 120,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 80,
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
    field: 'dictItemName',
    label: '字典项名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入字典项名称',
    },
  },
  {
    field: 'dictItemCode',
    label: '字典项编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入字典项编码',
    },
  },
];

export const dataFormSchema: FormSchema[] = [
  {
    field: 'dictItemName',
    label: '字典项名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入字典项名称',
      maxlength: 100,
    },
  },
  {
    field: 'dictItemCode',
    label: '字典项编码',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入字典项编码',
      maxlength: 100,
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
