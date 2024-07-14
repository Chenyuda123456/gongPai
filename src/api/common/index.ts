import { defHttp } from '/@/utils/http/axios';
import { useGlobSetting } from '/@/hooks/setting';

const globSetting = useGlobSetting();

import { UploadFileParams } from '/#/axios';

enum Api {
  listDictModel = '/system/sysDict/listDictModel',
  getConfigValue = '/system/sysConfig/getConfigValue',
  tenantList = '/v1/tenant/list',
  appList = '/v1/app/tenant/list',
  productList = '/v1/product/list',
}

export function listDictModel(params?: object) {
  return defHttp.get({ url: Api.listDictModel, params: params });
}

export function getConfigValue(params?: object) {
  return defHttp.get({ url: Api.getConfigValue, params: params });
}

export function tenantList(params?: object) {
  return defHttp.get({ url: Api.tenantList, params: params });
}

export function appList(params?: object) {
  return defHttp.get({ url: Api.appList, params: params });
}

export function productList(params?: object) {
  return defHttp.get({ url: Api.productList, params: params });
}

export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile(
    {
      url: globSetting.apiUrl + '/system/common/upload',
      onUploadProgress,
    },
    params,
  );
}
