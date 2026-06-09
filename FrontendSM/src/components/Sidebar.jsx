import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, IndianRupee, CalendarCheck,
    BookOpen, Bus, FileText, Building, ChevronDown, ChevronRight,
    UserPlus, Award, Megaphone, FileCheck, Receipt, Wallet,
    GraduationCap, PencilLine, Video, Calendar, Clock,
    Truck, Map, UserCheck, Navigation, ClipboardCheck, CreditCard,
    Stamp, BarChart3, Settings, MessageSquare, FileUp, Mail,
    CheckSquare, Clipboard, Phone, HelpCircle, AlertTriangle, Package, CalendarClock,
    Layers, BookMarked, ArrowUpRight, FolderOpen, Upload,
    Image, Gift, Download, ClipboardList, PieChart, FileSymlink, Globe, TrendingDown, RotateCcw, Monitor,
    Briefcase, Star, Timer, Filter, ShieldCheck, X, Activity
} from 'lucide-react';
import './Sidebar.css';

const iconMap = {
    LayoutDashboard, Users, IndianRupee, CalendarCheck,
    BookOpen, Bus, FileText, Building, GraduationCap, Briefcase,
};

const subIconMap = {
    student: {
        'Student Information': Users,
        'Add Student': UserPlus,
        'Student Attendance': CalendarCheck,
        'Certificates': Award,
        'Announcement': Megaphone,
        'TC': FileCheck,
        'Settings': Settings,
    },
    finance: {
        'Dashboard': PieChart,
        'Fee Structure': FileSymlink,
        'Fee Collection': IndianRupee,
        'Fees Collection': Receipt,
        'Concessions': Wallet,
        'Expenses': IndianRupee,
        'Online Payments': Globe,
        'Due List & Defaulters': AlertTriangle,
        'Expense Tracking': TrendingDown,
        'Invoice & Billing': FileText,
        'Refund Management': RotateCcw,
        'Accounting Engine': BookOpen,
        'Asset Management': Monitor,
        'Inventory (Linked)': Package,
        'Financial Reports': Download,
        'Settings & Config': Settings,
    },
    hr: {
        'HR Dashboard': PieChart,
        'Staff Management': Users,
        'Staff Attendance': CalendarCheck,
        'Leave Management': Calendar,
        'Payroll': IndianRupee,
        'Recruitment': Briefcase,
        'Staff Documents': FileText,
        'Performance': Star,
        'Shifts & Timetable': Clock,
        'HR Reports': Download,
        'HR Settings': Settings,
        'Login Access': ShieldCheck,
    },
    'parent-portal': {
        'Portal Dashboard': PieChart,
        'Student Profile': Users,
        'Student Attendance': CalendarCheck,
        'School Announcements': Megaphone,
        'Certificates Download': Award,
        'Fee Payment': CreditCard,
        'Payment History': Clock,
        'Contact School': Phone,
    },
    academics: {
        'Academic Year': Calendar,
        'Classes & Sections': Layers,
        'Subjects': BookOpen,
        'Teacher Assignment': UserCheck,
        'Time Table': Clock,
        'Syllabus': BookMarked,
        'Lesson Plans': PencilLine,
        'Assignments': ClipboardCheck,
        'Attendance': CalendarCheck,
        'Performance': BarChart3,
        'Study Materials': FolderOpen,
        'Promotion': ArrowUpRight,
        'Reports': FileText,
        'Settings': Settings,
    },
    admission: {
        'Enquiries': UserPlus,
        'Application Form': FileText,
        'Documents': Upload,
        'Review & Approval': ClipboardCheck,
        'Fee Assignment': CreditCard,
        'Confirmation': Award,
        'ID Card': Award,
        'Admission Reports': BarChart3,
        'Admission Settings': Settings,
    },
    addons: {
        'Visitor Management': UserCheck,
        'Gallery': Image,
        'Alumni Directory': Users,
        'Student Birthdays': Gift,
        'Messages': MessageSquare,
        'Custom Forms': FileText,
        'Downloads': Download,
        'Registration': ClipboardList,
        'Reports': FileText,
        'Analytics': PieChart,
        'Settings': Settings,
    },
    transport: {
        'Transport Dashboard': LayoutDashboard,
        'Vehicles': Truck,
        'Drivers': Users,
        'Routes': Map,
        'Student Assignment': UserCheck,
        'Live Tracking': Navigation,
        'Transport Attendance': ClipboardCheck,
        'Transport Fees': CreditCard,
    },
    examination: {
        'Exam Setup': LayoutDashboard,
        'Exam Timetable': Calendar,
        'Hall Tickets': Stamp,
        'Marks Entry': ClipboardCheck,
        'Exam Results': Award,
        'Report Cards': FileText,
        'Exam Analytics': BarChart3,
        'Exam Settings': Settings,
    },
    collaborate: {
        'Collab Dashboard': LayoutDashboard,
        'Announcements': Megaphone,
        'Discussions': MessageSquare,
        'Groups': Users,
        'File Sharing': FileUp,
        'Messaging': Mail,
        'Meetings': Video,
        'Tasks': CheckSquare,
        'Notice Board': Clipboard,
        'Collab Settings': Settings,
    },
    frontoffice: {
        'FO Dashboard': LayoutDashboard,
        'Visitors': Users,
        'Call Logs': Phone,
        'Enquiries': HelpCircle,
        'Complaints': AlertTriangle,
        'Postal': Package,
        'Appointments': CalendarClock,
    },
    'admin-parent-portal': {
        'Parents List': Users,
        'Parent Activities': Activity,
    }
};

import { useAuth } from '../context/AuthContext';

export const SIDEBAR_MODULES = [
    { id: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
    {
        id: 'student', name: 'Student', icon: 'Users', path: '/students',
        subModules: [
            { name: 'Student Information', path: '/students' },
            { name: 'Add Student', path: '/students/add', allowedRoles: ['Super Admin', 'Admin', 'Staff'] },
            { name: 'Student Attendance', path: '/attendance' },
            { name: 'Reports & Analytics', path: '/student-reports' },
            { name: 'Certificates', path: '/certificates' },
            { name: 'Announcement', path: '/announcements' },
            { name: 'TC', path: '/tc', allowedRoles: ['Super Admin', 'Admin', 'Staff'] },
            { name: 'Settings', path: '/students/settings', allowedRoles: ['Super Admin', 'Admin'] },
        ]
    },
    {
        id: 'finance', name: 'Finance', icon: 'IndianRupee', path: '/finance',
        subModules: [
            { name: 'Dashboard', path: '/finance/dashboard' },
            { name: 'Fee Structure', path: '/finance/fee/structure' },
            { name: 'Fee Collection', path: '/finance/fee/collection' },
            { name: 'Online Payments', path: '/finance/payments/online' },
            { name: 'Due List & Defaulters', path: '/finance/fee/defaulters' },
            { name: 'Expense Tracking', path: '/finance/expenses' },
            { name: 'Invoice & Billing', path: '/finance/invoices' },
            { name: 'Refund Management', path: '/finance/refunds' },
            { name: 'Accounting Engine', path: '/finance/accounting' },
            { name: 'Asset Management', path: '/finance/assets' },
            { name: 'Inventory (Linked)', path: '/finance/inventory' },
            { name: 'Financial Reports', path: '/finance/reports' },
            { name: 'Settings & Config', path: '/finance/settings', allowedRoles: ['Super Admin', 'Admin'] },
        ]
    },
    {
        id: 'academics', name: 'Academics', icon: 'GraduationCap', path: '/academics',
        subModules: [
            { name: 'Academic Year', path: '/academics/year' },
            { name: 'Classes & Sections', path: '/academics/classes' },
            { name: 'Subjects', path: '/academics/subjects' },
            { name: 'Teacher Assignment', path: '/academics/teachers' },
            { name: 'Time Table', path: '/academics/timetable' },
            { name: 'Syllabus', path: '/academics/syllabus' },
            { name: 'Lesson Plans', path: '/academics/lesson-plan' },
            { name: 'Assignments', path: '/academics/assignments' },
            { name: 'Attendance', path: '/academics/attendance' },
            { name: 'Performance', path: '/academics/performance' },
            { name: 'Study Materials', path: '/academics/materials' },
            { name: 'Promotion', path: '/academics/promotion' },
            { name: 'Reports', path: '/academics/reports' },
            { name: 'Settings', path: '/academics/settings', allowedRoles: ['Super Admin', 'Admin'] },
        ]
    },
    {
        id: 'admission', name: 'Admission', icon: 'BookOpen', path: '/admission',
        subModules: [
            { name: 'Enquiries', path: '/admission/enquiry' },
            { name: 'Application Form', path: '/admission/apply' },
            { name: 'Documents', path: '/admission/documents' },
            { name: 'Review & Approval', path: '/admission/review' },
            { name: 'Fee Assignment', path: '/admission/fees' },
            { name: 'Confirmation', path: '/admission/confirm' },
            { name: 'ID Card', path: '/admission/id-card' },
            { name: 'Admission Reports', path: '/admission/reports' },
            { name: 'Admission Settings', path: '/admission/settings', allowedRoles: ['Super Admin', 'Admin'] },
        ]
    },
    {
        id: 'addons', name: 'Add-Ons', icon: 'Settings', path: '/addons',
        subModules: [
            { name: 'Visitor Management', path: '/addons/visitors' },
            { name: 'Gallery', path: '/addons/gallery' },
            { name: 'Alumni Directory', path: '/addons/alumni' },
            { name: 'Student Birthdays', path: '/addons/birthdays' },
            { name: 'Messages', path: '/addons/messages' },
            { name: 'Custom Forms', path: '/addons/forms' },
            { name: 'Downloads', path: '/addons/downloads' },
            { name: 'Registration', path: '/addons/registration' },
            { name: 'Reports', path: '/addons/reports' },
            { name: 'Analytics', path: '/addons/analytics' },
            { name: 'Settings', path: '/addons/settings', allowedRoles: ['Super Admin', 'Admin'] },
        ]
    },
    {
        id: 'hr', name: 'HR', icon: 'Briefcase', path: '/hr',
        subModules: [
            { name: 'HR Dashboard', path: '/hr/dashboard' },
            { name: 'Staff Management', path: '/hr/staff' },
            { name: 'Staff Attendance', path: '/hr/attendance' },
            { name: 'Leave Management', path: '/hr/leave' },
            { name: 'Payroll', path: '/hr/payroll' },
            { name: 'Recruitment', path: '/hr/recruitment' },
            { name: 'Staff Documents', path: '/hr/documents' },
            { name: 'Performance', path: '/hr/performance' },
            { name: 'Shifts & Timetable', path: '/hr/shifts' },
            { name: 'HR Reports', path: '/hr/reports' },
            { name: 'HR Settings', path: '/hr/settings', allowedRoles: ['Super Admin', 'Admin'] },
            { name: 'Login Access', path: '/hr/login-management', allowedRoles: ['Super Admin'] },
        ]
    },
    {
        id: 'admin-parent-portal', name: 'Parent Portal (Admin)', icon: 'Users', path: '/admin-parent-portal',
        subModules: [
            { name: 'Parents List', path: '/admin-parent-portal?tab=list' },
            { name: 'Parent Activities', path: '/admin-parent-portal?tab=activities' },
        ]
    },
    {
        id: 'parent-portal', name: 'Parent Portal', icon: 'Users', path: '/parent-portal',
        subModules: [
            { name: 'Portal Dashboard', path: '/parent-portal?tab=dashboard' },
            { name: 'Student Profile', path: '/parent-portal?tab=profile' },
            { name: 'Student Attendance', path: '/parent-portal?tab=attendance' },
            { name: 'School Announcements', path: '/parent-portal?tab=announcements' },
            { name: 'Certificates Download', path: '/parent-portal?tab=certificates' },
            { name: 'Fee Payment', path: '/parent-portal?tab=fees' },
            { name: 'Payment History', path: '/parent-portal?tab=history' },
            { name: 'Contact School', path: '/parent-portal?tab=contact' },
        ]
    },
    { id: 'attendance', name: 'Attendance', icon: 'CalendarCheck', path: '/attendance' },
    {
        id: 'transport', name: 'Transport', icon: 'Bus', path: '/transport',
        subModules: [
            { name: 'Transport Dashboard', path: '/transport/dashboard' },
            { name: 'Vehicle Management', path: '/transport/vehicles' },
            { name: 'Driver Management', path: '/transport/drivers' },
            { name: 'Route Management', path: '/transport/routes' },
            { name: 'Student Assignment', path: '/transport/students' },
            { name: 'Live Tracking', path: '/transport/tracking' },
            { name: 'Transport Attendance', path: '/transport/attendance' },
            { name: 'Fees', path: '/transport/fees' },
            { name: 'Reports', path: '/transport/reports' },
            { name: 'Notifications', path: '/transport/notifications' },
        ]
    },
    {
        id: 'examination', name: 'Examination', icon: 'FileText', path: '/exam',
        subModules: [
            { name: 'Exam Setup', path: '/exam/setup' },
            { name: 'Exam Timetable', path: '/exam/timetable' },
            { name: 'Student Allocation', path: '/exam/allocation' },
            { name: 'Hall Tickets', path: '/exam/hall-ticket' },
            { name: 'Marks Entry', path: '/exam/marks' },
            { name: 'Exam Results', path: '/exam/results' },
            { name: 'Report Cards', path: '/exam/report-card' },
            { name: 'Exam Analytics', path: '/exam/analytics' },
            { name: 'Exam Settings', path: '/exam/settings' },
        ]
    },
    {
        id: 'frontoffice', name: 'Front Office', icon: 'Building', path: '/frontoffice',
        subModules: [
            { name: 'FO Dashboard', path: '/frontoffice/dashboard' },
            { name: 'Visitors', path: '/frontoffice/visitors' },
            { name: 'Call Logs', path: '/frontoffice/calls' },
            { name: 'Enquiries', path: '/frontoffice/enquiries' },
            { name: 'Complaints', path: '/frontoffice/complaints' },
            { name: 'Postal', path: '/frontoffice/postal' },
            { name: 'Appointments', path: '/frontoffice/appointments' },
            { name: 'Documents', path: '/frontoffice/documents' },
            { name: 'Reports', path: '/frontoffice/reports' },
        ]
    },
    {
        id: 'collaborate', name: 'Collaborate', icon: 'BookOpen', path: '/collaborate',
        subModules: [
            { name: 'Collab Dashboard', path: '/collaborate/dashboard' },
            { name: 'Announcements', path: '/collaborate/announcements' },
            { name: 'Discussions', path: '/collaborate/discussions' },
            { name: 'Groups', path: '/collaborate/groups' },
            { name: 'File Sharing', path: '/collaborate/files' },
            { name: 'Messaging', path: '/collaborate/messages' },
            { name: 'Meetings', path: '/collaborate/meetings' },
            { name: 'Tasks', path: '/collaborate/tasks' },
            { name: 'Notice Board', path: '/collaborate/notices' },
            { name: 'Activity Stream', path: '/collaborate/activity' },
        ]
    },
];

export default function Sidebar({ open, onClose }) {
    const location = useLocation();
    const { user } = useAuth();
    const [expandedModules, setExpandedModules] = useState([]);

    const filteredModules = user?.role === 'Parent'
        ? SIDEBAR_MODULES.filter(m => m.id === 'parent-portal')
        : user?.role === 'Accountant'
            ? SIDEBAR_MODULES.filter(m => m.id === 'finance')
            : user?.role === 'Teacher'
                ? SIDEBAR_MODULES.filter(m => ['dashboard', 'student', 'academics', 'attendance', 'examination', 'collaborate'].includes(m.id))
                : SIDEBAR_MODULES.filter(m => m.id !== 'parent-portal');

    const toggleModule = (moduleId) => {
        setExpandedModules(prev =>
            prev.includes(moduleId) ? [] : [moduleId]
        );
    };

    const isModuleActive = (mod) => {
        if (mod.path === '/' && location.pathname === '/') return true;
        if (mod.path !== '/' && location.pathname.startsWith(mod.path)) return true;
        if (mod.subModules) {
            return mod.subModules.some(sub => location.pathname === sub.path.split('?')[0]);
        }
        return false;
    };

    const isSubModuleActive = (sub, mod) => {
        const [targetPath, targetSearch] = sub.path.split('?');
        if (location.pathname !== targetPath) {
            return false;
        }

        const currentParams = new URLSearchParams(location.search);
        const targetParams = new URLSearchParams(targetSearch || '');
        
        const currentTab = currentParams.get('tab');
        const targetTab = targetParams.get('tab');

        if (currentTab === targetTab) return true;

        // Fallback for when URL has no exact tab yet, default to first sub-module
        if (!currentTab && mod.subModules[0].path === sub.path) return true;

        return false;
    };

    return (
        <>
            {open && <div className="sidebar-overlay" onClick={onClose} />}
            <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <span className="sidebar-logo">🏫</span>
                        <div>
                            <h2>Mount Zion</h2>
                            <span>School Management</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {filteredModules.map((mod) => {
                        const Icon = iconMap[mod.icon] || LayoutDashboard;
                        const hasChildren = mod.subModules && mod.subModules.length > 0;
                        const isExpanded = expandedModules.includes(mod.id);
                        const isActive = isModuleActive(mod);

                        return (
                            <div key={mod.id} className="nav-item-group">
                                {hasChildren ? (
                                    <button
                                        className={`nav-item ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleModule(mod.id)}
                                    >
                                        <Icon size={19} className="nav-icon" />
                                        <span className="nav-label">{mod.name}</span>
                                        {isExpanded ? (
                                            <ChevronDown size={16} className="nav-chevron" />
                                        ) : (
                                            <ChevronRight size={16} className="nav-chevron" />
                                        )}
                                    </button>
                                ) : (
                                    <NavLink
                                        to={mod.path}
                                        end={mod.path === '/'}
                                        className={({ isActive: linkActive }) =>
                                            `nav-item ${linkActive ? 'active' : ''}`
                                        }
                                        onClick={() => window.innerWidth < 1024 && onClose()}
                                    >
                                        <Icon size={19} className="nav-icon" />
                                        <span className="nav-label">{mod.name}</span>
                                    </NavLink>
                                )}

                                {hasChildren && (
                                    <div className={`nav-sub-container ${isExpanded ? 'expanded' : ''}`}>
                                        <div className="nav-sub-items">
                                            {mod.subModules
                                                .filter(sub => {
                                                    if (sub.superAdminOnly && user?.role !== 'Super Admin') return false;
                                                    if (sub.allowedRoles && (!user || !sub.allowedRoles.includes(user.role))) return false;
                                                    return true;
                                                })
                                                .map((sub) => {
                                                    const SubIcon = subIconMap[mod.id]?.[sub.name] || FileText;
                                                    return (
                                                        <NavLink
                                                            key={sub.path}
                                                            to={sub.path}
                                                            className={() =>
                                                                `nav-sub-item ${isSubModuleActive(sub, mod) ? 'active' : ''}`
                                                            }
                                                            onClick={() => window.innerWidth < 1024 && onClose()}
                                                        >
                                                            <SubIcon size={16} className="nav-sub-icon" />
                                                            <span>{sub.name}</span>
                                                        </NavLink>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-footer-info">
                        <span className="footer-version">v1.0.0</span>
                        <span className="footer-text">Mount Zion School © 2024</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
