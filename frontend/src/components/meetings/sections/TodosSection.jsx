import { useTodos, useTodoStats } from '../../../hooks/useTodos';
import { TodoItem } from '../../todos/TodoItem';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { EmptyState } from '../../ui/EmptyState';
import { CheckSquare } from 'lucide-react';

export function TodosSection({ companyId }) {
  const { data: todos, isLoading } = useTodos({ company_id: companyId });
  const { data: stats } = useTodoStats(companyId);

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading to-dos...</div>;
  }

  const pending = todos?.filter((t) => t.status === 'pending') || [];
  const completed = todos?.filter((t) => t.status === 'completed') || [];

  const completionRate = stats
    ? Math.round(
        ((stats.completed || 0) /
          ((stats.pending || 0) + (stats.completed || 0))) *
          100
      ) || 0
    : 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          To-Do Review
        </h2>
        <p className="text-slate-500">
          Review last week's to-dos. Are they done?
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Time Target:</strong> 5 minutes
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Mark items done or not done. Goal: 90%+ completion rate.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {stats.pending || 0}
              </div>
              <div className="text-sm text-slate-500">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.completed || 0}
              </div>
              <div className="text-sm text-slate-500">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {stats.overdue || 0}
              </div>
              <div className="text-sm text-slate-500">Overdue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div
                className={`text-3xl font-bold ${
                  completionRate >= 90 ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {completionRate}%
              </div>
              <div className="text-sm text-slate-500">Completion Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending todos */}
      <Card>
        <CardHeader>
          <CardTitle>Pending To-Dos ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="All caught up!"
              description="No pending to-dos"
            />
          ) : (
            <div className="space-y-1">
              {pending.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently completed */}
      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">
              Completed ({completed.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {completed.slice(0, 5).map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
