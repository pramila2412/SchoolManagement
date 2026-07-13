const fs = require('fs');

const tabsCode = `
// ======================== CLASS & SECTION ========================
function ClassSectionTab() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Class Form
    const [className, setClassName] = useState('');
    
    // Sections Form
    const [sections, setSections] = useState([]);
    const [sectionLabel, setSectionLabel] = useState('');
    const [capacity, setCapacity] = useState(40);
    const [classTeacher, setClassTeacher] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch('/api/academics/classes');
            if (res.ok) {
                const data = await res.json();
                setClasses(data);
                // Also update local storage so mockData utilities continue to work globally
                localStorage.setItem('academic_classes', JSON.stringify(data.map(c => ({
                    name: c.className,
                    sections: c.sections
                }))));
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSection = (e) => {
        e.preventDefault();
        if(!sectionLabel) return;
        setSections([...sections, { label: sectionLabel, capacity, classTeacher }]);
        setSectionLabel('');
        setCapacity(40);
        setClassTeacher('');
    };

    const removeSection = (idx) => {
        setSections(sections.filter((_, i) => i !== idx));
    };

    const handleSaveClass = async () => {
        if (!className) {
            customAlert("Please enter a class name");
            return;
        }
        if (sections.length === 0) {
            customAlert("Please add at least one section");
            return;
        }

        try {
            const res = await fetch('/api/academics/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ className, sections })
            });
            
            if (res.ok) {
                customAlert("Class and Sections saved successfully!");
                setClassName('');
                setSections([]);
                fetchClasses();
            } else {
                const data = await res.json();
                customAlert(data.message || "Error saving class");
            }
        } catch (error) {
            customAlert("Network error saving class");
        }
    };

    const deleteClass = async (id) => {
        if (!await customConfirm("Are you sure you want to delete this class?")) return;
        try {
            const res = await fetch('/api/academics/classes/' + id, { method: 'DELETE' });
            if (res.ok) fetchClasses();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="animate-fade-in">
            <div className="acad-two-col">
                <div className="acad-form-panel">
                    <h3><Layers size={18}/> Add Class / Section</h3>
                    <div className="acad-form">
                        <div className="form-group">
                            <label className="form-label">Class Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Nursery, I, Grade 1" value={className} onChange={e => setClassName(e.target.value)} />
                        </div>
                        
                        <div style={{ padding: '15px', background: 'var(--surface-50)', borderRadius: '8px', border: '1px solid var(--border-light)', marginTop: '15px' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-secondary)' }}>Add Sections</h4>
                            <div className="acad-form form-row">
                                <div className="form-group">
                                    <label className="form-label">Section Label <span className="required">*</span></label>
                                    <input type="text" className="form-input" placeholder="e.g. A, B, Alpha" value={sectionLabel} onChange={e => setSectionLabel(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Capacity</label>
                                    <input type="number" className="form-input" value={capacity} onChange={e => setCapacity(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Class Teacher</label>
                                <select className="form-select" value={classTeacher} onChange={e => setClassTeacher(e.target.value)}>
                                    <option value="">Select Teacher</option>
                                    <option>Mrs. Sharma</option><option>Mr. Patel</option><option>Ms. Gupta</option><option>Mr. Roy</option><option>Mrs. Verma</option><option>Mr. Singh</option>
                                </select>
                            </div>
                            <button type="button" className="btn btn-secondary mt-2" onClick={handleAddSection}><PlusCircle size={16}/> Add Section</button>
                        </div>
                        
                        {sections.length > 0 && (
                            <div style={{ marginTop: '15px' }}>
                                <label className="form-label">Sections to be added:</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {sections.map((s, idx) => (
                                        <div key={idx} style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', padding: '5px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                            <strong>{s.label}</strong> (Cap: {s.capacity}) {s.classTeacher ? \` - \${s.classTeacher}\` : ''}
                                            <Trash2 size={14} color="var(--danger)" style={{ cursor: 'pointer' }} onClick={() => removeSection(idx)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="acad-form form-actions" style={{ marginTop: '20px' }}>
                            <button type="button" className="btn btn-primary" onClick={handleSaveClass}><Save size={16}/> Save Class</button>
                        </div>
                    </div>
                </div>
                <div className="acad-table-panel">
                    <table className="data-table">
                        <thead><tr><th>Class</th><th>Section</th><th>Class Teacher</th><th>Capacity</th><th>Action</th></tr></thead>
                        <tbody>
                            {classes.flatMap(c => c.sections.map((s, i) => (
                                <tr key={\`\${c._id}-\${i}\`}>
                                    <td className="fw-600">{c.className}</td>
                                    <td>{s.label}</td>
                                    <td>{s.classTeacher || '—'}</td>
                                    <td>{s.capacity}</td>
                                    {i === 0 && <td rowSpan={c.sections.length} style={{ verticalAlign: 'middle' }}>
                                        <button className="btn-icon" onClick={() => deleteClass(c._id)}><Trash2 size={16}/></button>
                                    </td>}
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ======================== SUBJECTS ========================
function SubjectsTab() {
    const [subjects, setSubjects] = useState([]);
    const [classesList, setClassesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [classDropdownOpen, setClassDropdownOpen] = useState(false);
    
    const [form, setForm] = useState({ subjectName: '', subjectCode: '', type: 'Theory', assignedClasses: [] });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subjRes, classRes] = await Promise.all([
                fetch('/api/academics/subjects'),
                fetch('/api/academics/classes')
            ]);
            if (subjRes.ok) setSubjects(await subjRes.json());
            if (classRes.ok) {
                const clsData = await classRes.json();
                setClassesList(clsData.map(c => c.className));
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleClass = (cls) => {
        if (cls === 'All Classes') {
            const isAllSelected = form.assignedClasses.includes('All Classes');
            setForm(prev => ({ 
                ...prev, 
                assignedClasses: isAllSelected ? [] : ['All Classes'] 
            }));
            return;
        }
        setForm(prev => {
            const withoutAll = prev.assignedClasses.filter(c => c !== 'All Classes');
            const updated = withoutAll.includes(cls) 
                ? withoutAll.filter(c => c !== cls) 
                : [...withoutAll, cls];
            return { ...prev, assignedClasses: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.assignedClasses.length === 0) {
            customAlert('Please assign this subject to at least one class.');
            return;
        }

        try {
            const res = await fetch('/api/academics/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                customAlert('Subject saved successfully!');
                setForm({ subjectName: '', subjectCode: '', type: 'Theory', assignedClasses: [] });
                fetchData();
            } else {
                const data = await res.json();
                customAlert(data.message || "Error saving subject");
            }
        } catch (error) {
            customAlert("Network error");
        }
    };

    const deleteSubject = async (id) => {
        if (!await customConfirm("Are you sure you want to delete this subject?")) return;
        try {
            const res = await fetch('/api/academics/subjects/' + id, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="animate-fade-in">
            <div className="acad-two-col">
                <div className="acad-form-panel">
                    <h3><BookOpen size={18}/> Add Subject</h3>
                    <form className="acad-form" onSubmit={handleSubmit}>
                        <div className="form-group"><label className="form-label">Subject Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Mathematics" value={form.subjectName} onChange={e => setForm({ ...form, subjectName: e.target.value })} /></div>
                        <div className="acad-form form-row">
                            <div className="form-group"><label className="form-label">Subject Code</label>
                                <input type="text" className="form-input" required placeholder="e.g. MATH-01" value={form.subjectCode} onChange={e => setForm({ ...form, subjectCode: e.target.value })} /></div>
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
                                {form.assignedClasses.length === 0 ? (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select classes...</span>
                                ) : (
                                    form.assignedClasses.map(cls => (
                                        <span key={cls} className="multi-select-tag">
                                            {cls}
                                            <span className="tag-close" onClick={(e) => { e.stopPropagation(); toggleClass(cls); }}>×</span>
                                        </span>
                                    ))
                                )}
                                <ChevronDown size={16} style={{ marginLeft: 'auto', alignSelf: 'center', opacity: 0.5 }} />
                            </div>
                            
                            {classDropdownOpen && (
                                <div className="multi-select-dropdown">
                                    <label className="dropdown-item" style={{ fontWeight: 600, borderBottom: '1px solid var(--border-light)', background: form.assignedClasses.includes('All Classes') ? 'rgba(28,167,166,0.08)' : 'transparent' }}>
                                        <input type="checkbox" checked={form.assignedClasses.includes('All Classes')} onChange={() => toggleClass('All Classes')} style={{ accentColor: 'var(--accent)' }} />
                                        <span>All Classes</span>
                                    </label>
                                    {classesList.map(cls => (
                                        <label key={cls} className="dropdown-item" style={{ background: (form.assignedClasses.includes('All Classes') || form.assignedClasses.includes(cls)) ? 'rgba(28,167,166,0.06)' : 'transparent' }}>
                                            <input type="checkbox" checked={form.assignedClasses.includes('All Classes') || form.assignedClasses.includes(cls)} disabled={form.assignedClasses.includes('All Classes')} onChange={() => toggleClass(cls)} style={{ accentColor: 'var(--accent)' }} />
                                            <span>{cls}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="acad-form form-actions"><button type="submit" className="btn btn-primary"><Save size={16}/> Save Subject</button></div>
                    </form>
                </div>
                <div className="acad-table-panel">
                    <table className="data-table"><thead><tr><th>Name</th><th>Code</th><th>Type</th><th>Assigned Classes</th><th>Action</th></tr></thead>
                        <tbody>{subjects.map(s => (
                            <tr key={s._id}><td className="fw-600">{s.subjectName}</td><td><span className="badge badge-draft">{s.subjectCode}</span></td><td>{s.type}</td>
                                <td>{s.assignedClasses.join(', ')}</td>
                                <td><button className="btn-icon" onClick={() => deleteSubject(s._id)}><Trash2 size={16}/></button></td></tr>
                        ))}</tbody></table>
                </div>
            </div>
        </div>
    );
}

// ======================== TEACHER ASSIGNMENT ========================
function TeacherAssignmentTab() {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [assignments, setAssignments] = useState([]); // Array of { subjectName, teacherName }
    
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedClass && selectedSection) {
            loadAssignmentsForSection(selectedClass, selectedSection);
        } else {
            setAssignments([]);
        }
    }, [selectedClass, selectedSection]);

    const fetchData = async () => {
        try {
            const [clsRes, subjRes] = await Promise.all([
                fetch('/api/academics/classes'),
                fetch('/api/academics/subjects')
            ]);
            if (clsRes.ok) setClasses(await clsRes.json());
            if (subjRes.ok) setSubjects(await subjRes.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadAssignmentsForSection = async (cls, sec) => {
        try {
            const res = await fetch(\`/api/academics/assignments?className=\${encodeURIComponent(cls)}&section=\${encodeURIComponent(sec)}\`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0 && data[0].assignments) {
                    setAssignments(data[0].assignments);
                } else {
                    setAssignments([]);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Filter sections based on selected class
    const availableSections = selectedClass 
        ? (classes.find(c => c.className === selectedClass)?.sections || [])
        : [];
        
    // Filter subjects that belong to selected class (or "All Classes")
    const applicableSubjects = subjects.filter(s => 
        s.assignedClasses.includes('All Classes') || s.assignedClasses.includes(selectedClass)
    );

    const handleTeacherChange = (subjectName, teacherName) => {
        setAssignments(prev => {
            const existing = prev.findIndex(a => a.subjectName === subjectName);
            if (existing >= 0) {
                const newArr = [...prev];
                newArr[existing] = { subjectName, teacherName };
                return newArr;
            } else {
                return [...prev, { subjectName, teacherName }];
            }
        });
    };

    const getTeacherForSubject = (subjectName) => {
        const found = assignments.find(a => a.subjectName === subjectName);
        return found ? found.teacherName : '';
    };

    const handleSave = async () => {
        if (!selectedClass || !selectedSection) {
            customAlert("Select a Class and Section first.");
            return;
        }
        try {
            const res = await fetch('/api/academics/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    className: selectedClass,
                    section: selectedSection,
                    assignments
                })
            });
            if (res.ok) {
                customAlert("Teacher assignments saved successfully!");
            }
        } catch (error) {
            customAlert("Error saving assignments");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="animate-fade-in">
            <div className="acad-filter-bar mb-6" style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ margin: 0, flex: 1 }}>
                    <label className="form-label">Select Class</label>
                    <select className="form-select" value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedSection(''); }}>
                        <option value="">-- Select Class --</option>
                        {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
                    </select>
                </div>
                <div className="form-group" style={{ margin: 0, flex: 1 }}>
                    <label className="form-label">Select Section</label>
                    <select className="form-select" value={selectedSection} onChange={e => setSelectedSection(e.target.value)} disabled={!selectedClass}>
                        <option value="">-- Select Section --</option>
                        {availableSections.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                    </select>
                </div>
            </div>

            {selectedClass && selectedSection ? (
                <div className="acad-card">
                    <div className="acad-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>Assign Teachers to Subjects</h3>
                            <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Class {selectedClass} - Section {selectedSection}
                            </p>
                        </div>
                        <button className="btn btn-primary" onClick={handleSave}><Save size={16}/> Save Assignments</button>
                    </div>
                    <div className="acad-card-body p-0">
                        {applicableSubjects.length === 0 ? (
                            <div className="p-6 text-center text-muted">No subjects assigned to this class yet. Go to Subjects tab.</div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Subject Name</th>
                                        <th>Subject Code</th>
                                        <th>Subject Type</th>
                                        <th style={{ width: '40%' }}>Assigned Teacher</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicableSubjects.map(subj => (
                                        <tr key={subj._id}>
                                            <td className="fw-600">{subj.subjectName}</td>
                                            <td><span className="badge badge-draft">{subj.subjectCode}</span></td>
                                            <td>{subj.type}</td>
                                            <td>
                                                <select 
                                                    className="form-select" 
                                                    style={{ maxWidth: '100%' }}
                                                    value={getTeacherForSubject(subj.subjectName)}
                                                    onChange={e => handleTeacherChange(subj.subjectName, e.target.value)}
                                                >
                                                    <option value="">Unassigned</option>
                                                    <option>Mrs. Sharma</option>
                                                    <option>Mr. Patel</option>
                                                    <option>Ms. Gupta</option>
                                                    <option>Mr. Roy</option>
                                                    <option>Mrs. Verma</option>
                                                    <option>Mr. Singh</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            ) : (
                <div className="empty-state" style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--surface)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                    <Users size={48} style={{ color: 'var(--border-color)', margin: '0 auto 15px' }} />
                    <h3>Select Class & Section</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>Please select a class and section from the dropdowns above to assign subject teachers.</p>
                </div>
            )}
        </div>
    );
}
`;

const targetFile = 'C:/Users/prami/New folder/SchoolManagement/FrontendSM/src/pages/Academics.jsx';
let content = fs.readFileSync(targetFile, 'utf8');

// The marker strings to identify boundaries
const startMarker = '// ======================== CLASS & SECTION ========================';
const endMarker = '// ======================== TIMETABLE ========================';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = content.substring(0, startIndex) + tabsCode + '\n' + content.substring(endIndex);
    fs.writeFileSync(targetFile, newContent);
    console.log("Successfully replaced tabs in Academics.jsx");
} else {
    console.log("Could not find markers!");
}
