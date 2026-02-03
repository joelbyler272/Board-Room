import { useCompany } from '../context/CompanyContext';
import { useScorecard } from '../hooks/useMetrics';
import { PageHeader } from '../components/layout/PageHeader';
import { ScorecardTable } from '../components/scorecard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingState } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';

export default function Scorecard() {
  const { companyId } = useCompany();
  const { data: scorecard, isLoading } = useScorecard(companyId);

  const allMetrics = scorecard
    ? Object.values(scorecard.byDepartment).flat()
    : [];

  return (
    <div>
      <PageHeader
        title="Scorecard"
        description="Weekly measurables and KPIs"
      />

      <div className="p-6">
        {isLoading ? (
          <LoadingState message="Loading scorecard..." />
        ) : allMetrics.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No metrics"
            description="Run the seed script to populate metrics."
          />
        ) : (
          <>
            {/* Summary */}
            {scorecard?.summary && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-slate-900">
                      {scorecard.summary.total}
                    </div>
                    <div className="text-sm text-slate-500">Total Metrics</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {scorecard.summary.onTrack}
                    </div>
                    <div className="text-sm text-slate-500">On Track</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {scorecard.summary.atRisk}
                    </div>
                    <div className="text-sm text-slate-500">At Risk</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {scorecard.summary.offTrack}
                    </div>
                    <div className="text-sm text-slate-500">Off Track</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Scorecard by Department */}
            {Object.entries(scorecard?.byDepartment || {}).map(
              ([deptName, metrics]) => (
                <Card key={deptName} className="mb-6">
                  <CardHeader>
                    <CardTitle>{deptName}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScorecardTable metrics={metrics} />
                  </CardContent>
                </Card>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
