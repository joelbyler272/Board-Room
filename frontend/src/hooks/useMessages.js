import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../api/messages';

export function useMessages(params = {}) {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => messagesApi.getAll(params),
    enabled: !!params.company_id || !!params.department_id,
  });
}

export function useInbox(companyId, limit = 20) {
  return useQuery({
    queryKey: ['messages', 'inbox', companyId, limit],
    queryFn: () => messagesApi.getInbox(companyId, limit),
    enabled: !!companyId,
  });
}

export function useUnreadCount(companyId) {
  return useQuery({
    queryKey: ['messages', 'unread-count', companyId],
    queryFn: () => messagesApi.getUnreadCount(companyId),
    enabled: !!companyId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useConversation(departmentId, limit = 50) {
  return useQuery({
    queryKey: ['messages', 'conversation', departmentId, limit],
    queryFn: () => messagesApi.getConversation(departmentId, limit),
    enabled: !!departmentId,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}
