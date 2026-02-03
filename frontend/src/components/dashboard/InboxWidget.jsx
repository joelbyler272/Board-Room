import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useInbox } from '../../hooks/useMessages';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { EmptyState } from '../ui/EmptyState';
import { formatDistanceToNow } from 'date-fns';

export function InboxWidget() {
  const { companyId } = useCompany();
  const { data: messages, isLoading } = useInbox(companyId, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inbox</CardTitle>
        <Link
          to="/departments"
          className="text-sm text-navy-600 hover:text-navy-700 flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        ) : messages?.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No messages"
            description="Messages from your AI team will appear here"
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {messages?.map((message) => (
              <Link
                key={message.id}
                to={`/departments/${message.department_id}`}
                className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors"
              >
                <Avatar
                  name={message.agent_name || message.department_name}
                  color={message.avatar_color}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900 truncate">
                      {message.agent_name || message.department_name}
                    </span>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate mt-0.5">
                    {message.content?.text || 'New message'}
                  </p>
                </div>
                {!message.read_at && (
                  <span className="w-2 h-2 bg-navy-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
