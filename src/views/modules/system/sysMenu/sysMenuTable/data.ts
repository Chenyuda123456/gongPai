import { BasicColumn, FormSchema } from '/@/components/Table';
import { listDictModel } from '/@/api/common';

const isDir = (menuType: string) => menuType === 'dir';
const isMenu = (menuType: string) => menuType === 'menu';
const isButton = (menuType: string) => menuType === 'button';
const isLinkExternal = (linkExternal: string) => linkExternal === '0';
export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    width: 120,
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
    width: 80,
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
    title: '图标',
    dataIndex: 'icon',
    width: 50,
  },
  {
    title: '是否显示',
    dataIndex: 'visible',
    width: 80,
  },
  {
    title: '是否缓存',
    dataIndex: 'keepalive',
    width: 80,
  },
  {
    title: '路由地址',
    dataIndex: 'routePath',
    width: 120,
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    width: 200,
    align: 'left',
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    width: 180,
    align: 'left',
  },
  {
    title: '是否外链',
    dataIndex: 'linkExternal',
    width: 80,
  },
  {
    title: '是否内嵌',
    dataIndex: 'frame',
    width: 80,
  },
  {
    title: '外部链接',
    dataIndex: 'linkUrl',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'menuName',
    label: '菜单名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入菜单名称',
    },
  },
];

export const dataFormSchema: FormSchema[] = [
  {
    field: 'menuType',
    label: '菜单类型',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: listDictModel,
      params: {
        dictCode: 'sys_menu_type',
      },
      isBtn: true,
    },
    defaultValue: 'dir',
  },
  {
    field: 'menuName',
    label: '菜单名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入菜单名称',
      maxlength: 100,
    },
  },
  {
    field: 'parentId',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      placeholder: '请选择上级菜单',
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
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
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    ifShow: ({ values }) => !isButton(values.menuType),
  },
  {
    field: 'visible',
    label: '是否显示',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: listDictModel,
      params: {
        dictCode: 'sys_visible',
      },
    },
    defaultValue: '0',
    ifShow: ({ values }) => isDir(values.menuType) || isMenu(values.menuType),
  },
  {
    field: 'routePath',
    label: '路由地址',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入路由地址',
    },
    ifShow: ({ values }) => !isButton(values.menuType),
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入组件路径',
    },
    ifShow: ({ values }) => isMenu(values.menuType) && !isLinkExternal(values.linkExternal),
  },
  {
    field: 'linkUrl',
    label: '外部链接',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入外部链接',
    },
    ifShow: ({ values }) => isMenu(values.menuType) && isLinkExternal(values.linkExternal),
  },
  {
    field: 'keepalive',
    label: '是否缓存',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: listDictModel,
      params: {
        dictCode: 'sys_keepalive',
      },
    },
    defaultValue: '0',
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'permission',
    label: '权限标识',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入权限标识',
    },
    ifShow: ({ values }) => isButton(values.menuType),
  },
  {
    field: 'linkExternal',
    label: '是否外链',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: listDictModel,
      params: {
        dictCode: 'sys_link_external',
      },
    },
    defaultValue: '1',
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'frame',
    label: '是否内嵌',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: listDictModel,
      params: {
        dictCode: 'sys_frame',
      },
    },
    defaultValue: '0',
    ifShow: ({ values }) => isMenu(values.menuType) && isLinkExternal(values.linkExternal),
  },
];
