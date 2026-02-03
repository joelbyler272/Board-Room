import { api } from './client';

export const metricsApi = {
  getAll: (params) => api.get('/metrics', params),
  getById: (id) => api.get(`/metrics/${id}`),
  getScorecard: (companyId, week) => api.get('/metrics/scorecard', { company_id: companyId, week }),
  create: (data) => api.post('/metrics', data),
  update: (id, data) => api.put(`/metrics/${id}`, data),
  updateValue: (id, value) => api.post(`/metrics/${id}/update-value`, { value }),
  delete: (id) => api.delete(`/metrics/${id}`),
};
