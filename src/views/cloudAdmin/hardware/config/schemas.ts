import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { rangeType, resultCode } from '/@/views/cloudAdmin/code';
import { deviceCustomers, deviceShops, deviceType } from '/@/api/admin/admin';
// 配置升级列表
export const baseInfo: FormSchema[] = [
  {
    field: 'rangeType',
    label: '升级范围',
    component: 'Select',
    // defaultValue: 4,
    colProps: {
      span: 6,
    },
    componentProps: {
      options: rangeType,
    },
  },
  {
    field: 'rangeValue',
    label: '升级范围值',
    component: 'Input',
    componentProps: {
      placeholder: '客户名称、店铺名称、设备名称',
    },
    colProps: {
      span: 6,
    },
  },
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
    field: 'taskName',
    label: '任务名称',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  {
    field: 'operator',
    label: '发布人',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  /*  {
    field: 'version',
    label: '版本',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },*/
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
  {
    field: 'taskId',
    label: '任务Id',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
];
export const baseColumn: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'taskName',
  },
  {
    title: '设备类型',
    width: 80,
    dataIndex: 'deviceType',
  },
  /*  {
    title: '版本号',
    dataIndex: 'version',
  },*/
  {
    title: '升级范围',
    dataIndex: 'rangeType',
  },
  {
    title: '文件名称',
    dataIndex: 'fileName',
    ellipsis: false,
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
    title: '操作人',
    dataIndex: 'operator',
  },
  {
    title: '操作时间',
    dataIndex: 'updateTime',
  },
];
// 升级结果
export const baseSuccessInfo: FormSchema[] = [
  {
    field: 'snCode',
    label: '设备SN码',
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
  {
    field: '[startTime, endTime]',
    label: '升级时间',
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
  {
    field: 'resultCode',
    label: '升级状态',
    component: 'Select',
    colProps: {
      span: 6,
    },
    componentProps: {
      options: resultCode,
    },
  },
];
export const baseSuccessColumn: BasicColumn[] = [
  {
    title: '设备SN码',
    dataIndex: 'snCode',
    ellipsis: false,
  },

  {
    title: '升级前版本',
    dataIndex: 'previousVersion',
  },
  // {
  //   title: '当前版本',
  //   dataIndex: 'currentVersion',
  // },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '升级时间',
    dataIndex: 'upgradeTime',
  },
  {
    title: '状态',
    dataIndex: 'resultCode',
  },
  {
    title: '升级说明',
    dataIndex: 'failReason',
  },
  {
    title: '升级胸牌坞',
    dataIndex: 'hubCode',
  },
  {
    title: '设备所属客户',
    dataIndex: 'customerName',
  },
  {
    title: '设备所属门店',
    dataIndex: 'shopName',
  },
  {
    title: '设备使用者',
    dataIndex: 'userName',
  },
];
