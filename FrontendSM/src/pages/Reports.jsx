import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, CalendarDays, Eye } from 'lucide-react';
import './Reports.css';

export default function Reports() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportForm, setReportForm] = useState({ class: '', section: '', period: '' });
    const [showReport, setShowReport] = useState(false);

    const handleViewReport = (e) => {
        e.preventDefault();
        setShowReport(true);
    };

    return (
        <div className="reports-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Academics</span>
                        <span className="separator">/</span>
                        <span>Reports</span>
                    </div>
                    <h1>Reports Control Center</h1>
                </div>
            </div>

            <div className="reports-layout">
                <div className="reports-sidebar card">
                    <ul className="reports-nav">
                        <li>
                            <button 
                                className={`report-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                <LayoutDashboard size={18} /> Dashboard
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`report-nav-btn ${activeTab === 'parent' ? 'active' : ''}`}
                                onClick={() => setActiveTab('parent')}
                            >
                                <FileText size={18} /> Report Parent
                            </button>
                        </li>
                        <li>
                            <button className="report-nav-btn text-muted"><CalendarDays size={18} /> Attendance Register</button>
                        </li>
                        <li>
                            <button className="report-nav-btn text-muted"><BarChart2 size={18} /> Day Wise Report</button>
                        </li>
                    </ul>
                </div>

                <div className="reports-content">
                    {activeTab === 'dashboard' && (
                        <div className="report-dashboard animate-slide-up">
                            <div className="card dashboard-header-card">
                                <div className="date-picker-wrap">
                                    <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
                                    <button className="btn btn-primary">GO</button>
                                </div>
                            </div>

                            <div className="stats-grid" style={{ marginTop: '24px' }}>
                                <div className="stat-card sum-total card">
                                    <div className="stat-title">Total Student</div>
                                    <div className="stat-value">1,240</div>
                                </div>
                                <div className="stat-card sum-present card">
                                    <div className="stat-title">Present</div>
                                    <div className="stat-value">1,180</div>
                                </div>
                                <div className="stat-card sum-absent card">
                                    <div className="stat-title">Absent</div>
                                    <div className="stat-value">45</div>
                                </div>
                                <div className="stat-card sum-unmarked card">
                                    <div className="stat-title">Unmarked</div>
                                    <div className="stat-value">15</div>
                                </div>
                            </div>

                            <div className="charts-grid" style={{ marginTop: '24px' }}>
                                <div className="card chart-card">
                                    <h3>Class-wise Attendance (%)</h3>
                                    <div className="chart-placeholder">
                                        <div className="bar" style={{height: '80%'}}></div>
                                        <div className="bar" style={{height: '95%'}}></div>
                                        <div className="bar" style={{height: '70%'}}></div>
                                        <div className="bar" style={{height: '98%'}}></div>
                                        <div className="bar" style={{height: '88%'}}></div>
                                        <div className="bar" style={{height: '92%'}}></div>
                                    </div>
                                </div>
                                <div className="card chart-card">
                                    <h3>Month-wise School Attendance</h3>
                                    <div className="chart-placeholder line-chart-placeholder">
                                        <svg viewBox="0 0 100 50" className="sparkline">
                                            <polyline points="0,40 20,30 40,35 60,15 80,25 100,10" fill="none" stroke="var(--primary)" strokeWidth="3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'parent' && (
                        <div className="report-parent animate-slide-up">
                            <div className="card">
                                <h3>Report Parent</h3>
                                <form onSubmit={handleViewReport} className="report-filter-form">
                                    <div className="form-group">
                                        <label className="form-label">Class</label>
                                        <select className="form-select" value={reportForm.class} onChange={e => setReportForm({...reportForm, class: e.target.value})}>
                                            <option value="">Select Class</option>
                                            <option value="1">Class I</option>
                                            <option value="2">Class II</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Section</label>
                                        <select className="form-select" value={reportForm.section} onChange={e => setReportForm({...reportForm, section: e.target.value})}>
                                            <option value="">Select Section</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Period</label>
                                        <select className="form-select" value={reportForm.period} onChange={e => setReportForm({...reportForm, period: e.target.value})}>
                                            <option value="">Select Period</option>
                                            <option value="P1">Period 1</option>
                                            <option value="P2">Period 2</option>
                                        </select>
                                    </div>
                                    <div className="form-group flex-align-bottom">
                                        <button type="submit" className="btn btn-primary" style={{ height: '42px', marginTop: '24px' }}>
                                            <Eye size={18} /> View
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {showReport && (
                                <div className="card report-table-card animate-fade-in" style={{ marginTop: '24px' }}>
                                    <div className="table-responsive">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Roll No</th>
                                                    <th>Student Name</th>
                                                    <th>Attendance Status</th>
                                                    <th>Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td className="fw-600">Aarav Sharma</td>
                                                    <td><span className="badge badge-success">Present</span></td>
                                                    <td>-</td>
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td className="fw-600">Priya Patel</td>
                                                    <td><span className="badge badge-danger">Absent</span></td>
                                                    <td>Health issue reported</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
