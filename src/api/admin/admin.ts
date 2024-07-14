import { selfHttp } from '/@/utils/http/axios';
const Api = {
  // menuList
  menuList: '/permission/user/basicInfo?systemId=16',
  // client
  customerPage: '/admin/customer/page',
  accountCheck: '/admin/customer/account/check',
  customerAudit: '/admin/customer/audit',
  customerAdd: '/admin/customer/add',
  customerEdit: '/admin/customer/edit',
  customerRemove: '/admin/customer/remove',
  noticeMails: '/admin/customer/notice-mails',
  businessManagers: '/admin/customer/business-managers',
  detectionList: '/admin/customer/detection/list',
  customerBind: '/admin/customer/check/has/bind',

  // device
  devicePage: '/admin/device/page',
  deviceCustomers: '/admin/device/customers',
  deviceShops: '/admin/device/shops',
  deviceType: '/admin/device/device_types',
  deviceVersions: '/admin/device/firmware_versions',
  exportBatch: '/admin/device/export/batch',
  exportBatchTemplate: '/admin/device/export/batch/template',
  importBatchDevice: '/admin/device/import/batch',
  registerBatch: '/admin/device/register/batch',
  deviceAdd: '/admin/device/add',
  deviceDelete: '/admin/device/delete',
  deviceRegister: '/admin/device/register',
  checkRegister: '/admin/device/check/has/bind',
  deviceShop: '/admin/device/shop',

  // 固件管理-资源
  resourcePage: '/admin/ota/resource/page',
  resourceCreate: '/admin/ota/resource/create',
  resourceDelete: '/admin/ota/resource/delete',

  // 固件管理-固件
  upgradeTaskPage: '/admin/ota/upgrade/task/page',

  // 固件和配置新增升级
  taskCreate: '/admin/ota/upgrade/task/create',
  taskDetail: '/admin/ota/upgrade/task/detail',
  taskCustomerPage: '/admin/ota/upgrade/task/customer/page',
  taskShopPage: '/admin/ota/upgrade/task/shop/page',
  taskDevicePage: '/admin/ota/upgrade/task/device/page',
  configInfo: '/admin/ota/upgrade/task/config/info',
  blackList: '/admin/ota/upgrade/task/black/page',
  rangePage: '/admin/ota/upgrade/task/range/page',
  rangeDevicePage: '/admin/ota/upgrade/task/range/device/page',
  rangeStatistics: '/admin/ota/upgrade/task/range/statistics',
  resultCount: '/admin/ota/result/count',
  resultPage: '/admin/ota/result/page',
  taskAgain: '/admin/ota/upgrade/task/push/again',
  otaResultExport: '/admin/ota/result/export',
  // 音频管理
  audioPage: '/admin/file/audio/page',
  pushAgain: '/admin/file/push/again',
  fileExport: '/admin/file/export',
  // 日志查询
  logPage: '/admin/file/log/page',
  logLook: '/admin/file/get/url',
  logDownload: '/admin/file/download',
  logDownloadBatch: '/admin/file/download/batch',
  // 实时监控
  todayStatistics: '/admin/device/monitor/today/statistics',
  monitorPage: '/admin/device/monitor/page',
  cardList: '/admin/device/monitor/card/list',
  onlineRecords: '/admin/device/monitor/online/records',
  cardRefresh: '/admin/device/monitor/card/refresh',
  hubRefresh: '/admin/device/monitor/hub/refresh',
  remoteSet: '/admin/device/operate/remote/set',
  operateList: '/admin/device/operate/list/cmd',
  operatePage: '/admin/device/operate/page',
};

export const adminMenuList = (params) => selfHttp.get({ url: Api.menuList, params: params });
export const customerPage = (params) => selfHttp.get({ url: Api.customerPage, params: params });
export const accountCheck = (params) => selfHttp.get({ url: Api.accountCheck, params: params });
export const detectionList = (params) => selfHttp.get({ url: Api.detectionList, params: params });
export const customerBind = (params) => selfHttp.get({ url: Api.customerBind, params: params });
export const customerAudit = (params) => selfHttp.post({ url: Api.customerAudit, params: params });
export const customerAdd = (params) => selfHttp.post({ url: Api.customerAdd, params: params });
export const customerEdit = (params) => selfHttp.post({ url: Api.customerEdit, params: params });
export const customerRemove = (params) => selfHttp.get({ url: Api.customerRemove, params });
export const businessManagers = (params) => selfHttp.get({ url: Api.businessManagers, params });
export const noticeMailsSet = (params) => selfHttp.post({ url: Api.noticeMails, params: params });
export const noticeMailsGet = (params) => selfHttp.get({ url: Api.noticeMails, params: params });
export const devicePage = (params) => selfHttp.get({ url: Api.devicePage, params: params });
export const deviceCustomers = (params) =>
  selfHttp.get({ url: Api.deviceCustomers, params: params });
export const deviceShops = (params) => selfHttp.get({ url: Api.deviceShops, params: params });
export const deviceType = (params) => selfHttp.get({ url: Api.deviceType, params: params });
export const deviceVersions = (params) => selfHttp.get({ url: Api.deviceVersions, params: params });
export const exportBatch = (params) =>
  selfHttp.get({ url: Api.exportBatch, params: params, responseType: 'blob' });
export const exportBatchTemplate = (params) =>
  selfHttp.get({ url: Api.exportBatchTemplate, params: params, responseType: 'blob' });
// 批量导入设备
export const importBatchDevice = (params, data) =>
  selfHttp.post({ url: Api.importBatchDevice, params: params, data });
// 批量导入用户
export const registerBatch = (params, data) =>
  selfHttp.post({ url: Api.registerBatch, params: params, data });
export const deviceAdd = (params) => selfHttp.post({ url: Api.deviceAdd, params: params });
export const deviceDelete = (params) =>
  selfHttp.delete({ url: Api.deviceDelete + '?id=' + params.id, params: params });

export const deviceRegister = (params) =>
  selfHttp.post({ url: Api.deviceRegister, params: params });
export const checkRegister = (params) => selfHttp.get({ url: Api.checkRegister, params: params });
export const deviceShop = (params) => selfHttp.post({ url: Api.deviceShop, params: params });
// 资源管理
export const resourcePage = (params) => selfHttp.get({ url: Api.resourcePage, params: params });
export const resourceCreate = (params) =>
  selfHttp.post({ url: Api.resourceCreate, params: params });
export const resourceDelete = (params) =>
  selfHttp.delete({ url: Api.resourceDelete + '?id=' + params.id, params: params });

// 升级任务管理
export const upgradeTaskPage = (params) =>
  selfHttp.get({ url: Api.upgradeTaskPage, params: params });

export const taskCreate = (params) => selfHttp.post({ url: Api.taskCreate, params: params });
export const configInfo = (params) => selfHttp.get({ url: Api.configInfo, params: params });
export const taskCustomerPage = (params) =>
  selfHttp.get({ url: Api.taskCustomerPage, params: params });
export const taskShopPage = (params) => selfHttp.get({ url: Api.taskShopPage, params: params });
export const taskDevicePage = (params) => selfHttp.get({ url: Api.taskDevicePage, params: params });
export const blackList = (params) => selfHttp.get({ url: Api.blackList, params: params });
export const taskDetail = (params) => selfHttp.get({ url: Api.taskDetail, params: params });
export const rangePage = (params) => selfHttp.get({ url: Api.rangePage, params: params });
export const rangeDevicePage = (params) =>
  selfHttp.get({ url: Api.rangeDevicePage, params: params });
export const rangeStatistics = (params) =>
  selfHttp.get({ url: Api.rangeStatistics, params: params });
export const resultPage = (params) => selfHttp.get({ url: Api.resultPage, params: params });
export const resultCount = (params) => selfHttp.get({ url: Api.resultCount, params: params });
export const audioPage = (params) => selfHttp.get({ url: Api.audioPage, params: params });
export const pushAgain = (params) => selfHttp.get({ url: Api.pushAgain, params: params });
export const fileExport = (params) =>
  selfHttp.get({ url: Api.fileExport, params: params, responseType: 'blob' });

export const otaResultExport = (params) =>
  selfHttp.get({ url: Api.otaResultExport, params: params, responseType: 'blob' });

export const taskAgain = (params) => selfHttp.post({ url: Api.taskAgain, params: params });
export const todayStatistics = (params) =>
  selfHttp.get({ url: Api.todayStatistics, params: params });
export const monitorPage = (params) => selfHttp.get({ url: Api.monitorPage, params: params });
export const logPage = (params) => selfHttp.get({ url: Api.logPage, params: params });
export const cardList = (params) => selfHttp.get({ url: Api.cardList, params: params });
export const onlineRecords = (params) => selfHttp.get({ url: Api.onlineRecords, params: params });
export const cardRefresh = (params) => selfHttp.get({ url: Api.cardRefresh, params: params });
export const hubRefresh = (params) => selfHttp.get({ url: Api.hubRefresh, params: params });
export const operateList = (params) => selfHttp.get({ url: Api.operateList, params: params });
export const operatePage = (params) => selfHttp.get({ url: Api.operatePage, params: params });
export const remoteSet = (params) => selfHttp.post({ url: Api.remoteSet, params: params });
export const logDownload = (params) =>
  selfHttp.get({ url: Api.logDownload, params: params, responseType: 'blob' });
export const logDownloadBatch = (params) =>
  selfHttp.get({ url: Api.logDownloadBatch, params: params, responseType: 'blob' });
export const logLook = (params) => selfHttp.get({ url: Api.logLook, params: params });
