import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Phone, Mail, MapPin, Calendar,
    BookOpen, IndianRupee, CalendarCheck, User,
    Edit, Trash2,
} from 'lucide-react';
import { api } from '../utils/api';
import { getInitials, getAvatarColor, formatCurrency, formatDate } from '../utils/helpers';
import './StudentDetail.css';

export default function StudentDetail() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const data = await api.getStudentById(id);
                setStudent(data);
            } catch (err) {
                console.error("Failed to load student", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading student profile...</div>;
    }

    if (!student) {
        return (
            <div className="student-detail-page animate-fade-in">
                <div className="empty-state card">
                    <User size={48} />
                    <h3>Student not found</h3>
                    <p>The student you're looking for doesn't exist.</p>
                    <Link to="/students" className="btn btn-primary" style={{ marginTop: 16 }}>
                        <ArrowLeft size={18} /> Back to Students
                    </Link>
                </div>
            </div>
        );
    }

    const initials = getInitials(student.firstName, student.lastName);
    const avatarColor = getAvatarColor(student.firstName + student.lastName);
    const feePercentage = Math.round((student.paidFees / student.totalFees) * 100);

    return (
        <div className="student-detail-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <Link to="/students">Students</Link>
                        <span className="separator">/</span>
                        <span>{student.firstName} {student.lastName}</span>
                    </div>
                    <h1>Student Profile</h1>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline"><Edit size={16} /> Edit</button>
                    <Link to="/students" className="btn btn-outline"><ArrowLeft size={16} /> Back</Link>
                </div>
            </div>

            {/* Profile Card */}
            <div className="card profile-card">
                <div className="profile-top">
                    <div className="profile-avatar-lg" style={{ background: avatarColor }}>
                        {initials}
                    </div>
                    <div className="profile-main-info">
                        <h2>{student.firstName} {student.lastName}</h2>
                        <span className="profile-class">Class {student.class} - Section {student.section} | Roll No: {student.rollNo}</span>
                        <div className="profile-badges">
                            <span className="badge badge-info">Adm: {student.admissionNo}</span>
                            <span className="badge badge-success">Batch: {student.batch}</span>
                            {student.newStudent && <span className="badge badge-warning">New Student</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="detail-grid">
                <div className="card detail-section">
                    <h3 className="detail-section-title"><User size={18} /> Personal Information</h3>
                    <div className="detail-list">
                        <div className="detail-item">
                            <span className="detail-label">Gender</span>
                            <span className="detail-value">{student.gender}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Father's Name</span>
                            <span className="detail-value">{student.fatherName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Mother's Name</span>
                            <span className="detail-value">{student.motherName || '—'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Category</span>
                            <span className="detail-value">{student.category}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Facility</span>
                            <span className="detail-value">{student.facility?.join(', ') || 'None'}</span>
                        </div>
                    </div>
                </div>

                <div className="card detail-section">
                    <h3 className="detail-section-title"><Phone size={18} /> Contact Details</h3>
                    <div className="detail-list">
                        <div className="detail-item">
                            <span className="detail-label"><Phone size={14} /> Phone</span>
                            <span className="detail-value">{student.contactNo}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label"><Mail size={14} /> Email</span>
                            <span className="detail-value">{student.email || '—'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label"><MapPin size={14} /> Address</span>
                            <span className="detail-value">{student.address || '—'}</span>
                        </div>
                    </div>
                </div>

                <div className="card detail-section">
                    <h3 className="detail-section-title"><IndianRupee size={18} /> Fee Details</h3>
                    <div className="fee-overview">
                        <div className="fee-progress-wrap">
                            <div className="fee-progress-bar">
                                <div
                                    className="fee-progress-fill"
                                    style={{
                                        width: `${feePercentage}%`,
                                        background: feePercentage >= 100 ? 'var(--success)' : feePercentage >= 50 ? 'var(--warning)' : 'var(--danger)',
                                    }}
                                />
                            </div>
                            <span className="fee-progress-label">{feePercentage}% Paid</span>
                        </div>
                        <div className="fee-amounts">
                            <div className="fee-amount-item">
                                <span>Total Fees</span>
                                <strong>{formatCurrency(student.totalFees)}</strong>
                            </div>
                            <div className="fee-amount-item">
                                <span>Paid</span>
                                <strong style={{ color: 'var(--success)' }}>{formatCurrency(student.paidFees)}</strong>
                            </div>
                            <div className="fee-amount-item">
                                <span>Pending</span>
                                <strong style={{ color: 'var(--danger)' }}>{formatCurrency(student.totalFees - student.paidFees)}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card detail-section">
                    <h3 className="detail-section-title"><CalendarCheck size={18} /> Attendance</h3>
                    <div className="attendance-overview">
                        <div className="attendance-circle">
                            <svg viewBox="0 0 100 100" className="attendance-svg">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg)" strokeWidth="8" />
                                <circle
                                    cx="50" cy="50" r="42" fill="none"
                                    stroke={student.attendance >= 90 ? 'var(--success)' : student.attendance >= 75 ? 'var(--warning)' : 'var(--danger)'}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${student.attendance * 2.64} 264`}
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <span className="attendance-value">{student.attendance}%</span>
                        </div>
                        <div className="attendance-info">
                            <span>Overall Attendance</span>
                            <span className={`badge ${student.attendance >= 90 ? 'badge-success' : student.attendance >= 75 ? 'badge-warning' : 'badge-danger'}`}>
                                {student.attendance >= 90 ? 'Excellent' : student.attendance >= 75 ? 'Good' : 'Needs Improvement'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
