import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customAlert } from '../utils/dialogs';
import {
    LayoutDashboard, User, CalendarCheck, Megaphone, Award, IndianRupee,
    Clock, Phone, Download, CreditCard, ChevronRight, Users, CheckCircle2, AlertTriangle, MapPin, Mail, Settings
} from 'lucide-react';
import './ParentPortal.css';

// ======================== CHILD SELECTOR ========================
function ChildSelector() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const children = user?.children || [];
    const selected = user?.selectedChild || children[0] || {};

    const handleSwitch = (e) => {
        const val = e.target.value;
        if (val === 'switch-screen') {
            navigate('/parent-selector');
            return;
        }
        const selectedObj = children.find(c => c.id === val);
        if (selectedObj) {
            login({ ...user, selectedChild: selectedObj });
        }
    };

    if (!selected.name) return null;

    return (
        <div className="pp-child-selector">
            <Users size={20}/>
            <label>Viewing for:</label>
            <select value={selected.id} onChange={handleSwitch}>
                {children.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.class} (Adm: {c.id})</option>
                ))}
                {children.length > 1 && (
                    <option value="switch-screen">🔄 Switch Student Screen</option>
                )}
            </select>
        </div>
    );
}

// ======================== DASHBOARD ========================
function DashboardTab({ setTab }) {
    const { user } = useAuth();
    const children = user?.children || [];
    const selected = user?.selectedChild || children[0] || {};
    
    // Load dynamic data based on selected child
    const allFees = JSON.parse(localStorage.getItem('mzs_fee_structure') || '[]');
    const allPayments = JSON.parse(localStorage.getItem('mzs_fee_payments') || '[]');
    const allAnnouncements = JSON.parse(localStorage.getItem('erp_announcements') || '[]');
    const studentClass = selected.class ? selected.class.split('-')[0] : '';
    
    const assignedFees = allFees.filter(f => !f.classIds || f.classIds.includes(studentClass));
    const recentAnnouncements = allAnnouncements.filter(a => {
        return a.status === 'Published' && (
            a.targetGroup === 'All Students' || 
            a.targetGroup === 'Parents' || 
            a.targetGroup === `Class ${studentClass}` || 
            a.targetGroup === studentClass
        );
    }).slice(0, 3);

    const totalFee = assignedFees.reduce((sum, f) => sum + Number(f.amount || 0), 0) || 85000;
    
    const studentPayments = allPayments.filter(p => p.studentId === selected.id);
    const amountPaid = studentPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const pendingBalance = totalFee - amountPaid;

    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <div className="pp-summary-grid">
                <div className="pp-summary-card">
                    <div className="pp-summary-info"><h4>Total Fee</h4><p>₹ {totalFee.toLocaleString()}</p></div>
                    <div className="pp-summary-icon" style={{ background: 'var(--info-light)' }}><IndianRupee size={22} color="var(--info)"/></div>
                </div>
                <div className="pp-summary-card">
                    <div className="pp-summary-info"><h4>Amount Paid</h4><p style={{ color: 'var(--success)' }}>₹ {amountPaid.toLocaleString()}</p></div>
                    <div className="pp-summary-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={22} color="var(--success)"/></div>
                </div>
                <div className="pp-summary-card">
                    <div className="pp-summary-info"><h4>Pending Balance</h4><p style={{ color: 'var(--danger)' }}>₹ {pendingBalance.toLocaleString()}</p></div>
                    <div className="pp-summary-icon" style={{ background: 'var(--danger-light)' }}><AlertTriangle size={22} color="var(--danger)"/></div>
                </div>
                <div className="pp-summary-card">
                    <div className="pp-summary-info"><h4>Attendance (Mar)</h4><p style={{ color: 'var(--success)' }}>92%</p></div>
                    <div className="pp-summary-icon" style={{ background: 'var(--success-light)' }}><CalendarCheck size={22} color="var(--success)"/></div>
                </div>
            </div>

            <div className="pp-dash-grid">
                <div className="card-sub-panel">
                    <h4 style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Megaphone size={18}/> Recent Announcements</h4>
                    {recentAnnouncements.length > 0 ? recentAnnouncements.map((a, i) => {
                        let catClass = 'general';
                        const cat = (a.category || a.targetGroup || '').toLowerCase();
                        if(cat.includes('finance') || cat.includes('fee')) catClass = 'fee';
                        else if(cat.includes('holiday')) catClass = 'holiday';
                        else if(a.title?.toLowerCase().includes('exam') || cat.includes('exam')) catClass = 'exam';
                        else if(cat.includes('urgent')) catClass = 'urgent';

                        return (
                        <div key={i} className="pp-ann-item">
                            <div><span className={`pp-ann-badge ${catClass}`}>{a.targetGroup || 'Alert'}</span> <span style={{ marginLeft: 8, fontSize: '0.9rem' }}>{a.title}</span></div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(a.publishDate || a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                    )}) : <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No recent announcements</p>}
                </div>
                <div className="card-sub-panel">
                    <h4 style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><ChevronRight size={18}/> Quick Actions</h4>
                    <div style={{ display: 'grid', gap: 8 }}>
                        <button className="hr-quick-btn" style={{ justifyContent: 'flex-start' }} onClick={() => setTab('fees')}><IndianRupee size={16} color="var(--primary)"/> Pay Fees Online</button>
                        <button className="hr-quick-btn" style={{ justifyContent: 'flex-start' }} onClick={() => setTab('history')}><Download size={16} color="var(--info)"/> Download Receipts</button>
                        <button className="hr-quick-btn" style={{ justifyContent: 'flex-start' }} onClick={() => setTab('attendance')}><CalendarCheck size={16} color="var(--success)"/> View Attendance</button>
                        <button className="hr-quick-btn" style={{ justifyContent: 'flex-start' }} onClick={() => setTab('certificates')}><Award size={16} color="var(--warning)"/> View Certificates</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ======================== STUDENT PROFILE ========================
function ProfileTab() {
    const { user } = useAuth();
    const children = user?.children || [];
    const selected = user?.selectedChild || children[0] || {};

    if (!selected.name) return null;

    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><User size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> {selected.name}'s Profile</h3>
            <div className="pp-profile-card">
                <div className="pp-profile-photo">
                    {selected.photoUrl ? <img src={selected.photoUrl} alt="Student" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'var(--radius-md)'}} /> : <User size={64} color="var(--text-muted)"/>}
                </div>
                <div className="pp-profile-details">
                    <h2>{selected.name}</h2>
                    <div className="pp-detail-row"><span className="pp-detail-label">Admission Number</span><span className="pp-detail-value">{selected.id}</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Class & Section</span><span className="pp-detail-value">{selected.class}</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Roll Number</span><span className="pp-detail-value">{selected.rollNo || selected.id.split('-').pop()}</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Date of Birth</span><span className="pp-detail-value">{selected.dateOfBirth || '—'}</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Gender / Blood Group</span><span className="pp-detail-value">{(selected.gender || '—')} / {(selected.bloodGroup || '—')}</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Parent / Guardian</span><span className="pp-detail-value">{user.name} ({user.id})</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Primary Contact Number</span><span className="pp-detail-value">{selected.phone || '—'}</span></div>
                    <div className="pp-detail-row"><span className="pp-detail-label">Registered Address</span><span className="pp-detail-value">{selected.address || '—'}</span></div>
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
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
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
    const { user } = useAuth();
    const children = user?.children || [];
    const selected = user?.selectedChild || children[0] || {};
    const studentClass = selected.class ? selected.class.split('-')[0] : '';

    const allAnnouncements = JSON.parse(localStorage.getItem('erp_announcements') || '[]');
    
    const announcements = allAnnouncements.filter(a => {
        // Show if published AND (targeted to All, Parents, or specific Class)
        return a.status === 'Published' && (
            a.targetGroup === 'All Students' || 
            a.targetGroup === 'Parents' || 
            a.targetGroup === `Class ${studentClass}` ||
            a.targetGroup === studentClass
        );
    });
    
    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Megaphone size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> School Announcements</h3>
            {announcements.length > 0 ? announcements.map((a, i) => {
                let catClass = 'general';
                const cat = (a.category || a.targetGroup || '').toLowerCase();
                if(cat.includes('finance') || cat.includes('fee')) catClass = 'fee';
                else if(cat.includes('holiday')) catClass = 'holiday';
                else if(a.title?.toLowerCase().includes('exam') || cat.includes('exam')) catClass = 'exam';
                else if(cat.includes('event')) catClass = 'event';
                else if(cat.includes('urgent')) catClass = 'urgent';

                return (
                <div key={i} className={`pp-announcement ${catClass}`}>
                    <h4>
                        <span className={`pp-ann-badge ${catClass}`}>{a.targetGroup || 'Notice'}</span>
                        {a.title}
                    </h4>
                    <p>{a.message || a.desc || a.content}</p>
                    <div className="ann-meta">
                        <span><Clock size={12}/> {new Date(a.publishDate || a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {a.attachmentUrl && <span><Download size={12}/> Download Attachment</span>}
                        {a.pinned && <span style={{ color: 'var(--danger)' }}>📌 Pinned</span>}
                    </div>
                </div>
            )}) : (
                <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                    <Megaphone size={40} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
                    <p style={{ color: 'var(--text-muted)' }}>No announcements found for your child's class.</p>
                </div>
            )}
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
function FeePaymentTab({ setTab }) {
    const { user } = useAuth();
    const selected = user?.selectedChild || user.children[0] || {};
    const [selectedFees, setSelectedFees] = useState([]);
    
    // Load from local storage
    const allFees = JSON.parse(localStorage.getItem('mzs_fee_structure') || '[]');
    const studentClass = selected.class ? selected.class.split('-')[0] : '';
    let availableFees = allFees.filter(f => !f.classIds || f.classIds.includes(studentClass));

    if (availableFees.length === 0) {
        availableFees = [
            { id: 'monthly', feeName: 'Monthly Fee (March)', amount: 3300 },
            { id: 'annual', feeName: 'Annual Fee', amount: 7950 },
            { id: 'transport', feeName: 'Transport Fee (Q4)', amount: 1500 }
        ];
    }

    const toggle = (id) => setSelectedFees(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const total = availableFees.filter(f => selectedFees.includes(f.id)).reduce((s, f) => s + Number(f.amount), 0);

    const handlePayment = async () => {
        if(total <= 0) return;
        
        // Mock payment flow
        await customAlert('Redirecting to Razorpay Secure Gateway...', 'Processing Payment', 'info');
        
        // Register successful payment
        const newPayment = {
            id: `PAY-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            studentId: selected.id,
            studentName: selected.name,
            amount: total,
            feeTypes: availableFees.filter(f => selectedFees.includes(f.id)).map(f => f.feeName).join(', '),
            mode: 'Razorpay Online',
            status: 'Success',
            receiptNo: `MZS-REC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`
        };

        const existingPayments = JSON.parse(localStorage.getItem('mzs_fee_payments') || '[]');
        localStorage.setItem('mzs_fee_payments', JSON.stringify([newPayment, ...existingPayments]));

        await customAlert(`Payment of ₹${total.toLocaleString()} was successful!\nReceipt No: ${newPayment.receiptNo}`, 'Payment Successful', 'success');
        setTab('history');
    };

    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><CreditCard size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Fee Payment</h3>
            <div style={{ maxWidth: 700 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 16 }}>Select the fee components you wish to pay. The total is calculated dynamically.</p>
                {availableFees.map(f => (
                    <div key={f.id} className={`pp-fee-item ${selectedFees.includes(f.id) ? 'selected' : ''}`} onClick={() => toggle(f.id)}>
                        <label>
                            <input type="checkbox" checked={selectedFees.includes(f.id)} onChange={() => toggle(f.id)} onClick={e => e.stopPropagation()} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}/>
                            {f.feeName || f.name}
                        </label>
                        <span className="pp-fee-amount">₹ {Number(f.amount).toLocaleString()}</span>
                    </div>
                ))}
                
                <div className="pp-fee-total">
                    <span style={{ fontWeight: 600 }}>Total Payable:</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>₹ {total.toLocaleString()}</span>
                </div>
                
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 16, padding: '14px 0', fontSize: '1rem', background: '#0b3c5d', border: 'none' }} disabled={total === 0} onClick={handlePayment}>
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
    const { user } = useAuth();
    const selected = user?.selectedChild || user.children[0] || {};
    const allPayments = JSON.parse(localStorage.getItem('mzs_fee_payments') || '[]');
    const studentPayments = allPayments.filter(p => p.studentId === selected.id);

    if (studentPayments.length === 0 && allPayments.length === 0) {
        // Mock data if completely empty
        studentPayments.push(
            { date: '2026-03-18', studentName: selected.name, feeTypes: 'Monthly Fee', amount: 3300, receiptNo: 'MZS-REC-2025-0145', status: 'Success' },
            { date: '2026-02-10', studentName: selected.name, feeTypes: 'Annual Fee', amount: 7950, receiptNo: 'MZS-REC-2025-0098', status: 'Success' },
        );
    }

    return (
        <div className="animate-fade-in">
            <ChildSelector/>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Clock size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Payment History</h3>
            
            {studentPayments.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No payment history found for this student.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Date</th><th>Student</th><th>Fee Type</th><th>Amount</th><th>Receipt #</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>{studentPayments.map((p, i) => (
                            <tr key={i}><td>{p.date}</td><td className="fw-600">{p.studentName}</td><td>{p.feeTypes || p.category}</td><td className="fw-600">₹ {Number(p.amount).toLocaleString()}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{p.receiptNo}</td>
                                <td><span className="badge badge-success"><CheckCircle2 size={12}/> {p.status}</span></td>
                                <td><button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}><Download size={14}/> PDF</button></td></tr>
                        ))}</tbody></table>
                </div>
            )}
        </div>
    );
}

// ======================== PASSWORD CHANGE ========================
function SettingsTab() {
    const { user, login } = useAuth();
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    
    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (newPass.length < 8) return customAlert('New password must be at least 8 characters.', 'Validation Error', 'warning');
        if (newPass !== confirmPass) return customAlert('New passwords do not match.', 'Validation Error', 'warning');
        
        const globalStudents = JSON.parse(localStorage.getItem('mzs_students') || '[]');
        const parentRecords = globalStudents.filter(s => s.parentId === user.parentId);
        
        if (parentRecords.length === 0) return customAlert('Parent record not found.', 'Error', 'error');
        
        // Check current password on first record (all siblings have same password)
        if (parentRecords[0].parentPassword !== currentPass) {
            return customAlert('Current password is incorrect.', 'Authentication Failed', 'error');
        }
        
        // Update password for all connected siblings
        parentRecords.forEach(record => {
            record.parentPassword = newPass;
            record.firstLogin = false; // clear first login flag
        });
        
        localStorage.setItem('mzs_students', JSON.stringify(globalStudents));
        
        // Update context to clear firstLogin warning
        login({ ...user, firstLogin: false });
        
        await customAlert('Password changed successfully!', 'Success', 'success');
        setCurrentPass(''); setNewPass(''); setConfirmPass('');
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: 500 }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Settings size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Account Settings</h3>
            
            <div className="card" style={{ padding: 24, paddingBottom: 32 }}>
                <h4 style={{ marginBottom: 16 }}>Change Password</h4>
                <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input type="password" required className="form-input" value={currentPass} onChange={e => setCurrentPass(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input type="password" required className="form-input" value={newPass} onChange={e => setNewPass(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" required className="form-input" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Update Password</button>
                </form>
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
    { id: 'settings', label: 'Account Settings', icon: Settings },
];

export default function ParentPortal() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard');
    
    const handleNavigate = (tab) => { setActiveTab(tab); setSearchParams({ tab }); };
    
    useEffect(() => { 
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl); 
        }
    }, [tabFromUrl]);

    return (
        <div className="parent-portal-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/parent-portal">Home</Link><span className="separator">/</span><span>{user?.name || 'Parent'}'s Portal</span>
                        {activeTab !== 'dashboard' && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{TABS.find(t => t.id === activeTab)?.label}</span></>}
                    </div>
                    <h1>Welcome, {user?.name || 'Parent'}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Viewing school information for {user?.selectedChild?.name || 'your children'}</p>
                </div>
                
                {user?.firstLogin && (
                    <div style={{ background: '#fff3e0', border: '1px solid #ffb74d', padding: '10px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <AlertTriangle size={20} color="#f57c00" />
                        <div>
                            <span style={{ fontWeight: 600, color: '#e65100', fontSize: '0.9rem', display: 'block' }}>First Login Notice</span>
                            <span style={{ fontSize: '0.8rem', color: '#e65100' }}>Please update your default password in Account Settings.</span>
                        </div>
                        <button className="btn btn-outline" style={{ background: '#fff', borderColor: '#ffb74d', color: '#f57c00', marginLeft: 16, padding: '4px 12px' }} onClick={() => handleNavigate('settings')}>Update Now</button>
                    </div>
                )}
            </div>

            <div className="card pp-card">
                <div className="tabs-header">
                    {TABS.map(tab => { 
                        const Icon = tab.icon; 
                        return (
                            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}>
                                <Icon size={16}/> {tab.label}
                            </button>
                        ); 
                    })}
                </div>
                
                <div className="tabs-content">
                    {activeTab === 'dashboard' && <DashboardTab setTab={handleNavigate}/>}
                    {activeTab === 'profile' && <ProfileTab/>}
                    {activeTab === 'attendance' && <AttendanceTab/>}
                    {activeTab === 'announcements' && <AnnouncementsTab/>}
                    {activeTab === 'certificates' && <CertificatesTab/>}
                    {activeTab === 'fees' && <FeePaymentTab setTab={handleNavigate}/>}
                    {activeTab === 'history' && <PaymentHistoryTab/>}
                    {activeTab === 'contact' && <ContactTab/>}
                    {activeTab === 'settings' && <SettingsTab/>}
                </div>
            </div>
        </div>
    );
}
