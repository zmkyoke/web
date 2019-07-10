import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function getDepts(params) {
  return request(`/sys/depts?${stringify(params)}`);
}

export async function addDept(params) {
  return request(`/sys/depts`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editDept(params) {
  return request(`/sys/depts/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function deleteDept(id) {
  return request(`/sys/depts/${id}`, {
    method: 'DELETE',
  });
}
