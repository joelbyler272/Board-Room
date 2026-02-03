import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useConversation, useMarkAllAsRead } from '../../hooks/useMessages';
import { useChat } from '../../hooks/useChat';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';

export function AgentChat({ department }) {
  const { companyId } = useCompany();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { data: messages, isLoading: messagesLoading } = useConversation(
    department.id,
    50
  );
  const markAllAsRead = useMarkAllAsRead();
  const { sendMessage, isLoading, isStreaming, streamContent, error } = useChat(
    department.id,
    companyId
  );

  // Mark messages as read when opening chat
  useEffect(() => {
    if (department.id) {
      markAllAsRead.mutate(department.id);
    }
  }, [department.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamContent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
        <Avatar
          name={department.agent_name || department.name}
          color={department.avatar_color}
          size="md"
        />
        <div>
          <h3 className="font-semibold text-slate-900">
            {department.agent_name || department.name}
          </h3>
          <p className="text-xs text-slate-500">{department.name}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" className="text-navy-600" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>Start a conversation with {department.agent_name || department.name}</p>
          </div>
        ) : (
          messages?.map((message) => (
            <Message
              key={message.id}
              message={message}
              department={department}
            />
          ))
        )}

        {/* Streaming response */}
        {isStreaming && streamContent && (
          <div className="flex gap-3">
            <Avatar
              name={department.agent_name || department.name}
              color={department.avatar_color}
              size="sm"
            />
            <div className="flex-1">
              <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-2 max-w-[80%]">
                <p className="text-sm text-slate-900 whitespace-pre-wrap">
                  {streamContent}
                  <span className="inline-block w-1 h-4 ml-1 bg-navy-600 animate-pulse" />
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !isStreaming && (
          <div className="flex gap-3">
            <Avatar
              name={department.agent_name || department.name}
              color={department.avatar_color}
              size="sm"
            />
            <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-600">
            Error: {error.message || 'Failed to send message'}
          </p>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-slate-200"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${department.agent_name || department.name}...`}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="rounded-full w-10 h-10 p-0"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}

function Message({ message, department }) {
  const isOutbound = message.direction === 'outbound';
  const content = message.content?.text || message.content;
  const createdItems = message.content?.createdItems;

  return (
    <div
      className={clsx(
        'flex gap-3',
        isOutbound && 'flex-row-reverse'
      )}
    >
      {!isOutbound && (
        <Avatar
          name={department.agent_name || department.name}
          color={department.avatar_color}
          size="sm"
        />
      )}
      <div
        className={clsx(
          'max-w-[80%]',
          isOutbound && 'ml-auto'
        )}
      >
        <div
          className={clsx(
            'rounded-2xl px-4 py-2',
            isOutbound
              ? 'bg-navy-600 text-white rounded-tr-md'
              : 'bg-slate-100 text-slate-900 rounded-tl-md'
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>

        {/* Show created items */}
        {createdItems && (createdItems.issues?.length > 0 || createdItems.todos?.length > 0) && (
          <div className="mt-2 space-y-1">
            {createdItems.issues?.map((issue) => (
              <div
                key={issue.id}
                className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded"
              >
                Issue created: {issue.title}
              </div>
            ))}
            {createdItems.todos?.map((todo) => (
              <div
                key={todo.id}
                className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
              >
                To-do created: {todo.title}
              </div>
            ))}
          </div>
        )}

        <p
          className={clsx(
            'text-xs text-slate-400 mt-1',
            isOutbound && 'text-right'
          )}
        >
          {formatDistanceToNow(new Date(message.created_at), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
