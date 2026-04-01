import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileEdit, FileText, Eye, Printer } from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import './TC.css';

const API = '/api';

export default function TC() {
    const [activeView, setActiveView] = useState('search');
    const [formData, setFormData] = useState({ batch: '2024-2025', class: '', section: '', keyword: '' });
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [tcForm, setTcForm] = useState({ dateOfLeaving: '', reasonForLeaving: '', conduct: 'Good', medium: 'English' });
    const [generating, setGenerating] = useState(false);
    const [tcList, setTcList] = useState([]);

    useEffect(() => {
        fetch(`${API}/tc`).then(r => r.json()).then(setTcList).catch(() => {});
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            let url = `${API}/students?status=Active`;
            if (formData.class) url += `&class=${encodeURIComponent(formData.class)}`;
            if (formData.section) url += `&section=${formData.section}`;
            const res = await fetch(url);
            let data = await res.json();
            
            if (formData.batch) {
                data = data.filter(s => s.batch === formData.batch || s.academicYear === formData.batch);
            }
            
            if (formData.keyword) {
                const kw = formData.keyword.toLowerCase();
                data = data.filter(s => `${s.firstName || ''} ${s.lastName || ''} ${s.admissionNo || ''} ${s.rollNo || ''} ${s.fatherName || ''}`.toLowerCase().includes(kw));
            }
            setResults(data);
            setHasSearched(true);
        } catch { setResults([]); setHasSearched(true); }
    };

    const openTcForm = (student) => {
        setSelectedStudent(student);
        setTcForm({ dateOfLeaving: '', reasonForLeaving: '', conduct: 'Good', medium: 'English' });
        setActiveView('generate');
    };

    const handleGenerate = async () => {
        if (!tcForm.dateOfLeaving || !tcForm.reasonForLeaving) return await customAlert('Fill all required fields');
        setGenerating(true);
        try {
            const body = {
                studentId: selectedStudent.id,
                studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
                class: selectedStudent.class,
                section: selectedStudent.section,
                admissionNo: selectedStudent.admissionNo,
                admissionDate: selectedStudent.admissionDate,
                dateOfBirth: selectedStudent.dateOfBirth,
                fatherName: selectedStudent.fatherName,
                classLastStudied: selectedStudent.class,
                ...tcForm,
            };
            const res = await fetch(`${API}/tc`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const tc = await res.json();
            await customAlert(`TC Generated! TC No: ${tc.tcNo}`);
            setActiveView('search');
            setResults(results.filter(r => r.id !== selectedStudent.id));
            setTcList([tc, ...tcList]);
        } catch { await customAlert('Failed to generate TC'); }
        finally { setGenerating(false); }
    };

    return (
        <div className="tc-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link><span className="separator">/</span><span>Transfer Certificate</span>
                    </div>
                    <h1>Transfer Certificate (TC)</h1>
                </div>
            </div>

            {activeView === 'search' && (
                <>
                    <div className="card tc-filter-card">
                        <form onSubmit={handleSearch}>
                            <div className="form-grid-3">
                                <div className="form-group">
                                    <label className="form-label">Batch</label>
                                    <select className="form-select" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})}>
                                        <option value="2024-2025">2024-2025</option><option value="2023-2024">2023-2024</option>
                                    </select>
                                </div>
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
                            </div>
                            <div className="form-group" style={{marginTop:20}}>
                                <label className="form-label">Search Student</label>
                                <input type="text" className="form-input" placeholder="Search by name, admission no..." value={formData.keyword} onChange={e => setFormData({...formData, keyword: e.target.value})} />
                            </div>
                            <div className="form-actions" style={{display:'flex',justifyContent:'flex-end',marginTop:24}}>
                                <button type="submit" className="btn btn-primary"><Search size={18}/> Search</button>
                            </div>
                        </form>
                    </div>

                    {hasSearched && (
                        <div className="card tc-results-card animate-slide-up" style={{marginTop:24}}>
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
                                                <td><div className="action-buttons-center"><button className="btn btn-primary btn-sm" onClick={()=>openTcForm(s)}>Generate TC</button></div></td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="6"><div className="empty-state"><FileText size={48}/><h3>No Active Students Found</h3></div></td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {tcList.length > 0 && (
                        <div className="card" style={{marginTop:24,padding:24}}>
                            <h3 style={{marginBottom:16}}>Recently Issued TCs</h3>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead><tr><th>TC No</th><th>Student</th><th>Class</th><th>Date of Leaving</th><th>Reason</th><th>Conduct</th></tr></thead>
                                    <tbody>
                                        {tcList.map(tc=>(
                                            <tr key={tc._id}>
                                                <td className="fw-600">{tc.tcNo}</td>
                                                <td>{tc.studentName}</td>
                                                <td>{tc.class} - {tc.section}</td>
                                                <td>{new Date(tc.dateOfLeaving).toLocaleDateString('en-IN')}</td>
                                                <td>{tc.reasonForLeaving}</td>
                                                <td><span className="badge badge-success">{tc.conduct}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeView === 'generate' && selectedStudent && (
                <div className="card" style={{padding:30,marginTop:20}}>
                    <h3 style={{marginBottom:20}}>Generate TC for {selectedStudent.firstName} {selectedStudent.lastName}</h3>
                    <div className="detail-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:24}}>
                        <div><span style={{color:'var(--text-light)',fontSize:'0.85rem'}}>Admission No</span><p style={{fontWeight:600}}>{selectedStudent.admissionNo}</p></div>
                        <div><span style={{color:'var(--text-light)',fontSize:'0.85rem'}}>Class</span><p style={{fontWeight:600}}>{selectedStudent.class} - {selectedStudent.section}</p></div>
                        <div><span style={{color:'var(--text-light)',fontSize:'0.85rem'}}>Father's Name</span><p style={{fontWeight:600}}>{selectedStudent.fatherName}</p></div>
                        <div><span style={{color:'var(--text-light)',fontSize:'0.85rem'}}>Date of Birth</span><p style={{fontWeight:600}}>{selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-IN') : '—'}</p></div>
                    </div>
                    <div className="form-row two-cols">
                        <div className="form-group">
                            <label className="form-label">Date of Leaving <span className="required">*</span></label>
                            <input type="date" className="form-input" value={tcForm.dateOfLeaving} onChange={e=>setTcForm({...tcForm,dateOfLeaving:e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Conduct</label>
                            <select className="form-select" value={tcForm.conduct} onChange={e=>setTcForm({...tcForm,conduct:e.target.value})}>
                                {['Excellent','Good','Satisfactory','Needs Improvement'].map(c=><option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-row two-cols" style={{marginTop:16}}>
                        <div className="form-group">
                            <label className="form-label">Reason for Leaving <span className="required">*</span></label>
                            <input type="text" className="form-input" value={tcForm.reasonForLeaving} onChange={e=>setTcForm({...tcForm,reasonForLeaving:e.target.value})} placeholder="e.g. Transfer, Relocation" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Medium of Instruction</label>
                            <select className="form-select" value={tcForm.medium} onChange={e=>setTcForm({...tcForm,medium:e.target.value})}>
                                <option value="English">English</option><option value="Hindi">Hindi</option><option value="Telugu">Telugu</option>
                            </select>
                        </div>
                    </div>
                    <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:24}}>
                        <button className="btn btn-outline" onClick={()=>setActiveView('search')}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>{generating ? 'Generating...' : 'Generate TC'}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
