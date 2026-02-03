import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useTodos, useTodoStats } from '../hooks/useTodos';
import { useDepartments } from '../hooks/useDepartments';
import { PageHeader } from '../components/layout/PageHeader';
import { TodoItem, TodoForm } from '../components/todos';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import { LoadingState } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { CheckSquare } from 'lucide-react';

export default function Todos() {
  const { companyId } = useCompany();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const { data: departments } = useDepartments(companyId);
  const { data: todos, isLoading } = useTodos({
    company_id: companyId,
    status: statusFilter || undefined,
    department_id: departmentFilter || undefined,
  });
  const { data: stats } = useTodoStats(companyId);

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...(departments?.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'dropped', label: 'Dropped' },
  ];

  const completionRate = stats
    ? Math.round(
        ((stats.completed || 0) /
          ((stats.pending || 0) + (stats.completed || 0))) *
          100
      ) || 0
    : 0;

  const pending = todos?.filter((t) => t.status === 'pending') || [];
  const completed = todos?.filter((t) => t.status === 'completed') || [];

  return (
    <div>
      <PageHeader
        title="To-Dos"
        description="7-day action items"
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} className="mr-2" />
            Add To-Do
          </Button>
        }
      />

      <div className="p-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
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

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </div>
          <div className="w-48">
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={departmentOptions}
            />
          </div>
        </div>

        {/* Todos List */}
        {isLoading ? (
          <LoadingState message="Loading to-dos..." />
        ) : todos?.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No to-dos"
            description="Add to-dos to track your action items."
            action={
              <Button onClick={() => setShowForm(true)}>
                <Plus size={18} className="mr-2" />
                Add To-Do
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pending */}
            <Card>
              <CardHeader>
                <CardTitle>Pending ({pending.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pending.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">
                    All caught up!
                  </p>
                ) : (
                  <div className="space-y-1">
                    {pending.map((todo) => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">
                  Completed ({completed.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completed.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">
                    No completed items
                  </p>
                ) : (
                  <div className="space-y-1">
                    {completed.map((todo) => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <TodoForm isOpen={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
