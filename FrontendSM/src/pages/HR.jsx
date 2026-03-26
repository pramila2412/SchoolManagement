import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    BarChart3, Users, UserPlus, CalendarCheck, Clock, Briefcase,
    FileText, Star, Settings, Download, PlusCircle, Search,
    CheckCircle2, XCircle, Eye, TrendingUp, TrendingDown,
    IndianRupee, ClipboardCheck, UserCheck, AlertTriangle, Mail,
    Calendar, Upload, Timer, Filter
} from 'lucide-react';
import './HR.css';

// ======================== DASHBOARD ========================
function DashboardTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><BarChart3 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> HR Overview</h3>
            <div className="hr-quick-actions">
                <button className="hr-quick-btn"><UserPlus size={16} color="var(--primary)"/> Add Staff</button>
                <button className="hr-quick-btn"><CalendarCheck size={16} color="var(--success)"/> Mark Attendance</button>
                <button className="hr-quick-btn"><FileText size={16} color="var(--info)"/> Apply Leave</button>
                <button className="hr-quick-btn"><IndianRupee size={16} color="var(--warning)"/> Run Payroll</button>
                <button className="hr-quick-btn"><Briefcase size={16} color="var(--danger)"/> Post Job</button>
            </div>
            <div className="hr-dashboard-grid">
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Total Staff</h4><p>128</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--info-light)' }}><Users size={22} color="var(--info)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Present Today</h4><p className="success">112</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={22} color="var(--success)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>On Leave Today</h4><p className="warning">9</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--warning-light)' }}><Calendar size={22} color="var(--warning)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Pending Leave</h4><p className="danger">5</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--danger-light)' }}><AlertTriangle size={22} color="var(--danger)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Payroll (Month)</h4><p>₹ 18,40,000</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--success-light)' }}><IndianRupee size={22} color="var(--success)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Open Positions</h4><p>3</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--info-light)' }}><Briefcase size={22} color="var(--info)"/></div>
                </div>
            </div>
        </div>
    );
}

// ======================== STAFF MANAGEMENT ========================
function StaffTab() {
    const staff = [
        { id: 'EMP-2024-001', name: 'Rajesh Kumar', role: 'Teacher', dept: 'Mathematics', type: 'Full-time', status: 'Active', joined: '2020-06-15' },
        { id: 'EMP-2024-002', name: 'Priya Sharma', role: 'Admin', dept: 'Administration', type: 'Full-time', status: 'Active', joined: '2019-04-01' },
        { id: 'EMP-2024-003', name: 'Suresh Babu', role: 'Driver', dept: 'Transport', type: 'Contract', status: 'Active', joined: '2023-01-10' },
        { id: 'EMP-2024-004', name: 'Anita Verma', role: 'Counsellor', dept: 'Student Welfare', type: 'Part-time', status: 'Active', joined: '2022-08-20' },
    ];
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Users size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Staff Directory</h3>
                <button className="btn btn-primary"><UserPlus size={16}/> Add Staff</button>
            </div>
            <div className="hr-form-panel" style={{ padding: 16 }}>
                <div className="ado-form form-row-4">
                    <div className="form-group"><label className="form-label">Search</label><input type="text" className="form-input" placeholder="Name or Employee ID"/></div>
                    <div className="form-group"><label className="form-label">Department</label><select className="form-select"><option>All Departments</option><option>Mathematics</option><option>Administration</option><option>Transport</option></select></div>
                    <div className="form-group"><label className="form-label">Employment Type</label><select className="form-select"><option>All Types</option><option>Full-time</option><option>Part-time</option><option>Contract</option></select></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ width: '100%', height: 40 }}><Search size={16}/> Search</button></div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Employee ID</th><th>Name</th><th>Role</th><th>Department</th><th>Type</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{staff.map(s => (
                        <tr key={s.id}><td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{s.id}</td><td className="fw-600">{s.name}</td><td>{s.role}</td><td>{s.dept}</td>
                            <td><span className={`badge ${s.type === 'Full-time' ? 'badge-success' : s.type === 'Contract' ? 'badge-warning' : 'badge-draft'}`}>{s.type}</span></td>
                            <td>{s.joined}</td><td><span className="badge badge-success">Active</span></td>
                            <td><button className="btn-icon" title="View Profile"><Eye size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== ATTENDANCE ========================
function AttendanceTab() {
    const staffList = [
        { name: 'Rajesh Kumar', dept: 'Mathematics', status: 'Present' },
        { name: 'Priya Sharma', dept: 'Administration', status: 'Present' },
        { name: 'Suresh Babu', dept: 'Transport', status: 'Late' },
        { name: 'Anita Verma', dept: 'Student Welfare', status: 'Absent' },
        { name: 'Mohan Das', dept: 'Science', status: 'On Leave' },
    ];
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><CalendarCheck size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Mark Daily Attendance</h3>
                <button className="btn btn-success"><CheckCircle2 size={16}/> Mark All Present</button>
            </div>
            <div className="hr-form-panel" style={{ padding: 16, marginBottom: 20 }}>
                <div className="ado-form form-row-3">
                    <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" defaultValue="2026-03-26"/></div>
                    <div className="form-group"><label className="form-label">Department</label><select className="form-select"><option>All Departments</option></select></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ height: 40 }}><Filter size={16}/> Load Staff</button></div>
                </div>
            </div>
            <div className="hr-attendance-grid">
                <div className="att-header">Staff Name</div>
                <div className="att-header">Department</div>
                <div className="att-header">Status</div>
                <div className="att-header">Remarks</div>
                {staffList.map((s, i) => (
                    <React.Fragment key={i}>
                        <div className="att-cell fw-600">{s.name}</div>
                        <div className="att-cell">{s.dept}</div>
                        <div className="att-cell">
                            <select className="form-select" defaultValue={s.status} style={{ fontSize: '0.85rem', padding: '4px 8px' }}>
                                <option>Present</option><option>Absent</option><option>Late</option><option>Half Day</option><option>On Leave</option>
                            </select>
                        </div>
                        <div className="att-cell"><input type="text" className="form-input" placeholder="Optional remark" style={{ fontSize: '0.85rem', padding: '4px 8px' }}/></div>
                    </React.Fragment>
                ))}
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="btn btn-primary"><CalendarCheck size={16}/> Save Attendance</button>
            </div>
        </div>
    );
}

// ======================== LEAVE MANAGEMENT ========================
function LeaveTab() {
    const pending = [
        { staff: 'Suresh Babu', type: 'Casual Leave', from: '2026-03-28', to: '2026-03-29', days: 2, balance: 8, reason: 'Family function' },
        { staff: 'Anita Verma', type: 'Sick Leave', from: '2026-04-01', to: '2026-04-03', days: 3, balance: 10, reason: 'Medical appointment' },
    ];
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Calendar size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Leave Management</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Apply Leave</button>
            </div>

            <div className="hr-form-panel">
                <h3><AlertTriangle size={18}/> Pending Approval ({pending.length})</h3>
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Staff</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Balance</th><th>Reason</th><th>Actions</th></tr></thead>
                        <tbody>{pending.map((l, i) => (
                            <tr key={i}><td className="fw-600">{l.staff}</td><td><span className="badge badge-draft">{l.type}</span></td><td>{l.from}</td><td>{l.to}</td><td className="fw-600">{l.days}</td>
                                <td>{l.balance} days</td><td>{l.reason}</td>
                                <td style={{ display: 'flex', gap: 4 }}>
                                    <button className="btn btn-success" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Approve</button>
                                    <button className="btn btn-danger" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Reject</button>
                                </td></tr>
                        ))}</tbody></table>
                </div>
            </div>

            <div className="hr-form-panel">
                <h3><FileText size={18}/> Leave Balance Overview</h3>
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Leave Type</th><th>Annual Entitlement</th><th>Used</th><th>Balance</th></tr></thead>
                        <tbody>
                            <tr><td className="fw-600">Casual Leave (CL)</td><td>12 days</td><td>4</td><td className="success fw-600">8</td></tr>
                            <tr><td className="fw-600">Sick Leave (SL)</td><td>12 days</td><td>2</td><td className="success fw-600">10</td></tr>
                            <tr><td className="fw-600">Earned / Paid Leave</td><td>15 days</td><td>5</td><td className="success fw-600">10</td></tr>
                            <tr><td className="fw-600">Loss of Pay (LOP)</td><td>Unlimited</td><td>0</td><td>—</td></tr>
                        </tbody></table>
                </div>
            </div>
        </div>
    );
}

// ======================== PAYROLL ========================
function PayrollTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><IndianRupee size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Payroll Management</h3>
                <div style={{ display: 'flex', gap: 10 }}><button className="btn btn-outline"><Settings size={16}/> Salary Setup</button><button className="btn btn-primary"><IndianRupee size={16}/> Run Payroll</button></div>
            </div>

            <div className="hr-form-panel" style={{ padding: 16 }}>
                <div className="ado-form form-row-3">
                    <div className="form-group"><label className="form-label">Month</label><select className="form-select"><option>March 2026</option><option>February 2026</option></select></div>
                    <div className="form-group"><label className="form-label">Department</label><select className="form-select"><option>All Departments</option></select></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ height: 40 }}><Search size={16}/> Load Payroll</button></div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Employee</th><th>Basic</th><th>HRA</th><th>DA</th><th>Gross</th><th>PF</th><th>ESI</th><th>PT</th><th>LOP</th><th>Total Ded.</th><th>Net Pay</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">Rajesh Kumar</td><td>₹30,000</td><td>₹12,000</td><td>₹6,000</td><td className="fw-600">₹48,000</td><td>₹3,600</td><td>₹360</td><td>₹200</td><td>₹0</td><td className="danger">₹4,160</td><td className="success fw-600">₹43,840</td><td><span className="badge badge-success">Processed</span></td></tr>
                        <tr><td className="fw-600">Priya Sharma</td><td>₹25,000</td><td>₹10,000</td><td>₹5,000</td><td className="fw-600">₹40,000</td><td>₹3,000</td><td>₹300</td><td>₹200</td><td>₹1,250</td><td className="danger">₹4,750</td><td className="success fw-600">₹35,250</td><td><span className="badge badge-warning">Pending</span></td></tr>
                        <tr><td className="fw-600">Suresh Babu</td><td>₹15,000</td><td>₹6,000</td><td>₹3,000</td><td className="fw-600">₹24,000</td><td>₹1,800</td><td>₹180</td><td>₹150</td><td>₹0</td><td className="danger">₹2,130</td><td className="success fw-600">₹21,870</td><td><span className="badge badge-success">Processed</span></td></tr>
                    </tbody></table>
            </div>

            <div className="hr-form-panel" style={{ marginTop: 24 }}>
                <h3><FileText size={18}/> Sample Payslip Preview</h3>
                <div className="hr-payslip-preview">
                    <div className="hr-payslip-header">
                        <div><div className="hr-payslip-title">School Canvas — Payslip</div><p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Month: March 2026 | Payslip #: PS-2026-03-001</p></div>
                        <div style={{ textAlign: 'right' }}><p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}><strong>Rajesh Kumar</strong><br/>EMP-2024-001 | Teacher<br/>Department: Mathematics</p></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div>
                            <h4 style={{ color: 'var(--success)', marginBottom: 12 }}>Earnings</h4>
                            <table className="data-table" style={{ fontSize: '0.85rem' }}><tbody>
                                <tr><td>Basic Salary</td><td style={{ textAlign: 'right' }}>₹30,000</td></tr>
                                <tr><td>HRA</td><td style={{ textAlign: 'right' }}>₹12,000</td></tr>
                                <tr><td>DA</td><td style={{ textAlign: 'right' }}>₹6,000</td></tr>
                                <tr style={{ fontWeight: 700, borderTop: '2px solid var(--border)' }}><td>Gross Salary</td><td style={{ textAlign: 'right' }}>₹48,000</td></tr>
                            </tbody></table>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--danger)', marginBottom: 12 }}>Deductions</h4>
                            <table className="data-table" style={{ fontSize: '0.85rem' }}><tbody>
                                <tr><td>Provident Fund (12%)</td><td style={{ textAlign: 'right' }}>₹3,600</td></tr>
                                <tr><td>ESI (0.75%)</td><td style={{ textAlign: 'right' }}>₹360</td></tr>
                                <tr><td>Professional Tax</td><td style={{ textAlign: 'right' }}>₹200</td></tr>
                                <tr style={{ fontWeight: 700, borderTop: '2px solid var(--border)' }}><td>Total Deductions</td><td style={{ textAlign: 'right' }}>₹4,160</td></tr>
                            </tbody></table>
                        </div>
                    </div>
                    <div style={{ marginTop: 24, padding: 16, background: 'var(--bg)', borderRadius: 8, textAlign: 'center' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>Net Pay: ₹43,840</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Forty-Three Thousand Eight Hundred and Forty Rupees Only</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ======================== RECRUITMENT ========================
function RecruitmentTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Briefcase size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Recruitment Pipeline</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Post New Job</button>
            </div>

            <div className="table-responsive" style={{ marginBottom: 24 }}>
                <table className="data-table"><thead><tr><th>Job Title</th><th>Department</th><th>Vacancies</th><th>Applications</th><th>Deadline</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">Science Teacher (Physics)</td><td>Science</td><td>1</td><td>12</td><td>2026-04-15</td><td><span className="badge badge-success">Open</span></td></tr>
                        <tr><td className="fw-600">Administrative Assistant</td><td>Admin</td><td>1</td><td>8</td><td>2026-04-10</td><td><span className="badge badge-success">Open</span></td></tr>
                        <tr><td className="fw-600">Bus Driver</td><td>Transport</td><td>1</td><td>5</td><td>2026-03-30</td><td><span className="badge badge-warning">Closing Soon</span></td></tr>
                    </tbody></table>
            </div>

            <h4 style={{ color: 'var(--text-light)', marginBottom: 16, fontSize: '0.95rem' }}>Application Pipeline — Science Teacher (Physics)</h4>
            <div className="hr-pipeline">
                <div className="hr-pipeline-col">
                    <h4>New (5)</h4>
                    <div className="hr-pipeline-card"><h5>Ramesh Iyer</h5><p>M.Sc Physics, 3 yrs exp</p></div>
                    <div className="hr-pipeline-card"><h5>Sunita Devi</h5><p>M.Sc Physics, 5 yrs exp</p></div>
                </div>
                <div className="hr-pipeline-col">
                    <h4>Shortlisted (3)</h4>
                    <div className="hr-pipeline-card"><h5>Amit Patel</h5><p>M.Sc, B.Ed, 4 yrs exp</p></div>
                </div>
                <div className="hr-pipeline-col">
                    <h4>Interview (2)</h4>
                    <div className="hr-pipeline-card"><h5>Deepa Nair</h5><p>Interview: 28 Mar, 10 AM</p></div>
                </div>
                <div className="hr-pipeline-col">
                    <h4>Selected (1)</h4>
                    <div className="hr-pipeline-card" style={{ borderLeft: '3px solid var(--success)' }}><h5>Kavitha Rao</h5><p>Ready to convert to Staff</p><button className="btn btn-success" style={{ marginTop: 8, fontSize: '0.75rem', padding: '4px 10px' }}><UserPlus size={14}/> Convert to Staff</button></div>
                </div>
                <div className="hr-pipeline-col">
                    <h4>Rejected (1)</h4>
                    <div className="hr-pipeline-card" style={{ opacity: 0.6 }}><h5>Vinod Sharma</h5><p>Does not meet criteria</p></div>
                </div>
            </div>
        </div>
    );
}

// ======================== DOCUMENTS ========================
function DocumentsTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Staff Document Repository</h3>
                <button className="btn btn-primary"><Upload size={16}/> Upload Document</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Staff</th><th>Document Type</th><th>Reference</th><th>Uploaded</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">Rajesh Kumar</td><td>ID Proof (Aadhaar)</td><td>XXXX-XXXX-1234</td><td>2024-06-15</td><td>—</td><td><span className="badge badge-success">Valid</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon"><Eye size={16}/></button><button className="btn-icon"><Download size={16}/></button></td></tr>
                        <tr><td className="fw-600">Priya Sharma</td><td>Employment Contract</td><td>CON-2019-002</td><td>2019-04-01</td><td className="warning fw-600">2026-04-01</td><td><span className="badge badge-warning">Expiring Soon</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon"><Eye size={16}/></button><button className="btn-icon"><Upload size={16}/></button></td></tr>
                        <tr><td className="fw-600">Suresh Babu</td><td>Driving License</td><td>DL-09-XXXXXX</td><td>2023-01-10</td><td>2028-01-10</td><td><span className="badge badge-success">Valid</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon"><Eye size={16}/></button><button className="btn-icon"><Download size={16}/></button></td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== PERFORMANCE ========================
function PerformanceTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Star size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Performance Management</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Add Review</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Staff</th><th>Review Period</th><th>Rating</th><th>Remarks</th><th>Linked Action</th><th>Reviewed By</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">Rajesh Kumar</td><td>Apr 2025 – Mar 2026</td><td><span className="badge badge-success">⭐ Excellent</span></td><td>Exceeds all expectations consistently</td><td><span className="badge badge-draft">Promotion</span></td><td>Principal</td></tr>
                        <tr><td className="fw-600">Priya Sharma</td><td>Apr 2025 – Mar 2026</td><td><span className="badge badge-success">Good</span></td><td>Reliable, well-organized admin processes</td><td><span className="badge badge-draft">Increment</span></td><td>HR Manager</td></tr>
                        <tr><td className="fw-600">Suresh Babu</td><td>Apr 2025 – Mar 2026</td><td><span className="badge badge-warning">Average</span></td><td>Meets basic requirements; needs punctuality improvement</td><td>—</td><td>HR Manager</td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== SHIFTS ========================
function ShiftsTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Clock size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Shift & Timetable Management</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Add Shift</button>
            </div>
            <div className="hr-form-panel">
                <h3><Timer size={18}/> Defined Shifts</h3>
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Shift Name</th><th>Start Time</th><th>End Time</th><th>Min Working Hrs</th><th>Grace Period</th><th>Assigned To</th></tr></thead>
                        <tbody>
                            <tr><td className="fw-600">Morning Shift</td><td>07:30 AM</td><td>02:30 PM</td><td>6.5 hrs</td><td>15 min</td><td>Teachers, Admin</td></tr>
                            <tr><td className="fw-600">General Shift</td><td>09:00 AM</td><td>05:00 PM</td><td>7.5 hrs</td><td>15 min</td><td>Admin, Accounts</td></tr>
                            <tr><td className="fw-600">Afternoon Shift</td><td>12:00 PM</td><td>07:00 PM</td><td>6.5 hrs</td><td>10 min</td><td>Support Staff</td></tr>
                        </tbody></table>
                </div>
            </div>
            <div className="hr-form-panel">
                <h3><UserCheck size={18}/> Assign Shift</h3>
                <div className="ado-form form-row-4">
                    <div className="form-group"><label className="form-label">Staff / Department</label><select className="form-select"><option>Select Staff or Dept</option></select></div>
                    <div className="form-group"><label className="form-label">Shift</label><select className="form-select"><option>Morning Shift</option><option>General Shift</option><option>Afternoon Shift</option></select></div>
                    <div className="form-group"><label className="form-label">Effective From</label><input type="date" className="form-input"/></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ width: '100%', height: 40 }}>Save Assignment</button></div>
                </div>
            </div>
        </div>
    );
}

// ======================== REPORTS ========================
function ReportsTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Download size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> HR Reports & Analytics</h3>
            <div className="hr-form-panel" style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}><label className="form-label">Report Type</label>
                    <select className="form-select"><option>Attendance Report</option><option>Leave Report</option><option>Payroll Report</option><option>Staff List Report</option><option>Recruitment Report</option><option>Performance Report</option><option>Absentee Report</option><option>Document Expiry Report</option></select></div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}><label className="form-label">Department</label><select className="form-select"><option>All Departments</option></select></div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}><label className="form-label">Period</label><select className="form-select"><option>This Month</option><option>Last Month</option><option>This Year</option></select></div>
                <button className="btn btn-primary" style={{ padding: '10px 24px', height: 40 }}><Download size={16}/> Export Report</button>
            </div>
            <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--text-muted)' }}>
                Select a report type and click Export to generate PDF/Excel. Reports support filtering by date range, department, and individual staff.
            </div>
        </div>
    );
}

// ======================== SETTINGS ========================
function SettingsTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Settings size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> HR Module Settings</h3>
            <div className="hr-form-panel">
                <div className="ado-form">
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Employee ID Format</label><input type="text" className="form-input" defaultValue="EMP-YYYY-NNN"/></div>
                        <div className="form-group"><label className="form-label">Payroll Processing Day</label><select className="form-select"><option>28th of each month</option><option>Last day of month</option><option>1st of next month</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Late Threshold (minutes after shift start)</label><input type="number" className="form-input" defaultValue={15}/></div>
                        <div className="form-group"><label className="form-label">Attendance Lock Time</label><select className="form-select"><option>11:59 PM same day</option><option>6:00 PM same day</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Leave Year Start</label><select className="form-select"><option>April</option><option>January</option></select></div>
                        <div className="form-group"><label className="form-label">Leave Carryover</label><select className="form-select"><option>Disabled</option><option>Enabled — Max 5 days</option><option>Enabled — No Limit</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Biometric Sync</label><select className="form-select"><option>Disabled</option><option>Enabled (ZKTeco)</option><option>Enabled (ESSL)</option></select></div>
                        <div className="form-group"><label className="form-label">Auto-send Payslip via Email</label><select className="form-select"><option>Disabled</option><option>Enabled</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Document Expiry Alert (days before)</label><input type="number" className="form-input" defaultValue={30}/></div>
                        <div className="form-group"></div>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}><button className="btn btn-primary">Save HR Settings</button></div>
                </div>
            </div>
        </div>
    );
}

// ======================== MAIN HR COMPONENT ========================
const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'leave', label: 'Leave', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: IndianRupee },
    { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'performance', label: 'Performance', icon: Star },
    { id: 'shifts', label: 'Shifts', icon: Clock },
    { id: 'reports', label: 'Reports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function HR() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard');
    const handleNavigate = (tab) => { setActiveTab(tab); setSearchParams({ tab }); };
    useEffect(() => { if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl); }, [tabFromUrl]);

    return (
        <div className="hr-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb">
                    <Link to="/">Dashboard</Link><span className="separator">/</span><span>HR</span>
                    {activeTab !== 'dashboard' && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{TABS.find(t => t.id === activeTab)?.label}</span></>}
                </div>
                <h1>Human Resources Management</h1>
            </div></div>
            <div className="card hr-card">
                <div className="tabs-header">{TABS.map(tab => { const Icon = tab.icon; return <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>; })}</div>
                <div className="tabs-content">
                    {activeTab === 'dashboard' && <DashboardTab/>}
                    {activeTab === 'staff' && <StaffTab/>}
                    {activeTab === 'attendance' && <AttendanceTab/>}
                    {activeTab === 'leave' && <LeaveTab/>}
                    {activeTab === 'payroll' && <PayrollTab/>}
                    {activeTab === 'recruitment' && <RecruitmentTab/>}
                    {activeTab === 'documents' && <DocumentsTab/>}
                    {activeTab === 'performance' && <PerformanceTab/>}
                    {activeTab === 'shifts' && <ShiftsTab/>}
                    {activeTab === 'reports' && <ReportsTab/>}
                    {activeTab === 'settings' && <SettingsTab/>}
                </div>
            </div>
        </div>
    );
}
