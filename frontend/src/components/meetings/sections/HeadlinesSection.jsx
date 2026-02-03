import { useDepartments } from '../../../hooks/useDepartments';
import { Card, CardContent } from '../../ui/Card';
import { Avatar } from '../../ui/Avatar';

export function HeadlinesSection({ companyId }) {
  const { data: departments } = useDepartments(companyId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Customer/Employee Headlines
        </h2>
        <p className="text-slate-500">
          Share important news about customers and employees. Good news and bad news.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Time Target:</strong> 5 minutes
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Share headlines, don't solve issues here. Drop to IDS if needed.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-medium text-slate-900 mb-2">Discussion Topics:</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>- Any customer wins or losses?</li>
            <li>- Employee updates (new hires, departures, promotions)?</li>
            <li>- Industry news affecting us?</li>
            <li>- Competitor activity?</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4">
        {departments?.map((dept) => (
          <Card key={dept.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  name={dept.agent_name || dept.name}
                  color={dept.avatar_color}
                  size="md"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {dept.agent_name || dept.name}
                  </p>
                  <p className="text-sm text-slate-500">{dept.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
