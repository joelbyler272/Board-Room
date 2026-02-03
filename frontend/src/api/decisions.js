import { api } from './client';

export const decisionsApi = {
  getAll: (params) => api.get('/decisions', params),
  getById: (id) => api.get(`/decisions/${id}`),
  getRecent: (companyId, limit) => api.get('/decisions/recent', { company_id: companyId, limit }),
  create: (data) => api.post('/decisions', data),
  delete: (id) => api.delete(`/decisions/${id}`),
};
