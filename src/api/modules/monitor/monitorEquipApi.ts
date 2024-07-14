import { defHttp } from '/@/utils/http/axios';

enum Api {
  monitorList = '/v1/monitor/list/page',
  setRecord = '/v1/audio/tape/audio',
  setMonitor = '/v1/monitor/open',
  broadcast = '/v1/video/event/broadcast',
}

export function monitorList(params?: object) {
  return defHttp.get({ url: Api.monitorList, params: params });
}

export function broadcast(params?: object) {
  return defHttp.request(
    { url: Api.broadcast, params: params, method: 'get', responseType: 'blob' },
    { isReturnNativeResponse: true },
  );
}

export function setRecord(params?: object) {
  return defHttp.post({ url: Api.setRecord, params: params });
}

export function setMonitor(params?: object) {
  return defHttp.post({ url: Api.setMonitor, params: params });
}
