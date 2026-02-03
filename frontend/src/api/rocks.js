import { api } from './client';

export const rocksApi = {
  getAll: (params) => api.get('/rocks', params),
  getById: (id) => api.get(`/rocks/${id}`),
  getStats: (companyId, quarter) => api.get('/rocks/stats', { company_id: companyId, quarter }),
  create: (data) => api.post('/rocks', data),
  update: (id, data) => api.put(`/rocks/${id}`, data),
  delete: (id) => api.delete(`/rocks/${id}`),
};
