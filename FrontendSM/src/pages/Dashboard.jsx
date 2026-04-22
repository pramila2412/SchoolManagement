import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, IndianRupee, CalendarCheck, BookOpen, Bus,
    TrendingUp, TrendingDown, UserPlus, AlertCircle,
    ArrowRight, Clock, Layout
} from 'lucide-react';
import { api } from '../utils/api';
import { getGreeting, formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import SiteSettings from '../components/SiteSettings';
import './Dashboard.css';

export default function Dashboard() {
    const greeting = getGreeting();
    const { user } = useAuth();
    const [activeDashboardTab, setActiveDashboardTab] = useState('overview');

    const [dashboardStats, setDashboardStats] = useState({
        totalStudents: 0,
        feesCollected: 0,
        pendingFees: 0,
        attendanceToday: 0
    });
    const [feeInvoices, setFeeInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, invoicesData] = await Promise.all([
                    api.getDashboardStats(),
                    api.getInvoices()
                ]);
                setDashboardStats(statsData);
                // Show only overdue or upcoming invoices on dashboard
                setFeeInvoices(invoicesData.filter(inv => inv.status !== 'paid').slice(0, 5));
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        {
            label: 'Total Students',
            value: dashboardStats.totalStudents,
            icon: Users,
            color: 'var(--info)',
            bg: 'var(--info-light)',
            trend: '+12 this month',
            trendUp: true,
        },
        {
            label: 'Fees Collected',
            value: formatCurrency(dashboardStats.feesCollected),
            icon: IndianRupee,
            color: 'var(--success)',
            bg: 'var(--success-light)',
            trend: '+8.5% from last month',
            trendUp: true,
        },
        {
            label: 'Pending Fees',
            value: formatCurrency(dashboardStats.pendingFees),
            icon: AlertCircle,
            color: 'var(--warning)',
            bg: 'var(--warning-light)',
            trend: 'Check reminders',
            trendUp: false,
        },
        {
            label: 'Attendance Today',
            value: `${dashboardStats.attendanceToday}%`,
            icon: CalendarCheck,
            color: 'var(--accent)',
            bg: 'var(--accent-light)',
            trend: '+2.3% from yesterday',
            trendUp: true,
        },
    ];

    const quickActions = [
        { label: 'Add Student', icon: UserPlus, path: '/students/add', color: 'var(--accent)' },
        { label: 'View Students', icon: Users, path: '/students', color: 'var(--info)' },
        { label: 'Fees Collection', icon: IndianRupee, path: '/finance', color: 'var(--success)' },
        { label: 'Attendance', icon: CalendarCheck, path: '/attendance', color: 'var(--warning)' },
        { label: 'Library', icon: BookOpen, path: '/library', color: '#9B59B6' },
        { label: 'Transport', icon: Bus, path: '/transport', color: 'var(--primary)' },
    ];

    return (
        <div className="dashboard animate-fade-in">
            {/* Super Admin Dashboard Tabs */}
            {user?.role === 'Super Admin' && (
                <div className="dashboard-tabs">
                    <button 
                        className={`d-tab-btn ${activeDashboardTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveDashboardTab('overview')}
                    >
                        <TrendingUp size={18} /> Dashboard Overview
                    </button>
                    <button 
                        className={`d-tab-btn ${activeDashboardTab === 'site-configs' ? 'active' : ''}`}
                        onClick={() => setActiveDashboardTab('site-configs')}
                    >
                        <Layout size={18} /> Home Page Settings (CMS)
                    </button>
                </div>
            )}

            {activeDashboardTab === 'site-configs' ? (
                <div className="cms-wrapper">
                    <div className="section-header">
                        <h2>Landing Page Content Management</h2>
                        <p className="section-subtitle">Update your school website content live</p>
                    </div>
                    <SiteSettings />
                </div>
            ) : (
                <>
                    {/* Welcome Banner */}
            <div className="welcome-banner">
                <div className="welcome-content">
                    <h1>{greeting}, <span className="welcome-school">MOUNT ZION SCHOOL</span></h1>
                    <p>Here's what's happening at your school today</p>
                </div>
                <div className="welcome-date">
                    <Clock size={16} />
                    <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div className="stat-card card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                            <div className="stat-header">
                                <div className="stat-icon-wrap" style={{ background: stat.bg }}>
                                    <Icon size={22} style={{ color: stat.color }} />
                                </div>
                                <div className={`stat-trend ${stat.trendUp ? 'trend-up' : 'trend-down'}`}>
                                    {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span>{stat.trend}</span>
                                </div>
                            </div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Quick Actions</h2>
                    <span className="section-subtitle">Access frequently used modules</span>
                </div>
                <div className="quick-actions-grid">
                    {quickActions.map((action, i) => {
                        const Icon = action.icon;
                        return (
                            <Link to={action.path} className="quick-action-card card" key={i}>
                                <div className="qa-icon" style={{ background: action.color }}>
                                    <Icon size={24} color="#fff" />
                                </div>
                                <span className="qa-label">{action.label}</span>
                                <ArrowRight size={16} className="qa-arrow" />
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Payment Reminders */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Payment Reminders</h2>
                    <Link to="/finance" className="section-link">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="card payment-card">
                    <div className="payment-alert">
                        <AlertCircle size={18} />
                        <span>Following invoices are due/over-due for payment</span>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Class</th>
                                    <th>Invoice No</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeInvoices.map((inv, i) => (
                                    <tr key={inv.id || i}>
                                        <td className="td-bold">{inv.studentName}</td>
                                        <td>{inv.class}</td>
                                        <td>{inv.invoiceNo}</td>
                                        <td>{inv.dueDate}</td>
                                        <td className="td-bold">{formatCurrency(inv.amount)}</td>
                                        <td>
                                            <span className={`badge ${inv.status === 'overdue' ? 'badge-danger' : 'badge-warning'}`}>
                                                {inv.status === 'overdue' ? 'Overdue' : 'Due'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )}
</div>
    );
}
