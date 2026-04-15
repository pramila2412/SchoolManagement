import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { classes } from '../data/mockData';
import {
    LayoutDashboard, Megaphone, MessageSquare, Users, FileUp, Mail,
    Video, CheckSquare, Clipboard, Activity, Settings, Save, PlusCircle,
    Trash2, Pin, Lock, Send, Eye, Calendar, Clock, ChevronRight,
    Search, X, Paperclip, Check, CheckCheck, AlertCircle, Radio,
    FileText, Image as ImageIcon
} from 'lucide-react';
import './Collaborate.css';

const API = '/api/collaborate';
function useApi(ep) {
    const [data, setData] = useState([]); const [loading, setLoading] = useState(true);
    const fetch_ = useCallback(async () => { try { setLoading(true); const r = await fetch(`${API}${ep}`); const d = await r.json(); setData(d); } catch(e){console.error(e);} finally {setLoading(false);} }, [ep]);
    useEffect(() => { fetch_(); }, [fetch_]); return { data, loading, refresh: fetch_ };
}

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// ===== DASHBOARD =====
function DashboardTab({ onNavigate }) {
    const { data: kpi } = useApi('/dashboard');
    const cards = [
        { label:'Active Discussions', val:kpi.activeDiscussions||0, color:'var(--info)', bg:'var(--info-light)', icon:MessageSquare },
        { label:'Messages Today', val:kpi.messagesToday||0, color:'var(--accent)', bg:'var(--accent-light)', icon:Mail },
        { label:'Files Shared Today', val:kpi.sharedFilesToday||0, color:'var(--warning)', bg:'var(--warning-light)', icon:FileUp },
        { label:'Announcements (7d)', val:kpi.announcementsThisWeek||0, color:'var(--success)', bg:'var(--success-light)', icon:Megaphone },
        { label:'Active Groups', val:kpi.activeGroups||0, color:'var(--primary)', bg:'rgba(11,60,93,0.1)', icon:Users },
        { label:'Pending Tasks', val:kpi.pendingTasks||0, color:'var(--danger)', bg:'var(--danger-light)', icon:CheckSquare },
    ];
    const actions = [
        { label:'Create Announcement', icon:Megaphone, tab:'announcements' }, { label:'Start Discussion', icon:MessageSquare, tab:'discussions' },
        { label:'Share File', icon:FileUp, tab:'files' }, { label:'Create Group', icon:Users, tab:'groups' },
        { label:'Schedule Meeting', icon:Video, tab:'meetings' }, { label:'Post Notice', icon:Clipboard, tab:'notices' },
    ];
    return (<div className="animate-fade-in">
        <div className="collab-kpi-grid">{cards.map((c,i)=>{const I=c.icon;return <div className="collab-kpi-card" key={i}><div className="collab-kpi-icon" style={{background:c.bg}}><I size={24} style={{color:c.color}}/></div><div className="collab-kpi-info"><h4>{c.val}</h4><p>{c.label}</p></div></div>})}</div>
        <div className="collab-section-divider"><Activity size={18}/> Quick Actions</div>
        <div className="collab-quick-actions">{actions.map((a,i)=>{const I=a.icon;return <button key={i} className="collab-quick-btn" onClick={()=>onNavigate(a.tab)}><I size={18}/>{a.label}</button>})}</div>
    </div>);
}

// ===== ANNOUNCEMENTS =====
function AnnouncementsTab() {
    const { user } = useAuth();
    const { data: apiList, refresh } = useApi('/announcements');
    const [form, setForm] = useState({title:'',content:'',category:'General',audience:'Everyone',publishMode:'Immediate',sendNotification:false,status:'Published'});
    const [show, setShow] = useState(false);
    
    // Permission check
    const isStaff = user?.role?.includes('Admin') || user?.role?.includes('Staff') || user?.role?.includes('Teacher');

    // Load from localStorage (unified source)
    const localAnnouncements = JSON.parse(localStorage.getItem('erp_announcements') || '[]');
    const filteredLocal = localAnnouncements.filter(a => {
        if (isStaff) return true; // Staff see all
        
        // Students see published ones for them or all
        const studentClass = user?.class || '';
        return a.status === 'Published' && (
            a.targetGroup === 'All Students' || 
            a.targetGroup === 'Everyone' || 
            a.targetGroup === `Class ${studentClass}` ||
            a.targetGroup === studentClass
        );
    }).map(a => ({
        ...a,
        _id: a.id,
        content: a.message,
        category: a.category || a.targetGroup,
        source: 'Local'
    }));

    // Merge API and Local
    const list = [...filteredLocal, ...apiList].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleSubmit = async e => { e.preventDefault(); await fetch(`${API}/announcements`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({title:'',content:'',category:'General',audience:'Everyone',publishMode:'Immediate',sendNotification:false,status:'Published'}); setShow(false); refresh(); };
    const handleDelete = async id => { 
        // Only delete API ones here; Local ones are managed in the other screen
        await fetch(`${API}/announcements/${id}`,{method:'DELETE'}); refresh(); 
    };
    const statusCls = s => s==='Draft'?'badge-draft':s==='Scheduled'?'badge-scheduled':s==='Published'?'badge-published':'badge-completed';

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
            <h3 style={{margin:0}}>Announcements</h3>
            {isStaff && <button className="btn btn-primary" onClick={()=>setShow(!show)}><PlusCircle size={16}/> Create</button>}
        </div>
        {show && <div className="collab-form-panel"><h3><Megaphone size={18}/> New Announcement</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Content *</label><textarea className="form-textarea" rows="3" required value={form.content} onChange={e=>setForm({...form,content:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Academic</option><option>General</option><option>Urgent</option><option>Event</option><option>Holiday</option></select></div>
                <div className="form-group"><label className="form-label">Audience *</label><select className="form-select" value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})}><option>Everyone</option><option>All Staff</option><option>All Students</option><option>All Parents</option><option>Specific Class</option><option>Specific Group</option></select></div>
            </div>
            <div className="form-actions"><button type="submit" className="btn btn-primary"><Send size={16}/> Publish</button></div>
        </form></div>}
        {list.map(a => <div key={a._id} className="notice-card">
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <h4>{a.title}</h4>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span className={`badge ${statusCls(a.status)}`}>{a.status}</span>
                    <span className="badge badge-info">{a.category}</span>
                    {isStaff && a.source !== 'Local' && <button className="btn-icon" onClick={()=>handleDelete(a._id)}><Trash2 size={14}/></button>}
                </div>
            </div>
            <div className="notice-meta"><span>To: {a.audience || a.targetGroup}</span><span>{new Date(a.createdAt || a.publishDate).toLocaleDateString('en-IN')}</span></div>
            <div className="notice-body" style={{ whiteSpace: 'pre-wrap' }}>{a.content}</div>
        </div>)}
        {list.length===0&&<div className="collab-empty"><Megaphone size={40}/><p>No announcements yet</p></div>}
    </div>);
}

// ===== DISCUSSIONS =====
function DiscussionsTab() {
    const { data: list, refresh } = useApi('/discussions');
    const [form, setForm] = useState({title:'',content:'',category:'General',visibility:'School-wide',author:'Admin'});
    const [show, setShow] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const handleSubmit = async e => { e.preventDefault(); await fetch(`${API}/discussions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({title:'',content:'',category:'General',visibility:'School-wide',author:'Admin'}); setShow(false); refresh(); };
    const handleReply = async id => { await fetch(`${API}/discussions/${id}/reply`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({author:'Admin',content:replyText})}); setReplyText(''); setReplyTo(null); refresh(); };
    const handlePin = async id => { await fetch(`${API}/discussions/${id}/pin`,{method:'PUT'}); refresh(); };
    const handleLock = async id => { await fetch(`${API}/discussions/${id}/lock`,{method:'PUT'}); refresh(); };
    const handleDelete = async id => { await fetch(`${API}/discussions/${id}`,{method:'DELETE'}); refresh(); };

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h3 style={{margin:0}}>Discussion Forum</h3><button className="btn btn-primary" onClick={()=>setShow(!show)}><PlusCircle size={16}/> New Topic</button></div>
        {show && <div className="collab-form-panel"><h3><MessageSquare size={18}/> Create Discussion</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Topic Title *</label><input className="form-input" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Content *</label><textarea className="form-textarea" rows="3" required value={form.content} onChange={e=>setForm({...form,content:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Academic</option><option>General</option><option>Q&A</option><option>Events</option><option>Feedback</option></select></div>
                <div className="form-group"><label className="form-label">Visibility</label><select className="form-select" value={form.visibility} onChange={e=>setForm({...form,visibility:e.target.value})}><option>School-wide</option><option>Specific Group</option><option>Class</option></select></div>
            </div>
            <div className="form-actions"><button type="submit" className="btn btn-primary"><Send size={16}/> Create</button></div>
        </form></div>}
        {list.map(d => <div key={d._id} className={`discussion-thread ${d.pinned?'pinned':''} ${d.locked?'locked':''}`}>
            <div className="discussion-header"><h4>{d.pinned&&<Pin size={14} style={{marginRight:6,color:'var(--accent)'}}/>}{d.title}{d.locked&&<Lock size={14} style={{marginLeft:6,color:'var(--warning)'}}/>}</h4>
                <span className="badge badge-info">{d.category}</span></div>
            <div className="discussion-meta"><span>By {d.author}</span><span>{d.visibility}</span><span>{new Date(d.createdAt).toLocaleDateString('en-IN')}</span><span>{d.replies?.length||0} replies</span></div>
            <div className="discussion-body">{d.content}</div>
            {d.replies?.map((r,i)=><div key={i} className="reply-card"><strong>{r.author}:</strong> {r.content} <span style={{fontSize:'0.72rem',color:'var(--text-light)',marginLeft:8}}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span></div>)}
            <div className="discussion-actions">
                {!d.locked&&<button className="btn btn-outline btn-sm" onClick={()=>setReplyTo(replyTo===d._id?null:d._id)}><MessageSquare size={14}/> Reply</button>}
                <button className="btn btn-outline btn-sm" onClick={()=>handlePin(d._id)}><Pin size={14}/> {d.pinned?'Unpin':'Pin'}</button>
                <button className="btn btn-outline btn-sm" onClick={()=>handleLock(d._id)}><Lock size={14}/> {d.locked?'Unlock':'Lock'}</button>
                <button className="btn btn-outline btn-sm" onClick={()=>handleDelete(d._id)}><Trash2 size={14}/></button>
            </div>
            {replyTo===d._id && <div style={{display:'flex',gap:10,marginTop:12}}><input className="form-input" style={{flex:1}} placeholder="Write a reply..." value={replyText} onChange={e=>setReplyText(e.target.value)} /><button className="btn btn-primary btn-sm" onClick={()=>handleReply(d._id)}><Send size={14}/></button></div>}
        </div>)}
        {list.length===0&&<div className="collab-empty"><MessageSquare size={40}/><p>No discussions yet</p></div>}
    </div>);
}

// ===== GROUPS =====
function GroupsTab() {
    const [list, setList] = useLocalStorage('collab_groups', []);
    const [form, setForm] = useState({ name: '', description: '', type: 'Custom', visibility: 'Closed', members: [], groupAdmin: ['Admin'] });
    const [show, setShow] = useState(false);
    const [memberName, setMemberName] = useState('');
    const addMember = () => { if (!memberName) return; setForm(f => ({ ...f, members: [...f.members, { name: memberName, role: 'Teacher' }] })); setMemberName(''); };
    const handleSubmit = async e => {
        e.preventDefault();
        const newGroup = { ...form, _id: Date.now().toString(), createdAt: new Date().toISOString() };
        setList([...list, newGroup]);
        setForm({ name: '', description: '', type: 'Custom', visibility: 'Closed', members: [], groupAdmin: ['Admin'] });
        setShow(false);
    };
    const handleDelete = id => {
        if (window.confirm("Are you sure you want to delete this group?")) {
            setList(list.filter(g => g._id !== id));
        }
    };

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h3 style={{margin:0}}>Groups</h3><button className="btn btn-primary" onClick={()=>setShow(!show)}><PlusCircle size={16}/> Create Group</button></div>
        {show && <div className="collab-form-panel"><h3><Users size={18}/> New Group</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Group Name *</label><input className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" rows="2" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Class Group</option><option>Department Group</option><option>Project Group</option><option>Event Group</option><option>Parent-Teacher Group</option><option>Custom</option></select></div>
                <div className="form-group"><label className="form-label">Visibility</label><select className="form-select" value={form.visibility} onChange={e=>setForm({...form,visibility:e.target.value})}><option>Open</option><option>Closed</option></select></div>
            </div>
            <div style={{display:'flex',gap:10,marginBottom:12}}><input className="form-input" placeholder="Add member name" value={memberName} onChange={e=>setMemberName(e.target.value)} style={{flex:1}} /><button type="button" className="btn btn-outline" onClick={addMember}><PlusCircle size={14}/></button></div>
            {form.members.length>0&&<div style={{marginBottom:12,fontSize:'0.85rem'}}>{form.members.map((m,i)=><span key={i} className="badge badge-info" style={{marginRight:6}}>{m.name}</span>)}</div>}
            <div className="form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Create</button></div>
        </form></div>}
        <div className="group-grid">{list.map(g=><div className="group-card" key={g._id}><div style={{display:'flex',justifyContent:'space-between'}}><h4>{g.name}</h4><button className="btn-icon" onClick={()=>handleDelete(g._id)}><Trash2 size={14}/></button></div>
            <div className="group-type">{g.type} · {g.visibility}</div><div className="group-members">{g.members?.length||0} members</div>{g.description&&<p style={{fontSize:'0.82rem',color:'var(--text-light)',marginTop:6}}>{g.description}</p>}</div>)}</div>
        {list.length===0&&<div className="collab-empty"><Users size={40}/><p>No groups yet</p></div>}
    </div>);
}

// ===== FILES =====
// ===== FILES =====
function FilesTab() {
    const [list, setList] = useLocalStorage('collab_files', []);
    const [existingGroups] = useLocalStorage('collab_groups', []);
    const [form, setForm] = useState({ title: '', description: '', category: 'Study Material', audience: 'Everyone', targetId: '', accessLevel: 'Download Allowed', expiryDate: '', file: null });
    const [show, setShow] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert("File too large! Max 5MB allowed for local storage.");
                return;
            }
            setForm({ ...form, file: selectedFile });
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.file) { alert("Please select a file."); return; }
        setIsUploading(true);
        try {
            const base64 = await convertToBase64(form.file);
            const newFile = {
                _id: Date.now().toString(),
                title: form.title,
                description: form.description,
                fileName: form.file.name,
                fileSize: (form.file.size / 1024 / 1024).toFixed(2) + ' MB',
                category: form.category,
                audience: form.audience,
                targetId: form.targetId,
                accessLevel: form.accessLevel,
                expiryDate: form.expiryDate,
                fileData: base64,
                createdAt: new Date().toISOString(),
                uploader: 'Admin'
            };
            setList([newFile, ...list]);
            setForm({ title: '', description: '', category: 'Study Material', audience: 'Everyone', targetId: '', accessLevel: 'Download Allowed', expiryDate: '', file: null });
            setShow(false);
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload file.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = id => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            setList(list.filter(f => f._id !== id));
        }
    };

    const handleDownload = (file) => {
        const link = document.createElement('a');
        link.href = file.fileData;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (<div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h3 style={{ margin: 0 }}>Shared Files</h3><button className="btn btn-primary" onClick={() => setShow(!show)}><PlusCircle size={16} /> Upload File</button></div>
        {show && <div className="collab-form-panel"><h3><FileUp size={18} /> Upload & Share</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">File Title *</label><input className="form-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Science Revision Notes" /></div>
            <div className="form-group"><label className="form-label">Description (Optional)</label><textarea className="form-textarea" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe the content..." /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Select File *</label><input type="file" className="form-input" required onChange={handleFileChange} /></div>
                <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Study Material</option><option>Assignment</option><option>Notice</option><option>Event</option><option>Other</option></select></div>
            </div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Audience</label><select className="form-select" value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value, targetId: '' })}><option>Everyone</option><option>All Staff</option><option>All Students</option><option>Specific Class</option><option>Specific Group</option></select></div>
                <div className="form-group"><label className="form-label">Access Level</label><select className="form-select" value={form.accessLevel} onChange={e => setForm({ ...form, accessLevel: e.target.value })}><option>View Only</option><option>Download Allowed</option><option>Restricted</option></select></div>
            </div>
            {form.audience === 'Specific Class' && (
                <div className="form-group"><label className="form-label">Select Class *</label><select className="form-select" required value={form.targetId} onChange={e => setForm({ ...form, targetId: e.target.value })}><option value="">Select Class</option>{classes.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            )}
            {form.audience === 'Specific Group' && (
                <div className="form-group"><label className="form-label">Select Group *</label><select className="form-select" required value={form.targetId} onChange={e => setForm({ ...form, targetId: e.target.value })}><option value="">Select Group</option>{existingGroups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}</select></div>
            )}
            <div className="form-group"><label className="form-label">Expiry Date (Optional)</label><input type="date" className="form-input" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} /></div>
            <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={isUploading}>{isUploading ? 'Uploading...' : <><FileUp size={16} /> Share File</>}</button></div>
        </form></div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(f => <div className="file-item" key={f._id}>
                <div className="file-item-info">
                    <h5>{f.title}</h5>
                    <p>{f.fileName} · {f.fileSize} · {f.category} · To: {f.audience === 'Specific Class' ? `Class ${f.targetId}` : f.audience === 'Specific Group' ? `Group: ${f.targetId}` : f.audience}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 4 }}>
                        Uploaded: {new Date(f.createdAt).toLocaleDateString('en-IN')} {f.expiryDate && `· Expires: ${new Date(f.expiryDate).toLocaleDateString('en-IN')}`}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleDownload(f)} title="Download"><FileUp size={14} style={{ transform: 'rotate(180deg)' }} /> Download</button>
                    <button className="btn-icon" onClick={() => handleDelete(f._id)}><Trash2 size={14} /></button>
                </div>
            </div>)}
        </div>
        {list.length === 0 && <div className="collab-empty"><FileUp size={40} /><p>No files shared yet</p></div>}
    </div>);
}

// ===== MESSAGES =====
function MessagesTab() {
    const { user } = useAuth();
    const currentUser = user?.name || user?.username || 'Admin';

    // Conversations & messages stored in localStorage
    const [conversations, setConversations] = useLocalStorage('collab_conversations_v2', [
        { id: 'conv_1', type: 'direct', name: 'Rajesh Kumar', role: 'Teacher', participants: ['Admin', 'Rajesh Kumar'], createdAt: new Date(Date.now() - 86400000).toISOString(), lastMessage: { text: 'Please share the exam schedule for Class 10.', sender: 'Rajesh Kumar', time: new Date(Date.now() - 3600000).toISOString() }, unread: 1 },
        { id: 'conv_2', type: 'group', name: 'Science Department', participants: ['Admin', 'Rajesh Kumar', 'Priya Sharma', 'Amit Patel'], createdAt: new Date(Date.now() - 172800000).toISOString(), lastMessage: { text: 'Lab equipment order has been placed.', sender: 'Admin', time: new Date(Date.now() - 7200000).toISOString() }, unread: 0 },
        { id: 'conv_3', type: 'direct', name: 'Priya Sharma', role: 'Parent', participants: ['Admin', 'Priya Sharma'], createdAt: new Date(Date.now() - 259200000).toISOString(), lastMessage: { text: "Thank you for the update on Arjun's progress.", sender: 'Priya Sharma', time: new Date(Date.now() - 86400000).toISOString() }, unread: 2 },
        { id: 'conv_4', type: 'broadcast', name: 'All Staff Announcement', participants: ['All Staff'], createdAt: new Date(Date.now() - 345600000).toISOString(), lastMessage: { text: 'Staff meeting scheduled for Friday at 3 PM.', sender: 'Admin', time: new Date(Date.now() - 172800000).toISOString() }, unread: 0 },
    ]);

    const [allMessages, setAllMessages] = useLocalStorage('collab_all_messages', {
        'conv_1': [
            { id: 'm1', text: 'Good morning! Can we discuss the upcoming exam schedule?', sender: 'Rajesh Kumar', time: new Date(Date.now() - 7200000).toISOString(), status: 'read' },
            { id: 'm2', text: "Sure, I'll prepare the draft and share it by tomorrow.", sender: 'Admin', time: new Date(Date.now() - 5400000).toISOString(), status: 'read' },
            { id: 'm3', text: 'Please share the exam schedule for Class 10.', sender: 'Rajesh Kumar', time: new Date(Date.now() - 3600000).toISOString(), status: 'read' },
        ],
        'conv_2': [
            { id: 'm4', text: 'Team, we need to finalize the lab equipment list for this semester.', sender: 'Admin', time: new Date(Date.now() - 86400000).toISOString(), status: 'delivered' },
            { id: 'm5', text: "I'll compile the list from all sections and share by EOD.", sender: 'Priya Sharma', time: new Date(Date.now() - 43200000).toISOString(), status: 'read' },
            { id: 'm6', text: 'Lab equipment order has been placed.', sender: 'Admin', time: new Date(Date.now() - 7200000).toISOString(), status: 'delivered' },
        ],
        'conv_3': [
            { id: 'm7', text: "Hello, I wanted to check on Arjun's attendance this month.", sender: 'Priya Sharma', time: new Date(Date.now() - 172800000).toISOString(), status: 'read' },
            { id: 'm8', text: 'Arjun has been regular. His attendance is 95% this month.', sender: 'Admin', time: new Date(Date.now() - 129600000).toISOString(), status: 'read' },
            { id: 'm9', text: "Thank you for the update on Arjun's progress.", sender: 'Priya Sharma', time: new Date(Date.now() - 86400000).toISOString(), status: 'read' },
        ],
        'conv_4': [
            { id: 'm10', text: 'Staff meeting scheduled for Friday at 3 PM. Attendance is mandatory.', sender: 'Admin', time: new Date(Date.now() - 172800000).toISOString(), status: 'delivered' },
        ],
    });

    const [activeConvId, setActiveConvId] = useState('conv_1');
    const [input, setInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewMsg, setShowNewMsg] = useState(false);
    const [newMsgType, setNewMsgType] = useState('direct');
    const [recipientSearch, setRecipientSearch] = useState('');
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const chatEndRef = useRef(null);

    // Available contacts (from HR and Students)
    const availableContacts = useMemo(() => {
        const hrStaff = JSON.parse(localStorage.getItem('mzs_staff') || '[]');
        const allStudents = JSON.parse(localStorage.getItem('mzs_students') || '[]');
        
        const contacts = [
            ...hrStaff.map(s => ({ 
                name: s.name, 
                role: s.role || s.dept || 'Staff' 
            })),
            ...allStudents.map(s => ({ 
                name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.name, 
                role: `Student - ${s.class || s.grade || ''}`.trim() 
            })),
            ...allStudents
                .filter(s => s.parentName || s.fatherName)
                .map(s => ({
                    name: s.parentName || s.fatherName,
                    role: `Parent of ${s.firstName || s.name}`.trim()
                }))
        ];
        
        const seen = new Set();
        return contacts.filter(c => {
            if (!c.name || seen.has(c.name) || c.name === currentUser) return false;
            seen.add(c.name);
            return true;
        });
    }, [currentUser]);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allMessages, activeConvId]);

    const activeConversation = conversations.find(c => c.id === activeConvId);
    const activeMessages = allMessages[activeConvId] || [];

    // Filter conversations by search and type
    const filteredConversations = conversations.filter(c => {
        const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || c.type === filterType;
        return matchesSearch && matchesType;
    }).sort((a, b) => {
        const timeA = a.lastMessage?.time ? new Date(a.lastMessage.time) : new Date(a.createdAt);
        const timeB = b.lastMessage?.time ? new Date(b.lastMessage.time) : new Date(b.createdAt);
        return timeB - timeA;
    });

    // Filtered contacts for recipient search
    const filteredContacts = availableContacts.filter(c =>
        c.name.toLowerCase().includes(recipientSearch.toLowerCase()) &&
        !selectedRecipients.find(r => r.name === c.name)
    );

    // Mark conversation as read
    const openConversation = (convId) => {
        setActiveConvId(convId);
        setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread: 0 } : c));
    };

    // Send message
    const sendMessage = () => {
        if (!input.trim() && !attachment) return;
        if (!activeConvId) return;

        const newMsg = {
            id: `msg_${Date.now()}`,
            text: input.trim(),
            sender: currentUser,
            time: new Date().toISOString(),
            status: 'sent',
            attachment: attachment ? { name: attachment.name, size: (attachment.size / 1024 / 1024).toFixed(2) + ' MB', type: attachment.type } : null,
        };

        // Simulate status progression: sent -> delivered -> read
        const msgId = newMsg.id;
        setTimeout(() => {
            setAllMessages(prev => ({
                ...prev,
                [activeConvId]: (prev[activeConvId] || []).map(m => m.id === msgId ? { ...m, status: 'delivered' } : m)
            }));
        }, 1500);
        setTimeout(() => {
            setAllMessages(prev => ({
                ...prev,
                [activeConvId]: (prev[activeConvId] || []).map(m => m.id === msgId ? { ...m, status: 'read' } : m)
            }));
        }, 4000);

        setAllMessages(prev => ({
            ...prev,
            [activeConvId]: [...(prev[activeConvId] || []), newMsg]
        }));

        // Update conversation lastMessage
        setConversations(prev => prev.map(c => c.id === activeConvId ? {
            ...c,
            lastMessage: { text: attachment ? `📎 ${attachment.name}` : input.trim(), sender: currentUser, time: new Date().toISOString() }
        } : c));

        setInput('');
        setAttachment(null);
    };

    // Handle file attachment (PDF / Image, max 10 MB)
    const handleAttachment = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10 MB limit.');
            return;
        }
        const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowed.includes(file.type)) {
            alert('Only PDF and Image files are allowed.');
            return;
        }
        setAttachment(file);
        e.target.value = '';
    };

    // Create new conversation
    const createConversation = () => {
        if (selectedRecipients.length === 0) return;
        if (newMsgType === 'direct') {
            const existing = conversations.find(c => c.type === 'direct' && c.participants.includes(selectedRecipients[0].name));
            if (existing) { setActiveConvId(existing.id); setShowNewMsg(false); setSelectedRecipients([]); setRecipientSearch(''); return; }
        }
        const convId = `conv_${Date.now()}`;
        const newConv = {
            id: convId,
            type: newMsgType,
            name: newMsgType === 'direct' ? selectedRecipients[0].name
                : newMsgType === 'group' ? (groupName || selectedRecipients.map(r => r.name).join(', '))
                : `Broadcast: ${selectedRecipients.map(r => r.name).join(', ')}`,
            role: newMsgType === 'direct' ? selectedRecipients[0].role : undefined,
            participants: newMsgType === 'broadcast' ? selectedRecipients.map(r => r.name) : [currentUser, ...selectedRecipients.map(r => r.name)],
            createdAt: new Date().toISOString(),
            lastMessage: null,
            unread: 0,
        };
        setConversations(prev => [newConv, ...prev]);
        setAllMessages(prev => ({ ...prev, [convId]: [] }));
        setActiveConvId(convId);
        setShowNewMsg(false);
        setSelectedRecipients([]);
        setGroupName('');
        setRecipientSearch('');
        setNewMsgType('direct');
    };

    // Delete conversation
    const deleteConversation = (convId, e) => {
        e?.stopPropagation();
        if (!window.confirm('Delete this conversation?')) return;
        setConversations(prev => prev.filter(c => c.id !== convId));
        setAllMessages(prev => { const copy = { ...prev }; delete copy[convId]; return copy; });
        if (activeConvId === convId) {
            const remaining = conversations.filter(c => c.id !== convId);
            setActiveConvId(remaining[0]?.id || null);
        }
    };

    // Status indicator component
    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'sent': return <Check size={13} className="msg-status-icon msg-status-sent" />;
            case 'delivered': return <CheckCheck size={13} className="msg-status-icon msg-status-delivered" />;
            case 'read': return <CheckCheck size={13} className="msg-status-icon msg-status-read" />;
            case 'failed': return <AlertCircle size={13} className="msg-status-icon msg-status-failed" />;
            default: return null;
        }
    };

    // Format time for display
    const formatTime = (isoStr) => {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        const now = new Date();
        const diffDays = Math.floor((now - d) / 86400000);
        const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        if (diffDays === 0) return timeStr;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return d.toLocaleDateString('en-IN', { weekday: 'short' });
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    };

    const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);

    return (<div className="animate-fade-in">
        <div className="msg-container-v2">
            {/* ===== LEFT SIDEBAR ===== */}
            <div className="msg-sidebar-v2">
                <div className="msg-sidebar-header">
                    <h3><Mail size={18} /> Messages {totalUnread > 0 && <span className="msg-unread-total">{totalUnread}</span>}</h3>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowNewMsg(true)} title="New Message"><PlusCircle size={14} /> New</button>
                </div>

                <div className="msg-search-bar">
                    <Search size={15} className="msg-search-icon" />
                    <input placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    {searchQuery && <button className="msg-search-clear" onClick={() => setSearchQuery('')}><X size={14} /></button>}
                </div>

                <div className="msg-type-filters">
                    {[{ key: 'all', label: 'All' }, { key: 'direct', label: 'Direct' }, { key: 'group', label: 'Groups' }, { key: 'broadcast', label: 'Broadcast' }].map(f =>
                        <button key={f.key} className={`msg-filter-btn ${filterType === f.key ? 'active' : ''}`} onClick={() => setFilterType(f.key)}>{f.label}</button>
                    )}
                </div>

                <div className="msg-conv-list">
                    {filteredConversations.map(c => (
                        <div key={c.id} className={`msg-conv-item ${activeConvId === c.id ? 'active' : ''} ${c.unread ? 'has-unread' : ''}`} onClick={() => openConversation(c.id)}>
                            <div className={`msg-conv-avatar msg-avatar-${c.type}`}>{getInitials(c.name)}</div>
                            <div className="msg-conv-info">
                                <div className="msg-conv-top-row">
                                    <h5>
                                        {c.name}
                                        {c.type === 'direct' && c.role && <span style={{ fontSize: '0.8em', opacity: 0.7, fontWeight: 'normal', marginLeft: '4px' }}>({c.role})</span>}
                                    </h5>
                                    <span className="msg-conv-time">{c.lastMessage ? formatTime(c.lastMessage.time) : ''}</span>
                                </div>
                                <div className="msg-conv-bottom-row">
                                    <p>{c.lastMessage ? (c.lastMessage.sender === currentUser ? `You: ${c.lastMessage.text}` : c.lastMessage.text) : 'No messages yet'}</p>
                                    <div className="msg-conv-badges">
                                        {c.unread > 0 && <span className="msg-unread-badge">{c.unread}</span>}
                                    </div>
                                </div>
                            </div>
                            <span className={`msg-type-indicator msg-indicator-${c.type}`} title={c.type}>
                                {c.type === 'direct' ? <Mail size={11} /> : c.type === 'group' ? <Users size={11} /> : <Radio size={11} />}
                            </span>
                        </div>
                    ))}
                    {filteredConversations.length === 0 && <div className="msg-no-conv"><Mail size={28} /><p>No conversations found</p></div>}
                </div>
            </div>

            {/* ===== RIGHT CHAT AREA ===== */}
            <div className="msg-chat-area-v2">
                {activeConversation ? (<>
                    {/* Chat Header */}
                    <div className="msg-chat-header">
                        <div className="msg-chat-header-left">
                            <div className={`msg-conv-avatar msg-avatar-${activeConversation.type}`}>{getInitials(activeConversation.name)}</div>
                            <div>
                                <h4>
                                    {activeConversation.name}
                                    {activeConversation.type === 'direct' && activeConversation.role && <span style={{ fontSize: '0.85em', opacity: 0.8, fontWeight: 'normal', marginLeft: '6px' }}>({activeConversation.role})</span>}
                                </h4>
                                <span className="msg-chat-subtitle">
                                    {activeConversation.type === 'direct' ? (activeConversation.role || 'User') :
                                     activeConversation.type === 'group' ? `${activeConversation.participants?.length || 0} participants` :
                                     `Broadcast · ${activeConversation.participants?.length || 0} recipients`}
                                </span>
                            </div>
                        </div>
                        <div className="msg-chat-header-right">
                            <span className={`msg-type-pill msg-pill-${activeConversation.type}`}>
                                {activeConversation.type === 'direct' ? <><Mail size={12} /> Direct</> :
                                 activeConversation.type === 'group' ? <><Users size={12} /> Group</> :
                                 <><Radio size={12} /> Broadcast</>}
                            </span>
                            <button className="btn-icon" title="Delete conversation" onClick={(e) => deleteConversation(activeConversation.id, e)}><Trash2 size={16} /></button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="msg-messages-area">
                        {activeMessages.length === 0 && <div className="msg-empty-chat"><Send size={36} /><p>No messages yet. Start the conversation!</p></div>}
                        {activeMessages.map((m, i) => {
                            const isSent = m.sender === currentUser;
                            const showDate = i === 0 || new Date(m.time).toDateString() !== new Date(activeMessages[i - 1].time).toDateString();
                            return (
                                <React.Fragment key={m.id}>
                                    {showDate && <div className="msg-date-divider"><span>{new Date(m.time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span></div>}
                                    <div className={`msg-bubble-v2 ${isSent ? 'sent' : 'received'}`}>
                                        {!isSent && activeConversation.type !== 'direct' && <span className="msg-sender-label">{m.sender}</span>}
                                        {m.attachment && (
                                            <div className="msg-file-chip">
                                                {m.attachment.type?.startsWith('image/') ? <ImageIcon size={15} /> : <FileText size={15} />}
                                                <span className="msg-file-name">{m.attachment.name}</span>
                                                <span className="msg-file-size">{m.attachment.size}</span>
                                            </div>
                                        )}
                                        {m.text && <p className="msg-text">{m.text}</p>}
                                        <div className="msg-bubble-meta">
                                            <span className="msg-timestamp">{new Date(m.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                            {isSent && <StatusIcon status={m.status} />}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Attachment Preview */}
                    {attachment && (
                        <div className="msg-attach-preview">
                            <Paperclip size={14} />
                            <span className="msg-attach-name">{attachment.name}</span>
                            <span className="msg-attach-size">({(attachment.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <button className="btn-icon" onClick={() => setAttachment(null)}><X size={14} /></button>
                        </div>
                    )}

                    {/* Input Bar */}
                    <div className="msg-input-bar-v2">
                        <label className="msg-attach-trigger" title="Attach file (PDF / Image, max 10 MB)">
                            <Paperclip size={18} />
                            <input type="file" accept=".pdf,image/*" onChange={handleAttachment} style={{ display: 'none' }} />
                        </label>
                        <input className="form-input msg-text-input" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
                        <button className="btn btn-primary msg-send-btn" onClick={sendMessage} disabled={!input.trim() && !attachment}><Send size={16} /></button>
                    </div>
                </>) : (
                    <div className="msg-no-selection">
                        <div className="msg-no-sel-icon"><Mail size={48} /></div>
                        <h3>Select a conversation</h3>
                        <p>Choose from your existing conversations or start a new one</p>
                        <button className="btn btn-primary" onClick={() => setShowNewMsg(true)}><PlusCircle size={16} /> New Message</button>
                    </div>
                )}
            </div>
        </div>

        {/* ===== NEW MESSAGE MODAL ===== */}
        {showNewMsg && (
            <div className="msg-modal-overlay" onClick={() => setShowNewMsg(false)}>
                <div className="msg-modal" onClick={e => e.stopPropagation()}>
                    <div className="msg-modal-header">
                        <h3><PlusCircle size={18} /> New Message</h3>
                        <button className="btn-icon" onClick={() => { setShowNewMsg(false); setSelectedRecipients([]); setRecipientSearch(''); setGroupName(''); setNewMsgType('direct'); }}><X size={18} /></button>
                    </div>

                    <div className="msg-modal-body">
                        <div className="form-group">
                            <label className="form-label">Message Type</label>
                            <div className="msg-type-selector">
                                {[
                                    { key: 'direct', label: 'Direct Message', icon: Mail, desc: 'One-on-one private conversation' },
                                    { key: 'group', label: 'Group Message', icon: Users, desc: 'Collaboration group channel' },
                                    { key: 'broadcast', label: 'Broadcast', icon: Radio, desc: 'One-way mass message to a role' },
                                ].map(t => {
                                    const Icon = t.icon;
                                    return (
                                        <button key={t.key} className={`msg-type-option ${newMsgType === t.key ? 'active' : ''}`} onClick={() => { setNewMsgType(t.key); setSelectedRecipients([]); }}>
                                            <Icon size={20} />
                                            <strong>{t.label}</strong>
                                            <span>{t.desc}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {newMsgType === 'group' && (
                            <div className="form-group">
                                <label className="form-label">Group Name</label>
                                <input className="form-input" placeholder="e.g. Science Department" value={groupName} onChange={e => setGroupName(e.target.value)} />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">
                                {newMsgType === 'direct' ? 'Select Recipient' : newMsgType === 'group' ? 'Add Members' : 'Select Recipients (Role / All)'}
                            </label>

                            {selectedRecipients.length > 0 && (
                                <div className="msg-selected-chips">
                                    {selectedRecipients.map((r, i) => (
                                        <span key={i} className="msg-chip">
                                            {r.name}
                                            <button onClick={() => setSelectedRecipients(prev => prev.filter((_, idx) => idx !== i))}><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="msg-recipient-search">
                                <Search size={14} />
                                <input placeholder="Search by name..." value={recipientSearch} onChange={e => setRecipientSearch(e.target.value)} />
                            </div>

                            <div className="msg-contact-list">
                                {newMsgType === 'broadcast' && (
                                    <>
                                        {[{ name: 'All Staff', role: 'Role' }, { name: 'All Students', role: 'Role' }, { name: 'All Parents', role: 'Role' }, { name: 'All Users', role: 'Everyone' }]
                                            .filter(r => !selectedRecipients.find(s => s.name === r.name) && r.name.toLowerCase().includes(recipientSearch.toLowerCase()))
                                            .map((r, i) => (
                                                <div key={`role_${i}`} className="msg-contact-row" onClick={() => { setSelectedRecipients([r]); setRecipientSearch(''); }}>
                                                    <div className="msg-contact-avatar-sm"><Radio size={14} /></div>
                                                    <div className="msg-contact-detail"><strong>{r.name}</strong><span>{r.role}</span></div>
                                                </div>
                                            ))}
                                    </>
                                )}
                                {filteredContacts.slice(0, 8).map((c, i) => (
                                    <div key={i} className="msg-contact-row" onClick={() => {
                                        if (newMsgType === 'direct') { setSelectedRecipients([c]); }
                                        else { setSelectedRecipients(prev => [...prev, c]); }
                                        setRecipientSearch('');
                                    }}>
                                        <div className="msg-contact-avatar-sm">{getInitials(c.name)}</div>
                                        <div className="msg-contact-detail"><strong>{c.name}</strong><span>{c.role}</span></div>
                                    </div>
                                ))}
                                {filteredContacts.length === 0 && recipientSearch && <p className="msg-no-results">No contacts found for "{recipientSearch}"</p>}
                            </div>
                        </div>
                    </div>

                    <div className="msg-modal-footer">
                        <button className="btn btn-outline" onClick={() => { setShowNewMsg(false); setSelectedRecipients([]); setRecipientSearch(''); setGroupName(''); setNewMsgType('direct'); }}>Cancel</button>
                        <button className="btn btn-primary" onClick={createConversation} disabled={selectedRecipients.length === 0}>
                            <Send size={14} /> Start Conversation
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>);
}

// ===== MEETINGS =====
function MeetingsTab() {
    const { data: list, refresh } = useApi('/meetings');
    const [form, setForm] = useState({title:'',agenda:'',type:'Online',date:'',startTime:'',endTime:'',platform:'Manual Link',meetingLink:''});
    const [show, setShow] = useState(false);
    const handleSubmit = async e => { e.preventDefault(); await fetch(`${API}/meetings`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({title:'',agenda:'',type:'Online',date:'',startTime:'',endTime:'',platform:'Manual Link',meetingLink:''}); setShow(false); refresh(); };
    const handleDelete = async id => { await fetch(`${API}/meetings/${id}`,{method:'DELETE'}); refresh(); };
    const statusCls = s => s==='Scheduled'?'badge-scheduled':s==='In Progress'?'badge-in-progress':s==='Completed'?'badge-completed':s==='Cancelled'?'badge-cancelled':'badge-info';

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h3 style={{margin:0}}>Meetings</h3><button className="btn btn-primary" onClick={()=>setShow(!show)}><PlusCircle size={16}/> Schedule</button></div>
        {show && <div className="collab-form-panel"><h3><Video size={18}/> Schedule Meeting</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Agenda</label><textarea className="form-textarea" rows="2" value={form.agenda} onChange={e=>setForm({...form,agenda:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Online</option><option>In-person</option><option>Hybrid</option></select></div>
                <div className="form-group"><label className="form-label">Date *</label><input type="date" className="form-input" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
            </div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Start Time *</label><input type="time" className="form-input" required value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">End Time *</label><input type="time" className="form-input" required value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} /></div>
            </div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Platform</label><select className="form-select" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}><option>Zoom</option><option>Google Meet</option><option>Microsoft Teams</option><option>Manual Link</option><option>N/A</option></select></div>
                <div className="form-group"><label className="form-label">Meeting Link</label><input className="form-input" placeholder="https://..." value={form.meetingLink} onChange={e=>setForm({...form,meetingLink:e.target.value})} /></div>
            </div>
            <div className="form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Schedule</button></div>
        </form></div>}
        {list.map(m=><div className="meeting-card" key={m._id}><div className="meeting-info"><h4>{m.title}</h4><p><Calendar size={14} style={{verticalAlign:'middle',marginRight:4}}/>{m.date?new Date(m.date).toLocaleDateString('en-IN'):''} · {m.startTime}–{m.endTime} · {m.type} · {m.platform}</p></div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}><span className={`badge ${statusCls(m.status)}`}>{m.status}</span>{m.meetingLink&&<a href={m.meetingLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">Join</a>}<button className="btn-icon" onClick={()=>handleDelete(m._id)}><Trash2 size={14}/></button></div></div>)}
        {list.length===0&&<div className="collab-empty"><Video size={40}/><p>No meetings scheduled</p></div>}
    </div>);
}

// ===== TASKS =====
function TasksTab() {
    const { data: list, refresh } = useApi('/tasks');
    const [form, setForm] = useState({title:'',description:'',dueDate:'',priority:'Medium',assignedTo:[{name:'',role:'Teacher'}]});
    const [show, setShow] = useState(false);
    const handleSubmit = async e => { e.preventDefault(); const f = {...form,assignedTo:form.assignedTo.filter(a=>a.name)}; await fetch(`${API}/tasks`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); setForm({title:'',description:'',dueDate:'',priority:'Medium',assignedTo:[{name:'',role:'Teacher'}]}); setShow(false); refresh(); };
    const handleStatus = async (id,status) => { await fetch(`${API}/tasks/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})}); refresh(); };
    const handleDelete = async id => { await fetch(`${API}/tasks/${id}`,{method:'DELETE'}); refresh(); };
    const priorityCls = p => p==='Low'?'badge-low':p==='Medium'?'badge-medium':p==='High'?'badge-high':'badge-urgent';
    const statusCls = s => s==='Pending'?'badge-pending':s==='In Progress'?'badge-in-progress':s==='Completed'?'badge-completed':s==='Overdue'?'badge-overdue':'badge-cancelled';

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h3 style={{margin:0}}>Tasks</h3><button className="btn btn-primary" onClick={()=>setShow(!show)}><PlusCircle size={16}/> Add Task</button></div>
        {show && <div className="collab-form-panel"><h3><CheckSquare size={18}/> Create Task</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" rows="2" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Due Date *</label><input type="date" className="form-input" required value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Assign To</label><input className="form-input" placeholder="Name" value={form.assignedTo[0]?.name||''} onChange={e=>setForm({...form,assignedTo:[{name:e.target.value,role:'Teacher'}]})} /></div>
            <div className="form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Save</button></div>
        </form></div>}
        <div className="task-list">{list.map(t=><div className="task-card" key={t._id}>
            <div className="task-info"><h4>{t.title}</h4><p>{t.assignedTo?.map(a=>a.name).join(', ')||'Unassigned'} · Due: {t.dueDate?new Date(t.dueDate).toLocaleDateString('en-IN'):'—'}</p></div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span className={`badge ${priorityCls(t.priority)}`}>{t.priority}</span>
                <span className={`badge ${statusCls(t.status)}`}>{t.status}</span>
                {t.status==='Pending'&&<button className="btn btn-outline btn-sm" onClick={()=>handleStatus(t._id,'In Progress')}>Start</button>}
                {t.status==='In Progress'&&<button className="btn btn-outline btn-sm" onClick={()=>handleStatus(t._id,'Completed')}>Done</button>}
                <button className="btn-icon" onClick={()=>handleDelete(t._id)}><Trash2 size={14}/></button>
            </div></div>)}</div>
        {list.length===0&&<div className="collab-empty"><CheckSquare size={40}/><p>No tasks yet</p></div>}
    </div>);
}

// ===== NOTICES =====
function NoticesTab() {
    const { data: list, refresh } = useApi('/notices');
    const [form, setForm] = useState({title:'',content:'',effectiveDate:'',expiryDate:'',visibility:'Entire School'});
    const [show, setShow] = useState(false);
    const handleSubmit = async e => { e.preventDefault(); await fetch(`${API}/notices`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({title:'',content:'',effectiveDate:'',expiryDate:'',visibility:'Entire School'}); setShow(false); refresh(); };
    const handlePin = async id => { await fetch(`${API}/notices/${id}/pin`,{method:'PUT'}); refresh(); };
    const handleDelete = async id => { await fetch(`${API}/notices/${id}`,{method:'DELETE'}); refresh(); };

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h3 style={{margin:0}}>Notice Board</h3><button className="btn btn-primary" onClick={()=>setShow(!show)}><PlusCircle size={16}/> Post Notice</button></div>
        {show && <div className="collab-form-panel"><h3><Clipboard size={18}/> New Notice</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Content *</label><textarea className="form-textarea" rows="3" required value={form.content} onChange={e=>setForm({...form,content:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Effective Date</label><input type="date" className="form-input" value={form.effectiveDate} onChange={e=>setForm({...form,effectiveDate:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Expiry Date</label><input type="date" className="form-input" value={form.expiryDate} onChange={e=>setForm({...form,expiryDate:e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Visibility</label><select className="form-select" value={form.visibility} onChange={e=>setForm({...form,visibility:e.target.value})}><option>Entire School</option><option>Staff Only</option><option>Students Only</option><option>Specific Department</option></select></div>
            <div className="form-actions"><button type="submit" className="btn btn-primary"><Send size={16}/> Post</button></div>
        </form></div>}
        {list.map(n=><div className={`notice-card ${n.pinned?'pinned':''}`} key={n._id}><div style={{display:'flex',justifyContent:'space-between'}}><h4>{n.pinned&&<Pin size={14} style={{marginRight:6,color:'var(--warning)'}}/>}{n.title}</h4>
            <div style={{display:'flex',gap:8}}><span className={`badge ${n.status==='Active'?'badge-completed':n.status==='Expired'?'badge-overdue':'badge-pending'}`}>{n.status}</span>
                <button className="btn-icon" onClick={()=>handlePin(n._id)}><Pin size={14}/></button><button className="btn-icon" onClick={()=>handleDelete(n._id)}><Trash2 size={14}/></button></div></div>
            <div className="notice-meta"><span>{n.visibility}</span>{n.expiryDate&&<span>Expires: {new Date(n.expiryDate).toLocaleDateString('en-IN')}</span>}<span>{new Date(n.createdAt).toLocaleDateString('en-IN')}</span></div>
            <div className="notice-body">{n.content}</div></div>)}
        {list.length===0&&<div className="collab-empty"><Clipboard size={40}/><p>No notices posted yet</p></div>}
    </div>);
}

// ===== SETTINGS =====
function SettingsTab() {
    const rbac = [
        ['Create Announcement','Yes','Yes','Class scope','No','No'],['Create Discussion','Yes','Yes','Yes','Participate','No'],['Moderate Discussion','Yes','Yes','Own topics','No','No'],
        ['Create Group','Yes','Yes','Yes','No','No'],['View Group','Yes','Yes','Member','Member','Member'],['Upload Files','Yes','Yes','Yes','In group','No'],
        ['Download Files','Yes','Yes','Yes','If permitted','Announced'],['Send Direct Message','Yes','Yes','Yes','Peers/Teacher','Teacher only'],
        ['Schedule Meeting','Yes','Yes','Yes','No','No'],['Create Task','Yes','Yes','Yes','No','No'],['Post Notice','Yes','Yes','Class scope','No','No'],['Module Settings','Yes','Yes','No','No','No']];
    return (<div className="animate-fade-in collab-settings-grid">
        <div className="collab-settings-panel"><h3><Settings size={18}/> Module Settings</h3>
            <table className="data-table" style={{fontSize:'0.85rem'}}><thead><tr><th>Setting</th><th>Value</th></tr></thead><tbody>
                {[['Max File Upload Size','25 MB'],['Allowed File Types','PDF, DOCX, JPG, PNG, MP4'],['Message Rate Limit','10 / minute'],['Moderation Mode','Post-publish'],['Notification Frequency','Real-time'],
                  ['Parent Messaging','Enabled'],['Student Group Creation','Disabled'],['External Meeting Links','Enabled'],['Activity Feed Retention','90 days']].map(([k,v],i)=><tr key={i}><td className="fw-600">{k}</td><td>{v}</td></tr>)}
            </tbody></table></div>
        <div className="collab-settings-panel"><h3><Users size={18}/> Role-Based Access Matrix</h3>
            <table className="collab-rbac-table"><thead><tr><th>Feature</th><th>Super Admin</th><th>Admin</th><th>Teacher</th><th>Student</th><th>Parent</th></tr></thead>
                <tbody>{rbac.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} style={j>0?{color:c==='Yes'?'var(--success)':c==='No'?'var(--danger)':'var(--warning)',fontWeight:600}:undefined}>{c}</td>)}</tr>)}</tbody></table></div>
    </div>);
}

// ===== MAIN =====
const TABS = [
    { id:'dashboard', label:'Dashboard', icon:LayoutDashboard },
    { id:'announcements', label:'Announcements', icon:Megaphone },
    { id:'discussions', label:'Discussions', icon:MessageSquare },
    { id:'groups', label:'Groups', icon:Users },
    { id:'files', label:'Files', icon:FileUp },
    { id:'messages', label:'Messages', icon:Mail },
    { id:'meetings', label:'Meetings', icon:Video },
    { id:'tasks', label:'Tasks', icon:CheckSquare },
    { id:'notices', label:'Notice Board', icon:Clipboard },
    { id:'settings', label:'Settings', icon:Settings },
];

export default function Collaborate() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard');
    const handleNavigate = tab => { setActiveTab(tab); setSearchParams({ tab }); };
    useEffect(() => { if(tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl); }, [tabFromUrl]);

    return (
        <div className="collab-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb"><Link to="/">Dashboard</Link><span className="separator">/</span><span>Collaborate</span>
                    {activeTab!=='dashboard'&&<><span className="separator">/</span><span style={{textTransform:'capitalize'}}>{TABS.find(t=>t.id===activeTab)?.label}</span></>}</div>
                <h1>Collaborate</h1>
            </div></div>
            <div className="card collab-card">
                <div className="tabs-header">{TABS.map(tab=>{const Icon=tab.icon;return <button key={tab.id} className={`tab-btn ${activeTab===tab.id?'active':''}`} onClick={()=>handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>;})}</div>
                <div className="tabs-content">
                    {activeTab==='dashboard'&&<DashboardTab onNavigate={handleNavigate}/>}{activeTab==='announcements'&&<AnnouncementsTab/>}{activeTab==='discussions'&&<DiscussionsTab/>}
                    {activeTab==='groups'&&<GroupsTab/>}{activeTab==='files'&&<FilesTab/>}{activeTab==='messages'&&<MessagesTab/>}
                    {activeTab==='meetings'&&<MeetingsTab/>}{activeTab==='tasks'&&<TasksTab/>}{activeTab==='notices'&&<NoticesTab/>}{activeTab==='settings'&&<SettingsTab/>}
                </div>
            </div>
        </div>
    );
}
