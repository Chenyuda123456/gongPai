import { defHttp } from '/@/utils/http/axios';

enum Api {
  devicesList = '/v1/video/devices',
  eventList = '/v1/warn/list/page',
  eventDeal = '/v1/warn/deal',
  listDictModel = '/system/sysDict/listDictModel',
  broadcast = '/v1/video/event/broadcast',
}

export function devicesList(params?: object) {
  return defHttp.get({ url: Api.devicesList, params: params });
}

export function eventList(params?: object) {
  return defHttp.get({ url: Api.eventList, params: params });
}

export function eventDeal(params?: object) {
  return defHttp.post({ url: Api.eventDeal, params: params });
}

export function listDictModel(params?: object) {
  return defHttp.get({ url: Api.listDictModel, params: params });
}

export function broadcast(params?: object) {
  return defHttp.request(
    { url: Api.broadcast, params: params, method: 'get', responseType: 'blob' },
    { isReturnNativeResponse: true },
  );
}
