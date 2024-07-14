import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { deployType, platforms } from '/@/views/cloudAdmin/code';
import { businessManagers } from '/@/api/admin/admin';
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '客户名称',
      dataIndex: 'companyName',
    },
    {
      title: '绑定账号',
      dataIndex: 'account',
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
    },
    {
      title: '使用方式',
      dataIndex: 'deployType',
    },
    {
      title: '申请来源',
      dataIndex: 'source',
    },
    {
      title: '开通平台',
      dataIndex: 'openPlatform',
    },
    {
      title: '统一质检账号',
      dataIndex: 'detectionName',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
    },
    {
      title: '手机号',
      dataIndex: 'contactPhone',
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
        field: `keyword`,
        label: `客户`,
        component: 'Input',
        colProps: {
          span: 6,
        },
        componentProps: {
          placeholder: '请输入客户名称、账号',
        },
      },
      {
        field: `businessManager`,
        label: `所属商务`,
        component: 'ApiSelect',
        componentProps: {
          api: businessManagers,
          resultField: 'data',
          labelField: 'name',
          valueField: 'name',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'openPlatform',
        label: '开通平台',
        component: 'Select',
        colProps: {
          span: 6,
        },
        defaultValue: '',
        componentProps: {
          options: platforms,
        },
      },
      {
        field: 'deployType',
        label: '使用方式',
        component: 'Select',
        colProps: {
          span: 6,
        },
        defaultValue: '',
        componentProps: {
          options: deployType,
        },
      },
    ],
  };
}
