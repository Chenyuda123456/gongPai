import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchList = '/system/sysArea/selectPage',
  listAreaTree = '/system/sysArea/listAreaTree',
}

export function fetchList(params?: object) {
  return defHttp.get({ url: Api.fetchList, params: params });
}

export function listAreaTree(params?: object) {
  return defHttp.get({ url: Api.listAreaTree, params: params });
}
