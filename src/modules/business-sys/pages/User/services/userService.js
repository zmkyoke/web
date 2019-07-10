import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function getPageUsers(params) {
  return request(`/sys/page-users?${stringify(params)}`);
}

export async function addUser(params) {
  return request(`/sys/users`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editUser(params) {
  return request(`/sys/users/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function getUser(params) {
  return request(`/sys/users/${params.id}`);
}

export async function getCurrentUser(params) {
  return request(`/sys/current-user?${stringify(params)}`);
}

export async function editPassword(params) {
  return request(`/sys/users/${params.id}/password`, {
    method: 'POST',
    body: { ...params },
  });
}
