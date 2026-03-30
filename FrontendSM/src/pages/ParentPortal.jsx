import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, User, CalendarCheck, Megaphone, Award, IndianRupee,
    Clock, Phone, Download, CreditCard, Eye, FileText, MapPin, Mail,
    CheckCircle2, XCircle, AlertTriangle, ChevronRight, Users
} from 'lucide-react';
import './ParentPortal.css';

// ======================== CHILD SELECTOR ========================
function ChildSelector() {
    return (
        <div className="pp-child-selector">
            <Users size={20}/>
            <label>Viewing for:</label>
            <select defaultValue="rahul">
                <option value="rahul">Rahul Kumar — Grade 10-A (Adm: MZS-2025-014)</option>
                <option value="priya">Priya Kumar — Grade 7-B (Adm: MZS-2025-089)</option>
            </select>
        </div>
    );
}

// ======================== DASHBOARD ========================
function DashboardTab() {
    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <div className="pp-summary-grid">
                <div className="pp-summary-card">
                    <div className="pp-summary-info"><h4>Total Fee</h4><p>₹ 85,000</p></div>
                    <div className="pp-summary-icon" style={{ background: 'var(--info-light)' }}><IndianRupee size={22} color="var(--info)"/></div>
                </div>
                <div className="pp-summary-card">
                    <div className="pp-summary-info"><h4>Amount Paid</h4><p style={{ color: 'var(--success)' }}>₹ 52,750</p></div>
                    <div className="pp-summary-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={22} color="var(--success)"/></div>
                </div>
                <div className="pp-summary-card">
                    <div className="pp-summary-info"><h4>Pending Balance</h4><p style={{ color: 'var(--danger)' }}>₹ 32,250</p></div>
                    <div className="pp-summary-icon" style={{ background: 'var(--danger-light)' }}><AlertTriangle size={22} color="var(--danger)"/></div>
                </div>
                <div className="pp-summary-card">
                    <div className="pp-summary-info"><h4>Attendance (Mar)</h4><p style={{ color: 'var(--success)' }}>92%</p></div>
                    <div className="pp-summary-icon" style={{ background: 'var(--success-light)' }}><CalendarCheck size={22} color="var(--success)"/></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 20 }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Megaphone size={18}/> Recent Announcements</h4>
                    {[
                        { title: 'Annual Day Rehearsal Schedule', cat: 'event', date: '25 Mar 2026' },
                        { title: 'Q4 Fee Due Reminder', cat: 'fee', date: '22 Mar 2026' },
                        { title: 'Holi Holiday - 14th March', cat: 'holiday', date: '10 Mar 2026' },
                    ].map((a, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                            <div><span className={`pp-ann-badge ${a.cat}`}>{a.cat}</span> <span style={{ marginLeft: 8, fontSize: '0.9rem' }}>{a.title}</span></div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.date}</span>
                        </div>
                    ))}
                </div>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 20 }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><ChevronRight size={18}/> Quick Actions</h4>
                    <div style={{ display: 'grid', gap: 8 }}>
                        <button className="hr-quick-btn" style={{ justifyContent: 'flex-start' }}><IndianRupee size={16} color="var(--primary)"/> Pay Fees Online</button>
                        <button className="hr-quick-btn" style={{ justifyContent: 'flex-start' }}><Download size={16} color="var(--info)"/> Download Receipts</button>
                        <button className="hr-quick-btn" style={{ justifyContent: 'flex-start' }}><CalendarCheck size={16} color="var(--success)"/> View Attendance</button>
                        <button className="hr-quick-btn" style={{ justifyContent: 'flex-start' }}><Award size={16} color="var(--warning)"/> View Certificates</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ======================== STUDENT PROFILE ========================
function ProfileTab() {
    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><User size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Student Profile</h3>
            <div className="pp-profile-card">
                <div className="pp-profile-photo"><User size={64} color="var(--text-muted)"/></div>
                <div className="pp-profile-details">
                    <h2>Rahul Kumar</h2>
                    <div className="pp-detail-row"><span className="pp-detail-label">Admission Number</span><span className="pp-detail-value">MZS-2025-014</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Class</span><span className="pp-detail-value">Grade 10</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Section</span><span className="pp-detail-value">A</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Roll Number</span><span className="pp-detail-value">14</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Date of Birth</span><span className="pp-detail-value">12 August 2011</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Parent / Guardian</span><span className="pp-detail-value">Mr. Anil Kumar (PAR-2025-00421)</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Contact Number</span><span className="pp-detail-value">+91 98765 43210</span></div>
                    <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ℹ️ Profile information is managed by the school. Please contact the administration for updates.</p>
                </div>
            </div>
        </div>
    );
}

// ======================== ATTENDANCE ========================
function AttendanceTab() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // March 2026 sample data
    const calData = [
        null, null, null, null, null, null, { d: 1, s: 'holiday' },
        { d: 2, s: 'present' }, { d: 3, s: 'present' }, { d: 4, s: 'present' }, { d: 5, s: 'present' }, { d: 6, s: 'present' }, { d: 7, s: 'late' }, { d: 8, s: 'holiday' },
        { d: 9, s: 'present' }, { d: 10, s: 'present' }, { d: 11, s: 'absent' }, { d: 12, s: 'present' }, { d: 13, s: 'present' }, { d: 14, s: 'holiday' }, { d: 15, s: 'holiday' },
        { d: 16, s: 'present' }, { d: 17, s: 'present' }, { d: 18, s: 'present' }, { d: 19, s: 'present' }, { d: 20, s: 'present' }, { d: 21, s: 'present' }, { d: 22, s: 'holiday' },
        { d: 23, s: 'present' }, { d: 24, s: 'present' }, { d: 25, s: 'present' }, { d: 26, s: 'absent' }, { d: 27, s: 'present' }, { d: 28, s: 'present' }, { d: 29, s: 'holiday' },
        { d: 30, s: 'present' }, { d: 31, s: 'present' },
    ];
    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><CalendarCheck size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Attendance — March 2026</h3>
            <div className="pp-att-stats">
                <div className="pp-att-stat"><h4>Working Days</h4><p>22</p></div>
                <div className="pp-att-stat"><h4>Present Days</h4><p style={{ color: 'var(--success)' }}>19</p></div>
                <div className="pp-att-stat"><h4>Absent Days</h4><p style={{ color: 'var(--danger)' }}>2</p></div>
                <div className="pp-att-stat"><h4>Late</h4><p style={{ color: '#e65100' }}>1</p></div>
                <div className="pp-att-stat"><h4>Attendance %</h4><p style={{ color: 'var(--success)' }}>92%</p></div>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20 }}>
                <div className="pp-calendar">
                    {days.map(d => <div key={d} className="pp-cal-header">{d}</div>)}
                    {calData.map((cell, i) => (
                        <div key={i} className={`pp-cal-day ${cell ? cell.s : 'empty'}`}>
                            {cell ? cell.d : ''}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}><span style={{ width: 12, height: 12, background: '#e8f5e9', border: '1px solid #2e7d32', borderRadius: 3 }}></span> Present</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}><span style={{ width: 12, height: 12, background: '#ffebee', border: '1px solid #c62828', borderRadius: 3 }}></span> Absent</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}><span style={{ width: 12, height: 12, background: '#fff3e0', border: '1px solid #e65100', borderRadius: 3 }}></span> Late</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}><span style={{ width: 12, height: 12, background: '#e3f2fd', border: '1px solid #1565c0', borderRadius: 3 }}></span> Holiday</span>
                </div>
            </div>
            <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ℹ️ Parents cannot edit attendance records. For discrepancies, please contact the school office.</p>
        </div>
    );
}

// ======================== ANNOUNCEMENTS ========================
function AnnouncementsTab() {
    const announcements = [
        { title: '📌 Important: Final Exam Schedule Released', body: 'The final examination for all grades will commence from April 15, 2026. Detailed timetable has been attached. Students must carry their hall tickets.', cat: 'exam', date: '25 Mar 2026', pinned: true, attachment: 'exam_timetable_2026.pdf' },
        { title: 'Annual Day Celebration — 28th March', body: 'Parents are invited for the Annual Day function at the school auditorium. Gates open at 4:00 PM. Please carry your visitor pass.', cat: 'event', date: '22 Mar 2026' },
        { title: 'Q4 Fee Payment Due Reminder', body: 'This is a reminder that Q4 tuition fees are due by March 31, 2026. Late payment may attract a fine of ₹500. Please pay via the portal.', cat: 'fee', date: '20 Mar 2026' },
        { title: 'Holi Holiday — School Closed on 14th March', body: 'On account of Holi, the school will remain closed on March 14, 2026 (Saturday). Regular classes resume on March 16.', cat: 'holiday', date: '10 Mar 2026' },
        { title: '🔴 Water Supply Disruption — Carry Water Bottles', body: 'Due to maintenance, the school water supply will be disrupted on March 12. Students must bring their own water bottles.', cat: 'urgent', date: '9 Mar 2026' },
        { title: 'PTM Scheduled for 5th March', body: 'Parent-Teacher Meeting for Grades 9 and 10 is scheduled for March 5, 2026, from 10:00 AM. Attendance is mandatory.', cat: 'general', date: '1 Mar 2026' },
    ];
    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Megaphone size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> School Announcements</h3>
            {announcements.map((a, i) => (
                <div key={i} className={`pp-announcement ${a.cat}`}>
                    <h4>
                        <span className={`pp-ann-badge ${a.cat}`}>{a.cat}</span>
                        {a.title}
                    </h4>
                    <p>{a.body}</p>
                    <div className="ann-meta">
                        <span><Clock size={12}/> {a.date}</span>
                        {a.attachment && <span><Download size={12}/> {a.attachment}</span>}
                        {a.pinned && <span style={{ color: 'var(--danger)' }}>📌 Pinned</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ======================== CERTIFICATES ========================
function CertificatesTab() {
    const certs = [
        { type: 'Bonafide Certificate', code: 'MZS-BON-2025-001', issued: '15 Jan 2026', status: 'Ready' },
        { type: 'Character Certificate', code: 'MZS-CHR-2025-014', issued: '20 Feb 2026', status: 'Ready' },
        { type: 'Transfer Certificate', code: 'MZS-TC-2025-014', issued: '—', status: 'Not Issued' },
        { type: 'Study Certificate', code: 'MZS-STU-2025-014', issued: '10 Mar 2026', status: 'Ready' },
        { type: 'Participation Certificate', code: 'MZS-PAR-2025-009', issued: '22 Mar 2026', status: 'Ready' },
    ];
    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Award size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Certificates</h3>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Certificate Type</th><th>Certificate Code</th><th>Issued Date</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>{certs.map((c, i) => (
                        <tr key={i}><td className="fw-600">{c.type}</td><td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{c.code}</td><td>{c.issued}</td>
                            <td>{c.status === 'Ready' ? <span className="badge badge-success">Ready</span> : <span className="badge badge-draft">Not Issued</span>}</td>
                            <td>{c.status === 'Ready' ? <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}><Download size={14}/> Download PDF</button> : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>}</td></tr>
                    ))}</tbody></table>
            </div>
            <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ℹ️ Certificates are generated by the school administration. Once issued, they will appear here for download.</p>
        </div>
    );
}

// ======================== FEE PAYMENT ========================
function FeePaymentTab() {
    const [selected, setSelected] = useState([]);
    const fees = [
        { id: 'monthly', name: 'Monthly Fee (March 2026)', amount: 3300 },
        { id: 'annual', name: 'Annual Fee (2025-26)', amount: 7950 },
        { id: 'transport', name: 'Transport Fee (Q4)', amount: 1500 },
        { id: 'lab', name: 'Computer Lab Fee', amount: 2000 },
        { id: 'exam', name: 'Exam Fee (Final)', amount: 1500 },
    ];
    const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const total = fees.filter(f => selected.includes(f.id)).reduce((s, f) => s + f.amount, 0);

    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><CreditCard size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Fee Payment</h3>
            <div style={{ maxWidth: 700 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 16 }}>Select the fee components you wish to pay. The total is calculated dynamically.</p>
                {fees.map(f => (
                    <div key={f.id} className={`pp-fee-item ${selected.includes(f.id) ? 'selected' : ''}`} onClick={() => toggle(f.id)}>
                        <label>
                            <input type="checkbox" checked={selected.includes(f.id)} onChange={() => toggle(f.id)} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}/>
                            {f.name}
                        </label>
                        <span className="pp-fee-amount">₹ {f.amount.toLocaleString()}</span>
                    </div>
                ))}
                <div className="pp-fee-total">
                    <span style={{ fontWeight: 600 }}>Total Payable:</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>₹ {total.toLocaleString()}</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 16, padding: '14px 0', fontSize: '1rem' }} disabled={total === 0}>
                    <CreditCard size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/> Pay Online via Razorpay
                </button>
                <div style={{ marginTop: 16, padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <p><strong>Supported:</strong> UPI, PhonePe, Google Pay, Debit/Credit Card, Net Banking</p>
                    <p><strong>Minimum:</strong> ₹100 | <strong>Currency:</strong> INR | <strong>Gateway:</strong> Razorpay (PCI DSS Compliant)</p>
                </div>
            </div>
        </div>
    );
}

// ======================== PAYMENT HISTORY ========================
function PaymentHistoryTab() {
    const payments = [
        { date: '18 Mar 2026', student: 'Rahul Kumar', fee: 'Monthly Fee', amount: '₹ 3,300', receipt: 'MZS-REC-2025-0145', status: 'Success' },
        { date: '10 Feb 2026', student: 'Rahul Kumar', fee: 'Annual Fee', amount: '₹ 7,950', receipt: 'MZS-REC-2025-0098', status: 'Success' },
        { date: '05 Jan 2026', student: 'Rahul Kumar', fee: 'Monthly Fee', amount: '₹ 3,300', receipt: 'MZS-REC-2025-0067', status: 'Success' },
        { date: '15 Dec 2025', student: 'Rahul Kumar', fee: 'Transport Fee', amount: '₹ 4,500', receipt: 'MZS-REC-2025-0042', status: 'Success' },
        { date: '20 Nov 2025', student: 'Rahul Kumar', fee: 'Monthly Fee + Lab Fee', amount: '₹ 5,300', receipt: 'MZS-REC-2025-0023', status: 'Success' },
    ];
    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Clock size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Payment History</h3>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Date</th><th>Student</th><th>Fee Type</th><th>Amount</th><th>Receipt #</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>{payments.map((p, i) => (
                        <tr key={i}><td>{p.date}</td><td className="fw-600">{p.student}</td><td>{p.fee}</td><td className="fw-600">{p.amount}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{p.receipt}</td>
                            <td><span className="badge badge-success"><CheckCircle2 size={12}/> {p.status}</span></td>
                            <td><button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}><Download size={14}/> PDF</button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== CONTACT SCHOOL ========================
function ContactTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Phone size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Contact School</h3>
            <div className="pp-contact-grid">
                <div className="pp-contact-card">
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><Phone size={24} color="var(--success)"/></div>
                    <h4>Phone</h4>
                    <p>+91 44 2345 6789</p>
                    <p style={{ fontSize: '0.8rem' }}>Mon–Fri: 8:00 AM – 4:00 PM</p>
                </div>
                <div className="pp-contact-card">
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--info-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><Mail size={24} color="var(--info)"/></div>
                    <h4>Email</h4>
                    <p>info@mountzionschool.in</p>
                    <p style={{ fontSize: '0.8rem' }}>Response within 24 hours</p>
                </div>
                <div className="pp-contact-card">
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><MapPin size={24} color="var(--warning)"/></div>
                    <h4>Address</h4>
                    <p>Mount Zion School Campus</p>
                    <p style={{ fontSize: '0.8rem' }}>NH-44, Near Bus Stand, Tamil Nadu</p>
                </div>
            </div>
        </div>
    );
}

// ======================== MAIN PARENT PORTAL COMPONENT ========================
const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Student Profile', icon: User },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'fees', label: 'Fee Payment', icon: CreditCard },
    { id: 'history', label: 'Payment History', icon: Clock },
    { id: 'contact', label: 'Contact', icon: Phone },
];

export default function ParentPortal() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard');
    const handleNavigate = (tab) => { setActiveTab(tab); setSearchParams({ tab }); };
    useEffect(() => { if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl); }, [tabFromUrl]);

    return (
        <div className="parent-portal-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb">
                    <Link to="/">Dashboard</Link><span className="separator">/</span><span>Parent Portal</span>
                    {activeTab !== 'dashboard' && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{TABS.find(t => t.id === activeTab)?.label}</span></>}
                </div>
                <h1>Parent Portal Management</h1>
            </div></div>
            <div className="card pp-card">
                <div className="tabs-header">{TABS.map(tab => { const Icon = tab.icon; return <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>; })}</div>
                <div className="tabs-content">
                    {activeTab === 'dashboard' && <DashboardTab/>}
                    {activeTab === 'profile' && <ProfileTab/>}
                    {activeTab === 'attendance' && <AttendanceTab/>}
                    {activeTab === 'announcements' && <AnnouncementsTab/>}
                    {activeTab === 'certificates' && <CertificatesTab/>}
                    {activeTab === 'fees' && <FeePaymentTab/>}
                    {activeTab === 'history' && <PaymentHistoryTab/>}
                    {activeTab === 'contact' && <ContactTab/>}
                </div>
            </div>
        </div>
    );
}
