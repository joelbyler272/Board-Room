import { useState } from 'react';
import { useIssues } from '../../../hooks/useIssues';
import { IssueCard } from '../../issues/IssueCard';
import { IDSPanel } from '../../issues/IDSPanel';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { EmptyState } from '../../ui/EmptyState';
import { AlertCircle } from 'lucide-react';

export function IDSSection({ companyId }) {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const { data: issues, isLoading } = useIssues({
    company_id: companyId,
  });

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading issues...</div>;
  }

  const openIssues = issues?.filter((i) => i.status === 'open') || [];
  const inDiscussion = issues?.filter((i) => i.status === 'in_discussion') || [];
  const prioritizedIssues = [...inDiscussion, ...openIssues].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          IDS - Identify, Discuss, Solve
        </h2>
        <p className="text-slate-500">
          Work through issues starting with highest priority. Solve them completely.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Time Target:</strong> 60 minutes
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          This is the core of the meeting. Stay focused on one issue at a time.
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="font-medium text-slate-900 mb-2">IDS Process:</h3>
        <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
          <li>
            <strong>Identify:</strong> What's the real issue? Keep asking "why?"
          </li>
          <li>
            <strong>Discuss:</strong> Everyone speaks once. No tangents.
          </li>
          <li>
            <strong>Solve:</strong> Make a decision, create to-dos, move on.
          </li>
        </ol>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Issues List ({prioritizedIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prioritizedIssues.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="No open issues"
              description="Great work! No issues to discuss."
            />
          ) : (
            <div className="space-y-3">
              {prioritizedIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onDiscuss={setSelectedIssue}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedIssue && (
        <IDSPanel
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
