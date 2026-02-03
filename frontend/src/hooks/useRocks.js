import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rocksApi } from '../api/rocks';

export function useRocks(params = {}) {
  return useQuery({
    queryKey: ['rocks', params],
    queryFn: () => rocksApi.getAll(params),
    enabled: !!params.company_id,
  });
}

export function useRock(id) {
  return useQuery({
    queryKey: ['rock', id],
    queryFn: () => rocksApi.getById(id),
    enabled: !!id,
  });
}

export function useRockStats(companyId, quarter) {
  return useQuery({
    queryKey: ['rocks', 'stats', companyId, quarter],
    queryFn: () => rocksApi.getStats(companyId, quarter),
    enabled: !!companyId,
  });
}

export function useCreateRock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rocksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rocks'] });
    },
  });
}

export function useUpdateRock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => rocksApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['rocks'] });
      queryClient.invalidateQueries({ queryKey: ['rock', id] });
    },
  });
}

export function useDeleteRock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rocksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rocks'] });
    },
  });
}
