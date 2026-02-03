import { Link } from 'react-router-dom';
import { BarChart3, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useScorecard } from '../../hooks/useMetrics';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

export function ScorecardWidget() {
  const { companyId } = useCompany();
  const { data: scorecard, isLoading } = useScorecard(companyId);

  const allMetrics = scorecard
    ? Object.values(scorecard.byDepartment).flat().slice(0, 5)
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Scorecard</CardTitle>
        <Link
          to="/scorecard"
          className="text-sm text-navy-600 hover:text-navy-700 flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-slate-500">Loading...</div>
        ) : allMetrics.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No metrics"
            description="Add metrics to track your KPIs"
          />
        ) : (
          <>
            {/* Summary */}
            {scorecard?.summary && (
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {scorecard.summary.onTrack}
                  </div>
                  <div className="text-xs text-slate-500">On Track</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {scorecard.summary.atRisk}
                  </div>
                  <div className="text-xs text-slate-500">At Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {scorecard.summary.offTrack}
                  </div>
                  <div className="text-xs text-slate-500">Off Track</div>
                </div>
              </div>
            )}

            {/* Metrics List */}
            <div className="space-y-3">
              {allMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {metric.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {metric.department_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {metric.current_value ?? '-'}/{metric.target ?? '-'}
                      {metric.unit && ` ${metric.unit}`}
                    </span>
                    <StatusBadge status={metric.status} />
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
