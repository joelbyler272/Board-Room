import { clsx } from 'clsx';

const variants = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-navy-100 text-navy-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Status-specific badges
export function StatusBadge({ status }) {
  const statusConfig = {
    on_track: { variant: 'success', label: 'On Track' },
    off_track: { variant: 'danger', label: 'Off Track' },
    at_risk: { variant: 'warning', label: 'At Risk' },
    completed: { variant: 'success', label: 'Completed' },
    pending: { variant: 'warning', label: 'Pending' },
    open: { variant: 'info', label: 'Open' },
    in_discussion: { variant: 'warning', label: 'In Discussion' },
    solved: { variant: 'success', label: 'Solved' },
    dropped: { variant: 'default', label: 'Dropped' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// Priority badge
export function PriorityBadge({ priority }) {
  const priorityConfig = {
    1: { variant: 'danger', label: 'High' },
    2: { variant: 'warning', label: 'Medium' },
    3: { variant: 'default', label: 'Low' },
  };

  const config = priorityConfig[priority] || { variant: 'default', label: 'Unknown' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
