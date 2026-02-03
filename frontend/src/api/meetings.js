import { api } from './client';

export const meetingsApi = {
  getAll: (params) => api.get('/meetings', params),
  getById: (id) => api.get(`/meetings/${id}`),
  getActive: (companyId) => api.get('/meetings/active', { company_id: companyId }),
  getRecent: (companyId, limit) => api.get('/meetings/recent', { company_id: companyId, limit }),
  getSections: () => api.get('/meetings/sections'),
  create: (data) => api.post('/meetings', data),
  update: (id, data) => api.put(`/meetings/${id}`, data),
  start: (id) => api.post(`/meetings/${id}/start`),
  nextSection: (id) => api.post(`/meetings/${id}/next-section`),
  previousSection: (id) => api.post(`/meetings/${id}/previous-section`),
  goToSection: (id, section) => api.post(`/meetings/${id}/go-to-section`, { section }),
  complete: (id, summary) => api.post(`/meetings/${id}/complete`, { summary }),
  cancel: (id) => api.post(`/meetings/${id}/cancel`),
  delete: (id) => api.delete(`/meetings/${id}`),
};
