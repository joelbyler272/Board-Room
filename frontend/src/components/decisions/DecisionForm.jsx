import { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useDepartments } from '../../hooks/useDepartments';
import { useCreateDecision } from '../../hooks/useDecisions';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';

export function DecisionForm({ isOpen, onClose }) {
  const { companyId } = useCompany();
  const { data: departments } = useDepartments(companyId);
  const createDecision = useCreateDecision();

  const [formData, setFormData] = useState({
    decision: '',
    context: '',
    rationale: '',
    department_id: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createDecision.mutateAsync({
      ...formData,
      company_id: companyId,
      department_id: formData.department_id || null,
    });

    setFormData({
      decision: '',
      context: '',
      rationale: '',
      department_id: '',
    });
    onClose();
  };

  const departmentOptions = [
    { value: '', label: 'Company-wide' },
    ...(departments?.map((d) => ({ value: d.id, label: d.name })) || []),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Decision">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="Decision"
          value={formData.decision}
          onChange={(e) =>
            setFormData({ ...formData, decision: e.target.value })
          }
          placeholder="What was decided?"
          rows={2}
          required
        />

        <Input
          label="Context"
          value={formData.context}
          onChange={(e) =>
            setFormData({ ...formData, context: e.target.value })
          }
          placeholder="What prompted this decision?"
          required
        />

        <Textarea
          label="Rationale (optional)"
          value={formData.rationale}
          onChange={(e) =>
            setFormData({ ...formData, rationale: e.target.value })
          }
          placeholder="Why was this decision made?"
          rows={2}
        />

        <Select
          label="Department"
          value={formData.department_id}
          onChange={(e) =>
            setFormData({ ...formData, department_id: e.target.value })
          }
          options={departmentOptions}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createDecision.isPending}>
            Record Decision
          </Button>
        </div>
      </form>
    </Modal>
  );
}
