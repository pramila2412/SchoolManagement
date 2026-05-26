import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, BarChart3, LineChart, PieChart, Filter, FileText, Table2 } from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import { api } from '../utils/api';
import './StudentReports.css';

const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'undefined' || dateStr === 'null') return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-IN');
};

const cleanValue = (val) => {
    if (val === undefined || val === null || val === 'undefined' || val === 'null') return '';
    return String(val).trim();
};


// Simple chart components (since we don't have a charting library, we'll create basic visualizations)
const BarChartViz = ({ data, title }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="chart-container">
            <h4 className="chart-title">{title}</h4>
            <div className="bar-chart">
                {data.map((item, idx) => (
                    <div key={idx} className="bar-item">
                        <div className="bar-label">{item.label}</div>
                        <div className="bar-wrapper">
                            <div className="bar" style={{ height: `${(item.value / max) * 100}%`, backgroundColor: item.color || 'var(--primary)' }}>
                                <span className="bar-value">{item.value}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PieChartViz = ({ data, title }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let angle = -90;
    const slices = data.map((item, idx) => {
        const sliceAngle = (item.value / total) * 360;
        const start = angle;
        const end = angle + sliceAngle;
        angle = end;
        return { ...item, start, end };
    });

    return (
        <div className="chart-container">
            <h4 className="chart-title">{title}</h4>
            <div className="pie-chart-wrapper">
                <svg width="200" height="200" viewBox="0 0 200 200" className="pie-chart">
                    {slices.map((slice, idx) => {
                        const radius = 80;
                        const startRad = (slice.start * Math.PI) / 180;
                        const endRad = (slice.end * Math.PI) / 180;
                        const x1 = 100 + radius * Math.cos(startRad);
                        const y1 = 100 + radius * Math.sin(startRad);
                        const x2 = 100 + radius * Math.cos(endRad);
                        const y2 = 100 + radius * Math.sin(endRad);
                        const largeArc = slice.end - slice.start > 180 ? 1 : 0;
                        const pathData = `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                        return <path key={idx} d={pathData} fill={slice.color} stroke="white" strokeWidth="2" />;
                    })}
                </svg>
                <div className="pie-legend">
                    {data.map((item, idx) => (
                        <div key={idx} className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                            <span>{item.label}: {item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function StudentReports() {
    const [students, setStudents] = useState([]);
    const [filters, setFilters] = useState({
        class: '',
        section: '',
        gender: '',
        status: 'Active',
        startDate: '',
        endDate: ''
    });
    const [viewType, setViewType] = useState('summary'); // summary, table, charts
    const [reportType, setReportType] = useState('student'); // student, attendance
    const [attendanceData, setAttendanceData] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(false);

    // Load students from API and localStorage
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                let apiData = [];
                try {
                    apiData = await api.getStudents();
                } catch (apiErr) {
                    console.warn("Backend API unavailable in reports, using local storage only.", apiErr);
                }

                const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');

                const normalizedLocal = localData.map(s => {
                    const nameParts = (s.name || '').split(' ');
                    
                    // Parse class and section if class is in format "Class-Section" or "Grade Class-Section"
                    let cls = cleanValue(s.class);
                    let sec = cleanValue(s.section);
                    if (cls.includes('-')) {
                        const parts = cls.split('-');
                        cls = parts[0];
                        sec = parts[1] || sec;
                    }
                    
                    return {
                        ...s,
                        firstName: cleanValue(s.firstName || nameParts[0] || 'Unknown'),
                        lastName: cleanValue(s.lastName || nameParts.slice(1).join(' ')),
                        admissionNo: cleanValue(s.admissionNo || s.id || 'N/A'),
                        rollNo: cleanValue(s.rollNo || 'N/A'),
                        class: cls,
                        section: sec,
                        gender: cleanValue(s.gender),
                        fatherName: cleanValue(s.fatherName || s.parentName),
                        contactNo: cleanValue(s.contactNo || s.phone || s.guardianPhone),
                        admissionDate: cleanValue(s.admissionDate || s.feesStartDate || s.date),
                        feesStartDate: cleanValue(s.feesStartDate || s.admissionDate || s.date),
                        status: cleanValue(s.status || 'Active')
                    };
                });

                const allStudentsMap = new Map();
                
                // Add API students first (fully normalized)
                apiData.forEach(s => {
                    let cls = cleanValue(s.class);
                    let sec = cleanValue(s.section);
                    if (cls.includes('-')) {
                        const parts = cls.split('-');
                        cls = parts[0];
                        sec = parts[1] || sec;
                    }
                    
                    allStudentsMap.set(s.id || s.admissionNo, {
                        ...s,
                        firstName: cleanValue(s.firstName),
                        lastName: cleanValue(s.lastName),
                        admissionNo: cleanValue(s.admissionNo || s.id),
                        rollNo: cleanValue(s.rollNo),
                        class: cls,
                        section: sec,
                        gender: cleanValue(s.gender),
                        fatherName: cleanValue(s.fatherName || s.parentName),
                        contactNo: cleanValue(s.contactNo || s.phone || s.guardianPhone),
                        admissionDate: cleanValue(s.admissionDate || s.feesStartDate),
                        feesStartDate: cleanValue(s.feesStartDate || s.admissionDate),
                        status: cleanValue(s.status || 'Active')
                    });
                });

                // Merge with localStorage students
                normalizedLocal.forEach(s => {
                    const idKey = s.id || s.admissionNo;
                    if (!allStudentsMap.has(idKey)) {
                        allStudentsMap.set(idKey, s);
                    } else {
                        const existing = allStudentsMap.get(idKey);
                        allStudentsMap.set(idKey, {
                            ...existing,
                            ...s,
                            class: s.class || existing.class,
                            section: s.section || existing.section,
                            fatherName: s.fatherName || existing.fatherName,
                            contactNo: s.contactNo || existing.contactNo,
                            admissionDate: s.admissionDate || existing.admissionDate,
                            feesStartDate: s.feesStartDate || existing.feesStartDate
                        });
                    }
                });

                setStudents(Array.from(allStudentsMap.values()));
            } catch (err) {
                console.error("Failed to load students in reports:", err);
            }
        };
        fetchStudents();
    }, []);

    // Filter students based on applied filters
    const filteredStudents = useMemo(() => {
        let result = students.filter(s => {
            const status = s.status || 'Active';
            return status === (filters.status || 'Active');
        });

        if (filters.class) result = result.filter(s => s.class === filters.class);
        if (filters.section) result = result.filter(s => s.section === filters.section);
        if (filters.gender) result = result.filter(s => s.gender === filters.gender);

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            result = result.filter(s => {
                const dateStr = s.admissionDate;
                return dateStr && new Date(dateStr) >= startDate;
            });
        }
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            result = result.filter(s => {
                const dateStr = s.admissionDate;
                return dateStr && new Date(dateStr) <= endDate;
            });
        }

        return result;
    }, [students, filters]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = filteredStudents.length;
        const byGender = {
            Male: filteredStudents.filter(s => s.gender === 'Male').length,
            Female: filteredStudents.filter(s => s.gender === 'Female').length
        };
        const byClass = {};
        filteredStudents.forEach(s => {
            byClass[s.class] = (byClass[s.class] || 0) + 1;
        });
        const byStatus = {
            Active: students.filter(s => (s.status || 'Active') === 'Active').length,
            Inactive: students.filter(s => (s.status || 'Active') === 'Inactive').length,
            Left: students.filter(s => (s.status || 'Active') === 'Left').length
        };

        return { total, byGender, byClass, byStatus };
    }, [filteredStudents, students]);

    // Export to CSV
    const handleExportCSV = () => {
        let headers = [];
        let rows = [];

        if (reportType === 'attendance') {
            headers = ['Date', 'Total Students', 'Present', 'Absent', 'Late', 'Leave'];
            rows = attendanceData.map(r => {
                const p = r.entries.filter(e => e.status === 'Present').length;
                const a = r.entries.filter(e => e.status === 'Absent').length;
                const l = r.entries.filter(e => e.status === 'Late').length;
                const lv = r.entries.filter(e => e.status === 'Leave').length;
                return [
                    new Date(r.date).toLocaleDateString('en-IN'),
                    String(r.entries.length),
                    String(p),
                    String(a),
                    String(l),
                    String(lv)
                ];
            });
        } else {
            headers = ['Admission No', 'First Name', 'Last Name', 'Class', 'Section', 'Gender', 'Father Name', 'Contact No', 'Status', 'Admission Date', 'Fees Start Date'];
            rows = filteredStudents.map(s => [
                s.admissionNo || '',
                s.firstName || '',
                s.lastName || '',
                s.class || '',
                s.section || '',
                s.gender || '',
                s.fatherName || '',
                s.contactNo || '',
                s.status || 'Active',
                formatDate(s.admissionDate),
                formatDate(s.feesStartDate)
            ]);
        }

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell || ''}"`).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `student_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Fetch Attendance Data
    const fetchAttendanceReport = async () => {
        if (!filters.class) return customAlert('Please select a Class to fetch Attendance Report');
        setLoadingAttendance(true);
        try {
            const m = filters.startDate ? new Date(filters.startDate).getMonth() + 1 : new Date().getMonth() + 1;
            const y = filters.startDate ? new Date(filters.startDate).getFullYear() : new Date().getFullYear();
            const res = await fetch(`/api/attendance/report/monthly?class=${encodeURIComponent(filters.class)}&section=${filters.section}&month=${m}&year=${y}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setAttendanceData(data);
        } catch (err) {
            console.error(err);
            customAlert('Failed to load attendance report or no data available.');
            setAttendanceData([]);
        } finally {
            setLoadingAttendance(false);
        }
    };

    // Export to Excel (using CSV format with .xlsx extension for basic compatibility)
    const handleExportExcel = () => {
        let headers = [];
        let rows = [];

        if (reportType === 'attendance') {
            headers = ['Date', 'Total Students', 'Present', 'Absent', 'Late', 'Leave'];
            rows = attendanceData.map(r => {
                const p = r.entries.filter(e => e.status === 'Present').length;
                const a = r.entries.filter(e => e.status === 'Absent').length;
                const l = r.entries.filter(e => e.status === 'Late').length;
                const lv = r.entries.filter(e => e.status === 'Leave').length;
                return [
                    new Date(r.date).toLocaleDateString('en-IN'),
                    String(r.entries.length),
                    String(p),
                    String(a),
                    String(l),
                    String(lv)
                ];
            });
        } else {
            headers = ['Admission No', 'First Name', 'Last Name', 'Class', 'Section', 'Gender', 'Father Name', 'Contact No', 'Status', 'Admission Date', 'Fees Start Date'];
            rows = filteredStudents.map(s => [
                s.admissionNo || '',
                s.firstName || '',
                s.lastName || '',
                s.class || '',
                s.section || '',
                s.gender || '',
                s.fatherName || '',
                s.contactNo || '',
                s.status || 'Active',
                formatDate(s.admissionDate),
                formatDate(s.feesStartDate)
            ]);
        }

        let html = '<table border="1"><tr>';
        headers.forEach(h => html += `<th>${h}</th>`);
        html += '</tr>';
        rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => html += `<td>${cell || ''}</td>`);
            html += '</tr>';
        });
        html += '</table>';

        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `student_report_${new Date().toISOString().split('T')[0]}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Export to PDF
    const handleExportPDF = () => {
        const pdfContent = `
            <html>
            <head>
                <title>Student Report</title>
                <style>
                    * { margin: 0; padding: 0; }
                    body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                    h1 { color: #0B3C5D; border-bottom: 3px solid #0B3C5D; padding-bottom: 10px; margin-bottom: 20px; }
                    h2 { color: #0B3C5D; margin-top: 20px; margin-bottom: 15px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; page-break-inside: avoid; }
                    th { background: #0B3C5D; color: white; padding: 12px; text-align: left; font-weight: bold; }
                    td { padding: 10px; border-bottom: 1px solid #ddd; }
                    tr:nth-child(even) { background: #f9f9f9; }
                    tr:hover { background: #f0f0f0; }
                    .summary { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
                    .stat-box { padding: 15px; background: #f0f0f0; border-left: 4px solid #0B3C5D; flex: 1; min-width: 150px; }
                    .stat-number { font-size: 24px; font-weight: bold; color: #0B3C5D; }
                    .stat-label { font-size: 12px; color: #666; margin-bottom: 5px; }
                    @media print { body { padding: 0; margin: 0; } }
                </style>
            </head>
            <body>
                <h1>Student Report - ${new Date().toLocaleDateString('en-IN')}</h1>
                
                <h2>Summary Statistics</h2>
                <div class="summary">
                    <div class="stat-box">
                        <div class="stat-label">Total Students</div>
                        <div class="stat-number">${stats.total}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Male</div>
                        <div class="stat-number">${stats.byGender.Male}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Female</div>
                        <div class="stat-number">${stats.byGender.Female}</div>
                    </div>
                </div>

                <h2>Student Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Admission No</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Gender</th>
                            <th>Father Name</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Admission Date</th>
                            <th>Fees Start Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredStudents.map(s => `
                            <tr>
                                <td>${s.admissionNo || ''}</td>
                                <td>${s.firstName || ''} ${s.lastName || ''}</td>
                                <td>${s.class || ''}</td>
                                <td>${s.section || ''}</td>
                                <td>${s.gender || ''}</td>
                                <td>${s.fatherName || ''}</td>
                                <td>${s.contactNo || ''}</td>
                                <td>${s.status || 'Active'}</td>
                                <td>${formatDate(s.admissionDate)}</td>
                                <td>${formatDate(s.feesStartDate)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        let attendancePdfContent = `
            <html>
            <head>
                <title>Attendance Report</title>
                <style>
                    * { margin: 0; padding: 0; }
                    body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                    h1 { color: #0B3C5D; border-bottom: 3px solid #0B3C5D; padding-bottom: 10px; margin-bottom: 20px; }
                    h2 { color: #0B3C5D; margin-top: 20px; margin-bottom: 15px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; page-break-inside: avoid; }
                    th { background: #0B3C5D; color: white; padding: 12px; text-align: left; font-weight: bold; }
                    td { padding: 10px; border-bottom: 1px solid #ddd; }
                    tr:nth-child(even) { background: #f9f9f9; }
                    @media print { body { padding: 0; margin: 0; } }
                </style>
            </head>
            <body>
                <h1>Attendance Report - Class ${filters.class || 'All'} - Section ${filters.section || 'All'}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Total Students</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Late</th>
                            <th>Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${attendanceData.map(r => {
                            const p = r.entries.filter(e => e.status === 'Present').length;
                            const a = r.entries.filter(e => e.status === 'Absent').length;
                            const l = r.entries.filter(e => e.status === 'Late').length;
                            const lv = r.entries.filter(e => e.status === 'Leave').length;
                            return `
                            <tr>
                                <td>${new Date(r.date).toLocaleDateString('en-IN')}</td>
                                <td>${r.entries.length}</td>
                                <td>${p}</td>
                                <td>${a}</td>
                                <td>${l}</td>
                                <td>${lv}</td>
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const finalContent = reportType === 'attendance' ? attendancePdfContent : pdfContent;

        const newWindow = window.open('', '_blank');
        newWindow.document.write(finalContent);
        newWindow.document.close();
        setTimeout(() => {
            newWindow.print();
        }, 250);
    };

    // Get unique values for dropdowns
    const classes = ['Nursery','LKG','UKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
    const sections = ['A','B','C','D'];

    return (
        <div className="student-reports-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <Link to="/students">Students</Link>
                        <span className="separator">/</span>
                        <span>Reports & Analytics</span>
                    </div>
                    <h1>Student Reports & Analytics</h1>
                </div>
                <Link to="/students" className="btn btn-outline">
                    <ArrowLeft size={16} /> Back to Students
                </Link>
            </div>

            {/* Report Type Selector */}
            <div className="card filters-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <h3 className="section-title" style={{ margin: 0, padding: 0, border: 'none' }}>Report Type:</h3>
                    <select className="form-select" value={reportType} onChange={e => setReportType(e.target.value)} style={{ width: '250px' }}>
                        <option value="student">Student Details Report</option>
                        <option value="attendance">Attendance Report</option>
                    </select>
                </div>
            </div>

            {/* Filters */}
            <div className="card filters-card">
                <h3 className="section-title"><Filter size={18} /> Filters</h3>
                <div className="filters-grid">
                    <div className="form-group">
                        <label className="form-label">Class</label>
                        <select className="form-select" value={filters.class} onChange={e => setFilters({ ...filters, class: e.target.value })}>
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Section</label>
                        <select className="form-select" value={filters.section} onChange={e => setFilters({ ...filters, section: e.target.value })}>
                            <option value="">All Sections</option>
                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select className="form-select" value={filters.gender} onChange={e => setFilters({ ...filters, gender: e.target.value })}>
                            <option value="">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select className="form-select" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Left">Left</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Admission Date From</label>
                        <input type="date" className="form-input" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Admission Date To</label>
                        <input type="date" className="form-input" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
                    </div>
                </div>
                {reportType === 'attendance' && (
                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={fetchAttendanceReport} disabled={loadingAttendance}>
                            {loadingAttendance ? 'Loading...' : 'Fetch Attendance'}
                        </button>
                    </div>
                )}
            </div>

            {/* Export Buttons */}
            <div className="export-buttons" style={{ marginBottom: 24 }}>
                <button className="btn btn-outline" onClick={handleExportCSV} title="Export as CSV">
                    <Download size={16} /> CSV
                </button>
                <button className="btn btn-outline" onClick={handleExportExcel} title="Export as Excel">
                    <Download size={16} /> Excel
                </button>
                <button className="btn btn-primary" onClick={handleExportPDF} title="Export as PDF">
                    <Download size={16} /> PDF
                </button>
            </div>

            {/* View Type Tabs */}
            <div className="view-tabs">
                <button className={`tab-btn ${viewType === 'summary' ? 'active' : ''}`} onClick={() => setViewType('summary')}>
                    <BarChart3 size={16} /> Summary
                </button>
                <button className={`tab-btn ${viewType === 'table' ? 'active' : ''}`} onClick={() => setViewType('table')}>
                    <Table2 size={16} /> Detailed View
                </button>
                <button className={`tab-btn ${viewType === 'charts' ? 'active' : ''}`} onClick={() => setViewType('charts')}>
                    <LineChart size={16} /> Visualizations
                </button>
            </div>

            {/* Summary View */}
            {viewType === 'summary' && (
                <div className="summary-section">
                    <div className="stat-cards">
                        <div className="stat-card">
                            <div className="stat-label">Total Students</div>
                            <div className="stat-value">{stats.total}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Male</div>
                            <div className="stat-value">{stats.byGender.Male}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Female</div>
                            <div className="stat-value">{stats.byGender.Female}</div>
                        </div>
                    </div>

                    <div className="status-breakdown">
                        <h3 className="section-title">Status Breakdown</h3>
                        <div className="status-items">
                            <div className="status-item">
                                <span className="status-label">Active</span>
                                <span className="status-count badge badge-success">{stats.byStatus.Active}</span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Inactive</span>
                                <span className="status-count badge badge-draft">{stats.byStatus.Inactive}</span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Left</span>
                                <span className="status-count badge badge-danger">{stats.byStatus.Left}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Table View */}
            {viewType === 'table' && reportType === 'student' && (
                <div className="card table-card">
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Admission No</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Gender</th>
                                    <th>Father Name</th>
                                    <th>Contact No</th>
                                    <th>Status</th>
                                    <th>Admission Date</th>
                                    <th>Fees Start Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map(s => {
                                        return (
                                            <tr key={s.id || s._id}>
                                                <td className="fw-600">{s.admissionNo || ''}</td>
                                                <td>{s.firstName || ''} {s.lastName || ''}</td>
                                                <td>{s.class || ''}</td>
                                                <td>{s.section || ''}</td>
                                                <td>{s.gender || ''}</td>
                                                <td>{s.fatherName || ''}</td>
                                                <td>{s.contactNo || ''}</td>
                                                <td><span className={`badge badge-${(s.status || 'active').toLowerCase()}`}>{s.status || 'Active'}</span></td>
                                                <td>{formatDate(s.admissionDate)}</td>
                                                <td>{formatDate(s.feesStartDate)}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No students found matching the filters</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {viewType === 'table' && reportType === 'attendance' && (
                <div className="card table-card">
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Total Students</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Late</th>
                                    <th>Leave</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.length > 0 ? (
                                    attendanceData.map(r => {
                                        const p = r.entries.filter(e => e.status === 'Present').length;
                                        const a = r.entries.filter(e => e.status === 'Absent').length;
                                        const l = r.entries.filter(e => e.status === 'Late').length;
                                        const lv = r.entries.filter(e => e.status === 'Leave').length;
                                        return (
                                            <tr key={r._id || r.date}>
                                                <td className="fw-600">{new Date(r.date).toLocaleDateString('en-IN')}</td>
                                                <td>{r.entries.length}</td>
                                                <td style={{color: 'var(--success)', fontWeight: 600}}>{p}</td>
                                                <td style={{color: 'var(--danger)', fontWeight: 600}}>{a}</td>
                                                <td style={{color: 'var(--warning)', fontWeight: 600}}>{l}</td>
                                                <td>{lv}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No attendance data fetched. Select a class and click Fetch Attendance.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Charts View */}
            {viewType === 'charts' && (
                <div className="charts-section">
                    <div className="charts-grid">
                        <div className="chart-card">
                            <BarChartViz
                                data={Object.entries(stats.byGender).map(([label, value]) => ({
                                    label,
                                    value,
                                    color: label === 'Male' ? '#3b82f6' : '#ec4899'
                                }))}
                                title="Students by Gender"
                            />
                        </div>
                        <div className="chart-card">
                            <PieChartViz
                                data={Object.entries(stats.byClass).map(([label, value]) => ({
                                    label,
                                    value,
                                    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
                                }))}
                                title="Distribution by Class"
                            />
                        </div>
                    </div>
                    <div className="chart-card full-width">
                        <BarChartViz
                            data={Object.entries(stats.byStatus).map(([label, value]) => ({
                                label,
                                value,
                                color: label === 'Active' ? 'var(--success)' : label === 'Inactive' ? 'var(--warning)' : 'var(--danger)'
                            }))}
                            title="Student Status Distribution"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
