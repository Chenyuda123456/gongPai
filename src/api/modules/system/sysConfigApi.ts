import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchList = '/system/sysConfig/selectPage',
  addObj = '/system/sysConfig/add',
  editObj = '/system/sysConfig/edit',
  removeObj = '/system/sysConfig/remove',
  viewObj = '/system/sysConfig/view',
  exportList = '/system/sysConfig/export',
  refresh = '/system/sysConfig/refresh',
}

export function fetchList(params?: object) {
  return defHttp.get({ url: Api.fetchList, params: params });
}

export function addObj(params?: object) {
  return defHttp.post({ url: Api.addObj, params: params });
}

export function editObj(params?: object) {
  return defHttp.post({ url: Api.editObj, params: params });
}

export function removeObj(params?: object) {
  return defHttp.post({ url: Api.removeObj, params: params }, { joinParamsToUrl: true });
}

export function viewObj(params?: object) {
  return defHttp.get({ url: Api.viewObj, params: params });
}

export function exportList(params?: object) {
  return defHttp.request(
    { url: Api.exportList, params: params, method: 'get', responseType: 'blob' },
    { isReturnNativeResponse: true },
  );
}

export function refresh(params?: object) {
  return defHttp.post({ url: Api.refresh, params: params });
}
