import { Card, CardContent } from '../../ui/Card';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

export function ConcludeSection({ meeting, rating, onRatingChange }) {
  const duration = meeting.started_at
    ? Math.round(
        (Date.now() - new Date(meeting.started_at).getTime()) / 60000
      )
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Conclude
        </h2>
        <p className="text-slate-500">
          Recap the meeting, rate it, and share any final cascading messages.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Time Target:</strong> 5 minutes
        </p>
        <p className="text-sm text-green-700 mt-1">
          End on time! A Level 10 meeting should be exactly 90 minutes.
        </p>
      </div>

      {/* Meeting Duration */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-4xl font-bold text-slate-900 mb-2">
            {duration} min
          </div>
          <div className="text-slate-500">Meeting Duration</div>
          {duration > 90 && (
            <p className="text-sm text-yellow-600 mt-2">
              Meeting ran over the 90-minute target.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-slate-900 mb-4 text-center">
            Rate this meeting (1-10)
          </h3>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => onRatingChange(num)}
                className={clsx(
                  'w-10 h-10 rounded-full font-medium transition-colors',
                  rating === num
                    ? 'bg-navy-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {num}
              </button>
            ))}
          </div>
          {rating && (
            <p className="text-center text-sm text-slate-500 mt-4">
              {rating < 8 && 'What could make it a 10 next week?'}
              {rating >= 8 && rating < 10 && 'Great meeting!'}
              {rating === 10 && 'Perfect Level 10!'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recap Checklist */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-slate-900 mb-4">
            Conclude Checklist
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-slate-600">
                Recap all to-dos created in this meeting
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-slate-600">
                Confirm who owns each to-do
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-slate-600">
                Discuss cascading messages (what to share with teams)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-slate-600">
                Rate the meeting
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
