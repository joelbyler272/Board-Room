import { MetricRow } from './MetricRow';

export function ScorecardTable({ metrics }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Metric
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Owner
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actual
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Target
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {metrics.map((metric) => (
            <MetricRow key={metric.id} metric={metric} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
