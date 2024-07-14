import { BasicColumn, FormSchema } from '/@/components/Table';
import { listDictModel } from '/@/api/common';
export const columns: BasicColumn[] = [
  {
    title: '部门名称',
    dataIndex: 'deptName',
    width: 120,
  },
  {
    title: '部门全称',
    dataIndex: 'deptFullname',
    width: 150,
  },
  {
    title: '机构类型',
    dataIndex: 'orgType',
    width: 120,
  },
  {
    title: '负责人',
    dataIndex: 'leader',
    width: 120,
  },
  {
    title: '负责人电话',
    dataIndex: 'leaderPhone',
    width: 120,
  },
  {
    title: '办公电话',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '邮政编码',
    dataIndex: 'postCode',
    width: 120,
  },
  {
    title: '联系地址',
    dataIndex: 'address',
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
    field: 'deptName',
    label: '部门名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入部门名称',
    },
  },
  {
    field: 'deptFullname',
    label: '部门全称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入部门全称',
    },
  },
];

export const dataFormSchema: FormSchema[] = [
  {
    field: 'deptName',
    label: '部门名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入部门名称',
      maxlength: 100,
    },
  },
  {
    field: 'deptFullname',
    label: '部门全称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入部门全称',
      maxlength: 100,
    },
  },
  {
    field: 'orgType',
    label: '机构类型',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: listDictModel,
      params: {
        dictCode: 'sys_org_type',
      },
    },
    defaultValue: '1',
  },
  {
    field: 'parentId',
    label: '上级部门',
    component: 'TreeSelect',
    componentProps: {
      placeholder: '请选择上级部门',
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'leader',
    label: '负责人',
    component: 'Input',
    componentProps: {
      placeholder: '请输入负责人',
      maxlength: 30,
    },
  },
  {
    field: 'leaderPhone',
    label: '负责人电话',
    component: 'Input',
    componentProps: {
      placeholder: '请输入负责人电话',
      maxlength: 30,
    },
  },
  {
    field: 'phone',
    label: '办公电话',
    component: 'Input',
    componentProps: {
      placeholder: '请输入办公电话',
      maxlength: 30,
    },
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    componentProps: {
      placeholder: '请输入邮箱',
      maxlength: 100,
    },
  },
  {
    field: 'postCode',
    label: '邮政编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入邮政编码',
      maxlength: 30,
    },
  },
  {
    field: 'address',
    label: '联系地址',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入联系地址',
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
