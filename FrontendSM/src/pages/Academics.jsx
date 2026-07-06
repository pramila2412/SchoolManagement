import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link, useSearchParams, useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import {
    Calendar, BookOpen, Users, Clock, FileText, ClipboardCheck,
    PlusCircle, Save, Trash2, Edit3, ChevronDown, ChevronRight,
    GraduationCap, Layers, BookMarked, PencilLine, Upload,
    BarChart3, Settings, ArrowUpRight, CheckCircle2, XCircle,
    Award, Eye, Send, UserCheck, CalendarCheck, FolderOpen
} from 'lucide-react';
import { customAlert, customConfirm } from '../utils/dialogs';
import './Academics.css';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ======================== ACADEMIC YEAR ========================
function AcademicYearTab() {
    const [years, setYears] = useLocalStorage('academic_years', [
        { id: 1, label: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', active: true },
        { id: 2, label: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', active: false },
    ]);
    
    const [form, setForm] = useState({ label: '', startDate: '', endDate: '', active: false });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newYear = { ...form, id: Date.now(), active: form.active };
        if (newYear.active) setYears(prev => prev.map(y => ({ ...y, active: false })));
        setYears(prev => [newYear, ...prev]);
        setForm({ label: '', startDate: '', endDate: '', active: false });
    };
    const toggleActive = (id) => setYears(prev => prev.map(y => ({ ...y, active: y.id === id })));
    const handleDelete = (id) => setYears(prev => prev.filter(y => y.id !== id));

    return (
        <div className="animate-fade-in">
            <div className="acad-two-col">
                <div className="acad-form-panel">
                    <h3><Calendar size={18}/> Add Academic Year</h3>
                    <form className="acad-form" onSubmit={handleSubmit}>
                        <div className="form-group"><label className="form-label">Year Label <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. 2025-2026" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} /></div>
                        <div className="acad-form form-row">
                            <div className="form-group"><label className="form-label">Start Date</label><input type="date" className="form-input" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">End Date</label><input type="date" className="form-input" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                        </div>
                        <div className="form-group" style={{ marginTop: 14 }}>
                            <label className="status-toggle"><span className="form-label" style={{ margin: 0 }}>Set as Active Year</span>
                                <div className={`status-toggle-track ${form.active ? 'active' : ''}`} onClick={() => setForm({ ...form, active: !form.active })}></div>
                            </label>
                        </div>
                        <div className="acad-form form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Save Year</button></div>
                    </form>
                </div>
                <div className="acad-table-panel">
                    <table className="data-table"><thead><tr><th>Year</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>{years.map(y => (
                            <tr key={y.id}><td className="fw-600">{y.label}</td><td>{y.startDate}</td><td>{y.endDate}</td>
                                <td><span className={`badge ${y.active ? 'badge-success' : 'badge-draft'}`}>{y.active ? 'Active' : 'Archived'}</span></td>
                                <td><button className="btn-icon" title="Set Active" onClick={() => toggleActive(y.id)}><CheckCircle2 size={16}/></button>
                                    <button className="btn-icon" title="Delete" onClick={() => handleDelete(y.id)}><Trash2 size={16}/></button></td></tr>
                        ))}</tbody></table>
                </div>
            </div>
        </div>
    );
}

// ======================== CLASS & SECTION ========================
function ClassSectionTab() {
    const [classes, setClasses] = useLocalStorage('academic_classes', [
        { id: 1, name: 'Grade 1', sections: [{ label: 'A', teacher: 'Mrs. Sharma', capacity: 40 }, { label: 'B', teacher: 'Mr. Patel', capacity: 40 }] },
        { id: 2, name: 'Grade 2', sections: [{ label: 'A', teacher: 'Ms. Gupta', capacity: 35 }] },
        { id: 3, name: 'Grade 3', sections: [{ label: 'A', teacher: 'Mr. Roy', capacity: 38 }, { label: 'B', teacher: 'Mrs. Verma', capacity: 38 }, { label: 'C', teacher: 'Mr. Singh', capacity: 36 }] },
    ]);
    const [form, setForm] = useState({ className: '', sectionLabel: '', teacher: '', capacity: 40 });

    const handleAdd = (e) => {
        e.preventDefault();
        const existing = classes.find(c => c.name === form.className);
        const newSection = { label: form.sectionLabel, teacher: form.teacher, capacity: +form.capacity };
        if (existing) {
            setClasses(prev => prev.map(c => c.name === form.className ? { ...c, sections: [...c.sections, newSection] } : c));
        } else {
            setClasses(prev => [...prev, { id: Date.now(), name: form.className, sections: [newSection] }]);
        }
        setForm({ className: '', sectionLabel: '', teacher: '', capacity: 40 });
    };

    return (
        <div className="animate-fade-in">
            <div className="acad-two-col">
                <div className="acad-form-panel">
                    <h3><Layers size={18}/> Add Class / Section</h3>
                    <form className="acad-form" onSubmit={handleAdd}>
                        <div className="form-group"><label className="form-label">Class Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Grade 1, Class 10" value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} /></div>
                        <div className="acad-form form-row">
                            <div className="form-group"><label className="form-label">Section Label <span className="required">*</span></label>
                                <input type="text" className="form-input" required placeholder="e.g. A" value={form.sectionLabel} onChange={e => setForm({ ...form, sectionLabel: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Max Capacity</label>
                                <input type="number" className="form-input" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Class Teacher</label>
                            <select className="form-select" value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })}>
                                <option value="">Select Teacher</option><option>Mrs. Sharma</option><option>Mr. Patel</option><option>Ms. Gupta</option><option>Mr. Roy</option><option>Mrs. Verma</option><option>Mr. Singh</option>
                            </select></div>
                        <div className="acad-form form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Save</button></div>
                    </form>
                </div>
                <div className="acad-table-panel">
                    <table className="data-table"><thead><tr><th>Class</th><th>Section</th><th>Class Teacher</th><th>Capacity</th></tr></thead>
                        <tbody>{classes.flatMap(c => c.sections.map((s, i) => (
                            <tr key={`${c.id}-${i}`}><td className="fw-600">{c.name}</td><td>{s.label}</td><td>{s.teacher || '—'}</td><td>{s.capacity}</td></tr>
                        )))}</tbody></table>
                </div>
            </div>
        </div>
    );
}

// ======================== SUBJECTS ========================
function SubjectsTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const [subjects, setSubjects] = useLocalStorage('academic_subjects', [
        { id: 1, name: 'Mathematics', code: 'MATH-01', type: 'Theory', classes: ['Grade 1', 'Grade 2', 'Grade 3'] },
        { id: 2, name: 'Science', code: 'SCI-01', type: 'Both', classes: ['Grade 2', 'Grade 3'] },
        { id: 3, name: 'English', code: 'ENG-01', type: 'Theory', classes: ['Grade 1', 'Grade 2', 'Grade 3'] },
        { id: 4, name: 'Hindi', code: 'HIN-01', type: 'Theory', classes: ['Grade 1', 'Grade 2'] },
        { id: 5, name: 'Computer Science', code: 'CS-01', type: 'Practical', classes: ['Grade 3'] },
    ]);
    const [editingId, setEditingId] = useState(null);
    const [classDropdownOpen, setClassDropdownOpen] = useState(false);
    
    const [form, setForm] = useState({ name: '', code: '', type: 'Theory', classes: [] });

    const toggleClass = (cls) => {
        if (cls === 'All Classes') {
            const isAllSelected = form.classes.includes('All Classes');
            setForm(prev => ({ 
                ...prev, 
                classes: isAllSelected ? [] : ['All Classes'] 
            }));
            return;
        }
        setForm(prev => {
            const withoutAll = prev.classes.filter(c => c !== 'All Classes');
            const updated = withoutAll.includes(cls) 
                ? withoutAll.filter(c => c !== cls) 
                : [...withoutAll, cls];
            return { ...prev, classes: updated };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.classes.length === 0) {
            customAlert('Please assign this subject to at least one class.');
            return;
        }

        if (editingId) {
            setSubjects(prev => prev.map(s => s.id === editingId ? { ...form, id: editingId } : s));
            customAlert('Subject updated successfully!');
        } else {
            setSubjects(prev => [...prev, { ...form, id: Date.now() }]);
            customAlert('Subject added successfully!');
        }
        
        setForm({ name: '', code: '', type: 'Theory', classes: [] });
        setEditingId(null);
        setClassDropdownOpen(false);
    };

    const handleEdit = (s) => {
        setForm({ name: s.name, code: s.code, type: s.type, classes: Array.isArray(s.classes) ? [...s.classes] : [] });
        setEditingId(s.id);
        setClassDropdownOpen(false);
    };

    const handleCancel = () => {
        setForm({ name: '', code: '', type: 'Theory', classes: [] });
        setEditingId(null);
        setClassDropdownOpen(false);
    };

    return (
        <div className="animate-fade-in">
            <div className="acad-two-col">
                <div className="acad-form-panel">
                    <h3><BookOpen size={18}/> {editingId ? 'Edit Subject' : 'Add Subject'}</h3>
                    <form className="acad-form" onSubmit={handleSubmit}>
                        <div className="form-group"><label className="form-label">Subject Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Mathematics" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="acad-form form-row">
                            <div className="form-group"><label className="form-label">Subject Code</label>
                                <input type="text" className="form-input" placeholder="e.g. MATH-01" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Subject Type</label>
                                <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Theory</option><option>Practical</option><option>Both</option></select></div>
                        </div>
                        
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label className="form-label">Assign to Classes <span className="required">*</span></label>
                            <div 
                                className="form-input custom-multi-select" 
                                onClick={() => setClassDropdownOpen(!classDropdownOpen)}
                                style={{ minHeight: '44px', cursor: 'pointer', display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '8px 12px' }}
                            >
                                {form.classes.length === 0 ? (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select classes...</span>
                                ) : (
                                    form.classes.map(cls => (
                                        <span key={cls} className="multi-select-tag">
                                            {cls}
                                            <span 
                                                className="tag-close" 
                                                onClick={(e) => { e.stopPropagation(); toggleClass(cls); }}
                                            >×</span>
                                        </span>
                                    ))
                                )}
                                <ChevronDown size={16} style={{ marginLeft: 'auto', alignSelf: 'center', opacity: 0.5 }} />
                            </div>
                            
                            {classDropdownOpen && (
                                <div className="multi-select-dropdown">
                                    <label className="dropdown-item" style={{ fontWeight: 600, borderBottom: '1px solid var(--border-light)', background: form.classes.includes('All Classes') ? 'rgba(28,167,166,0.08)' : 'transparent' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={form.classes.includes('All Classes')} 
                                            onChange={() => toggleClass('All Classes')} 
                                            style={{ accentColor: 'var(--accent)' }}
                                        />
                                        <span>All Classes</span>
                                    </label>
                                    {ALL_CLASSES.map(cls => (
                                        <label key={cls} className="dropdown-item" style={{ background: (form.classes.includes('All Classes') || form.classes.includes(cls)) ? 'rgba(28,167,166,0.06)' : 'transparent' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={form.classes.includes('All Classes') || form.classes.includes(cls)} 
                                                disabled={form.classes.includes('All Classes')}
                                                onChange={() => toggleClass(cls)} 
                                                style={{ accentColor: 'var(--accent)' }}
                                            />
                                            <span>Class {cls}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="acad-form form-actions">
                            {editingId && <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>}
                            <button type="submit" className="btn btn-primary"><Save size={16}/> {editingId ? 'Update Subject' : 'Save Subject'}</button>
                        </div>
                    </form>
                </div>
                <div className="acad-table-panel">
                    <table className="data-table"><thead><tr><th>Subject</th><th>Code</th><th>Type</th><th>Classes</th><th>Actions</th></tr></thead>
                        <tbody>{subjects.map(s => (
                            <tr key={s.id} className={editingId === s.id ? 'row-editing' : ''}><td className="fw-600">{s.name}</td><td>{s.code}</td>
                                <td><span className={`badge ${s.type === 'Theory' ? 'badge-info' : s.type === 'Practical' ? 'badge-warning' : 'badge-success'}`}>{s.type}</span></td>
                                <td>{Array.isArray(s.classes) ? s.classes.join(', ') : '—'}</td>
                                <td>
                                    <button className="btn-icon" onClick={() => handleEdit(s)} title="Edit"><Edit3 size={16}/></button>
                                    <button className="btn-icon" onClick={async () => { if(await customConfirm(`Delete subject "${s.name}"?`)) setSubjects(prev => prev.filter(x => x.id !== s.id)) }} title="Delete" style={{color: 'var(--danger)'}}><Trash2 size={16}/></button>
                                </td></tr>
                        ))}</tbody></table>
                </div>
            </div>
        </div>
    );
}


// ======================== TEACHER ASSIGNMENT ========================
function TeacherAssignmentTab() {
    const [assignments, setAssignments] = useLocalStorage('academic_teacher_assignments', [
        { id: 1, class: 'I', section: 'A', subject: 'Mathematics', teacher: 'Rajesh Kumar', type: 'Subject Teacher' },
        { id: 2, class: 'I', section: 'A', subject: 'English', teacher: 'Kavitha Rao', type: 'Subject Teacher' },
        { id: 3, class: 'II', section: 'A', subject: 'Science', teacher: 'Mohan Das', type: 'Subject Teacher' },
        { id: 4, class: 'I', section: 'A', subject: '—', teacher: 'Rajesh Kumar', type: 'Class Teacher' },
    ]);
    const [allStaff] = useLocalStorage('mzs_staff', []);
    const [subjects] = useLocalStorage('academic_subjects', []);

    const teachers = allStaff.filter(s => s.role && s.role.toLowerCase().includes('teacher') && s.status === 'Active');
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

    const [selClass, setSelClass] = useState('');
    const [selSection, setSelSection] = useState('');
    
    // State to hold draft assignments for the selected class/section
    const [draftAssignments, setDraftAssignments] = useState({});
    const [draftClassTeacher, setDraftClassTeacher] = useState('');

    const applicableSubjects = subjects.filter(s => Array.isArray(s.classes) && (s.classes.includes(`Grade ${selClass}`) || s.classes.includes(selClass) || s.classes.includes('All Classes')));

    useEffect(() => {
        if (selClass && selSection) {
            const current = assignments.filter(a => a.class === selClass && a.section === selSection);
            const draft = {};
            current.filter(a => a.type === 'Subject Teacher').forEach(a => draft[a.subject] = a.teacher);
            setDraftAssignments(draft);
            
            const ct = current.find(a => a.type === 'Class Teacher');
            setDraftClassTeacher(ct ? ct.teacher : '');
        } else {
            setDraftAssignments({});
            setDraftClassTeacher('');
        }
    }, [selClass, selSection, assignments]);

    const handleSave = () => {
        if (!selClass || !selSection) {
            customAlert('Please select both Class and Section.', 'Error', 'error');
            return;
        }

        const newAssignments = assignments.filter(a => !(a.class === selClass && a.section === selSection));
        
        if (draftClassTeacher) {
            newAssignments.push({ id: Date.now() + Math.random(), class: selClass, section: selSection, subject: '—', teacher: draftClassTeacher, type: 'Class Teacher' });
        }
        
        Object.entries(draftAssignments).forEach(([subj, teacher]) => {
            if (teacher) {
                newAssignments.push({ id: Date.now() + Math.random(), class: selClass, section: selSection, subject: subj, teacher: teacher, type: 'Subject Teacher' });
            }
        });
        
        setAssignments(newAssignments);
        customAlert('Teacher assignments saved successfully!', 'Success', 'success');
    };

    return (
        <div className="animate-fade-in">
            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><UserCheck size={18}/> Assign Teachers to Class</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="form-group"><label className="form-label">Class <span className="required">*</span></label>
                        <select className="form-select" style={{ width: 150 }} value={selClass} onChange={e => setSelClass(e.target.value)}>
                            <option value="">Select</option>
                            {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label className="form-label">Section <span className="required">*</span></label>
                        <select className="form-select" style={{ width: 120 }} value={selSection} onChange={e => setSelSection(e.target.value)}>
                            <option value="">Select</option><option>A</option><option>B</option><option>C</option>
                        </select>
                    </div>
                </div>
            </div>

            {selClass && selSection && (
                <div className="acad-two-col">
                    <div className="acad-form-panel">
                        <h4 style={{ marginBottom: 16, color: 'var(--primary)' }}>Assignment Form: {selClass} - {selSection}</h4>
                        
                        <div className="form-group" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-light)' }}>
                            <label className="form-label">Class Teacher</label>
                            <select className="form-select" value={draftClassTeacher} onChange={e => setDraftClassTeacher(e.target.value)}>
                                <option value="">Select Class Teacher</option>
                                {teachers.map(t => <option key={t.id} value={t.name}>{t.name} ({t.dept})</option>)}
                            </select>
                        </div>
                        
                        <h5 style={{ marginBottom: 12 }}>Subject Teachers</h5>
                        {applicableSubjects.length > 0 ? (
                            applicableSubjects.map(s => (
                                <div className="form-group" key={s.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                                    <label className="form-label" style={{ width: 140, margin: 0 }}>{s.name}</label>
                                    <select className="form-select" style={{ flex: 1 }} value={draftAssignments[s.name] || ''} onChange={e => setDraftAssignments({...draftAssignments, [s.name]: e.target.value})}>
                                        <option value="">Select Teacher</option>
                                        {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                    </select>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No subjects assigned to this class yet.</p>
                        )}
                        
                        <div style={{ marginTop: 20 }}>
                            <button className="btn btn-primary" onClick={handleSave}><Save size={16}/> Save Assignments</button>
                        </div>
                    </div>

                    <div className="acad-table-panel">
                        <h4 style={{ marginBottom: 16 }}>Current Assignments ({selClass}-{selSection})</h4>
                        <table className="data-table">
                            <thead><tr><th>Subject</th><th>Teacher</th><th>Type</th></tr></thead>
                            <tbody>
                                {assignments.filter(a => a.class === selClass && a.section === selSection).length > 0 ? (
                                    assignments.filter(a => a.class === selClass && a.section === selSection).map(a => (
                                        <tr key={a.id}>
                                            <td className="fw-600">{a.subject}</td>
                                            <td>{a.teacher}</td>
                                            <td><span className={`badge ${a.type === 'Class Teacher' ? 'badge-success' : 'badge-info'}`}>{a.type}</span></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No assignments saved yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================== TIMETABLE ========================
function TimetableTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const [sel, setSel] = useState({ class: 'I', section: 'A' });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const [timetables, setTimetables] = useLocalStorage('academic_timetables', [
        {
            class: 'I', section: 'A', status: 'Draft',
            schedule: [
                { period: 1, time: '08:30-09:15', Monday: 'Mathematics', Tuesday: 'English', Wednesday: 'Science', Thursday: 'Hindi', Friday: 'Mathematics', Saturday: '—' },
                { period: 2, time: '09:15-10:00', Monday: 'English', Tuesday: 'Mathematics', Wednesday: 'Hindi', Thursday: 'Science', Friday: 'English', Saturday: '—' },
                { period: 3, time: '10:15-11:00', Monday: 'Science', Tuesday: 'Hindi', Wednesday: 'Mathematics', Thursday: 'English', Friday: 'Computer Science', Saturday: '—' }
            ]
        }
    ]);
    const [assignments] = useLocalStorage('academic_teacher_assignments', []);

    const currentTimetable = timetables.find(t => t.class === sel.class && t.section === sel.section) || {
        class: sel.class, section: sel.section, status: 'Draft',
        schedule: [
            { period: 1, time: '08:30-09:15', Monday: '—', Tuesday: '—', Wednesday: '—', Thursday: '—', Friday: '—', Saturday: '—' },
            { period: 2, time: '09:15-10:00', Monday: '—', Tuesday: '—', Wednesday: '—', Thursday: '—', Friday: '—', Saturday: '—' }
        ]
    };
    
    const schedule = currentTimetable.schedule;
    const status = currentTimetable.status;

    const classAssignments = assignments.filter(a => a.class === sel.class && a.section === sel.section && a.type === 'Subject Teacher');

    const updateCurrentTimetable = (newSchedule, newStatus) => {
        setTimetables(prev => {
            const existing = prev.find(t => t.class === sel.class && t.section === sel.section);
            if (existing) {
                return prev.map(t => t === existing ? { ...t, schedule: newSchedule, status: newStatus !== undefined ? newStatus : existing.status } : t);
            } else {
                return [...prev, { class: sel.class, section: sel.section, status: newStatus || 'Draft', schedule: newSchedule }];
            }
        });
    };

    const setStatus = (newStatus) => updateCurrentTimetable(schedule, newStatus);

    const [editingCell, setEditingCell] = useState(null); // { period, day }
    const [editingTime, setEditingTime] = useState(null); // period number
    const [timeValue, setTimeValue] = useState('');

    const checkTeacherConflict = (subject, day, period) => {
        if (subject === '—') return false;
        const assignment = classAssignments.find(a => a.subject === subject);
        if (!assignment || !assignment.teacher) return false;
        const teacher = assignment.teacher;

        for (const tt of timetables) {
            if (tt.class === sel.class && tt.section === sel.section) continue;
            const row = tt.schedule.find(r => r.period === period);
            if (row && row[day] !== '—') {
                const otherAssignments = assignments.filter(a => a.class === tt.class && a.section === tt.section && a.type === 'Subject Teacher');
                const otherAssign = otherAssignments.find(a => a.subject === row[day]);
                if (otherAssign && otherAssign.teacher === teacher) {
                    return `Teacher Double-booking: ${teacher} is already assigned to Class ${tt.class}-${tt.section} for Period ${period} on ${day}.`;
                }
            }
        }
        return false;
    };

    const handleCellClick = (period, day) => {
        if (status === 'Published') return;
        setEditingCell({ period, day });
    };

    const handleSubjectSelect = (e) => {
        const val = e.target.value;
        const error = checkTeacherConflict(val, editingCell.day, editingCell.period);
        
        if (error) {
            customAlert(error, 'Conflict Detected', 'error');
            setEditingCell(null);
        } else {
            const newSchedule = schedule.map(row => row.period === editingCell.period ? { ...row, [editingCell.day]: val } : row);
            updateCurrentTimetable(newSchedule);
            setEditingCell(null);
        }
    };

    const handleTimeClick = (period, currentTime) => {
        if (status === 'Published') return;
        setEditingTime(period);
        setTimeValue(currentTime);
    };

    const handleTimeSave = () => {
        if (editingTime === null) return;
        const newSchedule = schedule.map(row => row.period === editingTime ? { ...row, time: timeValue.trim() } : row);
        updateCurrentTimetable(newSchedule);
        setEditingTime(null);
        setTimeValue('');
    };

    const handleTimeKeyDown = (e) => {
        if (e.key === 'Enter') handleTimeSave();
        if (e.key === 'Escape') { setEditingTime(null); setTimeValue(''); }
    };

    const addPeriod = () => {
        const nextPeriod = schedule.length + 1;
        const newRow = { period: nextPeriod, time: '--:--' };
        days.forEach(d => newRow[d] = '—');
        updateCurrentTimetable([...schedule, newRow]);
    };

    const deletePeriod = async (periodNum) => {
        if (await customConfirm(`Delete Period ${periodNum} from the timetable?`)) {
            const filtered = schedule.filter(r => r.period !== periodNum);
            const renumbered = filtered.map((r, i) => ({ ...r, period: i + 1 }));
            updateCurrentTimetable(renumbered);
        }
    };

    const getTeacherForSubject = (subject) => {
        if (subject === '—') return null;
        const a = classAssignments.find(x => x.subject === subject);
        return a ? a.teacher : 'Unassigned';
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group"><label className="form-label">Class</label>
                    <select className="form-select" style={{ width: 140 }} value={sel.class} onChange={e => setSel({ ...sel, class: e.target.value })}>
                        {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                    </select></div>
                <div className="form-group"><label className="form-label">Section</label>
                    <select className="form-select" style={{ width: 100 }} value={sel.section} onChange={e => setSel({ ...sel, section: e.target.value })}><option>A</option><option>B</option><option>C</option></select></div>
                
                <span className={`badge ${status === 'Published' ? 'badge-success' : 'badge-draft'}`} style={{ marginBottom: 8 }}>{status}</span>
                
                {status === 'Draft' && <button className="btn btn-primary" style={{ marginBottom: 4 }} onClick={() => { setStatus('Published'); customAlert('Timetable published successfully!', 'Success', 'success'); }}><Send size={16}/> Publish</button>}
                {status === 'Published' && <button className="btn btn-outline" style={{ marginBottom: 4 }} onClick={() => setStatus('Draft')}><Edit3 size={16}/> Revert to Draft</button>}
                
                {status === 'Draft' && <button className="btn btn-outline" style={{ marginBottom: 4, marginLeft: 'auto' }} onClick={addPeriod}><PlusCircle size={16}/> Add Period</button>}
            </div>
            
            {status === 'Draft' && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>💡 Click on any subject cell to assign a subject and teacher. Time slots can also be edited.</p>}
            
            <div className="timetable-grid-wrapper">
                <table className="data-table timetable-table">
                    <thead><tr><th>Period</th><th>Time</th>{days.map(d => <th key={d}>{d}</th>)}{status === 'Draft' && <th style={{ width: 50 }}>Actions</th>}</tr></thead>
                    <tbody>{schedule.map(row => (
                        <tr key={row.period}>
                            <td className="fw-600">Period {row.period}</td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--text-light)', cursor: status === 'Draft' ? 'pointer' : 'default' }} onClick={() => handleTimeClick(row.period, row.time)}>
                                {editingTime === row.period ? (
                                    <input 
                                        type="text" className="form-input" autoFocus
                                        value={timeValue} onChange={e => setTimeValue(e.target.value)}
                                        onBlur={handleTimeSave} onKeyDown={handleTimeKeyDown}
                                        style={{ fontSize: '0.82rem', padding: '2px 6px', width: 100 }}
                                    />
                                ) : row.time}
                            </td>
                            {days.map(d => (
                                <td key={d} onClick={() => handleCellClick(row.period, d)} style={{ cursor: status === 'Draft' ? 'pointer' : 'default', verticalAlign: 'top' }}>
                                    {editingCell && editingCell.period === row.period && editingCell.day === d ? (
                                        <select 
                                            className="form-select" autoFocus
                                            value={row[d]} onChange={handleSubjectSelect}
                                            onBlur={() => setEditingCell(null)}
                                            style={{ fontSize: '0.85rem', padding: '4px 20px 4px 8px', width: '100%' }}
                                        >
                                            <option value="—">— Free Period —</option>
                                            {classAssignments.map(a => <option key={a.id} value={a.subject}>{a.subject} ({a.teacher})</option>)}
                                        </select>
                                    ) : (
                                        <div className="subject-box" style={{ background: row[d] === '—' ? 'var(--bg)' : 'var(--accent-light)', padding: '6px 8px', borderRadius: 4, textAlign: 'center', transition: 'all 0.15s ease', minHeight: 45, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{row[d]}</span>
                                            {row[d] !== '—' && <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: 2 }}>{getTeacherForSubject(row[d])}</span>}
                                        </div>
                                    )}
                                </td>
                            ))}
                            {status === 'Draft' && (
                                <td>
                                    <button className="btn-icon" title="Delete Period" style={{ color: 'var(--danger)' }} onClick={() => deletePeriod(row.period)}><Trash2 size={16}/></button>
                                </td>
                            )}
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
}

// ======================== SYLLABUS ========================
function SyllabusTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const [expandedCh, setExpandedCh] = useState([1]);
    const [syllabus, setSyllabus] = useLocalStorage('academic_syllabus', [
        { id: 1, class: 'I', subject: 'Mathematics', chapter: 1, title: 'Algebra', hours: 8, topics: [{ name: 'Linear Equations', obj: 'Solve simple linear equations' }, { name: 'Quadratic Formula', obj: 'Find roots using formula' }], attachment: null },
        { id: 2, class: 'II', subject: 'Mathematics', chapter: 2, title: 'Geometry', hours: 10, topics: [{ name: 'Triangles', obj: 'Understand basic properties' }], attachment: { name: 'geometry_guide.pdf' } },
    ]);
    const [filterClass, setFilterClass] = useState('I');
    const [filterSubject, setFilterSubject] = useState('Mathematics');

    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState({ chapter: '', title: '', hours: '', topics: [{ name: '', obj: '' }], attachment: null });

    const handleAddTopic = () => setForm({ ...form, topics: [...form.topics, { name: '', obj: '' }] });
    const updateTopic = (index, field, value) => {
        const newTopics = [...form.topics];
        newTopics[index][field] = value;
        setForm({ ...form, topics: newTopics });
    };
    const removeTopic = (index) => setForm({ ...form, topics: form.topics.filter((_, i) => i !== index) });

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) setForm({ ...form, attachment: { name: file.name } });
    };

    const handleAddChapter = async (e) => {
        e.preventDefault();
        const validTopics = form.topics.filter(t => t.name.trim());
        if (validTopics.length === 0) {
            customAlert('Please add at least one topic.', 'Error', 'error');
            return;
        }
        const newChapter = {
            id: Date.now(),
            class: filterClass,
            subject: filterSubject,
            chapter: parseInt(form.chapter) || (syllabus.filter(s => s.class === filterClass && s.subject === filterSubject).length + 1),
            title: form.title,
            hours: parseInt(form.hours) || 0,
            topics: validTopics,
            attachment: form.attachment
        };
        setSyllabus(prev => [...prev, newChapter]);
        setForm({ chapter: '', title: '', hours: '', topics: [{ name: '', obj: '' }], attachment: null });
        setIsAdding(false);
        await customAlert(`Chapter "${newChapter.title}" added successfully!`, 'Success', 'success');
    };

    const handleDeleteChapter = async (id, title, e) => {
        e.stopPropagation();
        if (await customConfirm(`Delete chapter "${title}"?`)) {
            setSyllabus(prev => prev.filter(ch => ch.id !== id));
        }
    };

    const filteredSyllabus = syllabus.filter(ch => ch.class === filterClass && ch.subject === filterSubject);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                    <div className="form-group"><label className="form-label">Class</label>
                        <select className="form-select" style={{ width: 140 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                            {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label className="form-label">Subject</label>
                        <select className="form-select" style={{ width: 160 }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
                            <option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option><option>Computer Science</option>
                        </select>
                    </div>
                </div>
                {!isAdding && <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={() => setIsAdding(true)}><PlusCircle size={16}/> Add Chapter</button>}
            </div>

            {isAdding && (
                <div className="acad-form-panel animate-fade-in" style={{ padding: 24, marginBottom: 20 }}>
                    <h3 style={{ marginBottom: 24, color: 'var(--primary)' }}>Add New Chapter ({filterClass} - {filterSubject})</h3>
                    <form className="acad-form form-row-2" onSubmit={handleAddChapter}>
                        <div className="form-group"><label className="form-label">Chapter Number <span className="required">*</span></label>
                            <input type="number" className="form-input" required min="1" value={form.chapter} onChange={e => setForm({...form, chapter: e.target.value})} /></div>
                        <div className="form-group"><label className="form-label">Title <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Introduction to Algebra" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                        <div className="form-group"><label className="form-label">Expected Hours <span className="required">*</span></label>
                            <input type="number" className="form-input" required min="1" value={form.hours} onChange={e => setForm({...form, hours: e.target.value})} /></div>
                        
                        <div className="form-group">
                            <label className="form-label">Syllabus File (PDF)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input type="file" accept=".pdf" className="form-input" onChange={handleFileUpload} style={{ flex: 1 }} />
                                {form.attachment && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}><CheckCircle2 size={14} style={{ verticalAlign: 'middle' }}/> Attached</span>}
                            </div>
                        </div>

                        <div style={{ gridColumn: 'span 2', marginTop: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <label className="form-label" style={{ margin: 0 }}>Topics <span className="required">*</span></label>
                                <button type="button" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={handleAddTopic}>+ Add Topic</button>
                            </div>
                            {form.topics.map((t, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                                    <input type="text" className="form-input" placeholder="Topic Name" value={t.name} onChange={e => updateTopic(idx, 'name', e.target.value)} style={{ flex: 1 }} />
                                    <input type="text" className="form-input" placeholder="Learning Objectives (Optional)" value={t.obj} onChange={e => updateTopic(idx, 'obj', e.target.value)} style={{ flex: 2 }} />
                                    {form.topics.length > 1 && (
                                        <button type="button" className="btn-icon" style={{ color: 'var(--danger)', marginTop: 8 }} onClick={() => removeTopic(idx)}><Trash2 size={16}/></button>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                            <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Save Chapter</button>
                        </div>
                    </form>
                </div>
            )}

            {!isAdding && (
                <div className="syllabus-tree">
                    {filteredSyllabus.length > 0 ? filteredSyllabus.map(ch => (
                        <div className="syllabus-chapter" key={ch.id}>
                            <div className="syllabus-chapter-header" onClick={() => setExpandedCh(prev => prev.includes(ch.id) ? prev.filter(x => x !== ch.id) : [...prev, ch.id])}>
                                {expandedCh.includes(ch.id) ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                                <span>Chapter {ch.chapter}: {ch.title}</span>
                                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ch.hours} hrs</span>
                                {ch.attachment && <span style={{ marginLeft: 16, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}><FileText size={14}/> PDF</span>}
                                <button className="btn-icon" onClick={(e) => handleDeleteChapter(ch.id, ch.title, e)} style={{ color: 'var(--danger)', margin: '0 8px 0 16px' }} title="Delete Chapter"><Trash2 size={16}/></button>
                            </div>
                            {expandedCh.includes(ch.id) && ch.topics.map((t, i) => (
                                <div className="syllabus-topic" key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BookMarked size={14} style={{ color: 'var(--primary)' }}/> <strong>{t.name}</strong></div>
                                    {t.obj && <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', paddingLeft: 22 }}>Objective: {t.obj}</div>}
                                </div>
                            ))}
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                            No syllabus chapters found for this class and subject.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ======================== LESSON PLAN ========================
function LessonPlanTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const [syllabus] = useLocalStorage('academic_syllabus', []);
    const [plans, setPlans] = useLocalStorage('academic_lesson_plans', [
        { id: 1, class: 'I', subject: 'Mathematics', title: 'Introduction to Linear Equations', chapter: 'Algebra', topic: 'Linear Equations', method: 'Lecture', date: '2026-03-20', status: 'Completed' },
        { id: 2, class: 'I', subject: 'Mathematics', title: 'Solving Quadratic Equations', chapter: 'Algebra', topic: 'Quadratic Formula', method: 'Activity', date: '2026-03-22', status: 'Planned' },
    ]);
    const [filterClass, setFilterClass] = useState('I');
    const [filterSubject, setFilterSubject] = useState('Mathematics');

    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ chapterId: '', topicIdx: '', title: '', method: 'Lecture', resources: '', date: '' });

    const [trackingPlan, setTrackingPlan] = useState(null);
    const [statusForm, setStatusForm] = useState({ status: 'Completed', actualDate: '', notes: '' });

    const filteredPlans = plans.filter(p => p.class === filterClass && p.subject === filterSubject);
    const filteredSyllabus = syllabus.filter(s => s.class === filterClass && s.subject === filterSubject);

    const handleCreate = (e) => {
        e.preventDefault();
        const ch = filteredSyllabus.find(s => s.id.toString() === form.chapterId);
        const topic = ch ? ch.topics[parseInt(form.topicIdx)] : null;
        if (!ch || !topic) return customAlert('Please select a valid chapter and topic.', 'Error', 'error');

        const newPlan = {
            id: Date.now(),
            class: filterClass,
            subject: filterSubject,
            title: form.title,
            chapter: ch.title,
            topic: topic.name,
            objectives: topic.obj || '',
            method: form.method,
            resources: form.resources,
            date: form.date,
            status: 'Planned'
        };
        setPlans(prev => [...prev, newPlan]);
        setShowCreate(false);
        setForm({ chapterId: '', topicIdx: '', title: '', method: 'Lecture', resources: '', date: '' });
        customAlert('Lesson plan created successfully!', 'Success', 'success');
    };

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        setPlans(prev => prev.map(p => p.id === trackingPlan.id ? { ...p, ...statusForm } : p));
        setTrackingPlan(null);
        customAlert('Lesson plan status updated!', 'Success', 'success');
    };

    const statusBadge = (s) => s === 'Completed' ? 'badge-success' : s === 'Planned' ? 'badge-info' : s === 'Pending' ? 'badge-warning' : 'badge-draft';

    return (
        <div className="animate-fade-in relative">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <select className="form-select" style={{ width: 140 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                        {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                    </select>
                    <select className="form-select" style={{ width: 160 }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
                        <option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option><option>Computer Science</option>
                    </select>
                </div>
                {!showCreate && <button className="btn btn-primary" onClick={() => setShowCreate(true)}><PlusCircle size={16}/> Create Lesson Plan</button>}
            </div>

            {showCreate && (
                <div className="acad-form-panel animate-fade-in" style={{ padding: 24, marginBottom: 20 }}>
                    <h3 style={{ marginBottom: 24, color: 'var(--primary)' }}>Create Lesson Plan ({filterClass} - {filterSubject})</h3>
                    <form className="acad-form form-row-2" onSubmit={handleCreate}>
                        <div className="form-group"><label className="form-label">Syllabus Chapter <span className="required">*</span></label>
                            <select className="form-select" required value={form.chapterId} onChange={e => setForm({ ...form, chapterId: e.target.value, topicIdx: '' })}>
                                <option value="">Select Chapter</option>
                                {filteredSyllabus.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                            </select>
                        </div>
                        <div className="form-group"><label className="form-label">Topic <span className="required">*</span></label>
                            <select className="form-select" required value={form.topicIdx} onChange={e => setForm({ ...form, topicIdx: e.target.value })}>
                                <option value="">Select Topic</option>
                                {form.chapterId && filteredSyllabus.find(s => s.id.toString() === form.chapterId)?.topics.map((t, i) => (
                                    <option key={i} value={i}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">Lesson Title <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Introduction to Algebra concepts" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                        
                        <div className="form-group"><label className="form-label">Teaching Method <span className="required">*</span></label>
                            <select className="form-select" required value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
                                <option>Lecture</option><option>Discussion</option><option>Activity</option><option>Demonstration</option><option>Multimedia</option>
                            </select>
                        </div>
                        <div className="form-group"><label className="form-label">Date of Delivery <span className="required">*</span></label>
                            <input type="date" className="form-input" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
                        
                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">Resources / Aids</label>
                            <input type="text" className="form-input" placeholder="e.g. Projector, Graph Paper, Handouts" value={form.resources} onChange={e => setForm({...form, resources: e.target.value})} /></div>
                        
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                            <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Save Lesson Plan</button>
                        </div>
                    </form>
                </div>
            )}

            {trackingPlan && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ background: 'var(--card-bg)', padding: 24, borderRadius: 12, width: '90%', maxWidth: 500 }}>
                        <h3 style={{ marginBottom: 16 }}>Track Completion: {trackingPlan.title}</h3>
                        <form onSubmit={handleUpdateStatus}>
                            <div className="form-group" style={{ marginBottom: 16 }}><label className="form-label">Status</label>
                                <select className="form-select" value={statusForm.status} onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}>
                                    <option>Planned</option><option>Completed</option><option>Rescheduled</option><option>Pending</option>
                                </select>
                            </div>
                            {statusForm.status === 'Completed' && (
                                <div className="form-group" style={{ marginBottom: 16 }}><label className="form-label">Actual Date of Delivery <span className="required">*</span></label>
                                    <input type="date" className="form-input" required value={statusForm.actualDate} onChange={e => setStatusForm({ ...statusForm, actualDate: e.target.value })} />
                                </div>
                            )}
                            <div className="form-group" style={{ marginBottom: 20 }}><label className="form-label">Delivery Notes / Observations</label>
                                <textarea className="form-input" rows="3" placeholder="How did the lesson go? Any follow-ups required?" value={statusForm.notes} onChange={e => setStatusForm({ ...statusForm, notes: e.target.value })}></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button type="button" className="btn btn-outline" onClick={() => setTrackingPlan(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Update Status</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!showCreate && (
                <div className="lesson-plan-grid">
                    {filteredPlans.length > 0 ? filteredPlans.map(p => (
                        <div className="lesson-plan-card" key={p.id} style={{ cursor: 'pointer', position: 'relative' }} onClick={() => { setTrackingPlan(p); setStatusForm({ status: p.status, actualDate: p.actualDate || '', notes: p.notes || '' }); }}>
                            <div style={{ position: 'absolute', top: 16, right: 16 }}>
                                <span className={`badge ${statusBadge(p.status)}`}>{p.status}</span>
                            </div>
                            <h4 style={{ paddingRight: 80, marginBottom: 8, fontSize: '1.05rem' }}>{p.title}</h4>
                            <div className="lp-meta" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BookMarked size={14}/> {p.chapter} - {p.topic}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14}/> Planned: {p.date}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><GraduationCap size={14}/> {p.method}</span>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No lesson plans found for this class and subject.</div>
                    )}
                </div>
            )}
        </div>
    );
}

// ======================== ASSIGNMENTS ========================
function AssignmentsTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const [assignments, setAssignments] = useLocalStorage('academic_assignments', [
        { id: 1, title: 'Algebra Practice Set 1', class: 'I', section: 'A', subject: 'Mathematics', dueDate: '2026-03-28T10:00', status: 'Published', submissions: 28, total: 35, desc: 'Solve exercises 1-10 on page 42.' },
        { id: 2, title: 'Essay on Environment', class: 'II', section: 'A', subject: 'English', dueDate: '2026-03-30T15:00', status: 'Draft', submissions: 0, total: 32, desc: 'Write a 200 word essay.' },
    ]);

    // Submissions mock data
    const [allSubmissions, setAllSubmissions] = useLocalStorage('academic_submissions', [
        { id: 101, assignmentId: 1, studentId: 'S001', studentName: 'Aarav Sharma', status: 'Submitted', file: 'aarav_algebra.pdf', submitDate: '2026-03-27T14:30', marks: null, feedback: '' },
        { id: 102, assignmentId: 1, studentId: 'S002', studentName: 'Diya Patel', status: 'Pending', file: null, submitDate: null, marks: null, feedback: '' },
        { id: 103, assignmentId: 1, studentId: 'S003', studentName: 'Rohan Singh', status: 'Late', file: 'rohan_math_hw.jpg', submitDate: '2026-03-28T11:45', marks: null, feedback: '' },
        { id: 104, assignmentId: 1, studentId: 'S004', studentName: 'Ananya Verma', status: 'Graded', file: 'ananya_hw1.pdf', submitDate: '2026-03-26T09:10', marks: 32, feedback: 'Good work, but check question 5.' },
    ]);
    
    const [filterClass, setFilterClass] = useState('I');
    const [filterSubject, setFilterSubject] = useState('Mathematics');

    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ class: 'I', section: 'A', subject: 'Mathematics', title: '', desc: '', dueDate: '', status: 'Draft', file: null });

    const [activeAssignment, setActiveAssignment] = useState(null); // The assignment being monitored
    const [gradingSubmission, setGradingSubmission] = useState(null); // The submission being graded
    const [gradeForm, setGradeForm] = useState({ marks: '', feedback: '' });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setForm({ ...form, file: { name: file.name } });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const newAssignment = {
            id: Date.now(),
            class: form.class,
            section: form.section,
            subject: form.subject,
            title: form.title,
            desc: form.desc,
            dueDate: form.dueDate,
            status: form.status,
            submissions: 0,
            total: 35, // dummy value
            file: form.file
        };
        setAssignments(prev => [...prev, newAssignment]);
        setShowCreate(false);
        setForm({ class: filterClass, section: 'A', subject: filterSubject, title: '', desc: '', dueDate: '', status: 'Draft', file: null });
        customAlert('Assignment created successfully!', 'Success', 'success');
    };

    const toggleStatus = (id, currentStatus) => {
        const nextStatus = currentStatus === 'Draft' ? 'Published' : 'Draft';
        setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: nextStatus } : a));
    };

    const handleSaveGrade = (e) => {
        e.preventDefault();
        setAllSubmissions(prev => prev.map(sub => sub.id === gradingSubmission.id ? { ...sub, marks: gradeForm.marks, feedback: gradeForm.feedback, status: 'Graded' } : sub));
        setGradingSubmission(null);
        customAlert('Submission graded successfully!', 'Success', 'success');
    };

    const filteredAssignments = assignments.filter(a => a.class === filterClass && a.subject === filterSubject);
    const activeSubmissions = activeAssignment ? allSubmissions.filter(s => s.assignmentId === activeAssignment.id) : [];

    const statusBadge = (s) => s === 'Published' || s === 'Submitted' ? 'badge-info' : s === 'Draft' || s === 'Pending' ? 'badge-draft' : s === 'Graded' ? 'badge-success' : 'badge-warning';

    if (activeAssignment) {
        return (
            <div className="animate-fade-in relative">
                <button className="btn btn-outline" style={{ marginBottom: 20 }} onClick={() => setActiveAssignment(null)}><ChevronRight size={16} style={{ transform: 'rotate(180deg)' }}/> Back to Assignments</button>
                <div style={{ marginBottom: 20 }}>
                    <h3 style={{ color: 'var(--primary)' }}>Submission Monitor: {activeAssignment.title}</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Due: {new Date(activeAssignment.dueDate).toLocaleString()} | Class: {activeAssignment.class}-{activeAssignment.section}</p>
                </div>
                
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Student ID</th><th>Student Name</th><th>Submitted On</th><th>File</th><th>Status</th><th>Marks</th><th>Actions</th></tr></thead>
                        <tbody>{activeSubmissions.length > 0 ? activeSubmissions.map(sub => (
                            <tr key={sub.id}>
                                <td>{sub.studentId}</td>
                                <td className="fw-600">{sub.studentName}</td>
                                <td>{sub.submitDate ? new Date(sub.submitDate).toLocaleString() : '—'}</td>
                                <td>{sub.file ? <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={14}/> {sub.file}</span> : '—'}</td>
                                <td><span className={`badge ${statusBadge(sub.status)}`}>{sub.status}</span></td>
                                <td>{sub.marks !== null ? sub.marks : '—'}</td>
                                <td>
                                    {(sub.status === 'Submitted' || sub.status === 'Late' || sub.status === 'Graded') && (
                                        <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => { setGradingSubmission(sub); setGradeForm({ marks: sub.marks || '', feedback: sub.feedback || '' }); }}>
                                            <Edit3 size={14} style={{ marginRight: 4 }}/> Evaluate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No submissions found for this assignment.</td></tr>
                        )}</tbody>
                    </table>
                </div>

                {gradingSubmission && (
                    <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="modal-content" style={{ background: 'var(--card-bg)', padding: 24, borderRadius: 12, width: '90%', maxWidth: 500 }}>
                            <h3 style={{ marginBottom: 16, color: 'var(--primary)' }}>Evaluate Submission</h3>
                            <div style={{ marginBottom: 20, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <p><strong>Student:</strong> {gradingSubmission.studentName} ({gradingSubmission.studentId})</p>
                                <p><strong>File:</strong> {gradingSubmission.file} <a href="#" style={{ color: 'var(--primary)', marginLeft: 8 }}>Download</a></p>
                                <p><strong>Submitted On:</strong> {new Date(gradingSubmission.submitDate).toLocaleString()}</p>
                            </div>
                            <form onSubmit={handleSaveGrade}>
                                <div className="form-group" style={{ marginBottom: 16 }}><label className="form-label">Marks Awarded <span className="required">*</span></label>
                                    <input type="number" className="form-input" required value={gradeForm.marks} onChange={e => setGradeForm({ ...gradeForm, marks: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 20 }}><label className="form-label">Feedback / Remarks</label>
                                    <textarea className="form-input" rows="4" placeholder="Provide constructive feedback..." value={gradeForm.feedback} onChange={e => setGradeForm({ ...gradeForm, feedback: e.target.value })}></textarea>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setGradingSubmission(null)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Mark as Graded</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <select className="form-select" style={{ width: 140 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                        {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                    </select>
                    <select className="form-select" style={{ width: 160 }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
                        <option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option><option>Computer Science</option>
                    </select>
                </div>
                {!showCreate && <button className="btn btn-primary" onClick={() => setShowCreate(true)}><PlusCircle size={16}/> Create Assignment</button>}
            </div>

            {showCreate && (
                <div className="acad-form-panel animate-fade-in" style={{ padding: 24, marginBottom: 20 }}>
                    <h3 style={{ marginBottom: 24, color: 'var(--primary)' }}>Create New Assignment</h3>
                    <form className="acad-form form-row-2" onSubmit={handleCreate}>
                        <div className="form-group"><label className="form-label">Class <span className="required">*</span></label>
                            <select className="form-select" required value={form.class} onChange={e => setForm({...form, class: e.target.value})}>
                                {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                            </select></div>
                        <div className="form-group"><label className="form-label">Section <span className="required">*</span></label>
                            <select className="form-select" required value={form.section} onChange={e => setForm({...form, section: e.target.value})}><option>A</option><option>B</option><option>C</option></select></div>
                        <div className="form-group"><label className="form-label">Subject <span className="required">*</span></label>
                            <select className="form-select" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                                <option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option><option>Computer Science</option>
                            </select></div>
                        <div className="form-group"><label className="form-label">Assignment Title <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Chapter 1 Exercises" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                        
                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">Description / Instructions</label>
                            <textarea className="form-input" rows="3" placeholder="Provide detailed instructions for the students..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}></textarea></div>
                        
                        <div className="form-group"><label className="form-label">Due Date & Time <span className="required">*</span></label>
                            <input type="datetime-local" className="form-input" required value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
                        
                        <div className="form-group">
                            <label className="form-label">Reference File / Attachment</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input type="file" className="form-input" onChange={handleFileChange} style={{ flex: 1 }} />
                                {form.file && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}><CheckCircle2 size={14} style={{ verticalAlign: 'middle' }}/> Attached</span>}
                            </div>
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                            <label className="form-label" style={{ margin: 0 }}>Visibility:</label>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                    <input type="radio" name="status" checked={form.status === 'Draft'} onChange={() => setForm({...form, status: 'Draft'})} /> Save as Draft
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                    <input type="radio" name="status" checked={form.status === 'Published'} onChange={() => setForm({...form, status: 'Published'})} /> Publish Immediately
                                </label>
                            </div>
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                            <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Save Assignment</button>
                        </div>
                    </form>
                </div>
            )}

            {!showCreate && (
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Title</th><th>Section</th><th>Due Date</th><th>Submissions</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>{filteredAssignments.length > 0 ? filteredAssignments.map(a => (
                            <tr key={a.id}>
                                <td className="fw-600">
                                    {a.title}
                                    {a.file && <FileText size={12} style={{ marginLeft: 6, color: 'var(--primary)', verticalAlign: 'middle' }} />}
                                </td>
                                <td>{a.section}</td>
                                <td>{new Date(a.dueDate).toLocaleString()}</td>
                                <td>{a.submissions}/{a.total}</td>
                                <td>
                                    <span className={`badge ${statusBadge(a.status)}`} style={{ cursor: 'pointer' }} onClick={() => toggleStatus(a.id, a.status)} title="Click to toggle status">
                                        {a.status}
                                    </span>
                                </td>
                                <td>
                                    {a.status === 'Published' && (
                                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem', marginRight: 8 }} onClick={() => setActiveAssignment(a)}>
                                            Submissions
                                        </button>
                                    )}
                                    <button className="btn-icon" title="View" onClick={() => customAlert(`Assignment: ${a.title}\nDescription: ${a.desc}\nClass: ${a.class}-${a.section}\nSubject: ${a.subject}\nDue: ${new Date(a.dueDate).toLocaleString()}\nStatus: ${a.status}`)}><Eye size={16}/></button>
                                    <button className="btn-icon" title="Delete" onClick={() => setAssignments(prev => prev.filter(x => x.id !== a.id))} style={{ color: 'var(--danger)' }}><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No assignments found for this class and subject.</td></tr>
                        )}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ======================== ATTENDANCE ========================
// ======================== ATTENDANCE ========================
function AttendanceTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    
    // Using a more structured dummy data that can be filtered by class/section
    const [allStudents, setAllStudents] = useLocalStorage('academic_attendance_records', [
        { id: 1, class: 'I', section: 'A', name: 'Aarav Sharma', rollNo: '01', status: 'P', remarks: '' },
        { id: 2, class: 'I', section: 'A', name: 'Diya Patel', rollNo: '02', status: 'P', remarks: '' },
        { id: 3, class: 'I', section: 'A', name: 'Kavya Gupta', rollNo: '03', status: 'A', remarks: 'Fever' },
        { id: 4, class: 'I', section: 'A', name: 'Rohan Singh', rollNo: '04', status: 'P', remarks: '' },
        { id: 5, class: 'I', section: 'B', name: 'Ananya Verma', rollNo: '05', status: 'L', remarks: 'Family function' },
        { id: 6, class: 'I', section: 'B', name: 'Ishaan Roy', rollNo: '06', status: 'P', remarks: '' },
    ]);
    
    const [filterClass, setFilterClass] = useState('I');
    const [filterSection, setFilterSection] = useState('A');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Derived state for current view
    const currentStudents = allStudents.filter(s => s.class === filterClass && s.section === filterSection);

    const markAll = (status) => {
        setAllStudents(prev => prev.map(s => (s.class === filterClass && s.section === filterSection) ? { ...s, status, remarks: status === 'P' ? '' : s.remarks } : s));
    };

    const toggle = (id, status) => {
        setAllStudents(prev => prev.map(s => s.id === id ? { ...s, status, remarks: status === 'P' ? '' : s.remarks } : s));
    };

    const updateRemarks = (id, remarks) => {
        setAllStudents(prev => prev.map(s => s.id === id ? { ...s, remarks } : s));
    };

    const handleSave = () => {
        customAlert('Attendance saved successfully!', 'Success', 'success');
    };

    const counts = { 
        P: currentStudents.filter(s => s.status === 'P').length, 
        A: currentStudents.filter(s => s.status === 'A').length, 
        L: currentStudents.filter(s => s.status === 'L').length 
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="form-group"><label className="form-label">Class</label>
                        <select className="form-select" style={{ width: 140 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                            {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label className="form-label">Section</label>
                        <select className="form-select" style={{ width: 100 }} value={filterSection} onChange={e => setFilterSection(e.target.value)}>
                            <option>A</option><option>B</option><option>C</option>
                        </select>
                    </div>
                    <div className="form-group"><label className="form-label">Date</label>
                        <input type="date" className="form-input" style={{ width: 160 }} value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                </div>
                <button className="btn btn-outline" onClick={() => markAll('P')}><CheckCircle2 size={16}/> Mark All Present</button>
            </div>
            
            <div className="acad-stats-row" style={{ marginBottom: 16 }}>
                <div className="acad-stat-card"><div className="acad-stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={24} style={{ color: 'var(--success)' }}/></div><div className="acad-stat-info"><h4>{counts.P}</h4><p>Present</p></div></div>
                <div className="acad-stat-card"><div className="acad-stat-icon" style={{ background: 'var(--danger-light)' }}><XCircle size={24} style={{ color: 'var(--danger)' }}/></div><div className="acad-stat-info"><h4>{counts.A}</h4><p>Absent</p></div></div>
                <div className="acad-stat-card"><div className="acad-stat-icon" style={{ background: 'var(--warning-light)' }}><Calendar size={24} style={{ color: 'var(--warning)' }}/></div><div className="acad-stat-info"><h4>{counts.L}</h4><p>Leave</p></div></div>
            </div>
            
            <div className="table-responsive">
                <table className="data-table">
                    <thead><tr><th>Roll No</th><th>Student Name</th><th>Present</th><th>Absent</th><th>Leave</th><th>Remarks</th></tr></thead>
                    <tbody>
                        {currentStudents.length > 0 ? currentStudents.map(s => (
                            <tr key={s.id}>
                                <td>{s.rollNo}</td>
                                <td className="fw-600">{s.name}</td>
                                {['P', 'A', 'L'].map(st => (
                                    <td key={st}>
                                        <input type="radio" name={`att-${s.id}`} checked={s.status === st} onChange={() => toggle(s.id, st)} style={{ accentColor: st === 'P' ? 'var(--success)' : st === 'A' ? 'var(--danger)' : 'var(--warning)', cursor: 'pointer', width: 18, height: 18 }}/>
                                    </td>
                                ))}
                                <td>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.85rem', opacity: s.status === 'P' ? 0.3 : 1 }} 
                                        placeholder={s.status === 'P' ? 'N/A' : 'Add remarks (optional)'} 
                                        value={s.remarks} 
                                        onChange={e => updateRemarks(s.id, e.target.value)}
                                        disabled={s.status === 'P'}
                                    />
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No students found for this class and section.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleSave}><Save size={16}/> Save Attendance</button>
            </div>
        </div>
    );
}

// ======================== PERFORMANCE ========================
function PerformanceTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const [assessments, setAssessments] = useLocalStorage('academic_assessments', [
        { id: 1, name: 'Unit Test 1', class: 'I', section: 'A', subject: 'Mathematics', maxMarks: 50, date: '2026-02-15', marks: { 'S001': 45, 'S002': 38, 'S003': 30 } },
        { id: 2, name: 'Mid-Term Class Test', class: 'II', section: 'B', subject: 'Science', maxMarks: 100, date: '2026-03-01', marks: {} },
    ]);

    const DUMMY_STUDENTS = [
        { id: 'S001', name: 'Aarav Sharma', roll: '01' },
        { id: 'S002', name: 'Diya Patel', roll: '02' },
        { id: 'S003', name: 'Kavya Gupta', roll: '03' },
        { id: 'S004', name: 'Rohan Singh', roll: '04' },
    ];

    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ name: '', class: 'I', section: 'A', subject: 'Mathematics', maxMarks: 100, date: '' });
    
    const [markingAssessment, setMarkingAssessment] = useState(null);
    const [marksForm, setMarksForm] = useState({});

    const handleCreate = (e) => {
        e.preventDefault();
        const newAssessment = {
            id: Date.now(),
            ...form,
            maxMarks: parseInt(form.maxMarks),
            marks: {}
        };
        setAssessments(prev => [...prev, newAssessment]);
        setShowCreate(false);
        setForm({ name: '', class: 'I', section: 'A', subject: 'Mathematics', maxMarks: 100, date: '' });
        customAlert('Assessment created successfully!', 'Success', 'success');
    };

    const handleSaveMarks = (e) => {
        e.preventDefault();
        setAssessments(prev => prev.map(a => a.id === markingAssessment.id ? { ...a, marks: marksForm } : a));
        setMarkingAssessment(null);
        customAlert('Marks saved successfully!', 'Success', 'success');
    };

    const getAvg = (marks) => {
        const values = Object.values(marks).filter(v => v !== null && v !== '');
        if (values.length === 0) return 0;
        return (values.reduce((sum, v) => sum + Number(v), 0) / values.length).toFixed(1);
    };

    if (markingAssessment) {
        return (
            <div className="animate-fade-in relative">
                <button className="btn btn-outline" style={{ marginBottom: 20 }} onClick={() => setMarkingAssessment(null)}><ChevronRight size={16} style={{ transform: 'rotate(180deg)' }}/> Back to Assessments</button>
                <div style={{ marginBottom: 20 }}>
                    <h3 style={{ color: 'var(--primary)' }}>Enter Marks: {markingAssessment.name}</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Class: {markingAssessment.class}-{markingAssessment.section} | Subject: {markingAssessment.subject} | Max Marks: {markingAssessment.maxMarks}</p>
                </div>
                
                <form onSubmit={handleSaveMarks}>
                    <div className="table-responsive" style={{ marginBottom: 20 }}>
                        <table className="data-table"><thead><tr><th>Roll No</th><th>Student Name</th><th>Marks Awarded (out of {markingAssessment.maxMarks})</th></tr></thead>
                            <tbody>{DUMMY_STUDENTS.map(s => (
                                <tr key={s.id}>
                                    <td>{s.roll}</td>
                                    <td className="fw-600">{s.name}</td>
                                    <td>
                                        <input type="number" className="form-input" style={{ width: 150 }} max={markingAssessment.maxMarks} min="0" value={marksForm[s.id] || ''} onChange={e => setMarksForm({ ...marksForm, [s.id]: e.target.value })} placeholder="Enter marks" />
                                    </td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button type="button" className="btn btn-outline" onClick={() => setMarkingAssessment(null)}>Cancel</button>
                        <button type="submit" className="btn btn-primary"><Save size={16}/> Save Marks</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ color: 'var(--primary)' }}>Internal Assessments</h3>
                {!showCreate && <button className="btn btn-primary" onClick={() => setShowCreate(true)}><PlusCircle size={16}/> Create Assessment</button>}
            </div>

            {showCreate && (
                <div className="acad-form-panel animate-fade-in" style={{ padding: 24, marginBottom: 20 }}>
                    <h3 style={{ marginBottom: 24, color: 'var(--primary)' }}>Create New Assessment</h3>
                    <form className="acad-form form-row-2" onSubmit={handleCreate}>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">Assessment Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Unit Test 1, Mid-Term" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                        
                        <div className="form-group"><label className="form-label">Class <span className="required">*</span></label>
                            <select className="form-select" required value={form.class} onChange={e => setForm({...form, class: e.target.value})}>
                                {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                            </select></div>
                        <div className="form-group"><label className="form-label">Section <span className="required">*</span></label>
                            <select className="form-select" required value={form.section} onChange={e => setForm({...form, section: e.target.value})}><option>A</option><option>B</option><option>C</option></select></div>
                        <div className="form-group"><label className="form-label">Subject <span className="required">*</span></label>
                            <select className="form-select" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                                <option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option><option>Computer Science</option>
                            </select></div>
                        
                        <div className="form-group"><label className="form-label">Date of Assessment <span className="required">*</span></label>
                            <input type="date" className="form-input" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
                        <div className="form-group"><label className="form-label">Maximum Marks <span className="required">*</span></label>
                            <input type="number" className="form-input" required min="1" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: e.target.value})} /></div>
                        
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                            <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Save Assessment</button>
                        </div>
                    </form>
                </div>
            )}

            {!showCreate && (
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Assessment Name</th><th>Class</th><th>Subject</th><th>Max Marks</th><th>Date</th><th>Avg Marks</th><th>Performance Trend</th><th>Actions</th></tr></thead>
                        <tbody>{assessments.length > 0 ? assessments.map(a => {
                            const avg = getAvg(a.marks);
                            const percent = a.maxMarks > 0 ? (avg / a.maxMarks) * 100 : 0;
                            return (
                                <tr key={a.id}>
                                    <td className="fw-600">{a.name}</td>
                                    <td>{a.class}-{a.section}</td>
                                    <td>{a.subject}</td>
                                    <td>{a.maxMarks}</td>
                                    <td>{new Date(a.date).toLocaleDateString()}</td>
                                    <td>{avg}</td>
                                    <td style={{ minWidth: 120 }}><div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${percent}%`, background: percent >= 75 ? 'var(--success)' : percent >= 50 ? 'var(--warning)' : 'var(--danger)' }}/></div></td>
                                    <td>
                                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem', marginRight: 8 }} onClick={() => { setMarkingAssessment(a); setMarksForm(a.marks || {}); }}>
                                            Enter Marks
                                        </button>
                                        <button className="btn-icon" title="View Analytics" onClick={() => customAlert(`Performance Analytics\n\nAssessment: ${a.name}\nClass Average: ${avg}/${a.maxMarks} (${Math.round(percent)}%)\n\nDetailed analytics will appear here.`)}><Eye size={16}/></button>
                                        <button className="btn-icon" title="Delete" onClick={() => setAssessments(prev => prev.filter(x => x.id !== a.id))} style={{ color: 'var(--danger)' }}><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No assessments found.</td></tr>
                        )}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ======================== STUDY MATERIALS ========================
// ======================== STUDY MATERIALS ========================
function StudyMaterialsTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const [materials, setMaterials] = useLocalStorage('academic_materials', [
        { id: 1, title: 'Algebra Notes Ch.1', class: 'Grade 3', subject: 'Mathematics', type: 'Notes / PDF', visibility: 'All Students', uploadedBy: 'Mrs. Sharma', date: '2026-03-15', url: null, fileName: 'algebra_notes.pdf' },
        { id: 2, title: 'Plant Biology Video', class: 'Grade 2', subject: 'Science', type: 'Video Link', visibility: 'Specific Section', uploadedBy: 'Mr. Roy', date: '2026-03-18', url: 'https://youtube.com/watch?v=123', fileName: null },
        { id: 3, title: 'English Grammar PPT', class: 'Grade 1', subject: 'English', type: 'Presentation', visibility: 'All Students', uploadedBy: 'Ms. Gupta', date: '2026-03-20', url: null, fileName: 'grammar.pptx' },
    ]);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [form, setForm] = useState({ title: '', class: '', subject: '', type: 'Notes / PDF', visibility: 'All Students', uploadedBy: 'Admin', videoUrl: '' });

    const typeBadge = (t) => t === 'Notes / PDF' ? 'badge-danger' : t === 'Video Link' ? 'badge-info' : 'badge-warning';

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        const newMaterial = {
            id: Date.now(),
            title: form.title,
            class: form.class,
            subject: form.subject,
            type: form.type,
            visibility: form.visibility,
            uploadedBy: form.uploadedBy,
            fileName: form.type === 'Video Link' ? null : (selectedFile ? selectedFile.name : '—'),
            url: form.type === 'Video Link' ? form.videoUrl : null,
            date: new Date().toISOString().split('T')[0]
        };
        setMaterials(prev => [...prev, newMaterial]);
        setForm({ title: '', class: '', subject: '', type: 'Notes / PDF', visibility: 'All Students', uploadedBy: 'Admin', videoUrl: '' });
        setSelectedFile(null);
        setIsUploading(false);
        await customAlert('Study Material uploaded successfully!', 'Success', 'success');
    };

    const handleDelete = async (id, title) => {
        if (await customConfirm(`Delete study material "${title}"?`)) {
            setMaterials(prev => prev.filter(m => m.id !== id));
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}>Study Materials</h3>
                {!isUploading && <button className="btn btn-primary" onClick={() => setIsUploading(true)}><Upload size={16}/> Upload Material</button>}
                {isUploading && <button className="btn btn-outline" onClick={() => setIsUploading(false)}>Cancel Upload</button>}
            </div>

            {isUploading && (
                <div className="acad-form-panel animate-fade-in" style={{ padding: 24, marginBottom: 20 }}>
                    <h3 style={{ marginBottom: 24, color: 'var(--primary)' }}>Upload New Material</h3>
                    <form className="acad-form form-row-2" onSubmit={handleUploadSubmit}>
                        <div className="form-group"><label className="form-label">Title <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="Enter material title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                        
                        <div className="form-group"><label className="form-label">Class <span className="required">*</span></label>
                            <select className="form-select" required value={form.class} onChange={e => setForm({...form, class: e.target.value})}>
                                <option value="">Select Class</option>
                                {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                            </select></div>
                        <div className="form-group"><label className="form-label">Subject <span className="required">*</span></label>
                            <select className="form-select" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                                <option value="">Select Subject</option>
                                <option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option><option>Social Science</option><option>Computer Science</option>
                            </select></div>
                        <div className="form-group"><label className="form-label">Visibility <span className="required">*</span></label>
                            <select className="form-select" required value={form.visibility} onChange={e => setForm({...form, visibility: e.target.value})}>
                                <option>All Students</option><option>Specific Section</option>
                            </select></div>

                        <div className="form-group"><label className="form-label">Material Type <span className="required">*</span></label>
                            <select className="form-select" required value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                <option>Notes / PDF</option><option>Presentation</option><option>Document</option><option>Image</option><option>Video Link</option>
                            </select></div>
                        
                        {form.type === 'Video Link' ? (
                            <div className="form-group"><label className="form-label">Video URL <span className="required">*</span></label>
                                <input type="url" className="form-input" required placeholder="https://youtube.com/..." value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} /></div>
                        ) : (
                            <div className="form-group">
                                <label className="form-label">Upload File <span className="required">*</span></label>
                                <div 
                                    className="upload-box" 
                                    onClick={() => document.getElementById('material-file-input').click()}
                                    style={{ 
                                        border: '2px dashed var(--border-light)', 
                                        padding: '16px', 
                                        textAlign: 'center', 
                                        borderRadius: '8px', 
                                        cursor: 'pointer', 
                                        background: 'var(--bg-light)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Upload size={20} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
                                    {selectedFile ? (
                                        <p style={{ color: 'var(--accent)', fontWeight: 600, margin: 0 }}>{selectedFile.name}</p>
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Click to select file</p>
                                    )}
                                    <input 
                                        id="material-file-input"
                                        type="file" 
                                        style={{ display: 'none' }} 
                                        required={form.type !== 'Video Link'}
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group"><label className="form-label">Uploaded By <span className="required">*</span></label>
                            <input type="text" className="form-input" required value={form.uploadedBy} onChange={e => setForm({...form, uploadedBy: e.target.value})} /></div>
                        
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                            <button type="button" className="btn btn-outline" onClick={() => setIsUploading(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Save size={16}/> Save Material</button>
                        </div>
                    </form>
                </div>
            )}

            {!isUploading && (
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Title</th><th>Class</th><th>Subject</th><th>Type</th><th>File/Link</th><th>Visibility</th><th>Uploaded By</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>{materials.length > 0 ? materials.map(m => (
                            <tr key={m.id}><td className="fw-600">{m.title}</td><td>{m.class}</td><td>{m.subject}</td>
                                <td><span className={`badge ${typeBadge(m.type)}`}>{m.type}</span></td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
                                    {m.type === 'Video Link' ? (
                                        <a href={m.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)' }}><ExternalLink size={14}/> Open Link</a>
                                    ) : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={14}/> {m.fileName || '—'}</span>
                                    )}
                                </td>
                                <td>{m.visibility}</td>
                                <td>{m.uploadedBy}</td><td>{m.date}</td>
                                <td>
                                    <button className="btn-icon" title="View" onClick={() => customAlert(`Study Material\n\nTitle: ${m.title}\nClass: ${m.class}\nSubject: ${m.subject}\nType: ${m.type}\nVisibility: ${m.visibility}\nUploaded by: ${m.uploadedBy}\nDate: ${m.date}`)}><Eye size={16}/></button>
                                    <button className="btn-icon" title="Delete" onClick={() => handleDelete(m.id, m.title)} style={{color:'var(--danger)'}}><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No study materials uploaded yet.</td></tr>
                        )}</tbody></table>
                </div>
            )}
        </div>
    );
}

// ======================== PROMOTION ========================
function PromotionTab() {
    const [students, setStudents] = useLocalStorage('academic_promotion_students', [
        { id: 1, name: 'Aarav Sharma', rollNo: '01', result: 'Pass', attendance: '92%', selected: true, status: 'Pending' },
        { id: 2, name: 'Diya Patel', rollNo: '02', result: 'Pass', attendance: '88%', selected: true, status: 'Pending' },
        { id: 3, name: 'Kavya Gupta', rollNo: '03', result: 'Fail', attendance: '65%', selected: false, status: 'Pending' },
        { id: 4, name: 'Rohan Singh', rollNo: '04', result: 'Pass', attendance: '78%', selected: true, status: 'Pending' },
        { id: 5, name: 'Ananya Verma', rollNo: '05', result: 'Borderline', attendance: '72%', selected: false, status: 'Pending' },
    ]);
    const [retentionModal, setRetentionModal] = useState({ open: false, student: null, reason: 'Failed Academically', remarks: '' });

    const toggleSelect = (id) => setStudents(prev => prev.map(s => s.id === id && s.status === 'Pending' ? { ...s, selected: !s.selected } : s));
    const toggleAll = (e) => {
        const checked = e.target.checked;
        setStudents(prev => prev.map(s => s.status === 'Pending' ? { ...s, selected: checked } : s));
    };

    const handlePromote = async () => {
        const selectedCount = students.filter(s => s.selected).length;
        if (selectedCount === 0) return customAlert('Please select at least one student to promote.', 'No Selection', 'warning');
        
        if (await customConfirm(`Are you sure you want to promote ${selectedCount} selected students to the next class?`)) {
            setStudents(prev => prev.map(s => s.selected ? { ...s, status: 'Promoted', selected: false } : s));
            await customAlert(`Successfully promoted ${selectedCount} students!`, 'Success', 'success');
        }
    };

    const openRetentionModal = (student) => {
        setRetentionModal({ open: true, student, reason: 'Failed Academically', remarks: '' });
    };

    const handleRetainSubmit = async (e) => {
        e.preventDefault();
        setStudents(prev => prev.map(s => s.id === retentionModal.student.id ? { 
            ...s, 
            status: 'Retained', 
            retentionReason: retentionModal.reason, 
            remarks: retentionModal.remarks,
            selected: false 
        } : s));
        setRetentionModal({ open: false, student: null, reason: 'Failed Academically', remarks: '' });
        await customAlert(`Student marked as retained.`, 'Success', 'success');
    };

    const pendingStudents = students.filter(s => s.status === 'Pending');
    const allSelected = pendingStudents.length > 0 && pendingStudents.every(s => s.selected);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group"><label className="form-label">Current Year</label><select className="form-select" style={{ width: 160 }}><option>2025-2026</option></select></div>
                <div className="form-group"><label className="form-label">From Class</label><select className="form-select" style={{ width: 140 }}><option>Grade 1</option><option>Grade 2</option></select></div>
                <div className="form-group"><label className="form-label">To Class</label><select className="form-select" style={{ width: 140 }}><option>Grade 2</option><option>Grade 3</option></select></div>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr>
                    <th><input type="checkbox" checked={allSelected} onChange={toggleAll} disabled={pendingStudents.length === 0} /></th>
                    <th>Roll</th><th>Student</th><th>Result</th><th>Attendance</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>{students.map(s => (
                        <tr key={s.id} style={{ background: s.status === 'Retained' ? 'var(--bg-danger)' : s.status === 'Promoted' ? 'var(--bg-success)' : 'transparent' }}>
                            <td><input type="checkbox" checked={s.selected} onChange={() => toggleSelect(s.id)} disabled={s.status !== 'Pending'}/></td>
                            <td>{s.rollNo}</td>
                            <td className="fw-600">
                                {s.name}
                                {s.status === 'Retained' && s.retentionReason && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>Reason: {s.retentionReason}</div>}
                            </td>
                            <td><span className={`badge ${s.result === 'Pass' ? 'badge-success' : s.result === 'Fail' ? 'badge-danger' : 'badge-warning'}`}>{s.result}</span></td>
                            <td>{s.attendance}</td>
                            <td>
                                {s.status === 'Pending' ? <span className="badge badge-warning">Pending</span> : 
                                 s.status === 'Promoted' ? <span className="badge badge-success">Promoted</span> : 
                                 <span className="badge badge-danger">Retained</span>}
                            </td>
                            <td>
                                {s.status === 'Pending' && (
                                    <button className="btn-icon" title="Mark as Retained" onClick={() => openRetentionModal(s)}><XCircle size={16} style={{ color: 'var(--danger)' }}/></button>
                                )}
                            </td>
                        </tr>
                    ))}</tbody></table>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={handlePromote} disabled={students.filter(s => s.selected).length === 0}>
                    <ArrowUpRight size={16}/> Promote Selected ({students.filter(s => s.selected).length})
                </button>
            </div>

            {retentionModal.open && (
                <div className="acad-modal-overlay animate-fade-in">
                    <div className="acad-modal card animate-slide-up" style={{ maxWidth: 500, width: '90%' }}>
                        <div className="modal-header">
                            <h3>Retain Student</h3>
                            <button className="btn-icon" onClick={() => setRetentionModal({ open: false, student: null, reason: 'Failed Academically', remarks: '' })}><X size={20}/></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: 20, padding: 12, background: 'var(--bg-light)', borderRadius: 8 }}>
                                <p style={{ margin: 0, fontWeight: 600 }}>{retentionModal.student?.name}</p>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Roll No: {retentionModal.student?.rollNo} | Result: {retentionModal.student?.result} | Attendance: {retentionModal.student?.attendance}</p>
                            </div>
                            <form onSubmit={handleRetainSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Retention Reason <span className="required">*</span></label>
                                    <select className="form-select" required value={retentionModal.reason} onChange={e => setRetentionModal({...retentionModal, reason: e.target.value})}>
                                        <option>Failed Academically</option>
                                        <option>Low Attendance</option>
                                        <option>Parent Request</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginTop: 16 }}>
                                    <label className="form-label">Remarks</label>
                                    <textarea className="form-input" rows="3" placeholder="Enter remarks (optional)..." value={retentionModal.remarks} onChange={e => setRetentionModal({...retentionModal, remarks: e.target.value})}></textarea>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setRetentionModal({ open: false, student: null, reason: 'Failed Academically', remarks: '' })}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}>Confirm Retention</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================== REPORTS ========================
// ======================== REPORTS ========================
function ReportsTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const reports = [
        { id: 'class-perf', name: 'Class Performance Report', desc: 'Average marks, pass/fail rates per class', formats: 'PDF, Excel' },
        { id: 'subj-analysis', name: 'Subject Analysis', desc: 'Marks distribution per subject', formats: 'PDF, Excel' },
        { id: 'teacher-perf', name: 'Teacher Performance', desc: 'Classes taught, lesson completion rate', formats: 'PDF, Excel' },
        { id: 'class-tt', name: 'Class Timetable', desc: 'Weekly schedule per class-section', formats: 'PDF, Print' },
        { id: 'teacher-tt', name: 'Teacher Timetable', desc: 'Weekly schedule per teacher', formats: 'PDF, Print' },
        { id: 'syllabus-cov', name: 'Syllabus Coverage', desc: '% of syllabus completed per subject', formats: 'PDF, Excel' },
        { id: 'lesson-plan', name: 'Lesson Plan Report', desc: 'Completed vs planned lessons', formats: 'PDF, Excel' },
        { id: 'assignment-rep', name: 'Assignment Report', desc: 'Submission rates and grade distribution', formats: 'PDF, Excel' },
        { id: 'promotion-sum', name: 'Promotion Summary', desc: 'Students promoted, retained per class', formats: 'PDF, Excel' },
    ];

    const [modal, setModal] = useState({ open: false, config: null });
    const [params, setParams] = useState({ class: 'I', section: 'A', format: 'PDF' });
    const [genProgress, setGenProgress] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    // Dummy Data for Charts
    const classPerfData = [ { name: 'Grade 1', Math: 85, Science: 90, English: 80 }, { name: 'Grade 2', Math: 78, Science: 82, English: 85 }, { name: 'Grade 3', Math: 88, Science: 86, English: 92 } ];
    const trendData = [ { month: 'Sep', Avg: 72 }, { month: 'Oct', Avg: 75 }, { month: 'Nov', Avg: 78 }, { month: 'Dec', Avg: 82 }, { month: 'Jan', Avg: 85 } ];
    const passFailData = [ { name: 'Pass', value: 85 }, { name: 'Fail', value: 10 }, { name: 'Borderline', value: 5 } ];
    const assignmentData = [ { name: 'Grade 1', Submitted: 40, Pending: 10, Late: 5 }, { name: 'Grade 2', Submitted: 35, Pending: 15, Late: 2 }, { name: 'Grade 3', Submitted: 50, Pending: 2, Late: 0 } ];
    const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

    const handleStartGenerate = (r) => {
        setModal({ open: true, config: r });
        setGenProgress(0);
        setIsGenerating(false);
    };

    const executeGeneration = () => {
        setIsGenerating(true);
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 30;
            if (p >= 100) {
                p = 100;
                setGenProgress(100);
                clearInterval(interval);
                setTimeout(async () => {
                    await customAlert(`${modal.config.name} for Class ${params.class}-${params.section} generated successfully!`, 'Report Ready');
                    setModal({ open: false, config: null });
                    setIsGenerating(false);
                }, 500);
            } else {
                setGenProgress(p);
            }
        }, 400);
    };

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}>Data Visualizations</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>
                {/* Bar Chart: Class-wise Performance */}
                <div className="card" style={{ padding: 20 }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Class-wise Subject Performance</h4>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={classPerfData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="Math" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Science" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="English" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart: Performance Trend */}
                <div className="card" style={{ padding: 20 }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Student Performance Trend</h4>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="month" fontSize={12} />
                                <YAxis fontSize={12} domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="Avg" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Pass vs Fail */}
                <div className="card" style={{ padding: 20 }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Pass vs Fail Distribution</h4>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={passFailData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {passFailData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stacked Bar: Assignment Submission */}
                <div className="card" style={{ padding: 20 }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Assignment Submissions</h4>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={assignmentData} stackOffset="expand">
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} tickFormatter={(tick) => `${tick * 100}%`} />
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="Submitted" stackId="a" fill="#10b981" />
                                <Bar dataKey="Late" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="Pending" stackId="a" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}>Academic Reports Generation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {reports.map((r, i) => (
                    <div key={i} className="card" style={{ padding: 20 }}>
                        <h4 style={{ fontSize: '0.95rem', marginBottom: 6 }}>{r.name}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: 12 }}>{r.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.formats}</span>
                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleStartGenerate(r)}><FileText size={14}/> Generate</button>
                        </div>
                    </div>
                ))}
            </div>

            {modal.open && (
                <div className="acad-modal-overlay animate-fade-in">
                    <div className="acad-modal card animate-slide-up" style={{ maxWidth: 450, width: '90%' }}>
                        <div className="modal-header" style={{ marginBottom: 20, borderBottom: '1px solid var(--border-light)', paddingBottom: 15 }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Generate {modal.config?.name}</h3>
                        </div>

                        {!isGenerating ? (
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Select Class</label>
                                    <select className="form-select" value={params.class} onChange={e => setParams({...params, class: e.target.value})}>
                                        {ALL_CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginTop: 15 }}>
                                    <label className="form-label">Select Section</label>
                                    <select className="form-select" value={params.section} onChange={e => setParams({...params, section: e.target.value})}>
                                        <option>A</option><option>B</option><option>C</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginTop: 15 }}>
                                    <label className="form-label">Download Format</label>
                                    <div style={{ display: 'flex', gap: 15, marginTop: 8 }}>
                                        {['PDF', 'Excel'].map(f => (
                                            <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                                <input type="radio" checked={params.format === f} onChange={() => setParams({...params, format: f})} style={{ accentColor: 'var(--accent)' }} />
                                                <span style={{ fontSize: '0.85rem' }}>{f}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, marginTop: 30, justifyContent: 'flex-end' }}>
                                    <button className="btn btn-outline" onClick={() => setModal({ open: false, config: null })}>Cancel</button>
                                    <button className="btn btn-primary" onClick={executeGeneration}>Generate Report</button>
                                </div>
                            </div>
                        ) : (
                            <div className="modal-body" style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ marginBottom: 20 }}>
                                    <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
                                    <p style={{ fontWeight: 600, color: 'var(--primary)' }}>Generating your report...</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Please wait while we gather the latest academic data.</p>
                                </div>
                                <div className="progress-bar" style={{ height: 10, background: 'var(--bg)', borderRadius: 5, overflow: 'hidden' }}>
                                    <div className="progress-bar-fill" style={{ width: `${genProgress}%`, background: 'var(--accent)', height: '100%', transition: 'width 0.3s ease' }}></div>
                                </div>
                                <p style={{ marginTop: 10, fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>{Math.round(genProgress)}% Complete</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================== PUBLIC CONTENT (Curriculum & Uniform) ========================
function PublicContentTab() {
    const [data, setData] = useState({
        pageTitle: '', pageSubtitle: '', heroImage: '',
        curriculumImages: [],
        levels: [],
        uniformTitle: '', uniformSubtitle: '', uniformImage: '',
        uniformGroups: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/curriculum-page');
            if (res.ok) {
                const d = await res.json();
                setData(d);
            }
        } catch (err) {
            console.error('Error fetching public content:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/curriculum-page', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                customAlert('Public content updated successfully!', 'Success', 'success');
            } else {
                const err = await res.json();
                customAlert('Error: ' + err.message, 'Update Failed', 'error');
            }
        } catch (err) {
            customAlert('Server error: ' + err.message, 'Error', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = (e, field, index = null) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            if (index !== null && Array.isArray(data[field])) {
                const newArr = [...data[field]];
                newArr[index] = base64String;
                setData({ ...data, [field]: newArr });
            } else {
                setData({ ...data, [field]: base64String });
            }
        };
        reader.readAsDataURL(file);
    };

    const updateLevel = (idx, field, value) => {
        const newLevels = [...data.levels];
        newLevels[idx] = { ...newLevels[idx], [field]: value };
        setData({ ...data, levels: newLevels });
    };

    const addLevel = () => {
        setData({
            ...data,
            levels: [...data.levels, { number: data.levels.length + 1, title: '', subtitle: '', subjects: [], streams: [] }]
        });
    };

    const removeLevel = (idx) => {
        setData({ ...data, levels: data.levels.filter((_, i) => i !== idx) });
    };

    const updateUniformGroup = (idx, field, value) => {
        const newGroups = [...data.uniformGroups];
        newGroups[idx] = { ...newGroups[idx], [field]: value };
        setData({ ...data, uniformGroups: newGroups });
    };

    if (loading) return <div className="spinner" style={{ margin: '40px auto' }}></div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 16 }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}><Eye size={20}/> Manage Public Page Content</h3>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : <><Save size={16}/> Save All Changes</>}
                </button>
            </div>

            <div className="acad-two-col">
                <div className="acad-form-panel" style={{ flex: 1.2 }}>
                    <h4><BookMarked size={18}/> Curriculum Section</h4>
                    <div className="acad-form">
                        <div className="form-group">
                            <label className="form-label">Page Title</label>
                            <input type="text" className="form-input" value={data.pageTitle} onChange={e => setData({ ...data, pageTitle: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Page Subtitle</label>
                            <textarea className="form-input" rows="2" value={data.pageSubtitle} onChange={e => setData({ ...data, pageSubtitle: e.target.value })} />
                        </div>

                        <h5 style={{ marginTop: 24, marginBottom: 12 }}>Curriculum Grid Images (4 Images)</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="form-group">
                                    <label className="form-label">Image {i + 1}</label>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 4, background: '#eee', overflow: 'hidden' }}>
                                            {data.curriculumImages?.[i] && <img src={data.curriculumImages[i]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                        <input type="file" className="form-input" onChange={e => handleFileUpload(e, 'curriculumImages', i)} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h5 style={{ marginTop: 24, marginBottom: 12 }}>Curriculum Levels</h5>
                        {data.levels.map((level, idx) => (
                            <div key={idx} style={{ background: 'var(--bg-light)', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <strong>Level {idx + 1}</strong>
                                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => removeLevel(idx)}><Trash2 size={14}/></button>
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group"><label className="form-label">Title</label><input type="text" className="form-input" value={level.title} onChange={e => updateLevel(idx, 'title', e.target.value)} /></div>
                                    <div className="form-group"><label className="form-label">Subtitle</label><input type="text" className="form-input" value={level.subtitle} onChange={e => updateLevel(idx, 'subtitle', e.target.value)} /></div>
                                </div>
                                <div className="form-group" style={{ marginTop: 10 }}>
                                    <label className="form-label">Subjects (comma separated)</label>
                                    <input type="text" className="form-input" value={level.subjects?.join(', ')} onChange={e => updateLevel(idx, 'subjects', e.target.value.split(',').map(s => s.trim()))} />
                                </div>
                            </div>
                        ))}
                        <button className="btn btn-outline" style={{ width: '100%' }} onClick={addLevel}><PlusCircle size={16}/> Add New Level</button>
                    </div>
                </div>

                <div className="acad-form-panel">
                    <h4><GraduationCap size={18}/> School Uniform Section</h4>
                    <div className="acad-form">
                        <div className="form-group">
                            <label className="form-label">Uniform Title</label>
                            <input type="text" className="form-input" value={data.uniformTitle} onChange={e => setData({ ...data, uniformTitle: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Uniform Subtitle</label>
                            <input type="text" className="form-input" value={data.uniformSubtitle} onChange={e => setData({ ...data, uniformSubtitle: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Uniform Image</label>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ width: 100, height: 100, borderRadius: 8, background: '#eee', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                                    {data.uniformImage && <img src={data.uniformImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input type="file" className="form-input" onChange={e => handleFileUpload(e, 'uniformImage')} />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Recommended: High quality PNG with students.</p>
                                </div>
                            </div>
                        </div>

                        <h5 style={{ marginTop: 24, marginBottom: 12 }}>Uniform Details (Groups)</h5>
                        {data.uniformGroups.map((group, idx) => (
                            <div key={idx} style={{ padding: 12, border: '1px solid var(--border-light)', borderRadius: 8, marginBottom: 12 }}>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <input type="text" className="form-input" style={{ fontWeight: 600 }} placeholder="Group Title (e.g. For Boys)" value={group.title} onChange={e => updateUniformGroup(idx, 'title', e.target.value)} />
                                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setData({ ...data, uniformGroups: data.uniformGroups.filter((_, i) => i !== idx) })}><Trash2 size={14}/></button>
                                </div>
                                <textarea className="form-input" rows="3" placeholder="Description..." value={group.description} onChange={e => updateUniformGroup(idx, 'description', e.target.value)} />
                            </div>
                        ))}
                        <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setData({ ...data, uniformGroups: [...data.uniformGroups, { title: '', description: '' }] })}><PlusCircle size={16}/> Add Uniform Group</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ======================== SETTINGS ========================
function SettingsTab() {
    const [config, setConfig] = useLocalStorage('academic_settings', {
        gradingScale: 'A+, A, B+, B, C, D, F',
        passingMarks: 35,
        attendanceThreshold: 75,
        periodDuration: 45,
        workingDays: 'Mon–Sat',
        timetableLock: 'Unlocked',
        latePolicy: 'Accept',
        promoSuggest: 'Enabled'
    });

    const handleSave = async (e) => {
        e.preventDefault();
        await customAlert('Module Configuration saved successfully!', 'Success', 'success');
    };

    const rbac = [
        ['Academic Year Setup', 'Yes', 'Yes', 'No', 'No'], ['Class & Section Mgmt', 'Yes', 'Yes', 'No', 'No'],
        ['Subject Management', 'Yes', 'Yes', 'No', 'No'], ['Teacher Assignment', 'Yes', 'Yes', 'No', 'No'],
        ['Create Timetable', 'Yes', 'Yes', 'No', 'View only'], ['Manage Syllabus', 'Yes', 'Yes', 'Own subjects', 'View only'],
        ['Create Lesson Plans', 'Yes', 'Yes', 'Own subjects', 'No'], ['Create Assignments', 'Yes', 'Yes', 'Own subjects', 'Submit only'],
        ['Mark Attendance', 'Yes', 'Yes', 'Own class', 'No'], ['Enter Assess. Marks', 'Yes', 'Yes', 'Own subjects', 'No'],
        ['Upload Study Materials', 'Yes', 'Yes', 'Own subjects', 'Download only'], ['Manage Promotions', 'Yes', 'Yes', 'No', 'No'],
        ['View Reports', 'Yes', 'Yes', 'Limited', 'Own data'], ['Module Settings', 'Yes', 'Yes', 'No', 'No'],
    ];

    return (
        <div className="animate-fade-in acad-settings-grid">
            <div className="acad-settings-panel">
                <h3><Settings size={18}/> Module Configuration</h3>
                <form className="acad-form" onSubmit={handleSave}>
                    <div className="form-group" style={{ marginBottom: 12 }}>
                        <label className="form-label">Grading Scale (comma separated)</label>
                        <input type="text" className="form-input" value={config.gradingScale} onChange={e => setConfig({...config, gradingScale: e.target.value})} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
                        <div className="form-group"><label className="form-label">Passing Marks (%)</label><input type="number" className="form-input" value={config.passingMarks} onChange={e => setConfig({...config, passingMarks: e.target.value})} min="0" max="100" required /></div>
                        <div className="form-group"><label className="form-label">Attendance Threshold (%)</label><input type="number" className="form-input" value={config.attendanceThreshold} onChange={e => setConfig({...config, attendanceThreshold: e.target.value})} min="0" max="100" required /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
                        <div className="form-group"><label className="form-label">Period Duration (minutes)</label><input type="number" className="form-input" value={config.periodDuration} onChange={e => setConfig({...config, periodDuration: e.target.value})} min="1" required /></div>
                        <div className="form-group"><label className="form-label">Working Days</label><select className="form-select" value={config.workingDays} onChange={e => setConfig({...config, workingDays: e.target.value})}><option>Mon–Fri</option><option>Mon–Sat</option></select></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                        <div className="form-group"><label className="form-label">Timetable Edit Lock</label><select className="form-select" value={config.timetableLock} onChange={e => setConfig({...config, timetableLock: e.target.value})}><option>Unlocked</option><option>Locked</option></select></div>
                        <div className="form-group"><label className="form-label">Assignment Late Policy</label><select className="form-select" value={config.latePolicy} onChange={e => setConfig({...config, latePolicy: e.target.value})}><option>Accept</option><option>Reject</option></select></div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 24 }}>
                        <label className="form-label">Promotion Auto-suggest</label>
                        <select className="form-select" value={config.promoSuggest} onChange={e => setConfig({...config, promoSuggest: e.target.value})}><option>Enabled</option><option>Disabled</option></select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}><Save size={16}/> Save Settings</button>
                </form>
            </div>
            <div className="acad-settings-panel">
                <h3><Users size={18}/> Role-Based Access Matrix</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table className="acad-rbac-table" style={{ minWidth: 600 }}><thead><tr><th>Feature</th><th>Super Admin</th><th>Admin</th><th>Teacher</th><th>Student</th></tr></thead>
                        <tbody>{rbac.map((r, i) => (
                            <tr key={i}>{r.map((c, j) => <td key={j} style={j > 0 ? { color: c === 'Yes' || c.startsWith('Own') ? 'var(--success)' : c === 'No' ? 'var(--danger)' : 'var(--warning)', fontWeight: 600, fontSize: '0.8rem' } : { fontSize: '0.85rem' }}>{c}</td>)}</tr>
                        ))}</tbody></table>
                </div>
            </div>
            
            <div className="acad-settings-panel" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}><ClipboardCheck size={18}/> Audit Trail / Recent Activity</h3>
                    <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>Export Logs</button>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: 8 }}>
                    <table className="data-table" style={{ margin: 0 }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 1 }}><tr><th>Timestamp</th><th>User Role</th><th>Action Performed</th><th>Target</th><th>IP Address</th></tr></thead>
                        <tbody>
                            <tr><td>Today, 10:45 AM</td><td>Super Admin</td><td style={{ color: 'var(--primary)' }}>Modified Timetable</td><td>Grade 3-A</td><td>192.168.1.105</td></tr>
                            <tr><td>Today, 09:30 AM</td><td>Teacher</td><td style={{ color: 'var(--success)' }}>Entered Assessment Marks</td><td>Grade 2-B (Science)</td><td>192.168.1.112</td></tr>
                            <tr><td>Yesterday, 14:15 PM</td><td>Admin</td><td style={{ color: 'var(--warning)' }}>Retained Student</td><td>Kavya Gupta (Grade 1)</td><td>192.168.1.101</td></tr>
                            <tr><td>Yesterday, 11:00 AM</td><td>Teacher</td><td style={{ color: 'var(--primary)' }}>Uploaded Study Material</td><td>Math Notes (Grade 3)</td><td>192.168.1.112</td></tr>
                            <tr><td>Yesterday, 08:45 AM</td><td>Super Admin</td><td style={{ color: 'var(--danger)' }}>Changed System Settings</td><td>Passing Marks Threshold</td><td>192.168.1.105</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ======================== MAIN COMPONENT ========================
const TABS = [
    { id: 'year', label: 'Academic Year', icon: Calendar },
    { id: 'classes', label: 'Classes', icon: Layers },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'teachers', label: 'Teachers', icon: UserCheck },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'syllabus', label: 'Syllabus', icon: BookMarked },
    { id: 'lesson-plan', label: 'Lesson Plan', icon: PencilLine },
    { id: 'assignments', label: 'Assignments', icon: ClipboardCheck },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'materials', label: 'Materials', icon: FolderOpen },
    { id: 'promotion', label: 'Promotion', icon: ArrowUpRight },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'public-content', label: 'Public Content', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Academics() {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentRole, setCurrentRole] = useLocalStorage('academic_current_role', 'Super Admin');
    
    // Filter tabs based on role
    const visibleTabs = TABS.filter(t => {
        if (currentRole === 'Super Admin' || currentRole === 'Admin') return true;
        if (currentRole === 'Teacher') {
            const hidden = ['year', 'classes', 'subjects', 'teachers', 'promotion', 'settings', 'public-content'];
            return !hidden.includes(t.id);
        }
        if (currentRole === 'Student') {
            const hidden = ['year', 'classes', 'subjects', 'teachers', 'lesson-plan', 'attendance', 'performance', 'promotion', 'settings', 'public-content', 'reports'];
            return !hidden.includes(t.id);
        }
        return true;
    });

    const currentTab = location.pathname.split('/').pop();
    const activeTab = visibleTabs.some(t => t.id === currentTab) ? currentTab : visibleTabs[0]?.id;

    const handleNavigate = (tab) => { navigate(`/academics/${tab}`); };

    return (
        <div className="academics-page animate-fade-in">
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div className="page-breadcrumb"><Link to="/">Dashboard</Link><span className="separator">/</span><span>Academics</span>
                            {activeTab && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{TABS.find(t => t.id === activeTab)?.label}</span></>}</div>
                        <h1>Academics Management</h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-light)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                        <Users size={16} style={{ color: 'var(--text-light)' }}/>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>View As:</span>
                        <select className="form-select" style={{ width: 'auto', padding: '4px 24px 4px 10px', minHeight: 30, fontSize: '0.85rem' }} value={currentRole} onChange={e => {
                            setCurrentRole(e.target.value);
                            navigate('/academics/timetable'); // safe tab redirect
                        }}>
                            <option>Super Admin</option>
                            <option>Teacher</option>
                            <option>Student</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="card academics-card">
                <div className="tabs-header">{visibleTabs.map(tab => { const Icon = tab.icon; return <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>; })}</div>
                <div className="tabs-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="timetable" replace />} />
                        <Route path="year" element={<AcademicYearTab />} />
                        <Route path="classes" element={<ClassSectionTab />} />
                        <Route path="subjects" element={<SubjectsTab />} />
                        <Route path="teachers" element={<TeacherAssignmentTab />} />
                        <Route path="timetable" element={<TimetableTab />} />
                        <Route path="syllabus" element={<SyllabusTab />} />
                        <Route path="lesson-plan" element={<LessonPlanTab />} />
                        <Route path="assignments" element={<AssignmentsTab />} />
                        <Route path="attendance" element={<AttendanceTab />} />
                        <Route path="performance" element={<PerformanceTab />} />
                        <Route path="materials" element={<StudyMaterialsTab />} />
                        <Route path="promotion" element={<PromotionTab />} />
                        <Route path="reports" element={<ReportsTab />} />
                        <Route path="public-content" element={<div style={{padding: 24, textAlign: 'center'}}>Public Content View</div>} />
                        <Route path="settings" element={<SettingsTab />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
