import { BasicColumn, FormSchema } from '/@/components/Table';
import { listDictModel } from '/@/api/common';
export const columns: BasicColumn[] = [
  {
    title: '岗位名称',
    dataIndex: 'postName',
    width: 150,
    align: 'left',
  },
  {
    title: '岗位编码',
    dataIndex: 'postCode',
    width: 150,
    align: 'left',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 90,
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
    field: 'postName',
    label: '岗位名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入岗位名称',
    },
  },
  {
    field: 'postCode',
    label: '岗位编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入岗位编码',
    },
  },
];

export const dataFormSchema: FormSchema[] = [
  {
    field: 'postName',
    label: '岗位名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入岗位名称',
      maxlength: 100,
    },
  },
  {
    field: 'postCode',
    label: '岗位编码',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入岗位编码',
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
