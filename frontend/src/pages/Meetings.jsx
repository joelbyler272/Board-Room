import { useNavigate } from 'react-router-dom';
import { Play, Calendar, Clock, Star } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import {
  useActiveMeeting,
  useRecentMeetings,
  useCreateMeeting,
  useStartMeeting,
} from '../hooks/useMeetings';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingState } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { format } from 'date-fns';

export default function Meetings() {
  const navigate = useNavigate();
  const { companyId } = useCompany();
  const { data: activeMeeting } = useActiveMeeting(companyId);
  const { data: recentMeetings, isLoading } = useRecentMeetings(companyId);
  const createMeeting = useCreateMeeting();
  const startMeeting = useStartMeeting();

  const handleStartL10 = async () => {
    if (activeMeeting) {
      navigate(`/meetings/${activeMeeting.id}`);
    } else {
      const meeting = await createMeeting.mutateAsync({
        company_id: companyId,
        type: 'l10',
      });
      await startMeeting.mutateAsync(meeting.id);
      navigate(`/meetings/${meeting.id}`);
    }
  };

  return (
    <div>
      <PageHeader
        title="Meetings"
        description="Level 10 meetings and history"
        actions={
          <Button
            onClick={handleStartL10}
            loading={createMeeting.isPending || startMeeting.isPending}
          >
            {activeMeeting ? (
              <>
                <Calendar size={18} className="mr-2" />
                Resume L10
              </>
            ) : (
              <>
                <Play size={18} className="mr-2" />
                Start L10
              </>
            )}
          </Button>
        }
      />

      <div className="p-6">
        {/* Active Meeting */}
        {activeMeeting && (
          <Card className="mb-6 border-navy-200 bg-navy-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">
                    Meeting in Progress
                  </h3>
                  <p className="text-sm text-navy-600 mt-1">
                    Current section: {activeMeeting.current_section}
                  </p>
                  <p className="text-sm text-navy-600">
                    Started:{' '}
                    {format(
                      new Date(activeMeeting.started_at),
                      'MMM d, h:mm a'
                    )}
                  </p>
                </div>
                <Button onClick={() => navigate(`/meetings/${activeMeeting.id}`)}>
                  Resume Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About L10 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About Level 10 Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              The Level 10 Meeting is a weekly 90-minute meeting designed to help
              leadership teams stay aligned, solve issues, and make progress on
              their rocks.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <Clock size={24} className="mx-auto text-slate-500 mb-1" />
                <p className="text-sm font-medium">90 minutes</p>
                <p className="text-xs text-slate-500">Fixed duration</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <Calendar size={24} className="mx-auto text-slate-500 mb-1" />
                <p className="text-sm font-medium">Weekly</p>
                <p className="text-xs text-slate-500">Same day/time</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <Star size={24} className="mx-auto text-slate-500 mb-1" />
                <p className="text-sm font-medium">Rate 8-10</p>
                <p className="text-xs text-slate-500">Target rating</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <Play size={24} className="mx-auto text-slate-500 mb-1" />
                <p className="text-sm font-medium">7 Sections</p>
                <p className="text-xs text-slate-500">Structured agenda</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading meetings..." />
            ) : recentMeetings?.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No meetings yet"
                description="Start your first L10 meeting to begin tracking."
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentMeetings?.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        Level 10 Meeting
                      </p>
                      <p className="text-sm text-slate-500">
                        {format(
                          new Date(meeting.completed_at),
                          'EEEE, MMM d, yyyy'
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {meeting.summary?.duration && (
                        <div className="text-sm text-slate-500">
                          {meeting.summary.duration} min
                        </div>
                      )}
                      {meeting.summary?.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star
                            size={14}
                            className="text-yellow-500 fill-yellow-500"
                          />
                          {meeting.summary.rating}/10
                        </div>
                      )}
                      {meeting.summary?.todosCreated > 0 && (
                        <div className="text-sm text-slate-500">
                          {meeting.summary.todosCreated} to-dos
                        </div>
                      )}
                      {meeting.summary?.issuesResolved > 0 && (
                        <div className="text-sm text-green-600">
                          {meeting.summary.issuesResolved} solved
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
