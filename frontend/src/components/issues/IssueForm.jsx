import { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useDepartments } from '../../hooks/useDepartments';
import { useCreateIssue } from '../../hooks/useIssues';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';

export function IssueForm({ isOpen, onClose }) {
  const { companyId } = useCompany();
  const { data: departments } = useDepartments(companyId);
  const createIssue = useCreateIssue();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '2',
    department_id: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createIssue.mutateAsync({
      ...formData,
      company_id: companyId,
      priority: parseInt(formData.priority),
      department_id: formData.department_id || null,
    });

    setFormData({
      title: '',
      description: '',
      priority: '2',
      department_id: '',
    });
    onClose();
  };

  const departmentOptions = [
    { value: '', label: 'Company-wide' },
    ...(departments?.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  const priorityOptions = [
    { value: '1', label: 'High' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'Low' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Issue">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What's the issue?"
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Provide more context..."
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            options={priorityOptions}
          />

          <Select
            label="Department"
            value={formData.department_id}
            onChange={(e) =>
              setFormData({ ...formData, department_id: e.target.value })
            }
            options={departmentOptions}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createIssue.isPending}>
            Create Issue
          </Button>
        </div>
      </form>
    </Modal>
  );
}
