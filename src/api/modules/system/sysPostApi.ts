import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchList = '/system/sysPost/selectPage',
  addObj = '/system/sysPost/add',
  editObj = '/system/sysPost/edit',
  removeObj = '/system/sysPost/remove',
  viewObj = '/system/sysPost/view',
  exportList = '/system/sysPost/export',
  listOptions = '/system/sysPost/listOptions',
  selectOptions = '/system/sysPost/selectOptions',
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

export function listOptions(params?: object) {
  return defHttp.get({ url: Api.listOptions, params: params });
}

export function selectOptions(params?: object) {
  return defHttp.get({ url: Api.selectOptions, params: params });
}
