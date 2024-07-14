import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { registerStatus } from '/@/views/cloudAdmin/code';
import { deviceType } from '/@/api/manage/manage';
import { customerShops } from '/@/api/manage/manage';
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '设备SN码',
      dataIndex: 'snCode',
      ellipsis: false,
    },
    {
      title: '设备类型',
      width: 80,
      dataIndex: 'type',
    },
    {
      title: '使用状态',
      width: 80,
      dataIndex: 'useStatus',
    },
    {
      title: '登记状态',
      width: 80,
      dataIndex: 'registerStatus',
    },
    {
      title: '固件版本',
      width: 80,
      dataIndex: 'firmwareVersion',
    },
    {
      title: '连接胸牌坞设备',
      dataIndex: 'lastDockCode',
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
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作人',
      dataIndex: 'updateUserName',
    },
  ];
}
export function getFormConfig(): Partial<FormProps> {
  return {
    showAdvancedButton: false,
    actionColOptions: {
      span: 6,
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
      {
        field: `type`,
        label: `设备类型`,
        component: 'ApiSelect',
        colProps: {
          span: 6,
        },
        componentProps: {
          params: {
            category: 1, // 1: 胸牌 2: 胸牌坞
          },
          api: deviceType,
          resultField: 'data',
          labelField: 'name',
          valueField: 'type',
        },
      },
      {
        field: `firmwareVersion`,
        label: `当前固件版本`,
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: `registerStatus`,
        label: `状态`,
        component: 'Select',
        colProps: {
          span: 6,
        },
        componentProps: {
          options: registerStatus,
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
      {
        field: `userName`,
        label: `使用者`,
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: '[updateTimeStart, updateTimeEnd]',
        label: `更新时间`,
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD HH:mm:ss',
          // format: 'YYYY-MM-DD',
          placeholder: ['开始时间', '结束时间'],
          showTime: { format: 'HH:mm:ss' },
          // showTime: false,
        },
        colProps: {
          span: 6,
        },
      },
    ],
  };
}
export function getFormConfigAll(): Partial<FormProps> {
  return {
    showAdvancedButton: false,
    actionColOptions: {
      span: 6,
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
      {
        field: `type`,
        label: `设备类型`,
        component: 'ApiSelect',
        colProps: {
          span: 6,
        },
        componentProps: {
          params: {
            category: 2, // 1: 胸牌 2: 胸牌坞
          },
          api: deviceType,
          resultField: 'data',
          labelField: 'name',
          valueField: 'type',
        },
      },
      {
        field: `firmwareVersion`,
        label: `当前固件版本`,
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: `registerStatus`,
        label: `状态`,
        component: 'Select',
        colProps: {
          span: 6,
        },
        componentProps: {
          options: registerStatus,
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
      {
        field: `userName`,
        label: `使用者`,
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: '[updateTimeStart, updateTimeEnd]',
        label: `更新时间`,
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD HH:mm:ss',
          // format: 'YYYY-MM-DD',
          placeholder: ['开始时间', '结束时间'],
          showTime: { format: 'HH:mm:ss' },
          // showTime: false,
        },
        colProps: {
          span: 6,
        },
      },
    ],
  };
}
export function getBasicColumnsAll(): BasicColumn[] {
  return [
    {
      title: '设备SN码',
      dataIndex: 'snCode',
      ellipsis: false,
    },
    {
      title: '设备类型',
      width: 80,
      dataIndex: 'type',
    },
    {
      title: '使用状态',
      width: 80,
      dataIndex: 'useStatus',
    },
    {
      title: '登记状态',
      width: 80,
      dataIndex: 'registerStatus',
    },
    {
      title: '固件版本',
      width: 80,
      dataIndex: 'firmwareVersion',
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
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作人',
      dataIndex: 'updateUserName',
    },
  ];
}
