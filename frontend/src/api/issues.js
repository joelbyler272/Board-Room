import { api } from './client';

export const issuesApi = {
  getAll: (params) => api.get('/issues', params),
  getById: (id) => api.get(`/issues/${id}`),
  getStats: (companyId) => api.get('/issues/stats', { company_id: companyId }),
  create: (data) => api.post('/issues', data),
  update: (id, data) => api.put(`/issues/${id}`, data),
  startDiscussion: (id) => api.post(`/issues/${id}/start-discussion`),
  solve: (id, resolution) => api.post(`/issues/${id}/solve`, { resolution }),
  drop: (id) => api.post(`/issues/${id}/drop`),
  delete: (id) => api.delete(`/issues/${id}`),
};
