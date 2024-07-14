import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  TestRetry = '/testRetry',
  Login = '/system/login',
  Logout = '/system/logout',
  GetUserInfo = '/system/sysUser/getUserInfo',
  GetPermCode = '/system/sysUser/getPermCode',
  getAccountInfo = '/system/sysUser/getAccountInfo',
  saveAccountInfo = '/system/sysUser/saveAccountInfo',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export function getAccountInfo() {
  return defHttp.get({ url: Api.getAccountInfo });
}

export function saveAccountInfo(params?: object) {
  return defHttp.post({ url: Api.saveAccountInfo, params: params });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
