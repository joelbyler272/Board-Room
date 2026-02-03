import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useCompany } from '../../context/CompanyContext';
import { LoadingState } from '../ui/Spinner';

export default function AppLayout() {
  const { loading, error } = useCompany();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingState message="Loading Board Room..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Unable to load company
          </h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <p className="text-sm text-slate-400">
            Make sure the backend is running and the database is seeded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
