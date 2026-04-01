import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, FileText, Upload, Video, FileDigit } from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import './EContent.css';

export default function EContent() {
    const [activeTab, setActiveTab] = useState('add'); // 'add', 'custom', 'view'
    const [eContentList, setEContentList] = useState([
        { id: 1, class: 'VII', section: 'A', subject: 'Mathematics', topic: 'Algebra Basics', type: 'Video', date: '2026-03-16' },
        { id: 2, class: 'VIII', section: 'B', subject: 'English', topic: 'Tenses', type: 'PDF', date: '2026-03-15' },
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await customAlert('E-Content saved successfully!');
    };

    return (
        <div className="econtent-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Academics</span>
                        <span className="separator">/</span>
                        <span>E-Content</span>
                    </div>
                    <h1>E-Content Management</h1>
                </div>
                <div>
                    <Link to="/" className="btn btn-outline">
                        <ArrowLeft size={16} /> Back
                    </Link>
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="page-tabs" style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
                <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>Add E-Content</button>
                <button className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>Customized E-Content</button>
                <button className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>View Content</button>
            </div>

            {activeTab === 'add' && (
                <div className="card animate-slide-up" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: 'var(--primary)' }}>Add E-Content</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 20 }}>
                            <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Content Type <span className="required">*</span></label>
                            <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                                {['Document', 'Video', 'Audio', 'PPT', 'PDF', 'Doc', 'Text', 'Link'].map(type => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-light)', borderRadius: 4, cursor: 'pointer' }}>
                                        <input type="checkbox" />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Class <span className="required">*</span></label>
                                <select className="form-select" required>
                                    <option value="">Select Class</option>
                                    <option value="VI">Class VI</option>
                                    <option value="VII">Class VII</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section <span className="required">*</span></label>
                                <select className="form-select" required>
                                    <option value="">Select Section</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subject <span className="required">*</span></label>
                                <select className="form-select" required>
                                    <option value="">Select Subject</option>
                                    <option value="Math">Math</option>
                                    <option value="Science">Science</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Topic <span className="required">*</span></label>
                                <input type="text" className="form-input" required placeholder="e.g. Algebra" />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: 16 }}>
                            <label className="form-label">Description</label>
                            <textarea className="form-input" rows="3" placeholder="Enter E-Content description..."></textarea>
                        </div>

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginTop: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Assignment Included?</label>
                                <select className="form-select">
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Allow External Opening</label>
                                <select className="form-select">
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: 20 }}>
                            <label className="form-label">Upload File</label>
                            <div className="upload-box" style={{ border: '2px dashed var(--border-light)', padding: 24, textAlign: 'center', borderRadius: 8, cursor: 'pointer', background: 'var(--bg-light)', transition: 'border-color 0.2s' }}>
                                <Upload size={32} style={{ color: 'var(--text-grey)', marginBottom: 8 }} />
                                <p style={{ color: 'var(--text-dark)', fontWeight: 500 }}>Drop files here or click to upload</p>
                                <p style={{ color: 'var(--text-grey)', fontSize: '0.8rem', marginTop: 4 }}>Maximum file size: 50MB</p>
                                <input type="file" style={{ display: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button type="submit" className="btn btn-primary">Save E-Content</button>
                            <button type="button" className="btn btn-outline" onClick={() => window.location.reload()}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'custom' && (
                <div className="card animate-slide-up" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: 'var(--primary)' }}>Customized EContent Grid</h3>
                    <p style={{ color: 'var(--text-grey)', marginBottom: 16 }}>Assign E-Content to multiple classes and sections simultaneously.</p>
                    <div className="custom-hw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, border: '1px solid var(--border-light)', padding: 16, borderRadius: 8 }}>
                        {['VI-A', 'VI-B', 'VII-A', 'VII-B', 'VIII-A', 'VIII-B'].map(item => (
                            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--bg-light)', borderRadius: 4, cursor: 'pointer' }}>
                                <input type="checkbox" />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                    <button type="button" className="btn btn-primary" style={{ marginTop: 16 }}>Assign to Selected</button>
                </div>
            )}

            {activeTab === 'view' && (
                <div className="card animate-slide-up">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>E-Content List</h3>
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
                                    <th>Type</th>
                                    <th>Upload Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eContentList.map(item => (
                                    <tr key={item.id}>
                                        <td className="td-bold">{item.class}</td>
                                        <td>{item.section}</td>
                                        <td>{item.subject}</td>
                                        <td>{item.topic}</td>
                                        <td><span className="badge badge-info">{item.type}</span></td>
                                        <td>{item.date}</td>
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
