import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GlobalDialog from './components/GlobalDialog';
import { RouteRoleGuard } from './components/RoleGuard';
import LoginPage from './pages/Login';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import AdmissionPublicPage from './pages/AdmissionPublicPage';
import CurriculumPage from './pages/CurriculumPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import GalleryPublicPage from './pages/GalleryPublicPage';
import ContactPublicPage from './pages/ContactPublicPage';
import CoCurricularPage from './pages/CoCurricularPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/Students';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import StudentDetail from './pages/StudentDetail';
import StudentReports from './pages/StudentReports';
import StudentSettings from './pages/StudentSettings';
import PlaceholderPage from './pages/PlaceholderPage';
import Academics from './pages/Academics';
import Admission from './pages/Admission';
import Addons from './pages/Addons';
import Finance from './pages/Finance';
import HR from './pages/HR';
import ParentPortal from './pages/ParentPortal';
import AdminParentPortal from './pages/AdminParentPortal';
import ChildSelectorPage from './pages/ChildSelectorPage';
import SiteSettings from './components/SiteSettings';

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
            <Route path="/students/add" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'Staff']}>
                <AddStudent />
              </RouteRoleGuard>
            } />
            <Route path="/students/edit/:id" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'Staff']}>
                <EditStudent />
              </RouteRoleGuard>
            } />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/student-reports" element={<StudentReports />} />
            
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
            <Route path="/tc" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'Staff']}>
                <TC />
              </RouteRoleGuard>
            } />
            <Route path="/students/settings" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin']}>
                <StudentSettings />
              </RouteRoleGuard>
            } />
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
      
      {/* If not logged in, show public academics page. If logged in, use admin academics in AppLayout */}
      {!user && <Route path="/academics" element={<CurriculumPage />} />}
      
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/gallery" element={<GalleryPublicPage />} />
      <Route path="/contact" element={<ContactPublicPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<LoginPage />} />
      <Route path="/parent-selector" element={
        <ProtectedRoute children={<ChildSelectorPage />} />
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <RouteRoleGuard allowedRoles={['Super Admin', 'Admin']}>
            <SiteSettings />
          </RouteRoleGuard>
        </ProtectedRoute>
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
        <ScrollToTop />
        <GlobalDialog />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
