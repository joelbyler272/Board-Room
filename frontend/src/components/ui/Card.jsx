import { clsx } from 'clsx';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'px-6 py-4 border-b border-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={clsx('text-lg font-semibold text-slate-900', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={clsx('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
