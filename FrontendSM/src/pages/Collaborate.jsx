import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, Megaphone, MessageSquare, Users, FileUp, Mail,
    Video, CheckSquare, Clipboard, Activity, Settings, Save, PlusCircle,
    Trash2, Pin, Lock, Send, Eye, Calendar, Clock, ChevronRight
} from 'lucide-react';
import './Collaborate.css';

const API = '/api/collaborate';
function useApi(ep) {
    const [data, setData] = useState([]); const [loading, setLoading] = useState(true);
    const fetch_ = useCallback(async () => { try { setLoading(true); const r = await fetch(`${API}${ep}`); const d = await r.json(); setData(d); } catch(e){console.error(e);} finally {setLoading(false);} }, [ep]);
    useEffect(() => { fetch_(); }, [fetch_]); return { data, loading, refresh: fetch_ };
}

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
    const { data: list, refresh } = useApi('/announcements');
    const [form, setForm] = useState({title:'',content:'',category:'General',audience:'Everyone',publishMode:'Immediate',sendNotification:false,status:'Published'});
    const [show, setShow] = useState(false);
    const handleSubmit = async e => { e.preventDefault(); await fetch(`${API}/announcements`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({title:'',content:'',category:'General',audience:'Everyone',publishMode:'Immediate',sendNotification:false,status:'Published'}); setShow(false); refresh(); };
    const handleDelete = async id => { await fetch(`${API}/announcements/${id}`,{method:'DELETE'}); refresh(); };
    const statusCls = s => s==='Draft'?'badge-draft':s==='Scheduled'?'badge-scheduled':s==='Published'?'badge-published':'badge-completed';

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h3 style={{margin:0}}>Announcements</h3><button className="btn btn-primary" onClick={()=>setShow(!show)}><PlusCircle size={16}/> Create</button></div>
        {show && <div className="collab-form-panel"><h3><Megaphone size={18}/> New Announcement</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Content *</label><textarea className="form-textarea" rows="3" required value={form.content} onChange={e=>setForm({...form,content:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Academic</option><option>General</option><option>Urgent</option><option>Event</option><option>Holiday</option></select></div>
                <div className="form-group"><label className="form-label">Audience *</label><select className="form-select" value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})}><option>Everyone</option><option>All Staff</option><option>All Students</option><option>All Parents</option><option>Specific Class</option><option>Specific Group</option></select></div>
            </div>
            <div className="form-actions"><button type="submit" className="btn btn-primary"><Send size={16}/> Publish</button></div>
        </form></div>}
        {list.map(a => <div key={a._id} className="notice-card"><div style={{display:'flex',justifyContent:'space-between'}}><h4>{a.title}</h4><div style={{display:'flex',gap:8,alignItems:'center'}}><span className={`badge ${statusCls(a.status)}`}>{a.status}</span><span className="badge badge-info">{a.category}</span><button className="btn-icon" onClick={()=>handleDelete(a._id)}><Trash2 size={14}/></button></div></div>
            <div className="notice-meta"><span>To: {a.audience}</span><span>{new Date(a.createdAt).toLocaleDateString('en-IN')}</span></div><div className="notice-body">{a.content}</div></div>)}
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
    const { data: list, refresh } = useApi('/groups');
    const [form, setForm] = useState({name:'',description:'',type:'Custom',visibility:'Closed',members:[],groupAdmin:['Admin']});
    const [show, setShow] = useState(false);
    const [memberName, setMemberName] = useState('');
    const addMember = () => { if(!memberName) return; setForm(f=>({...f,members:[...f.members,{name:memberName,role:'Teacher'}]})); setMemberName(''); };
    const handleSubmit = async e => { e.preventDefault(); await fetch(`${API}/groups`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({name:'',description:'',type:'Custom',visibility:'Closed',members:[],groupAdmin:['Admin']}); setShow(false); refresh(); };
    const handleDelete = async id => { await fetch(`${API}/groups/${id}`,{method:'DELETE'}); refresh(); };

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
function FilesTab() {
    const { data: list, refresh } = useApi('/files');
    const [form, setForm] = useState({title:'',description:'',fileName:'document.pdf',category:'Other',audience:'Everyone',accessLevel:'Download Allowed'});
    const [show, setShow] = useState(false);
    const handleSubmit = async e => { e.preventDefault(); await fetch(`${API}/files`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({title:'',description:'',fileName:'document.pdf',category:'Other',audience:'Everyone',accessLevel:'Download Allowed'}); setShow(false); refresh(); };
    const handleDelete = async id => { await fetch(`${API}/files/${id}`,{method:'DELETE'}); refresh(); };

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h3 style={{margin:0}}>Shared Files</h3><button className="btn btn-primary" onClick={()=>setShow(!show)}><PlusCircle size={16}/> Upload File</button></div>
        {show && <div className="collab-form-panel"><h3><FileUp size={18}/> Upload & Share</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">File Title *</label><input className="form-input" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">File Name *</label><input className="form-input" required value={form.fileName} onChange={e=>setForm({...form,fileName:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Study Material</option><option>Assignment</option><option>Notice</option><option>Event</option><option>Other</option></select></div>
                <div className="form-group"><label className="form-label">Access Level</label><select className="form-select" value={form.accessLevel} onChange={e=>setForm({...form,accessLevel:e.target.value})}><option>View Only</option><option>Download Allowed</option><option>Restricted</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Audience</label><select className="form-select" value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})}><option>Everyone</option><option>All Staff</option><option>All Students</option><option>Specific Group</option><option>Specific Class</option></select></div>
            <div className="form-actions"><button type="submit" className="btn btn-primary"><FileUp size={16}/> Share</button></div>
        </form></div>}
        {list.map(f=><div className="file-item" key={f._id}><div className="file-item-info"><h5>{f.title}</h5><p>{f.fileName} · {f.category} · {f.audience} · {f.accessLevel}</p></div><button className="btn-icon" onClick={()=>handleDelete(f._id)}><Trash2 size={14}/></button></div>)}
        {list.length===0&&<div className="collab-empty"><FileUp size={40}/><p>No files shared yet</p></div>}
    </div>);
}

// ===== MESSAGES =====
function MessagesTab() {
    const [conversations] = useState([{id:1,name:'John Teacher',preview:'Hi, regarding the meeting...'},{id:2,name:'Science Dept.',preview:'New curriculum updates'},{id:3,name:'Parent Group',preview:'Annual day schedule'}]);
    const [activeCon, setActiveCon] = useState(1);
    const [messages, setMessages] = useState([{text:'Hi, regarding the meeting tomorrow.',sent:false},{text:'Yes, I will be there at 10 AM.',sent:true},{text:'Great, please bring the reports.',sent:false}]);
    const [input, setInput] = useState('');
    const sendMsg = () => { if(!input.trim()) return; setMessages(m=>[...m,{text:input,sent:true}]); setInput(''); };

    return (<div className="animate-fade-in">
        <div className="msg-container">
            <div className="msg-sidebar">{conversations.map(c=><div key={c.id} className={`msg-sidebar-item ${activeCon===c.id?'active':''}`} onClick={()=>setActiveCon(c.id)}><h5>{c.name}</h5><p>{c.preview}</p></div>)}</div>
            <div className="msg-chat-area">
                <div className="msg-chat-messages">{messages.map((m,i)=><div key={i} className={`msg-bubble ${m.sent?'sent':'received'}`}>{m.text}</div>)}</div>
                <div className="msg-input-bar"><input className="form-input" placeholder="Type a message..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} /><button className="btn btn-primary" onClick={sendMsg}><Send size={16}/></button></div>
            </div>
        </div>
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
