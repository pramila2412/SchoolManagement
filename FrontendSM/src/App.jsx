import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GlobalDialog from './components/GlobalDialog';
import { RouteRoleGuard } from './components/RoleGuard';
const LoginPage = lazy(() => import('./pages/Login'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AdmissionPublicPage = lazy(() => import('./pages/AdmissionPublicPage'));
const CurriculumPage = lazy(() => import('./pages/CurriculumPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const GalleryPublicPage = lazy(() => import('./pages/GalleryPublicPage'));
const ContactPublicPage = lazy(() => import('./pages/ContactPublicPage'));
const CoCurricularPage = lazy(() => import('./pages/CoCurricularPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StudentsPage = lazy(() => import('./pages/Students'));
const AddStudent = lazy(() => import('./pages/AddStudent'));
const EditStudent = lazy(() => import('./pages/EditStudent'));
const StudentDetail = lazy(() => import('./pages/StudentDetail'));
const StudentReports = lazy(() => import('./pages/StudentReports'));
const StudentSettings = lazy(() => import('./pages/StudentSettings'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));
const Academics = lazy(() => import('./pages/Academics'));
const Admission = lazy(() => import('./pages/Admission'));
const Addons = lazy(() => import('./pages/Addons'));
const Finance = lazy(() => import('./pages/Finance'));
const HR = lazy(() => import('./pages/HR'));
const ParentPortal = lazy(() => import('./pages/ParentPortal'));
const AdminParentPortal = lazy(() => import('./pages/AdminParentPortal'));
const ChildSelectorPage = lazy(() => import('./pages/ChildSelectorPage'));
const SiteSettings = lazy(() => import('./components/SiteSettings'));

const Attendance = lazy(() => import('./pages/Attendance'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Reports = lazy(() => import('./pages/Reports'));
const Announcements = lazy(() => import('./pages/Announcements'));
const TC = lazy(() => import('./pages/TC'));
const Transport = lazy(() => import('./pages/Transport'));
const Examination = lazy(() => import('./pages/Examination'));
const FrontOffice = lazy(() => import('./pages/FrontOffice'));
const Collaborate = lazy(() => import('./pages/Collaborate'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px' }}>
    <div>Loading...</div>
  </div>
);

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
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={
              user.role === 'Parent' ? <Navigate to="/parent-portal" replace /> : <Dashboard />
            } />
            <Route path="/students" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'HR']}>
                <StudentsPage />
              </RouteRoleGuard>
            } />
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
            <Route path="/students/:id" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'HR', 'Staff', 'Teacher']}>
                <StudentDetail />
              </RouteRoleGuard>
            } />
            <Route path="/attendance" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'HR', 'Teacher']}>
                <Attendance />
              </RouteRoleGuard>
            } />
            <Route path="/student-reports" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'HR']}>
                <StudentReports />
              </RouteRoleGuard>
            } />
            
            {/* Academics */}
            <Route path="/academics/*" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin']}>
                <Academics />
              </RouteRoleGuard>
            } />
            <Route path="/admission/*" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'Staff']}>
                <Admission />
              </RouteRoleGuard>
            } />
            <Route path="/addons/*" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin']}>
                <Addons />
              </RouteRoleGuard>
            } />
            <Route path="/finance/*" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin']}>
                <Finance />
              </RouteRoleGuard>
            } />
            <Route path="/hr/*" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'HR']}>
                <HR />
              </RouteRoleGuard>
            } />
            <Route path="/parent-portal" element={
              <RouteRoleGuard allowedRoles={['Parent']}>
                <ParentPortal />
              </RouteRoleGuard>
            } />
            <Route path="/admin-parent-portal" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'Staff']}>
                <AdminParentPortal />
              </RouteRoleGuard>
            } />

            <Route path="/transport/*" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'Staff']}>
                <Transport />
              </RouteRoleGuard>
            } />
            <Route path="/exam/*" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'Teacher']}>
                <Examination />
              </RouteRoleGuard>
            } />
            <Route path="/frontoffice/*" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'Staff']}>
                <FrontOffice />
              </RouteRoleGuard>
            } />
            <Route path="/collaborate/*" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'HR', 'Teacher', 'Staff']}>
                <Collaborate />
              </RouteRoleGuard>
            } />
            <Route path="/certificates" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'Staff']}>
                <Certificates />
              </RouteRoleGuard>
            } />
            <Route path="/reports" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'HR']}>
                <Reports />
              </RouteRoleGuard>
            } />
            <Route path="/announcements" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'HR', 'Teacher']}>
                <Announcements />
              </RouteRoleGuard>
            } />
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
            
            <Route path="/settings" element={
              <RouteRoleGuard allowedRoles={['Super Admin', 'Admin']}>
                <SiteSettings />
              </RouteRoleGuard>
            } />
            
            <Route path="*" element={<PlaceholderPage />} />
          </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<PageLoader />}>
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
          <RouteRoleGuard allowedRoles={['Super Admin', 'Admin', 'CMS Admin']}>
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
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <GlobalDialog />
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
