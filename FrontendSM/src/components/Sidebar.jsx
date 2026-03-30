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
    Briefcase, Star, Timer, Filter
} from 'lucide-react';
import './Sidebar.css';

const iconMap = {
    LayoutDashboard, Users, IndianRupee, CalendarCheck,
    BookOpen, Bus, FileText, Building, GraduationCap, Briefcase,
};

const subIconMap = {
    'Student Information': Users,
    'Add Student': UserPlus,
    'Student Attendance': CalendarCheck,
    'Certificates': Award,
    'Announcement': Megaphone,
    'TC': FileCheck,
    'Fees Collection': Receipt,
    'Concessions': Wallet,
    'Expenses': IndianRupee,

    // Finance Submodules
    'Dashboard': PieChart,
    'Fee Structure': FileSymlink,
    'Fee Collection': IndianRupee,
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

    // HR Submodules
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

    // Parent Portal Submodules
    'Portal Dashboard': PieChart,
    'Student Profile': Users,
    'Student Attendance': CalendarCheck,
    'School Announcements': Megaphone,
    'Certificates Download': Award,
    'Fee Payment': CreditCard,
    'Payment History': Clock,
    'Contact School': Phone,

    // Academics sub-modules
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
    // Admission
    'Enquiries': UserPlus,
    'Application Form': FileText,
    'Documents': Upload,
    'Review & Approval': ClipboardCheck,
    'Fee Assignment': CreditCard,
    'Confirmation': Award,
    'ID Card': Award,
    'Admission Reports': BarChart3,
    'Admission Settings': Settings,
    // Add-Ons
    'Visitor Management': UserCheck,
    'Gallery': Image,
    'Alumni Directory': Users,
    'Student Birthdays': Gift,
    'Messages': MessageSquare,
    'Custom Forms': FileText,
    'Downloads': Download,
    'Certificates': Award,
    'Registration': ClipboardList,
    'Analytics': PieChart,
    // Transport
    'Transport Dashboard': LayoutDashboard,
    'Vehicles': Truck,
    'Drivers': Users,
    'Routes': Map,
    'Student Assignment': UserCheck,
    'Live Tracking': Navigation,
    'Transport Attendance': ClipboardCheck,
    'Transport Fees': CreditCard,
    // Examination
    'Exam Setup': LayoutDashboard,
    'Exam Timetable': Calendar,
    'Hall Tickets': Stamp,
    'Marks Entry': ClipboardCheck,
    'Exam Results': Award,
    'Report Cards': FileText,
    'Exam Analytics': BarChart3,
    'Exam Settings': Settings,
    // Collaborate
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
    // Front Office
    'FO Dashboard': LayoutDashboard,
    'Visitors': Users,
    'Call Logs': Phone,
    'Enquiries': HelpCircle,
    'Complaints': AlertTriangle,
    'Postal': Package,
    'Appointments': CalendarClock,
};

export default function Sidebar({ open, onClose }) {
    const location = useLocation();
    const [expandedModules, setExpandedModules] = useState(['student', 'finance']);

    const modules = [
        { id: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
        {
            id: 'student', name: 'Student', icon: 'Users', path: '/students',
            subModules: [
                { name: 'Student Information', path: '/students' },
                { name: 'Add Student', path: '/students/add' },
                { name: 'Student Attendance', path: '/attendance' },
                { name: 'Certificates', path: '/certificates' },
                { name: 'Announcement', path: '/announcements' },
                { name: 'TC', path: '/tc' },
            ]
        },
        {
            id: 'finance', name: 'Finance', icon: 'IndianRupee', path: '/finance',
            subModules: [
                { name: 'Dashboard', path: '/finance?tab=dashboard' },
                { name: 'Fee Structure', path: '/finance?tab=structure' },
                { name: 'Fee Collection', path: '/finance?tab=collection' },
                { name: 'Online Payments', path: '/finance?tab=online-payments' },
                { name: 'Due List & Defaulters', path: '/finance?tab=defaulters' },
                { name: 'Expense Tracking', path: '/finance?tab=expenses' },
                { name: 'Invoice & Billing', path: '/finance?tab=invoices' },
                { name: 'Refund Management', path: '/finance?tab=refunds' },
                { name: 'Accounting Engine', path: '/finance?tab=accounting' },
                { name: 'Asset Management', path: '/finance?tab=assets' },
                { name: 'Inventory (Linked)', path: '/finance?tab=inventory' },
                { name: 'Financial Reports', path: '/finance?tab=reports' },
                { name: 'Settings & Config', path: '/finance?tab=settings' },
            ]
        },
        {
            id: 'academics', name: 'Academics', icon: 'GraduationCap', path: '/academics',
            subModules: [
                { name: 'Academic Year', path: '/academics' },
                { name: 'Classes & Sections', path: '/academics?tab=classes' },
                { name: 'Subjects', path: '/academics?tab=subjects' },
                { name: 'Teacher Assignment', path: '/academics?tab=teachers' },
                { name: 'Time Table', path: '/academics?tab=timetable' },
                { name: 'Syllabus', path: '/academics?tab=syllabus' },
                { name: 'Lesson Plans', path: '/academics?tab=lesson-plan' },
                { name: 'Assignments', path: '/academics?tab=assignments' },
                { name: 'Attendance', path: '/academics?tab=attendance' },
                { name: 'Performance', path: '/academics?tab=performance' },
                { name: 'Study Materials', path: '/academics?tab=materials' },
                { name: 'Promotion', path: '/academics?tab=promotion' },
                { name: 'Reports', path: '/academics?tab=reports' },
                { name: 'Settings', path: '/academics?tab=settings' },
            ]
        },
        {
            id: 'admission', name: 'Admission', icon: 'BookOpen', path: '/admission',
            subModules: [
                { name: 'Enquiries', path: '/admission' },
                { name: 'Application Form', path: '/admission?tab=apply' },
                { name: 'Documents', path: '/admission?tab=documents' },
                { name: 'Review & Approval', path: '/admission?tab=review' },
                { name: 'Fee Assignment', path: '/admission?tab=fees' },
                { name: 'Confirmation', path: '/admission?tab=confirm' },
                { name: 'ID Card', path: '/admission?tab=id-card' },
                { name: 'Admission Reports', path: '/admission?tab=reports' },
                { name: 'Admission Settings', path: '/admission?tab=settings' },
            ]
        },
        {
            id: 'addons', name: 'Add-Ons', icon: 'Settings', path: '/addons',
            subModules: [
                { name: 'Visitor Management', path: '/addons?tab=visitors' },
                { name: 'Gallery', path: '/addons?tab=gallery' },
                { name: 'Alumni Directory', path: '/addons?tab=alumni' },
                { name: 'Student Birthdays', path: '/addons?tab=birthdays' },
                { name: 'Messages', path: '/addons?tab=messages' },
                { name: 'Custom Forms', path: '/addons?tab=forms' },
                { name: 'Downloads', path: '/addons?tab=downloads' },
                { name: 'Certificates', path: '/addons?tab=certificates' },
                { name: 'Registration', path: '/addons?tab=registration' },
                { name: 'Reports', path: '/addons?tab=reports' },
                { name: 'Analytics', path: '/addons?tab=analytics' },
                { name: 'Settings', path: '/addons?tab=settings' },
            ]
        },
        {
            id: 'hr', name: 'HR', icon: 'Briefcase', path: '/hr',
            subModules: [
                { name: 'HR Dashboard', path: '/hr?tab=dashboard' },
                { name: 'Staff Management', path: '/hr?tab=staff' },
                { name: 'Staff Attendance', path: '/hr?tab=attendance' },
                { name: 'Leave Management', path: '/hr?tab=leave' },
                { name: 'Payroll', path: '/hr?tab=payroll' },
                { name: 'Recruitment', path: '/hr?tab=recruitment' },
                { name: 'Staff Documents', path: '/hr?tab=documents' },
                { name: 'Performance', path: '/hr?tab=performance' },
                { name: 'Shifts & Timetable', path: '/hr?tab=shifts' },
                { name: 'HR Reports', path: '/hr?tab=reports' },
                { name: 'HR Settings', path: '/hr?tab=settings' },
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
                { name: 'Transport Dashboard', path: '/transport' },
                { name: 'Vehicles', path: '/transport?tab=vehicles' },
                { name: 'Drivers', path: '/transport?tab=drivers' },
                { name: 'Routes', path: '/transport?tab=routes' },
                { name: 'Student Assignment', path: '/transport?tab=students' },
                { name: 'Live Tracking', path: '/transport?tab=tracking' },
                { name: 'Transport Attendance', path: '/transport?tab=attendance' },
                { name: 'Transport Fees', path: '/transport?tab=fees' },
            ]
        },
        {
            id: 'examination', name: 'Examination', icon: 'FileText', path: '/examination',
            subModules: [
                { name: 'Exam Setup', path: '/examination' },
                { name: 'Exam Timetable', path: '/examination?tab=timetable' },
                { name: 'Hall Tickets', path: '/examination?tab=halltickets' },
                { name: 'Marks Entry', path: '/examination?tab=marks' },
                { name: 'Exam Results', path: '/examination?tab=results' },
                { name: 'Report Cards', path: '/examination?tab=reportcards' },
                { name: 'Exam Analytics', path: '/examination?tab=analytics' },
                { name: 'Exam Settings', path: '/examination?tab=settings' },
            ]
        },
        {
            id: 'frontoffice', name: 'Front Office', icon: 'Building', path: '/front-office',
            subModules: [
                { name: 'FO Dashboard', path: '/front-office' },
                { name: 'Visitors', path: '/front-office?tab=visitors' },
                { name: 'Call Logs', path: '/front-office?tab=calls' },
                { name: 'Enquiries', path: '/front-office?tab=enquiries' },
                { name: 'Complaints', path: '/front-office?tab=complaints' },
                { name: 'Postal', path: '/front-office?tab=postal' },
                { name: 'Appointments', path: '/front-office?tab=appointments' },
            ]
        },
        {
            id: 'collaborate', name: 'Collaborate', icon: 'BookOpen', path: '/collaborate',
            subModules: [
                { name: 'Collab Dashboard', path: '/collaborate' },
                { name: 'Announcements', path: '/collaborate?tab=announcements' },
                { name: 'Discussions', path: '/collaborate?tab=discussions' },
                { name: 'Groups', path: '/collaborate?tab=groups' },
                { name: 'File Sharing', path: '/collaborate?tab=files' },
                { name: 'Messaging', path: '/collaborate?tab=messages' },
                { name: 'Meetings', path: '/collaborate?tab=meetings' },
                { name: 'Tasks', path: '/collaborate?tab=tasks' },
                { name: 'Notice Board', path: '/collaborate?tab=notices' },
                { name: 'Collab Settings', path: '/collaborate?tab=settings' },
            ]
        },
    ];

    const toggleModule = (moduleId) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const isModuleActive = (mod) => {
        if (mod.path === '/' && location.pathname === '/') return true;
        if (mod.path !== '/' && location.pathname.startsWith(mod.path)) return true;
        if (mod.subModules) {
            return mod.subModules.some(sub => location.pathname === sub.path);
        }
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
                    <div className="nav-section-label">Main Menu</div>
                    {modules.map((mod) => {
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

                                {hasChildren && isExpanded && (
                                    <div className="nav-sub-items">
                                        {mod.subModules.map((sub) => {
                                            const SubIcon = subIconMap[sub.name] || FileText;
                                            return (
                                                <NavLink
                                                    key={sub.path}
                                                    to={sub.path}
                                                    end
                                                    className={({ isActive: linkActive }) =>
                                                        `nav-sub-item ${linkActive ? 'active' : ''}`
                                                    }
                                                    onClick={() => window.innerWidth < 1024 && onClose()}
                                                >
                                                    <SubIcon size={16} className="nav-sub-icon" />
                                                    <span>{sub.name}</span>
                                                </NavLink>
                                            );
                                        })}
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
