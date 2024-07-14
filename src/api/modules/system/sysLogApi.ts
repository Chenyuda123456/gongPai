import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchList = '/system/sysLog/selectPage',
  viewObj = '/system/sysLog/view',
}

export function fetchList(params?: object) {
  return defHttp.get({ url: Api.fetchList, params: params });
}

export function viewObj(params?: object) {
  return defHttp.get({ url: Api.viewObj, params: params });
}
