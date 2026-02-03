import { Circle, CheckCircle2, MoreVertical, Trash2 } from 'lucide-react';
import { useCompleteTodo, useDropTodo, useDeleteTodo } from '../../hooks/useTodos';
import { format, isPast, isToday } from 'date-fns';
import { clsx } from 'clsx';
import { useState } from 'react';

export function TodoItem({ todo }) {
  const [showMenu, setShowMenu] = useState(false);
  const completeTodo = useCompleteTodo();
  const dropTodo = useDropTodo();
  const deleteTodo = useDeleteTodo();

  const isCompleted = todo.status === 'completed';
  const isDropped = todo.status === 'dropped';
  const isOverdue =
    todo.due_date &&
    isPast(new Date(todo.due_date)) &&
    !isToday(new Date(todo.due_date)) &&
    !isCompleted;
  const isDueToday =
    todo.due_date && isToday(new Date(todo.due_date)) && !isCompleted;

  const handleToggle = () => {
    if (isCompleted) return;
    completeTodo.mutate(todo.id);
  };

  const handleDrop = () => {
    dropTodo.mutate(todo.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this to-do?')) {
      deleteTodo.mutate(todo.id);
    }
    setShowMenu(false);
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-3 rounded-lg transition-colors',
        isCompleted && 'bg-green-50',
        isDropped && 'bg-slate-50 opacity-60',
        !isCompleted && !isDropped && 'hover:bg-slate-50'
      )}
    >
      <button
        onClick={handleToggle}
        disabled={isCompleted || isDropped}
        className={clsx(
          'mt-0.5 transition-colors',
          isCompleted
            ? 'text-green-500'
            : 'text-slate-400 hover:text-green-500'
        )}
      >
        {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            'text-sm',
            isCompleted && 'line-through text-slate-500',
            isDropped && 'line-through text-slate-400'
          )}
        >
          {todo.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {todo.department_name && (
            <span className="text-xs text-slate-500">
              {todo.department_name}
            </span>
          )}
          {todo.due_date && (
            <span
              className={clsx(
                'text-xs',
                isOverdue && 'text-red-600 font-medium',
                isDueToday && 'text-yellow-600 font-medium',
                !isOverdue && !isDueToday && 'text-slate-400'
              )}
            >
              {isOverdue
                ? `Overdue: ${format(new Date(todo.due_date), 'MMM d')}`
                : isDueToday
                ? 'Due today'
                : `Due: ${format(new Date(todo.due_date), 'MMM d')}`}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
        >
          <MoreVertical size={16} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
            {!isCompleted && !isDropped && (
              <button
                onClick={handleDrop}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50"
              >
                Drop
              </button>
            )}
            <button
              onClick={handleDelete}
              className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
