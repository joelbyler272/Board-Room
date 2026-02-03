import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mountain, AlertCircle, CheckSquare } from 'lucide-react';
import { useDepartment } from '../hooks/useDepartments';
import { useRocks } from '../hooks/useRocks';
import { useIssues } from '../hooks/useIssues';
import { useTodos } from '../hooks/useTodos';
import { useCompany } from '../context/CompanyContext';
import { AgentChat } from '../components/departments/AgentChat';
import { RockCard } from '../components/rocks/RockCard';
import { IssueCard } from '../components/issues/IssueCard';
import { TodoItem } from '../components/todos/TodoItem';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { LoadingState } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';

export default function DepartmentDetail() {
  const { id } = useParams();
  const { companyId } = useCompany();
  const { data: department, isLoading } = useDepartment(id);
  const { data: rocks } = useRocks({ company_id: companyId, department_id: id });
  const { data: issues } = useIssues({ company_id: companyId, department_id: id });
  const { data: todos } = useTodos({ company_id: companyId, department_id: id });

  if (isLoading || !department) {
    return <LoadingState message="Loading department..." />;
  }

  const openIssues = issues?.filter((i) => i.status !== 'solved' && i.status !== 'dropped') || [];
  const pendingTodos = todos?.filter((t) => t.status === 'pending') || [];

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <Link
          to="/departments"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Departments
        </Link>

        <div className="flex items-start gap-4">
          <Avatar
            name={department.agent_name || department.name}
            color={department.avatar_color}
            size="xl"
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {department.name}
            </h1>
            {department.agent_name && (
              <p className="text-slate-500">{department.agent_name}</p>
            )}
            {department.responsibilities && (
              <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                {department.responsibilities}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat */}
          <div className="lg:col-span-1">
            <AgentChat department={department} />
          </div>

          {/* Context Panels */}
          <div className="space-y-6">
            {/* Rocks */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Mountain size={18} className="text-slate-500" />
                <CardTitle>Rocks</CardTitle>
              </CardHeader>
              <CardContent>
                {rocks?.length === 0 ? (
                  <EmptyState title="No rocks" description="No quarterly goals assigned" />
                ) : (
                  <div className="space-y-3">
                    {rocks?.slice(0, 3).map((rock) => (
                      <RockCard key={rock.id} rock={rock} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Issues */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <AlertCircle size={18} className="text-slate-500" />
                <CardTitle>Open Issues ({openIssues.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {openIssues.length === 0 ? (
                  <EmptyState title="No issues" description="No open issues" />
                ) : (
                  <div className="space-y-3">
                    {openIssues.slice(0, 3).map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Todos */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CheckSquare size={18} className="text-slate-500" />
                <CardTitle>Pending To-Dos ({pendingTodos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingTodos.length === 0 ? (
                  <EmptyState title="No to-dos" description="No pending tasks" />
                ) : (
                  <div className="space-y-1">
                    {pendingTodos.slice(0, 5).map((todo) => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
