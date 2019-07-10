import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function getPageRegions(params) {
  return request(`/sys/page-regions?${stringify(params)}`);
}

export async function getRegions(params) {
  return request(`/sys/regions?${stringify(params)}`);
}

export async function addRegion(params) {
  return request(`/sys/regions`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editRegion(params) {
  return request(`/sys/regions/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function deleteRegion(id) {
  return request(`/sys/regions/${id}`, {
    method: 'DELETE',
  });
}
