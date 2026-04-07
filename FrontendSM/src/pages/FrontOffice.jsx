import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Users, PhoneCall, BookOpen, Send, AlertTriangle, Save, Plus,
    LayoutDashboard, Package, CalendarClock, FileText, BarChart3,
    LogIn, LogOut, CheckCircle, Clock, Eye, Edit, X, Search,
    ArrowRight, Phone, HelpCircle, Trash2, Printer
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { customAlert, customConfirm } from '../utils/dialogs';
import PhoneInput from '../components/PhoneInput';
import './FrontOffice.css';

const API = '/api/frontoffice';

/* ─── tiny helpers ─── */
const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtTime = d => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';
const Badge = ({ text, variant = 'info' }) => <span className={`badge badge-${variant}`}>{text}</span>;
const statusColor = s => ({ 'Checked In':'warning','Pending':'warning','Scheduled':'info','New':'info','Assigned':'info',
    'In Progress':'warning','Completed':'success','Resolved':'success','Closed':'success','Checked Out':'success',
    'Logged':'info','Pending Follow-up':'warning','Overdue':'danger','Cancelled':'danger','No Show':'danger',
    'Converted':'success','Escalated':'danger','Confirmed':'success','Dispatched':'info','Received':'warning','Delivered':'success',
}[s] || 'info');

export default function FrontOffice() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'dashboard';
    const [activeTab, setActiveTab] = useState(tabFromUrl);

    useEffect(() => { setActiveTab(searchParams.get('tab') || 'dashboard'); }, [searchParams]);
    const switchTab = t => { setSearchParams({ tab: t }); setActiveTab(t); };

    return (
        <div className="frontoffice-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link><span className="separator">/</span><span>Front Office</span>
                    </div>
                    <h1>Front Office Management</h1>
                </div>
            </div>

            <div className="fo-tabs" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {[
                    ['dashboard','Dashboard',LayoutDashboard],['visitors','Visitors',Users],['calls','Call Logs',Phone],
                    ['enquiries','Enquiries',HelpCircle],['complaints','Complaints',AlertTriangle],['postal','Postal',Package],
                    ['appointments','Appointments',CalendarClock],['documents','Documents',FileText],['reports','Reports',BarChart3],
                ].map(([key,label,Icon])=>(
                    <button key={key} className={`tab-btn ${activeTab===key?'active':''}`} onClick={()=>switchTab(key)}>
                        <Icon size={16}/> {label}
                    </button>
                ))}
            </div>

            <div className="fo-content">
                {activeTab === 'dashboard' && <FODashboard switchTab={switchTab} />}
                {activeTab === 'visitors' && <VisitorTab />}
                {activeTab === 'calls' && <CallLogTab />}
                {activeTab === 'enquiries' && <EnquiryTab />}
                {activeTab === 'complaints' && <ComplaintTab />}
                {activeTab === 'postal' && <PostalTab />}
                {activeTab === 'appointments' && <AppointmentTab />}
                {activeTab === 'documents' && <DocumentsPlaceholder />}
                {activeTab === 'reports' && <ReportsPlaceholder />}
            </div>
        </div>
    );
}

/* ═══════════════════  DASHBOARD  ═══════════════════ */
function FODashboard({ switchTab }) {
    const [visitors] = useLocalStorage('fo_visitors', []);
    const [calls] = useLocalStorage('fo_calls', []);
    const [enquiries] = useLocalStorage('fo_enquiries', []);
    const [complaints] = useLocalStorage('fo_complaints', []);
    const [postal] = useLocalStorage('fo_postal', []);
    const [appointments] = useLocalStorage('fo_appointments', []);

    const kpi = {
        visitorsToday: visitors.filter(v => new Date(v.checkInTime).toDateString() === new Date().toDateString()).length,
        callsToday: calls.filter(c => new Date(c.createdAt).toDateString() === new Date().toDateString()).length,
        enquiriesOpen: enquiries.filter(e => e.status !== 'Closed' && e.status !== 'Converted').length,
        complaintsPending: complaints.filter(c => c.status === 'Pending' || c.status === 'Assigned').length,
        postalToday: postal.filter(p => new Date(p.date).toDateString() === new Date().toDateString()).length,
        appointmentsUpcoming: appointments.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed').length,
    };

    const cards = [
        { label: 'Visitors Today', value: kpi.visitorsToday, color: '#3b82f6' },
        { label: 'Calls Received', value: kpi.callsToday, color: '#8b5cf6' },
        { label: 'Open Enquiries', value: kpi.enquiriesOpen, color: '#f59e0b' },
        { label: 'Pending Complaints', value: kpi.complaintsPending, color: '#ef4444' },
        { label: 'Postal Items', value: kpi.postalToday, color: '#10b981' },
        { label: 'Upcoming Appts', value: kpi.appointmentsUpcoming, color: '#6366f1' },
    ];

    const actions = [
        { label: 'Add Visitor', icon: LogIn, tab: 'visitors' },
        { label: 'Log Call', icon: PhoneCall, tab: 'calls' },
        { label: 'New Enquiry', icon: HelpCircle, tab: 'enquiries' },
        { label: 'Receive Parcel', icon: Package, tab: 'postal' },
        { label: 'Register Complaint', icon: AlertTriangle, tab: 'complaints' },
        { label: 'Schedule Appt', icon: CalendarClock, tab: 'appointments' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="fo-kpi-grid">
                {cards.map((c, i) => (
                    <div key={i} className="fo-kpi-card card" style={{ borderLeft: `4px solid ${c.color}` }}>
                        <div className="fo-kpi-value" style={{ color: c.color }}>{c.value}</div>
                        <div className="fo-kpi-label">{c.label}</div>
                    </div>
                ))}
            </div>
            <h3 style={{margin:'28px 0 16px',fontSize:'1rem',fontWeight:600}}>Quick Actions</h3>
            <div className="fo-quick-actions">
                {actions.map((a, i) => (
                    <button key={i} className="fo-action-btn card" onClick={() => switchTab(a.tab)}>
                        <a.icon size={22}/>
                        <span>{a.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════  VISITORS  ═══════════════════ */
function VisitorTab() {
    const [visitors, setVisitors] = useLocalStorage('fo_visitors', []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name:'', phone:'', purpose:'Meeting', staffMeeting:'', note:'' });

    const handleSave = async e => {
        e.preventDefault();
        if (!form.name.trim() || !form.phone.trim()) return await customAlert('Name and Phone are required');
        const newVisitor = {
            ...form,
            _id: Date.now(),
            checkInTime: new Date().toISOString(),
            status: 'Checked In'
        };
        setVisitors([newVisitor, ...visitors]);
        setForm({ name:'', phone:'', purpose:'Meeting', staffMeeting:'', note:'' });
        setShowForm(false);
        await customAlert('Visitor Checked In Successfully');
    };

    const handleCheckout = async id => {
        if (!await customConfirm('Confirm Check Out?')) return;
        setVisitors(prev => prev.map(v => v._id === id ? { ...v, checkOutTime: new Date().toISOString(), status: 'Checked Out' } : v));
    };

    const handleDelete = async id => {
        if (!await customConfirm('Delete this visitor record?')) return;
        setVisitors(prev => prev.filter(v => v._id !== id));
    };

    const handleView = (v) => {
        customAlert(`
            Visitor Details
            ---------------
            Name: ${v.name}
            Phone: ${v.phone}
            Purpose: ${v.purpose}
            Meeting With: ${v.staffMeeting || 'N/A'}
            Check-In: ${fmtTime(v.checkInTime)}
            Check-Out: ${v.checkOutTime ? fmtTime(v.checkOutTime) : 'N/A'}
            Status: ${v.status}
            Note: ${v.note || 'None'}
        `);
    };

    return (
        <div className="animate-fade-in">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h3 style={{margin:0}}>Today's Visitor Log</h3>
                <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}><Plus size={16}/> Add Visitor</button>
            </div>
            {showForm && (
                <div className="card fo-form-card animate-fade-in" style={{padding:24,marginBottom:20}}>
                    <form onSubmit={handleSave}>
                        <div className="form-grid-3">
                            <div className="form-group"><label className="form-label">Visitor Name <span className="required">*</span></label>
                                <input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name"/></div>
                            <div className="form-group"><label className="form-label">Phone <span className="required">*</span></label>
                                <PhoneInput className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="10-digit mobile"/></div>
                            <div className="form-group"><label className="form-label">Purpose <span className="required">*</span></label>
                                <select className="form-select" value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})}>
                                    {['Meeting','Admission Enquiry','Delivery','Parent Visit','Interview','Other'].map(p=><option key={p}>{p}</option>)}
                                </select></div>
                            <div className="form-group"><label className="form-label">Staff to Meet</label>
                                <input className="form-input" value={form.staffMeeting} onChange={e=>setForm({...form,staffMeeting:e.target.value})} placeholder="Staff member name"/></div>
                            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">Note</label>
                                <input className="form-input" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Optional note"/></div>
                        </div>
                        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
                            <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><LogIn size={16}/> Check In</button>
                        </div>
                    </form>
                </div>
            )}
            <div className="card" style={{padding:0}}>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead><tr><th>Name</th><th>Phone</th><th>Purpose</th><th>Meeting</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {visitors.length > 0 ? visitors.map(v=>(
                                <tr key={v._id}>
                                    <td className="fw-600">{v.name}</td><td>{v.phone}</td><td>{v.purpose}</td><td>{v.staffMeeting||'—'}</td>
                                    <td>{fmtTime(v.checkInTime)}</td><td>{v.checkOutTime ? fmtTime(v.checkOutTime) : '—'}</td>
                                    <td><Badge text={v.status} variant={statusColor(v.status)}/></td>
                                    <td>
                                        <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                            <button className="btn-icon" onClick={()=>handleView(v)} title="View"><Eye size={16}/></button>
                                            {v.status==='Checked In' && <button className="btn-icon" style={{color:'var(--primary)'}} onClick={()=>handleCheckout(v._id)} title="Check Out"><LogOut size={16}/></button>}
                                            <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDelete(v._id)} title="Delete"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="8"><div className="empty-state" style={{padding:30}}><Users size={40}/><h3>No Visitors Today</h3></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════  CALL LOGS  ═══════════════════ */
function CallLogTab() {
    const [calls, setCalls] = useLocalStorage('fo_calls', []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ callType:'Incoming', callerName:'', phone:'', purpose:'General Inquiry', notes:'', followUpRequired:false, followUpDate:'', assignedTo:'' });

    const handleSave = async e => {
        e.preventDefault();
        if (!form.callerName.trim() || !form.phone.trim()) return await customAlert('Name and Phone required');
        if (form.followUpRequired && !form.followUpDate) return await customAlert('Follow-up date is required');
        
        const newCall = {
            ...form,
            _id: Date.now(),
            createdAt: new Date().toISOString(),
            status: form.followUpRequired ? 'Pending Follow-up' : 'Logged'
        };
        setCalls([newCall, ...calls]);
        setForm({ callType:'Incoming', callerName:'', phone:'', purpose:'General Inquiry', notes:'', followUpRequired:false, followUpDate:'', assignedTo:'' }); setShowForm(false);
        await customAlert('Call logged successfully');
    };

    const handleComplete = async id => {
        const notes = prompt('Enter completion notes:');
        if (notes === null) return;
        setCalls(prev => prev.map(c => c._id === id ? { ...c, status: 'Completed', completionNotes: notes } : c));
    };

    const handleDelete = async id => {
        if (!await customConfirm('Delete this call log?')) return;
        setCalls(prev => prev.filter(c => c._id !== id));
    };

    const handleView = (c) => {
        customAlert(`
            Call Log Details
            ----------------
            Type: ${c.callType}
            Name: ${c.callerName}
            Phone: ${c.phone}
            Purpose: ${c.purpose}
            Notes: ${c.notes || 'N/A'}
            Date: ${fmt(c.createdAt)} ${fmtTime(c.createdAt)}
            Follow-up: ${c.followUpDate ? fmt(c.followUpDate) : 'No'}
            Assigned: ${c.assignedTo || 'N/A'}
            Status: ${c.status}
        `);
    };

    return (
        <div className="animate-fade-in">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h3 style={{margin:0}}>Call Logs</h3>
                <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}><Plus size={16}/> Log Call</button>
            </div>
            {showForm && (
                <div className="card fo-form-card animate-fade-in" style={{padding:24,marginBottom:20}}>
                    <form onSubmit={handleSave}>
                        <div className="form-grid-3">
                            <div className="form-group"><label className="form-label">Call Type</label>
                                <select className="form-select" value={form.callType} onChange={e=>setForm({...form,callType:e.target.value})}>
                                    <option>Incoming</option><option>Outgoing</option></select></div>
                            <div className="form-group"><label className="form-label">Caller/Receiver Name <span className="required">*</span></label>
                                <input className="form-input" value={form.callerName} onChange={e=>setForm({...form,callerName:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Phone <span className="required">*</span></label>
                                <PhoneInput className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Purpose</label>
                                <select className="form-select" value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})}>
                                    {['General Inquiry','Admission','Complaint','Follow-up','Emergency','Other'].map(p=><option key={p}>{p}</option>)}
                                </select></div>
                            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">Notes</label>
                                <input className="form-input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Brief description"/></div>
                        </div>
                        <div style={{display:'flex',gap:16,alignItems:'center',marginTop:12}}>
                            <label style={{display:'flex',gap:6,alignItems:'center',cursor:'pointer',fontSize:'0.9rem'}}>
                                <input type="checkbox" checked={form.followUpRequired} onChange={e=>setForm({...form,followUpRequired:e.target.checked})}/>
                                Follow-up Required
                            </label>
                            {form.followUpRequired && <>
                                <input type="date" className="form-input" style={{width:180}} value={form.followUpDate} onChange={e=>setForm({...form,followUpDate:e.target.value})}/>
                                <input className="form-input" style={{width:180}} value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})} placeholder="Assign to..."/>
                            </>}
                        </div>
                        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
                            <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Save Call</button>
                        </div>
                    </form>
                </div>
            )}
            <div className="card" style={{padding:0}}>
                <div className="table-responsive"><table className="data-table">
                    <thead><tr><th>Type</th><th>Name</th><th>Phone</th><th>Purpose</th><th>Notes</th><th>Follow-up</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        {calls.length > 0 ? calls.map(c=>(
                            <tr key={c._id}>
                                <td><Badge text={c.callType} variant={c.callType==='Incoming'?'info':'warning'}/></td>
                                <td className="fw-600">{c.callerName}</td><td>{c.phone}</td><td>{c.purpose}</td>
                                <td>{c.notes ? c.notes.substring(0,40) : '—'}</td>
                                <td>{c.followUpDate ? fmt(c.followUpDate) : '—'}</td>
                                <td><Badge text={c.status} variant={statusColor(c.status)}/></td>
                                <td>
                                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                        <button className="btn-icon" onClick={()=>handleView(c)} title="View"><Eye size={16}/></button>
                                        {(c.status==='Pending Follow-up'||c.status==='Overdue') && <button className="btn-icon" style={{color:'var(--success)'}} onClick={()=>handleComplete(c._id)} title="Mark Complete"><CheckCircle size={16}/></button>}
                                        <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDelete(c._id)} title="Delete"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="8"><div className="empty-state" style={{padding:30}}><PhoneCall size={40}/><h3>No Calls Logged</h3></div></td></tr>}
                    </tbody>
                </table></div>
            </div>
        </div>
    );
}

/* ═══════════════════  ENQUIRIES  ═══════════════════ */
function EnquiryTab() {
    const [enquiries, setEnquiries] = useLocalStorage('fo_enquiries', []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name:'', phone:'', email:'', enquiryType:'General', source:'Walk-in', message:'', assignedTo:'', followUpDate:'',
        studentName:'', parentName:'', classInterested:'', academicYear:'',
    });

    const handleSave = async e => {
        e.preventDefault();
        if (!form.name.trim() || !form.phone.trim()) return await customAlert('Name and Phone required');
        const newEnquiry = {
            ...form,
            _id: Date.now(),
            createdAt: new Date().toISOString(),
            status: 'New'
        };
        setEnquiries([newEnquiry, ...enquiries]);
        setForm({ name:'', phone:'', email:'', enquiryType:'General', source:'Walk-in', message:'', assignedTo:'', followUpDate:'', studentName:'', parentName:'', classInterested:'', academicYear:'' });
        setShowForm(false);
        await customAlert('Enquiry saved successfully');
    };

    const handleStatusUpdate = async (id, status) => {
        setEnquiries(prev => prev.map(eq => eq._id === id ? { ...eq, status } : eq));
    };

    const handleConvert = async id => {
        if (!await customConfirm('Convert this enquiry to Admission?')) return;
        setEnquiries(prev => prev.map(eq => eq._id === id ? { ...eq, status: 'Converted' } : eq));
        await customAlert('Enquiry marked as Converted.');
    };

    const handleDelete = async id => {
        if (!await customConfirm('Delete this enquiry record?')) return;
        setEnquiries(prev => prev.filter(eq => eq._id !== id));
    };

    const handleView = (eq) => {
        customAlert(`
            Enquiry Details
            ---------------
            Name: ${eq.name}
            Phone: ${eq.phone}
            Type: ${eq.enquiryType}
            Source: ${eq.source}
            Student: ${eq.studentName || 'N/A'}
            Assigned: ${eq.assignedTo || 'Unassigned'}
            Status: ${eq.status}
            Message: ${eq.message || 'None'}
        `);
    };

    return (
        <div className="animate-fade-in">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h3 style={{margin:0}}>Enquiry Management</h3>
                <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}><Plus size={16}/> New Enquiry</button>
            </div>
            {showForm && (
                <div className="card fo-form-card animate-fade-in" style={{padding:24,marginBottom:20}}>
                    <form onSubmit={handleSave}>
                        <div className="form-grid-3">
                            <div className="form-group"><label className="form-label">Enquirer Name <span className="required">*</span></label>
                                <input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Phone <span className="required">*</span></label>
                                <PhoneInput className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Email</label>
                                <input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Enquiry Type</label>
                                <select className="form-select" value={form.enquiryType} onChange={e=>setForm({...form,enquiryType:e.target.value})}>
                                    {['Admission','General','Fee','Academic','Facility','Other'].map(t=><option key={t}>{t}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Source</label>
                                <select className="form-select" value={form.source} onChange={e=>setForm({...form,source:e.target.value})}>
                                    {['Walk-in','Phone','Online','Email','Referral','Social Media'].map(s=><option key={s}>{s}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Assign To</label>
                                <input className="form-input" value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})} placeholder="Staff member"/></div>
                            <div className="form-group"><label className="form-label">Follow-up Date</label>
                                <input type="date" className="form-input" value={form.followUpDate} onChange={e=>setForm({...form,followUpDate:e.target.value})}/></div>
                            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">Message</label>
                                <input className="form-input" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Enquiry details"/></div>
                        </div>
                        {form.enquiryType === 'Admission' && (
                            <div className="form-grid-3" style={{marginTop:12}}>
                                <div className="form-group"><label className="form-label">Student Name</label>
                                    <input className="form-input" value={form.studentName} onChange={e=>setForm({...form,studentName:e.target.value})}/></div>
                                <div className="form-group"><label className="form-label">Parent Name</label>
                                    <input className="form-input" value={form.parentName} onChange={e=>setForm({...form,parentName:e.target.value})}/></div>
                                <div className="form-group"><label className="form-label">Class Interested</label>
                                    <select className="form-select" value={form.classInterested} onChange={e=>setForm({...form,classInterested:e.target.value})}>
                                        <option value="">Select</option>{['Nursery','LKG','UKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'].map(c=><option key={c}>{c}</option>)}</select></div>
                            </div>
                        )}
                        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
                            <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Save Enquiry</button>
                        </div>
                    </form>
                </div>
            )}
            <div className="card" style={{padding:0}}>
                <div className="table-responsive"><table className="data-table">
                    <thead><tr><th>Name</th><th>Phone</th><th>Type</th><th>Source</th><th>Assigned</th><th>Follow-up</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        {enquiries.length > 0 ? enquiries.map(eq=>(
                            <tr key={eq._id}>
                                <td className="fw-600">{eq.name}</td><td>{eq.phone}</td>
                                <td><Badge text={eq.enquiryType} variant={eq.enquiryType==='Admission'?'warning':'info'}/></td>
                                <td>{eq.source}</td><td>{eq.assignedTo||'—'}</td><td>{fmt(eq.followUpDate)}</td>
                                <td><Badge text={eq.status} variant={statusColor(eq.status)}/></td>
                                <td>
                                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                        <button className="btn-icon" onClick={()=>handleView(eq)} title="View"><Eye size={16}/></button>
                                        {eq.status==='New' && <button className="btn-icon" style={{color:'var(--primary)'}} onClick={()=>handleStatusUpdate(eq._id,'In Progress')} title="Start"><ArrowRight size={16}/></button>}
                                        {eq.status==='In Progress' && eq.enquiryType==='Admission' && <button className="btn-icon" style={{color:'var(--success)'}} onClick={()=>handleConvert(eq._id)} title="Convert"><CheckCircle size={16}/></button>}
                                        {eq.status==='In Progress' && <button className="btn-icon" style={{color:'var(--accent)'}} onClick={()=>handleStatusUpdate(eq._id,'Closed')} title="Close"><X size={16}/></button>}
                                        <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDelete(eq._id)} title="Delete"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="8"><div className="empty-state" style={{padding:30}}><HelpCircle size={40}/><h3>No Enquiries</h3></div></td></tr>}
                    </tbody>
                </table></div>
            </div>
        </div>
    );
}

/* ═══════════════════  COMPLAINTS  ═══════════════════ */
function ComplaintTab() {
    const [complaints, setComplaints] = useLocalStorage('fo_complaints', []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ complainantName:'', phone:'', complainantType:'Parent', category:'Other', description:'', priority:'Medium' });

    const handleSave = async e => {
        e.preventDefault();
        if (!form.complainantName.trim() || !form.description.trim()) return await customAlert('Name and Description required');
        const newComplaint = {
            ...form,
            _id: Date.now(),
            createdAt: new Date().toISOString(),
            status: 'Pending'
        };
        setComplaints([newComplaint, ...complaints]);
        setForm({ complainantName:'', phone:'', complainantType:'Parent', category:'Other', description:'', priority:'Medium' });
        setShowForm(false);
        await customAlert('Complaint registered successfully');
    };

    const handleAssign = async id => {
        const staff = prompt('Enter staff member name to assign:');
        if (!staff) return;
        setComplaints(prev => prev.map(c => c._id === id ? { ...c, assignedTo: staff, status: 'Assigned' } : c));
    };

    const handleResolve = async id => {
        const summary = prompt('Enter resolution summary:');
        if (!summary) return;
        setComplaints(prev => prev.map(c => c._id === id ? { ...c, resolutionSummary: summary, status: 'Resolved', resolvedAt: new Date().toISOString() } : c));
        await customAlert('Complaint marked as Resolved.');
    };

    const handleDelete = async id => {
        if (!await customConfirm('Delete this complaint record?')) return;
        setComplaints(prev => prev.filter(c => c._id !== id));
    };

    const handleView = (c) => {
        customAlert(`
            Complaint Details
            -----------------
            Complainant: ${c.complainantName} (${c.complainantType})
            Category: ${c.category}
            Priority: ${c.priority}
            Assigned: ${c.assignedTo || 'Unassigned'}
            Status: ${c.status}
            Description: ${c.description}
            Resolution: ${c.resolutionSummary || 'Pending'}
        `);
    };

    const prioColor = p => ({ Low:'info', Medium:'warning', High:'danger', Urgent:'danger' }[p] || 'info');

    return (
        <div className="animate-fade-in">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h3 style={{margin:0}}>Complaint Management</h3>
                <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}><Plus size={16}/> Register Complaint</button>
            </div>
            {showForm && (
                <div className="card fo-form-card animate-fade-in" style={{padding:24,marginBottom:20}}>
                    <form onSubmit={handleSave}>
                        <div className="form-grid-3">
                            <div className="form-group"><label className="form-label">Complainant Name <span className="required">*</span></label>
                                <input className="form-input" value={form.complainantName} onChange={e=>setForm({...form,complainantName:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Phone</label>
                                <PhoneInput className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Complainant Type</label>
                                <select className="form-select" value={form.complainantType} onChange={e=>setForm({...form,complainantType:e.target.value})}>
                                    {['Parent','Student','Staff','External'].map(t=><option key={t}>{t}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Category <span className="required">*</span></label>
                                <select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                                    {['Transport','Teacher','Facility','Administration','Academic','Fee','Other'].map(c=><option key={c}>{c}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Priority</label>
                                <select className="form-select" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                                    {['Low','Medium','High','Urgent'].map(p=><option key={p}>{p}</option>)}</select></div>
                            <div className="form-group" style={{gridColumn:'span 3'}}><label className="form-label">Description <span className="required">*</span></label>
                                <textarea className="form-input" rows="3" style={{resize:'vertical'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Detailed description of the complaint"/></div>
                        </div>
                        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
                            <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Submit Complaint</button>
                        </div>
                    </form>
                </div>
            )}
            <div className="card" style={{padding:0}}>
                <div className="table-responsive"><table className="data-table">
                    <thead><tr><th>Name</th><th>Type</th><th>Category</th><th>Priority</th><th>Assigned</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                    <tbody>
                        {complaints.length > 0 ? complaints.map(c=>(
                            <tr key={c._id}>
                                <td className="fw-600">{c.complainantName}</td>
                                <td>{c.complainantType}</td><td>{c.category}</td>
                                <td><Badge text={c.priority} variant={prioColor(c.priority)}/></td>
                                <td>{c.assignedTo||'—'}</td>
                                <td><Badge text={c.status} variant={statusColor(c.status)}/></td>
                                <td>{fmt(c.createdAt)}</td>
                                <td>
                                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                        <button className="btn-icon" onClick={()=>handleView(c)} title="View"><Eye size={16}/></button>
                                        {c.status==='Pending' && <button className="btn-icon" style={{color:'var(--primary)'}} onClick={()=>handleAssign(c._id)} title="Assign"><UserCheck size={16}/></button>}
                                        {(c.status==='Assigned'||c.status==='In Progress') && <button className="btn-icon" style={{color:'var(--success)'}} onClick={()=>handleResolve(c._id)} title="Resolve"><CheckCircle size={16}/></button>}
                                        <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDelete(c._id)} title="Delete"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="8"><div className="empty-state" style={{padding:30}}><AlertTriangle size={40}/><h3>No Complaints</h3></div></td></tr>}
                    </tbody>
                </table></div>
            </div>
        </div>
    );
}

/* ═══════════════════  POSTAL  ═══════════════════ */
function PostalTab() {
    const [items, setItems] = useLocalStorage('fo_postal', []);
    const [direction, setDirection] = useState('Inward');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ direction:'Inward', senderName:'', senderAddress:'', recipient:'', receiverName:'', receiverAddress:'', parcelType:'Letter', courierCompany:'', trackingNumber:'', contents:'' });

    const handleSave = async e => {
        e.preventDefault();
        const newItem = {
            ...form,
            direction,
            _id: Date.now(),
            date: new Date().toISOString(),
            status: direction === 'Inward' ? 'Received' : 'Dispatched'
        };
        setItems([newItem, ...items]);
        setForm({ direction:'Inward', senderName:'', senderAddress:'', recipient:'', receiverName:'', receiverAddress:'', parcelType:'Letter', courierCompany:'', trackingNumber:'', contents:'' });
        setShowForm(false);
        await customAlert('Postal record saved');
    };

    const handleDelete = async id => {
        if (!await customConfirm('Delete this postal record?')) return;
        setItems(prev => prev.filter(i => i._id !== id));
    };

    const handleView = (p) => {
        customAlert(`
            Postal Details (${p.direction})
            -------------------------------
            ${p.direction === 'Inward' ? `Sender: ${p.senderName}\nAddress: ${p.senderAddress}` : `Receiver: ${p.receiverName}\nAddress: ${p.receiverAddress}`}
            Type: ${p.parcelType}
            Courier: ${p.courierCompany || 'N/A'}
            Tracking: ${p.trackingNumber || 'N/A'}
            ${p.direction === 'Inward' ? `Recipient: ${p.recipient}` : `Contents: ${p.contents}`}
            Date: ${fmt(p.date)}
            Status: ${p.status}
        `);
    };

    const filtered = items.filter(i => i.direction === direction);

    return (
        <div className="animate-fade-in">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <div style={{display:'flex',gap:8}}>
                    <button className={`btn ${direction==='Inward'?'btn-primary':'btn-outline'}`} onClick={()=>setDirection('Inward')}>Received Mail</button>
                    <button className={`btn ${direction==='Outward'?'btn-primary':'btn-outline'}`} onClick={()=>setDirection('Outward')}>Sent Mail</button>
                </div>
                <button className="btn btn-primary" onClick={()=>{setShowForm(!showForm);}}><Plus size={16}/> {direction==='Inward'?'Receive Parcel':'Dispatch Mail'}</button>
            </div>
            {showForm && (
                <div className="card fo-form-card animate-fade-in" style={{padding:24,marginBottom:20}}>
                    <form onSubmit={handleSave}>
                        <div className="form-grid-3">
                            {direction === 'Inward' ? <>
                                <div className="form-group"><label className="form-label">Sender Name <span className="required">*</span></label>
                                    <input className="form-input" value={form.senderName} onChange={e=>setForm({...form,senderName:e.target.value})}/></div>
                                <div className="form-group"><label className="form-label">Sender Address</label>
                                    <input className="form-input" value={form.senderAddress} onChange={e=>setForm({...form,senderAddress:e.target.value})}/></div>
                                <div className="form-group"><label className="form-label">Recipient (Staff/Dept)</label>
                                    <input className="form-input" value={form.recipient} onChange={e=>setForm({...form,recipient:e.target.value})}/></div>
                            </> : <>
                                <div className="form-group"><label className="form-label">Receiver Name <span className="required">*</span></label>
                                    <input className="form-input" value={form.receiverName} onChange={e=>setForm({...form,receiverName:e.target.value})}/></div>
                                <div className="form-group"><label className="form-label">Receiver Address</label>
                                    <input className="form-input" value={form.receiverAddress} onChange={e=>setForm({...form,receiverAddress:e.target.value})}/></div>
                            </>}
                            <div className="form-group"><label className="form-label">Parcel Type</label>
                                <select className="form-select" value={form.parcelType} onChange={e=>setForm({...form,parcelType:e.target.value})}>
                                    {['Letter','Package','Document','Courier','Speed Post','Registered Post'].map(t=><option key={t}>{t}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Courier Company</label>
                                <input className="form-input" value={form.courierCompany} onChange={e=>setForm({...form,courierCompany:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Tracking Number</label>
                                <input className="form-input" value={form.trackingNumber} onChange={e=>setForm({...form,trackingNumber:e.target.value})}/></div>
                            <div className="form-group" style={{gridColumn:'span 3'}}><label className="form-label">Contents</label>
                                <input className="form-input" value={form.contents} onChange={e=>setForm({...form,contents:e.target.value})} placeholder="Description of contents"/></div>
                        </div>
                        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
                            <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Save</button>
                        </div>
                    </form>
                </div>
            )}
            <div className="card" style={{padding:0}}>
                <div className="table-responsive"><table className="data-table">
                    <thead><tr>
                        <th>{direction==='Inward'?'Sender':'Receiver'}</th><th>Type</th><th>Courier</th><th>Tracking #</th>
                        <th>{direction==='Inward'?'Recipient':'Contents'}</th><th>Date</th><th>Status</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(p=>(
                            <tr key={p._id}>
                                <td className="fw-600">{direction==='Inward'?p.senderName:p.receiverName}</td>
                                <td>{p.parcelType}</td><td>{p.courierCompany||'—'}</td><td>{p.trackingNumber||'—'}</td>
                                <td>{direction==='Inward'?(p.recipient||'—'):(p.contents||'—')}</td>
                                <td>{fmt(p.date)}</td>
                                <td><Badge text={p.status} variant={statusColor(p.status)}/></td>
                                <td>
                                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                        <button className="btn-icon" onClick={()=>handleView(p)} title="View"><Eye size={16}/></button>
                                        <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDelete(p._id)} title="Delete"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="8"><div className="empty-state" style={{padding:30}}><Package size={40}/><h3>No {direction==='Inward'?'Received':'Sent'} Mail</h3></div></td></tr>}
                    </tbody>
                </table></div>
            </div>
        </div>
    );
}

/* ═══════════════════  APPOINTMENTS  ═══════════════════ */
function AppointmentTab() {
    const [appts, setAppts] = useLocalStorage('fo_appointments', []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ visitorName:'', phone:'', staffMember:'', date:'', time:'', purpose:'', notes:'' });

    const handleSave = async e => {
        e.preventDefault();
        if (!form.visitorName.trim()||!form.staffMember.trim()||!form.date||!form.time) return await customAlert('All required fields must be filled');
        const newAppt = {
            ...form,
            _id: Date.now(),
            status: 'Scheduled'
        };
        setAppts([newAppt, ...appts]);
        setForm({ visitorName:'', phone:'', staffMember:'', date:'', time:'', purpose:'', notes:'' }); setShowForm(false);
        await customAlert('Appointment scheduled successfully');
    };

    const handleStatus = async (id, status) => {
        setAppts(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    };

    const handleDelete = async id => {
        if (!await customConfirm('Delete this appointment?')) return;
        setAppts(prev => prev.filter(a => a._id !== id));
    };

    const handleView = (a) => {
        customAlert(`
            Appointment Details
            -------------------
            Visitor: ${a.visitorName}
            Phone: ${a.phone || 'N/A'}
            Staff: ${a.staffMember}
            Date: ${fmt(a.date)} at ${a.time}
            Purpose: ${a.purpose || 'General'}
            Status: ${a.status}
            Notes: ${a.notes || 'None'}
        `);
    };

    return (
        <div className="animate-fade-in">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h3 style={{margin:0}}>Appointments</h3>
                <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}><Plus size={16}/> Schedule Appointment</button>
            </div>
            {showForm && (
                <div className="card fo-form-card animate-fade-in" style={{padding:24,marginBottom:20}}>
                    <form onSubmit={handleSave}>
                        <div className="form-grid-3">
                            <div className="form-group"><label className="form-label">Visitor Name <span className="required">*</span></label>
                                <input className="form-input" value={form.visitorName} onChange={e=>setForm({...form,visitorName:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Phone</label>
                                <PhoneInput className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Staff Member <span className="required">*</span></label>
                                <input className="form-input" value={form.staffMember} onChange={e=>setForm({...form,staffMember:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Date <span className="required">*</span></label>
                                <input type="date" className="form-input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Time <span className="required">*</span></label>
                                <input type="time" className="form-input" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Purpose</label>
                                <input className="form-input" value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})}/></div>
                        </div>
                        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
                            <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Save Appointment</button>
                        </div>
                    </form>
                </div>
            )}
            <div className="card" style={{padding:0}}>
                <div className="table-responsive"><table className="data-table">
                    <thead><tr><th>Visitor</th><th>Phone</th><th>Staff</th><th>Date</th><th>Time</th><th>Purpose</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        {appts.length > 0 ? appts.map(a=>(
                            <tr key={a._id}>
                                <td className="fw-600">{a.visitorName}</td><td>{a.phone||'—'}</td><td>{a.staffMember}</td>
                                <td>{fmt(a.date)}</td><td>{a.time}</td><td>{a.purpose||'—'}</td>
                                <td><Badge text={a.status} variant={statusColor(a.status)}/></td>
                                <td>
                                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                        <button className="btn-icon" onClick={()=>handleView(a)} title="View"><Eye size={16}/></button>
                                        {a.status==='Scheduled' && <button className="btn-icon" style={{color:'var(--primary)'}} onClick={()=>handleStatus(a._id,'Confirmed')} title="Confirm"><CheckCircle size={16}/></button>}
                                        {(a.status==='Scheduled'||a.status==='Confirmed') && <button className="btn-icon" style={{color:'var(--success)'}} onClick={()=>handleStatus(a._id,'Completed')} title="Done"><FileText size={16}/></button>}
                                        {a.status==='Scheduled' && <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleStatus(a._id,'Cancelled')} title="Cancel"><X size={16}/></button>}
                                        <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDelete(a._id)} title="Delete"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="8"><div className="empty-state" style={{padding:30}}><CalendarClock size={40}/><h3>No Appointments</h3></div></td></tr>}
                    </tbody>
                </table></div>
            </div>
        </div>
    );
}

/* ═══════════════════  PLACEHOLDERS  ═══════════════════ */
function DocumentsPlaceholder() {
    return (
        <div className="card" style={{padding:40}}>
            <div className="empty-state"><FileText size={48}/><h3>Document Management</h3>
                <p>Documents are linked to individual Visitor, Enquiry, and Complaint records. Open any record to upload and view attached documents.</p></div>
        </div>
    );
}

function ReportsPlaceholder() {
    const reports = ['Visitor Report','Call Log Report','Enquiry Report','Enquiry Conversion Report','Complaint Report','Postal Report','Appointment Report','Pending Follow-ups'];
    return (
        <div className="animate-fade-in">
            <h3 style={{marginBottom:16}}>Available Reports</h3>
            <div className="fo-report-grid">
                {reports.map((r,i)=>(
                    <div key={i} className="card fo-report-card" style={{padding:20,cursor:'pointer'}}>
                        <BarChart3 size={24} style={{color:'var(--primary)',marginBottom:8}}/>
                        <h4 style={{margin:0,fontSize:'0.95rem'}}>{r}</h4>
                        <p style={{fontSize:'0.8rem',color:'var(--text-light)',marginTop:4}}>Click to generate report</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
