import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import {
  useMeeting,
  useNextSection,
  usePreviousSection,
  useCompleteMeeting,
  useCancelMeeting,
} from '../../hooks/useMeetings';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SegueSection } from './sections/SegueSection';
import { ScorecardSection } from './sections/ScorecardSection';
import { RocksSection } from './sections/RocksSection';
import { HeadlinesSection } from './sections/HeadlinesSection';
import { TodosSection } from './sections/TodosSection';
import { IDSSection } from './sections/IDSSection';
import { ConcludeSection } from './sections/ConcludeSection';
import { clsx } from 'clsx';

const SECTIONS = [
  { id: 'segue', label: 'Segue', component: SegueSection },
  { id: 'scorecard', label: 'Scorecard', component: ScorecardSection },
  { id: 'rocks', label: 'Rocks', component: RocksSection },
  { id: 'headlines', label: 'Headlines', component: HeadlinesSection },
  { id: 'todos', label: 'To-Dos', component: TodosSection },
  { id: 'ids', label: 'IDS', component: IDSSection },
  { id: 'conclude', label: 'Conclude', component: ConcludeSection },
];

export function L10Flow({ meetingId }) {
  const navigate = useNavigate();
  const { companyId } = useCompany();
  const { data: meeting, isLoading } = useMeeting(meetingId);
  const nextSection = useNextSection();
  const previousSection = usePreviousSection();
  const completeMeeting = useCompleteMeeting();
  const cancelMeeting = useCancelMeeting();

  const [rating, setRating] = useState(null);

  if (isLoading || !meeting) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading meeting...</p>
      </div>
    );
  }

  const currentIndex = SECTIONS.findIndex(
    (s) => s.id === meeting.current_section
  );
  const CurrentComponent = SECTIONS[currentIndex]?.component;

  const handleNext = () => {
    if (currentIndex === SECTIONS.length - 1) {
      // Conclude meeting
      completeMeeting.mutate(
        { id: meetingId, summary: { rating } },
        {
          onSuccess: () => navigate('/meetings'),
        }
      );
    } else {
      nextSection.mutate(meetingId);
    }
  };

  const handlePrevious = () => {
    previousSection.mutate(meetingId);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this meeting?')) {
      cancelMeeting.mutate(meetingId, {
        onSuccess: () => navigate('/meetings'),
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Level 10 Meeting
            </h1>
            <p className="text-sm text-slate-500">
              {SECTIONS[currentIndex]?.label}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mt-4">
          {SECTIONS.map((section, index) => (
            <div
              key={section.id}
              className={clsx(
                'flex-1 h-2 rounded-full transition-colors',
                index < currentIndex && 'bg-green-500',
                index === currentIndex && 'bg-navy-500',
                index > currentIndex && 'bg-slate-200'
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {CurrentComponent && (
          <CurrentComponent
            meeting={meeting}
            companyId={companyId}
            onRatingChange={setRating}
            rating={rating}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {SECTIONS.map((section, index) => (
              <span
                key={section.id}
                className={clsx(
                  'text-xs',
                  index === currentIndex
                    ? 'font-medium text-navy-600'
                    : 'text-slate-400'
                )}
              >
                {section.label}
              </span>
            ))}
          </div>

          <Button
            onClick={handleNext}
            loading={
              nextSection.isPending ||
              completeMeeting.isPending
            }
          >
            {currentIndex === SECTIONS.length - 1 ? 'Complete' : 'Next'}
            {currentIndex < SECTIONS.length - 1 && (
              <ChevronRight size={18} className="ml-1" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
