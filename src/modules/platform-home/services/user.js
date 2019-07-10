import { request } from '@/modules/platform-core';

export async function query() {
  return request('/sys/users');
}

export async function queryCurrent() {
  return request('/sys/current-user');
}

export async function queryUserMenus() {
  return request('/sys/role-menus');
}
