import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Eye, Check, X, Clock, Save, RotateCcw, BarChart2, Calendar } from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import './Attendance.css';

const API = '/api';

export default function Attendance() {
    const [activeTab, setActiveTab] = useState('mark');
    const [formData, setFormData] = useState({ class: '', section: '', period: 'Period 1', date: new Date().toISOString().split('T')[0] });
    const [showListing, setShowListing] = useState(false);
    const [students, setStudents] = useState([]);
    const [saving, setSaving] = useState(false);
    const [reportData, setReportData] = useState([]);

    const handleView = async (e) => {
        e.preventDefault();
        if (!formData.class || !formData.section) return await customAlert('Select class and section');
        try {
            // Load students
            const res = await fetch(`${API}/attendance/students?class=${encodeURIComponent(formData.class)}&section=${formData.section}`);
            const list = await res.json();
            // Check if attendance exists for this date
            const attRes = await fetch(`${API}/attendance?date=${formData.date}&class=${encodeURIComponent(formData.class)}&section=${formData.section}`);
            const existing = await attRes.json();
            if (existing.length > 0 && existing[0].entries) {
                const entryMap = {};
                existing[0].entries.forEach(e => { entryMap[e.studentId] = e.status; });
                setStudents(list.map(s => ({ ...s, status: entryMap[s.studentId] || 'Unmarked' })));
            } else {
                setStudents(list.map(s => ({ ...s, status: 'Unmarked' })));
            }
            setShowListing(true);
        } catch (err) {
            console.error(err);
            await customAlert('Failed to load students. Check backend.');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const entries = students.map(s => ({ studentId: s.studentId, studentName: s.studentName, admissionNo: s.admissionNo, status: s.status }));
            await fetch(`${API}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: formData.date, class: formData.class, section: formData.section, period: formData.period, entries })
            });
            await customAlert('Attendance saved!');
        } catch (err) { await customAlert('Failed to save'); }
        finally { setSaving(false); }
    };

    const updateStatus = (id, newStatus) => setStudents(students.map(s => s.studentId === id ? { ...s, status: newStatus } : s));
    const markAllPresent = () => setStudents(students.map(s => ({ ...s, status: 'Present' })));
    const resetAttendance = () => setStudents(students.map(s => ({ ...s, status: 'Unmarked' })));

    const total = students.length;
    const present = students.filter(s => s.status === 'Present').length;
    const absent = students.filter(s => s.status === 'Absent').length;
    const late = students.filter(s => s.status === 'Late').length;
    const leave = students.filter(s => s.status === 'Leave').length;
    const unmarked = students.filter(s => s.status === 'Unmarked').length;

    // Report form
    const [reportForm, setReportForm] = useState({ class: '', section: '', month: String(new Date().getMonth()+1), year: String(new Date().getFullYear()) });
    const handleReport = async () => {
        try {
            const res = await fetch(`${API}/attendance/report/monthly?class=${encodeURIComponent(reportForm.class)}&section=${reportForm.section}&month=${reportForm.month}&year=${reportForm.year}`);
            setReportData(await res.json());
        } catch { await customAlert('Failed to load report'); }
    };

    return (
        <div className="attendance-page animate-fade-in">
            <div className="attendance-container">
                <div className="attendance-tabs">
                    <button className={`tab-btn ${activeTab==='mark'?'active':''}`} onClick={()=>setActiveTab('mark')}><Edit2 size={16}/>Mark Attendance</button>
                    <button className={`tab-btn ${activeTab==='daily'?'active':''}`} onClick={()=>setActiveTab('daily')}><Calendar size={16}/>Daily Report</button>
                    <button className={`tab-btn ${activeTab==='monthly'?'active':''}`} onClick={()=>setActiveTab('monthly')}><BarChart2 size={16}/>Monthly Report</button>
                </div>

                {activeTab === 'mark' && (
                    <>
                        <div className="attendance-card">
                            <form onSubmit={handleView}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Class</label>
                                        <select className="form-select" value={formData.class} onChange={e=>setFormData({...formData,class:e.target.value})}>
                                            <option value="">Select Class</option>
                                            {['Nursery','LKG','UKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'].map(c=><option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Section</label>
                                        <select className="form-select" value={formData.section} onChange={e=>setFormData({...formData,section:e.target.value})}>
                                            <option value="">Select Section</option>
                                            {['A','B','C','D'].map(s=><option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Period</label>
                                        <select className="form-select" value={formData.period} onChange={e=>setFormData({...formData,period:e.target.value})}>
                                            {[...Array(8)].map((_,i)=><option key={i} value={`Period ${i+1}`}>Period {i+1}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row date-row">
                                    <div className="form-group">
                                        <label className="form-label">Date</label>
                                        <input type="date" className="form-input" value={formData.date} onChange={e=>setFormData({...formData,date:e.target.value})} />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary view-btn"><Eye size={18}/> View</button>
                                </div>
                            </form>
                        </div>

                        {showListing && (
                            <div className="attendance-listing animate-fade-in" style={{marginTop:24}}>
                                <div className="summary-cards">
                                    <div className="summary-card sum-total"><div className="sum-count">{total}</div><div className="sum-label">Total</div></div>
                                    <div className="summary-card sum-present"><div className="sum-count">{present}</div><div className="sum-label">Present</div></div>
                                    <div className="summary-card sum-absent"><div className="sum-count">{absent}</div><div className="sum-label">Absent</div></div>
                                    <div className="summary-card sum-late"><div className="sum-count">{late}</div><div className="sum-label">Late</div></div>
                                    <div className="summary-card sum-leave"><div className="sum-count">{leave}</div><div className="sum-label">Leave</div></div>
                                    <div className="summary-card sum-unmarked"><div className="sum-count">{unmarked}</div><div className="sum-label">Unmarked</div></div>
                                </div>

                                <div className="attendance-table-card card" style={{marginTop:24}}>
                                    <div className="table-header-custom" style={{padding:'20px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--border-light)'}}>
                                        <div>
                                            <h3 style={{margin:0,color:'var(--text-dark)'}}>Class {formData.class} — Section {formData.section}</h3>
                                            <span style={{fontSize:'0.85rem',color:'var(--text-grey)'}}>{formData.period} • {new Date(formData.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                                        </div>
                                        <div style={{display:'flex',gap:12}}>
                                            <button className="btn btn-outline btn-sm action-btn" onClick={markAllPresent}><Check size={16}/> Mark All Present</button>
                                            <button className="btn btn-outline btn-sm action-btn" onClick={resetAttendance}><RotateCcw size={16}/> Reset</button>
                                        </div>
                                    </div>
                                    <div className="table-wrapper">
                                        <table className="data-table">
                                            <thead><tr><th>Roll No</th><th>Student Name</th><th>Admission No</th><th>Status</th><th style={{textAlign:'center'}}>Actions</th></tr></thead>
                                            <tbody>
                                                {students.map((student,idx)=>(
                                                    <tr key={student.studentId}>
                                                        <td className="td-bold">{student.rollNo || idx+1}</td>
                                                        <td className="td-bold">{student.studentName}</td>
                                                        <td>{student.admissionNo}</td>
                                                        <td><span className={`status-pill pill-${student.status.toLowerCase()}`}>{student.status}</span></td>
                                                        <td>
                                                            <div className="attendance-action-group">
                                                                <button className={`att-btn btn-present ${student.status==='Present'?'active':''}`} onClick={()=>updateStatus(student.studentId,'Present')} title="Present"><Check size={14}/> P</button>
                                                                <button className={`att-btn btn-absent ${student.status==='Absent'?'active':''}`} onClick={()=>updateStatus(student.studentId,'Absent')} title="Absent"><X size={14}/> A</button>
                                                                <button className={`att-btn btn-late ${student.status==='Late'?'active':''}`} onClick={()=>updateStatus(student.studentId,'Late')} title="Late"><Clock size={14}/> L</button>
                                                                <button className={`att-btn btn-leave ${student.status==='Leave'?'active':''}`} onClick={()=>updateStatus(student.studentId,'Leave')} title="Leave">Lv</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {students.length===0 && <tr><td colSpan="5" style={{textAlign:'center',padding:30,color:'var(--text-light)'}}>No students found for this class/section. Add students first.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {students.length>0 && (
                                    <div style={{display:'flex',justifyContent:'flex-end',marginTop:24}}>
                                        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{display:'flex',alignItems:'center',gap:8,padding:'12px 24px'}}>
                                            <Save size={18}/> {saving?'Saving...':'Save Attendance'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'daily' && (
                    <div className="card" style={{padding:30,marginTop:20}}>
                        <h3>Daily Attendance Report</h3>
                        <p style={{color:'var(--text-light)',marginTop:8}}>Select class, section, and date in the Mark Attendance tab to view daily report.</p>
                        {showListing && students.length > 0 && (
                            <div style={{marginTop:20}}>
                                <div className="summary-cards">
                                    <div className="summary-card sum-total"><div className="sum-count">{total}</div><div className="sum-label">Total</div></div>
                                    <div className="summary-card sum-present"><div className="sum-count">{present}</div><div className="sum-label">Present</div></div>
                                    <div className="summary-card sum-absent"><div className="sum-count">{absent}</div><div className="sum-label">Absent</div></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'monthly' && (
                    <div className="card" style={{padding:30,marginTop:20}}>
                        <h3>Monthly Attendance Report</h3>
                        <div className="form-row" style={{marginTop:16}}>
                            <div className="form-group">
                                <label className="form-label">Class</label>
                                <select className="form-select" value={reportForm.class} onChange={e=>setReportForm({...reportForm,class:e.target.value})}>
                                    <option value="">Select</option>
                                    {['Nursery','LKG','UKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'].map(c=><option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section</label>
                                <select className="form-select" value={reportForm.section} onChange={e=>setReportForm({...reportForm,section:e.target.value})}>
                                    <option value="">Select</option>
                                    {['A','B','C','D'].map(s=><option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Month</label>
                                <select className="form-select" value={reportForm.month} onChange={e=>setReportForm({...reportForm,month:e.target.value})}>
                                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m,i)=><option key={i} value={i+1}>{m}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{alignSelf:'flex-end'}}>
                                <button className="btn btn-primary" onClick={handleReport}>Generate</button>
                            </div>
                        </div>
                        {reportData.length > 0 && (
                            <div className="table-responsive" style={{marginTop:20}}>
                                <table className="data-table">
                                    <thead><tr><th>Date</th><th>Total</th><th>Present</th><th>Absent</th><th>Late</th><th>Leave</th></tr></thead>
                                    <tbody>
                                        {reportData.map(r=>{
                                            const p=r.entries.filter(e=>e.status==='Present').length;
                                            const a=r.entries.filter(e=>e.status==='Absent').length;
                                            const l=r.entries.filter(e=>e.status==='Late').length;
                                            const lv=r.entries.filter(e=>e.status==='Leave').length;
                                            return(
                                                <tr key={r._id}>
                                                    <td>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                                                    <td>{r.entries.length}</td>
                                                    <td style={{color:'var(--success)'}}>{p}</td>
                                                    <td style={{color:'var(--danger)'}}>{a}</td>
                                                    <td style={{color:'var(--warning)'}}>{l}</td>
                                                    <td>{lv}</td>
                                                </tr>);
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
