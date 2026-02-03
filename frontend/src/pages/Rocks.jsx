import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useRocks, useRockStats } from '../hooks/useRocks';
import { useDepartments } from '../hooks/useDepartments';
import { PageHeader } from '../components/layout/PageHeader';
import { RockCard, RockForm } from '../components/rocks';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import { LoadingState } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Mountain } from 'lucide-react';

function getCurrentQuarter() {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
}

function getQuarterOptions() {
  const now = new Date();
  const year = now.getFullYear();
  const options = [{ value: '', label: 'All Quarters' }];

  for (let y = year - 1; y <= year + 1; y++) {
    for (let q = 1; q <= 4; q++) {
      options.push({ value: `${y}-Q${q}`, label: `${y} Q${q}` });
    }
  }

  return options;
}

export default function Rocks() {
  const { companyId } = useCompany();
  const [showForm, setShowForm] = useState(false);
  const [editingRock, setEditingRock] = useState(null);
  const [quarter, setQuarter] = useState(getCurrentQuarter());
  const [departmentFilter, setDepartmentFilter] = useState('');

  const { data: departments } = useDepartments(companyId);
  const { data: rocks, isLoading } = useRocks({
    company_id: companyId,
    quarter: quarter || undefined,
    department_id: departmentFilter || undefined,
  });
  const { data: stats } = useRockStats(companyId, quarter || undefined);

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...(departments?.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  const handleEdit = (rock) => {
    setEditingRock(rock);
    setShowForm(true);
  };

  return (
    <div>
      <PageHeader
        title="Rocks"
        description="Quarterly goals and priorities"
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} className="mr-2" />
            Add Rock
          </Button>
        }
      />

      <div className="p-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.on_track || 0}
                </div>
                <div className="text-sm text-slate-500">On Track</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {stats.off_track || 0}
                </div>
                <div className="text-sm text-slate-500">Off Track</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-700">
                  {stats.completed || 0}
                </div>
                <div className="text-sm text-slate-500">Completed</div>
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
          <div className="w-48">
            <Select
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              options={getQuarterOptions()}
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

        {/* Rocks List */}
        {isLoading ? (
          <LoadingState message="Loading rocks..." />
        ) : rocks?.length === 0 ? (
          <EmptyState
            icon={Mountain}
            title="No rocks"
            description="Add your first quarterly rock to get started."
            action={
              <Button onClick={() => setShowForm(true)}>
                <Plus size={18} className="mr-2" />
                Add Rock
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {rocks?.map((rock) => (
              <RockCard key={rock.id} rock={rock} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <RockForm
        rock={editingRock}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingRock(null);
        }}
      />
    </div>
  );
}
