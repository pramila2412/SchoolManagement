import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, IndianRupee, CalendarCheck,
    BookOpen, Bus, FileText, Building, ChevronDown, ChevronRight,
    UserPlus, Award, Megaphone, FileCheck, Receipt, Wallet,
} from 'lucide-react';
import './Sidebar.css';

const iconMap = {
    LayoutDashboard, Users, IndianRupee, CalendarCheck,
    BookOpen, Bus, FileText, Building,
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
                { name: 'Fees Collection', path: '/finance' },
                { name: 'Concessions', path: '/finance/concessions' },
                { name: 'Expenses', path: '/finance/expenses' },
            ]
        },
        { id: 'attendance', name: 'Attendance', icon: 'CalendarCheck', path: '/attendance' },
        { id: 'library', name: 'Library', icon: 'BookOpen', path: '/library' },
        { id: 'transport', name: 'Transport', icon: 'Bus', path: '/transport' },
        { id: 'examination', name: 'Examination', icon: 'FileText', path: '/examination' },
        { id: 'frontoffice', name: 'Front Office', icon: 'Building', path: '/front-office' },
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
