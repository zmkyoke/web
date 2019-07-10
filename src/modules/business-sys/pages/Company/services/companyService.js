import { stringify } from 'qs';
import { request } from '@/modules/platform-core';

export async function getPageCompanies(params) {
  return request(`/sys/page-companies?${stringify(params)}`);
}

export async function getCompanies(params) {
  return request(`/sys/companies?${stringify(params)}`);
}

export async function addCompany(params) {
  return request(`/sys/companies`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editCompany(params) {
  return request(`/sys/companies/${params.id}`, {
    method: 'PUT',
    body: { ...params },
  });
}

export async function deleteCompany(id) {
  return request(`/sys/companies/${id}`, {
    method: 'DELETE',
  });
}
