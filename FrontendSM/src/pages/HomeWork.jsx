import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, FileText, Calendar } from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import './HomeWork.css';

export default function HomeWork() {
    const [activeTab, setActiveTab] = useState('assign'); // 'assign', 'custom', 'reports'
    const [assignForm, setAssignForm] = useState({ class: '', section: '', date: new Date().toISOString().split('T')[0], description: '' });
    const [reports, setReports] = useState([
        { id: 1, class: 'VII', section: 'A', subject: 'Mathematics', topic: 'Quadratic Equations', date: '2026-03-16', status: 'Assigned' },
        { id: 2, class: 'VIII', section: 'B', subject: 'Science', topic: 'Plant Reproduction', date: '2026-03-16', status: 'Assigned' },
        { id: 3, class: 'VI', section: 'C', subject: 'English', topic: 'Reported Speech', date: '2026-03-15', status: 'Assigned' }
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await customAlert('Homework saved successfully!');
    };

    return (
        <div className="homework-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Academics</span>
                        <span className="separator">/</span>
                        <span>Home-Work</span>
                    </div>
                    <h1>Home-Work Management</h1>
                </div>
                <div>
                    <Link to="/" className="btn btn-outline">
                        <ArrowLeft size={16} /> Back
                    </Link>
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="page-tabs" style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
                <button className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`} onClick={() => setActiveTab('assign')}>Assign Homework</button>
                <button className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>Customized Homework</button>
                <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Reports</button>
            </div>

            {activeTab === 'assign' && (
                <div className="card animate-slide-up" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: 'var(--primary)' }}>Save Home-Work</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Class <span className="required">*</span></label>
                                <select className="form-select" required value={assignForm.class} onChange={e => setAssignForm({ ...assignForm, class: e.target.value })}>
                                    <option value="">Select Class</option>
                                    <option value="VI">Class VI</option>
                                    <option value="VII">Class VII</option>
                                    <option value="VIII">Class VIII</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section <span className="required">*</span></label>
                                <select className="form-select" required value={assignForm.section} onChange={e => setAssignForm({ ...assignForm, section: e.target.value })}>
                                    <option value="">Select Section</option>
                                    <option value="A">Section A</option>
                                    <option value="B">Section B</option>
                                    <option value="C">Section C</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Home-Work Date <span className="required">*</span></label>
                                <input type="date" className="form-input" required value={assignForm.date} onChange={e => setAssignForm({ ...assignForm, date: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: 16 }}>
                            <label className="form-label">Description / Work Details</label>
                            <textarea className="form-input" rows="4" placeholder="Enter homework description..." value={assignForm.description} onChange={e => setAssignForm({ ...assignForm, description: e.target.value })} style={{ resize: 'vertical' }}></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button type="submit" className="btn btn-primary">Save Homework</button>
                            <button type="button" className="btn btn-outline" onClick={() => setAssignForm({ class: '', section: '', date: new Date().toISOString().split('T')[0], description: '' })}>Clear</button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'custom' && (
                <div className="card animate-slide-up" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: 'var(--primary)' }}>Customized Homework (Bulk Assignment)</h3>
                    <p style={{ color: 'var(--text-grey)', marginBottom: 16 }}>Assign homework to multiple sections or classes simultaneously.</p>
                    {/* Simplified Grid representation for demo */}
                    <div className="custom-hw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, border: '1px solid var(--border-light)', padding: 16, borderRadius: 8 }}>
                        {['VI-A', 'VI-B', 'VI-C', 'VII-A', 'VII-B', 'VII-C', 'VIII-A', 'VIII-B'].map(item => (
                            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--bg-light)', borderRadius: 4, cursor: 'pointer' }}>
                                <input type="checkbox" />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                    <div className="form-group" style={{ marginTop: 16 }}>
                        <label className="form-label">Common Homework Details</label>
                        <textarea className="form-input" rows="3" placeholder="Enter homework description for selected classes..."></textarea>
                    </div>
                    <button type="button" className="btn btn-primary" style={{ marginTop: 16 }}>Assign to Selected</button>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="card animate-slide-up">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Homework Report</h3>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input type="text" placeholder="Search report..." className="form-input" style={{ width: 200, padding: '6px 12px' }} />
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Subject</th>
                                    <th>Topic</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map(r => (
                                    <tr key={r.id}>
                                        <td className="td-bold">{r.class}</td>
                                        <td>{r.section}</td>
                                        <td>{r.subject}</td>
                                        <td>{r.topic}</td>
                                        <td>{r.date}</td>
                                        <td><span className="badge badge-success">{r.status}</span></td>
                                        <td>
                                            <button className="btn-icon" style={{ color: 'var(--info)' }}><FileText size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
