import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import DepartmentDetail from './pages/DepartmentDetail';
import Rocks from './pages/Rocks';
import Issues from './pages/Issues';
import Todos from './pages/Todos';
import Decisions from './pages/Decisions';
import Scorecard from './pages/Scorecard';
import Meetings from './pages/Meetings';
import MeetingDetail from './pages/MeetingDetail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="departments" element={<Departments />} />
        <Route path="departments/:id" element={<DepartmentDetail />} />
        <Route path="rocks" element={<Rocks />} />
        <Route path="issues" element={<Issues />} />
        <Route path="todos" element={<Todos />} />
        <Route path="decisions" element={<Decisions />} />
        <Route path="scorecard" element={<Scorecard />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="meetings/:id" element={<MeetingDetail />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
