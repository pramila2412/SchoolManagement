import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileEdit, FileText, Eye, Printer, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { customAlert, customConfirm } from '../utils/dialogs';
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
    const [tcList, setTcList] = useLocalStorage('issued_tcs', []);

    const handleDeleteTc = async (id) => {
        if (await customConfirm("Are you sure you want to delete this TC record?")) {
            setTcList(prev => prev.filter(tc => tc.tcNo !== id));
            await customAlert('TC record deleted.');
        }
    };

    const handleViewTc = (tc) => {
        customAlert(`
            Transfer Certificate Details
            -----------------------------
            TC No: ${tc.tcNo}
            Student: ${tc.studentName}
            Class: ${tc.class}-${tc.section}
            Date of Leaving: ${new Date(tc.dateOfLeaving).toLocaleDateString()}
            Reason: ${tc.reasonForLeaving}
            Conduct: ${tc.conduct}
            Medium: ${tc.medium}
        `);
    };

    const handlePrintTc = (tc) => {
        customAlert(`Initiating print for TC #${tc.tcNo}...\n(In a real app, this would open a styled PDF printable view)`);
    };

    // Helper to normalize class names for searching (e.g. "Grade 3" -> "3")
    const normalizeClass = (cls) => {
        if (!cls) return '';
        // Map Roman Numerals to digits if needed, but for now just strip "Grade " or "Class "
        return cls.replace(/Grade\s+/i, '').replace(/Class\s+/i, '').trim();
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            // Fetch API students
            let apiStudents = [];
            try {
                let url = `${API}/students?status=Active`;
                if (formData.class) url += `&class=${encodeURIComponent(formData.class)}`;
                if (formData.section) url += `&section=${formData.section}`;
                const res = await fetch(url);
                apiStudents = await res.json();
            } catch (err) { console.error("API search failed", err); }

            // Fetch Local students (normalized)
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
            
            if (formData.batch) {
                data = data.filter(s => s.batch === formData.batch || s.academicYear === formData.batch);
            }
            
            if (formData.keyword) {
                const kw = formData.keyword.toLowerCase();
                data = data.filter(s => `${s.firstName || ''} ${s.lastName || ''} ${s.admissionNo || ''} ${s.rollNo || ''} ${s.fatherName || ''}`.toLowerCase().includes(kw));
            }
            setResults(data);
            setHasSearched(true);
        } catch (err) { 
            console.error("Search failed", err);
            setResults([]); 
            setHasSearched(true); 
        }
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
            const tc = {
                ...body,
                tcNo: `TC/${new Date().getFullYear()}/${tcList.length + 101}`,
                _id: Date.now()
            };
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
                                        {results.length > 0 ? results.map(s => {
                                            const sId = s.id || s._id;
                                            return (
                                                <tr key={sId}>
                                                    <td>{s.admissionNo}</td>
                                                    <td className="fw-600">{(s.firstName || '') + ' ' + (s.lastName || '')}</td>
                                                    <td>{s.class} - {s.section}</td>
                                                    <td>{s.fatherName}</td>
                                                    <td>{s.contactNo}</td>
                                                    <td><div className="action-buttons-center"><button className="btn btn-primary btn-sm" onClick={()=>openTcForm(s)}>Generate TC</button></div></td>
                                                </tr>
                                            );
                                        }) : (
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
                                    <thead><tr><th>TC No</th><th>Student</th><th>Class</th><th>Date of Leaving</th><th>Reason</th><th>Conduct</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {tcList.map(tc=>(
                                            <tr key={tc.tcNo}>
                                                <td className="fw-600">{tc.tcNo}</td>
                                                <td>{tc.studentName}</td>
                                                <td>{tc.class} - {tc.section}</td>
                                                <td>{new Date(tc.dateOfLeaving).toLocaleDateString('en-IN')}</td>
                                                <td>{tc.reasonForLeaving}</td>
                                                <td><span className="badge badge-success">{tc.conduct}</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button className="btn-icon" onClick={() => handleViewTc(tc)} title="View"><Eye size={16}/></button>
                                                        <button className="btn-icon" onClick={() => handlePrintTc(tc)} title="Print"><Printer size={16}/></button>
                                                        <button className="btn-icon" style={{color:'var(--danger)'}} onClick={() => handleDeleteTc(tc.tcNo)} title="Delete"><Trash2 size={16}/></button>
                                                    </div>
                                                </td>
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
