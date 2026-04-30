import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GlobalDialog from './components/GlobalDialog';
import LoginPage from './pages/Login';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import AdmissionPublicPage from './pages/AdmissionPublicPage';
import CurriculumPage from './pages/CurriculumPage';
import GalleryPublicPage from './pages/GalleryPublicPage';
import ContactPublicPage from './pages/ContactPublicPage';
import CoCurricularPage from './pages/CoCurricularPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/Students';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import StudentDetail from './pages/StudentDetail';
import PlaceholderPage from './pages/PlaceholderPage';
import Academics from './pages/Academics';
import Admission from './pages/Admission';
import Addons from './pages/Addons';
import Finance from './pages/Finance';
import HR from './pages/HR';
import ParentPortal from './pages/ParentPortal';
import AdminParentPortal from './pages/AdminParentPortal';
import ChildSelectorPage from './pages/ChildSelectorPage';

import Attendance from './pages/Attendance';
import Certificates from './pages/Certificates';
import Reports from './pages/Reports';
import Announcements from './pages/Announcements';
import TC from './pages/TC';
import Transport from './pages/Transport';
import Examination from './pages/Examination';
import FrontOffice from './pages/FrontOffice';
import Collaborate from './pages/Collaborate';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <GlobalDialog />
      <Header
        onToggleSidebar={handleToggleSidebar}
      />
      <Sidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <main className="main-content">
        <div className="page-content">
          <Routes>
            <Route path="/" element={
              user.role === 'Parent' ? <Navigate to="/parent-portal" replace /> : <Dashboard />
            } />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/add" element={<AddStudent />} />
            <Route path="/students/edit/:id" element={<EditStudent />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/attendance" element={<Attendance />} />
            
            {/* Academics */}
            <Route path="/academics" element={<Academics />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/addons" element={<Addons />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/hr" element={<HR />} />
            <Route path="/parent-portal" element={<ParentPortal />} />
            <Route path="/admin-parent-portal" element={<AdminParentPortal />} />

            <Route path="/transport" element={<Transport />} />
            <Route path="/examination" element={<Examination />} />
            <Route path="/front-office" element={<FrontOffice />} />
            <Route path="/collaborate" element={<Collaborate />} />
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

function AppContent() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <ProtectedRoute><AppLayout /></ProtectedRoute> : <LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/co-curricular" element={<CoCurricularPage />} />
      
      {/* If not logged in, show public admission page. If logged in, let it fall through to /* AppLayout */}
      {!user && <Route path="/admission" element={<AdmissionPublicPage />} />}
      
      <Route path="/curriculum" element={<CurriculumPage />} />
      <Route path="/gallery" element={<GalleryPublicPage />} />
      <Route path="/contact" element={<ContactPublicPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/parent-selector" element={
        <ProtectedRoute children={<ChildSelectorPage />} />
      } />
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
