import { useCompany } from '../context/CompanyContext';
import { PageHeader } from '../components/layout/PageHeader';
import {
  InboxWidget,
  ScorecardWidget,
  RocksWidget,
  IssuesWidget,
  TodosWidget,
} from '../components/dashboard';
import { useActiveMeeting, useCreateMeeting, useStartMeeting } from '../hooks/useMeetings';
import { Button } from '../components/ui/Button';
import { Play, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { company, companyId } = useCompany();
  const { data: activeMeeting } = useActiveMeeting(companyId);
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
        title={`Welcome back`}
        description={company?.name}
        actions={
          <Button
            variant={activeMeeting ? 'primary' : 'secondary'}
            onClick={handleStartL10}
            loading={createMeeting.isPending || startMeeting.isPending}
          >
            {activeMeeting ? (
              <>
                <Calendar size={18} className="mr-2" />
                Resume L10 Meeting
              </>
            ) : (
              <>
                <Play size={18} className="mr-2" />
                Start L10 Meeting
              </>
            )}
          </Button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InboxWidget />
          <ScorecardWidget />
          <RocksWidget />
          <IssuesWidget />
          <TodosWidget />
        </div>
      </div>
    </div>
  );
}
