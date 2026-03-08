import { Link } from 'react-router-dom';
import {
    CalendarCheck, BookOpen, Bus, FileText, Building,
    Clock, ArrowLeft,
} from 'lucide-react';
import './Placeholder.css';

const moduleConfig = {
    attendance: { name: 'Attendance', icon: CalendarCheck, color: '#E67E22', desc: 'Track and manage student attendance records, daily attendance reports, and monthly summaries.' },
    library: { name: 'Library', icon: BookOpen, color: '#9B59B6', desc: 'Manage book inventory, issue/return tracking, and library membership for students and staff.' },
    transport: { name: 'Transport', icon: Bus, color: '#0B3C5D', desc: 'School bus routes, driver assignments, pickup/drop schedules, and transport fee management.' },
    examination: { name: 'Examination', icon: FileText, color: '#3498DB', desc: 'Exam scheduling, grading, mark sheets, report card generation, and result analysis.' },
    'front-office': { name: 'Front Office', icon: Building, color: '#27AE60', desc: 'Visitor management, enquiry tracking, postal records, and front desk operations.' },
};

export default function PlaceholderPage({ moduleId }) {
    const config = moduleConfig[moduleId] || {
        name: 'Module',
        icon: Clock,
        color: '#999',
        desc: 'This module is under development.',
    };
    const Icon = config.icon;

    return (
        <div className="placeholder-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>{config.name}</span>
                    </div>
                    <h1>{config.name}</h1>
                </div>
                <Link to="/" className="btn btn-outline">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>

            <div className="card placeholder-card">
                <div className="placeholder-icon" style={{ background: config.color }}>
                    <Icon size={48} color="#fff" />
                </div>
                <h2>{config.name} Module</h2>
                <p>{config.desc}</p>
                <div className="placeholder-badge">
                    <Clock size={16} />
                    <span>Coming Soon</span>
                </div>
                <div className="placeholder-features">
                    <div className="placeholder-feature">
                        <div className="pf-dot" style={{ background: config.color }} />
                        <span>Feature planning in progress</span>
                    </div>
                    <div className="placeholder-feature">
                        <div className="pf-dot" style={{ background: config.color }} />
                        <span>UI designs ready</span>
                    </div>
                    <div className="placeholder-feature">
                        <div className="pf-dot" style={{ background: config.color }} />
                        <span>Backend integration pending</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
