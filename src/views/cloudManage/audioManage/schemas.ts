import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

export const baseInfo: FormSchema[] = [
  {
    field: '[fileCreateStartTime, fileCreateEndTime]',
    label: '录音时间',
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
    label: '文件名',
    component: 'Input',
    colProps: {
      span: 6,
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
      api: customerShops,
      resultField: 'data.list',
      labelField: 'name',
      valueField: 'id',
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
    title: '胸牌坞设备码',
    dataIndex: 'hubCode',
  },
  {
    title: '胸牌设备码',
    dataIndex: 'snCode',
  },
  {
    title: '文件名称',
    dataIndex: 'fileName',
  },
  {
    title: '存储方式',
    dataIndex: 'storeType',
  },
  {
    title: '文件格式',
    width: 80,
    dataIndex: 'fileType',
  },
  {
    title: '文件大小',
    width: 80,
    dataIndex: 'fileSize',
  },
  {
    title: '所属门店',
    dataIndex: 'shopName',
  },
  {
    title: '使用者',
    dataIndex: 'userName',
  },
  {
    title: '录音时间',
    dataIndex: 'fileCreateTime',
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
  },
];
