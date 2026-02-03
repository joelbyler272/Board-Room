import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentsApi } from '../api/departments';

export function useDepartments(companyId) {
  return useQuery({
    queryKey: ['departments', companyId],
    queryFn: () => departmentsApi.getAll(companyId),
    enabled: !!companyId,
  });
}

export function useDepartment(id) {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => departmentsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => departmentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', id] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}
