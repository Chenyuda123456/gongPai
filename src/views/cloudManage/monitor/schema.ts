import { FormSchema } from '/@/components/Form/index';
import { BasicColumn } from '/@/components/Table';
import { deviceType, customerShops } from '/@/api/manage/manage';
export const schemasAplay: FormSchema[] = [
  {
    field: '第一步',
    label: '',
    component: 'Input',
    slot: 'one',
    colProps: {
      span: 24,
    },
  },
  {
    rules: [
      {
        required: true,
        validator: async (_, value) => {
          if (!value) {
            return Promise.reject('请输入公司名称');
          }
          if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/g.test(value)) {
            return Promise.reject('请输入汉字、英文字母、数字符号');
          }
        },
        trigger: 'blur',
      },
    ],
    field: 'companyName',
    label: '公司名称',
    component: 'Input',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: '请输入公司名称',
    },
  },
  {
    rules: [
      {
        required: true,
        validator: async (_, value) => {
          if (!value) {
            return Promise.reject('请输入联系人');
          }
          if (!/^[a-zA-Z\u4e00-\u9fa5]+$/g.test(value)) {
            return Promise.reject('请输入汉字、英文字母');
          }
        },
        trigger: 'blur',
      },
    ],
    field: 'contactName',
    label: '业务联系人姓名',
    component: 'Input',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: '请输入业务联系人姓名',
    },
  },
  {
    rules: [
      {
        required: true,
        // @ts-ignore
        validator: async (_, value) => {
          if (!value) {
            return Promise.reject('请输入手机号');
          }
          if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
            return Promise.reject('手机号码有误，请重填');
          }
        },
        trigger: 'blur',
      },
    ],
    field: 'contactPhone',
    label: '业务联系人手机号',
    component: 'Input',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: '请输入业务联系人手机号',
    },
  },
  {
    field: 'name',
    label: '',
    component: 'Input',
    slot: 'last',
    colProps: {
      span: 24,
    },
  },
];

export const tableColumns: BasicColumn[] = [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    ellipsis: false,
  },
  {
    title: '拷贝时间',
    dataIndex: 'copyTime',
    width: 220,
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '大小',
    dataIndex: 'size',
  },
];
export const desData = [
  {
    field: 'df',
    label: '可用存储',
  },
  {
    field: 'usedStore',
    label: '已用存储',
  },
  {
    field: 'recordLight',
    label: '录音指示灯',
  },
  {
    field: 'autoRecord',
    label: '开机自动录音',
  },
  {
    field: 'recordMode',
    label: '录音模式',
  },
  {
    field: 'recordFormat',
    label: '录音格式',
  },
  {
    field: 'logLevel',
    label: '日志等级',
  },
  {
    field: 'recordTime',
    label: '录音切片时长',
  },
  {
    field: 'recordSectionTime',
    label: '录音自动保存时长',
  },
  {
    field: 'recordOrigin',
    label: '原始录音开关',
  },
  {
    field: 'ignoreTime',
    label: '录音忽略时长',
  },
  {
    field: 'algoModel',
    label: '算法模型',
  },
  {
    field: 'time',
    label: '系统时间',
  },
];
export const tableDataDes = [
  {
    title: '拷贝时间',
    dataIndex: 'copyTime',
  },
  {
    title: '文件名',
    dataIndex: 'fileName',
  },
  {
    title: '文件大小',
    width: 80,
    dataIndex: 'fileSize',
  },
];
