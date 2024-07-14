import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchList = '/system/monitor/online/selectPage',
  forceLogout = '/system/monitor/online/forceLogout',
}

export function fetchList(params?: object) {
  return defHttp.get({ url: Api.fetchList, params: params });
}

export function forceLogout(params?: object) {
  return defHttp.post({ url: Api.forceLogout, params: params }, { joinParamsToUrl: true });
}
