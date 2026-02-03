import { api } from './client';

export const messagesApi = {
  getAll: (params) => api.get('/messages', params),
  getById: (id) => api.get(`/messages/${id}`),
  getInbox: (companyId, limit) => api.get('/messages/inbox', { company_id: companyId, limit }),
  getUnreadCount: (companyId) => api.get('/messages/unread-count', { company_id: companyId }),
  getUnreadByDepartment: (companyId) => api.get('/messages/unread-by-department', { company_id: companyId }),
  getConversation: (departmentId, limit) => api.get(`/messages/conversation/${departmentId}`, limit ? { limit } : {}),
  create: (data) => api.post('/messages', data),
  markAsRead: (id) => api.post(`/messages/${id}/read`),
  markAllAsRead: (departmentId) => api.post(`/messages/mark-all-read/${departmentId}`),
  delete: (id) => api.delete(`/messages/${id}`),
};
