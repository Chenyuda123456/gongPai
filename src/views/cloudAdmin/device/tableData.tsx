import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { registerStatus } from '/@/views/cloudAdmin/code';
import { deviceCustomers, deviceType, deviceVersions, deviceShops } from '/@/api/admin/admin';
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
      title: '所属客户',
      dataIndex: 'customerCompanyName',
    },
    {
      title: '客户账号',
      dataIndex: 'customerAccount',
    },
    {
      title: '激活状态',
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
      title: '门店',
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
      span: 24,
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
          // showTime: false,
          showTime: { format: 'HH:mm:ss' },
        },
        colProps: {
          span: 6,
        },
      },
    ],
  };
}
