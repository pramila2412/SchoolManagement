import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import {
    LayoutList, ClipboardCheck, Stamp, Save, PlusCircle, Calendar,
    BookOpen, FileText, BarChart3, Settings, Trash2, CheckCircle2,
    XCircle, Award, ChevronRight, Users, Eye, Download, Send, Edit3
} from 'lucide-react';
import { customAlert, customConfirm } from '../utils/dialogs';
import './Examination.css';

const API = '/api/exam';

export const STANDARD_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
export const STANDARD_SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Accountancy', 'Business Studies', 'Economics'];

function useApi(endpoint) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetch_ = useCallback(async () => {
        try { 
            setLoading(true); 
            const r = await fetch(`${API}${endpoint}`); 
            const j = await r.json(); 
            setData(Array.isArray(j) ? j : []); 
        } catch (e) { 
            console.error(e); 
            setData([]); 
        } finally { 
            setLoading(false); 
        }
    }, [endpoint]);
    useEffect(() => { fetch_(); }, [fetch_]);
    return { data, loading, refresh: fetch_ };
}

// ======================== EXAM SETUP ========================
function ExamSetupTab() {
    const { data: exams, refresh } = useApi('/');
    const activeYear = JSON.parse(localStorage.getItem('academic_years') || '[]').find(y => y.active)?.label || '2025-2026';
    const [form, setForm] = useState({ name:'', academicYear: activeYear, type:'Theory', startDate:'', endDate:'', classes:[] });
    const [classInput, setClassInput] = useState({ className:'', sections:'' });
    const [selectedExam, setSelectedExam] = useState(null);
    const [subForm, setSubForm] = useState({ targetClass: '', name:'', code:'', type:'Both', totalMarks:100, passingMarks:33, theoryMarks:80, practicalMarks:20, teacher: '' });

    const addClass = () => {
        if (!classInput.className) return customAlert('Please select a class');
        if (!classInput.sections) return customAlert('Please select at least one section');
        setForm(f => ({ ...f, classes: [...f.classes, { className: classInput.className, sections: classInput.sections.split(',').filter(Boolean).map(s=>s.trim()), subjects:[] }] }));
        setClassInput({ className:'', sections:'' });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.classes.length === 0) return customAlert('Please add at least one class to the exam before saving.', 'Missing Class', 'error');
        await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
        setForm({ name:'', academicYear: activeYear, type:'Theory', startDate:'', endDate:'', classes:[] });
        refresh();
    };
    const handleDelete = async (id) => { if(!await customConfirm('Delete?')) return; await fetch(`${API}/${id}`,{method:'DELETE'}); refresh(); };
    const handleAddSubject = async (e) => {
        e.preventDefault(); if(!selectedExam) return;
        const exam = exams.find(x=>x._id===selectedExam);
        if (!subForm.targetClass) return customAlert('Please select a target class & section');

        if (subForm.type === 'Both' || subForm.type === 'Practical') {
            if (subForm.totalMarks !== (subForm.theoryMarks + subForm.practicalMarks)) {
                return customAlert(`Validation Failed! Total Marks (${subForm.totalMarks}) must equal Theory (${subForm.theoryMarks}) + Practical (${subForm.practicalMarks})`, 'Validation Error', 'error');
            }
        }

        const [targetClassName, targetSection] = subForm.targetClass.split('|');
        const cls = exam?.classes?.find(c => c.className === targetClassName);
        if(!cls) return await customAlert('Target class not found in this exam');

        const newSubject = { ...subForm, section: targetSection };

        await fetch(`${API}/${selectedExam}/subjects`, { method:'POST', headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ className:cls.className, sections:cls.sections, subjects:[...cls.subjects||[], newSubject] }) });
        setSubForm({ targetClass: subForm.targetClass, name:'', code:'', type:'Both', totalMarks:100, passingMarks:33, theoryMarks:80, practicalMarks:20, teacher: '' });
        refresh();
        customAlert(`Subject added to ${targetClassName} - ${targetSection} successfully!`, 'Success', 'success');
    };
    const statusCls = s => s==='Draft'?'badge-draft':s==='Scheduled'?'badge-scheduled':s==='Ongoing'?'badge-ongoing':'badge-completed';

    return (
        <div className="animate-fade-in">
            <div className="exam-two-col">
                <div className="exam-form-panel">
                    <h3>Create New Exam</h3>
                    <form className="exam-form" onSubmit={handleSubmit}>
                        <div className="form-group"><label className="form-label">Exam Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Mid Term" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Academic Year</label>
                                <input type="text" className="form-input" value={form.academicYear} onChange={e=>setForm({...form,academicYear:e.target.value})} /></div>
                            <div className="form-group"><label className="form-label">Exam Type</label>
                                <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Theory</option><option>Practical</option><option>Both</option></select></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Start Date</label><input type="date" className="form-input" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} /></div>
                            <div className="form-group"><label className="form-label">End Date</label><input type="date" className="form-input" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} /></div>
                        </div>
                        <div className="exam-section-divider"><Users size={16}/> Add Class</div>
                        <div className="form-row" style={{ alignItems: 'flex-start' }}>
                            <div className="form-group"><label className="form-label">Class</label>
                                <select className="form-select" value={classInput.className} onChange={e=>setClassInput({...classInput,className:e.target.value})}>
                                    <option value="">Select Class</option>
                                    {STANDARD_CLASSES.map(c=><option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group"><label className="form-label">Sections</label>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                                    {['A','B','C','D'].map(sec => {
                                        const isSelected = classInput.sections.split(',').includes(sec);
                                        return (
                                            <label key={sec} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: '0.9rem' }}>
                                                <input type="checkbox" checked={isSelected} onChange={e => {
                                                    let arr = classInput.sections ? classInput.sections.split(',') : [];
                                                    if (e.target.checked) arr.push(sec);
                                                    else arr = arr.filter(x => x !== sec);
                                                    setClassInput({...classInput, sections: arr.join(',')});
                                                }}/> {sec}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-outline" style={{marginBottom:12}} onClick={addClass}><PlusCircle size={14}/> Add Class</button>
                        {form.classes.length>0 && <div style={{marginBottom:12,fontSize:'0.85rem'}}>{form.classes.map((c,i)=><span key={i} className="badge badge-info" style={{marginRight:6}}>{c.className} ({c.sections.join(', ')})</span>)}</div>}
                        <div className="form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Save Exam</button></div>
                    </form>
                    {selectedExam && (
                        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-light)', borderRadius: 8, border: '1px solid var(--border)' }}>
                            <div className="exam-section-divider" style={{marginTop:0}}><BookOpen size={16}/> Add Subject & Marks</div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>Adding subjects to: <strong>{exams.find(x=>x._id===selectedExam)?.name}</strong></p>
                            <form className="exam-form" onSubmit={handleAddSubject}>
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">Target Class *</label>
                                        <select className="form-select" value={subForm.targetClass} onChange={e=>setSubForm({...subForm,targetClass:e.target.value})} required>
                                            <option value="">Select Class & Section</option>
                                            {exams.find(x=>x._id===selectedExam)?.classes?.flatMap(c => 
                                                (c.sections && c.sections.length > 0 ? c.sections : ['All']).map(s => (
                                                    <option key={`${c.className}|${s}`} value={`${c.className}|${s}`}>
                                                        {c.className} - {s}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group"><label className="form-label">Subject Type</label>
                                        <select className="form-select" value={subForm.type} onChange={e=>setSubForm({...subForm,type:e.target.value})}>
                                            <option>Theory</option><option>Practical</option><option>Both</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row"><div className="form-group"><label className="form-label">Subject Name *</label><input type="text" className="form-input" required value={subForm.name} onChange={e=>setSubForm({...subForm,name:e.target.value})} /></div>
                                    <div className="form-group"><label className="form-label">Code</label><input type="text" className="form-input" value={subForm.code} onChange={e=>setSubForm({...subForm,code:e.target.value})} /></div></div>
                                <div className="form-row"><div className="form-group"><label className="form-label">Total Marks</label><input type="number" className="form-input" value={subForm.totalMarks} onChange={e=>setSubForm({...subForm,totalMarks:+e.target.value})} /></div>
                                    <div className="form-group"><label className="form-label">Passing Marks</label><input type="number" className="form-input" value={subForm.passingMarks} onChange={e=>setSubForm({...subForm,passingMarks:+e.target.value})} /></div></div>
                                {(subForm.type === 'Both' || subForm.type === 'Practical') && (
                                    <div className="form-row">
                                        <div className="form-group"><label className="form-label">Theory Marks</label><input type="number" className="form-input" value={subForm.theoryMarks} onChange={e=>setSubForm({...subForm,theoryMarks:+e.target.value})} /></div>
                                        <div className="form-group"><label className="form-label">Practical Marks</label><input type="number" className="form-input" value={subForm.practicalMarks} onChange={e=>setSubForm({...subForm,practicalMarks:+e.target.value})} /></div>
                                    </div>
                                )}
                                <div className="form-group"><label className="form-label">Teacher (Optional)</label><input type="text" className="form-input" placeholder="Assign Teacher" value={subForm.teacher} onChange={e=>setSubForm({...subForm,teacher:e.target.value})} /></div>
                                <div className="form-actions"><button type="submit" className="btn btn-primary"><PlusCircle size={14}/> Save Subject & Marks</button></div>
                            </form>
                        </div>
                    )}
                </div>
                <div className="exam-table-panel table-responsive">
                    <table className="data-table"><thead><tr><th>Exam Name</th><th>Type</th><th>Year</th><th>Classes</th><th>Date Range</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>{exams.length===0?<tr><td colSpan="7" style={{textAlign:'center',padding:40,color:'var(--text-light)'}}>No exams created yet</td></tr>:
                            exams.map(e=><tr key={e._id} style={{background:selectedExam===e._id?'var(--accent-light)':undefined}}>
                                <td className="fw-600">{e.name}</td><td>{e.type}</td><td>{e.academicYear}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {e.classes?.map(c=>`${c.className}`).join(', ')||'—'}
                                        <button className="btn-icon" title="View Classes" onClick={()=>customAlert(`Classes assigned: ${e.classes?.map(c=>`${c.className} (${c.sections.join(', ')})`).join(', ')}`, "Assigned Classes")}><Eye size={14}/></button>
                                    </div>
                                </td>
                                <td>{e.startDate?new Date(e.startDate).toLocaleDateString('en-IN'):''} – {e.endDate?new Date(e.endDate).toLocaleDateString('en-IN'):''}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className={`badge ${statusCls(e.status)}`}>{e.status}</span>
                                        {e.status === 'Draft' && <button className="btn-icon text-success" title="Publish Exam" onClick={()=>customAlert("Exam Published!", "Published")}><Send size={14}/></button>}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <button className="btn-icon text-primary" title="Edit Exam" onClick={()=>customAlert("Edit mode activated.")}><Edit3 size={16}/></button>
                                        <button className="btn-icon" title="Manage Subjects" onClick={()=>{
                                            setSelectedExam(selectedExam===e._id?null:e._id);
                                            if (selectedExam !== e._id) customAlert(`Managing subjects for ${e.name}. Fill the form on the left.`, "Manage Subjects", "info");
                                        }}><BookOpen size={16}/></button>
                                        <button className="btn-icon text-danger" title="Delete" onClick={()=>handleDelete(e._id)}><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>)}</tbody></table>
                </div>
            </div>
        </div>
    );
}

// ======================== TIMETABLE ========================
function TimetableTab() {
    const { data: exams } = useApi('/');
    const { data: timetables, refresh } = useApi('/timetable');
    const [form, setForm] = useState({ exam:'', className:'', section:'', entries:[] });
    const [entry, setEntry] = useState({ subject:'', date:'', startTime:'', endTime:'', hall:'', invigilator:'' });

    const addEntry = () => { if(!entry.subject||!entry.date) return; setForm(f=>({...f,entries:[...f.entries,entry]})); setEntry({subject:'',date:'',startTime:'',endTime:'',hall:'',invigilator:''}); };
    const handleSave = async () => { await fetch(`${API}/timetable`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({exam:'',className:'',section:'',entries:[]}); refresh(); };
    const handlePublish = async (id) => { await fetch(`${API}/timetable/${id}/publish`,{method:'PUT'}); refresh(); };
    const selExam = exams.find(e=>e._id===form.exam);

    return (
        <div className="animate-fade-in">
            <div className="exam-form-panel" style={{maxWidth:900,marginBottom:24}}>
                <h3>Create Exam Timetable</h3>
                <div className="exam-form"><div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
                    <div className="form-group"><label className="form-label">Exam *</label><select className="form-select" value={form.exam} onChange={e=>setForm({...form,exam:e.target.value})}><option value="">Select</option>{exams.map(e=><option key={e._id} value={e._id}>{e.name}</option>)}</select></div>
                    <div className="form-group"><label className="form-label">Class *</label><select className="form-select" value={form.className} onChange={e=>setForm({...form,className:e.target.value})}><option value="">Select</option>{(selExam?.classes?.length>0?selExam.classes.map(c=>c.className):STANDARD_CLASSES).map((c,i)=><option key={i} value={c}>{c}</option>)}</select></div>
                    <div className="form-group"><label className="form-label">Section *</label><select className="form-select" value={form.section} onChange={e=>setForm({...form,section:e.target.value})}><option value="">Select</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div>
                </div>
                <div className="exam-section-divider"><Calendar size={16}/> Add Schedule Entry</div>
                <div className="timetable-entry-row">
                    <div><label>Subject</label><input className="form-input" value={entry.subject} onChange={e=>setEntry({...entry,subject:e.target.value})} /></div>
                    <div><label>Date</label><input type="date" className="form-input" value={entry.date} onChange={e=>setEntry({...entry,date:e.target.value})} /></div>
                    <div><label>Start</label><input type="time" className="form-input" value={entry.startTime} onChange={e=>setEntry({...entry,startTime:e.target.value})} /></div>
                    <div><label>End</label><input type="time" className="form-input" value={entry.endTime} onChange={e=>setEntry({...entry,endTime:e.target.value})} /></div>
                    <div><label>Hall</label><input className="form-input" value={entry.hall} onChange={e=>setEntry({...entry,hall:e.target.value})} /></div>
                    <div><label>Invigilator</label><input className="form-input" value={entry.invigilator} onChange={e=>setEntry({...entry,invigilator:e.target.value})} /></div>
                    <div style={{alignSelf:'flex-end'}}><button className="btn btn-outline" onClick={addEntry}><PlusCircle size={14}/></button></div>
                </div>
                {form.entries.length>0 && <div className="table-responsive" style={{marginTop:16}}><table className="data-table"><thead><tr><th>Subject</th><th>Date</th><th>Time</th><th>Hall</th><th>Invigilator</th></tr></thead>
                    <tbody>{form.entries.map((en,i)=><tr key={i}><td>{en.subject}</td><td>{en.date}</td><td>{en.startTime}–{en.endTime}</td><td>{en.hall}</td><td>{en.invigilator}</td></tr>)}</tbody></table></div>}
                <div className="form-actions" style={{marginTop:16}}><button className="btn btn-primary" onClick={handleSave}><Save size={16}/> Save Timetable</button></div>
                </div>
            </div>
            <div className="exam-section-divider"><Calendar size={18}/> Saved Timetables</div>
            <div className="table-responsive"><table className="data-table"><thead><tr><th>Exam</th><th>Class</th><th>Section</th><th>Entries</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{timetables.length===0?<tr><td colSpan="6" style={{textAlign:'center',padding:40,color:'var(--text-light)'}}>No timetables yet</td></tr>:
                    timetables.map(t=><tr key={t._id}><td className="fw-600">{t.exam?.name||'—'}</td><td>{t.className}</td><td>{t.section}</td><td>{t.entries?.length||0}</td>
                        <td><span className={`badge ${t.status==='Published'?'badge-published':'badge-draft'}`}>{t.status}</span></td>
                        <td>{t.status!=='Published'&&<button className="btn-icon" title="Publish" onClick={()=>handlePublish(t._id)}><Send size={16}/></button>}</td></tr>)}</tbody></table></div>
        </div>);
}

// ======================== HALL TICKETS ========================
function HallTicketsTab() {
    const { data: exams } = useApi('/');
    const [sel, setSel] = useState({ exam:'', className:'', section:'' });
    const [preview, setPreview] = useState(false);
    const selExam = exams.find(e=>e._id===sel.exam);
    return (
        <div className="animate-fade-in">
            <div className="exam-form-panel" style={{maxWidth:500,marginBottom:24}}>
                <h3>Generate Hall Tickets</h3>
                <div className="exam-form">
                    <div className="form-group"><label className="form-label">Exam</label><select className="form-select" value={sel.exam} onChange={e=>setSel({...sel,exam:e.target.value})}><option value="">Select</option>{exams.map(e=><option key={e._id} value={e._id}>{e.name}</option>)}</select></div>
                    <div className="form-row"><div className="form-group"><label className="form-label">Class</label><select className="form-select" value={sel.className} onChange={e=>setSel({...sel,className:e.target.value})}><option value="">Select</option>{(selExam?.classes?.length>0?selExam.classes.map(c=>c.className):STANDARD_CLASSES).map((c,i)=><option key={i} value={c}>{c}</option>)}</select></div>
                        <div className="form-group"><label className="form-label">Section</label><select className="form-select" value={sel.section} onChange={e=>setSel({...sel,section:e.target.value})}><option value="">Select</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div></div>
                    <div className="form-actions"><button className="btn btn-primary" onClick={()=>setPreview(true)}><Eye size={16}/> Preview Hall Ticket</button></div>
                </div>
            </div>
            {preview && selExam && (
                <div className="hall-ticket-preview">
                    <div className="hall-ticket-header"><h2>Mount Zion School</h2><p>ADMIT CARD — {selExam.name} ({selExam.academicYear})</p></div>
                    <div className="hall-ticket-info"><div><strong>Student Name:</strong> [Student Name]</div><div><strong>Roll No:</strong> [Auto]</div><div><strong>Class:</strong> {sel.className}</div><div><strong>Section:</strong> {sel.section}</div></div>
                    <table className="data-table" style={{fontSize:'0.85rem'}}><thead><tr><th>Subject</th><th>Date</th><th>Time</th><th>Hall</th></tr></thead>
                        <tbody>{selExam.classes?.find(c=>c.className===sel.className)?.subjects?.map((s,i)=><tr key={i}><td>{s.name}</td><td>—</td><td>—</td><td>—</td></tr>)||<tr><td colSpan="4" style={{textAlign:'center'}}>No subjects assigned</td></tr>}</tbody></table>
                    <div style={{marginTop:20,display:'flex',justifyContent:'space-between',fontSize:'0.85rem',color:'var(--text-light)'}}><span>Invigilator Signature: _____________</span><span>Principal Signature: _____________</span></div>
                </div>
            )}
        </div>);
}

// ======================== MARKS ENTRY ========================
function MarksEntryTab() {
    const { data: exams } = useApi('/');
    const [sel, setSel] = useState({ exam:'', className:'', section:'', subject:'' });
    const [students, setStudents] = useState([{studentName:'',rollNo:'',theoryMarks:0,practicalMarks:0}]);
    const selExam = exams.find(e=>e._id===sel.exam);
    const selClass = selExam?.classes?.find(c=>c.className===sel.className);
    const selSubject = selClass?.subjects?.find(s=>s.name===sel.subject);
    const activeSubject = selSubject || { name: sel.subject, theoryMarks: 100, practicalMarks: 0, totalMarks: 100, passingMarks: 33 };

    const addRow = () => setStudents(s=>[...s,{studentName:'',rollNo:'',theoryMarks:0,practicalMarks:0}]);
    const updateRow = (i,field,val) => setStudents(s=>s.map((r,j)=>j===i?{...r,[field]:val}:r));
    const handleSave = async () => {
        if(!sel.exam||!sel.className||!sel.subject) return await customAlert('Select all filters');
        const entries = students.filter(s=>s.studentName).map(s=>({...s, theoryMarks:+s.theoryMarks, practicalMarks:+s.practicalMarks, totalMarks:(+s.theoryMarks)+(+s.practicalMarks)}));
        const res = await fetch(`${API}/marks`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exam:sel.exam,className:sel.className,section:sel.section,subject:sel.subject,subjectCode:activeSubject.code||'',maxTheoryMarks:activeSubject.theoryMarks||activeSubject.totalMarks,maxPracticalMarks:activeSubject.practicalMarks||0,maxTotalMarks:activeSubject.totalMarks,entries})});
        if(res.ok) await customAlert('Marks saved!'); else { const err = await res.json(); await customAlert(err.error); }
    };

    return (
        <div className="animate-fade-in">
            <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:16,marginBottom:24,display:'grid'}}>
                <div className="form-group"><label className="form-label">Exam</label><select className="form-select" value={sel.exam} onChange={e=>setSel({...sel,exam:e.target.value,className:'',subject:''})}><option value="">Select</option>{exams.map(e=><option key={e._id} value={e._id}>{e.name}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Class</label><select className="form-select" value={sel.className} onChange={e=>setSel({...sel,className:e.target.value,subject:''})}><option value="">Select</option>{(selExam?.classes?.length>0?selExam.classes.map(c=>c.className):STANDARD_CLASSES).map((c,i)=><option key={i} value={c}>{c}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Section</label><select className="form-select" value={sel.section} onChange={e=>setSel({...sel,section:e.target.value})}><option value="">Select</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div>
                <div className="form-group"><label className="form-label">Subject</label><select className="form-select" value={sel.subject} onChange={e=>setSel({...sel,subject:e.target.value})}><option value="">Select</option>{(selClass?.subjects?.length>0?selClass.subjects.map(s=>s.name):STANDARD_SUBJECTS).map((s,i)=><option key={i} value={s}>{s}</option>)}</select></div>
            </div>
            {sel.subject && <div className="result-summary-cards"><div className="result-summary-card"><label>Max Theory</label><p>{activeSubject.theoryMarks||activeSubject.totalMarks}</p></div><div className="result-summary-card"><label>Max Practical</label><p>{activeSubject.practicalMarks||0}</p></div><div className="result-summary-card"><label>Total</label><p>{activeSubject.totalMarks}</p></div><div className="result-summary-card"><label>Pass</label><p>{activeSubject.passingMarks}</p></div></div>}
            <div className="marks-grid-wrapper table-responsive"><table className="data-table"><thead><tr><th>#</th><th>Student Name</th><th>Roll No</th><th>Theory</th><th>Practical</th><th>Total</th></tr></thead>
                <tbody>{students.map((s,i)=><tr key={i}><td>{i+1}</td><td><input className="form-input" style={{width:180}} value={s.studentName} onChange={e=>updateRow(i,'studentName',e.target.value)} /></td>
                    <td><input className="form-input" style={{width:80}} value={s.rollNo} onChange={e=>updateRow(i,'rollNo',e.target.value)} /></td>
                    <td><input type="number" className={`form-input ${sel.subject&&+s.theoryMarks>(activeSubject.theoryMarks||activeSubject.totalMarks)?'marks-invalid':''}`} value={s.theoryMarks} onChange={e=>updateRow(i,'theoryMarks',e.target.value)} /></td>
                    <td><input type="number" className={`form-input ${sel.subject&&+s.practicalMarks>(activeSubject.practicalMarks||0)?'marks-invalid':''}`} value={s.practicalMarks} onChange={e=>updateRow(i,'practicalMarks',e.target.value)} /></td>
                    <td className="fw-600">{(+s.theoryMarks)+(+s.practicalMarks)}</td></tr>)}</tbody></table></div>
            <div style={{marginTop:16,display:'flex',gap:10}}><button className="btn btn-outline" onClick={addRow}><PlusCircle size={14}/> Add Student</button><button className="btn btn-primary" onClick={handleSave}><Save size={16}/> Save Marks</button></div>
        </div>);
}

// ======================== RESULTS ========================
function ResultsTab() {
    const { data: exams } = useApi('/');
    const [sel, setSel] = useState({ exam:'', className:'', section:'' });
    const [results, setResults] = useState([]);
    const [processing, setProcessing] = useState(false);

    const handleProcess = async () => {
        if(!sel.exam||!sel.className) return await customAlert('Select exam and class');
        setProcessing(true);
        const res = await fetch(`${API}/results/process`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({examId:sel.exam,className:sel.className,section:sel.section})});
        const data = await res.json();
        if(res.ok) { setResults(data.results||[]); await customAlert(data.message); } else await customAlert(data.error);
        setProcessing(false);
    };
    const handlePublish = async () => {
        await fetch(`${API}/results/publish`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({examId:sel.exam,className:sel.className,section:sel.section})});
        await customAlert('Results published!');
    };
    const fetchResults = async () => { const res = await fetch(`${API}/results?exam=${sel.exam}&className=${sel.className}&section=${sel.section}`); setResults(await res.json()); };
    const selExam = exams.find(e=>e._id===sel.exam);

    return (
        <div className="animate-fade-in">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto auto',gap:16,marginBottom:24,alignItems:'flex-end'}}>
                <div className="form-group"><label className="form-label">Exam</label><select className="form-select" value={sel.exam} onChange={e=>setSel({...sel,exam:e.target.value})}><option value="">Select</option>{exams.map(e=><option key={e._id} value={e._id}>{e.name}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Class</label><select className="form-select" value={sel.className} onChange={e=>setSel({...sel,className:e.target.value})}><option value="">Select</option>{(selExam?.classes?.length>0?selExam.classes.map(c=>c.className):STANDARD_CLASSES).map((c,i)=><option key={i} value={c}>{c}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Section</label><select className="form-select" value={sel.section} onChange={e=>setSel({...sel,section:e.target.value})}><option value="">Select</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div>
                <button className="btn btn-primary" onClick={handleProcess} disabled={processing}><ClipboardCheck size={16}/> {processing?'Processing...':'Process Results'}</button>
                <button className="btn btn-outline" onClick={fetchResults}><Eye size={16}/> View</button>
            </div>
            {results.length>0 && (<>
                <div style={{marginBottom:12,display:'flex',gap:10}}><button className="btn btn-primary" onClick={handlePublish}><Send size={16}/> Publish Results</button></div>
                <div className="table-responsive"><table className="data-table"><thead><tr><th>Rank</th><th>Student</th><th>Roll</th><th>Total</th><th>%</th><th>Grade</th><th>Status</th></tr></thead>
                    <tbody>{results.map((r,i)=><tr key={i}><td className="fw-600">{r.sectionRank}</td><td className="fw-600">{r.studentName}</td><td>{r.rollNo||'—'}</td><td>{r.grandTotal}/{r.maxGrandTotal}</td><td>{r.percentage}%</td><td><span className="badge badge-info">{r.grade}</span></td><td><span className={`badge ${r.status==='Pass'?'badge-pass':'badge-fail'}`}>{r.status}</span></td></tr>)}</tbody></table></div>
            </>)}
            {results.length===0 && <div className="exam-empty"><ClipboardCheck size={40}/><p>Select exam and class, then click Process Results</p></div>}
        </div>);
}

// ======================== REPORT CARDS ========================
function ReportCardsTab() {
    const { data: exams } = useApi('/');
    const [sel, setSel] = useState({ exam:'', className:'', section:'' });
    const [results, setResults] = useState([]);
    const [previewStudent, setPreviewStudent] = useState(null);
    const selExam = exams.find(e=>e._id===sel.exam);
    const fetchResults = async () => { const res = await fetch(`${API}/results?exam=${sel.exam}&className=${sel.className}&section=${sel.section}`); setResults(await res.json()); };
    const student = results.find(r=>r._id===previewStudent);

    return (
        <div className="animate-fade-in">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:16,marginBottom:24,alignItems:'flex-end'}}>
                <div className="form-group"><label className="form-label">Exam</label><select className="form-select" value={sel.exam} onChange={e=>setSel({...sel,exam:e.target.value})}><option value="">Select</option>{exams.map(e=><option key={e._id} value={e._id}>{e.name}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Class</label><select className="form-select" value={sel.className} onChange={e=>setSel({...sel,className:e.target.value})}><option value="">Select</option>{(selExam?.classes?.length>0?selExam.classes.map(c=>c.className):STANDARD_CLASSES).map((c,i)=><option key={i} value={c}>{c}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Section</label><select className="form-select" value={sel.section} onChange={e=>setSel({...sel,section:e.target.value})}><option value="">Select</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div>
                <button className="btn btn-primary" onClick={fetchResults}><FileText size={16}/> Load Results</button>
            </div>
            {results.length>0 && !previewStudent && <div className="table-responsive"><table className="data-table"><thead><tr><th>Student</th><th>Total</th><th>%</th><th>Grade</th><th>Rank</th><th>Status</th><th>Report</th></tr></thead>
                <tbody>{results.map(r=><tr key={r._id}><td className="fw-600">{r.studentName}</td><td>{r.grandTotal}</td><td>{r.percentage}%</td><td>{r.grade}</td><td>{r.sectionRank}</td><td><span className={`badge ${r.status==='Pass'?'badge-pass':'badge-fail'}`}>{r.status}</span></td><td><button className="btn-icon" onClick={()=>setPreviewStudent(r._id)}><Eye size={16}/></button></td></tr>)}</tbody></table></div>}
            {student && (
                <div className="report-card-preview">
                    <button className="btn btn-outline" style={{marginBottom:16}} onClick={()=>setPreviewStudent(null)}>← Back to List</button>
                    <div className="rcp-header"><h2>Mount Zion School</h2><p>Report Card — {selExam?.name} ({selExam?.academicYear})</p></div>
                    <div className="rcp-info-grid"><div><strong>Name:</strong> {student.studentName}</div><div><strong>Class:</strong> {student.className} - {student.section}</div><div><strong>Roll:</strong> {student.rollNo||'—'}</div></div>
                    <table className="data-table" style={{fontSize:'0.85rem'}}><thead><tr><th>Subject</th><th>Max</th><th>Theory</th><th>Practical</th><th>Total</th><th>Grade</th><th>Status</th></tr></thead>
                        <tbody>{student.subjects?.map((s,i)=><tr key={i}><td>{s.name}</td><td>{s.maxMarks}</td><td>{s.theoryMarks}</td><td>{s.practicalMarks||'—'}</td><td className="fw-600">{s.totalMarks}</td><td>{s.grade}</td><td>{s.passed?'✅':'❌'}</td></tr>)}</tbody></table>
                    <div className="result-summary-cards" style={{marginTop:20}}><div className="result-summary-card"><label>Grand Total</label><p>{student.grandTotal}/{student.maxGrandTotal}</p></div><div className="result-summary-card"><label>Percentage</label><p>{student.percentage}%</p></div><div className="result-summary-card"><label>Grade</label><p>{student.grade}</p></div><div className="result-summary-card"><label>Rank</label><p>{student.sectionRank}</p></div><div className="result-summary-card"><label>Result</label><p className={student.status==='Pass'?'':'text-danger'}>{student.status}</p></div></div>
                    <div className="rcp-footer"><span>Class Teacher: _____________</span><span>Principal: _____________</span><span>Parent: _____________</span></div>
                </div>
            )}
        </div>);
}

// ======================== ANALYTICS ========================
function AnalyticsTab() {
    const { data: exams } = useApi('/');
    const [sel, setSel] = useState({ exam:'', className:'', section:'' });
    const [analytics, setAnalytics] = useState(null);
    const selExam = exams.find(e=>e._id===sel.exam);
    const fetchAnalytics = async () => { const res = await fetch(`${API}/analytics?examId=${sel.exam}&className=${sel.className}&section=${sel.section}`); setAnalytics(await res.json()); };

    return (
        <div className="animate-fade-in">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:16,marginBottom:24,alignItems:'flex-end'}}>
                <div className="form-group"><label className="form-label">Exam</label><select className="form-select" value={sel.exam} onChange={e=>setSel({...sel,exam:e.target.value})}><option value="">Select</option>{exams.map(e=><option key={e._id} value={e._id}>{e.name}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Class</label><select className="form-select" value={sel.className} onChange={e=>setSel({...sel,className:e.target.value})}><option value="">Select</option>{(selExam?.classes?.length>0?selExam.classes.map(c=>c.className):STANDARD_CLASSES).map((c,i)=><option key={i} value={c}>{c}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Section</label><select className="form-select" value={sel.section} onChange={e=>setSel({...sel,section:e.target.value})}><option value="">Select</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div>
                <button className="btn btn-primary" onClick={fetchAnalytics}><BarChart3 size={16}/> Generate</button>
            </div>
            {analytics && (<>
                <div className="analytics-stats-row">
                    {[{label:'Total Students',value:analytics.totalStudents,color:'var(--info)',bg:'var(--info-light)',icon:Users},
                      {label:'Passed',value:analytics.passCount,color:'var(--success)',bg:'var(--success-light)',icon:CheckCircle2},
                      {label:'Failed',value:analytics.failCount,color:'var(--danger)',bg:'var(--danger-light)',icon:XCircle},
                      {label:'Pass Rate',value:`${analytics.passRate}%`,color:'var(--accent)',bg:'var(--accent-light)',icon:Award},
                      {label:'Avg %',value:`${analytics.avgPercentage}%`,color:'var(--primary)',bg:'rgba(11,60,93,0.1)',icon:BarChart3}
                    ].map((s,i)=>{const I=s.icon;return <div className="analytics-stat-card" key={i}><div className="analytics-stat-icon" style={{background:s.bg}}><I size={24} style={{color:s.color}}/></div><div className="analytics-stat-info"><h4>{s.value}</h4><p>{s.label}</p></div></div>})}
                </div>
                {analytics.subjectAnalysis?.length>0 && (<><div className="exam-section-divider"><BookOpen size={18}/> Subject-wise Analysis</div>
                    <div className="table-responsive"><table className="data-table"><thead><tr><th>Subject</th><th>Average</th><th>Highest</th><th>Lowest</th><th>Pass Rate</th><th>Performance</th></tr></thead>
                        <tbody>{analytics.subjectAnalysis.map((s,i)=><tr key={i}><td className="fw-600">{s.name}</td><td>{s.average}</td><td>{s.highest}</td><td>{s.lowest}</td><td>{s.passRate}%</td><td style={{minWidth:120}}><div className="subject-bar"><div className="subject-bar-fill" style={{width:`${s.passRate}%`}}/></div></td></tr>)}</tbody></table></div></>)}
                {analytics.topPerformers?.length>0 && (<><div className="exam-section-divider"><Award size={18}/> Top Performers</div>
                    <div className="table-responsive"><table className="data-table"><thead><tr><th>#</th><th>Student</th><th>Total</th><th>%</th><th>Grade</th></tr></thead>
                        <tbody>{analytics.topPerformers.map((t,i)=><tr key={i}><td>{i+1}</td><td className="fw-600">{t.studentName}</td><td>{t.grandTotal}</td><td>{t.percentage}%</td><td><span className="badge badge-info">{t.grade}</span></td></tr>)}</tbody></table></div></>)}
            </>)}
            {!analytics && <div className="exam-empty"><BarChart3 size={40}/><p>Select an exam and click Generate to view analytics</p></div>}
        </div>);
}

// ======================== SETTINGS ========================
function SettingsTab() {
    const { data: grades, refresh } = useApi('/grades');
    const [form, setForm] = useState({ label:'', minPercentage:'', maxPercentage:'', gpa:'' });
    const handleSubmit = async (e) => { e.preventDefault(); await fetch(`${API}/grades`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,minPercentage:+form.minPercentage,maxPercentage:+form.maxPercentage,gpa:+form.gpa})}); setForm({label:'',minPercentage:'',maxPercentage:'',gpa:''}); refresh(); };
    const handleDelete = async (id) => { await fetch(`${API}/grades/${id}`,{method:'DELETE'}); refresh(); };

    const rbac = [
        ['Create / Edit Exam','Yes','Yes','No','No'],['Manage Timetable','Yes','Yes','View','View'],['Allocate Students','Yes','Yes','No','No'],
        ['Generate Hall Tickets','Yes','Yes','No','Own'],['Enter Marks','Yes','Yes','Own subjects','No'],['Process Results','Yes','Yes','No','No'],
        ['Generate Report Cards','Yes','Yes','No','Own'],['Publish Results','Yes','Yes','No','No'],['View Analytics','Yes','Yes','Limited','No'],['Manage Settings','Yes','Yes','No','No']];

    return (
        <div className="animate-fade-in settings-grid">
            <div className="settings-panel">
                <h3><Award size={18}/> Grade Scale Configuration</h3>
                <form className="exam-form" onSubmit={handleSubmit}>
                    <div className="form-row"><div className="form-group"><label className="form-label">Grade Label *</label><input type="text" className="form-input" required placeholder="A+" value={form.label} onChange={e=>setForm({...form,label:e.target.value})} /></div>
                        <div className="form-group"><label className="form-label">GPA</label><input type="number" step="0.1" className="form-input" value={form.gpa} onChange={e=>setForm({...form,gpa:e.target.value})} /></div></div>
                    <div className="form-row"><div className="form-group"><label className="form-label">Min % *</label><input type="number" className="form-input" required value={form.minPercentage} onChange={e=>setForm({...form,minPercentage:e.target.value})} /></div>
                        <div className="form-group"><label className="form-label">Max % *</label><input type="number" className="form-input" required value={form.maxPercentage} onChange={e=>setForm({...form,maxPercentage:e.target.value})} /></div></div>
                    <div className="form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Add Grade</button></div>
                </form>
                {grades.length>0 && <div className="grade-scale-grid">{grades.map(g=><div className="grade-card" key={g._id}><h3>{g.label}</h3><div className="grade-range">{g.minPercentage}% – {g.maxPercentage}%</div>{g.gpa>0&&<div className="grade-gpa">GPA: {g.gpa}</div>}<button className="btn-icon" style={{marginTop:6}} onClick={()=>handleDelete(g._id)}><Trash2 size={14}/></button></div>)}</div>}
            </div>
            <div className="settings-panel">
                <h3><Settings size={18}/> Role-Based Access Matrix</h3>
                <table className="rbac-table"><thead><tr><th>Feature</th><th>Super Admin</th><th>Admin</th><th>Teacher</th><th>Student</th></tr></thead>
                    <tbody>{rbac.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} style={j>0?{color:c==='Yes'||c==='Own'||c==='Own subjects'?'var(--success)':c==='No'?'var(--danger)':'var(--warning)',fontWeight:600}:undefined}>{c}</td>)}</tr>)}</tbody></table>
            </div>
        </div>);
}

// ======================== MAIN COMPONENT ========================
const TABS = [
    { id:'setup', label:'Exam Setup', icon:LayoutList },
    { id:'timetable', label:'Timetable', icon:Calendar },
    { id:'halltickets', label:'Hall Tickets', icon:Stamp },
    { id:'marks', label:'Marks Entry', icon:ClipboardCheck },
    { id:'results', label:'Results', icon:Award },
    { id:'reportcards', label:'Report Cards', icon:FileText },
    { id:'analytics', label:'Analytics', icon:BarChart3 },
    { id:'settings', label:'Settings', icon:Settings },
];

export default function Examination() {
    const navigate = useNavigate();
    const location = useLocation();

    let activeTab = 'setup';
    if (location.pathname.includes('/setup')) activeTab = 'setup';
    else if (location.pathname.includes('/timetable')) activeTab = 'timetable';
    else if (location.pathname.includes('/allocation')) activeTab = 'allocation';
    else if (location.pathname.includes('/hall-ticket')) activeTab = 'halltickets';
    else if (location.pathname.includes('/marks')) activeTab = 'marks';
    else if (location.pathname.includes('/results')) activeTab = 'results';
    else if (location.pathname.includes('/report-card')) activeTab = 'reportcards';
    else if (location.pathname.includes('/analytics')) activeTab = 'analytics';
    else if (location.pathname.includes('/settings')) activeTab = 'settings';

    const TABS_MAP = [
        { id: 'setup', label: 'Exam Setup', icon: LayoutList, path: 'setup' },
        { id: 'timetable', label: 'Timetable', icon: Calendar, path: 'timetable' },
        { id: 'allocation', label: 'Student Allocation', icon: LayoutList, path: 'allocation' },
        { id: 'halltickets', label: 'Hall Tickets', icon: Stamp, path: 'hall-ticket' },
        { id: 'marks', label: 'Marks Entry', icon: ClipboardCheck, path: 'marks' },
        { id: 'results', label: 'Results', icon: Award, path: 'results' },
        { id: 'reportcards', label: 'Report Cards', icon: FileText, path: 'report-card' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: 'analytics' },
        { id: 'settings', label: 'Settings', icon: Settings, path: 'settings' },
    ];

    const handleNavigate = (path) => navigate(`/exam/${path}`);

    return (
        <div className="exam-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb"><Link to="/">Dashboard</Link><span className="separator">/</span><span>Examination</span>
                    {activeTab!=='setup'&&<><span className="separator">/</span><span style={{textTransform:'capitalize'}}>{TABS_MAP.find(t=>t.id===activeTab)?.label}</span></>}</div>
                <h1>Exam Management</h1>
            </div></div>
            <div className="card exam-card">
                <div className="tabs-header">{TABS_MAP.map(tab=>{const Icon=tab.icon;return <button key={tab.id} className={`tab-btn ${activeTab===tab.id?'active':''}`} onClick={()=>handleNavigate(tab.path)}><Icon size={16}/> {tab.label}</button>;})}</div>
                <div className="tabs-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="setup" replace />} />
                        <Route path="setup" element={<ExamSetupTab/>} />
                        <Route path="timetable" element={<TimetableTab/>} />
                        <Route path="allocation" element={<div className="animate-fade-in"><h3>Student Allocation</h3><p className="text-muted">Module for allocating students to exam centers/rooms.</p></div>} />
                        <Route path="hall-ticket" element={<HallTicketsTab/>} />
                        <Route path="marks" element={<MarksEntryTab/>} />
                        <Route path="results" element={<ResultsTab/>} />
                        <Route path="report-card" element={<ReportCardsTab/>} />
                        <Route path="analytics" element={<AnalyticsTab/>} />
                        <Route path="settings" element={<SettingsTab/>} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
