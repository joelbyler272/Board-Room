import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { decisionsApi } from '../api/decisions';

export function useDecisions(params = {}) {
  return useQuery({
    queryKey: ['decisions', params],
    queryFn: () => decisionsApi.getAll(params),
    enabled: !!params.company_id,
  });
}

export function useDecision(id) {
  return useQuery({
    queryKey: ['decision', id],
    queryFn: () => decisionsApi.getById(id),
    enabled: !!id,
  });
}

export function useRecentDecisions(companyId, limit = 10) {
  return useQuery({
    queryKey: ['decisions', 'recent', companyId, limit],
    queryFn: () => decisionsApi.getRecent(companyId, limit),
    enabled: !!companyId,
  });
}

export function useCreateDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: decisionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
    },
  });
}

export function useDeleteDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: decisionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
    },
  });
}
