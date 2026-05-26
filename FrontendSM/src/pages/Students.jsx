import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Phone, Trash2, Download, Upload } from 'lucide-react';
import { api } from '../utils/api';
import { getInitials, getAvatarColor } from '../utils/helpers';
import { customConfirm, customAlert } from '../utils/dialogs';
import RoleGuard, { useRole } from '../components/RoleGuard';
import './Students.css';

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('All Classes');
    const [sectionFilter, setSectionFilter] = useState('All Sections');
    const [genderFilter, setGenderFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('Active');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { canAddStudent, canDeleteStudent, canHardDeleteStudent } = useRole();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Fetch from API
                const apiData = await api.getStudents();
                
                // Fetch from Local Admission (Confirmed)
                const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');
                
                // Merge and normalize (Admission form uses 'name', API uses 'firstName'/'lastName')
                const normalizedLocal = localData.map(s => {
                    const nameParts = (s.name || '').split(' ');
                    return {
                        ...s,
                        firstName: s.firstName || nameParts[0],
                        lastName: s.lastName || nameParts.slice(1).join(' '),
                        contactNo: s.phone || s.contactNo || 'N/A',
                        newStudent: true
                    };
                });

                // Merge by ID to prevent duplicates
                const allStudentsMap = new Map();
                apiData.forEach(s => allStudentsMap.set(s.id || s.admissionNo, s));
                normalizedLocal.forEach(s => {
                    if (!allStudentsMap.has(s.id || s.admissionNo)) {
                        allStudentsMap.set(s.id || s.admissionNo, s);
                    }
                });

                setStudents(Array.from(allStudentsMap.values()));
            } catch (err) {
                console.error("Failed to load students", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleDelete = async (e, student) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (canHardDeleteStudent) {
            if (await customConfirm('SUPER ADMIN ACTION: Are you sure you want to PERMANENTLY delete this student record? This cannot be undone.')) {
                try {
                    const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');
                    const studentId = student.id || student._id || student.admissionNo;
                    const filteredData = localData.filter(s => (s.id || s._id || s.admissionNo) !== studentId);
                    localStorage.setItem('mzs_students', JSON.stringify(filteredData));
                    
                    setStudents(prev => prev.filter(s => (s.id || s._id || s.admissionNo) !== studentId));
                    customAlert('Student permanently deleted.');
                } catch (err) {
                    customAlert('Failed to hard delete student.');
                }
            }
        } else if (canDeleteStudent) {
            if (await customConfirm('Are you sure you want to soft remove this student? They will be marked as Inactive.')) {
                try {
                    const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');
                    const studentId = student.id || student._id || student.admissionNo;
                    const studentIndex = localData.findIndex(s => (s.id || s._id || s.admissionNo) === studentId);
                    
                    if (studentIndex >= 0) {
                        localData[studentIndex].status = 'Inactive';
                        localStorage.setItem('mzs_students', JSON.stringify(localData));
                    } else {
                        const override = { ...student, status: 'Inactive' };
                        localData.push(override);
                        localStorage.setItem('mzs_students', JSON.stringify(localData));
                    }
                    
                    setStudents(prev => prev.map(s => {
                        if ((s.id || s._id || s.admissionNo) === studentId) {
                            return { ...s, status: 'Inactive' };
                        }
                        return s;
                    }));
                } catch (err) {
                    console.error("Delete failed", err);
                    customAlert('Failed to remove student.');
                }
            }
        }
    };

    const filteredStudents = students.filter(s => {
        const matchSearch = `${s.firstName || ''} ${s.lastName || ''} ${s.admissionNo || ''} ${s.rollNo || ''}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchClass = classFilter === 'All Classes' || s.class === classFilter;
        const matchSection = sectionFilter === 'All Sections' || s.section === sectionFilter;
        const matchGender = genderFilter === 'All' || s.gender === genderFilter;
        const matchStatus = statusFilter === 'All' || (s.status || 'Active') === statusFilter;
        return matchSearch && matchClass && matchSection && matchGender && matchStatus;
    });

    const handleExportCSV = () => {
        const headers = ['Student ID', 'Admission No', 'Roll No', 'First Name', 'Last Name', 'Class', 'Section', 'Gender', 'Phone', 'Email', 'Status'];
        const csvRows = [headers.join(',')];
        
        filteredStudents.forEach(s => {
            const values = [
                s.studentId || s.id || '',
                s.admissionNo || '',
                s.rollNo || '',
                s.firstName || '',
                s.lastName || '',
                s.class || '',
                s.section || '',
                s.gender || '',
                s.contactNo || '',
                s.email || '',
                s.status || 'Active'
            ];
            csvRows.push(values.map(v => `"${v}"`).join(','));
        });
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `Students_Export_${new Date().toISOString().split('T')[0]}.csv`);
        a.click();
    };

    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target.result;
                const rows = text.split('\n').map(row => row.trim()).filter(row => row);
                if (rows.length <= 1) throw new Error("File is empty or only contains headers.");
                
                const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
                
                const newStudents = rows.slice(1).map(row => {
                    const values = row.split(',').map(v => v.replace(/^"|"$/g, '').trim());
                    const s = {};
                    headers.forEach((h, i) => { s[h] = values[i] || ''; });
                    return {
                        id: s['Student ID'] || `STU-IMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        studentId: s['Student ID'] || `STU-IMP-${Math.floor(Math.random() * 10000)}`,
                        admissionNo: s['Admission No'] || '',
                        rollNo: s['Roll No'] || '',
                        firstName: s['First Name'] || 'Unknown',
                        lastName: s['Last Name'] || '',
                        class: s['Class'] || '',
                        section: s['Section'] || '',
                        gender: s['Gender'] || '',
                        contactNo: s['Phone'] || '',
                        email: s['Email'] || '',
                        status: s['Status'] || 'Active',
                        newStudent: true
                    };
                });
                
                const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');
                const combined = [...localData, ...newStudents];
                localStorage.setItem('mzs_students', JSON.stringify(combined));
                setStudents(prev => [...prev, ...newStudents]);
                customAlert(`Successfully imported ${newStudents.length} students.`);
            } catch (err) {
                console.error(err);
                customAlert('Failed to parse CSV file. Please ensure it matches the export format.');
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    return (
        <div className="students-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Students</span>
                    </div>
                    <h1>Student Information</h1>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline" onClick={handleExportCSV}>
                        <Download size={16} /> Export
                    </button>
                    {canAddStudent && (
                        <label className="btn btn-outline" style={{ cursor: 'pointer', margin: 0 }}>
                            <Upload size={16} /> Import
                            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImportCSV} />
                        </label>
                    )}
                    {canAddStudent && (
                        <Link to="/students/add" className="btn btn-primary">
                            <Plus size={16} /> Add Student
                        </Link>
                    )}
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name, admission no, roll no..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-dropdowns">
                    <select className="filter-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
                        <option value="All Classes">All Classes</option>
                        {['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(c => (
                            <option key={c} value={c}>Class {c}</option>
                        ))}
                    </select>
                    <select className="filter-select" value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}>
                        <option value="All Sections">All Sections</option>
                        {['A', 'B', 'C', 'D'].map(s => (
                            <option key={s} value={s}>Section {s}</option>
                        ))}
                    </select>
                    <select className="filter-select" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
                        <option value="All">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Left">Left</option>
                    </select>
                    <div className="results-count">
                        <Filter size={14} /> {filteredStudents.length} students found
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading students...</div>
            ) : (
                <div className="students-grid">
                    {filteredStudents.map(s => (
                        <Link to={`/students/${s.id || s.admissionNo}`} className="student-card card" key={s._id || s.id || s.admissionNo}>
                            {canDeleteStudent && (
                                <button 
                                    className="btn-icon text-danger" 
                                    onClick={(e) => handleDelete(e, s)}
                                    title={canHardDeleteStudent ? "Permanently Delete Student" : "Soft Delete Student"}
                                    style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: 'rgba(255,0,0,0.05)' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <div className="student-card-header">
                                <div className="student-avatar" style={!s.photoUrl ? { background: getAvatarColor((s.firstName || '') + (s.lastName || '')) } : {}}>
                                    {s.photoUrl ? (
                                        <img src={s.photoUrl} alt="Photo" />
                                    ) : (
                                        getInitials(s.firstName || '', s.lastName || '')
                                    )}
                                </div>
                                <div className="student-info">
                                    <h3 className="student-name">{s.firstName || ''} {s.lastName || ''}</h3>
                                    <span className="student-class">Class {s.class} &middot; Section {s.section}</span>
                                </div>
                            </div>
                            <div className="student-card-body">
                                <div className="student-meta">
                                    <div className="meta-item">
                                        <span className="meta-label">Roll No</span>
                                        <span className="meta-value">{s.rollNo}</span>
                                    </div>
                                    <div className="meta-divider" />
                                    <div className="meta-item">
                                        <span className="meta-label">Student ID</span>
                                        <span className="meta-value">{s.studentId || 'N/A'}</span>
                                    </div>
                                    <div className="meta-divider" />
                                    <div className="meta-item">
                                        <span className="meta-label">Adm No</span>
                                        <span className="meta-value">{s.admissionNo}</span>
                                    </div>
                                </div>
                                <div className="student-contact">
                                    <Phone size={14} />
                                    <span>{s.contactNo}</span>
                                </div>
                            </div>
                            <div className="student-card-footer">
                                {(s.status === 'Inactive' || s.status === 'Left') && (
                                    <span className="badge badge-danger">{s.status}</span>
                                )}
                                {s.paidFees >= s.totalFees && s.totalFees > 0 ? (
                                    <span className="badge badge-success">Fees Paid</span>
                                ) : (
                                    <span className="badge badge-warning">Fees Pending</span>
                                )}
                                {s.newStudent && <span className="badge badge-info">New</span>}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
