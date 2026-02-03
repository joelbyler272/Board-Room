import { useDepartments } from '../../../hooks/useDepartments';
import { Card, CardContent } from '../../ui/Card';
import { Avatar } from '../../ui/Avatar';

export function SegueSection({ companyId }) {
  const { data: departments } = useDepartments(companyId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Segue - Good News
        </h2>
        <p className="text-slate-500">
          Each team member shares one personal and one professional good news
          from the past week.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Time Target:</strong> 5 minutes
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Keep it brief and positive! This sets the tone for the meeting.
        </p>
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
                <div>
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
