import { useRocks, useRockStats } from '../../../hooks/useRocks';
import { RockCard } from '../../rocks/RockCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

function getCurrentQuarter() {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
}

export function RocksSection({ companyId }) {
  const quarter = getCurrentQuarter();
  const { data: rocks, isLoading } = useRocks({ company_id: companyId, quarter });
  const { data: stats } = useRockStats(companyId, quarter);

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading rocks...</div>;
  }

  const onTrack = rocks?.filter((r) => r.status === 'on_track') || [];
  const offTrack = rocks?.filter((r) => r.status === 'off_track') || [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Rock Review - {quarter}
        </h2>
        <p className="text-slate-500">
          Review quarterly rocks. Are they on track or off track?
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Time Target:</strong> 5 minutes
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Quick on-track/off-track check. Drop to IDS for off-track rocks.
        </p>
      </div>

      {/* Summary */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.on_track || 0}
              </div>
              <div className="text-sm text-slate-500">On Track</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {stats.off_track || 0}
              </div>
              <div className="text-sm text-slate-500">Off Track</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-700">
                {stats.completed || 0}
              </div>
              <div className="text-sm text-slate-500">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-slate-400">
                {stats.dropped || 0}
              </div>
              <div className="text-sm text-slate-500">Dropped</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Off-track rocks */}
      {offTrack.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-red-600 mb-3">
            Off Track ({offTrack.length})
          </h3>
          <div className="space-y-3">
            {offTrack.map((rock) => (
              <RockCard key={rock.id} rock={rock} />
            ))}
          </div>
        </div>
      )}

      {/* On-track rocks */}
      {onTrack.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-green-600 mb-3">
            On Track ({onTrack.length})
          </h3>
          <div className="space-y-3">
            {onTrack.map((rock) => (
              <RockCard key={rock.id} rock={rock} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
