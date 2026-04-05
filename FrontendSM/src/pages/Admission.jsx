import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Users, UserPlus, FileText, ClipboardCheck, Save, PlusCircle,
    Trash2, Edit3, Eye, Send, Phone, Mail, Calendar, Search,
    CheckCircle2, XCircle, CreditCard, Award, Settings, BarChart3,
    MessageSquare, ArrowRight, Clock, BookOpen, Upload, Download,
    ChevronRight, User, MapPin, GraduationCap, IdCard, Filter
} from 'lucide-react';
import { api } from '../utils/api';
import { getInitials, getAvatarColor, formatDate } from '../utils/helpers';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { customAlert, customConfirm } from '../utils/dialogs';
import PhoneInput from '../components/PhoneInput';
import './Admission.css';

// ======================== ENQUIRY ========================
function EnquiryTab() {
    const [enquiries, setEnquiries] = useLocalStorage('admission_enquiries', [
        { id: 1, studentName: 'Rahul Kumar', parentName: 'Mr. Suresh Kumar', phone: '9876543210', email: 'suresh@email.com', class: 'Grade 1', source: 'Walk-in', status: 'New', date: '2026-03-20' },
        { id: 2, studentName: 'Priya Singh', parentName: 'Mrs. Anita Singh', phone: '9876543211', email: 'anita@email.com', class: 'Grade 3', source: 'Online', status: 'Contacted', date: '2026-03-18' },
        { id: 3, studentName: 'Arjun Patel', parentName: 'Mr. Rajesh Patel', phone: '9876543212', email: 'rajesh@email.com', class: 'Grade 2', source: 'Referral', status: 'Follow-up', date: '2026-03-15' },
        { id: 4, studentName: 'Meera Joshi', parentName: 'Mrs. Kavita Joshi', phone: '9876543213', email: 'kavita@email.com', class: 'Grade 1', source: 'Phone', status: 'Converted', date: '2026-03-10' },
    ]);
    const [form, setForm] = useState({ studentName: '', parentName: '', phone: '', email: '', class: '', source: 'Walk-in', notes: '' });
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnquiries(prev => [{ ...form, id: Date.now(), status: 'New', date: new Date().toISOString().split('T')[0] }, ...prev]);
        setForm({ studentName: '', parentName: '', phone: '', email: '', class: '', source: 'Walk-in', notes: '' });
        setShowForm(false);
    };
    const statusBadge = (s) => s === 'New' ? 'badge-info' : s === 'Contacted' ? 'badge-warning' : s === 'Follow-up' ? 'badge-draft' : s === 'Converted' ? 'badge-success' : 'badge-danger';
    const handleFollowUp = (id) => setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'Follow-up' } : e));
    const handleConvert = (id) => setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'Converted' } : e));
    const handleDeleteEnquiry = async (id) => { if (await customConfirm('Delete this enquiry?')) setEnquiries(prev => prev.filter(e => e.id !== id)); };

    return (
        <div className="animate-fade-in">
            <div className="adm-stats-row">
                {[{ label: 'Total Enquiries', value: enquiries.length, color: 'var(--info)', bg: 'var(--info-light)', icon: Users },
                  { label: 'New', value: enquiries.filter(e => e.status === 'New').length, color: 'var(--accent)', bg: 'var(--accent-light)', icon: UserPlus },
                  { label: 'Converted', value: enquiries.filter(e => e.status === 'Converted').length, color: 'var(--success)', bg: 'var(--success-light)', icon: CheckCircle2 },
                  { label: 'Pending Follow-up', value: enquiries.filter(e => e.status === 'Follow-up').length, color: 'var(--warning)', bg: 'var(--warning-light)', icon: Clock },
                ].map((s, i) => { const I = s.icon; return <div className="adm-stat-card" key={i}><div className="adm-stat-icon" style={{ background: s.bg }}><I size={24} style={{ color: s.color }}/></div><div className="adm-stat-info"><h4>{s.value}</h4><p>{s.label}</p></div></div>; })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}>Enquiry List</h3>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><PlusCircle size={16}/> New Enquiry</button>
            </div>

            {showForm && (
                <div className="adm-form-panel" style={{ flex: 'none', marginBottom: 24, width: '100%' }}>
                    <h3><UserPlus size={18}/> Create Enquiry</h3>
                    <form className="adm-form" onSubmit={handleSubmit}>
                        <div className="adm-form form-row-3">
                            <div className="form-group"><label className="form-label">Student Name <span className="required">*</span></label>
                                <input type="text" className="form-input" required value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Parent Name <span className="required">*</span></label>
                                <input type="text" className="form-input" required value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Phone <span className="required">*</span></label>
                                <PhoneInput required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                        </div>
                        <div className="adm-form form-row-3">
                            <div className="form-group"><label className="form-label">Email</label>
                                <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Interested Class <span className="required">*</span></label>
                                <select className="form-select" required value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}><option value="">Select</option><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option></select></div>
                            <div className="form-group"><label className="form-label">Source</label>
                                <select className="form-select" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}><option>Walk-in</option><option>Online</option><option>Referral</option><option>Phone</option><option>Social Media</option></select></div>
                        </div>
                        <div className="form-group"><label className="form-label">Notes</label>
                            <textarea className="form-input" rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }}></textarea></div>
                        <div className="adm-form form-actions"><button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="btn btn-primary"><Save size={16}/> Save Enquiry</button></div>
                    </form>
                </div>
            )}

            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Student</th><th>Parent</th><th>Phone</th><th>Class</th><th>Source</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{enquiries.map(e => (
                        <tr key={e.id}><td className="fw-600">{e.studentName}</td><td>{e.parentName}</td><td>{e.phone}</td><td>{e.class}</td><td>{e.source}</td><td>{e.date}</td>
                            <td><span className={`badge ${statusBadge(e.status)}`}>{e.status}</span></td>
                            <td style={{ display: 'flex', gap: 2 }}>
                                <button className="btn-icon" title="Follow-up" onClick={() => handleFollowUp(e.id)}><MessageSquare size={16}/></button>
                                {e.status !== 'Converted' && <button className="btn-icon" title="Convert to Application" style={{ color: 'var(--accent)' }} onClick={() => handleConvert(e.id)}><ArrowRight size={16}/></button>}
                                <button className="btn-icon" title="Delete" onClick={() => handleDeleteEnquiry(e.id)} style={{ color: 'var(--danger)' }}><Trash2 size={16}/></button>
                            </td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== APPLICATION ========================
function ApplicationTab() {
    const [step, setStep] = useState(0);
    const steps = ['Student Info', 'Parent Details', 'Address', 'Previous Academic', 'Admission Details'];
    const [form, setForm] = useState({
        fullName: '', dob: '', gender: '', bloodGroup: '', religion: '', category: 'General', nationality: 'Indian',
        fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '', primaryContact: '', email: '', annualIncome: '',
        permanentAddress: '', city: '', state: '', pinCode: '', sameAddress: true,
        prevSchool: '', lastClass: '', marks: '', tcNumber: '', medium: '',
        applyingClass: '', sectionPref: '', admissionDate: new Date().toISOString().split('T')[0],
    });
    const u = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

    return (
        <div className="animate-fade-in">
            <div className="adm-steps">
                {steps.map((s, i) => (
                    <div key={i} className={`adm-step ${i === step ? 'active' : i < step ? 'completed' : ''}`} onClick={() => setStep(i)}>
                        {i < step ? <CheckCircle2 size={14} style={{ marginRight: 4 }}/> : null}{s}
                    </div>
                ))}
            </div>

            <div className="adm-form-panel" style={{ flex: 'none', width: '100%', maxWidth: 800, margin: '0 auto' }}>
                {step === 0 && (<>
                    <h3><User size={18}/> Section A: Student Information</h3>
                    <div className="adm-form">
                        <div className="form-group"><label className="form-label">Full Name <span className="required">*</span></label><input type="text" className="form-input" value={form.fullName} onChange={e => u('fullName', e.target.value)} /></div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Date of Birth <span className="required">*</span></label><input type="date" className="form-input" value={form.dob} onChange={e => u('dob', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Gender <span className="required">*</span></label><select className="form-select" value={form.gender} onChange={e => u('gender', e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Blood Group</label><select className="form-select" value={form.bloodGroup} onChange={e => u('bloodGroup', e.target.value)}><option value="">Select</option>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e => u('category', e.target.value)}><option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>Other</option></select></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Religion</label><input type="text" className="form-input" value={form.religion} onChange={e => u('religion', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Nationality</label><input type="text" className="form-input" value={form.nationality} onChange={e => u('nationality', e.target.value)} /></div>
                        </div>
                    </div>
                </>)}

                {step === 1 && (<>
                    <h3><Users size={18}/> Section B: Parent / Guardian Details</h3>
                    <div className="adm-form">
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Father's Name <span className="required">*</span></label><input type="text" className="form-input" value={form.fatherName} onChange={e => u('fatherName', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Father's Occupation</label><input type="text" className="form-input" value={form.fatherOccupation} onChange={e => u('fatherOccupation', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Mother's Name <span className="required">*</span></label><input type="text" className="form-input" value={form.motherName} onChange={e => u('motherName', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Mother's Occupation</label><input type="text" className="form-input" value={form.motherOccupation} onChange={e => u('motherOccupation', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Primary Contact <span className="required">*</span></label><PhoneInput value={form.primaryContact} onChange={e => u('primaryContact', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Email <span className="required">*</span></label><input type="email" className="form-input" value={form.email} onChange={e => u('email', e.target.value)} /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Annual Income</label><input type="text" className="form-input" value={form.annualIncome} onChange={e => u('annualIncome', e.target.value)} /></div>
                    </div>
                </>)}

                {step === 2 && (<>
                    <h3><MapPin size={18}/> Section C: Address Information</h3>
                    <div className="adm-form">
                        <div className="form-group"><label className="form-label">Permanent Address</label><textarea className="form-input" rows="2" value={form.permanentAddress} onChange={e => u('permanentAddress', e.target.value)} style={{ resize: 'vertical' }}></textarea></div>
                        <div className="form-row-3">
                            <div className="form-group"><label className="form-label">City</label><input type="text" className="form-input" value={form.city} onChange={e => u('city', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">State</label><input type="text" className="form-input" value={form.state} onChange={e => u('state', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">PIN Code</label><input type="text" className="form-input" value={form.pinCode} onChange={e => u('pinCode', e.target.value)} /></div>
                        </div>
                        <div className="form-group" style={{ marginTop: 12 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
                                <input type="checkbox" checked={form.sameAddress} onChange={e => u('sameAddress', e.target.checked)} style={{ accentColor: 'var(--accent)' }}/> Current address same as permanent
                            </label>
                        </div>
                    </div>
                </>)}

                {step === 3 && (<>
                    <h3><GraduationCap size={18}/> Section D: Previous Academic Details</h3>
                    <div className="adm-form">
                        <div className="form-group"><label className="form-label">Previous School Name</label><input type="text" className="form-input" value={form.prevSchool} onChange={e => u('prevSchool', e.target.value)} /></div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Last Class Attended</label><input type="text" className="form-input" value={form.lastClass} onChange={e => u('lastClass', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Marks / Grade</label><input type="text" className="form-input" value={form.marks} onChange={e => u('marks', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">TC Number</label><input type="text" className="form-input" value={form.tcNumber} onChange={e => u('tcNumber', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Medium of Instruction</label><input type="text" className="form-input" value={form.medium} onChange={e => u('medium', e.target.value)} /></div>
                        </div>
                    </div>
                </>)}

                {step === 4 && (<>
                    <h3><BookOpen size={18}/> Section E: Admission Details</h3>
                    <div className="adm-form">
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Applying Class <span className="required">*</span></label>
                                <select className="form-select" value={form.applyingClass} onChange={e => u('applyingClass', e.target.value)}><option value="">Select</option><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option></select></div>
                            <div className="form-group"><label className="form-label">Section Preference</label>
                                <select className="form-select" value={form.sectionPref} onChange={e => u('sectionPref', e.target.value)}><option value="">Any</option><option>A</option><option>B</option><option>C</option></select></div>
                        </div>
                        <div className="form-group"><label className="form-label">Admission Date <span className="required">*</span></label><input type="date" className="form-input" value={form.admissionDate} onChange={e => u('admissionDate', e.target.value)} /></div>
                    </div>
                </>)}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                    <button className="btn btn-outline" disabled={step === 0} onClick={() => setStep(s => s - 1)}>← Previous</button>
                    {step < 4 ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Next →</button>
                        : <button className="btn btn-primary"><Send size={16}/> Submit Application</button>}
                </div>
            </div>
        </div>
    );
}

// ======================== DOCUMENTS ========================
function DocumentsTab() {
    const [docs, setDocs] = useLocalStorage('admission_documents', [
        { name: 'Birth Certificate', format: 'PDF / JPG / PNG', mandatory: true, status: 'Verified' },
        { name: 'Student Photograph', format: 'JPG / PNG', mandatory: true, status: 'Uploaded' },
        { name: 'ID Proof (Parent)', format: 'PDF / JPG', mandatory: true, status: 'Pending' },
        { name: 'Transfer Certificate', format: 'PDF / JPG', mandatory: false, status: 'Not Uploaded' },
        { name: 'Address Proof', format: 'PDF / JPG', mandatory: false, status: 'Not Uploaded' },
        { name: 'Previous Marksheet', format: 'PDF / JPG', mandatory: false, status: 'Uploaded' },
        { name: 'Caste Certificate', format: 'PDF / JPG', mandatory: false, status: 'Not Uploaded' },
    ]);
    const statusBadge = (s) => s === 'Verified' ? 'badge-success' : s === 'Uploaded' ? 'badge-info' : s === 'Pending' ? 'badge-warning' : 'badge-draft';
    const handleUpload = (idx) => { const input = document.createElement('input'); input.type='file'; input.accept='.pdf,.jpg,.jpeg,.png'; input.onchange = async () => { if(input.files[0]) { setDocs(prev => prev.map((d,i) => i===idx ? {...d, status:'Uploaded'} : d)); await customAlert(`"${docs[idx].name}" uploaded successfully!`); } }; input.click(); };
    const handleVerify = async (idx) => { setDocs(prev => prev.map((d,i) => i===idx ? {...d, status:'Verified'} : d)); await customAlert(`"${docs[idx].name}" has been verified.`); };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}>Document Upload & Verification</h3>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Document</th><th>Format</th><th>Required</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{docs.map((d, i) => (
                        <tr key={i}><td className="fw-600">{d.name}</td><td style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{d.format}</td>
                            <td>{d.mandatory ? <span className="badge badge-danger">Mandatory</span> : <span className="badge badge-draft">Optional</span>}</td>
                            <td><span className={`badge ${statusBadge(d.status)}`}>{d.status}</span></td>
                            <td><button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleUpload(i)}><Upload size={14}/> Upload</button>
                                {d.status === 'Uploaded' && <button className="btn-icon" title="Verify" style={{ color: 'var(--success)' }} onClick={() => handleVerify(i)}><CheckCircle2 size={16}/></button>}
                            </td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== REVIEW ========================
function ReviewTab() {
    const [applications, setApplications] = useLocalStorage('admission_applications', [
        { id: 1, name: 'Rahul Kumar', class: 'Grade 1', date: '2026-03-20', status: 'Submitted', docs: '3/3' },
        { id: 2, name: 'Priya Singh', class: 'Grade 3', date: '2026-03-18', status: 'Under Review', docs: '5/5' },
        { id: 3, name: 'Arjun Patel', class: 'Grade 2', date: '2026-03-15', status: 'Approved', docs: '4/5' },
        { id: 4, name: 'Sneha Reddy', class: 'Grade 1', date: '2026-03-12', status: 'Rejected', docs: '2/3' },
    ]);
    const statusBadge = (s) => s === 'Submitted' ? 'badge-info' : s === 'Under Review' ? 'badge-warning' : s === 'Approved' ? 'badge-success' : 'badge-danger';
    const handleView = async (a) => await customAlert(`Application Details\n\nStudent: ${a.name}\nClass: ${a.class}\nApplied: ${a.date}\nDocuments: ${a.docs}\nStatus: ${a.status}`);
    const handleApprove = async (id) => { if(await customConfirm('Approve this application?')) setApplications(prev => prev.map(a => a.id===id ? {...a, status:'Approved'} : a)); };
    const handleReject = async (id) => { if(await customConfirm('Reject this application?')) setApplications(prev => prev.map(a => a.id===id ? {...a, status:'Rejected'} : a)); };

    return (
        <div className="animate-fade-in">
            <div className="adm-stats-row">
                {[{ label: 'Total Applications', value: applications.length, color: 'var(--info)', bg: 'var(--info-light)', icon: FileText },
                  { label: 'Pending Review', value: applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length, color: 'var(--warning)', bg: 'var(--warning-light)', icon: Clock },
                  { label: 'Approved', value: applications.filter(a => a.status === 'Approved').length, color: 'var(--success)', bg: 'var(--success-light)', icon: CheckCircle2 },
                  { label: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length, color: 'var(--danger)', bg: 'var(--danger-light)', icon: XCircle },
                ].map((s, i) => { const I = s.icon; return <div className="adm-stat-card" key={i}><div className="adm-stat-icon" style={{ background: s.bg }}><I size={24} style={{ color: s.color }}/></div><div className="adm-stat-info"><h4>{s.value}</h4><p>{s.label}</p></div></div>; })}
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Student</th><th>Class</th><th>Applied Date</th><th>Documents</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{applications.map(a => (
                        <tr key={a.id}><td className="fw-600">{a.name}</td><td>{a.class}</td><td>{a.date}</td><td>{a.docs}</td>
                            <td><span className={`badge ${statusBadge(a.status)}`}>{a.status}</span></td>
                            <td style={{ display: 'flex', gap: 2 }}>
                                <button className="btn-icon" title="View" onClick={() => handleView(a)}><Eye size={16}/></button>
                                {(a.status === 'Submitted' || a.status === 'Under Review') && <>
                                    <button className="btn-icon" title="Approve" style={{ color: 'var(--success)' }} onClick={() => handleApprove(a.id)}><CheckCircle2 size={16}/></button>
                                    <button className="btn-icon" title="Reject" style={{ color: 'var(--danger)' }} onClick={() => handleReject(a.id)}><XCircle size={16}/></button>
                                </>}
                            </td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== FEES ========================
function FeesTab() {
    const [feeRecords, setFeeRecords] = useLocalStorage('admission_fee_records', [
        { id: 1, name: 'Arjun Patel', class: 'Grade 2-A', admissionFee: 5000, tuitionFee: 25000, transportFee: 8000, total: 38000, paid: 38000, status: 'Paid' },
        { id: 2, name: 'Rahul Kumar', class: 'Grade 1-A', admissionFee: 5000, tuitionFee: 22000, transportFee: 0, total: 27000, paid: 5000, status: 'Partial' },
    ]);
    const handleRecordPayment = async (f) => { const bal = f.total - f.paid; if(bal <= 0) return await customAlert('No balance due.'); if(await customConfirm(`Record full payment of ₹${bal.toLocaleString()} for ${f.name}?`)) setFeeRecords(prev => prev.map(r => r.id === f.id ? {...r, paid: r.total, status: 'Paid'} : r)); };
    const handleDownloadReceipt = (f) => { const txt = `MOUNT ZION SCHOOL\nFEE RECEIPT\n${'='.repeat(40)}\nStudent: ${f.name}\nClass: ${f.class}\nAdmission Fee: ₹${f.admissionFee}\nTuition Fee: ₹${f.tuitionFee}\nTransport Fee: ₹${f.transportFee}\nTotal: ₹${f.total}\nPaid: ₹${f.paid}\nBalance: ₹${f.total - f.paid}\nStatus: ${f.status}\nDate: ${new Date().toLocaleDateString('en-IN')}\n${'='.repeat(40)}`; const blob = new Blob([txt],{type:'text/plain'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Receipt_${f.name.replace(/\s/g,'_')}.txt`; a.click(); };

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}>Fee Assignment & Payment</h3>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Student</th><th>Class</th><th>Admission Fee</th><th>Tuition Fee</th><th>Transport</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{feeRecords.map(f => (
                        <tr key={f.id}><td className="fw-600">{f.name}</td><td>{f.class}</td>
                            <td>₹{f.admissionFee.toLocaleString()}</td><td>₹{f.tuitionFee.toLocaleString()}</td>
                            <td>₹{f.transportFee.toLocaleString()}</td><td className="fw-600">₹{f.total.toLocaleString()}</td>
                            <td>₹{f.paid.toLocaleString()}</td><td style={{ color: f.total - f.paid > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>₹{(f.total - f.paid).toLocaleString()}</td>
                            <td><span className={`badge ${f.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{f.status}</span></td>
                            <td><button className="btn-icon" title="Record Payment" onClick={() => handleRecordPayment(f)}><CreditCard size={16}/></button><button className="btn-icon" title="Download Receipt" onClick={() => handleDownloadReceipt(f)}><Download size={16}/></button></td>
                        </tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== CONFIRMATION ========================
function ConfirmationTab() {
    const [confirmed] = useLocalStorage('admission_confirmed', [
        { id: 1, admNo: 'ADM-2026-0001', name: 'Arjun Patel', class: 'Grade 2-A', rollNo: 1, date: '2026-03-16', feePaid: true },
        { id: 2, admNo: 'ADM-2026-0002', name: 'Meera Joshi', class: 'Grade 1-B', rollNo: 5, date: '2026-03-11', feePaid: true },
    ]);
    const [pending] = useLocalStorage('admission_pending', [
        { id: 3, name: 'Rahul Kumar', class: 'Grade 1', status: 'Approved', feePaid: false },
    ]);

    return (
        <div className="animate-fade-in">
            <div className="adm-section-divider"><Clock size={18}/> Pending Confirmation</div>
            <div className="table-responsive" style={{ marginBottom: 28 }}>
                <table className="data-table"><thead><tr><th>Student</th><th>Class</th><th>Status</th><th>Fee Paid</th><th>Actions</th></tr></thead>
                    <tbody>{pending.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>No pending confirmations</td></tr> :
                        pending.map(p => (
                            <tr key={p.id}><td className="fw-600">{p.name}</td><td>{p.class}</td>
                                <td><span className="badge badge-info">{p.status}</span></td>
                                <td>{p.feePaid ? <span className="badge badge-success">Yes</span> : <span className="badge badge-warning">Pending</span>}</td>
                                <td><button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}><CheckCircle2 size={14}/> Confirm Admission</button></td></tr>
                        ))}</tbody></table>
            </div>

            <div className="adm-section-divider"><Award size={18}/> Confirmed Admissions</div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Admission No</th><th>Student</th><th>Class</th><th>Roll No</th><th>Confirmed Date</th><th>Actions</th></tr></thead>
                    <tbody>{confirmed.map(c => (
                        <tr key={c.id}><td className="fw-600" style={{ color: 'var(--accent)' }}>{c.admNo}</td><td className="fw-600">{c.name}</td><td>{c.class}</td><td>{c.rollNo}</td><td>{c.date}</td>
                            <td><button className="btn-icon" title="View" onClick={() => customAlert(`Admission: ${c.admNo}\nStudent: ${c.name}\nClass: ${c.class}\nRoll No: ${c.rollNo}\nConfirmed: ${c.date}`)}><Eye size={16}/></button><button className="btn-icon" title="ID Card"><IdCard size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== ID CARD ========================
function IDCardTab() {
    const [classFilter, setClassFilter] = useState('All Classes');
    const [sectionFilter, setSectionFilter] = useState('All Sections');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [bulkDownloading, setBulkDownloading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, [classFilter, sectionFilter]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await api.getStudentsByFilter(classFilter, sectionFilter);
            setStudents(data);
        } catch (err) {
            console.error("Failed to load students", err);
        } finally {
            setLoading(false);
        }
    };

    const downloadIndividualCard = async (student) => {
        setDownloadingId(student.id);
        try {
            const cardElement = document.getElementById(`idcard-${student.id}`);
            if (!cardElement) return;

            // Temporarily hide actions for screenshot
            const actionsEl = cardElement.querySelector('.idcard-actions');
            if (actionsEl) actionsEl.style.display = 'none';

            const canvas = await html2canvas(cardElement, { scale: 2, useCORS: true });
            
            if (actionsEl) actionsEl.style.display = 'flex'; // Restore

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${student.firstName}_${student.lastName}_IDCard.pdf`);
        } catch (error) {
            console.error("Error generating ID card PDF", error);
            await customAlert("Failed to generate ID card.");
        } finally {
            setDownloadingId(null);
        }
    };

    const downloadBulkZip = async () => {
        if (students.length === 0) {
            await customAlert("No students to download.");
            return;
        }
        if (classFilter === 'All Classes' || sectionFilter === 'All Sections') {
            await customAlert("Please select a specific Class and Section for bulk ZIP download.");
            return;
        }

        setBulkDownloading(true);
        try {
            const zip = new JSZip();

            for (const student of students) {
                const cardElement = document.getElementById(`idcard-${student.id}`);
                if (!cardElement) continue;

                const actionsEl = cardElement.querySelector('.idcard-actions');
                if (actionsEl) actionsEl.style.display = 'none';

                const canvas = await html2canvas(cardElement, { scale: 2, useCORS: true });
                
                if (actionsEl) actionsEl.style.display = 'flex';

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                
                // Get PDF as ArrayBuffer to add to ZIP
                const pdfBlob = pdf.output('blob');
                zip.file(`${student.firstName}_${student.lastName}_${student.admissionNo}.pdf`, pdfBlob);
            }

            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `IDCards_Class_${classFilter}_Sec_${sectionFilter}.zip`;
            link.click();
            window.URL.revokeObjectURL(url);
            
            // To match reference site behavior, show a toast or alert
            // Here we use a standard alert for simplicity, but a toast would be better if one exists in the project
            // alert(`ZIP downloaded for Class ${classFilter} - Section ${sectionFilter}`);
            
        } catch (error) {
            console.error("Error generating ZIP", error);
            await customAlert("Failed to generate bulk ZIP.");
        } finally {
            setBulkDownloading(false);
        }
    };

    return (
        <div className="animate-fade-in idcard-tab-container">
            <div className="filters-bar" style={{ marginBottom: 24, padding: '16px 20px', background: 'var(--card-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div className="filter-dropdowns" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Filter size={18} style={{ color: 'var(--text-light)' }}/>
                    <select className="filter-select" value={classFilter} onChange={e => setClassFilter(e.target.value)} style={{ minWidth: 150 }}>
                        <option value="All Classes">All Classes</option>
                        {['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(c => (
                            <option key={c} value={c}>Class {c}</option>
                        ))}
                    </select>
                    <select className="filter-select" value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} style={{ minWidth: 150 }}>
                        <option value="All Sections">All Sections</option>
                        {['A', 'B', 'C', 'D'].map(s => (
                            <option key={s} value={s}>Section {s}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button 
                        className="btn btn-primary" 
                        onClick={downloadBulkZip}
                        disabled={bulkDownloading || students.length === 0}
                    >
                        {bulkDownloading ? <Clock size={16} className="spin-icon"/> : <Download size={16}/>} 
                        {bulkDownloading ? 'Generating ZIP...' : 'Download ZIP'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-light)' }}>Loading students...</div>
            ) : students.length === 0 ? (
                <div className="adm-empty">
                    <Users size={48}/>
                    <p style={{ marginTop: 16 }}>No students found for the selected class and section.</p>
                </div>
            ) : (
                <div className="idcard-grid">
                    {students.map(student => (
                        <div className="idcard-student-card" id={`idcard-${student.id}`} key={student.id}>
                            <div className="idcard-header-bar"></div>
                            
                            <div className="idcard-avatar" style={{ background: getAvatarColor(student.firstName + student.lastName) }}>
                                {student.photoUrl ? (
                                    <img src={student.photoUrl} alt="Profile" />
                                ) : (
                                    getInitials(student.firstName, student.lastName)
                                )}
                            </div>
                            
                            <div className="idcard-name">
                                {student.firstName} {student.lastName}
                            </div>
                            
                            <div className="idcard-info">
                                <div><span className="idcard-label">Admn No:</span> <span className="idcard-value">{student.admissionNo}</span></div>
                                <div><span className="idcard-label">D.O.B:</span> <span className="idcard-value">{formatDate(student.dateOfBirth)}</span></div>
                                <div><span className="idcard-label">Contact:</span> <span className="idcard-value">{student.contactNo}</span></div>
                            </div>
                            
                            <div className="idcard-badges">
                                <span className="badge-class">{student.class}</span>
                                <span className="badge-section">Section {student.section}</span>
                            </div>
                            
                            <div className="idcard-actions" data-html2canvas-ignore="true">
                                <button className="idcard-action-btn edit-btn" title="Edit Student">
                                    <Edit3 size={16} />
                                </button>
                                <button 
                                    className="idcard-action-btn download-btn" 
                                    title="Download ID Card"
                                    onClick={() => downloadIndividualCard(student)}
                                    disabled={downloadingId === student.id}
                                >
                                    {downloadingId === student.id ? <Clock size={16}/> : <Download size={16} />}
                                </button>
                                <button className="idcard-action-btn delete-btn" title="Delete record">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ======================== REPORTS ========================
function ReportsTab() {
    const reports = [
        { name: 'Total Admissions', desc: 'Count of confirmed admissions by session', formats: 'PDF, Excel' },
        { name: 'Class-wise Distribution', desc: 'Students admitted per class/section', formats: 'PDF, Excel' },
        { name: 'Capacity Usage', desc: 'Section-wise filled vs available seats', formats: 'PDF, Chart' },
        { name: 'Enquiry Report', desc: 'Total enquiries, status breakdown, source', formats: 'PDF, Excel' },
        { name: 'Conversion Report', desc: 'Enquiry-to-admission conversion rate', formats: 'PDF, Chart' },
        { name: 'Admission Fee Report', desc: 'Fees collected, pending, waived', formats: 'PDF, Excel' },
        { name: 'Pending Applications', desc: 'Applications pending review/approval', formats: 'PDF, Excel' },
        { name: 'Rejected Applications', desc: 'List with rejection reasons', formats: 'PDF, Excel' },
    ];

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}>Admission Reports</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {reports.map((r, i) => (
                    <div key={i} className="card" style={{ padding: 20 }}>
                        <h4 style={{ fontSize: '0.95rem', marginBottom: 6 }}>{r.name}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: 12 }}>{r.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.formats}</span>
                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><FileText size={14}/> Generate</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ======================== SETTINGS ========================
function SettingsTab() {
    const settings = [
        { label: 'Admission No. Format', value: 'ADM-YYYY-NNN' }, { label: 'Approval Workflow', value: 'Manual' },
        { label: 'Age Eligibility', value: 'Configurable' }, { label: 'Required Documents', value: 'Birth Cert, Photo' },
        { label: 'Duplicate Check', value: 'Enabled' }, { label: 'Portal Notifications', value: 'Disabled' },
        { label: 'Custom Fields', value: 'None' }, { label: 'ID Card Template', value: 'Default' },
    ];
    const rbac = [
        ['Session / Class Setup', 'Yes', 'Yes', 'No', 'No'], ['Configure Rules', 'Yes', 'Yes', 'No', 'No'],
        ['Create Enquiry', 'Yes', 'Yes', 'Yes', 'No'], ['Manage Follow-ups', 'Yes', 'Yes', 'Yes', 'No'],
        ['Fill Application Form', 'Yes', 'Yes', 'Yes', 'No'], ['Upload Documents', 'Yes', 'Yes', 'Yes', 'No'],
        ['Approve / Reject', 'Yes', 'Yes', 'No', 'No'], ['Assign Fees', 'Yes', 'Yes', 'No', 'Yes'],
        ['Process Payment', 'Yes', 'Yes', 'No', 'Yes'], ['Confirm Admission', 'Yes', 'Yes', 'No', 'No'],
        ['Generate ID Card', 'Yes', 'Yes', 'Yes', 'No'], ['View Reports', 'Yes', 'Yes', 'Limited', 'Fee only'],
        ['Module Settings', 'Yes', 'Yes', 'No', 'No'],
    ];

    return (
        <div className="animate-fade-in adm-settings-grid">
            <div className="adm-settings-panel">
                <h3><Settings size={18}/> Module Configuration</h3>
                {settings.map((s, i) => <div className="adm-setting-item" key={i}><label>{s.label}</label><span className="setting-value">{s.value}</span></div>)}
            </div>
            <div className="adm-settings-panel">
                <h3><Users size={18}/> Role-Based Access Matrix</h3>
                <table className="adm-rbac-table"><thead><tr><th>Feature</th><th>Super Admin</th><th>Admin</th><th>Staff</th><th>Accountant</th></tr></thead>
                    <tbody>{rbac.map((r, i) => (
                        <tr key={i}>{r.map((c, j) => <td key={j} style={j > 0 ? { color: c === 'Yes' ? 'var(--success)' : c === 'No' ? 'var(--danger)' : 'var(--warning)', fontWeight: 600 } : undefined}>{c}</td>)}</tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== MAIN ========================
const TABS = [
    { id: 'enquiry', label: 'Enquiries', icon: UserPlus },
    { id: 'apply', label: 'Application', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'review', label: 'Review', icon: ClipboardCheck },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'confirm', label: 'Confirmation', icon: Award },
    { id: 'id-card', label: 'ID Card', icon: IdCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Admission() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'enquiry');
    const handleNavigate = (tab) => { setActiveTab(tab); setSearchParams({ tab }); };
    useEffect(() => { if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl); }, [tabFromUrl]);

    return (
        <div className="admission-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb"><Link to="/">Dashboard</Link><span className="separator">/</span><span>Admission</span>
                    {activeTab !== 'enquiry' && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{TABS.find(t => t.id === activeTab)?.label}</span></>}</div>
                <h1>Admission Management</h1>
            </div></div>
            <div className="card admission-card">
                <div className="tabs-header">{TABS.map(tab => { const Icon = tab.icon; return <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>; })}</div>
                <div className="tabs-content">
                    {activeTab === 'enquiry' && <EnquiryTab/>}
                    {activeTab === 'apply' && <ApplicationTab/>}
                    {activeTab === 'documents' && <DocumentsTab/>}
                    {activeTab === 'review' && <ReviewTab/>}
                    {activeTab === 'fees' && <FeesTab/>}
                    {activeTab === 'confirm' && <ConfirmationTab/>}
                    {activeTab === 'id-card' && <IDCardTab/>}
                    {activeTab === 'reports' && <ReportsTab/>}
                    {activeTab === 'settings' && <SettingsTab/>}
                </div>
            </div>
        </div>
    );
}
