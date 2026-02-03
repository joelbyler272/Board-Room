import { useParams, Navigate } from 'react-router-dom';
import { useMeeting } from '../hooks/useMeetings';
import { L10Flow } from '../components/meetings/L10Flow';
import { LoadingState } from '../components/ui/Spinner';

export default function MeetingDetail() {
  const { id } = useParams();
  const { data: meeting, isLoading } = useMeeting(id);

  if (isLoading) {
    return <LoadingState message="Loading meeting..." />;
  }

  if (!meeting) {
    return <Navigate to="/meetings" replace />;
  }

  if (meeting.status !== 'in_progress') {
    return <Navigate to="/meetings" replace />;
  }

  return <L10Flow meetingId={id} />;
}
