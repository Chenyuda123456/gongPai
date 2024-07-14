import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchList = '/system/sysMenu/selectPage',
  addObj = '/system/sysMenu/add',
  editObj = '/system/sysMenu/edit',
  removeObj = '/system/sysMenu/remove',
  viewObj = '/system/sysMenu/view',
  listMenuTree = '/system/sysMenu/listMenuTree',
  selectMenuTree = '/system/sysMenu/selectMenuTree',
  selectMenuTreeAndExcludeNode = '/system/sysMenu/selectMenuTreeAndExcludeNode',
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

export function listMenuTree(params?: object) {
  return defHttp.get({ url: Api.listMenuTree, params: params });
}

export function selectMenuTree(params?: object) {
  return defHttp.get({ url: Api.selectMenuTree, params: params });
}

export function selectMenuTreeAndExcludeNode(params?: object) {
  return defHttp.get({ url: Api.selectMenuTreeAndExcludeNode, params: params });
}
