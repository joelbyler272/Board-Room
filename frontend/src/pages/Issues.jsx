import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useIssues, useIssueStats } from '../hooks/useIssues';
import { useDepartments } from '../hooks/useDepartments';
import { PageHeader } from '../components/layout/PageHeader';
import { IssueCard, IssueForm, IDSPanel } from '../components/issues';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import { LoadingState } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { AlertCircle } from 'lucide-react';

export default function Issues() {
  const { companyId } = useCompany();
  const [showForm, setShowForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const { data: departments } = useDepartments(companyId);
  const { data: issues, isLoading } = useIssues({
    company_id: companyId,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    department_id: departmentFilter || undefined,
  });
  const { data: stats } = useIssueStats(companyId);

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...(departments?.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_discussion', label: 'In Discussion' },
    { value: 'solved', label: 'Solved' },
    { value: 'dropped', label: 'Dropped' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: '1', label: 'High' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'Low' },
  ];

  return (
    <div>
      <PageHeader
        title="Issues"
        description="Problems, obstacles, and challenges"
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} className="mr-2" />
            Add Issue
          </Button>
        }
      />

      <div className="p-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.open || 0}
                </div>
                <div className="text-sm text-slate-500">Open</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {stats.in_discussion || 0}
                </div>
                <div className="text-sm text-slate-500">In Discussion</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.solved || 0}
                </div>
                <div className="text-sm text-slate-500">Solved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-slate-400">
                  {stats.dropped || 0}
                </div>
                <div className="text-sm text-slate-500">Dropped</div>
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
          <div className="w-40">
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={priorityOptions}
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

        {/* Issues List */}
        {isLoading ? (
          <LoadingState message="Loading issues..." />
        ) : issues?.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="No issues"
            description="Add issues to track and resolve problems."
            action={
              <Button onClick={() => setShowForm(true)}>
                <Plus size={18} className="mr-2" />
                Add Issue
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {issues?.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onDiscuss={setSelectedIssue}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <IssueForm isOpen={showForm} onClose={() => setShowForm(false)} />

      {/* IDS Panel */}
      {selectedIssue && (
        <IDSPanel
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
