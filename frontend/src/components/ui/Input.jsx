import { forwardRef } from 'react';
import { clsx } from 'clsx';

export const Input = forwardRef(function Input(
  { label, error, className, ...props },
  ref
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg text-slate-900 placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent',
          'disabled:bg-slate-50 disabled:text-slate-500',
          error ? 'border-red-500' : 'border-slate-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, className, rows = 3, ...props },
  ref
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg text-slate-900 placeholder:text-slate-400 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent',
          'disabled:bg-slate-50 disabled:text-slate-500',
          error ? 'border-red-500' : 'border-slate-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, options, className, placeholder, ...props },
  ref
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg text-slate-900',
          'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent',
          'disabled:bg-slate-50 disabled:text-slate-500',
          error ? 'border-red-500' : 'border-slate-300',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
});
