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
                const data = await api.getStudents();
                setStudents(data);
            } catch (err) {
                console.error("Failed to load students", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(s => {
        const matchSearch = `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.rollNo}`
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
                        {['Nursery', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].map(c => (
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
                    {filteredStudents.map(student => (
                        <Link to={`/students/${student.id}`} className="student-card card" key={student.id}>
                            <div className="student-card-top">
                                <div className="student-avatar" style={{ background: getAvatarColor(student.firstName + student.lastName) }}>
                                    {getInitials(student.firstName, student.lastName)}
                                </div>
                                <div className="student-basic">
                                    <h3>{student.firstName} {student.lastName}</h3>
                                    <span>Class {student.class} - Section {student.section}</span>
                                    <div className="student-meta">
                                        <span>Roll: <strong>{student.rollNo}</strong></span>
                                        <span>Adm: <strong>{student.admissionNo}</strong></span>
                                    </div>
                                </div>
                            </div>
                            <div className="student-contact">
                                <Phone size={14} /> {student.contactNo}
                            </div>
                            <div className="student-badges">
                                {(student.status === 'Inactive' || student.status === 'Left') && (
                                    <span className="badge badge-danger">{student.status}</span>
                                )}
                                {student.paidFees >= student.totalFees && student.totalFees > 0 ? (
                                    <span className="badge badge-success">Fees Paid</span>
                                ) : (
                                    <span className="badge badge-warning">Fees Pending</span>
                                )}
                                {student.newStudent && <span className="badge badge-info">New</span>}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
