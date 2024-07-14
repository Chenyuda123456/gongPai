import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { deviceCustomers, deviceShops } from '/@/api/admin/admin';

export const baseInfo: FormSchema[] = [
  {
    field: '[fileCreateStartTime, fileCreateEndTime]',
    label: '创建时间',
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
    field: '[uploadStartTime, uploadEndTime]',
    label: '上传时间',
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
    field: 'hubCode',
    label: '胸牌坞设备码',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  {
    field: 'snCode',
    label: '胸牌设备码',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  {
    field: 'fileName',
    label: '日志名称',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  {
    field: 'fileType',
    label: '日志格式',
    component: 'Select',
    colProps: {
      span: 6,
    },
    componentProps: {
      options: [
        {
          label: 'txt',
          value: 'txt',
        },
        {
          label: 'json',
          value: 'json',
        },
        {
          label: 'log',
          value: 'log',
        },
        {
          label: 'zip',
          value: 'zip',
        },
      ],
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
  // {
  //   field: `storeType`,
  //   label: `存储方式`,
  //   component: 'Select',
  //   colProps: {
  //     span: 6,
  //   },
  //   componentProps: {
  //     options: [
  //       {
  //         label: 'oss',
  //         value: 0,
  //       },
  //       {
  //         label: 'minio',
  //         value: 1,
  //       },
  //       {
  //         label: 'tos',
  //         value: 2,
  //       },
  //     ],
  //   },
  // },
];
export const baseColumn: BasicColumn[] = [
  {
    title: '日志名称',
    dataIndex: 'fileName',
  },
  {
    title: '存储方式',
    dataIndex: 'storeType',
  },
  {
    title: '创建时间',
    dataIndex: 'fileCreateTime',
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
  },
  {
    title: '日志格式',
    width: 80,
    dataIndex: 'fileType',
  },
  {
    title: '文件大小',
    width: 80,
    dataIndex: 'fileSize',
  },
  {
    title: '胸牌坞设备码',
    dataIndex: 'hubCode',
  },
  {
    title: '胸牌设备码',
    dataIndex: 'snCode',
  },
];
