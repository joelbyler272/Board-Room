import { useState } from 'react';
import { MoreVertical, MessageCircle, Check, X, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { useStartDiscussion, useSolveIssue, useDropIssue, useDeleteIssue } from '../../hooks/useIssues';
import { clsx } from 'clsx';

export function IssueCard({ issue, onDiscuss }) {
  const [showMenu, setShowMenu] = useState(false);
  const startDiscussion = useStartDiscussion();
  const solveIssue = useSolveIssue();
  const dropIssue = useDropIssue();
  const deleteIssue = useDeleteIssue();

  const handleStartDiscussion = () => {
    startDiscussion.mutate(issue.id);
    if (onDiscuss) onDiscuss(issue);
    setShowMenu(false);
  };

  const handleSolve = () => {
    const resolution = prompt('Enter resolution:');
    if (resolution) {
      solveIssue.mutate({ id: issue.id, resolution });
    }
    setShowMenu(false);
  };

  const handleDrop = () => {
    if (confirm('Are you sure you want to drop this issue?')) {
      dropIssue.mutate(issue.id);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this issue?')) {
      deleteIssue.mutate(issue.id);
    }
    setShowMenu(false);
  };

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
            </div>
            <h3 className="font-medium text-slate-900">{issue.title}</h3>
            {issue.description && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                {issue.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {issue.department_name && (
                <span className="text-xs text-slate-500">
                  {issue.department_name}
                </span>
              )}
              {issue.surfaced_by_name && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-400">
                    Surfaced by {issue.surfaced_by_name}
                  </span>
                </>
              )}
            </div>
            {issue.resolution && (
              <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                <strong>Resolution:</strong> {issue.resolution}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                {issue.status === 'open' && (
                  <button
                    onClick={handleStartDiscussion}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <MessageCircle size={14} /> Start IDS
                  </button>
                )}
                {issue.status !== 'solved' && (
                  <button
                    onClick={handleSolve}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Check size={14} /> Mark Solved
                  </button>
                )}
                {issue.status !== 'dropped' && (
                  <button
                    onClick={handleDrop}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <X size={14} /> Drop Issue
                  </button>
                )}
                <div className="border-t border-slate-100 my-1" />
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
      </CardContent>
    </Card>
  );
}
