import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Plus, Edit, Trash2, Copy, Megaphone, Eye, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { customAlert, customConfirm } from '../utils/dialogs';
import './Announcements.css';

export default function Announcements() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('list');
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetGroup: 'All Students',
        publishDate: new Date().toISOString().split('T')[0],
        status: 'Published',
    });
    const [editingId, setEditingId] = useState(null);

    // Permission check
    const isStaff = user?.role?.includes('Admin') || user?.role?.includes('Staff') || user?.role?.includes('Teacher');

    useEffect(() => {
        const saved = localStorage.getItem('erp_announcements');
        if (saved) {
            let list = JSON.parse(saved);
            
            // If student, filter by class or "All Students"
            if (!isStaff && user?.role !== 'Parent') {
                const studentClass = user?.class || ''; // Assuming student class is in user object
                list = list.filter(a => 
                    a.status === 'Published' && 
                    (a.targetGroup === 'All Students' || a.targetGroup === `Class ${studentClass}` || a.targetGroup === studentClass)
                );
            }
            
            setAnnouncements(list);
        }
    }, [isStaff, user]);

    const save = (list) => {
        setAnnouncements(list);
        localStorage.setItem('erp_announcements', JSON.stringify(list));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isStaff) return;
        if (!formData.title.trim() || !formData.message.trim()) return await customAlert('Title and message are required');
        
        if (editingId) {
            save(announcements.map(a => a.id === editingId ? { ...a, ...formData } : a));
            setEditingId(null);
        } else {
            save([{ id: Date.now().toString(), ...formData, createdAt: new Date().toISOString() }, ...announcements]);
        }
        setFormData({ title: '', message: '', targetGroup: 'All Students', publishDate: new Date().toISOString().split('T')[0], status: 'Published' });
        setActiveTab('list');
    };

    const handleEdit = (a) => {
        if (!isStaff) return;
        setFormData({ title: a.title, message: a.message, targetGroup: a.targetGroup, publishDate: a.publishDate, status: a.status });
        setEditingId(a.id);
        setActiveTab('create');
    };

    const handleDelete = async (id) => {
        if (!isStaff) return;
        if (!await customConfirm('Delete this announcement?')) return;
        save(announcements.filter(a => a.id !== id));
    };

    const handleDuplicate = (a) => {
        if (!isStaff) return;
        save([{ ...a, id: Date.now().toString(), title: `${a.title} (Copy)`, createdAt: new Date().toISOString() }, ...announcements]);
    };

    return (
        <div className="announcements-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link><span className="separator">/</span><span>Announcements</span>
                    </div>
                    <h1>Announcements</h1>
                </div>
                {isStaff && (
                    <button className="btn btn-primary" onClick={() => { setActiveTab('create'); setEditingId(null); setFormData({ title:'', message:'', targetGroup:'All Students', publishDate: new Date().toISOString().split('T')[0], status:'Published' }); }}>
                        <Plus size={16}/> New Announcement
                    </button>
                )}
            </div>

            {activeTab === 'list' && (
                <div className="announcements-list-container">
                    {announcements.length > 0 ? (
                        <div className="announcements-list" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            {announcements.map(a => (
                                <div key={a.id} className="announcement-item" style={{
                                    backgroundColor: '#fff', 
                                    border: '1px solid #eaedf1', 
                                    borderRadius: '8px', 
                                    padding: '24px', 
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                }}>
                                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start', gap: '24px'}}>
                                        <div style={{flex: 1}}>
                                            <h3 style={{margin:0,fontSize:'1.15rem', fontWeight: '600', color: '#111827'}}>{a.title}</h3>
                                            <p style={{color:'#4b5563',margin:'8px 0 16px 0',fontSize:'0.95rem', lineHeight: '1.5'}}>{a.message}</p>
                                            <div style={{display:'flex',gap:12,flexWrap:'wrap', alignItems: 'center'}}>
                                                <span className="badge" style={{backgroundColor: '#f3f4f6', color: '#374151', fontWeight: 500, padding: '4px 10px', borderRadius: '6px'}}>{a.targetGroup}</span>
                                                <span className={`badge ${a.status === 'Published' ? 'badge-success' : 'badge-warning'}`} style={{fontWeight: 500, padding: '4px 10px', borderRadius: '6px'}}>{a.status}</span>
                                                <span style={{fontSize:'0.85rem',color:'#6b7280', display: 'flex', alignItems: 'center', gap: '6px'}}><Calendar size={14}/> {new Date(a.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        {isStaff && (
                                            <div style={{display:'flex',gap:8,flexShrink:0}}>
                                                <button className="btn-icon" style={{background: '#f9fafb', border: '1px solid #e5e7eb', color: '#4b5563'}} title="Edit" onClick={()=>handleEdit(a)}><Edit size={16}/></button>
                                                <button className="btn-icon" style={{background: '#f9fafb', border: '1px solid #e5e7eb', color: '#4b5563'}} title="Duplicate" onClick={()=>handleDuplicate(a)}><Copy size={16}/></button>
                                                <button className="btn-icon" style={{background: '#fef2f2', border: '1px solid #fde8e8', color: '#ef4444'}} title="Delete" onClick={()=>handleDelete(a.id)}><Trash2 size={16}/></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state card" style={{padding:60, border: '1px solid #eaedf1', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
                            <Megaphone size={48} style={{color: '#9ca3af', marginBottom: 16}}/>
                            <h3 style={{color: '#111827'}}>No Announcements Yet</h3>
                            <p style={{color: '#6b7280'}}>
                                {isStaff ? 'Click "New Announcement" to create your first announcement.' : 'There are no announcements for your class at this time.'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {isStaff && activeTab === 'create' && (
                <div className="card" style={{padding:30}}>
                    <h3 style={{marginBottom:20}}>{editingId ? 'Edit Announcement' : 'Create New Announcement'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title <span className="required">*</span></label>
                            <input type="text" className="form-input" value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} placeholder="Announcement title" />
                        </div>
                        <div className="form-group" style={{marginTop:16}}>
                            <label className="form-label">Message <span className="required">*</span></label>
                            <textarea className="form-textarea" value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})} placeholder="Write your announcement..." rows="6" style={{width:'100%',padding:'12px 14px',border:'1px solid var(--border-light)',borderRadius:'var(--radius)',fontFamily:'inherit',fontSize:'0.9rem',resize:'vertical'}}></textarea>
                            <div style={{fontSize:'0.8rem',textAlign:'right',color:'var(--text-light)',marginTop:4}}>{formData.message.length} characters</div>
                        </div>
                        <div className="form-row" style={{marginTop:16,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                            <div className="form-group">
                                <label className="form-label">Target Group</label>
                                <select className="form-select" value={formData.targetGroup} onChange={e=>setFormData({...formData,targetGroup:e.target.value})}>
                                    <option value="All Students">All Students</option>
                                    <option value="Class I">Class I</option>
                                    <option value="Class II">Class II</option>
                                    <option value="Class III">Class III</option>
                                    <option value="Class IV">Class IV</option>
                                    <option value="Class V">Class V</option>
                                    <option value="Teachers">Teachers</option>
                                    <option value="Parents">Parents</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Publish Date</label>
                                <input type="date" className="form-input" value={formData.publishDate} onChange={e=>setFormData({...formData,publishDate:e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={formData.status} onChange={e=>setFormData({...formData,status:e.target.value})}>
                                    <option value="Published">Publish Now</option>
                                    <option value="Draft">Save as Draft</option>
                                    <option value="Scheduled">Schedule</option>
                                </select>
                            </div>
                        </div>
                        <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:24}}>
                            <button type="button" className="btn btn-outline" onClick={()=>{setActiveTab('list');setEditingId(null);}}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Send size={16}/> {editingId ? 'Update' : 'Publish'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
