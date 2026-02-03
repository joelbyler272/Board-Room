import { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useDepartments } from '../../hooks/useDepartments';
import { useCreateRock, useUpdateRock } from '../../hooks/useRocks';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';

function getCurrentQuarter() {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
}

function getQuarterOptions() {
  const now = new Date();
  const year = now.getFullYear();
  const options = [];

  for (let y = year; y <= year + 1; y++) {
    for (let q = 1; q <= 4; q++) {
      options.push({ value: `${y}-Q${q}`, label: `${y} Q${q}` });
    }
  }

  return options;
}

export function RockForm({ rock, isOpen, onClose }) {
  const { companyId } = useCompany();
  const { data: departments } = useDepartments(companyId);
  const createRock = useCreateRock();
  const updateRock = useUpdateRock();

  const [formData, setFormData] = useState({
    title: rock?.title || '',
    description: rock?.description || '',
    quarter: rock?.quarter || getCurrentQuarter(),
    department_id: rock?.department_id || '',
    owner: rock?.owner || '',
    status: rock?.status || 'on_track',
  });

  const isEditing = !!rock;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      company_id: companyId,
      department_id: formData.department_id || null,
    };

    if (isEditing) {
      await updateRock.mutateAsync({ id: rock.id, data });
    } else {
      await createRock.mutateAsync(data);
    }

    onClose();
  };

  const departmentOptions = [
    { value: '', label: 'Company-wide' },
    ...(departments?.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  const statusOptions = [
    { value: 'on_track', label: 'On Track' },
    { value: 'off_track', label: 'Off Track' },
    { value: 'completed', label: 'Completed' },
    { value: 'dropped', label: 'Dropped' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Rock' : 'Create Rock'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Q1 Rock title"
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="What does success look like?"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Quarter"
            value={formData.quarter}
            onChange={(e) =>
              setFormData({ ...formData, quarter: e.target.value })
            }
            options={getQuarterOptions()}
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

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            placeholder="Who owns this rock?"
          />

          {isEditing && (
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              options={statusOptions}
            />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createRock.isPending || updateRock.isPending}
          >
            {isEditing ? 'Save Changes' : 'Create Rock'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
