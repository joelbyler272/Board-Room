import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../api/todos';

export function useTodos(params = {}) {
  return useQuery({
    queryKey: ['todos', params],
    queryFn: () => todosApi.getAll(params),
    enabled: !!params.company_id,
  });
}

export function useTodo(id) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => todosApi.getById(id),
    enabled: !!id,
  });
}

export function useTodoStats(companyId) {
  return useQuery({
    queryKey: ['todos', 'stats', companyId],
    queryFn: () => todosApi.getStats(companyId),
    enabled: !!companyId,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => todosApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
    },
  });
}

export function useCompleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useDropTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.drop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
