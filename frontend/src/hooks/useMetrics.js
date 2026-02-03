import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { metricsApi } from '../api/metrics';

export function useMetrics(params = {}) {
  return useQuery({
    queryKey: ['metrics', params],
    queryFn: () => metricsApi.getAll(params),
    enabled: !!params.company_id,
  });
}

export function useMetric(id) {
  return useQuery({
    queryKey: ['metric', id],
    queryFn: () => metricsApi.getById(id),
    enabled: !!id,
  });
}

export function useScorecard(companyId, week) {
  return useQuery({
    queryKey: ['metrics', 'scorecard', companyId, week],
    queryFn: () => metricsApi.getScorecard(companyId, week),
    enabled: !!companyId,
  });
}

export function useCreateMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: metricsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useUpdateMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => metricsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      queryClient.invalidateQueries({ queryKey: ['metric', id] });
    },
  });
}

export function useUpdateMetricValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, value }) => metricsApi.updateValue(id, value),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      queryClient.invalidateQueries({ queryKey: ['metric', id] });
    },
  });
}

export function useDeleteMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: metricsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
