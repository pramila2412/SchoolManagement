import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Phone } from 'lucide-react';
import { api } from '../utils/api';
import { getInitials, getAvatarColor } from '../utils/helpers';
import './Students.css';

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('All Classes');
    const [sectionFilter, setSectionFilter] = useState('All Sections');
    const [genderFilter, setGenderFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('Active');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Fetch from API
                const apiData = await api.getStudents();
                
                // Fetch from Local Admission (Confirmed)
                const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');
                
                // Merge and normalize (Admission form uses 'name', API uses 'firstName'/'lastName')
                const normalizedLocal = localData.map(s => {
                    const nameParts = s.name.split(' ');
                    return {
                        ...s,
                        firstName: nameParts[0],
                        lastName: nameParts.slice(1).join(' '),
                        contactNo: s.phone || 'N/A',
                        newStudent: true
                    };
                });

                setStudents([...apiData, ...normalizedLocal]);
            } catch (err) {
                console.error("Failed to load students", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

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
                <Link to="/students/add" className="btn btn-primary">
                    <Plus size={16} /> Add Student
                </Link>
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
                        <Link to={`/students/${s.id}`} className="student-card card" key={s._id || s.id}>
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
