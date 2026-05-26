import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Phone, Mail, MapPin, Calendar,
    BookOpen, IndianRupee, CalendarCheck, User,
    Edit, Trash2, Award, FileText, GraduationCap,
    Users, ChevronLeft, ChevronRight, Download
} from 'lucide-react';
import { api } from '../utils/api';
import { getInitials, getAvatarColor, formatCurrency, formatDate } from '../utils/helpers';
import { customAlert } from '../utils/dialogs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FormalCertificate } from './Certificates';
import RoleGuard from '../components/RoleGuard';
import './StudentDetail.css';
import './Certificates.css'; // needed for FormalCertificate styles

const API = '/api';

/* ─── Helper for stable mock data ─── */
const getStableMockAttendance = (studentId, year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = {};
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        if (date.getDay() === 0) {
            data[i] = 'Holiday';
        } else if (date > new Date()) {
            data[i] = null; // Future date
        } else {
            const hash = (i * 17 + month * 31 + (studentId?.length || 5) * 11) % 100;
            if (hash < 8) data[i] = 'Absent';
            else if (hash < 12) data[i] = 'Leave';
            else data[i] = 'Present';
        }
    }
    return data;
};

/* ─── Attendance Tab Component ─── */
function AttendanceTabContent({ student, globalSummary }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthlyData, setMonthlyData] = useState({});

    useEffect(() => {
        setMonthlyData(getStableMockAttendance(student.id, currentMonth.getFullYear(), currentMonth.getMonth()));
    }, [currentMonth, student.id]);

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let present = 0, absent = 0, leave = 0, totalDays = 0;
    for (let i = 1; i <= daysInMonth; i++) {
        if (monthlyData[i] === 'Present') { present++; totalDays++; }
        else if (monthlyData[i] === 'Absent') { absent++; totalDays++; }
        else if (monthlyData[i] === 'Leave') { leave++; totalDays++; }
    }
    const percentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

    return (
        <div className="attendance-tab-container">
            <div className="attendance-header-actions">
                <h3 className="detail-section-title"><CalendarCheck size={18} /> Monthly Attendance</h3>
                <div className="month-selector">
                    <button className="btn-icon" onClick={handlePrevMonth}><ChevronLeft size={18} /></button>
                    <span className="month-display">{monthNames[month]} {year}</span>
                    <button className="btn-icon" onClick={handleNextMonth} disabled={new Date(year, month + 1, 1) > new Date()}><ChevronRight size={18} /></button>
                </div>
            </div>

            <div className="attendance-overview">
                <div className="attendance-circle">
                    <svg viewBox="0 0 100 100" className="attendance-svg">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg)" strokeWidth="8" />
                        <circle cx="50" cy="50" r="42" fill="none"
                            stroke={percentage >= 90 ? 'var(--success)' : percentage >= 75 ? 'var(--warning)' : 'var(--danger)'}
                            strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={`${percentage * 2.64} 264`}
                            transform="rotate(-90 50 50)" />
                    </svg>
                    <span className="attendance-value">{percentage}%</span>
                </div>
                <div className="attendance-stats-grid">
                    <div className="att-stat"><span className="att-stat-count">{totalDays}</span><span>Total Days</span></div>
                    <div className="att-stat" style={{color:'var(--success)'}}><span className="att-stat-count">{present}</span><span>Present</span></div>
                    <div className="att-stat" style={{color:'var(--danger)'}}><span className="att-stat-count">{absent}</span><span>Absent</span></div>
                    <div className="att-stat" style={{color:'var(--warning)'}}><span className="att-stat-count">{leave}</span><span>Leave</span></div>
                </div>
            </div>

            <div className="calendar-container">
                <div className="calendar-grid-header">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="cal-header-day">{d}</div>)}
                </div>
                <div className="calendar-grid">
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} className="cal-cell empty"></div>)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const status = monthlyData[day];
                        let statusClass = '';
                        if (status === 'Present') statusClass = 'status-present';
                        else if (status === 'Absent') statusClass = 'status-absent';
                        else if (status === 'Leave') statusClass = 'status-leave';
                        else if (status === 'Holiday') statusClass = 'status-holiday';

                        return (
                            <div key={day} className={`cal-cell ${statusClass}`}>
                                <span className="cal-day-num">{day}</span>
                                {status && status !== 'Holiday' && <span className="cal-status-dot"></span>}
                            </div>
                        );
                    })}
                </div>
                <div className="calendar-legend">
                    <div className="legend-item"><span className="legend-dot present"></span> Present</div>
                    <div className="legend-item"><span className="legend-dot absent"></span> Absent</div>
                    <div className="legend-item"><span className="legend-dot leave"></span> Leave</div>
                    <div className="legend-item"><span className="legend-dot holiday"></span> Holiday</div>
                </div>
            </div>
        </div>
    );
}

export default function StudentDetail() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const [certificates, setCertificates] = useState([]);
    const [attendanceSummary, setAttendanceSummary] = useState(null);
    const [portalAuth, setPortalAuth] = useState(null);
    const [downloadingCert, setDownloadingCert] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getStudentById(id);
                setStudent(data);
                
                // Fetch parent portal credentials and potential local data override from localStorage
                const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');
                const localMatch = localData.find(s => s.admissionNo === data.admissionNo || s.id === data.id);
                if (localMatch) {
                    setPortalAuth({ id: localMatch.parentId, password: localMatch.parentPassword });
                    setStudent(prev => ({ ...prev, photoUrl: prev.photoUrl || localMatch.photoUrl }));
                }

                // Fetch certificates
                try { 
                    const res = await fetch(`${API}/certificates?studentId=${id}`); 
                    const apiCerts = await res.json();
                    
                    // Also check local certificates
                    const localCerts = JSON.parse(localStorage.getItem('mzs_certificates') || '[]');
                    const filteredLocal = localCerts.filter(c => c.studentId === id || c.admissionNo === student?.admissionNo);
                    
                    // Merge and sort
                    const allCerts = [...apiCerts, ...filteredLocal].sort((a,b) => 
                        new Date(b.issueDate || b.createdAt) - new Date(a.issueDate || a.createdAt)
                    );
                    setCertificates(allCerts);
                } catch {
                    // Fallback to local only if API fails
                    const localCerts = JSON.parse(localStorage.getItem('mzs_certificates') || '[]');
                    const filteredLocal = localCerts.filter(c => c.studentId === id);
                    setCertificates(filteredLocal);
                }

                // Fetch attendance
                try { const res = await fetch(`${API}/attendance/report/student/${id}`); setAttendanceSummary(await res.json()); } catch {}
            } catch (err) {
                console.error("Failed to load student", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDownloadCert = async (cert) => {
        // Merge missing details from the current student profile so blanks are filled if they were updated later
        const mergedCert = {
            ...cert,
            fatherName: cert.fatherName || student.fatherName || '',
            motherName: cert.motherName || student.motherName || '',
            parentName: cert.parentName || cert.fatherName || student.fatherName || student.motherName || '',
            dateOfBirth: cert.dateOfBirth || student.dateOfBirth || student.dob || '',
            gender: cert.gender || student.gender || '',
            studentName: cert.studentName || `${student.firstName} ${student.lastName}`
        };
        
        setDownloadingCert(mergedCert);
        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // wait for DOM render
            const element = document.getElementById('printable-certificate');
            if (!element) throw new Error("Could not find printable element");

            const originalStyle = element.style.cssText;
            element.style.padding = '18mm 20mm';
            element.style.width = '210mm';
            element.style.background = '#fff';

            const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
            element.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${cert.type}-Certificate-${cert.certificateNo.replace(/\//g, '-')}.pdf`);
        } catch (err) {
            console.error("Download failed", err);
            customAlert("Failed to download PDF.");
        } finally {
            setDownloadingCert(null);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading student profile...</div>;

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
    const feePercentage = student.totalFees > 0 ? Math.round((student.paidFees / student.totalFees) * 100) : 0;

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'academic', label: 'Academic', icon: GraduationCap },
        { id: 'parent', label: 'Parent/Guardian', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'certificates', label: 'Certificates', icon: Award },
    ];

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
                    <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Staff']}>
                        <Link to={`/students/edit/${student.id}`} className="btn btn-outline"><Edit size={16} /> Edit</Link>
                    </RoleGuard>
                    <Link to="/students" className="btn btn-outline"><ArrowLeft size={16} /> Back</Link>
                </div>
            </div>

            {/* Profile Card */}
            <div className="card profile-card">
                <div className="profile-top">
                    <div className="profile-avatar-lg" style={!student.photoUrl ? { background: avatarColor } : {}}>
                        {student.photoUrl ? (
                            <img src={student.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="profile-main-info">
                        <h2>{student.firstName} {student.lastName}</h2>
                        <span className="profile-class">Class {student.class} - Section {student.section} | Roll No: {student.rollNo}</span>
                        <div className="profile-badges">
                            {student.studentId && <span className="badge badge-primary">ID: {student.studentId}</span>}
                            <span className="badge badge-info">Adm: {student.admissionNo}</span>
                            <span className="badge badge-success">Batch: {student.batch}</span>
                            {student.status && student.status !== 'Active' && <span className="badge badge-danger">{student.status}</span>}
                            {student.newStudent && <span className="badge badge-warning">New Student</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="profile-tabs">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id} className={`profile-tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                            <Icon size={16} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="profile-tab-content animate-fade-in">
                {activeTab === 'personal' && (
                    <div className="detail-grid">
                        <div className="card detail-section">
                            <h3 className="detail-section-title"><User size={18} /> Personal Information</h3>
                            <div className="detail-list">
                                <div className="detail-item"><span className="detail-label">Gender</span><span className="detail-value">{student.gender}</span></div>
                                <div className="detail-item"><span className="detail-label">Date of Birth</span><span className="detail-value">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : '—'}</span></div>
                                <div className="detail-item"><span className="detail-label">Blood Group</span><span className="detail-value">{student.bloodGroup || '—'}</span></div>
                                <div className="detail-item"><span className="detail-label">Religion</span><span className="detail-value">{student.religion || '—'}</span></div>
                                <div className="detail-item"><span className="detail-label">Category</span><span className="detail-value">{student.category}</span></div>
                                <div className="detail-item"><span className="detail-label">Facility</span><span className="detail-value">{student.facility?.join(', ') || 'None'}</span></div>
                                <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value"><span className={`badge ${student.status==='Active' ? 'badge-success' : 'badge-danger'}`}>{student.status||'Active'}</span></span></div>
                            </div>
                        </div>
                        <div className="card detail-section">
                            <h3 className="detail-section-title"><Phone size={18} /> Contact Details</h3>
                            <div className="detail-list">
                                <div className="detail-item"><span className="detail-label"><Phone size={14} /> Phone</span><span className="detail-value">{student.contactNo}</span></div>
                                <div className="detail-item"><span className="detail-label"><Mail size={14} /> Email</span><span className="detail-value">{student.email || '—'}</span></div>
                                <div className="detail-item"><span className="detail-label"><MapPin size={14} /> Address</span><span className="detail-value">{student.address || '—'}</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'academic' && (
                    <div className="detail-grid">
                        <div className="card detail-section">
                            <h3 className="detail-section-title"><GraduationCap size={18} /> Academic Details</h3>
                            <div className="detail-list">
                                <div className="detail-item"><span className="detail-label">Class</span><span className="detail-value">{student.class}</span></div>
                                <div className="detail-item"><span className="detail-label">Section</span><span className="detail-value">{student.section}</span></div>
                                <div className="detail-item"><span className="detail-label">Roll No</span><span className="detail-value">{student.rollNo}</span></div>
                                <div className="detail-item"><span className="detail-label">Student ID</span><span className="detail-value">{student.studentId || '—'}</span></div>
                                <div className="detail-item"><span className="detail-label">Admission No</span><span className="detail-value">{student.admissionNo}</span></div>
                                <div className="detail-item"><span className="detail-label">Admission Date</span><span className="detail-value">{student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('en-IN') : '—'}</span></div>
                                <div className="detail-item"><span className="detail-label">Academic Year</span><span className="detail-value">{student.batch}</span></div>
                            </div>
                        </div>
                        <div className="card detail-section">
                            <h3 className="detail-section-title"><IndianRupee size={18} /> Fee Details</h3>
                            <div className="fee-overview">
                                <div className="fee-progress-wrap">
                                    <div className="fee-progress-bar">
                                        <div className="fee-progress-fill" style={{ width: `${feePercentage}%`, background: feePercentage >= 100 ? 'var(--success)' : feePercentage >= 50 ? 'var(--warning)' : 'var(--danger)' }} />
                                    </div>
                                    <span className="fee-progress-label">{feePercentage}% Paid</span>
                                </div>
                                <div className="fee-amounts">
                                    <div className="fee-amount-item"><span>Total Fees</span><strong>{formatCurrency(student.totalFees)}</strong></div>
                                    <div className="fee-amount-item"><span>Paid</span><strong style={{ color: 'var(--success)' }}>{formatCurrency(student.paidFees)}</strong></div>
                                    <div className="fee-amount-item"><span>Pending</span><strong style={{ color: 'var(--danger)' }}>{formatCurrency(student.totalFees - student.paidFees)}</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'parent' && (
                    <div className="detail-grid">
                        <div className="card detail-section">
                            <h3 className="detail-section-title"><Users size={18} /> Parent / Guardian Details</h3>
                            <div className="detail-list">
                                <div className="detail-item"><span className="detail-label">Father's Name</span><span className="detail-value">{student.fatherName}</span></div>
                                <div className="detail-item"><span className="detail-label">Mother's Name</span><span className="detail-value">{student.motherName || '—'}</span></div>
                                <div className="detail-item"><span className="detail-label">Guardian Phone</span><span className="detail-value">{student.guardianPhone || student.contactNo}</span></div>
                                <div className="detail-item"><span className="detail-label">Occupation</span><span className="detail-value">{student.guardianOccupation || '—'}</span></div>
                            </div>
                        </div>

                        {portalAuth && (
                            <div className="card detail-section" style={{ borderLeft: '4px solid var(--info)' }}>
                                <h3 className="detail-section-title" style={{ color: 'var(--info)' }}>🔐 Parent Portal Credentials</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '16px' }}>
                                    Provide these details to the parent so they can access their dedicated portal.
                                </p>
                                <div className="detail-list bg-light" style={{ padding: 16, borderRadius: 'var(--radius-sm)' }}>
                                    <div className="detail-item" style={{ borderBottom: 'none' }}>
                                        <span className="detail-label">Parent ID (Username)</span>
                                        <span className="detail-value fw-600 font-monospace">{portalAuth.id}</span>
                                    </div>
                                    <div className="detail-item" style={{ borderBottom: 'none' }}>
                                        <span className="detail-label">Password</span>
                                        <span className="detail-value fw-600 font-monospace">{portalAuth.password}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="card detail-section">
                        <AttendanceTabContent student={student} />
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="card detail-section">
                        <h3 className="detail-section-title"><FileText size={18} /> Documents</h3>
                        {(student.photoUrl || student.birthCertificateUrl || student.previousTcUrl) ? (
                            <div className="document-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', padding: '20px' }}>
                                {student.photoUrl && (
                                    <div className="doc-card" style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                        <img src={student.photoUrl} alt="Photo" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', marginBottom: '8px' }} />
                                        <div style={{ fontWeight: 600 }}>Photo</div>
                                    </div>
                                )}
                                {student.birthCertificateUrl && (
                                    <div className="doc-card" style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                        {student.birthCertificateUrl.startsWith('data:image') ? (
                                            <img src={student.birthCertificateUrl} alt="Birth Certificate" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', marginBottom: '8px' }} />
                                        ) : (
                                            <div style={{ padding: '40px 0' }}><FileText size={40} style={{ color: 'var(--text-light)' }}/></div>
                                        )}
                                        <div style={{ fontWeight: 600 }}>Birth Certificate</div>
                                        <a href={student.birthCertificateUrl} download="birth-certificate" style={{ display: 'inline-block', marginTop: '8px', color: 'var(--primary)', fontSize: '0.8rem' }}>Download</a>
                                    </div>
                                )}
                                {student.previousTcUrl && (
                                    <div className="doc-card" style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                        {student.previousTcUrl.startsWith('data:image') ? (
                                            <img src={student.previousTcUrl} alt="Previous TC" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', marginBottom: '8px' }} />
                                        ) : (
                                            <div style={{ padding: '40px 0' }}><FileText size={40} style={{ color: 'var(--text-light)' }}/></div>
                                        )}
                                        <div style={{ fontWeight: 600 }}>Previous TC</div>
                                        <a href={student.previousTcUrl} download="previous-tc" style={{ display: 'inline-block', marginTop: '8px', color: 'var(--primary)', fontSize: '0.8rem' }}>Download</a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state" style={{ padding: 40 }}>
                                <FileText size={48} />
                                <h3>No Documents Uploaded</h3>
                                <p>Upload photo, birth certificate, or previous TC from the Edit page.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'certificates' && (
                    <div className="card detail-section">
                        <h3 className="detail-section-title"><Award size={18} /> Issued Certificates</h3>
                        {certificates.length > 0 ? (
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead><tr><th>Certificate No</th><th>Type</th><th>Issue Date</th><th>Purpose</th><th style={{textAlign: 'right'}}>Action</th></tr></thead>
                                    <tbody>
                                        {certificates.map(c => (
                                            <tr key={c._id}>
                                                <td className="fw-600">{c.certificateNo}</td>
                                                <td><span className="badge badge-info">{c.type}</span></td>
                                                <td>{new Date(c.issueDate).toLocaleDateString('en-IN')}</td>
                                                <td>{c.purpose || '—'}</td>
                                                <td style={{textAlign: 'right'}}>
                                                    <button onClick={() => handleDownloadCert(c)} className="btn btn-outline" style={{padding: '4px 8px', fontSize: '0.8rem'}} disabled={downloadingCert && downloadingCert._id === c._id}>
                                                        <Download size={14} style={{marginRight: 4}}/> {downloadingCert && downloadingCert._id === c._id ? 'Generating...' : 'Download'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state" style={{ padding: 40 }}>
                                <Award size={48} />
                                <h3>No Certificates Issued</h3>
                                <p>Certificates will appear here once generated from the Certificates module.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Hidden container for rendering the certificate PDF */}
            {downloadingCert && (
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                    <FormalCertificate cert={downloadingCert} />
                </div>
            )}
        </div>
    );
}
