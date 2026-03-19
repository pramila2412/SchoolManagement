import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Eye, Check, X, Clock, HelpCircle, Save, RotateCcw } from 'lucide-react';
import './Attendance.css';

export default function Attendance() {
    const [formData, setFormData] = useState({
        class: 'Class 1',
        section: 'A',
        period: 'Period 1',
        date: '2026-03-17'
    });
    const [showListing, setShowListing] = useState(false);
    const [students, setStudents] = useState([]);

    const handleView = (e) => {
        e.preventDefault();
        // Mock data when View is clicked
        const mockStudents = [
            { id: 1, name: 'Aarav Sharma', admissionNo: 'ADM-2024-001', status: 'Unmarked' },
            { id: 2, name: 'Priya Patel', admissionNo: 'ADM-2024-002', status: 'Unmarked' },
            { id: 3, name: 'Rahul Kumar', admissionNo: 'ADM-2024-003', status: 'Unmarked' },
            { id: 4, name: 'Sneha Gupta', admissionNo: 'ADM-2024-004', status: 'Unmarked' },
            { id: 5, name: 'Vikram Singh', admissionNo: 'ADM-2024-005', status: 'Unmarked' },
            { id: 6, name: 'Ananya Reddy', admissionNo: 'ADM-2024-006', status: 'Unmarked' },
            { id: 7, name: 'Arjun Mehta', admissionNo: 'ADM-2024-007', status: 'Unmarked' },
            { id: 8, name: 'Kavya Nair', admissionNo: 'ADM-2024-008', status: 'Unmarked' },
            { id: 9, name: 'Rohan Joshi', admissionNo: 'ADM-2024-009', status: 'Unmarked' },
            { id: 10, name: 'Meera Iyer', admissionNo: 'ADM-2024-010', status: 'Unmarked' },
            { id: 11, name: 'Aditya Verma', admissionNo: 'ADM-2024-011', status: 'Unmarked' },
            { id: 12, name: 'Diya Chopra', admissionNo: 'ADM-2024-012', status: 'Unmarked' }
        ];
        setStudents(mockStudents);
        setShowListing(true);
    };

    const updateStatus = (id, newStatus) => {
        setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const markAllPresent = () => {
        setStudents(students.map(s => ({ ...s, status: 'Present' })));
    };

    const resetAttendance = () => {
        setStudents(students.map(s => ({ ...s, status: 'Unmarked' })));
    };

    // Derived counts
    const total = students.length;
    const present = students.filter(s => s.status === 'Present').length;
    const absent = students.filter(s => s.status === 'Absent').length;
    const late = students.filter(s => s.status === 'Late').length;
    const leave = students.filter(s => s.status === 'Leave').length;
    const unmarked = students.filter(s => s.status === 'Unmarked').length;

    return (
        <div className="attendance-page animate-fade-in">
            {/* The main card container matching the screenshot */}
            <div className="attendance-container">
                <div className="attendance-header">
                    <Edit2 size={20} className="header-icon" />
                    <h2>Add Attendance</h2>
                </div>

                <div className="attendance-card">
                    <form onSubmit={handleView}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Class</label>
                                <select 
                                    className="form-select" 
                                    value={formData.class} 
                                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                                >
                                    <option value="">Select Class</option>
                                    {[...Array(10)].map((_, i) => (
                                        <option key={`class-${i+1}`} value={`Class ${i+1}`}>Class {i+1}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Section</label>
                                <select 
                                    className="form-select" 
                                    value={formData.section} 
                                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                                >
                                    <option value="">Select Section</option>
                                    {['A', 'B', 'C', 'D'].map(sec => (
                                        <option key={sec} value={sec}>{sec}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Period</label>
                                <select 
                                    className="form-select" 
                                    value={formData.period} 
                                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                                >
                                    <option value="">Select Period</option>
                                    {[...Array(8)].map((_, i) => (
                                        <option key={`period-${i+1}`} value={`Period ${i+1}`}>Period {i+1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row date-row">
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <div className="date-input-wrapper">
                                    <input 
                                        type="date" 
                                        className="form-input" 
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary view-btn">
                                <Eye size={18} /> View
                            </button>
                        </div>
                    </form>
                </div>

                {showListing && (
                    <div className="attendance-listing animate-fade-in" style={{ marginTop: 24 }}>
                        {/* Summary Cards */}
                        <div className="summary-cards">
                            <div className="summary-card sum-total">
                                <div className="sum-count">{total}</div>
                                <div className="sum-label">Total</div>
                            </div>
                            <div className="summary-card sum-present">
                                <div className="sum-count">{present}</div>
                                <div className="sum-label">Present</div>
                            </div>
                            <div className="summary-card sum-absent">
                                <div className="sum-count">{absent}</div>
                                <div className="sum-label">Absent</div>
                            </div>
                            <div className="summary-card sum-late">
                                <div className="sum-count">{late}</div>
                                <div className="sum-label">Late</div>
                            </div>
                            <div className="summary-card sum-leave">
                                <div className="sum-count">{leave}</div>
                                <div className="sum-label">Leave</div>
                            </div>
                            <div className="summary-card sum-unmarked">
                                <div className="sum-count">{unmarked}</div>
                                <div className="sum-label">Unmarked</div>
                            </div>
                        </div>

                        {/* Attendance Table Card */}
                        <div className="attendance-table-card card" style={{ marginTop: 24 }}>
                            <div className="table-header-custom" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>{formData.class} — Section {formData.section}</h3>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-grey)' }}>{formData.period} • {new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button className="btn btn-outline btn-sm action-btn" onClick={markAllPresent}>
                                        <Check size={16} /> Mark All Present
                                    </button>
                                    <button className="btn btn-outline btn-sm action-btn" onClick={resetAttendance}>
                                        <RotateCcw size={16} /> Reset
                                    </button>
                                </div>
                            </div>

                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Roll No</th>
                                            <th>Student Name</th>
                                            <th>Admission No</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(student => (
                                            <tr key={student.id}>
                                                <td className="td-bold">{student.id}</td>
                                                <td className="td-bold">{student.name}</td>
                                                <td>{student.admissionNo}</td>
                                                <td>
                                                    <span className={`status-pill pill-${student.status.toLowerCase()}`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="attendance-action-group">
                                                        <button 
                                                            className={`att-btn btn-present ${student.status === 'Present' ? 'active' : ''}`}
                                                            onClick={() => updateStatus(student.id, 'Present')}
                                                            title="Present"
                                                        >
                                                            <Check size={14} /> P
                                                        </button>
                                                        <button 
                                                            className={`att-btn btn-absent ${student.status === 'Absent' ? 'active' : ''}`}
                                                            onClick={() => updateStatus(student.id, 'Absent')}
                                                            title="Absent"
                                                        >
                                                            <X size={14} /> A
                                                        </button>
                                                        <button 
                                                            className={`att-btn btn-late ${student.status === 'Late' ? 'active' : ''}`}
                                                            onClick={() => updateStatus(student.id, 'Late')}
                                                            title="Late"
                                                        >
                                                            <Clock size={14} /> L
                                                        </button>
                                                        <button 
                                                            className={`att-btn btn-leave ${student.status === 'Leave' ? 'active' : ''}`}
                                                            onClick={() => updateStatus(student.id, 'Leave')}
                                                            title="Leave"
                                                        >
                                                            Lv
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Save Button Row */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}>
                                <Save size={18} /> Save Attendance
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
