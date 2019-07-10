import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function getDictionaryTypes(params) {
  return request(`/sys/dictionary/types?${stringify(params)}`);
}

export async function addDictionaryType(params) {
  return request(`/sys/dictionary/types`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editDictionaryType(params) {
  return request(`/sys/dictionary/types/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function deleteDictionaryType(id) {
  return request(`/sys/dictionary/types/${id}`, {
    method: 'DELETE',
  });
}

export async function getDictionaryItems(params) {
  return request(`/sys/dictionary/items?${stringify(params)}`);
}

export async function addDictionaryItem(params) {
  return request(`/sys/dictionary/items`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editDictionaryItem(params) {
  return request(`/sys/dictionary/items/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function getDictionaryBatchItems(params) {
  return request(`/sys/dictionary/batch-items?${stringify(params)}`);
}
