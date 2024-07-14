import { BasicColumn, FormSchema } from '/@/components/Table';
import { selectOptions as selectOptionsPost } from '/@/api/modules/system/sysPostApi';
import { selectOptions as selectOptionsRole } from '/@/api/modules/system/sysRoleApi';
import { selectDeptTree } from '/@/api/modules/system/sysDeptApi';
import { listDictModel } from '/@/api/common';
export const columns: BasicColumn[] = [
  {
    title: '账号',
    dataIndex: 'account',
    width: 120,
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 120,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'realname',
    width: 120,
  },
  {
    title: '英文名',
    dataIndex: 'englishName',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '工号',
    dataIndex: 'staffNumber',
    width: 120,
  },
  {
    title: '生日',
    dataIndex: 'birthday',
    width: 120,
  },
  {
    title: '锁定',
    dataIndex: 'lockFlag',
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
    field: 'account',
    label: '账号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入账号',
    },
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入昵称',
    },
  },
  {
    field: 'realname',
    label: '姓名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入姓名',
    },
  },
  {
    field: 'englishName',
    label: '英文名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入英文名',
    },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入手机号',
    },
  },
  {
    field: 'staffNumber',
    label: '工号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入工号',
    },
  },
];

export const dataFormSchema: FormSchema[] = [
  {
    field: 'account',
    label: '账号',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入账号',
      maxlength: 100,
    },
  },
  {
    field: 'deptId',
    label: '部门',
    component: 'ApiTreeSelect',
    componentProps: ({ formModel }) => {
      console.log(formModel);
      return {
        placeholder: '请选择部门',
        api: selectDeptTree,
        fieldNames: {
          label: 'name',
          key: 'id',
          value: 'id',
        },
      };
    },
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: true,
    componentProps: {
      placeholder: '请输入密码',
      maxlength: 100,
    },
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入昵称',
      maxlength: 100,
    },
  },
  {
    field: 'sex',
    label: '性别',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: listDictModel,
      params: {
        dictCode: 'sys_sex',
      },
    },
    defaultValue: '1',
  },
  {
    field: 'realname',
    label: '姓名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入姓名',
      maxlength: 100,
    },
  },
  {
    field: 'englishName',
    label: '英文名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入英文名',
      maxlength: 100,
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
    field: 'phone',
    label: '手机号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入手机号',
      maxlength: 30,
    },
  },
  {
    field: 'staffNumber',
    label: '工号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入工号',
      maxlength: 30,
    },
  },
  {
    field: 'birthday',
    label: '生日',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择生日',
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    field: 'lockFlag',
    label: '锁定',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: listDictModel,
      params: {
        dictCode: 'sys_lock_flag',
      },
    },
    defaultValue: '0',
  },
  {
    field: 'postIds',
    label: '岗位',
    component: 'ApiSelect',
    componentProps: () => {
      return {
        placeholder: '请选择岗位',
        api: selectOptionsPost,
        mode: 'multiple',
        labelField: 'postName',
        valueField: 'id',
      };
    },
  },
  {
    field: 'roleIds',
    label: '角色',
    component: 'ApiSelect',
    componentProps: () => {
      return {
        placeholder: '请选择角色',
        api: selectOptionsRole,
        mode: 'multiple',
        labelField: 'roleName',
        valueField: 'id',
      };
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
