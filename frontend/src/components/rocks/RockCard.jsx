import { useState } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useUpdateRock, useDeleteRock } from '../../hooks/useRocks';
import { clsx } from 'clsx';

export function RockCard({ rock, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  const updateRock = useUpdateRock();
  const deleteRock = useDeleteRock();

  const statusOptions = ['on_track', 'off_track', 'completed', 'dropped'];

  const handleStatusChange = (status) => {
    updateRock.mutate({ id: rock.id, data: { status } });
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this rock?')) {
      deleteRock.mutate(rock.id);
    }
    setShowMenu(false);
  };

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-900">{rock.title}</h3>
            {rock.description && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                {rock.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-400">{rock.quarter}</span>
              {rock.department_name && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-500">
                    {rock.department_name}
                  </span>
                </>
              )}
              {rock.owner && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-500">{rock.owner}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={rock.status} />

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                  <div className="px-3 py-1 text-xs font-medium text-slate-400 uppercase">
                    Status
                  </div>
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={clsx(
                        'w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50',
                        rock.status === status && 'bg-slate-50 font-medium'
                      )}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 my-1" />
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(rock);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Edit2 size={14} /> Edit
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
        </div>
      </CardContent>
    </Card>
  );
}
