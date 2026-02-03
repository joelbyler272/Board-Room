import { Card, CardContent } from '../ui/Card';
import { format } from 'date-fns';

export function DecisionCard({ decision }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs text-slate-400">
            {format(new Date(decision.created_at), 'MMM d, yyyy')}
          </span>
          {decision.department_name && (
            <span className="text-xs text-slate-400 ml-2">
              | {decision.department_name}
            </span>
          )}
        </div>
        <h3 className="font-medium text-slate-900 mb-1">{decision.decision}</h3>
        {decision.context && (
          <p className="text-sm text-slate-500 mb-2">
            <span className="font-medium">Context:</span> {decision.context}
          </p>
        )}
        {decision.rationale && (
          <p className="text-sm text-slate-500">
            <span className="font-medium">Rationale:</span> {decision.rationale}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
