import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function queryNotices(params = {}) {
  return request(`/notices?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/login', {
    method: 'POST',
    body: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/captcha?mobile=${mobile}`);
}
