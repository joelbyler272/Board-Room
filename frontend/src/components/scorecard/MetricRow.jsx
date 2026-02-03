import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Edit2 } from 'lucide-react';
import { StatusBadge } from '../ui/Badge';
import { useUpdateMetricValue } from '../../hooks/useMetrics';
import { clsx } from 'clsx';

export function MetricRow({ metric }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(metric.current_value?.toString() || '');
  const updateValue = useUpdateMetricValue();

  const handleSave = () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateValue.mutate({ id: metric.id, value: numValue });
    }
    setIsEditing(false);
  };

  const getTrendIcon = () => {
    if (!metric.trend || metric.trend.length < 2) return <Minus size={14} className="text-slate-400" />;

    const recent = metric.trend.slice(-2);
    if (recent[1].value > recent[0].value) {
      return <TrendingUp size={14} className="text-green-500" />;
    } else if (recent[1].value < recent[0].value) {
      return <TrendingDown size={14} className="text-red-500" />;
    }
    return <Minus size={14} className="text-slate-400" />;
  };

  const progress = metric.target && metric.current_value
    ? Math.min(100, Math.round((metric.current_value / metric.target) * 100))
    : 0;

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-slate-900">{metric.name}</p>
          {metric.description && (
            <p className="text-xs text-slate-500">{metric.description}</p>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-500">
        {metric.department_name || 'Company'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-navy-500"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-sm hover:text-navy-600"
            >
              {metric.current_value ?? '-'}
              <Edit2 size={12} className="text-slate-400" />
            </button>
          )}
          {metric.unit && (
            <span className="text-xs text-slate-400">{metric.unit}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        {metric.target ?? '-'} {metric.unit && metric.target && metric.unit}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full',
                metric.status === 'on_track' && 'bg-green-500',
                metric.status === 'at_risk' && 'bg-yellow-500',
                metric.status === 'off_track' && 'bg-red-500'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{progress}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <StatusBadge status={metric.status} />
        </div>
      </td>
    </tr>
  );
}
