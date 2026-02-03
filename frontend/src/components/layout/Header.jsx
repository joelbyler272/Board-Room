import { Bell, Play, Calendar } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useActiveMeeting, useCreateMeeting, useStartMeeting } from '../../hooks/useMeetings';
import { useUnreadCount } from '../../hooks/useMessages';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export function Header({ title }) {
  const navigate = useNavigate();
  const { companyId } = useCompany();
  const { data: activeMeeting } = useActiveMeeting(companyId);
  const { data: unreadData } = useUnreadCount(companyId);
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
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>

        <div className="flex items-center gap-4">
          {/* L10 Meeting Button */}
          <Button
            variant={activeMeeting ? 'primary' : 'secondary'}
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

          {/* Notifications */}
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell size={20} />
            {unreadData?.count > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
