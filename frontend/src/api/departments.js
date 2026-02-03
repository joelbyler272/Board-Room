import { api } from './client';

export const departmentsApi = {
  getAll: (companyId) => api.get('/departments', companyId ? { company_id: companyId } : {}),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};
