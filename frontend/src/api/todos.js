import { api } from './client';

export const todosApi = {
  getAll: (params) => api.get('/todos', params),
  getById: (id) => api.get(`/todos/${id}`),
  getStats: (companyId) => api.get('/todos/stats', { company_id: companyId }),
  create: (data) => api.post('/todos', data),
  update: (id, data) => api.put(`/todos/${id}`, data),
  complete: (id) => api.post(`/todos/${id}/complete`),
  drop: (id) => api.post(`/todos/${id}/drop`),
  delete: (id) => api.delete(`/todos/${id}`),
};
