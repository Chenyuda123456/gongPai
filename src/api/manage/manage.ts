import { selfHttp } from '/@/utils/http/axios';
const Api = {
  deviceType: '/manager/device/device_types',
  deviceVersions: '/manager/device/firmware_versions',
  // user
  customerApply: '/manager/customer/apply',
  basicInfo: '/manager/customer/basic-info',
  noticeInfo: '/manager/customer/notice-info',
  // 获取门店列表
  customerShops: '/manager/customer/shops',
  shopsParent: '/manager/customer/shops/parent',
  shopsEdit: '/manager/customer/shop/edit',
  shopsAdd: '/manager/customer/shop/add',
  shopsRemove: '/manager/customer/shop/remove',
  devicePage: '/manager/device/page',
  deviceCustomers: '/manager/device/customers',
  exportBatch: '/manager/device/export/batch',
  registerBatch: '/manager/device/register/batch',
  deviceAdd: '/hub-card-platform/manager/device/add',
  deviceDelete: '/hub-card-platform/manager/device/delete',
  deviceRegister: '/manager/device/register',
  checkRegister: '/manager/device/check/has/bind',
  // 音频管理
  audioPage: '/manager/file/audio/page',
  pushAgain: '/manager/file/push/again',
  fileExport: '/manager/file/export',
  // 日志查询
  logPage: '/manager/file/log/page',
  logLook: '/manager/file/get/url',
  logDownload: '/manager/file/download',
  logDownloadBatch: '/manager/file/download/batch',
  // 实时监控
  todayStatistics: '/manager/device/monitor/today/statistics',
  monitorPage: '/manager/device/monitor/page',
  cardList: '/manager/device/monitor/card/list',
  onlineRecords: '/manager/device/monitor/online/records',
  cardRefresh: '/manager/device/monitor/card/refresh',
  hubRefresh: '/manager/device/monitor/hub/refresh',
  remoteSet: '/manager/device/monitor/reboot',
  importBatchDevice: '/manager/device/add/batch',
};

/**
 * @description: Trigger ajax error
 */

export const deviceType = (params) => selfHttp.get({ url: Api.deviceType, params: params });
export const deviceVersions = (params) => selfHttp.get({ url: Api.deviceVersions, params: params });
export const customerApply = (params) => selfHttp.post({ url: Api.customerApply, params: params });
export const basicInfo = (params) => selfHttp.get({ url: Api.basicInfo, params: params });
export const noticeInfo = (params) => selfHttp.post({ url: Api.noticeInfo, params: params });
export const shopsEdit = (params) => selfHttp.post({ url: Api.shopsEdit, params: params });
export const shopsAdd = (params) => selfHttp.post({ url: Api.shopsAdd, params: params });
export const customerShops = (params) => {
  params.page ? '' : (params.page = 1);
  params.pageSize ? '' : (params.pageSize = 1000);
  return selfHttp.get({ url: Api.customerShops, params: params });
};
export const shopsParent = (params) => selfHttp.get({ url: Api.shopsParent, params: params });
export const shopsRemove = (params) => selfHttp.get({ url: Api.shopsRemove, params: params });
export const devicePage = (params) => selfHttp.get({ url: Api.devicePage, params: params });
export const deviceCustomers = (params) =>
  selfHttp.get({ url: Api.deviceCustomers, params: params });
export const exportBatch = (params) =>
  selfHttp.get({ url: Api.exportBatch, params: params, responseType: 'blob' });
// 批量导入用户
export const registerBatch = (params, data) =>
  selfHttp.post({ url: Api.registerBatch, params: params, data });
export const deviceAdd = (params, data) =>
  selfHttp.post({ url: Api.deviceAdd, params: params, data });
export const deviceDelete = (params) =>
  selfHttp.delete({ url: Api.deviceDelete + '?id=' + params.id, params: params });
export const deviceRegister = (params) =>
  selfHttp.post({ url: Api.deviceRegister, params: params });
export const checkRegister = (params) => selfHttp.get({ url: Api.checkRegister, params: params });
export const audioPage = (params) => selfHttp.get({ url: Api.audioPage, params: params });
export const pushAgain = (params) => selfHttp.post({ url: Api.pushAgain, params: params });
export const fileExport = (params) =>
  selfHttp.get({ url: Api.fileExport, params: params, responseType: 'blob' });

export const todayStatistics = (params) =>
  selfHttp.get({ url: Api.todayStatistics, params: params });
export const monitorPage = (params) => selfHttp.get({ url: Api.monitorPage, params: params });
export const logPage = (params) => selfHttp.get({ url: Api.logPage, params: params });
export const cardList = (params) => selfHttp.get({ url: Api.cardList, params: params });
export const onlineRecords = (params) => selfHttp.get({ url: Api.onlineRecords, params: params });
export const cardRefresh = (params) => selfHttp.get({ url: Api.cardRefresh, params: params });
export const hubRefresh = (params) => selfHttp.get({ url: Api.hubRefresh, params: params });
export const remoteSet = (params) => selfHttp.post({ url: Api.remoteSet, params: params });
export const logDownload = (params) =>
  selfHttp.get({ url: Api.logDownload, params: params, responseType: 'blob' });
export const logDownloadBatch = (params) =>
  selfHttp.get({ url: Api.logDownloadBatch, params: params, responseType: 'blob' });
export const logLook = (params) => selfHttp.get({ url: Api.logLook, params: params });
// 批量导入设备
export const importBatchDevice = (params, data) =>
  selfHttp.post({ url: Api.importBatchDevice, params: params, data });
