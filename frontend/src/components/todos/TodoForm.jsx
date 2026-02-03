import { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useDepartments } from '../../hooks/useDepartments';
import { useCreateTodo } from '../../hooks/useTodos';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { format, addDays } from 'date-fns';

export function TodoForm({ isOpen, onClose }) {
  const { companyId } = useCompany();
  const { data: departments } = useDepartments(companyId);
  const createTodo = useCreateTodo();

  const defaultDueDate = format(addDays(new Date(), 7), 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: defaultDueDate,
    department_id: '',
    assigned_to: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTodo.mutateAsync({
      ...formData,
      company_id: companyId,
      department_id: formData.department_id || null,
    });

    setFormData({
      title: '',
      description: '',
      due_date: defaultDueDate,
      department_id: '',
      assigned_to: '',
    });
    onClose();
  };

  const departmentOptions = [
    { value: '', label: 'No department' },
    ...(departments?.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create To-Do">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What needs to be done?"
          required
        />

        <Textarea
          label="Description (optional)"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add more details..."
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={formData.due_date}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
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

        <Input
          label="Assigned To (optional)"
          value={formData.assigned_to}
          onChange={(e) =>
            setFormData({ ...formData, assigned_to: e.target.value })
          }
          placeholder="Who is responsible?"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createTodo.isPending}>
            Create To-Do
          </Button>
        </div>
      </form>
    </Modal>
  );
}
