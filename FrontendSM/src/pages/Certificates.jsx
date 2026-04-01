import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Printer, FileText, Award, Plus, Trash2 } from 'lucide-react';
import { customAlert, customConfirm } from '../utils/dialogs';
import './Certificates.css';

const API = '/api';

export default function Certificates() {
    const [activeTab, setActiveTab] = useState('generate');
    const [formData, setFormData] = useState({ class: '', section: '', keyword: '' });
    const [certType, setCertType] = useState('');
    const [purpose, setPurpose] = useState('');
    const [remarks, setRemarks] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetch(`${API}/certificates`).then(r => r.json()).then(setCertificates).catch(() => {});
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            let url = `${API}/students?status=Active`;
            if (formData.class) url += `&class=${encodeURIComponent(formData.class)}`;
            if (formData.section) url += `&section=${formData.section}`;
            const res = await fetch(url);
            let data = await res.json();
            if (formData.keyword) {
                const kw = formData.keyword.toLowerCase();
                data = data.filter(s => `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.rollNo}`.toLowerCase().includes(kw));
            }
            setResults(data);
            setHasSearched(true);
        } catch { setResults([]); setHasSearched(true); }
    };

    const handleGenerate = async (student) => {
        if (!certType) return await customAlert('Select a certificate type');
        setGenerating(true);
        try {
            const body = {
                studentId: student.id,
                studentName: `${student.firstName} ${student.lastName}`,
                class: student.class,
                section: student.section,
                type: certType,
                purpose,
                remarks,
            };
            const res = await fetch(`${API}/certificates`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const cert = await res.json();
            await customAlert(`Certificate generated! No: ${cert.certificateNo}`);
            setCertificates([cert, ...certificates]);
        } catch { await customAlert('Failed to generate certificate'); }
        finally { setGenerating(false); }
    };

    const handleDelete = async (id) => {
        if (!await customConfirm('Delete this certificate?')) return;
        await fetch(`${API}/certificates/${id}`, { method: 'DELETE' });
        setCertificates(certificates.filter(c => c._id !== id));
    };

    return (
        <div className="certificates-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link><span className="separator">/</span><span>Certificates</span>
                    </div>
                    <h1>Certificate Management</h1>
                </div>
            </div>

            <div className="attendance-tabs" style={{marginBottom:20}}>
                <button className={`tab-btn ${activeTab==='generate'?'active':''}`} onClick={()=>setActiveTab('generate')}><Plus size={16}/> Generate Certificate</button>
                <button className={`tab-btn ${activeTab==='issued'?'active':''}`} onClick={()=>setActiveTab('issued')}><Award size={16}/> Issued Certificates ({certificates.length})</button>
            </div>

            {activeTab === 'generate' && (
                <>
                    <div className="card certificates-filter-card">
                        <form onSubmit={handleSearch}>
                            <div className="form-grid-4">
                                <div className="form-group">
                                    <label className="form-label">Class</label>
                                    <select className="form-select" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})}>
                                        <option value="">All Classes</option>
                                        {['Nursery','LKG','UKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'].map(c=><option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Section</label>
                                    <select className="form-select" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})}>
                                        <option value="">All Sections</option>
                                        {['A','B','C','D'].map(s=><option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Certificate Type <span className="required">*</span></label>
                                    <select className="form-select" value={certType} onChange={e => setCertType(e.target.value)}>
                                        <option value="">Select Type</option>
                                        <option value="Bonafide">Bonafide Certificate</option>
                                        <option value="Character">Character Certificate</option>
                                        <option value="Study">Study Certificate</option>
                                        <option value="Migration">Migration Certificate</option>
                                        <option value="Custom">Custom Certificate</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{alignSelf:'flex-end'}}>
                                    <button type="submit" className="btn btn-primary"><Search size={18}/> Search Students</button>
                                </div>
                            </div>
                            <div className="form-row two-cols" style={{marginTop:16}}>
                                <div className="form-group">
                                    <label className="form-label">Purpose</label>
                                    <input type="text" className="form-input" value={purpose} onChange={e=>setPurpose(e.target.value)} placeholder="e.g. School transfer, Admission" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Search Student</label>
                                    <input type="text" className="form-input" value={formData.keyword} onChange={e=>setFormData({...formData,keyword:e.target.value})} placeholder="Search by name..." />
                                </div>
                            </div>
                        </form>
                    </div>

                    {hasSearched && (
                        <div className="card certificates-results-card animate-fade-in" style={{marginTop:24}}>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead><tr><th>Adm No</th><th>Student</th><th>Class</th><th>Father</th><th>Contact</th><th style={{textAlign:'center'}}>Action</th></tr></thead>
                                    <tbody>
                                        {results.length > 0 ? results.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.admissionNo}</td>
                                                <td className="fw-600">{s.firstName} {s.lastName}</td>
                                                <td>{s.class} - {s.section}</td>
                                                <td>{s.fatherName}</td>
                                                <td>{s.contactNo}</td>
                                                <td>
                                                    <div className="action-buttons-center">
                                                        <button className="btn btn-primary btn-sm" onClick={()=>handleGenerate(s)} disabled={generating||!certType}>
                                                            {generating ? '...' : 'Generate'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="6"><div className="empty-state"><FileText size={48}/><h3>No Students Found</h3></div></td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'issued' && (
                <div className="card" style={{padding:24}}>
                    {certificates.length > 0 ? (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead><tr><th>Certificate No</th><th>Student</th><th>Type</th><th>Class</th><th>Issue Date</th><th>Purpose</th><th>Action</th></tr></thead>
                                <tbody>
                                    {certificates.map(c => (
                                        <tr key={c._id}>
                                            <td className="fw-600">{c.certificateNo}</td>
                                            <td>{c.studentName}</td>
                                            <td><span className="badge badge-info">{c.type}</span></td>
                                            <td>{c.class} - {c.section}</td>
                                            <td>{new Date(c.issueDate).toLocaleDateString('en-IN')}</td>
                                            <td>{c.purpose || '—'}</td>
                                            <td>
                                                <button className="btn-icon text-danger" title="Delete" onClick={()=>handleDelete(c._id)}><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state" style={{padding:40}}><Award size={48}/><h3>No Certificates Issued Yet</h3><p>Generate certificates from the Generate tab.</p></div>
                    )}
                </div>
            )}
        </div>
    );
}
