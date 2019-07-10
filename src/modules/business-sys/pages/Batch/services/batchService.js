import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function getBatchs(params) {
  return request(`/sys/batchs?${stringify(params)}`);
}

export async function addBatch(params) {
  return request(`/sys/batchs`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editBatch(params) {
  return request(`/sys/batchs/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function deleteBatch(id) {
  return request(`/sys/batchs/${id}`, {
    method: 'DELETE',
  });
}

export async function execBatch(params) {
  return request(`/sta/batchs/${params.id}/exec`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function getBatchPageLogs(params) {
  return request(`/sys/batchs/${params.id}/page-logs?${stringify(params)}`);
}
