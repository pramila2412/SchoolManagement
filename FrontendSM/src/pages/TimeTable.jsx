import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, UserCheck, Plus, Trash2 } from 'lucide-react';
import { customAlert, customConfirm } from '../utils/dialogs';
import './TimeTable.css';

export default function TimeTable() {
    const [activeTab, setActiveTab] = useState('view'); // 'view', 'generate', 'substitution'
    const [timetable, setTimetable] = useLocalStorage('timetable_schedule', {
        class: 'VII-A',
        schedule: [
            { period: 1, time: '08:30 - 09:15', monday: 'Math', tuesday: 'English', wednesday: 'Science', thursday: 'SST', friday: 'Hindi' },
            { period: 2, time: '09:15 - 10:00', monday: 'Science', tuesday: 'Math', wednesday: 'English', thursday: 'Hindi', friday: 'SST' },
            { period: 3, time: '10:00 - 10:45', monday: 'English', tuesday: 'Science', wednesday: 'Math', thursday: 'Computer', friday: 'Games' },
            { period: 4, time: '11:00 - 11:45', monday: 'Hindi', tuesday: 'SST', wednesday: 'Computer', thursday: 'Math', friday: 'Science' },
        ]
    });

    const [substitutions, setSubstitutions] = useLocalStorage('timetable_substitutions', [
        { id: 1, absentTeacher: 'Mr. Sharma', class: 'VII-A', period: 1, substitute: 'Ms. Verma', status: 'Approved' },
        { id: 2, absentTeacher: 'Mrs. Gupta', class: 'VIII-B', period: 3, substitute: 'Mr. Roy', status: 'Pending' }
    ]);

    const handleDeleteSubstitution = async (id) => {
        if (await customConfirm("Delete this substitution record?")) {
            setSubstitutions(prev => prev.filter(s => s.id !== id));
            await customAlert('Substitution deleted.');
        }
    };

    const handleViewSubstitution = (s) => {
        customAlert(`
            Substitution Details
            ---------------------
            Absent Teacher: ${s.absentTeacher}
            Class: ${s.class}
            Period: ${s.period}
            Substitute: ${s.substitute}
            Status: ${s.status}
        `);
    };

    const handleGenerate = () => {
        customAlert("Timetable generation algorithm initiated! This will take a few seconds to optimize teacher-period constraints...");
    };

    return (
        <div className="timetable-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Academics</span>
                        <span className="separator">/</span>
                        <span>Time Table</span>
                    </div>
                    <h1>Time Table & Substitution</h1>
                </div>
                <div>
                    <Link to="/" className="btn btn-outline">
                        <ArrowLeft size={16} /> Back
                    </Link>
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="page-tabs" style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
                <button className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>View Timetable</button>
                <button className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`} onClick={() => setActiveTab('generate')}>Generate Timetable</button>
                <button className={`tab-btn ${activeTab === 'substitution' ? 'active' : ''}`} onClick={() => setActiveTab('substitution')}>Manage Substitution</button>
            </div>

            {activeTab === 'view' && (
                <div className="card animate-slide-up">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Class Timetable</h3>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <select className="form-select" style={{ width: 120 }}>
                                <option value="VII-A">Class VII-A</option>
                                <option value="VIII-B">Class VIII-B</option>
                            </select>
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table timetable">
                            <thead>
                                <tr>
                                    <th>Period</th>
                                    <th>Timing</th>
                                    <th>Monday</th>
                                    <th>Tuesday</th>
                                    <th>Wednesday</th>
                                    <th>Thursday</th>
                                    <th>Friday</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timetable.schedule.map(row => (
                                    <tr key={row.period}>
                                        <td className="td-bold">Period {row.period}</td>
                                        <td>{row.time}</td>
                                        <td><div className="subject-box">{row.monday}</div></td>
                                        <td><div className="subject-box">{row.tuesday}</div></td>
                                        <td><div className="subject-box">{row.wednesday}</div></td>
                                        <td><div className="subject-box">{row.thursday}</div></td>
                                        <td><div className="subject-box">{row.friday}</div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'generate' && (
                <div className="card animate-slide-up" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: 'var(--primary)' }}>Generate Automated Timetable</h3>
                    <p style={{ color: 'var(--text-grey)', marginBottom: 20 }}>Select options to generate or regenerate the timetable structure.</p>
                    <form>
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Batch <span className="required">*</span></label>
                                <select className="form-select" required>
                                    <option value="">Select Batch</option>
                                    <option value="2025-26">2025-26</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Time Table Type</label>
                                <select className="form-select">
                                    <option value="Regular">Regular</option>
                                    <option value="Exam">Exam</option>
                                </select>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleGenerate}><Plus size={16} /> Generate Now</button>
                    </form>
                </div>
            )}

            {activeTab === 'substitution' && (
                <div className="card animate-slide-up">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Teacher Substitution Management</h3>
                        <button className="btn btn-primary btn-sm" style={{ padding: '6px 12px', fontSize: '0.85rem' }}><UserCheck size={14} style={{ marginRight: 4 }} /> Add Substitution</button>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Absent Teacher</th>
                                    <th>Class</th>
                                    <th>Period</th>
                                    <th>Substitute</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {substitutions.map(s => (
                                    <tr key={s.id}>
                                        <td className="td-bold">{s.absentTeacher}</td>
                                        <td>{s.class}</td>
                                        <td>Period {s.period}</td>
                                        <td><span style={{ color: 'var(--primary)', fontWeight: 500 }}>{s.substitute}</span></td>
                                        <td><span className={`badge ${s.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{s.status}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="btn-icon" style={{ color: 'var(--info)' }} onClick={() => handleViewSubstitution(s)} title="View Detail"><Clock size={16} /></button>
                                                <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteSubstitution(s.id)} title="Delete"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
