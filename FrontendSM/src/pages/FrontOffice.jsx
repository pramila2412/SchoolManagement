import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PhoneCall, BookOpen, Send, AlertTriangle, Save } from 'lucide-react';
import './FrontOffice.css';

export default function FrontOffice() {
    const [activeTab, setActiveTab] = useState('admission');

    return (
        <div className="frontoffice-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Front Office</span>
                    </div>
                    <h1>Front Office Management</h1>
                </div>
            </div>

            <div className="card fo-card">
                <div className="tabs-header" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    <button className={`tab-btn ${activeTab === 'admission' ? 'active' : ''}`} onClick={() => setActiveTab('admission')}>
                        <BookOpen size={18} /> Admission Enquiry
                    </button>
                    <button className={`tab-btn ${activeTab === 'visitor' ? 'active' : ''}`} onClick={() => setActiveTab('visitor')}>
                        <Users size={18} /> Visitor Book
                    </button>
                    <button className={`tab-btn ${activeTab === 'phone' ? 'active' : ''}`} onClick={() => setActiveTab('phone')}>
                        <PhoneCall size={18} /> Phone Call Log
                    </button>
                    <button className={`tab-btn ${activeTab === 'postal' ? 'active' : ''}`} onClick={() => setActiveTab('postal')}>
                        <Send size={18} /> Postal Dispatch
                    </button>
                    <button className={`tab-btn ${activeTab === 'complain' ? 'active' : ''}`} onClick={() => setActiveTab('complain')}>
                        <AlertTriangle size={18} /> Complain
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === 'admission' && (
                        <div className="animate-fade-in fo-split-layout">
                            <div className="form-panel">
                                <h3>Add Admission Enquiry</h3>
                                <form className="fo-form">
                                    <div className="form-group row-group">
                                        <div className="field">
                                            <label className="form-label">Name <span className="required">*</span></label>
                                            <input type="text" className="form-input" required />
                                        </div>
                                        <div className="field">
                                            <label className="form-label">Phone <span className="required">*</span></label>
                                            <input type="text" className="form-input" required />
                                        </div>
                                    </div>
                                    <div className="form-group row-group">
                                        <div className="field">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-input" />
                                        </div>
                                        <div className="field">
                                            <label className="form-label">Enquiry Date</label>
                                            <input type="date" className="form-input" />
                                        </div>
                                    </div>
                                    <div className="form-group row-group">
                                        <div className="field">
                                            <label className="form-label">Next Follow Up Date</label>
                                            <input type="date" className="form-input" />
                                        </div>
                                        <div className="field">
                                            <label className="form-label">Source</label>
                                            <select className="form-select">
                                                <option>Advertisement</option>
                                                <option>Online</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row-group">
                                        <div className="field">
                                            <label className="form-label">Class</label>
                                            <select className="form-select">
                                                <option>Select Class</option>
                                            </select>
                                        </div>
                                        <div className="field">
                                            <label className="form-label">Number of Child</label>
                                            <input type="number" className="form-input" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Address</label>
                                        <textarea className="form-textarea" rows="2"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-textarea" rows="2"></textarea>
                                    </div>
                                    <div className="form-actions text-right" style={{marginTop:'20px'}}>
                                        <button className="btn btn-outline" style={{marginRight:'10px'}}>Cancel</button>
                                        <button className="btn btn-primary"><Save size={18}/> Save</button>
                                    </div>
                                </form>
                            </div>
                            <div className="table-panel">
                                <div className="filter-row" style={{padding:'20px', borderBottom:'1px solid var(--border-light)'}}>
                                    <input type="text" className="form-input" placeholder="Search Enquiry..." />
                                </div>
                                <table className="data-table">
                                    <thead><tr><th>Name</th><th>Phone</th><th>Source</th><th>Enquiry Date</th><th>Next Follow Up</th></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td className="fw-600">Amit Sharma</td>
                                            <td>9876543210</td>
                                            <td>Online</td>
                                            <td>18 Mar 2026</td>
                                            <td>25 Mar 2026</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'visitor' && (
                        <div className="animate-fade-in fo-split-layout">
                            <div className="form-panel">
                                <h3>Add Visitor Book</h3>
                                <form className="fo-form">
                                    <div className="form-group">
                                        <label className="form-label">Purpose <span className="required">*</span></label>
                                        <select className="form-select"><option>Meeting</option></select>
                                    </div>
                                    <div className="form-group row-group">
                                        <div className="field">
                                            <label className="form-label">Name <span className="required">*</span></label>
                                            <input type="text" className="form-input" required />
                                        </div>
                                        <div className="field">
                                            <label className="form-label">Phone</label>
                                            <input type="text" className="form-input" />
                                        </div>
                                    </div>
                                    <div className="form-group row-group">
                                        <div className="field">
                                            <label className="form-label">Date</label>
                                            <input type="date" className="form-input" />
                                        </div>
                                        <div className="field">
                                            <label className="form-label">Number of Person</label>
                                            <input type="number" className="form-input" />
                                        </div>
                                    </div>
                                    <div className="form-group row-group">
                                        <div className="field">
                                            <label className="form-label">In Time</label>
                                            <input type="time" className="form-input" />
                                        </div>
                                        <div className="field">
                                            <label className="form-label">Out Time</label>
                                            <input type="time" className="form-input" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Note</label>
                                        <textarea className="form-textarea" rows="2"></textarea>
                                    </div>
                                    <div className="form-actions text-right" style={{marginTop:'20px'}}>
                                        <button className="btn btn-primary"><Save size={18}/> Save</button>
                                    </div>
                                </form>
                            </div>
                            <div className="table-panel">
                                <table className="data-table">
                                    <thead><tr><th>Purpose</th><th>Name</th><th>Phone</th><th>Date</th><th>In Time</th><th>Out Time</th></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td>Meeting</td>
                                            <td className="fw-600">Sunil Gupta</td>
                                            <td>9876543210</td>
                                            <td>18 Mar 2026</td>
                                            <td>10:00 AM</td>
                                            <td>11:30 AM</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {/* Other tabs follow same patterns */}
                    {(activeTab !== 'admission' && activeTab !== 'visitor') && (
                        <div className="empty-state">
                            <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Functionality</h3>
                            <p>This section uses a similar form and table layout as Admission and Visitor modules.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
