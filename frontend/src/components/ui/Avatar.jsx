import { clsx } from 'clsx';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({
  name,
  color = '#3B82F6',
  size = 'md',
  className,
}) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold text-white',
        sizes[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
