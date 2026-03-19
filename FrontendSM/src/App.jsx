import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/Students';
import AddStudent from './pages/AddStudent';
import StudentDetail from './pages/StudentDetail';
import FinancePage from './pages/Finance';
import ConcessionPage from './pages/Concessions';
import PlaceholderPage from './pages/PlaceholderPage';
import HomeWork from './pages/HomeWork';
import EContent from './pages/EContent';
import AcademicCalendar from './pages/AcademicCalendar';
import TimeTable from './pages/TimeTable';
import LibraryPage from './pages/LibraryPage';

import Attendance from './pages/Attendance';
import Certificates from './pages/Certificates';
import Reports from './pages/Reports';
import Announcements from './pages/Announcements';
import TC from './pages/TC';
import Expenses from './pages/Expenses';
import Transport from './pages/Transport';
import Examination from './pages/Examination';
import FrontOffice from './pages/FrontOffice';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/add" element={<AddStudent />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/finance/concessions" element={<ConcessionPage />} />
            <Route path="/finance/expenses" element={<Expenses />} />
            <Route path="/attendance" element={<Attendance />} />
            
            {/* Academics */}
            <Route path="/academics/homework" element={<HomeWork />} />
            <Route path="/academics/e-content" element={<EContent />} />
            <Route path="/academics/calendar" element={<AcademicCalendar />} />
            <Route path="/academics/timetable" element={<TimeTable />} />
            <Route path="/academics/library" element={<LibraryPage />} />

            <Route path="/transport" element={<Transport />} />
            <Route path="/examination" element={<Examination />} />
            <Route path="/front-office" element={<FrontOffice />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/tc" element={<TC />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
