import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useDecisions } from '../hooks/useDecisions';
import { useDepartments } from '../hooks/useDepartments';
import { PageHeader } from '../components/layout/PageHeader';
import { DecisionCard, DecisionForm } from '../components/decisions';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { LoadingState } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Gavel } from 'lucide-react';

export default function Decisions() {
  const { companyId } = useCompany();
  const [showForm, setShowForm] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');

  const { data: departments } = useDepartments(companyId);
  const { data: decisions, isLoading } = useDecisions({
    company_id: companyId,
    department_id: departmentFilter || undefined,
  });

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...(departments?.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  return (
    <div>
      <PageHeader
        title="Decisions"
        description="Record of decisions made"
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} className="mr-2" />
            Record Decision
          </Button>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="w-48">
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={departmentOptions}
            />
          </div>
        </div>

        {/* Decisions List */}
        {isLoading ? (
          <LoadingState message="Loading decisions..." />
        ) : decisions?.length === 0 ? (
          <EmptyState
            icon={Gavel}
            title="No decisions recorded"
            description="Document your decisions to keep everyone aligned."
            action={
              <Button onClick={() => setShowForm(true)}>
                <Plus size={18} className="mr-2" />
                Record Decision
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {decisions?.map((decision) => (
              <DecisionCard key={decision.id} decision={decision} />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <DecisionForm isOpen={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
