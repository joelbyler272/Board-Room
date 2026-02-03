import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingsApi } from '../api/meetings';

export function useMeetings(params = {}) {
  return useQuery({
    queryKey: ['meetings', params],
    queryFn: () => meetingsApi.getAll(params),
    enabled: !!params.company_id,
  });
}

export function useMeeting(id) {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: () => meetingsApi.getById(id),
    enabled: !!id,
  });
}

export function useActiveMeeting(companyId) {
  return useQuery({
    queryKey: ['meetings', 'active', companyId],
    queryFn: () => meetingsApi.getActive(companyId),
    enabled: !!companyId,
    refetchInterval: 5000, // Refetch every 5 seconds during active meeting
  });
}

export function useRecentMeetings(companyId, limit = 10) {
  return useQuery({
    queryKey: ['meetings', 'recent', companyId, limit],
    queryFn: () => meetingsApi.getRecent(companyId, limit),
    enabled: !!companyId,
  });
}

export function useMeetingSections() {
  return useQuery({
    queryKey: ['meetings', 'sections'],
    queryFn: meetingsApi.getSections,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meetingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useStartMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meetingsApi.start,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meeting', id] });
    },
  });
}

export function useNextSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meetingsApi.nextSection,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', id] });
      queryClient.invalidateQueries({ queryKey: ['meetings', 'active'] });
    },
  });
}

export function usePreviousSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meetingsApi.previousSection,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', id] });
      queryClient.invalidateQueries({ queryKey: ['meetings', 'active'] });
    },
  });
}

export function useGoToSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, section }) => meetingsApi.goToSection(id, section),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', id] });
      queryClient.invalidateQueries({ queryKey: ['meetings', 'active'] });
    },
  });
}

export function useCompleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, summary }) => meetingsApi.complete(id, summary),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meeting', id] });
    },
  });
}

export function useCancelMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meetingsApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}
