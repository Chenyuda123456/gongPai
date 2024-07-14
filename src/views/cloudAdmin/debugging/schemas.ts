import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { deviceType } from '/@/api/admin/admin';

export const blackForm: FormSchema[] = [
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
    field: 'snCode',
    label: '设备SN码',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
];
export const blackColumn: BasicColumn[] = [
  {
    title: '指令名称',
    dataIndex: 'cmdName',
  },
  {
    title: '指令',
    dataIndex: 'cmdContent',
  },
  // {
  //   title: '返回结果',
  //   dataIndex: 'resultCode',
  // },
  {
    title: '结果内容',
    dataIndex: 'result',
  },
  {
    title: '远程调试时间',
    dataIndex: 'debugTime',
  },
];
