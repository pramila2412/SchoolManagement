import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Calendar, BookOpen, Users, Clock, FileText, ClipboardCheck,
    PlusCircle, Save, Trash2, Edit3, ChevronDown, ChevronRight,
    GraduationCap, Layers, BookMarked, PencilLine, Upload,
    BarChart3, Settings, ArrowUpRight, CheckCircle2, XCircle,
    Award, Eye, Send, UserCheck, CalendarCheck, FolderOpen
} from 'lucide-react';
import './Academics.css';

// ======================== ACADEMIC YEAR ========================
function AcademicYearTab() {
    const [years, setYears] = useState([
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
    const [classes, setClasses] = useState([
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
    const [subjects, setSubjects] = useState([
        { id: 1, name: 'Mathematics', code: 'MATH-01', type: 'Theory', classes: ['Grade 1', 'Grade 2', 'Grade 3'] },
        { id: 2, name: 'Science', code: 'SCI-01', type: 'Both', classes: ['Grade 2', 'Grade 3'] },
        { id: 3, name: 'English', code: 'ENG-01', type: 'Theory', classes: ['Grade 1', 'Grade 2', 'Grade 3'] },
        { id: 4, name: 'Hindi', code: 'HIN-01', type: 'Theory', classes: ['Grade 1', 'Grade 2'] },
        { id: 5, name: 'Computer Science', code: 'CS-01', type: 'Practical', classes: ['Grade 3'] },
    ]);
    const [form, setForm] = useState({ name: '', code: '', type: 'Theory', classes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubjects(prev => [...prev, { ...form, id: Date.now(), classes: form.classes.split(',').map(c => c.trim()) }]);
        setForm({ name: '', code: '', type: 'Theory', classes: '' });
    };

    return (
        <div className="animate-fade-in">
            <div className="acad-two-col">
                <div className="acad-form-panel">
                    <h3><BookOpen size={18}/> Add Subject</h3>
                    <form className="acad-form" onSubmit={handleSubmit}>
                        <div className="form-group"><label className="form-label">Subject Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Mathematics" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="acad-form form-row">
                            <div className="form-group"><label className="form-label">Subject Code</label>
                                <input type="text" className="form-input" placeholder="e.g. MATH-01" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Subject Type</label>
                                <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Theory</option><option>Practical</option><option>Both</option></select></div>
                        </div>
                        <div className="form-group"><label className="form-label">Assign to Classes (comma-separated)</label>
                            <input type="text" className="form-input" placeholder="e.g. Grade 1, Grade 2" value={form.classes} onChange={e => setForm({ ...form, classes: e.target.value })} /></div>
                        <div className="acad-form form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Save Subject</button></div>
                    </form>
                </div>
                <div className="acad-table-panel">
                    <table className="data-table"><thead><tr><th>Subject</th><th>Code</th><th>Type</th><th>Classes</th><th>Actions</th></tr></thead>
                        <tbody>{subjects.map(s => (
                            <tr key={s.id}><td className="fw-600">{s.name}</td><td>{s.code}</td>
                                <td><span className={`badge ${s.type === 'Theory' ? 'badge-info' : s.type === 'Practical' ? 'badge-warning' : 'badge-success'}`}>{s.type}</span></td>
                                <td>{s.classes.join(', ')}</td>
                                <td><button className="btn-icon"><Edit3 size={16}/></button><button className="btn-icon" onClick={() => setSubjects(prev => prev.filter(x => x.id !== s.id))}><Trash2 size={16}/></button></td></tr>
                        ))}</tbody></table>
                </div>
            </div>
        </div>
    );
}

// ======================== TEACHER ASSIGNMENT ========================
function TeacherAssignmentTab() {
    const [assignments, setAssignments] = useState([
        { id: 1, class: 'Grade 1', section: 'A', subject: 'Mathematics', teacher: 'Mrs. Sharma', type: 'Subject Teacher' },
        { id: 2, class: 'Grade 1', section: 'A', subject: 'English', teacher: 'Ms. Gupta', type: 'Subject Teacher' },
        { id: 3, class: 'Grade 2', section: 'A', subject: 'Science', teacher: 'Mr. Roy', type: 'Subject Teacher' },
        { id: 4, class: 'Grade 1', section: 'A', subject: '—', teacher: 'Mrs. Sharma', type: 'Class Teacher' },
    ]);
    const [form, setForm] = useState({ class: '', section: '', subject: '', teacher: '', type: 'Subject Teacher' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setAssignments(prev => [...prev, { ...form, id: Date.now() }]);
        setForm({ class: '', section: '', subject: '', teacher: '', type: 'Subject Teacher' });
    };

    return (
        <div className="animate-fade-in">
            <div className="acad-two-col">
                <div className="acad-form-panel">
                    <h3><UserCheck size={18}/> Assign Teacher</h3>
                    <form className="acad-form" onSubmit={handleSubmit}>
                        <div className="acad-form form-row">
                            <div className="form-group"><label className="form-label">Class <span className="required">*</span></label>
                                <select className="form-select" required value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}><option value="">Select</option><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option></select></div>
                            <div className="form-group"><label className="form-label">Section <span className="required">*</span></label>
                                <select className="form-select" required value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}><option value="">Select</option><option>A</option><option>B</option><option>C</option></select></div>
                        </div>
                        <div className="form-group"><label className="form-label">Assignment Type</label>
                            <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Subject Teacher</option><option>Class Teacher</option></select></div>
                        {form.type === 'Subject Teacher' && <div className="form-group"><label className="form-label">Subject</label>
                            <select className="form-select" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}><option value="">Select</option><option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option><option>Computer Science</option></select></div>}
                        <div className="form-group"><label className="form-label">Teacher <span className="required">*</span></label>
                            <select className="form-select" required value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })}><option value="">Select</option><option>Mrs. Sharma</option><option>Mr. Patel</option><option>Ms. Gupta</option><option>Mr. Roy</option><option>Mrs. Verma</option><option>Mr. Singh</option></select></div>
                        <div className="acad-form form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Save Assignment</button></div>
                    </form>
                </div>
                <div className="acad-table-panel">
                    <table className="data-table"><thead><tr><th>Class</th><th>Section</th><th>Subject</th><th>Teacher</th><th>Type</th><th>Actions</th></tr></thead>
                        <tbody>{assignments.map(a => (
                            <tr key={a.id}><td className="fw-600">{a.class}</td><td>{a.section}</td><td>{a.subject}</td><td>{a.teacher}</td>
                                <td><span className={`badge ${a.type === 'Class Teacher' ? 'badge-success' : 'badge-info'}`}>{a.type}</span></td>
                                <td><button className="btn-icon" onClick={() => setAssignments(prev => prev.filter(x => x.id !== a.id))}><Trash2 size={16}/></button></td></tr>
                        ))}</tbody></table>
                </div>
            </div>
        </div>
    );
}

// ======================== TIMETABLE ========================
function TimetableTab() {
    const [sel, setSel] = useState({ class: 'Grade 1', section: 'A' });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [schedule, setSchedule] = useState([
        { period: 1, time: '08:30-09:15', Monday: 'Math', Tuesday: 'English', Wednesday: 'Science', Thursday: 'Hindi', Friday: 'Math', Saturday: 'Games' },
        { period: 2, time: '09:15-10:00', Monday: 'English', Tuesday: 'Math', Wednesday: 'Hindi', Thursday: 'Science', Friday: 'English', Saturday: 'Art' },
        { period: 3, time: '10:15-11:00', Monday: 'Science', Tuesday: 'Hindi', Wednesday: 'Math', Thursday: 'English', Friday: 'Computer', Saturday: 'Library' },
        { period: 4, time: '11:00-11:45', Monday: 'Hindi', Tuesday: 'Science', Wednesday: 'English', Thursday: 'Math', Friday: 'Games', Saturday: 'Math' },
        { period: 5, time: '12:00-12:45', Monday: 'SST', Tuesday: 'Computer', Wednesday: 'SST', Thursday: 'Art', Friday: 'Hindi', Saturday: '—' },
    ]);
    const [status, setStatus] = useState('Draft');

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group"><label className="form-label">Class</label>
                    <select className="form-select" style={{ width: 140 }} value={sel.class} onChange={e => setSel({ ...sel, class: e.target.value })}><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option></select></div>
                <div className="form-group"><label className="form-label">Section</label>
                    <select className="form-select" style={{ width: 100 }} value={sel.section} onChange={e => setSel({ ...sel, section: e.target.value })}><option>A</option><option>B</option><option>C</option></select></div>
                <span className={`badge ${status === 'Published' ? 'badge-success' : 'badge-draft'}`} style={{ marginBottom: 8 }}>{status}</span>
                {status === 'Draft' && <button className="btn btn-primary" style={{ marginBottom: 4 }} onClick={() => setStatus('Published')}><Send size={16}/> Publish</button>}
            </div>
            <div className="timetable-grid-wrapper">
                <table className="data-table">
                    <thead><tr><th>Period</th><th>Time</th>{days.map(d => <th key={d}>{d}</th>)}</tr></thead>
                    <tbody>{schedule.map(row => (
                        <tr key={row.period}><td className="fw-600">Period {row.period}</td><td style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{row.time}</td>
                            {days.map(d => <td key={d}><div className="subject-box" style={{ background: 'var(--accent-light)', padding: '4px 8px', borderRadius: 4, textAlign: 'center', fontSize: '0.85rem', fontWeight: 500 }}>{row[d]}</div></td>)}</tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
}

// ======================== SYLLABUS ========================
function SyllabusTab() {
    const [expandedCh, setExpandedCh] = useState([1]);
    const [syllabus] = useState([
        { id: 1, chapter: 1, title: 'Algebra', hours: 8, topics: ['Linear Equations', 'Quadratic Formula', 'Polynomials'] },
        { id: 2, chapter: 2, title: 'Geometry', hours: 10, topics: ['Triangles', 'Circles', 'Coordinate Geometry'] },
        { id: 3, chapter: 3, title: 'Trigonometry', hours: 6, topics: ['Sine & Cosine', 'Tan & Identities'] },
    ]);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                <div className="form-group"><label className="form-label">Class</label><select className="form-select" style={{ width: 140 }}><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option></select></div>
                <div className="form-group"><label className="form-label">Subject</label><select className="form-select" style={{ width: 160 }}><option>Mathematics</option><option>Science</option><option>English</option></select></div>
                <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }}><PlusCircle size={16}/> Add Chapter</button>
            </div>
            <div className="syllabus-tree">
                {syllabus.map(ch => (
                    <div className="syllabus-chapter" key={ch.id}>
                        <div className="syllabus-chapter-header" onClick={() => setExpandedCh(prev => prev.includes(ch.id) ? prev.filter(x => x !== ch.id) : [...prev, ch.id])}>
                            {expandedCh.includes(ch.id) ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                            <span>Chapter {ch.chapter}: {ch.title}</span>
                            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ch.hours} hrs</span>
                        </div>
                        {expandedCh.includes(ch.id) && ch.topics.map((t, i) => (
                            <div className="syllabus-topic" key={i}><BookMarked size={14}/> {t}</div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ======================== LESSON PLAN ========================
function LessonPlanTab() {
    const [plans] = useState([
        { id: 1, title: 'Introduction to Linear Equations', chapter: 'Algebra', topic: 'Linear Equations', method: 'Lecture', date: '2026-03-20', status: 'Completed' },
        { id: 2, title: 'Solving Quadratic Equations', chapter: 'Algebra', topic: 'Quadratic Formula', method: 'Activity', date: '2026-03-22', status: 'Planned' },
        { id: 3, title: 'Properties of Triangles', chapter: 'Geometry', topic: 'Triangles', method: 'Discussion', date: '2026-03-25', status: 'Pending' },
        { id: 4, title: 'Circle Theorems', chapter: 'Geometry', topic: 'Circles', method: 'Demo', date: '2026-03-18', status: 'Rescheduled' },
    ]);
    const statusBadge = (s) => s === 'Completed' ? 'badge-success' : s === 'Planned' ? 'badge-info' : s === 'Pending' ? 'badge-warning' : 'badge-draft';

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <select className="form-select" style={{ width: 140 }}><option>Grade 1</option><option>Grade 2</option></select>
                    <select className="form-select" style={{ width: 160 }}><option>Mathematics</option><option>Science</option></select>
                </div>
                <button className="btn btn-primary"><PlusCircle size={16}/> Create Lesson Plan</button>
            </div>
            <div className="lesson-plan-grid">
                {plans.map(p => (
                    <div className="lesson-plan-card" key={p.id}>
                        <h4>{p.title}</h4>
                        <div className="lp-meta">
                            <span><BookMarked size={14}/> {p.chapter}</span>
                            <span><Calendar size={14}/> {p.date}</span>
                            <span><GraduationCap size={14}/> {p.method}</span>
                        </div>
                        <span className={`badge ${statusBadge(p.status)}`}>{p.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ======================== ASSIGNMENTS ========================
function AssignmentsTab() {
    const [assignments] = useState([
        { id: 1, title: 'Algebra Practice Set 1', class: 'Grade 3-A', subject: 'Mathematics', dueDate: '2026-03-28', status: 'Published', submissions: 28, total: 35 },
        { id: 2, title: 'Essay on Environment', class: 'Grade 2-A', subject: 'English', dueDate: '2026-03-30', status: 'Draft', submissions: 0, total: 32 },
        { id: 3, title: 'Plant Cell Diagram', class: 'Grade 3-B', subject: 'Science', dueDate: '2026-03-26', status: 'Graded', submissions: 34, total: 34 },
    ]);
    const statusBadge = (s) => s === 'Published' ? 'badge-info' : s === 'Draft' ? 'badge-draft' : s === 'Graded' ? 'badge-success' : 'badge-warning';

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}>Assignments & Homework</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Create Assignment</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Title</th><th>Class</th><th>Subject</th><th>Due Date</th><th>Submissions</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{assignments.map(a => (
                        <tr key={a.id}><td className="fw-600">{a.title}</td><td>{a.class}</td><td>{a.subject}</td><td>{a.dueDate}</td>
                            <td>{a.submissions}/{a.total}</td>
                            <td><span className={`badge ${statusBadge(a.status)}`}>{a.status}</span></td>
                            <td><button className="btn-icon"><Eye size={16}/></button><button className="btn-icon"><Edit3 size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== ATTENDANCE ========================
function AttendanceTab() {
    const [students, setStudents] = useState([
        { id: 1, name: 'Aarav Sharma', rollNo: '01', status: 'P' }, { id: 2, name: 'Diya Patel', rollNo: '02', status: 'P' },
        { id: 3, name: 'Kavya Gupta', rollNo: '03', status: 'A' }, { id: 4, name: 'Rohan Singh', rollNo: '04', status: 'P' },
        { id: 5, name: 'Ananya Verma', rollNo: '05', status: 'L' }, { id: 6, name: 'Ishaan Roy', rollNo: '06', status: 'P' },
    ]);
    const markAll = (status) => setStudents(prev => prev.map(s => ({ ...s, status })));
    const toggle = (id, status) => setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    const counts = { P: students.filter(s => s.status === 'P').length, A: students.filter(s => s.status === 'A').length, L: students.filter(s => s.status === 'L').length };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group"><label className="form-label">Class</label><select className="form-select" style={{ width: 140 }}><option>Grade 1</option><option>Grade 2</option></select></div>
                <div className="form-group"><label className="form-label">Section</label><select className="form-select" style={{ width: 100 }}><option>A</option><option>B</option></select></div>
                <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" style={{ width: 160 }} defaultValue={new Date().toISOString().split('T')[0]} /></div>
                <button className="btn btn-outline" onClick={() => markAll('P')}>Mark All Present</button>
            </div>
            <div className="acad-stats-row" style={{ marginBottom: 16 }}>
                <div className="acad-stat-card"><div className="acad-stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={24} style={{ color: 'var(--success)' }}/></div><div className="acad-stat-info"><h4>{counts.P}</h4><p>Present</p></div></div>
                <div className="acad-stat-card"><div className="acad-stat-icon" style={{ background: 'var(--danger-light)' }}><XCircle size={24} style={{ color: 'var(--danger)' }}/></div><div className="acad-stat-info"><h4>{counts.A}</h4><p>Absent</p></div></div>
                <div className="acad-stat-card"><div className="acad-stat-icon" style={{ background: 'var(--warning-light)' }}><Calendar size={24} style={{ color: 'var(--warning)' }}/></div><div className="acad-stat-info"><h4>{counts.L}</h4><p>Leave</p></div></div>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Roll</th><th>Student</th><th>Present</th><th>Absent</th><th>Leave</th></tr></thead>
                    <tbody>{students.map(s => (
                        <tr key={s.id}><td>{s.rollNo}</td><td className="fw-600">{s.name}</td>
                            {['P', 'A', 'L'].map(st => <td key={st}><input type="radio" name={`att-${s.id}`} checked={s.status === st} onChange={() => toggle(s.id, st)} style={{ accentColor: st === 'P' ? 'var(--success)' : st === 'A' ? 'var(--danger)' : 'var(--warning)' }}/></td>)}
                        </tr>
                    ))}</tbody></table>
            </div>
            <div style={{ marginTop: 16 }}><button className="btn btn-primary"><Save size={16}/> Save Attendance</button></div>
        </div>
    );
}

// ======================== PERFORMANCE ========================
function PerformanceTab() {
    const [assessments] = useState([
        { id: 1, name: 'Unit Test 1', class: 'Grade 3-A', subject: 'Mathematics', maxMarks: 50, date: '2026-02-15', avgMarks: 38 },
        { id: 2, name: 'Mid-Term Class Test', class: 'Grade 3-A', subject: 'Science', maxMarks: 100, date: '2026-03-01', avgMarks: 72 },
        { id: 3, name: 'Unit Test 2', class: 'Grade 2-A', subject: 'English', maxMarks: 50, date: '2026-03-10', avgMarks: 41 },
    ]);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}>Internal Assessments</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Create Assessment</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Assessment</th><th>Class</th><th>Subject</th><th>Max Marks</th><th>Date</th><th>Avg Marks</th><th>Performance</th><th>Actions</th></tr></thead>
                    <tbody>{assessments.map(a => (
                        <tr key={a.id}><td className="fw-600">{a.name}</td><td>{a.class}</td><td>{a.subject}</td><td>{a.maxMarks}</td><td>{a.date}</td><td>{a.avgMarks}</td>
                            <td style={{ minWidth: 120 }}><div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${(a.avgMarks / a.maxMarks) * 100}%` }}/></div></td>
                            <td><button className="btn-icon"><ClipboardCheck size={16}/></button><button className="btn-icon"><Eye size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== STUDY MATERIALS ========================
function StudyMaterialsTab() {
    const [materials] = useState([
        { id: 1, title: 'Algebra Notes Ch.1', class: 'Grade 3', subject: 'Mathematics', type: 'PDF', uploadedBy: 'Mrs. Sharma', date: '2026-03-15' },
        { id: 2, title: 'Plant Biology Video', class: 'Grade 2', subject: 'Science', type: 'Video Link', uploadedBy: 'Mr. Roy', date: '2026-03-18' },
        { id: 3, title: 'English Grammar PPT', class: 'Grade 1', subject: 'English', type: 'Presentation', uploadedBy: 'Ms. Gupta', date: '2026-03-20' },
    ]);
    const typeBadge = (t) => t === 'PDF' ? 'badge-danger' : t === 'Video Link' ? 'badge-info' : 'badge-warning';

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}>Study Materials</h3>
                <button className="btn btn-primary"><Upload size={16}/> Upload Material</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Title</th><th>Class</th><th>Subject</th><th>Type</th><th>Uploaded By</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>{materials.map(m => (
                        <tr key={m.id}><td className="fw-600">{m.title}</td><td>{m.class}</td><td>{m.subject}</td>
                            <td><span className={`badge ${typeBadge(m.type)}`}>{m.type}</span></td>
                            <td>{m.uploadedBy}</td><td>{m.date}</td>
                            <td><button className="btn-icon"><Eye size={16}/></button><button className="btn-icon"><Trash2 size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== PROMOTION ========================
function PromotionTab() {
    const [students, setStudents] = useState([
        { id: 1, name: 'Aarav Sharma', rollNo: '01', result: 'Pass', attendance: '92%', selected: true },
        { id: 2, name: 'Diya Patel', rollNo: '02', result: 'Pass', attendance: '88%', selected: true },
        { id: 3, name: 'Kavya Gupta', rollNo: '03', result: 'Fail', attendance: '65%', selected: false },
        { id: 4, name: 'Rohan Singh', rollNo: '04', result: 'Pass', attendance: '78%', selected: true },
        { id: 5, name: 'Ananya Verma', rollNo: '05', result: 'Borderline', attendance: '72%', selected: false },
    ]);
    const toggleSelect = (id) => setStudents(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group"><label className="form-label">Current Year</label><select className="form-select" style={{ width: 160 }}><option>2025-2026</option></select></div>
                <div className="form-group"><label className="form-label">From Class</label><select className="form-select" style={{ width: 140 }}><option>Grade 1</option><option>Grade 2</option></select></div>
                <div className="form-group"><label className="form-label">To Class</label><select className="form-select" style={{ width: 140 }}><option>Grade 2</option><option>Grade 3</option></select></div>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th><input type="checkbox"/></th><th>Roll</th><th>Student</th><th>Result</th><th>Attendance</th><th>Action</th></tr></thead>
                    <tbody>{students.map(s => (
                        <tr key={s.id}><td><input type="checkbox" checked={s.selected} onChange={() => toggleSelect(s.id)}/></td><td>{s.rollNo}</td><td className="fw-600">{s.name}</td>
                            <td><span className={`badge ${s.result === 'Pass' ? 'badge-success' : s.result === 'Fail' ? 'badge-danger' : 'badge-warning'}`}>{s.result}</span></td>
                            <td>{s.attendance}</td>
                            <td>{!s.selected && <button className="btn-icon" title="Retain"><XCircle size={16} style={{ color: 'var(--danger)' }}/></button>}</td></tr>
                    ))}</tbody></table>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                <button className="btn btn-primary"><ArrowUpRight size={16}/> Promote Selected ({students.filter(s => s.selected).length})</button>
            </div>
        </div>
    );
}

// ======================== REPORTS ========================
function ReportsTab() {
    const reports = [
        { name: 'Class Performance Report', desc: 'Average marks, pass/fail rates per class', formats: 'PDF, Excel' },
        { name: 'Subject Analysis', desc: 'Marks distribution per subject', formats: 'PDF, Excel' },
        { name: 'Teacher Performance', desc: 'Classes taught, lesson completion rate', formats: 'PDF, Excel' },
        { name: 'Class Timetable', desc: 'Weekly schedule per class-section', formats: 'PDF, Print' },
        { name: 'Teacher Timetable', desc: 'Weekly schedule per teacher', formats: 'PDF, Print' },
        { name: 'Syllabus Coverage', desc: '% of syllabus completed per subject', formats: 'PDF, Excel' },
        { name: 'Lesson Plan Report', desc: 'Completed vs planned lessons', formats: 'PDF, Excel' },
        { name: 'Assignment Report', desc: 'Submission rates and grade distribution', formats: 'PDF, Excel' },
        { name: 'Promotion Summary', desc: 'Students promoted, retained per class', formats: 'PDF, Excel' },
    ];

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}>Academic Reports</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {reports.map((r, i) => (
                    <div key={i} className="card" style={{ padding: 20 }}>
                        <h4 style={{ fontSize: '0.95rem', marginBottom: 6 }}>{r.name}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: 12 }}>{r.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.formats}</span>
                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><FileText size={14}/> Generate</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ======================== SETTINGS ========================
function SettingsTab() {
    const settings = [
        { label: 'Grading Scale', value: 'A+, A, B+, B, C, D, F' }, { label: 'Passing Marks', value: '35%' },
        { label: 'Attendance Threshold', value: '75%' }, { label: 'Period Duration', value: '45 min' },
        { label: 'Working Days', value: 'Mon–Sat' }, { label: 'Timetable Edit Lock', value: 'Unlocked' },
        { label: 'Assignment Late Policy', value: 'Accept' }, { label: 'Promotion Auto-suggest', value: 'Enabled' },
    ];
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
                {settings.map((s, i) => (
                    <div className="acad-setting-item" key={i}><label>{s.label}</label><span className="setting-value">{s.value}</span></div>
                ))}
            </div>
            <div className="acad-settings-panel">
                <h3><Users size={18}/> Role-Based Access Matrix</h3>
                <table className="acad-rbac-table"><thead><tr><th>Feature</th><th>Super Admin</th><th>Admin</th><th>Teacher</th><th>Student</th></tr></thead>
                    <tbody>{rbac.map((r, i) => (
                        <tr key={i}>{r.map((c, j) => <td key={j} style={j > 0 ? { color: c === 'Yes' || c.startsWith('Own') ? 'var(--success)' : c === 'No' ? 'var(--danger)' : 'var(--warning)', fontWeight: 600 } : undefined}>{c}</td>)}</tr>
                    ))}</tbody></table>
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
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Academics() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'year');
    const handleNavigate = (tab) => { setActiveTab(tab); setSearchParams({ tab }); };
    useEffect(() => { if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl); }, [tabFromUrl]);

    return (
        <div className="academics-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb"><Link to="/">Dashboard</Link><span className="separator">/</span><span>Academics</span>
                    {activeTab !== 'year' && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{TABS.find(t => t.id === activeTab)?.label}</span></>}</div>
                <h1>Academics Management</h1>
            </div></div>
            <div className="card academics-card">
                <div className="tabs-header">{TABS.map(tab => { const Icon = tab.icon; return <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>; })}</div>
                <div className="tabs-content">
                    {activeTab === 'year' && <AcademicYearTab/>}
                    {activeTab === 'classes' && <ClassSectionTab/>}
                    {activeTab === 'subjects' && <SubjectsTab/>}
                    {activeTab === 'teachers' && <TeacherAssignmentTab/>}
                    {activeTab === 'timetable' && <TimetableTab/>}
                    {activeTab === 'syllabus' && <SyllabusTab/>}
                    {activeTab === 'lesson-plan' && <LessonPlanTab/>}
                    {activeTab === 'assignments' && <AssignmentsTab/>}
                    {activeTab === 'attendance' && <AttendanceTab/>}
                    {activeTab === 'performance' && <PerformanceTab/>}
                    {activeTab === 'materials' && <StudyMaterialsTab/>}
                    {activeTab === 'promotion' && <PromotionTab/>}
                    {activeTab === 'reports' && <ReportsTab/>}
                    {activeTab === 'settings' && <SettingsTab/>}
                </div>
            </div>
        </div>
    );
}
