import { Link } from 'react-router-dom';
import { Mountain, ArrowRight } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useRocks, useRockStats } from '../../hooks/useRocks';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

function getCurrentQuarter() {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
}

export function RocksWidget() {
  const { companyId } = useCompany();
  const quarter = getCurrentQuarter();
  const { data: rocks, isLoading } = useRocks({
    company_id: companyId,
    quarter,
  });
  const { data: stats } = useRockStats(companyId, quarter);

  const topRocks = rocks?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Rocks</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">{quarter}</p>
        </div>
        <Link
          to="/rocks"
          className="text-sm text-navy-600 hover:text-navy-700 flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-slate-500">Loading...</div>
        ) : topRocks.length === 0 ? (
          <EmptyState
            icon={Mountain}
            title="No rocks"
            description="Add quarterly goals to track progress"
          />
        ) : (
          <>
            {/* Summary */}
            {stats && (
              <div className="grid grid-cols-4 gap-2 mb-4 pb-4 border-b border-slate-200">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {stats.on_track || 0}
                  </div>
                  <div className="text-xs text-slate-500">On Track</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">
                    {stats.off_track || 0}
                  </div>
                  <div className="text-xs text-slate-500">Off Track</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-700">
                    {stats.completed || 0}
                  </div>
                  <div className="text-xs text-slate-500">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-400">
                    {stats.dropped || 0}
                  </div>
                  <div className="text-xs text-slate-500">Dropped</div>
                </div>
              </div>
            )}

            {/* Rocks List */}
            <div className="space-y-3">
              {topRocks.map((rock) => (
                <div
                  key={rock.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {rock.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {rock.department_name || 'Company'}
                    </p>
                  </div>
                  <StatusBadge status={rock.status} />
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
