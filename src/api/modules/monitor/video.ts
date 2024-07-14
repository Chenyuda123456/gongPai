import { defHttp } from '/@/utils/http/axios';

enum Api {
  realTimeList = '/v1/video/real/monitor',
  choseVoice = '/v1/video/choose/audio',
  palyBackList = '/v1/warn/list/page',
  playTextList = '/v1/video/text/list/page',
  recordData = '/v1/video/detail',
  deviceList = '/v1/video/devices',
  historyRecordData = '/v1/video/history/play',
  audioTypeList = '/v1/video/audio-type/list',
}

export function fetchRealTimeList(params?: object) {
  return defHttp.get({ url: Api.realTimeList, params });
}

export function fetchChoseVoice(params?: object) {
  return defHttp.post({ url: Api.choseVoice, params });
}

export function fetchPalyBackList(params?: object) {
  return defHttp.get({ url: Api.palyBackList, params });
}

export function fetchPlayTextList(params?: object) {
  return defHttp.get({ url: Api.playTextList, params });
}

export function getRecordData(params?: object) {
  return defHttp.get({ url: Api.recordData, params });
}

export function getDeviceList(params?: object) {
  return defHttp.get({ url: Api.deviceList, params });
}

export function getHistoryRecordData(params?: object) {
  return defHttp.get({ url: Api.historyRecordData, params });
}

export function getAudioTypeList(params?: object) {
  return defHttp.get({ url: Api.audioTypeList, params });
}
