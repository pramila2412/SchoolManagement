import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutList, ClipboardCheck, Stamp, Save, PlusCircle } from 'lucide-react';
import './Examination.css';

export default function Examination() {
    const [activeTab, setActiveTab] = useState('group');

    return (
        <div className="examination-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Academics</span>
                        <span className="separator">/</span>
                        <span>Examinations</span>
                    </div>
                    <h1>Examination Center</h1>
                </div>
            </div>

            <div className="card exam-card">
                <div className="tabs-header">
                    <button 
                        className={`tab-btn ${activeTab === 'group' ? 'active' : ''}`}
                        onClick={() => setActiveTab('group')}
                    >
                        <LayoutList size={18} /> Exam Group & Schedule
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                        onClick={() => setActiveTab('results')}
                    >
                        <ClipboardCheck size={18} /> Exam Results
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'admitcard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admitcard')}
                    >
                        <Stamp size={18} /> Design Admit Card
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === 'group' && (
                        <div className="animate-fade-in exam-two-col">
                            <div className="exam-form-panel">
                                <h3>Create Exam Group</h3>
                                <form className="exam-form">
                                    <div className="form-group">
                                        <label className="form-label">Name <span className="required">*</span></label>
                                        <input type="text" className="form-input" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Exam Type <span className="required">*</span></label>
                                        <select className="form-select" required>
                                            <option value="">Select Type</option>
                                            <option value="General">General Purpose (Pass/Fail)</option>
                                            <option value="GPA">GPA Based</option>
                                            <option value="Marks">Marks Based</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-textarea" rows="3"></textarea>
                                    </div>
                                    <div className="form-actions text-right">
                                        <button type="submit" className="btn btn-primary"><Save size={18} /> Save</button>
                                    </div>
                                </form>
                            </div>

                            <div className="exam-schedule-panel">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--border-light)', paddingBottom: '10px' }}>
                                    <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Exam Schedule setup</h3>
                                    <button className="btn btn-outline btn-sm"><PlusCircle size={16}/> Add Subject</button>
                                </div>
                                <div className="schedule-filters form-grid-3">
                                    <div className="form-group">
                                        <label className="form-label">Exam Group</label>
                                        <select className="form-select"><option>Terminal Exam</option></select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Exam</label>
                                        <select className="form-select"><option>Half Yearly</option></select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Session</label>
                                        <select className="form-select"><option>2024-2025</option></select>
                                    </div>
                                </div>
                                <div className="table-responsive" style={{ marginTop: '20px' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Subject</th>
                                                <th>Date</th>
                                                <th>Start Time</th>
                                                <th>End Time</th>
                                                <th>Room No</th>
                                                <th>Full Marks</th>
                                                <th>Pass Marks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Mathematics</td>
                                                <td><input type="date" className="form-input" style={{padding:'6px'}}/></td>
                                                <td><input type="time" className="form-input" style={{padding:'6px'}}/></td>
                                                <td><input type="time" className="form-input" style={{padding:'6px'}}/></td>
                                                <td><input type="text" className="form-input" style={{padding:'6px', width:'80px'}}/></td>
                                                <td><input type="number" className="form-input" style={{padding:'6px', width:'80px'}} defaultValue="100"/></td>
                                                <td><input type="number" className="form-input" style={{padding:'6px', width:'80px'}} defaultValue="33"/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-right" style={{marginTop: '20px'}}><button className="btn btn-primary"><Save size={18} /> Save Schedule</button></div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="animate-fade-in">
                            <div className="filter-row form-grid-4" style={{ marginBottom: '24px' }}>
                                <div className="form-group">
                                    <label className="form-label">Select Exam</label>
                                    <select className="form-select"><option>Half Yearly</option></select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Class</label>
                                    <select className="form-select"><option>Class X</option></select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Section</label>
                                    <select className="form-select"><option>A</option></select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject</label>
                                    <select className="form-select"><option>Science</option></select>
                                </div>
                            </div>
                            <div className="table-responsive card">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Roll No</th>
                                            <th>Student Name</th>
                                            <th>Attendance</th>
                                            <th>Marks Obtained</th>
                                            <th>Note</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>101</td>
                                            <td className="fw-600">Rahul Sharma</td>
                                            <td><span className="badge badge-success">Present</span></td>
                                            <td><input type="number" className="form-input" defaultValue="85" style={{width:'100px'}}/></td>
                                            <td><input type="text" className="form-input" placeholder="Remarks"/></td>
                                            <td><button className="btn btn-outline btn-sm">Save</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'admitcard' && (
                        <div className="animate-fade-in">
                            <div className="exam-form-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
                                <h3>Admit Card Template Layout</h3>
                                <form className="exam-form form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Template Name <span className="required">*</span></label>
                                        <input type="text" className="form-input" required placeholder="e.g. Standard Admit Card" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Heading</label>
                                        <input type="text" className="form-input" placeholder="e.g. Board Examination 2024" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">School Name</label>
                                        <input type="text" className="form-input" defaultValue="Mount Zion School" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Exam Center</label>
                                        <input type="text" className="form-input" />
                                    </div>
                                    <div className="form-group col-span-2">
                                        <label className="form-label">Footer Text</label>
                                        <textarea className="form-textarea" rows="2" placeholder="e.g. Please bring this card daily..."></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Left Logo</label>
                                        <input type="file" className="form-input" style={{padding: '7px'}} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Signatures (Principal)</label>
                                        <input type="file" className="form-input" style={{padding: '7px'}} />
                                    </div>
                                    <div className="form-actions col-span-2 text-right">
                                        <button className="btn btn-primary"><Save size={18} /> Save Template</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
