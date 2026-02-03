import { useCompany } from '../context/CompanyContext';
import { PageHeader } from '../components/layout/PageHeader';
import { VTOView, CoreValuesEditor } from '../components/settings';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { companiesApi } from '../api/companies';
import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

export default function Settings() {
  const { company, refresh } = useCompany();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(company?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await companiesApi.update(company.id, { name });
      await refresh();
      setEditingName(false);
    } catch (error) {
      console.error('Error saving:', error);
    }
    setSaving(false);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Company configuration and V/TO"
      />

      <div className="p-6 space-y-6">
        {/* Company Name */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Company Information</CardTitle>
            {!editingName && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setName(company?.name || '');
                  setEditingName(true);
                }}
              >
                <Edit2 size={16} />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {editingName ? (
              <div className="flex items-center gap-3">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Company name"
                  className="max-w-md"
                />
                <Button size="sm" onClick={handleSaveName} loading={saving}>
                  <Save size={16} className="mr-1" /> Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingName(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <p className="text-lg font-medium text-slate-900">
                {company?.name}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Core Values */}
        <CoreValuesEditor />

        {/* V/TO */}
        <VTOView />
      </div>
    </div>
  );
}
