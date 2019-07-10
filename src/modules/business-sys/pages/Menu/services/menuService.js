import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function getMenus(params) {
  return request(`/sys/menus?${stringify(params)}`);
}

export async function addMenu(params) {
  return request(`/sys/menus`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editMenu(params) {
  return request(`/sys/menus/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function deleteMenu(id) {
  return request(`/sys/menus/${id}`, {
    method: 'DELETE',
  });
}

export async function getMenuUrls(params) {
  return request(`/sys/menus/${params.menuId}/urls?${stringify(params)}`);
}

export async function editMenuUrls(params) {
  return request(`/sys/menus/${params.menuId}/urls`, {
    method: 'PUT',
    body: [...params.list],
  });
}
