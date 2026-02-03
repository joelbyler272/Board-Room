import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, Circle, CheckCircle2 } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useTodos, useTodoStats, useCompleteTodo } from '../../hooks/useTodos';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { format, isPast, isToday } from 'date-fns';
import { clsx } from 'clsx';

export function TodosWidget() {
  const { companyId } = useCompany();
  const { data: todos, isLoading } = useTodos({
    company_id: companyId,
    status: 'pending',
  });
  const { data: stats } = useTodoStats(companyId);
  const completeTodo = useCompleteTodo();

  const topTodos = todos?.slice(0, 5) || [];

  const handleComplete = (e, id) => {
    e.preventDefault();
    completeTodo.mutate(id);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>To-Dos</CardTitle>
        <Link
          to="/todos"
          className="text-sm text-navy-600 hover:text-navy-700 flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-slate-500">Loading...</div>
        ) : topTodos.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No pending to-dos"
            description="Action items will appear here"
          />
        ) : (
          <>
            {/* Summary */}
            {stats && (
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.pending || 0}
                  </div>
                  <div className="text-xs text-slate-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.completed || 0}
                  </div>
                  <div className="text-xs text-slate-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.overdue || 0}
                  </div>
                  <div className="text-xs text-slate-500">Overdue</div>
                </div>
              </div>
            )}

            {/* Todos List */}
            <div className="space-y-2">
              {topTodos.map((todo) => {
                const isOverdue =
                  todo.due_date && isPast(new Date(todo.due_date)) && !isToday(new Date(todo.due_date));
                const isDueToday = todo.due_date && isToday(new Date(todo.due_date));

                return (
                  <div
                    key={todo.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <button
                      onClick={(e) => handleComplete(e, todo.id)}
                      className="mt-0.5 text-slate-400 hover:text-green-600 transition-colors"
                    >
                      <Circle size={18} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 truncate">
                        {todo.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {todo.department_name && (
                          <span className="text-xs text-slate-500">
                            {todo.department_name}
                          </span>
                        )}
                        {todo.due_date && (
                          <span
                            className={clsx(
                              'text-xs',
                              isOverdue && 'text-red-600 font-medium',
                              isDueToday && 'text-yellow-600 font-medium',
                              !isOverdue && !isDueToday && 'text-slate-400'
                            )}
                          >
                            {isOverdue
                              ? 'Overdue'
                              : isDueToday
                              ? 'Due today'
                              : format(new Date(todo.due_date), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
