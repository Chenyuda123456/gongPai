import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchList = '/system/sysDept/selectPage',
  addObj = '/system/sysDept/add',
  editObj = '/system/sysDept/edit',
  removeObj = '/system/sysDept/remove',
  viewObj = '/system/sysDept/view',
  listDeptTree = '/system/sysDept/listDeptTree',
  selectDeptTree = '/system/sysDept/selectDeptTree',
  selectDeptTreeAndExcludeNode = '/system/sysDept/selectDeptTreeAndExcludeNode',
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

export function listDeptTree(params?: object) {
  return defHttp.get({ url: Api.listDeptTree, params: params });
}

export function selectDeptTree(params?: object) {
  return defHttp.get({ url: Api.selectDeptTree, params: params });
}

export function selectDeptTreeAndExcludeNode(params?: object) {
  return defHttp.get({ url: Api.selectDeptTreeAndExcludeNode, params: params });
}
