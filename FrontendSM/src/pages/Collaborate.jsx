import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
    const { user } = useAuth();
    const userName = user?.name || '';
    const { data: kpi } = useApi(`/dashboard?user=${encodeURIComponent(userName)}`);
    const roleStr = user?.role?.toLowerCase() || '';
    const isStaff = roleStr.includes('admin') || roleStr.includes('principal') || roleStr.includes('teacher') || roleStr.includes('staff');
    const isParent = roleStr.includes('parent');
    const isStudent = roleStr.includes('student');

    const cards = [
        ...(!isParent ? [{ label:'Active Discussions', val:kpi.activeDiscussions||0, color:'var(--info)', bg:'var(--info-light)', icon:MessageSquare }] : []),
        { label:'Messages Sent Today', val:kpi.messagesToday||0, color:'var(--accent)', bg:'var(--accent-light)', icon:Mail },
        ...(!isParent ? [{ label:'Shared Files', val:kpi.sharedFilesToday||0, color:'var(--warning)', bg:'var(--warning-light)', icon:FileUp }] : []),
        { label:'Announcements Posted', val:kpi.announcementsThisWeek||0, color:'var(--success)', bg:'var(--success-light)', icon:Megaphone },
        { label:'Groups Created', val:kpi.activeGroups||0, color:'var(--primary)', bg:'rgba(11,60,93,0.1)', icon:Users },
        ...(isStaff ? [{ label:'Pending Replies', val:kpi.pendingReplies||0, color:'var(--danger)', bg:'var(--danger-light)', icon:Clock }] : []),
    ];
    
    // Quick actions (hide write-only actions for student/parent)
    const actions = [
        ...(isStaff ? [
            { label:'Create Announcement', icon:Megaphone, tab:'announcements' }, 
            { label:'Schedule Meeting', icon:Video, tab:'meetings' }, 
            { label:'Post Notice', icon:Clipboard, tab:'notices' }
        ] : []),
        ...(!isParent ? [{ label:'Start Discussion', icon:MessageSquare, tab:'discussions' }] : []),
        ...(!isParent ? [{ label:'Share File', icon:FileUp, tab:'files' }] : []),
        { label:'Create Group', icon:Users, tab:'groups' },
    ];
    const { data: activities } = useApi(`/activity?user=${encodeURIComponent(userName)}&role=${encodeURIComponent(roleStr)}`);

    const getIcon = (name) => {
        switch (name) {
            case 'Megaphone': return Megaphone;
            case 'MessageSquare': return MessageSquare;
            case 'FileUp': return FileUp;
            case 'Video': return Video;
            case 'CheckSquare': return CheckSquare;
            case 'Clipboard': return Clipboard;
            default: return Activity;
        }
    };

    return (<div className="animate-fade-in">
        <div className="collab-kpi-grid">{cards.map((c,i)=>{const I=c.icon;return <div className="collab-kpi-card" key={i}><div className="collab-kpi-icon" style={{background:c.bg}}><I size={24} style={{color:c.color}}/></div><div className="collab-kpi-info"><h4>{c.val}</h4><p>{c.label}</p></div></div>})}</div>
        <div className="collab-section-divider"><Activity size={18}/> Quick Actions</div>
        <div className="collab-quick-actions" style={{marginBottom: 30}}>{actions.map((a,i)=>{const I=a.icon;return <button key={i} className="collab-quick-btn" onClick={()=>onNavigate(a.tab)}><I size={18}/>{a.label}</button>})}</div>
        
        <div className="collab-section-divider"><Clock size={18}/> Activity Stream & Notifications</div>
        <div className="activity-stream" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 15 }}>
            {activities?.length > 0 ? activities.map(act => {
                const Icon = getIcon(act.iconName);
                return (
                    <div key={act.id + act.type} style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#fff', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                        <div style={{ padding: 8, borderRadius: '50%', background: 'rgba(0,0,0,0.03)', color: act.color }}>
                            <Icon size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h5 style={{ margin: 0, fontSize: '0.9rem' }}>{act.type} <span style={{ fontWeight: 'normal', color: 'var(--text-light)', marginLeft: 6 }}>{act.title}</span></h5>
                            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>{act.desc}</p>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                            {new Date(act.time).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                );
            }) : <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>No recent activity to show.</p>}
        </div>
    </div>);
}

// ===== ANNOUNCEMENTS =====
function AnnouncementsTab() {
    const { user } = useAuth();
    const { data: list, refresh } = useApi('/announcements');
    const [form, setForm] = useState({title:'',content:'',category:'General',audience:'All Staff',publishMode:'Immediate',publishDate:'',publishTime:'',sendNotification:false,status:'Published',attachment:null});
    const [show, setShow] = useState(false);

    const handleFile = e => {
        const file = e.target.files[0];
        if(file) setForm({...form, attachment: file.name});
    };
    
    // Permission check
    const isStaff = user?.role?.includes('Admin') || user?.role?.includes('Staff') || user?.role?.includes('Teacher');

    const handleSubmit = async e => { 
        e.preventDefault(); 
        await fetch(`${API}/announcements`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form, createdBy: user?.name || 'Admin'})}); 
        setForm({title:'',content:'',category:'General',audience:'All Staff',publishMode:'Immediate',publishDate:'',publishTime:'',sendNotification:false,status:'Published',attachment:null}); 
        setShow(false); 
        refresh(); 
    };
    const handleDelete = async id => { 
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
            <div className="form-group"><label className="form-label">Message Content *</label><textarea className="form-textarea" rows="4" required placeholder="Use rich text formatting here..." value={form.content} onChange={e=>setForm({...form,content:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Academic</option><option>General</option><option>Urgent</option><option>Event</option><option>Holiday</option></select></div>
                <div className="form-group"><label className="form-label">Audience *</label><select className="form-select" value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})}><option>All Staff</option><option>All Students</option><option>All Parents</option><option>Specific Class</option><option>Specific Group</option><option>Everyone</option></select></div>
            </div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Attach File (Optional)</label><input type="file" className="form-input" onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.png,.jpeg" style={{padding:'6px'}}/></div>
                <div className="form-group"><label className="form-label">Status Type</label><select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Draft</option><option>Scheduled</option><option>Published</option><option>Archived</option></select></div>
            </div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Publish Mode</label><select className="form-select" value={form.publishMode} onChange={e=>{setForm({...form,publishMode:e.target.value, status: e.target.value === 'Scheduled' ? 'Scheduled' : 'Published'})}}><option>Immediate</option><option>Scheduled</option></select></div>
                {form.publishMode === 'Scheduled' && (
                    <div className="form-group" style={{display:'flex', gap:10}}>
                        <div style={{flex:1}}><label className="form-label">Date</label><input type="date" className="form-input" value={form.publishDate} onChange={e=>setForm({...form,publishDate:e.target.value})} /></div>
                        <div style={{flex:1}}><label className="form-label">Time</label><input type="time" className="form-input" value={form.publishTime} onChange={e=>setForm({...form,publishTime:e.target.value})} /></div>
                    </div>
                )}
            </div>
            <div className="form-group" style={{display:'flex', alignItems:'center', gap: 8, marginTop: 10}}>
                <input type="checkbox" id="sendNotification" checked={form.sendNotification} onChange={e=>setForm({...form,sendNotification:e.target.checked})} style={{width:'auto'}} />
                <label htmlFor="sendNotification" className="form-label" style={{margin:0, cursor:'pointer'}}>Send Push/SMS Notification to Target Audience</label>
            </div>
            <div className="form-actions"><button type="submit" className="btn btn-primary"><Send size={16}/> {form.status === 'Draft' ? 'Save Draft' : form.status === 'Scheduled' ? 'Schedule' : 'Publish'}</button></div>
        </form></div>}
        {list.map(a => <div key={a._id} className="notice-card" style={a.status==='Archived'?{opacity:0.6}:a.status==='Draft'?{borderColor:'var(--text-light)'}:{}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <h4>{a.title}</h4>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span className={`badge ${statusCls(a.status)}`}>{a.status}</span>
                    <span className="badge badge-info">{a.category}</span>
                    {isStaff && <button className="btn-icon" onClick={()=>handleDelete(a._id)}><Trash2 size={14}/></button>}
                </div>
            </div>
            <div className="notice-meta"><span>To: {a.audience}</span><span>{new Date(a.createdAt).toLocaleDateString('en-IN')}</span></div>
            <div className="notice-body" style={{ whiteSpace: 'pre-wrap' }}>{a.content}</div>
            {a.attachment && <div style={{marginTop:10, padding:'6px 12px', background:'rgba(0,0,0,0.03)', borderRadius:6, display:'inline-flex', alignItems:'center', gap:6, fontSize:'0.85em', color:'var(--primary)'}}>
                <Paperclip size={14}/> {a.attachment}
            </div>}
        </div>)}
        {list.length===0&&<div className="collab-empty"><Megaphone size={40}/><p>No announcements yet</p></div>}
    </div>);
}

// ===== DISCUSSIONS =====
function DiscussionsTab() {
    const { user } = useAuth();
    const roleStr = user?.role?.toLowerCase() || '';
    const isAdmin = roleStr.includes('admin') || roleStr.includes('principal') || roleStr.includes('super admin');
    const isStaff = isAdmin || roleStr.includes('teacher') || roleStr.includes('staff');
    const currentUser = user?.name || 'User';

    const { data: discussions, refresh } = useApi('/discussions');
    const [form, setForm] = useState({title:'',content:'',category:'General',visibility:'School-wide',attachment:null});
    const [show, setShow] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyAttachment, setReplyAttachment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [expandedThread, setExpandedThread] = useState(null);
    const [reactMenuId, setReactMenuId] = useState(null);

    const handleFileUpload = (e) => { const f = e.target.files?.[0]; if(f) setForm({...form, attachment: f.name}); };
    const handleReplyFile = (e) => { const f = e.target.files?.[0]; if(f) setReplyAttachment(f.name); };

    const handleSubmit = async e => {
        e.preventDefault();
        await fetch(`${API}/discussions`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({
            title: form.title, content: form.content, category: form.category, visibility: form.visibility,
            attachment: form.attachment, author: currentUser, authorRole: user?.role || 'Staff',
        })});
        setForm({title:'',content:'',category:'General',visibility:'School-wide',attachment:null});
        setShow(false);
        refresh();
    };

    const handleReply = async (threadId, parentReplyIdx = null) => {
        if (!replyText.trim()) return;
        await fetch(`${API}/discussions/${threadId}/reply`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({
            author: currentUser, authorRole: user?.role || 'Staff', content: replyText.trim(),
            attachment: replyAttachment, parentReplyIdx,
        })});
        setReplyText(''); setReplyAttachment(null); setReplyTo(null);
        refresh();
    };

    const handlePin = async id => { await fetch(`${API}/discussions/${id}/pin`, {method:'PUT'}); refresh(); };
    const handleLock = async id => { await fetch(`${API}/discussions/${id}/lock`, {method:'PUT'}); refresh(); };
    const handleDelete = async id => { if(!window.confirm('Delete this discussion thread? This action is logged.')) return; await fetch(`${API}/discussions/${id}`, {method:'DELETE'}); refresh(); };
    const handleDeleteReply = async (threadId, replyIdx) => { if(!window.confirm('Delete this reply?')) return; await fetch(`${API}/discussions/${threadId}/reply/${replyIdx}`, {method:'DELETE'}); refresh(); };

    const handleEditPost = (threadId) => {
        const thread = discussions.find(d => d._id === threadId);
        if(thread){ setEditingId(threadId); setEditText(thread.content); }
    };
    const saveEdit = async (threadId) => {
        await fetch(`${API}/discussions/${threadId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ content: editText }) });
        setEditingId(null); setEditText('');
        refresh();
    };

    const handleLikeThread = async (threadId, reaction) => {
        await fetch(`${API}/discussions/${threadId}/like`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ user: currentUser, reaction }) });
        setReactMenuId(null);
        refresh();
    };

    const handleLikeReply = async (threadId, replyIdx, reaction) => {
        await fetch(`${API}/discussions/${threadId}/reply/${replyIdx}/like`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ user: currentUser, reaction }) });
        refresh();
    };

    const reactions = ['👍 Like', '💡 Helpful', '❤️ Love', '🎉 Celebrate'];

    // Client-side search & filter (server already sorts by pinned + date)
    const filtered = discussions.filter(d => {
        const matchesSearch = !searchQuery || d.title?.toLowerCase().includes(searchQuery.toLowerCase()) || d.content?.toLowerCase().includes(searchQuery.toLowerCase()) || d.author?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || d.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const renderLikes = (likes) => {
        if (!likes || likes.length === 0) return null;
        const grouped = {};
        likes.forEach(l => { const r = l.reaction.split(' ')[0]; grouped[r] = (grouped[r]||0)+1; });
        return <div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>{Object.entries(grouped).map(([emoji, count]) => <span key={emoji} style={{padding:'2px 8px',background:'rgba(28,167,166,0.1)',borderRadius:12,fontSize:'0.8em',display:'inline-flex',alignItems:'center',gap:3}}>{emoji} {count}</span>)}</div>;
    };

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
            <h3 style={{margin:0}}>Discussion Forum</h3>
            {isStaff && <button className="btn btn-primary" onClick={()=>setShow(!show)}><PlusCircle size={16}/> New Topic</button>}
        </div>

        {/* Search & Filter Bar */}
        <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
            <div style={{flex:1,position:'relative',minWidth:200}}>
                <Search size={15} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-light)'}} />
                <input className="form-input" style={{paddingLeft:32}} placeholder="Search by keyword, author, or category..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
            </div>
            <select className="form-select" style={{width:'auto',minWidth:140}} value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option>Academic</option><option>General</option><option>Q&A</option><option>Events</option><option>Feedback</option>
            </select>
        </div>

        {/* Create Form */}
        {show && <div className="collab-form-panel"><h3><MessageSquare size={18}/> Create New Discussion Thread</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Topic Title *</label><input className="form-input" required placeholder="Enter a clear, descriptive title..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Description / Opening Post *</label><textarea className="form-textarea" rows="4" required placeholder="Start the conversation..." value={form.content} onChange={e=>setForm({...form,content:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Academic</option><option>General</option><option>Q&A</option><option>Events</option><option>Feedback</option></select></div>
                <div className="form-group"><label className="form-label">Visibility</label><select className="form-select" value={form.visibility} onChange={e=>setForm({...form,visibility:e.target.value})}><option>School-wide</option><option>Specific Group</option><option>Class</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Attach Files (Optional)</label><input type="file" className="form-input" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.jpg,.png,.jpeg,.gif" style={{padding:'6px'}}/></div>
            <div className="form-actions"><button type="submit" className="btn btn-primary"><Send size={16}/> Create Discussion</button></div>
        </form></div>}

        {/* Discussion Threads */}
        {filtered.map(d => <div key={d._id} className={`discussion-thread ${d.pinned?'pinned':''} ${d.locked?'locked':''}`}>
            <div className="discussion-header">
                <h4 style={{cursor:'pointer'}} onClick={()=>setExpandedThread(expandedThread===d._id?null:d._id)}>
                    {d.pinned&&<Pin size={14} style={{marginRight:6,color:'var(--accent)'}}/>}
                    {d.title}
                    {d.locked&&<Lock size={14} style={{marginLeft:6,color:'var(--warning)'}}/>}
                </h4>
                <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    <span className="badge badge-info">{d.category}</span>
                    <span className="badge badge-draft">{d.visibility}</span>
                </div>
            </div>
            <div className="discussion-meta">
                <span>By <strong>{d.author}</strong> {d.authorRole && <span style={{opacity:0.7}}>({d.authorRole})</span>}</span>
                <span>{new Date(d.createdAt).toLocaleDateString('en-IN')}</span>
                <span>{d.replies?.length||0} replies</span>
            </div>
            <div className="discussion-body" style={{whiteSpace:'pre-wrap'}}>{editingId === d._id ? (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <textarea className="form-textarea" rows="3" value={editText} onChange={e=>setEditText(e.target.value)} />
                    <div style={{display:'flex',gap:8}}><button className="btn btn-primary btn-sm" onClick={()=>saveEdit(d._id)}>Save</button><button className="btn btn-outline btn-sm" onClick={()=>setEditingId(null)}>Cancel</button></div>
                </div>
            ) : d.content}
            </div>
            {d.editedAt && <div style={{fontSize:'0.75em',color:'var(--text-light)',marginTop:4,fontStyle:'italic'}}>Edited {new Date(d.editedAt).toLocaleString('en-IN')}</div>}
            {d.attachment && <div style={{marginTop:8,padding:'6px 12px',background:'rgba(0,0,0,0.03)',borderRadius:6,display:'inline-flex',alignItems:'center',gap:6,fontSize:'0.85em',color:'var(--primary)'}}><Paperclip size={14}/> {d.attachment}</div>}
            
            {/* Like/React on thread */}
            {renderLikes(d.likes)}
            
            <div className="discussion-actions" style={{flexWrap:'wrap'}}>
                {/* React button */}
                <div style={{position:'relative'}}>
                    <button className="btn btn-outline btn-sm" onClick={()=>setReactMenuId(reactMenuId===d._id?null:d._id)}>👍 React</button>
                    {reactMenuId === d._id && <div style={{position:'absolute',bottom:'110%',left:0,background:'#fff',border:'1px solid var(--border)',borderRadius:8,padding:'4px 6px',display:'flex',gap:4,zIndex:10,boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>
                        {reactions.map(r => <button key={r} className="btn-icon" style={{padding:'4px 8px',fontSize:'0.85em'}} onClick={()=>handleLikeThread(d._id, r)}>{r}</button>)}
                    </div>}
                </div>
                {!d.locked&&<button className="btn btn-outline btn-sm" onClick={()=>setReplyTo(replyTo===d._id?null:d._id)}><MessageSquare size={14}/> Reply</button>}
                {isAdmin && <button className="btn btn-outline btn-sm" onClick={()=>handlePin(d._id)}><Pin size={14}/> {d.pinned?'Unpin':'Pin'}</button>}
                {isAdmin && <button className="btn btn-outline btn-sm" onClick={()=>handleLock(d._id)}><Lock size={14}/> {d.locked?'Unlock':'Lock'}</button>}
                {isAdmin && <button className="btn btn-outline btn-sm" onClick={()=>handleEditPost(d._id)}><Eye size={14}/> Edit</button>}
                {isAdmin && <button className="btn btn-outline btn-sm" onClick={()=>handleDelete(d._id)}><Trash2 size={14}/> Delete</button>}
            </div>

            {/* Replies */}
            {(expandedThread === d._id || (d.replies?.length || 0) <= 3) && d.replies?.map((r,i) => (
                <div key={r.id||i} className="reply-card" style={{marginLeft: r.parentReplyIdx != null ? 32 : 0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span><strong>{r.author}</strong> {r.authorRole && <span style={{opacity:0.6,fontSize:'0.85em'}}>({r.authorRole})</span>}</span>
                        <span style={{fontSize:'0.72rem',color:'var(--text-light)'}}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div style={{marginTop:4,whiteSpace:'pre-wrap'}}>{r.content}</div>
                    {r.attachment && <div style={{marginTop:4,fontSize:'0.82em',color:'var(--primary)',display:'inline-flex',alignItems:'center',gap:4}}><Paperclip size={12}/>{r.attachment}</div>}
                    {renderLikes(r.likes)}
                    <div style={{display:'flex',gap:6,marginTop:6}}>
                        <button className="btn-icon" style={{fontSize:'0.78em',padding:'2px 6px'}} onClick={()=>handleLikeReply(d._id, i, '👍 Like')}>👍</button>
                        <button className="btn-icon" style={{fontSize:'0.78em',padding:'2px 6px'}} onClick={()=>handleLikeReply(d._id, i, '💡 Helpful')}>💡</button>
                        {!d.locked && <button className="btn-icon" style={{fontSize:'0.78em',padding:'2px 6px'}} onClick={()=>{setReplyTo(`${d._id}__nested_${i}`);setReplyText(`@${r.author} `);}}>↩ Reply</button>}
                        {isAdmin && <button className="btn-icon" style={{fontSize:'0.78em',padding:'2px 6px',color:'var(--danger)'}} onClick={()=>handleDeleteReply(d._id, i)}><Trash2 size={12}/></button>}
                    </div>
                </div>
            ))}
            {(d.replies?.length||0) > 3 && expandedThread !== d._id && (
                <button className="btn btn-outline btn-sm" style={{marginTop:8}} onClick={()=>setExpandedThread(d._id)}>Show all {d.replies.length} replies</button>
            )}

            {/* Reply input */}
            {(replyTo===d._id || replyTo?.startsWith(`${d._id}__nested`)) && <div style={{marginTop:12,padding:12,background:'rgba(0,0,0,0.02)',borderRadius:8}}>
                <textarea className="form-textarea" rows="2" style={{marginBottom:8}} placeholder="Write a reply... Use @name to mention users" value={replyText} onChange={e=>setReplyText(e.target.value)} />
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <label style={{cursor:'pointer',fontSize:'0.85em',color:'var(--primary)',display:'flex',alignItems:'center',gap:4}}>
                        <Paperclip size={14}/> Attach
                        <input type="file" style={{display:'none'}} onChange={handleReplyFile} />
                    </label>
                    {replyAttachment && <span style={{fontSize:'0.82em',color:'var(--text-light)'}}>{replyAttachment}</span>}
                    <div style={{flex:1}}></div>
                    <button className="btn btn-outline btn-sm" onClick={()=>{setReplyTo(null);setReplyText('');setReplyAttachment(null);}}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={()=>{
                        const nestedIdx = replyTo?.includes('__nested_') ? parseInt(replyTo.split('__nested_')[1]) : null;
                        handleReply(d._id, nestedIdx);
                    }}><Send size={14}/> Reply</button>
                </div>
            </div>}
        </div>)}
        {filtered.length===0&&<div className="collab-empty"><MessageSquare size={40}/><p>{searchQuery || filterCategory !== 'All' ? 'No discussions match your search' : 'No discussions yet. Start a conversation!'}</p></div>}
    </div>);
}

// ===== GROUPS =====
function GroupsTab() {
    const { data: list, refresh } = useApi('/groups');
    const { user } = useAuth();
    const [form, setForm] = useState({ name: '', description: '', type: 'Custom', visibility: 'Closed', members: [], groupAdmin: ['Admin'] });
    const [show, setShow] = useState(false);
    const [memberName, setMemberName] = useState('');
    const addMember = () => { if (!memberName) return; setForm(f => ({ ...f, members: [...f.members, { name: memberName, role: 'Teacher' }] })); setMemberName(''); };
    const handleSubmit = async e => {
        e.preventDefault();
        await fetch(`${API}/groups`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form, createdBy: user?.name || 'Admin'}) });
        setForm({ name: '', description: '', type: 'Custom', visibility: 'Closed', members: [], groupAdmin: ['Admin'] });
        setShow(false);
        refresh();
    };
    const handleDelete = async id => {
        if (window.confirm("Are you sure you want to delete this group?")) {
            await fetch(`${API}/groups/${id}`, {method:'DELETE'});
            refresh();
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
    const { data: list, refresh } = useApi('/files');
    const { data: existingGroups } = useApi('/groups');
    const { user } = useAuth();
    const [form, setForm] = useState({ title: '', description: '', category: 'Study Material', audience: 'Everyone', targetId: '', accessLevel: 'Download Allowed', expiryDate: '', file: null });
    const [show, setShow] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 25 * 1024 * 1024) {
                alert("File too large! Max 25MB allowed.");
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
            await fetch(`${API}/files`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({
                title: form.title, description: form.description, fileName: form.file.name,
                fileSize: (form.file.size / 1024 / 1024).toFixed(2) + ' MB',
                fileType: form.file.type, category: form.category, audience: form.audience,
                targetGroup: form.targetId, targetClass: form.targetId,
                accessLevel: form.accessLevel, expiryDate: form.expiryDate || undefined,
                fileUrl: base64, uploadedBy: user?.name || 'Admin',
            })});
            setForm({ title: '', description: '', category: 'Study Material', audience: 'Everyone', targetId: '', accessLevel: 'Download Allowed', expiryDate: '', file: null });
            setShow(false);
            refresh();
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload file.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async id => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            await fetch(`${API}/files/${id}`, {method:'DELETE'});
            refresh();
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

    // Conversations & messages from database
    const [conversations, setConversations] = useState([]);
    const [activeMessages, setActiveMessages] = useState([]);
    const [loadingConvs, setLoadingConvs] = useState(true);

    const fetchConversations = useCallback(async () => {
        try {
            setLoadingConvs(true);
            const r = await fetch(`${API}/conversations?user=${encodeURIComponent(currentUser)}`);
            const data = await r.json();
            setConversations(Array.isArray(data) ? data : []);
        } catch(e) { console.error(e); }
        finally { setLoadingConvs(false); }
    }, [currentUser]);

    useEffect(() => { fetchConversations(); }, [fetchConversations]);

    const fetchMessages = useCallback(async (convId) => {
        if (!convId) return;
        try {
            const r = await fetch(`${API}/conversations/${convId}/messages`);
            const data = await r.json();
            setActiveMessages(Array.isArray(data) ? data : []);
        } catch(e) { console.error(e); }
    }, []);

    const [activeConvId, setActiveConvId] = useState(null);
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
        const systemUsers = JSON.parse(localStorage.getItem('mzs_system_users') || '[]');
        const allStudents = JSON.parse(localStorage.getItem('mzs_students') || '[]');
        
        const defaultUsers = [
            { name: 'Super Admin', role: 'Super Admin' },
            { name: 'Dr. Sarah', role: 'Admin / Principal' },
            { name: 'Vijay Singh', role: 'Accountant' }
        ];

        const contacts = [
            ...defaultUsers,
            ...systemUsers.map(u => ({
                name: u.name,
                role: u.role || 'Admin/Staff'
            })),
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
    }, [activeMessages, activeConvId]);

    // Load messages when conversation changes
    useEffect(() => { if (activeConvId) fetchMessages(activeConvId); }, [activeConvId, fetchMessages]);

    // Set first conversation as active on load
    useEffect(() => { if (conversations.length > 0 && !activeConvId) setActiveConvId(conversations[0]._id); }, [conversations, activeConvId]);

    const activeConversation = conversations.find(c => c._id === activeConvId);

    // Filter conversations by search and type
    const filteredConversations = conversations.filter(c => {
        const matchesSearch = !searchQuery || c.name?.toLowerCase().includes(searchQuery.toLowerCase());
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
    const openConversation = async (convId) => {
        setActiveConvId(convId);
        await fetch(`${API}/conversations/${convId}/read`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ user: currentUser }) });
        fetchConversations();
    };

    // Send message
    const sendMessage = async () => {
        if (!input.trim() && !attachment) return;
        if (!activeConvId) return;

        const msgBody = {
            sender: currentUser,
            content: input.trim(),
            attachment: attachment ? { name: attachment.name, size: (attachment.size / 1024 / 1024).toFixed(2) + ' MB', type: attachment.type } : undefined,
        };

        await fetch(`${API}/conversations/${activeConvId}/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(msgBody) });

        setInput('');
        setAttachment(null);
        fetchMessages(activeConvId);
        fetchConversations();
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
    const createConversation = async () => {
        if (selectedRecipients.length === 0) return;

        let conversationParticipants = [];
        if (newMsgType === 'broadcast') {
            selectedRecipients.forEach(sr => {
                if (sr.name === 'All Staff') {
                    availableContacts.filter(c => !c.role?.includes('Student') && !c.role?.includes('Parent')).forEach(c => conversationParticipants.push(c.name));
                } else if (sr.name === 'All Students') {
                    availableContacts.filter(c => c.role?.includes('Student')).forEach(c => conversationParticipants.push(c.name));
                } else if (sr.name === 'All Parents') {
                    availableContacts.filter(c => c.role?.includes('Parent')).forEach(c => conversationParticipants.push(c.name));
                } else if (sr.name === 'All Users') {
                    availableContacts.forEach(c => conversationParticipants.push(c.name));
                } else {
                    conversationParticipants.push(sr.name);
                }
            });
            conversationParticipants.push(currentUser);
            conversationParticipants = [...new Set(conversationParticipants)];
        } else {
            conversationParticipants = [currentUser, ...selectedRecipients.map(r => r.name)];
        }

        const body = {
            type: newMsgType,
            name: newMsgType === 'direct' ? selectedRecipients[0].name
                : newMsgType === 'group' ? (groupName || selectedRecipients.map(r => r.name).join(', '))
                : `Broadcast: ${selectedRecipients.map(r => r.name).join(', ')}`,
            role: newMsgType === 'direct' ? selectedRecipients[0].role : undefined,
            participants: conversationParticipants,
            createdBy: currentUser,
        };

        const r = await fetch(`${API}/conversations`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
        const newConv = await r.json();
        
        await fetchConversations();
        setActiveConvId(newConv._id);
        setShowNewMsg(false);
        setSelectedRecipients([]);
        setGroupName('');
        setRecipientSearch('');
        setNewMsgType('direct');
    };

    // Delete conversation
    const deleteConversation = async (convId, e) => {
        e?.stopPropagation();
        if (!window.confirm('Delete this conversation?')) return;
        await fetch(`${API}/conversations/${convId}`, {method:'DELETE'});
        if (activeConvId === convId) {
            setActiveConvId(null);
            setActiveMessages([]);
        }
        fetchConversations();
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
    const totalUnread = conversations.reduce((sum, c) => {
        const u = c.unreadCounts ? (c.unreadCounts[currentUser] || 0) : (c.unread || 0);
        return sum + u;
    }, 0);

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
                    {filteredConversations.map(c => {
                        const displayName = c.type === 'direct' ? (c.participants?.find(p => p !== currentUser) || c.name) : c.name;
                        const otherContactInfo = c.type === 'direct' ? availableContacts.find(ac => ac.name === displayName) : null;
                        const displayRole = c.type === 'direct' ? (otherContactInfo?.role || 'User') : c.role;
                        const unreadCount = c.unreadCounts ? (c.unreadCounts[currentUser] || 0) : (c.unread || 0);

                        return (
                        <div key={c._id} className={`msg-conv-item ${activeConvId === c._id ? 'active' : ''} ${unreadCount > 0 ? 'has-unread' : ''}`} onClick={() => openConversation(c._id)}>
                            <div className={`msg-conv-avatar msg-avatar-${c.type}`}>{getInitials(displayName)}</div>
                            <div className="msg-conv-info">
                                <div className="msg-conv-top-row">
                                    <h5>
                                        {displayName}
                                        {c.type === 'direct' && displayRole && <span style={{ fontSize: '0.8em', opacity: 0.7, fontWeight: 'normal', marginLeft: '4px' }}>({displayRole})</span>}
                                    </h5>
                                    <span className="msg-conv-time">{c.lastMessage ? formatTime(c.lastMessage.time) : ''}</span>
                                </div>
                                <div className="msg-conv-bottom-row">
                                    <p>{c.lastMessage ? (c.lastMessage.sender === currentUser ? `You: ${c.lastMessage.text}` : c.lastMessage.text) : 'No messages yet'}</p>
                                    <div className="msg-conv-badges">
                                        {unreadCount > 0 && <span className="msg-unread-badge">{unreadCount}</span>}
                                    </div>
                                </div>
                            </div>
                            <span className={`msg-type-indicator msg-indicator-${c.type}`} title={c.type}>
                                {c.type === 'direct' ? <Mail size={11} /> : c.type === 'group' ? <Users size={11} /> : <Radio size={11} />}
                            </span>
                        </div>
                    )})}
                    {filteredConversations.length === 0 && <div className="msg-no-conv"><Mail size={28} /><p>No conversations found</p></div>}
                </div>
            </div>

            {/* ===== RIGHT CHAT AREA ===== */}
            <div className="msg-chat-area-v2">
                {activeConversation ? (<>
                    {/* Chat Header */}
                    {(() => {
                        const displayName = activeConversation.type === 'direct' ? (activeConversation.participants?.find(p => p !== currentUser) || activeConversation.name) : activeConversation.name;
                        const otherContactInfo = activeConversation.type === 'direct' ? availableContacts.find(ac => ac.name === displayName) : null;
                        const displayRole = activeConversation.type === 'direct' ? (otherContactInfo?.role || 'User') : activeConversation.role;

                        return (
                            <div className="msg-chat-header">
                                <div className="msg-chat-header-left">
                                    <div className={`msg-conv-avatar msg-avatar-${activeConversation.type}`}>{getInitials(displayName)}</div>
                                    <div>
                                        <h4>
                                            {displayName}
                                            {activeConversation.type === 'direct' && displayRole && <span style={{ fontSize: '0.85em', opacity: 0.8, fontWeight: 'normal', marginLeft: '6px' }}>({displayRole})</span>}
                                        </h4>
                                        <span className="msg-chat-subtitle">
                                            {activeConversation.type === 'direct' ? (displayRole || 'User') :
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
                                    <button className="btn-icon" title="Delete conversation" onClick={(e) => deleteConversation(activeConversation._id, e)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Messages Area */}
                    <div className="msg-messages-area">
                        {activeMessages.length === 0 && <div className="msg-empty-chat"><Send size={36} /><p>No messages yet. Start the conversation!</p></div>}
                        {activeMessages.map((m, i) => {
                            const isSent = m.sender === currentUser;
                            const showDate = i === 0 || new Date(m.createdAt).toDateString() !== new Date(activeMessages[i - 1].createdAt).toDateString();
                            return (
                                <React.Fragment key={m._id || i}>
                                    {showDate && <div className="msg-date-divider"><span>{new Date(m.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span></div>}
                                    <div className={`msg-bubble-v2 ${isSent ? 'sent' : 'received'}`}>
                                        {!isSent && activeConversation.type !== 'direct' && <span className="msg-sender-label">{m.sender}</span>}
                                        {m.attachment && (
                                            <div className="msg-file-chip">
                                                {m.attachment.type?.startsWith('image/') ? <ImageIcon size={15} /> : <FileText size={15} />}
                                                <span className="msg-file-name">{m.attachment.name}</span>
                                                <span className="msg-file-size">{m.attachment.size}</span>
                                            </div>
                                        )}
                                        {m.content && <p className="msg-text">{m.content}</p>}
                                        <div className="msg-bubble-meta">
                                            <span className="msg-timestamp">{new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
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
    const { user } = useAuth();
    const roleStr = user?.role?.toLowerCase() || '';
    const isAdmin = roleStr.includes('admin') || roleStr.includes('principal') || roleStr.includes('super admin');
    const isStaff = isAdmin || roleStr.includes('teacher') || roleStr.includes('staff');
    const currentUser = user?.name || 'Admin';

    const { data: meetings, refresh } = useApi('/meetings');
    const [form, setForm] = useState({
        title:'', agenda:'', type:'Online', date:'', startTime:'', endTime:'',
        platform:'Zoom', meetingLink:'', participants:'', sendInvites:true, status:'Scheduled'
    });
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    // Auto-generate link based on platform
    const generateLink = (platform) => {
        if (platform === 'Zoom') return `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        if (platform === 'Google Meet') return `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
        if (platform === 'Microsoft Teams') return `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substring(2, 12)}`;
        return '';
    };

    const handlePlatformChange = (platform) => {
        const autoLink = platform !== 'Manual Link' && platform !== 'N/A' ? generateLink(platform) : '';
        setForm({...form, platform, meetingLink: autoLink});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editId) {
                // Update existing meeting
                await fetch(`${API}/meetings/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...form,
                        status: form.status === 'Rescheduled' ? 'Rescheduled' : form.status
                    })
                });
            } else {
                await fetch(`${API}/meetings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...form,
                        organizer: currentUser,
                        organizerRole: user?.role || 'Staff'
                    })
                });
            }
            setForm({title:'', agenda:'', type:'Online', date:'', startTime:'', endTime:'', platform:'Zoom', meetingLink:'', participants:'', sendInvites:true, status:'Scheduled'});
            setShow(false);
            setEditId(null);
            refresh();
        } catch (error) {
            console.error('Failed to save meeting:', error);
            alert('An error occurred while saving the meeting.');
        }
    };

    const handleEdit = (meeting) => {
        setForm({
            title: meeting.title, agenda: meeting.agenda || '', type: meeting.type,
            date: meeting.date, startTime: meeting.startTime, endTime: meeting.endTime,
            platform: meeting.platform, meetingLink: meeting.meetingLink || '',
            participants: meeting.participants || '', sendInvites: false, status: meeting.status
        });
        setEditId(meeting._id);
        setShow(true);
    };

    const handleStatusChange = async (id, status) => {
        await fetch(`${API}/meetings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        refresh();
    };

    const handleDelete = async id => {
        if (!window.confirm('Delete this meeting?')) return;
        await fetch(`${API}/meetings/${id}`, { method: 'DELETE' });
        refresh();
    };

    // Auto-detect status based on date/time
    const getAutoStatus = (m) => {
        if (m.status === 'Cancelled' || m.status === 'Rescheduled') return m.status;
        const now = new Date();
        const meetDate = new Date(`${m.date}T${m.startTime || '00:00'}`);
        const endDate = new Date(`${m.date}T${m.endTime || '23:59'}`);
        if (now > endDate) return 'Completed';
        if (now >= meetDate && now <= endDate) return 'In Progress';
        return 'Scheduled';
    };

    const statusCls = s => s==='Scheduled'?'badge-scheduled':s==='In Progress'?'badge-in-progress':s==='Completed'?'badge-completed':s==='Cancelled'?'badge-cancelled':s==='Rescheduled'?'badge-info':'badge-draft';

    const platformIcon = p => {
        if (p === 'Zoom') return '📹';
        if (p === 'Google Meet') return '🟢';
        if (p === 'Microsoft Teams') return '🟣';
        if (p === 'Manual Link') return '🔗';
        return '📍';
    };

    // Filter
    const filtered = meetings.map(m => ({...m, status: getAutoStatus(m)})).filter(m => {
        return filterStatus === 'All' || m.status === filterStatus;
    }).sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
        const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
        return dateB - dateA;
    });

    return (<div className="animate-fade-in">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
            <h3 style={{margin:0}}>Meetings & Events</h3>
            {isStaff && <button className="btn btn-primary" onClick={()=>{setShow(!show);setEditId(null);setForm({title:'',agenda:'',type:'Online',date:'',startTime:'',endTime:'',platform:'Zoom',meetingLink:'',participants:'',sendInvites:true,status:'Scheduled'});}}><PlusCircle size={16}/> Schedule Meeting</button>}
        </div>

        {/* Filter Bar */}
        <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
            {['All','Scheduled','In Progress','Completed','Cancelled','Rescheduled'].map(s => (
                <button key={s} className={`btn btn-sm ${filterStatus===s?'btn-primary':'btn-outline'}`} onClick={()=>setFilterStatus(s)}>{s}</button>
            ))}
        </div>

        {/* Create/Edit Form */}
        {show && <div className="collab-form-panel"><h3><Video size={18}/> {editId ? 'Edit Meeting' : 'Schedule New Meeting'}</h3><form className="collab-form" onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Meeting Title *</label><input className="form-input" required placeholder="e.g. Staff Weekly Sync" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Agenda / Description</label><textarea className="form-textarea" rows="3" placeholder="Meeting objectives and discussion points..." value={form.agenda} onChange={e=>setForm({...form,agenda:e.target.value})} /></div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Meeting Type *</label><select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Online</option><option>In-person</option><option>Hybrid</option></select></div>
                <div className="form-group"><label className="form-label">Date *</label><input type="date" className="form-input" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
            </div>
            <div className="form-row">
                <div className="form-group"><label className="form-label">Start Time *</label><input type="time" className="form-input" required value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">End Time *</label><input type="time" className="form-input" required value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Participants</label><input className="form-input" placeholder="Enter names separated by commas, or type 'All Staff', 'Class 10A'..." value={form.participants} onChange={e=>setForm({...form,participants:e.target.value})} /></div>
            {(form.type === 'Online' || form.type === 'Hybrid') && <>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Platform</label><select className="form-select" value={form.platform} onChange={e=>handlePlatformChange(e.target.value)}><option>Zoom</option><option>Google Meet</option><option>Microsoft Teams</option><option>Manual Link</option></select></div>
                    <div className="form-group"><label className="form-label">Meeting Link {form.platform !== 'Manual Link' && <span style={{fontSize:'0.8em',color:'var(--success)'}}>(Auto-generated)</span>}</label><input className="form-input" placeholder="https://..." value={form.meetingLink} onChange={e=>setForm({...form,meetingLink:e.target.value})} /></div>
                </div>
            </>}
            {editId && <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Scheduled</option><option>In Progress</option><option>Completed</option><option>Cancelled</option><option>Rescheduled</option></select></div>}
            <div className="form-group" style={{display:'flex',alignItems:'center',gap:8,marginTop:10}}>
                <input type="checkbox" id="sendMeetInvites" checked={form.sendInvites} onChange={e=>setForm({...form,sendInvites:e.target.checked})} style={{width:'auto'}} />
                <label htmlFor="sendMeetInvites" className="form-label" style={{margin:0,cursor:'pointer'}}>Send Invites (in-app notification & email) to Participants</label>
            </div>
            <div className="form-actions">
                {editId && <button type="button" className="btn btn-outline" onClick={()=>{setShow(false);setEditId(null);}}>Cancel</button>}
                <button type="submit" className="btn btn-primary"><Save size={16}/> {editId ? 'Update Meeting' : 'Schedule Meeting'}</button>
            </div>
        </form></div>}

        {/* Meeting Cards */}
        {filtered.map(m => <div className="meeting-card" key={m._id} style={{borderLeft: m.status==='In Progress'?'3px solid var(--success)':m.status==='Cancelled'?'3px solid var(--danger)':m.status==='Rescheduled'?'3px solid var(--warning)':'3px solid var(--primary)'}}>
            <div className="meeting-info">
                <h4>{m.title}</h4>
                <div className="notice-meta" style={{marginTop:4}}>
                    <span><Calendar size={13} style={{verticalAlign:'middle',marginRight:4}}/>{m.date ? new Date(m.date).toLocaleDateString('en-IN', {weekday:'short', day:'2-digit', month:'short', year:'numeric'}) : '—'}</span>
                    <span><Clock size={13} style={{verticalAlign:'middle',marginRight:4}}/>{m.startTime || '—'} – {m.endTime || '—'}</span>
                    <span>{platformIcon(m.platform)} {m.type} · {m.platform}</span>
                </div>
                {m.agenda && <p style={{margin:'8px 0 4px',color:'var(--text-secondary)',fontSize:'0.9em'}}>{m.agenda}</p>}
                {m.participants && <div style={{marginTop:6,display:'flex',flexWrap:'wrap',gap:4}}>
                    {m.participants.split(',').map((p,i) => <span key={i} style={{padding:'2px 10px',background:'rgba(11,60,93,0.08)',borderRadius:12,fontSize:'0.8em',color:'var(--primary)',fontWeight:500}}>{p.trim()}</span>)}
                </div>}
                <div style={{marginTop:6,fontSize:'0.8em',color:'var(--text-light)'}}>Organized by {m.organizer} {m.organizerRole && <span>({m.organizerRole})</span>}</div>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end',minWidth:180}}>
                <span className={`badge ${statusCls(m.status)}`}>{m.status}</span>
                {m.meetingLink && m.status !== 'Cancelled' && <a href={m.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{whiteSpace:'nowrap'}}><Video size={13}/> Join</a>}
                {isStaff && m.status === 'Scheduled' && <button className="btn btn-outline btn-sm" onClick={()=>handleEdit(m)}>Edit</button>}
                {isStaff && m.status === 'Scheduled' && <button className="btn btn-outline btn-sm" style={{color:'var(--danger)'}} onClick={()=>handleStatusChange(m._id,'Cancelled')}>Cancel</button>}
                {isStaff && m.status === 'In Progress' && <button className="btn btn-outline btn-sm" onClick={()=>handleStatusChange(m._id,'Completed')}>Mark Complete</button>}
                {isAdmin && <button className="btn-icon" onClick={()=>handleDelete(m._id)}><Trash2 size={14}/></button>}
            </div>
        </div>)}
        {filtered.length===0&&<div className="collab-empty"><Video size={40}/><p>{filterStatus !== 'All' ? `No ${filterStatus.toLowerCase()} meetings` : 'No meetings scheduled yet'}</p></div>}
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
        ['Create Announcement','Yes','Yes','Class scope','No','No'],
        ['Create Discussion','Yes','Yes','Yes','Participate','No'],
        ['Moderate Discussion','Yes','Yes','Own topics','No','No'],
        ['Create Group','Yes','Yes','Yes','No','No'],
        ['View Group','Yes','Yes','Member only','Member only','Member only'],
        ['Upload Files','Yes','Yes','Yes','In group only','No'],
        ['Download Files','Yes','Yes','Yes','If permitted','Announced only'],
        ['Send Direct Message','Yes','Yes','Yes','Peers / Teacher','Teacher only'],
        ['Schedule Meeting','Yes','Yes','Yes','No','No'],
        ['Create Task','Yes','Yes','Yes','No','No'],
        ['Post Notice','Yes','Yes','Class scope','No','No'],
        ['Module Settings','Yes','Yes','No','No','No']
    ];
    return (<div className="animate-fade-in collab-settings-grid" style={{ gridTemplateColumns: '1fr', gap: 30 }}>
        <div className="collab-settings-panel"><h3><Settings size={18}/> Module Settings & Infrastructure (NFRs)</h3>
            <table className="data-table" style={{fontSize:'0.85rem'}}><thead><tr><th>Setting / Feature</th><th>Status / Value</th></tr></thead><tbody>
                {[['Performance & Delivery','Real-time WebSockets (< 500ms)'], ['Max File Upload Size','25 MB'],['Allowed File Types','PDF, DOCX, JPG, PNG, MP4'],['Message Rate Limit','10 / minute'],
                  ['End-to-End Encryption','Active'], ['Global Full-Text Search','Active (< 2s latency)'], ['Activity Feed Retention','90 days'], ['Data Retention Policy','2 Years (Files indefinite)'],
                  ['WhatsApp & SMS Integration','Configured (Awaiting Keys)'], ['AI Announcement Suggestions','Enabled'], ['Smart Notification Priority','Enabled'], ['Voice Messages','Disabled']
                ].map(([k,v],i)=><tr key={i}><td className="fw-600">{k}</td><td>{v}</td></tr>)}
            </tbody></table></div>
        <div className="collab-settings-panel" style={{ overflowX: 'auto' }}><h3><Users size={18}/> 14.2 Role-Based Access Control Matrix</h3>
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
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');

    // Compute allowed tabs based on role
    const allowedTabs = useMemo(() => {
        const roleStr = user?.role?.toLowerCase() || '';
        const isAdmin = roleStr.includes('admin') || roleStr.includes('principal') || roleStr.includes('super admin');
        const isTeacher = roleStr.includes('teacher') || roleStr.includes('staff');
        const isStudent = roleStr.includes('student');
        const isParent = roleStr.includes('parent');

        if (isAdmin || isTeacher) return TABS;
        if (isStudent) return TABS.filter(t => ['dashboard', 'announcements', 'discussions', 'groups', 'files', 'messages', 'notices'].includes(t.id));
        if (isParent) return TABS.filter(t => ['dashboard', 'announcements', 'groups', 'messages', 'notices'].includes(t.id));
        return TABS.filter(t => ['dashboard', 'announcements', 'messages', 'notices'].includes(t.id));
    }, [user]);

    const defaultTab = allowedTabs.length > 0 ? allowedTabs[0].id : 'dashboard';
    const initialTab = tabFromUrl && allowedTabs.some(t => t.id === tabFromUrl) ? tabFromUrl : defaultTab;
    
    const [activeTab, setActiveTab] = useState(initialTab);
    const handleNavigate = tab => { setActiveTab(tab); setSearchParams({ tab }); };
    useEffect(() => { if(tabFromUrl && tabFromUrl !== activeTab && allowedTabs.some(t => t.id === tabFromUrl)) setActiveTab(tabFromUrl); }, [tabFromUrl, allowedTabs, activeTab]);

    return (
        <div className="collab-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb"><Link to="/">Dashboard</Link><span className="separator">/</span><span>Collaborate</span>
                    {activeTab!=='dashboard'&&<><span className="separator">/</span><span style={{textTransform:'capitalize'}}>{TABS.find(t=>t.id===activeTab)?.label}</span></>}</div>
                <h1>Collaborate</h1>
            </div></div>
            <div className="card collab-card">
                <div className="tabs-header">{allowedTabs.map(tab=>{const Icon=tab.icon;return <button key={tab.id} className={`tab-btn ${activeTab===tab.id?'active':''}`} onClick={()=>handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>;})}</div>
                <div className="tabs-content">
                    {activeTab==='dashboard'&&<DashboardTab onNavigate={handleNavigate}/>}{activeTab==='announcements'&&<AnnouncementsTab/>}{activeTab==='discussions'&&<DiscussionsTab/>}
                    {activeTab==='groups'&&<GroupsTab/>}{activeTab==='files'&&<FilesTab/>}{activeTab==='messages'&&<MessagesTab/>}
                    {activeTab==='meetings'&&<MeetingsTab/>}{activeTab==='tasks'&&<TasksTab/>}{activeTab==='notices'&&<NoticesTab/>}{activeTab==='settings'&&<SettingsTab/>}
                </div>
            </div>
        </div>
    );
}
