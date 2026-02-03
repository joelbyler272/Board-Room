import { useScorecard } from '../../../hooks/useMetrics';
import { ScorecardTable } from '../../scorecard/ScorecardTable';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { StatusBadge } from '../../ui/Badge';

export function ScorecardSection({ companyId }) {
  const { data: scorecard, isLoading } = useScorecard(companyId);

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading scorecard...</div>;
  }

  const allMetrics = scorecard
    ? Object.values(scorecard.byDepartment).flat()
    : [];

  const offTrackMetrics = allMetrics.filter((m) => m.status !== 'on_track');

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Scorecard Review
        </h2>
        <p className="text-slate-500">
          Review your measurables. Focus discussion on metrics that are off-track.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Time Target:</strong> 5 minutes
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Only discuss off-track metrics. Drop to IDS if needed.
        </p>
      </div>

      {/* Summary */}
      {scorecard?.summary && (
        <div className="grid grid-cols-4 gap-4">
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

      {/* Off-track metrics highlight */}
      {offTrackMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              Needs Attention ({offTrackMetrics.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScorecardTable metrics={offTrackMetrics} />
          </CardContent>
        </Card>
      )}

      {/* Full scorecard */}
      <Card>
        <CardHeader>
          <CardTitle>Full Scorecard</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScorecardTable metrics={allMetrics} />
        </CardContent>
      </Card>
    </div>
  );
}
