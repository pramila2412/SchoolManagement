import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Search, Eye, Printer, FileText, Award, Plus, Trash2 } from 'lucide-react';
import { customAlert, customConfirm } from '../utils/dialogs';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
    const [localCertificates, setLocalCertificates] = useLocalStorage('mzs_certificates', []);
    const [apiCertificates, setApiCertificates] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [previewCert, setPreviewCert] = useState(null);

    // Merge API and Local certificates
    const certificates = [...apiCertificates, ...localCertificates].sort((a, b) => 
        new Date(b.issueDate || b.createdAt) - new Date(a.issueDate || a.createdAt)
    );

    // Helper to normalize class names for searching (e.g. "Grade 1" -> "I", "1")
    const normalizeClass = (cls) => {
        if (!cls) return '';
        return cls.replace(/Grade\s+/i, '').replace(/Class\s+/i, '').trim();
    };

    useEffect(() => {
        fetch(`${API}/certificates`)
            .then(r => r.json())
            .then(data => Array.isArray(data) ? setApiCertificates(data) : setApiCertificates([]))
            .catch(() => setApiCertificates([]));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            // Load API students
            let apiStudents = [];
            try {
                let url = `${API}/students?status=Active`;
                if (formData.class) url += `&class=${encodeURIComponent(formData.class)}`;
                if (formData.section) url += `&section=${formData.section}`;
                const res = await fetch(url);
                apiStudents = await res.json();
            } catch (err) { console.error("API search failed", err); }

            // Load Local students (normalized)
            const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');
            const normalizedLocal = localData.map(s => {
                const nameParts = (s.name || '').split(' ');
                return {
                    ...s,
                    firstName: s.firstName || nameParts[0] || 'Unknown',
                    lastName: s.lastName || nameParts.slice(1).join(' ') || '',
                    admissionNo: s.admissionNo || s.id || 'N/A',
                    rollNo: s.rollNo || 'N/A'
                };
            }).filter(s => {
                const searchClass = normalizeClass(formData.class);
                const studentClass = normalizeClass(s.class);
                
                if (searchClass && studentClass !== searchClass) return false;
                if (formData.section && s.section !== formData.section) return false;
                if (s.status === 'Inactive') return false;
                return true;
            });

            // Merge
            let data = [...apiStudents, ...normalizedLocal];

            if (formData.keyword) {
                const kw = formData.keyword.toLowerCase();
                data = data.filter(s => 
                    `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.rollNo}`.toLowerCase().includes(kw)
                );
            }
            setResults(data);
            setHasSearched(true);
        } catch (err) { 
            console.error("Search failed", err);
            setResults([]); 
            setHasSearched(true); 
        }
    };

    const handleGenerate = async (student) => {
        if (!certType) return await customAlert('Select a certificate type');
        setGenerating(true);
        try {
            const certNo = `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            const body = {
                studentId: student.id || student._id,
                studentName: `${student.firstName} ${student.lastName}`,
                class: student.class,
                section: student.section,
                type: certType,
                purpose,
                remarks,
                certificateNo: certNo,
                issueDate: new Date().toISOString()
            };

            // Attempt API save
            try {
                const res = await fetch(`${API}/certificates`, { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(body) 
                });
                if (res.ok) {
                    const savedCert = await res.json();
                    setApiCertificates([savedCert, ...apiCertificates]);
                } else {
                    // Fallback to local only if API fails
                    setLocalCertificates([body, ...localCertificates]);
                }
            } catch {
                // Network error, save locally
                setLocalCertificates([body, ...localCertificates]);
            }

            await customAlert(`Certificate generated! No: ${certNo}`);
            setPurpose('');
            setRemarks('');
        } catch (err) { 
            console.error("Generation failed", err);
            await customAlert('Failed to generate certificate'); 
        } finally { 
            setGenerating(false); 
        }
    };

    const handleDelete = async (id) => {
        if (!await customConfirm('Delete this certificate?')) return;
        
        // Try deleting from local storage first
        const isLocal = localCertificates.some(c => c._id === id || c.certificateNo === id);
        if (isLocal) {
            setLocalCertificates(localCertificates.filter(c => c._id !== id && c.certificateNo !== id));
            await customAlert('Certificate record deleted locally.');
            return;
        }

        // Otherwise try API
        try {
            await fetch(`${API}/certificates/${id}`, { method: 'DELETE' });
            setApiCertificates(apiCertificates.filter(c => c._id !== id));
        } catch (err) {
            console.error("API delete failed", err);
        }
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
                                        {results.length > 0 ? results.map(s => {
                                            const sId = s.id || s._id;
                                            return (
                                                <tr key={sId}>
                                                    <td>{s.admissionNo}</td>
                                                    <td className="fw-600">{s.firstName} {s.lastName}</td>
                                                    <td>{s.class} - {s.section}</td>
                                                    <td>{s.fatherName}</td>
                                                    <td>{s.contactNo}</td>
                                                    <td>
                                                        <div className="action-buttons-center">
                                                            <button 
                                                                className="btn btn-outline btn-sm" 
                                                                title="Preview Certificate"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (!certType) {
                                                                        customAlert('Please select a Certificate Type from the dropdown above to preview.');
                                                                        return;
                                                                    }
                                                                    setPreviewCert({
                                                                        type: certType,
                                                                        studentName: `${s.firstName} ${s.lastName}`,
                                                                        class: s.class,
                                                                        section: s.section,
                                                                        purpose: purpose || 'general reference',
                                                                        issueDate: new Date().toISOString(),
                                                                        certificateNo: `PREVIEW-000`
                                                                    });
                                                                }}
                                                            >
                                                                <Eye size={16} style={{marginRight: 4}}/> Preview
                                                            </button>
                                                            <button 
                                                                className="btn btn-primary btn-sm" 
                                                                onClick={() => {
                                                                    if (!certType) {
                                                                        customAlert('Please select a Certificate Type from the dropdown above before generating.');
                                                                        return;
                                                                    }
                                                                    handleGenerate(s);
                                                                }} 
                                                                disabled={generating}
                                                            >
                                                                {generating ? '...' : 'Generate'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
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
                                        <tr key={c._id || c.certificateNo}>
                                            <td className="fw-600">{c.certificateNo}</td>
                                            <td>{c.studentName}</td>
                                            <td><span className="badge badge-info">{c.type}</span></td>
                                            <td>{c.class} - {c.section}</td>
                                            <td>{new Date(c.issueDate).toLocaleDateString('en-IN')}</td>
                                            <td>{c.purpose || '—'}</td>
                                            <td>
                                                <button className="btn-icon text-primary" title="View Certificate" onClick={()=>setPreviewCert(c)}><Eye size={16}/></button>
                                                <button className="btn-icon text-danger" title="Delete" onClick={()=>handleDelete(c._id || c.certificateNo)}><Trash2 size={16}/></button>
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
            
            {previewCert && ReactDOM.createPortal(
                <div className="cert-modal-overlay">
                    <div className="cert-modal-container">
                        <div className="cert-modal-header">
                            <h2>Certificate Preview</h2>
                            <div className="cert-modal-actions">
                                <select 
                                    className="form-select" 
                                    style={{ width: 'auto', padding: '6px 12px', fontSize: '14px', height: 'auto' }}
                                    value={previewCert.orientation || 'landscape'}
                                    onChange={(e) => setPreviewCert({...previewCert, orientation: e.target.value})}
                                >
                                    <option value="landscape">Landscape</option>
                                    <option value="portrait">Portrait</option>
                                </select>
                                <button className="btn btn-outline" onClick={() => setPreviewCert(null)}>Close</button>
                                <button className="btn btn-primary" onClick={() => window.print()}><Printer size={16}/> Print</button>
                            </div>
                        </div>
                        <div className="cert-modal-body">
                            <div className="canva-certificate" id="printable-certificate" data-orientation={previewCert.orientation || 'landscape'}>
                                <div className="cert-border-outer">
                                    <div className="cert-border-inner">
                                        <div className="cert-header">
                                            <div className="cert-logo-placeholder">
                                                <Award size={48} className="cert-logo-icon" />
                                            </div>
                                            <h1 className="cert-school-name">MZS International School</h1>
                                            <p className="cert-school-sub">EXCELLENCE IN EDUCATION</p>
                                        </div>
                                        
                                        <div className="cert-title-container">
                                            <h2 className="cert-title">{previewCert.type} Certificate</h2>
                                        </div>
                                        
                                        <div className="cert-content">
                                            <p className="cert-presented">This is to proudly certify that</p>
                                            <h3 className="cert-student-name">{previewCert.studentName}</h3>
                                            <div className="cert-student-underline"></div>
                                            
                                            <p className="cert-body-text">
                                                has been a bonafide student of <strong>Class {previewCert.class} - {previewCert.section}</strong>. 
                                                This certificate is officially issued for the purpose of <strong>{previewCert.purpose || 'general reference'}</strong>.
                                                We commend their dedication and wish them great success in all future endeavors.
                                            </p>
                                        </div>
                                        
                                        <div className="cert-footer">
                                            <div className="cert-signature-block">
                                                <div className="sig-line">{new Date(previewCert.issueDate).toLocaleDateString('en-IN')}</div>
                                                <p>Date of Issue</p>
                                            </div>
                                            
                                            <div className="cert-badge">
                                                <div className="seal">
                                                    <div className="seal-inner">
                                                        <span className="seal-text">OFFICIAL</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="cert-signature-block">
                                                <div className="sig-line" style={{ color: 'transparent' }}>Signature</div>
                                                <p>Principal Signature</p>
                                            </div>
                                        </div>
                                        
                                        <div className="cert-footer-meta">
                                            Ref No: {previewCert.certificateNo}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
