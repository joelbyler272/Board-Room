import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useIssues, useIssueStats } from '../../hooks/useIssues';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

export function IssuesWidget() {
  const { companyId } = useCompany();
  const { data: issues, isLoading } = useIssues({
    company_id: companyId,
    status: 'open',
  });
  const { data: stats } = useIssueStats(companyId);

  const topIssues = issues?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Issues</CardTitle>
        <Link
          to="/issues"
          className="text-sm text-navy-600 hover:text-navy-700 flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-slate-500">Loading...</div>
        ) : topIssues.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="No open issues"
            description="Issues identified by your AI team will appear here"
          />
        ) : (
          <>
            {/* Summary */}
            {stats && (
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.open || 0}
                  </div>
                  <div className="text-xs text-slate-500">Open</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.in_discussion || 0}
                  </div>
                  <div className="text-xs text-slate-500">In Discussion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.solved || 0}
                  </div>
                  <div className="text-xs text-slate-500">Solved</div>
                </div>
              </div>
            )}

            {/* Issues List */}
            <div className="space-y-3">
              {topIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {issue.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {issue.department_name || 'Company-wide'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={issue.priority} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
