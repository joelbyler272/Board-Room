import { api } from './client';

export const chatApi = {
  send: (departmentId, message, companyId) =>
    api.post(`/chat/${departmentId}`, { message, company_id: companyId }),

  // For streaming, we need a different approach
  sendStream: async (departmentId, message, companyId, onChunk) => {
    const response = await fetch(`/api/chat/${departmentId}/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, company_id: companyId }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          onChunk(data);
        }
      }
    }
  },
};
