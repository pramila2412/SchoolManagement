import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Settings, UserPlus, MessageSquare } from 'lucide-react';
import './Announcements.css';

export default function Announcements() {
    const [activeTab, setActiveTab] = useState('sms');
    const [smsMode, setSmsMode] = useState('link');
    
    const [formData, setFormData] = useState({
        language: 'ENGLISH',
        gender: 'All',
        studentType: 'All',
        hostel: 'All',
        message: ''
    });

    const handleSend = (e) => {
        e.preventDefault();
        console.log("Sending Announcement:", { mode: smsMode, ...formData });
        // Handle send logic
    };

    return (
        <div className="announcements-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Communication</span>
                        <span className="separator">/</span>
                        <span>Announcements</span>
                    </div>
                    <h1>SMS & Notification Center</h1>
                </div>
            </div>

            <div className="card announcements-card">
                <div className="tabs-header">
                    <button 
                        className={`tab-btn ${activeTab === 'sms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sms')}
                    >
                        <MessageSquare size={18} /> SMS
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'app' ? 'active' : ''}`}
                        onClick={() => setActiveTab('app')}
                    >
                        <Send size={18} /> App Notification
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === 'sms' && (
                        <form onSubmit={handleSend} className="animate-fade-in">
                            <div className="sms-mode-section">
                                <label className="radio-item mode-radio">
                                    <input 
                                        type="radio" 
                                        value="link" 
                                        checked={smsMode === 'link'} 
                                        onChange={() => setSmsMode('link')} 
                                    />
                                    <span>Send SMS as Messages Link <small className="text-muted">(No DLT Required)</small></span>
                                </label>
                                <label className="radio-item mode-radio">
                                    <input 
                                        type="radio" 
                                        value="full" 
                                        checked={smsMode === 'full'} 
                                        onChange={() => setSmsMode('full')} 
                                    />
                                    <span>Send Messages as Full Text <small className="text-warning">(DLT Required)</small></span>
                                </label>
                            </div>

                            <div className="filters-grid">
                                <div className="form-group flex-align-bottom">
                                    <button type="button" className="btn btn-outline" style={{ width: '100%', height: '42px', justifyContent: 'flex-start' }}>
                                        <UserPlus size={18} /> Choose Recipient...
                                    </button>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Select Language</label>
                                    <select className="form-select" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                                        <option value="ENGLISH">ENGLISH</option>
                                        <option value="HINDI">HINDI</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select className="form-select" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                        <option value="All">All</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Student Type</label>
                                    <select className="form-select" value={formData.studentType} onChange={e => setFormData({...formData, studentType: e.target.value})}>
                                        <option value="All">All</option>
                                        <option value="Regular">Regular</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Hostel</label>
                                    <select className="form-select" value={formData.hostel} onChange={e => setFormData({...formData, hostel: e.target.value})}>
                                        <option value="All">All</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>

                            <div className="message-content-section" style={{ marginTop: '30px' }}>
                                <div className="content-header">
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Message Content</h3>
                                    <button type="button" className="btn btn-outline btn-sm">
                                        <Settings size={16} /> Configure Content
                                    </button>
                                </div>
                                <textarea 
                                    className="form-textarea message-textarea" 
                                    placeholder="Type your message here..."
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    rows="6"
                                ></textarea>
                                <div className="char-count text-muted" style={{ fontSize: '0.8rem', textAlign: 'right', marginTop: '4px' }}>
                                    {formData.message.length} characters
                                </div>
                            </div>

                            <div className="form-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <button type="button" className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    <Send size={18} /> Send {activeTab === 'sms' ? 'SMS' : 'Notification'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'app' && (
                        <div className="animate-fade-in">
                            {/* App Notification view uses similar structure, mocked for now to focus on SMS requirements */}
                            <div className="empty-state">
                                <Send size={48} />
                                <h3>App Notifications</h3>
                                <p>Switch to SMS to see the detailed communication configuration.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
