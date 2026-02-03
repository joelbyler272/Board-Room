import { useState } from 'react';
import { X, MessageCircle, Lightbulb, CheckCircle } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useDepartments } from '../../hooks/useDepartments';
import { useSolveIssue, useDropIssue } from '../../hooks/useIssues';
import { useCreateTodo } from '../../hooks/useTodos';
import { useCreateDecision } from '../../hooks/useDecisions';
import { useChat } from '../../hooks/useChat';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from '../ui/Badge';
import { clsx } from 'clsx';

const IDS_STEPS = [
  { id: 'identify', label: 'Identify', icon: MessageCircle },
  { id: 'discuss', label: 'Discuss', icon: Lightbulb },
  { id: 'solve', label: 'Solve', icon: CheckCircle },
];

export function IDSPanel({ issue, onClose }) {
  const { companyId } = useCompany();
  const { data: departments } = useDepartments(companyId);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [discussion, setDiscussion] = useState([]);
  const [resolution, setResolution] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState([]);

  const solveIssue = useSolveIssue();
  const dropIssue = useDropIssue();
  const createTodo = useCreateTodo();
  const createDecision = useCreateDecision();

  const department = departments?.find((d) => d.id === selectedDepartment);
  const { sendMessageAsync, isLoading: chatLoading } = useChat(
    selectedDepartment,
    companyId
  );

  const handleAskDepartment = async (question) => {
    if (!selectedDepartment || chatLoading) return;

    setDiscussion((prev) => [
      ...prev,
      { type: 'question', department: department?.name, text: question },
    ]);

    try {
      const response = await sendMessageAsync(
        `Regarding the issue "${issue.title}": ${question}`
      );
      setDiscussion((prev) => [
        ...prev,
        {
          type: 'response',
          department: department?.agent_name || department?.name,
          text: response.message.content.text,
        },
      ]);
    } catch (error) {
      console.error('Error getting response:', error);
    }
  };

  const handleAddTodo = () => {
    if (!todoTitle.trim()) return;
    setTodos((prev) => [...prev, { title: todoTitle, department_id: selectedDepartment }]);
    setTodoTitle('');
  };

  const handleSolve = async () => {
    // Create todos
    for (const todo of todos) {
      await createTodo.mutateAsync({
        company_id: companyId,
        department_id: todo.department_id,
        title: todo.title,
        issue_id: issue.id,
      });
    }

    // Create decision if resolution exists
    if (resolution) {
      await createDecision.mutateAsync({
        company_id: companyId,
        department_id: issue.department_id,
        issue_id: issue.id,
        context: issue.title,
        decision: resolution,
      });
    }

    // Mark issue as solved
    await solveIssue.mutateAsync({ id: issue.id, resolution });

    onClose();
  };

  const handleDrop = async () => {
    if (confirm('Are you sure you want to drop this issue?')) {
      await dropIssue.mutateAsync(issue.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-[600px] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PriorityBadge priority={issue.priority} />
                <span className="text-sm text-slate-500">IDS</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                {issue.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 mt-4">
            {IDS_STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  currentStep === index
                    ? 'bg-navy-100 text-navy-700'
                    : currentStep > index
                    ? 'text-green-600'
                    : 'text-slate-400'
                )}
              >
                <step.icon size={16} />
                {step.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Identify */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">
                  What's the real issue?
                </h3>
                <p className="text-sm text-slate-500">
                  {issue.description || 'No description provided.'}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  The goal of Identify is to get to the root cause. Ask "why?"
                  until you find it.
                </p>
              </div>

              <Button onClick={() => setCurrentStep(1)}>
                Continue to Discuss
              </Button>
            </div>
          )}

          {/* Step 2: Discuss */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">
                  Select a department to discuss with
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {departments?.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept.id)}
                      className={clsx(
                        'flex items-center gap-2 p-3 rounded-lg border transition-colors',
                        selectedDepartment === dept.id
                          ? 'border-navy-500 bg-navy-50'
                          : 'border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <Avatar
                        name={dept.agent_name || dept.name}
                        color={dept.avatar_color}
                        size="sm"
                      />
                      <span className="text-sm font-medium">{dept.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDepartment && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask a question..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAskDepartment(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        handleAskDepartment(input.value);
                        input.value = '';
                      }}
                      loading={chatLoading}
                    >
                      Ask
                    </Button>
                  </div>

                  {/* Discussion thread */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {discussion.map((item, index) => (
                      <div
                        key={index}
                        className={clsx(
                          'p-3 rounded-lg',
                          item.type === 'question'
                            ? 'bg-navy-50 ml-8'
                            : 'bg-slate-50 mr-8'
                        )}
                      >
                        <p className="text-xs font-medium text-slate-500 mb-1">
                          {item.department}
                        </p>
                        <p className="text-sm text-slate-900">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={() => setCurrentStep(2)}>
                Continue to Solve
              </Button>
            </div>
          )}

          {/* Step 3: Solve */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Resolution</h3>
                <Textarea
                  placeholder="What's the solution?"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-2">
                  To-Dos (7-day action items)
                </h3>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a to-do..."
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTodo();
                      }
                    }}
                  />
                  <Button onClick={handleAddTodo}>Add</Button>
                </div>
                {todos.length > 0 && (
                  <ul className="space-y-1">
                    {todos.map((todo, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded"
                      >
                        <span className="text-sm">{todo.title}</span>
                        <button
                          onClick={() =>
                            setTodos((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={handleDrop}
                  className="flex-1"
                >
                  Drop Issue
                </Button>
                <Button
                  onClick={handleSolve}
                  loading={
                    solveIssue.isPending ||
                    createTodo.isPending ||
                    createDecision.isPending
                  }
                  className="flex-1"
                >
                  Solve Issue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
