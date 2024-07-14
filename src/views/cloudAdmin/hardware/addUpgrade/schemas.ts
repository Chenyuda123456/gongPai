import { FormSchema } from '/@/components/Form';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { resourceType } from '/@/views/cloudAdmin/code';
import { deviceCustomers, deviceShops, deviceType } from '/@/api/admin/admin';
//第一步Form
export const baseInfo: FormSchema[] = [
  {
    field: 'upgradeType',
    label: '升级类型',
    component: 'RadioGroup',
    defaultValue: 0,
    required: true,
    colProps: {
      span: 6,
    },
    componentProps: {
      options: resourceType,
    },
  },
  {
    field: 'taskName',
    label: '任务名称',
    component: 'Input',
    required: true,
    colProps: {
      span: 6,
    },
    componentProps: {
      maxlength: 50,
    },
  },
  {
    field: `deviceType`,
    label: `设备类型`,
    required: true,
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
    field: 'hardwareId',
    label: '固件',
    required: true,
    component: 'Select',
    slot: 'chooseHardware',
    ifShow: ({ values }) => {
      return values.upgradeType == 0;
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'configId',
    label: '配置单',
    component: 'Select',
    required: true,
    slot: 'chooseConfigFile',
    ifShow: ({ values }) => {
      return values.upgradeType == 1;
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 200,
    },
    colProps: {
      span: 24,
    },
  },
];

// 第二步Form
export const baseInfoTwo: FormSchema[] = [
  {
    field: 'rangeType',
    label: '升级范围',
    component: 'RadioGroup',
    required: true,
    slot: 'rangeType',
    defaultValue: 1,
    colProps: {
      span: 24,
    },
  },
];

// 黑名单Form
export const baseInfoBlack: FormSchema[] = [
  {
    field: 'blackList',
    label: '黑名单',
    component: 'InputTextArea',
    slot: 'black',
    // required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      maxlength: 200,
    },
  },
];

// 选择固件
export const chooseHardwareForm: FormSchema[] = [
  {
    field: 'fileName',
    label: '固件名称',
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
];
export const chooseHardwareColumn: BasicColumn[] = [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    ellipsis: false,
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

// 选择配置
export const chooseConfigForm: FormSchema[] = [
  {
    field: 'fileName',
    label: '文件名称',
    component: 'Input',
    required: true,
    colProps: {
      span: 6,
    },
  },
];
export const chooseConfigColumn: BasicColumn[] = [
  {
    title: '配置文件名称',
    dataIndex: 'fileName',
  },
  {
    title: '设备类型',
    width: 80,
    dataIndex: 'resourceType',
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

// 升级范围Form 客户、门店、设备
export const baseFormConfigOne: Partial<FormProps> = {
  showAdvancedButton: false,
  actionColOptions: {
    span: 18,
  },
  labelWidth: 100,
  schemas: [
    {
      field: `customerName`,
      label: `客户名称`,
      component: 'Input',
      colProps: {
        span: 6,
      },
      componentProps: {
        maxlength: 50,
      },
    },
  ],
};
export const baseFormConfigTwo: Partial<FormProps> = {
  showAdvancedButton: false,
  actionColOptions: {
    span: 12,
  },
  labelWidth: 100,
  schemas: [
    {
      field: `customerId`,
      label: `所属客户`,
      component: 'ApiSelect',
      colProps: {
        span: 6,
      },
      componentProps: {
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        showSearch: true,
        api: deviceCustomers,
        resultField: 'data',
        labelField: 'companyName',
        valueField: 'id',
        style: {},
      },
    },
    {
      field: `shopId`,
      label: `所属门店`,
      component: 'ApiSelect',
      colProps: {
        span: 6,
      },
      componentProps: {
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        showSearch: true,
        api: deviceShops,
        params: {
          customerId: '',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        style: {},
      },
    },
  ],
};
export const baseFormConfigThree: Partial<FormProps> = {
  showAdvancedButton: false,
  actionColOptions: {
    span: 18,
  },
  labelWidth: 100,
  schemas: [
    {
      field: `snCode`,
      label: `设备SN码`,
      component: 'Input',
      colProps: {
        span: 6,
      },
    },
  ],
};

// 升级范围Column 客户、门店、设备
export const baseColumnOne: BasicColumn[] = [
  {
    title: '客户名称',
    dataIndex: 'customerName',
  },
  {
    title: '客户账号',
    dataIndex: 'account',
  },
  {
    title: '设备类型',
    width: 80,
    dataIndex: 'deviceType',
  },
  {
    title: '设备数',
    dataIndex: 'deviceCount',
  },
];
export const baseColumnTwo: BasicColumn[] = [
  {
    title: '客户名称',
    dataIndex: 'customerName',
  },
  {
    title: '客户账号',
    dataIndex: 'account',
  },
  {
    title: '设备类型',
    width: 80,
    dataIndex: 'deviceType',
  },
  {
    title: '所属门店',
    dataIndex: 'shopName',
  },
  {
    title: '设备数',
    dataIndex: 'deviceCount',
  },
];
export const baseColumnThree: BasicColumn[] = [
  {
    title: '设备SN码',
    dataIndex: 'snCode',
    ellipsis: false,
  },

  {
    title: '设备类型',
    width: 80,
    dataIndex: 'deviceType',
  },
  {
    title: '所属客户',
    dataIndex: 'customerName',
  },
  {
    title: '所属门店',
    dataIndex: 'shopName',
  },
  {
    title: '使用者',
    dataIndex: 'userName',
  },
];

// 升级范围Form 客户、门店、设备
export const addClientForm: FormSchema[] = [
  {
    field: `customerName`,
    label: `客户名称`,
    component: 'Input',
    colProps: {
      span: 6,
    },
    componentProps: {
      maxlength: 50,
    },
  },
];
export const addShopForm: FormSchema[] = [
  {
    field: `customerId`,
    label: `所属客户`,
    component: 'ApiSelect',
    colProps: {
      span: 6,
    },
    componentProps: {
      filterOption: (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      },
      showSearch: true,
      api: deviceCustomers,
      resultField: 'data',
      labelField: 'companyName',
      valueField: 'id',
      style: {},
    },
  },
  {
    field: `shopId`,
    label: `所属门店`,
    component: 'ApiSelect',
    colProps: {
      span: 6,
    },
    componentProps: {
      filterOption: (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      },
      showSearch: true,
      api: deviceShops,
      params: {
        customerId: '',
      },
      resultField: 'data',
      labelField: 'name',
      valueField: 'id',
      style: {},
    },
  },
];
export const addDeviceForm: FormSchema[] = [
  {
    field: `snCode`,
    label: `设备SN码`,
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  {
    field: `customerId`,
    label: `所属客户`,
    component: 'ApiSelect',
    colProps: {
      span: 6,
    },
    componentProps: {
      filterOption: (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      },
      showSearch: true,
      api: deviceCustomers,
      resultField: 'data',
      labelField: 'companyName',
      valueField: 'id',
      style: {},
    },
  },
  {
    field: `shopId`,
    label: `所属门店`,
    component: 'ApiSelect',
    colProps: {
      span: 6,
    },
    componentProps: {
      filterOption: (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      },
      showSearch: true,
      api: deviceShops,
      params: {
        customerId: '',
      },
      resultField: 'data',
      labelField: 'name',
      valueField: 'id',
      style: {},
    },
  },
];
