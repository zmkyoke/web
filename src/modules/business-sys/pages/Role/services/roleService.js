import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function getPageRoles(params) {
  return request(`/sys/page-roles?${stringify(params)}`);
}

export async function getRoles(params) {
  return request(`/sys/roles?${stringify(params)}`);
}

export async function addRole(params) {
  return request(`/sys/roles`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editRole(params) {
  return request(`/sys/roles/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function deleteRole(id) {
  return request(`/sys/roles/${id}`, {
    method: 'DELETE',
  });
}

export async function getRoleMenus(params) {
  return request(`/sys/roles/${params.roleId}/menus?${stringify(params)}`);
}

export async function editRoleMenus(params) {
  return request(`/sys/roles/${params.roleId}/menus`, {
    method: 'PUT',
    body: [...params.list],
  });
}
