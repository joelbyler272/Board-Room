import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { companiesApi } from '../../api/companies';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';

export function VTOView() {
  const { company, refresh } = useCompany();
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (field, currentValue) => {
    setEditing(field);
    setValue(currentValue || '');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await companiesApi.update(company.id, { [editing]: value });
      await refresh();
      setEditing(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditing(null);
    setValue('');
  };

  const sections = [
    {
      field: 'vision',
      title: 'Vision',
      description: 'Where is the company going? What does it look like?',
    },
    {
      field: 'ten_year_target',
      title: '10-Year Target',
      description: 'Your big, hairy, audacious goal.',
    },
    {
      field: 'three_year_picture',
      title: '3-Year Picture',
      description: 'What does the company look like in 3 years?',
    },
    {
      field: 'one_year_plan',
      title: '1-Year Plan',
      description: 'What must be true in one year?',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Vision/Traction Organizer (V/TO)
        </h2>
        <p className="text-slate-500">
          Your company's strategic plan at a glance.
        </p>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section.field}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{section.title}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  {section.description}
                </p>
              </div>
              {editing !== section.field && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEdit(section.field, company?.[section.field])}
                >
                  <Edit2 size={16} />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editing === section.field ? (
                <div className="space-y-3">
                  <Textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={4}
                    placeholder={`Enter your ${section.title.toLowerCase()}...`}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={handleCancel}>
                      <X size={16} className="mr-1" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} loading={saving}>
                      <Save size={16} className="mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-700 whitespace-pre-wrap">
                  {company?.[section.field] || (
                    <span className="text-slate-400 italic">Not set</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
