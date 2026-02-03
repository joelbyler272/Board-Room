import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { companiesApi } from '../../api/companies';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

export function CoreValuesEditor() {
  const { company, refresh } = useCompany();
  const [values, setValues] = useState(company?.core_values || []);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleAdd = () => {
    setValues([...values, { name: '', description: '' }]);
    setHasChanges(true);
  };

  const handleRemove = (index) => {
    setValues(values.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleChange = (index, field, value) => {
    const updated = [...values];
    updated[index] = { ...updated[index], [field]: value };
    setValues(updated);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await companiesApi.update(company.id, {
        core_values: values.filter((v) => v.name.trim()),
      });
      await refresh();
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving:', error);
    }
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Core Values</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Your company's guiding principles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleAdd}>
            <Plus size={16} className="mr-1" /> Add Value
          </Button>
          {hasChanges && (
            <Button size="sm" onClick={handleSave} loading={saving}>
              <Save size={16} className="mr-1" /> Save
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {values.length === 0 ? (
          <p className="text-slate-400 italic text-center py-4">
            No core values defined. Click "Add Value" to start.
          </p>
        ) : (
          <div className="space-y-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Core value name"
                    value={value.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={value.description || ''}
                    onChange={(e) =>
                      handleChange(index, 'description', e.target.value)
                    }
                    rows={2}
                  />
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
