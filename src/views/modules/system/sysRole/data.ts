import { BasicColumn, FormSchema } from '/@/components/Table';
import { listDictModel } from '/@/api/common';
export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: 150,
    align: 'left',
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode',
    width: 150,
    align: 'left',
  },
  {
    title: '数据范围',
    dataIndex: 'dataScope',
    width: 150,
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
    field: 'roleName',
    label: '角色名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入角色名称',
    },
  },
  {
    field: 'roleCode',
    label: '角色编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入角色编码',
    },
  },
];

export const dataFormSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入角色名称',
      maxlength: 100,
    },
  },
  {
    field: 'roleCode',
    label: '角色编码',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入角色编码',
      maxlength: 100,
    },
  },
  {
    field: 'dataScope',
    label: '数据范围',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      placeholder: '请选择数据范围',
      api: listDictModel,
      params: {
        dictCode: 'sys_data_scope',
      },
    },
  },
  {
    field: 'deptIds',
    label: '数据权限',
    slot: 'deptIds',
    component: 'Input',
    ifShow: ({ values }) => values.dataScope === '2',
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
