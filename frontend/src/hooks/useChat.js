import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat';

export function useChat(departmentId, companyId) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: (message) => chatApi.send(departmentId, message, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'conversation', departmentId] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const sendStreamMessage = useCallback(async (message) => {
    setIsStreaming(true);
    setStreamContent('');

    try {
      await chatApi.sendStream(departmentId, message, companyId, (data) => {
        if (data.type === 'chunk') {
          setStreamContent((prev) => prev + data.content);
        } else if (data.type === 'done') {
          setIsStreaming(false);
          queryClient.invalidateQueries({ queryKey: ['messages', 'conversation', departmentId] });
          queryClient.invalidateQueries({ queryKey: ['issues'] });
          queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
      });
    } catch (error) {
      setIsStreaming(false);
      throw error;
    }
  }, [departmentId, companyId, queryClient]);

  return {
    sendMessage: sendMessage.mutate,
    sendMessageAsync: sendMessage.mutateAsync,
    sendStreamMessage,
    isLoading: sendMessage.isPending || isStreaming,
    isStreaming,
    streamContent,
    error: sendMessage.error,
  };
}
