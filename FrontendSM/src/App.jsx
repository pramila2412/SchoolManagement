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
            <Route path="/finance/expenses" element={<PlaceholderPage moduleId="finance-expenses" />} />
            <Route path="/attendance" element={<PlaceholderPage moduleId="attendance" />} />
            <Route path="/library" element={<PlaceholderPage moduleId="library" />} />
            <Route path="/transport" element={<PlaceholderPage moduleId="transport" />} />
            <Route path="/examination" element={<PlaceholderPage moduleId="examination" />} />
            <Route path="/front-office" element={<PlaceholderPage moduleId="front-office" />} />
            <Route path="/certificates" element={<PlaceholderPage moduleId="examination" />} />
            <Route path="/announcements" element={<PlaceholderPage moduleId="front-office" />} />
            <Route path="/tc" element={<PlaceholderPage moduleId="front-office" />} />
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
