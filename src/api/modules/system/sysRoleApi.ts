import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchList = '/system/sysRole/selectPage',
  addObj = '/system/sysRole/add',
  editObj = '/system/sysRole/edit',
  removeObj = '/system/sysRole/remove',
  viewObj = '/system/sysRole/view',
  exportList = '/system/sysRole/export',
  listOptions = '/system/sysRole/listOptions',
  assignMenu = '/system/sysRole/assignMenu',
  listRoleMenus = '/system/sysRole/listRoleMenus',
  listRoleDepts = '/system/sysRole/listRoleDepts',
  selectOptions = '/system/sysRole/selectOptions',
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

export function assignMenu(params?: object) {
  return defHttp.post({ url: Api.assignMenu, params: params });
}

export function listRoleMenus(params?: object) {
  return defHttp.get({ url: Api.listRoleMenus, params: params });
}

export function listRoleDepts(params?: object) {
  return defHttp.get({ url: Api.listRoleDepts, params: params });
}

export function selectOptions(params?: object) {
  return defHttp.get({ url: Api.selectOptions, params: params });
}
