import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi } from '../api/issues';

export function useIssues(params = {}) {
  return useQuery({
    queryKey: ['issues', params],
    queryFn: () => issuesApi.getAll(params),
    enabled: !!params.company_id,
  });
}

export function useIssue(id) {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: () => issuesApi.getById(id),
    enabled: !!id,
  });
}

export function useIssueStats(companyId) {
  return useQuery({
    queryKey: ['issues', 'stats', companyId],
    queryFn: () => issuesApi.getStats(companyId),
    enabled: !!companyId,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issuesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => issuesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', id] });
    },
  });
}

export function useStartDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issuesApi.startDiscussion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}

export function useSolveIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resolution }) => issuesApi.solve(id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}

export function useDropIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issuesApi.drop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issuesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}
