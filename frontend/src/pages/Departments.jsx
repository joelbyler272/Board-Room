import { useCompany } from '../context/CompanyContext';
import { useDepartments } from '../hooks/useDepartments';
import { PageHeader } from '../components/layout/PageHeader';
import { DepartmentCard } from '../components/departments/DepartmentCard';
import { LoadingState } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Building2 } from 'lucide-react';

export default function Departments() {
  const { companyId } = useCompany();
  const { data: departments, isLoading } = useDepartments(companyId);

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Your AI department heads"
      />

      <div className="p-6">
        {isLoading ? (
          <LoadingState message="Loading departments..." />
        ) : departments?.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No departments"
            description="Run the seed script to populate your departments."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments?.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
