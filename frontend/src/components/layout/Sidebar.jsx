import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Building2,
  Mountain,
  AlertCircle,
  CheckSquare,
  Gavel,
  BarChart3,
  Calendar,
  Settings,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useUnreadCount } from '../../hooks/useMessages';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Rocks', href: '/rocks', icon: Mountain },
  { name: 'Issues', href: '/issues', icon: AlertCircle },
  { name: 'To-Dos', href: '/todos', icon: CheckSquare },
  { name: 'Decisions', href: '/decisions', icon: Gavel },
  { name: 'Scorecard', href: '/scorecard', icon: BarChart3 },
  { name: 'Meetings', href: '/meetings', icon: Calendar },
];

export function Sidebar() {
  const { company, companyId } = useCompany();
  const { data: unreadData } = useUnreadCount(companyId);

  return (
    <aside className="w-64 bg-navy-900 text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Board Room</h1>
        {company && (
          <p className="text-navy-300 text-sm mt-1">{company.name}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              )
            }
          >
            <item.icon size={20} />
            {item.name}
            {item.name === 'Departments' && unreadData?.count > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadData.count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-navy-700">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-navy-700 text-white'
                : 'text-navy-300 hover:bg-navy-800 hover:text-white'
            )
          }
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
