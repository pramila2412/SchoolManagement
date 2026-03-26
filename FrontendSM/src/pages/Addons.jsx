import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    PlusCircle, Search, Calendar, FileText, Download, Award,
    Image as ImageIcon, Gift, MessageSquare, ClipboardList, BarChart3,
    Settings, Users, Clock, Edit3, Trash2, Eye, MapPin, Phone,
    CheckCircle2, XCircle, Send, Plus, Key, Link as LinkIcon, PieChart,
    UserCheck, FolderOpen, Mail, UploadCloud, ToggleRight
} from 'lucide-react';
import './Addons.css';

// ======================== VISITORS ========================
function VisitorsTab() {
    const [visitors] = useState([
        { id: 1, name: 'Suresh Kumar', phone: '9876543210', purpose: 'Parent Visit', person: 'Principal', timeIn: '09:00 AM', timeOut: '10:30 AM', date: '2026-03-25' },
        { id: 2, name: 'Amazon Delivery', phone: '9988776655', purpose: 'Delivery', person: 'Admin Office', timeIn: '10:15 AM', timeOut: '10:20 AM', date: '2026-03-25' },
        { id: 3, name: 'Anita Singh', phone: '9876543211', purpose: 'Meeting', person: 'Class Teacher Gr-3', timeIn: '11:00 AM', timeOut: '-', date: '2026-03-25' }
    ]);
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><UserCheck size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Visitor Log Book</h3>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><PlusCircle size={16}/> New Visitor Entry</button>
            </div>

            {showForm && (
                <div className="ado-form-panel">
                    <h3>New Visitor Entry</h3>
                    <div className="ado-form form-row-3">
                        <div className="form-group"><label className="form-label">Visitor Name *</label><input type="text" className="form-input"/></div>
                        <div className="form-group"><label className="form-label">Mobile Number *</label><input type="tel" className="form-input"/></div>
                        <div className="form-group"><label className="form-label">Purpose of Visit *</label><select className="form-select"><option>Meeting</option><option>Delivery</option><option>Parent Visit</option><option>Interview</option><option>Other</option></select></div>
                        <div className="form-group"><label className="form-label">Person to Meet</label><input type="text" className="form-input"/></div>
                        <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" defaultValue={new Date().toISOString().split('T')[0]}/></div>
                        <div className="form-group"><label className="form-label">Time In</label><input type="time" className="form-input"/></div>
                    </div>
                    <div className="ado-form form-actions"><button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button><button className="btn btn-primary">Save Entry</button></div>
                </div>
            )}

            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Name</th><th>Mobile</th><th>Purpose</th><th>Person to Meet</th><th>Time In</th><th>Time Out</th><th>Actions</th></tr></thead>
                    <tbody>{visitors.map(v => (
                        <tr key={v.id}><td className="fw-600">{v.name}</td><td>{v.phone}</td><td><span className="badge badge-info">{v.purpose}</span></td>
                            <td>{v.person}</td><td>{v.timeIn}</td><td>{v.timeOut === '-' ? <span className="badge badge-warning">Inside Campus</span> : v.timeOut}</td>
                            <td>{v.timeOut === '-' && <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}><Clock size={12}/> Clock Out</button>}</td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== GALLERY ========================
function GalleryTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><ImageIcon size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Photo Gallery</h3>
                <button className="btn btn-primary"><UploadCloud size={16}/> Upload New Album</button>
            </div>
            
            <div className="ado-gallery-grid">
                {['Annual Sports Day 2026', 'Science Exhibition', 'Independence Day', 'Class 10 Farewell'].map((album, i) => (
                    <div className="ado-gallery-item" key={i}>
                        <div className="ado-gallery-img"><ImageIcon size={32} opacity={0.5}/></div>
                        <div className="ado-gallery-action"><Edit3 size={14} color="var(--primary)"/></div>
                        <div className="ado-gallery-info">
                            <h5>{album}</h5>
                            <p>{15 + i * 12} Photos • {i % 2 === 0 ? 'Active' : 'Draft'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ======================== ALUMNI ========================
function AlumniTab() {
    const [alumni] = useState([
        { id: 1, name: 'Ritika Sharma', batch: '2020', course: 'Science', profession: 'Software Engineer', location: 'Bangalore', phone: '9988776655' },
        { id: 2, name: 'Animesh Roy', batch: '2019', course: 'Commerce', profession: 'CA', location: 'Mumbai', phone: '9888877777' },
        { id: 3, name: 'Pooja Verma', batch: '2022', course: 'Arts', profession: 'Journalist', location: 'Delhi', phone: '9111122222' }
    ]);
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Users size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Alumni Directory</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Add Alumni Record</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Name</th><th>Batch</th><th>Stream</th><th>Profession</th><th>Location</th><th>Contact</th><th>Actions</th></tr></thead>
                    <tbody>{alumni.map(a => (
                        <tr key={a.id}><td className="fw-600">{a.name}</td><td>{a.batch}</td><td>{a.course}</td><td>{a.profession}</td><td>{a.location}</td><td>{a.phone}</td>
                            <td><button className="btn-icon" title="View Profile"><Eye size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== BIRTHDAYS ========================
function BirthdaysTab() {
    const todayStr = new Date().toISOString().split('T')[0];
    const [birthdays] = useState([
        { id: 1, name: 'Arjun Patel', class: 'Grade 2-A', date: todayStr, age: 7, isToday: true },
        { id: 2, name: 'Meera Joshi', class: 'Grade 1-B', date: todayStr, age: 6, isToday: true },
        { id: 3, name: 'Rahul Kumar', class: 'Grade 4-C', date: '2026-03-28', age: 9, isToday: false },
    ]);
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Gift size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Student Birthdays</h3>
                <div style={{ display: 'flex', gap: 10 }}><select className="form-select"><option>Today</option><option>This Week</option><option>This Month</option></select></div>
            </div>
            
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Student Name</th><th>Class & Section</th><th>Date of Birth</th><th>Age Turning</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{birthdays.map(b => (
                        <tr key={b.id} style={b.isToday ? { backgroundColor: 'var(--accent-light)' } : {}}><td className="fw-600">{b.name}</td><td>{b.class}</td><td>{b.date}</td><td>{b.age}</td>
                            <td>{b.isToday ? <span className="badge badge-success">Today! 🎂</span> : <span className="badge badge-draft">Upcoming</span>}</td>
                            <td><button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }}><Mail size={14}/> Send Greeting</button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== MESSAGES ========================
function MessagesTab() {
    const [messages] = useState([
        { id: 1, title: 'Exam Guidelines 2026', to: 'All Students', date: '2026-03-24', priority: 'Important', status: 'Delivered (450)' },
        { id: 2, title: 'Staff Meeting at 3 PM', to: 'All Teachers', date: '2026-03-25', priority: 'Urgent', status: 'Delivered (45)' },
        { id: 3, title: 'Fee Payment Reminder', to: 'Parents (Grade 5)', date: '2026-03-20', priority: 'Normal', status: 'Delivered (60)' },
    ]);
    const badgeColor = (p) => p === 'Urgent' ? 'badge-danger' : p === 'Important' ? 'badge-warning' : 'badge-info';

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><MessageSquare size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Message Broadcast</h3>
                <button className="btn btn-primary"><Send size={16}/> Compose Message</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Message Title</th><th>Recipient Group</th><th>Priority</th><th>Sent Date</th><th>Status / Reach</th><th>Actions</th></tr></thead>
                    <tbody>{messages.map(m => (
                        <tr key={m.id}><td className="fw-600">{m.title}</td><td>{m.to}</td><td><span className={`badge ${badgeColor(m.priority)}`}>{m.priority}</span></td><td>{m.date}</td>
                            <td>{m.status}</td><td><button className="btn-icon" title="View"><Eye size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== FORMS ========================
function FormsTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Custom Forms & Surveys</h3>
                <button className="btn btn-primary"><Plus size={16}/> Create Form</button>
            </div>
            <div className="ado-form-builder">
                <div className="ado-fb-sidebar">
                    <h4 style={{ fontSize: '0.9rem', marginBottom: 16 }}>Form Fields</h4>
                    {['Text Input', 'Dropdown', 'Checkboxes', 'Date Picker', 'File Upload', 'Paragraph'].map((f, i) => (
                        <div className="ado-fb-field" key={i}><span>{f}</span><Plus size={14} color="var(--primary)"/></div>
                    ))}
                </div>
                <div className="ado-fb-main" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <FileText size={48} opacity={0.2} style={{ margin: '0 auto 16px' }}/>
                    <p>Drag and drop fields here to build your form</p>
                    <p style={{ fontSize: '0.8rem', marginTop: 8 }}>Empty Design Canvas</p>
                </div>
            </div>
            
            <h4 style={{ marginTop: 28, marginBottom: 16, fontSize: '1rem', color: 'var(--primary)' }}>Active Forms</h4>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Form Name</th><th>Audience</th><th>Submissions</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">Annual Transport Feedback</td><td>Parents</td><td>245</td><td><span className="badge badge-success">Active</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View Submissions"><Eye size={16}/></button><button className="btn-icon" title="Export Excel"><Download size={16}/></button></td></tr>
                        <tr><td className="fw-600">Teacher Device Request</td><td>Staff</td><td>12</td><td><span className="badge badge-warning">Closing Soon</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View Submissions"><Eye size={16}/></button><button className="btn-icon" title="Export Excel"><Download size={16}/></button></td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== DOWNLOADS ========================
function DownloadsTab() {
    const docs = [
        { name: 'Syllabus_Class10_2026.pdf', category: 'Syllabus', audience: 'Students', size: '2.4 MB', date: '2026-03-20', dls: 145 },
        { name: 'Holiday_Calendar_2026.pdf', category: 'Circular', audience: 'All', size: '1.1 MB', date: '2026-01-05', dls: 890 },
        { name: 'Transport_Route_Map.png', category: 'Other', audience: 'Parents', size: '4.5 MB', date: '2026-02-15', dls: 320 }
    ];
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><FolderOpen size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Resource Downloads</h3>
                <button className="btn btn-primary"><UploadCloud size={16}/> Upload Document</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Document Name</th><th>Category</th><th>Target Audience</th><th>Size</th><th>Upload Date</th><th>Downloads</th><th>Actions</th></tr></thead>
                    <tbody>{docs.map((d, i) => (
                        <tr key={i}><td className="fw-600"><FileText size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--info)' }}/>{d.name}</td>
                            <td>{d.category}</td><td>{d.audience}</td><td>{d.size}</td><td>{d.date}</td><td><span className="badge badge-draft">{d.dls}</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="Download"><Download size={16}/></button><button className="btn-icon" title="Delete"><Trash2 size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== CERTIFICATES ========================
function CertificatesTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Award size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Certificate Generation</h3>
                <button className="btn btn-outline"><Settings size={16}/> Manage Templates</button>
            </div>
            <div className="ado-form-panel" style={{ maxWidth: 600 }}>
                <div className="ado-form">
                    <div className="form-group"><label className="form-label">Certificate Type *</label>
                        <select className="form-select"><option>Transfer Certificate (TC)</option><option>Bonafide Certificate</option><option>Completion Certificate</option><option>Character Certificate</option></select></div>
                    <div className="form-group"><label className="form-label">Select Student *</label>
                        <input type="text" className="form-input" placeholder="Search by name or admission number..."/></div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Issue Date</label><input type="date" className="form-input" defaultValue={new Date().toISOString().split('T')[0]}/></div>
                        <div className="form-group"><label className="form-label">Purpose / Reason</label><input type="text" className="form-input" placeholder="e.g. Higher Education"/></div>
                    </div>
                    <div className="form-group"><label className="form-label">Additional Remarks</label><textarea className="form-input" rows="2"></textarea></div>
                    <div className="form-actions"><button className="btn btn-primary"><FileText size={16}/> Preview & Generate</button></div>
                </div>
            </div>
        </div>
    );
}

// ======================== REGISTRATION ========================
function RegistrationTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><ClipboardList size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Online Registrations</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> New Registration Event</button>
            </div>
            
            <div className="ado-stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={24} color="var(--success)"/></div>
                    <div className="ado-stat-info"><h4>2</h4><p>Active Events</p></div></div>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--info-light)' }}><Users size={24} color="var(--info)"/></div>
                    <div className="ado-stat-info"><h4>342</h4><p>Total Participants</p></div></div>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--warning-light)' }}><Clock size={24} color="var(--warning)"/></div>
                    <div className="ado-stat-info"><h4>1</h4><p>Waitlisted</p></div></div>
            </div>

            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Event Name</th><th>Type</th><th>Deadline</th><th>Capacity</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">Summer Coding Camp</td><td>Workshop</td><td>2026-05-01</td><td>50</td><td>48</td><td><span className="badge badge-success">Open</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View list"><Users size={16}/></button><button className="btn-icon" title="Get Link"><LinkIcon size={16}/></button></td></tr>
                        <tr><td className="fw-600">Inter-School Debate</td><td>Event</td><td>2026-04-10</td><td>100</td><td>100</td><td><span className="badge badge-danger">Full / Closed</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View list"><Users size={16}/></button><button className="btn-icon" title="Get Link"><LinkIcon size={16}/></button></td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== REPORTS ========================
function ReportsTab() {
    const reports = [
        'Visitor Log Report (PDF/Excel)', 'Gallery Image Directory', 'Alumni Database Export',
        'Monthly Birthday List', 'Message Blast Delivery Report', 'Form Submission Raw Data',
        'Document Download Analytics', 'Certificate Register', 'Event Participant List'
    ];
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><BarChart3 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Add-On Reports Engine</h3>
            <div className="ado-form-panel" style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 24 }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}><label className="form-label">Select Report Template</label>
                    <select className="form-select">{reports.map(r => <option key={r}>{r}</option>)}</select></div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}><label className="form-label">Date Range</label>
                    <select className="form-select"><option>This Month</option><option>Last 30 Days</option><option>This Year</option></select></div>
                <button className="btn btn-primary" style={{ padding: '10px 24px', height: 40 }}><Download size={16}/> Export Report</button>
            </div>
            <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--text-muted)' }}>
                Select a template and click Export to generate the report.
            </div>
        </div>
    );
}

// ======================== ANALYTICS ========================
function AnalyticsTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><PieChart size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Engagement Analytics</h3>
            <div className="ado-stats-row">
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--info-light)' }}><UploadCloud size={24} color="var(--info)"/></div>
                    <div className="ado-stat-info"><h4>1,245</h4><p>File Downloads</p></div></div>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--success-light)' }}><MessageSquare size={24} color="var(--success)"/></div>
                    <div className="ado-stat-info"><h4>42,100</h4><p>Messages Delivered</p></div></div>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--accent-light)' }}><UserCheck size={24} color="var(--accent)"/></div>
                    <div className="ado-stat-info"><h4>380</h4><p>Visitors Logged</p></div></div>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--warning-light)' }}><Award size={24} color="var(--warning)"/></div>
                    <div className="ado-stat-info"><h4>115</h4><p>Certificates Generated</p></div></div>
            </div>
            <div className="ado-form-panel" style={{ minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={64} color="var(--border)" style={{ marginBottom: 16 }}/>
                <h4 style={{ color: 'var(--text-muted)' }}>Module Usage Distribution</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: 8 }}>Interactive charts will render here showing 30-day activity trends.</p>
            </div>
        </div>
    );
}

// ======================== SETTINGS (LIFECYCLE) ========================
function SettingsTab() {
    const modules = [
        { name: 'Visitor Management', desc: 'Track gate entries and visitor logs', enabled: true },
        { name: 'Gallery', desc: 'School photo albums and event media', enabled: true },
        { name: 'Alumni', desc: 'Past student directory and records', enabled: false },
        { name: 'Student Birthday', desc: 'Daily birthday alerts and lists', enabled: true },
        { name: 'Messages', desc: 'In-app broadcasts and targeted SMS', enabled: true },
        { name: 'Forms', desc: 'Custom form builder for data collection', enabled: true },
        { name: 'Downloads', desc: 'Repository for syllabus and circulars', enabled: true },
        { name: 'Certificates', desc: 'Generate TC, Bonafide, etc.', enabled: true },
        { name: 'Registration', desc: 'Sign-ups for events and workshops', enabled: false },
        { name: 'Reports', desc: 'Cross-module data exports', enabled: true },
        { name: 'Analytics', desc: 'Usage stats and module tracking', enabled: true }
    ];

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><ToggleRight size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Add-On Enable Lifecycle</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 24 }}>Super Admins can enable or disable supplementary modules here. Disabled modules hide from the navigation but retain their backend data.</p>
            
            <div className="ado-toggles-list">
                {modules.map((m, i) => (
                    <div className="ado-toggle-card" key={i}>
                        <div className="ado-toggle-info">
                            <h4>{m.name}</h4>
                            <p>{m.desc}</p>
                        </div>
                        <label className="ado-switch">
                            <input type="checkbox" defaultChecked={m.enabled} />
                            <span className="ado-slider"></span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}


// ======================== MAIN ADDONS COMPONENT ========================
const TABS = [
    { id: 'visitors', label: 'Visitors', icon: UserCheck },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'alumni', label: 'Alumni', icon: Users },
    { id: 'birthdays', label: 'Birthdays', icon: Gift },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'registration', label: 'Registration', icon: ClipboardList },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: ToggleRight },
];

export default function Addons() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'visitors');
    const handleNavigate = (tab) => { setActiveTab(tab); setSearchParams({ tab }); };
    useEffect(() => { if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl); }, [tabFromUrl]);

    return (
        <div className="addons-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb">
                    <Link to="/">Dashboard</Link><span className="separator">/</span><span>Add-Ons</span>
                    {activeTab !== 'visitors' && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{TABS.find(t => t.id === activeTab)?.label}</span></>}
                </div>
                <h1>Supplementary Modules (Add-Ons)</h1>
            </div></div>
            <div className="card addons-card">
                <div className="tabs-header">{TABS.map(tab => { const Icon = tab.icon; return <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>; })}</div>
                <div className="tabs-content">
                    {activeTab === 'visitors' && <VisitorsTab/>}
                    {activeTab === 'gallery' && <GalleryTab/>}
                    {activeTab === 'alumni' && <AlumniTab/>}
                    {activeTab === 'birthdays' && <BirthdaysTab/>}
                    {activeTab === 'messages' && <MessagesTab/>}
                    {activeTab === 'forms' && <FormsTab/>}
                    {activeTab === 'downloads' && <DownloadsTab/>}
                    {activeTab === 'certificates' && <CertificatesTab/>}
                    {activeTab === 'registration' && <RegistrationTab/>}
                    {activeTab === 'reports' && <ReportsTab/>}
                    {activeTab === 'analytics' && <AnalyticsTab/>}
                    {activeTab === 'settings' && <SettingsTab/>}
                </div>
            </div>
        </div>
    );
}
