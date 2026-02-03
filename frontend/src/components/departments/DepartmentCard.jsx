import { Link } from 'react-router-dom';
import { MessageSquare, Mountain, AlertCircle, CheckSquare } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export function DepartmentCard({ department }) {
  const { id, name, agent_name, avatar_color, responsibilities, stats } = department;

  return (
    <Link to={`/departments/${id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Avatar
              name={agent_name || name}
              color={avatar_color}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900">{name}</h3>
              {agent_name && (
                <p className="text-sm text-slate-500">{agent_name}</p>
              )}
              {responsibilities && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {responsibilities}
                </p>
              )}
            </div>
            {stats?.unreadMessages > 0 && (
              <Badge variant="primary" size="sm">
                {stats.unreadMessages} new
              </Badge>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Mountain size={14} />
                <span>{stats.rockCount} rocks</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <AlertCircle size={14} />
                <span>{stats.issueCount} issues</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <CheckSquare size={14} />
                <span>{stats.todoCount} todos</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
