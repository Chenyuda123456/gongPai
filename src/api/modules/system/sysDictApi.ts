import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchList = '/system/sysDict/selectPage',
  addObj = '/system/sysDict/add',
  editObj = '/system/sysDict/edit',
  removeObj = '/system/sysDict/remove',
  viewObj = '/system/sysDict/view',
  exportList = '/system/sysDict/export',
  refresh = '/system/sysDict/refresh',
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
