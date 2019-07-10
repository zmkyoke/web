import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function getParamItems(params) {
  return request(`/sys/params/items?${stringify(params)}`);
}

export async function addParamItem(params) {
  return request(`/sys/params/items`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editParamItem(params) {
  return request(`/sys/params/items/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function getParamValues(params) {
  return request(`/sys/params/values?${stringify(params)}`);
}

export async function editParamValues(params) {
  return request(`/sys/params/values`, {
    method: 'PUT',
    body: { ...params },
  });
}
