import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams, useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
    BarChart3, Users, UserPlus, CalendarCheck, Clock, Briefcase,
    FileText, Star, Settings, Download, PlusCircle, Search,
    CheckCircle2, XCircle, Eye, TrendingUp, TrendingDown,
    IndianRupee, ClipboardCheck, UserCheck, AlertTriangle, Mail,
    Calendar, Upload, Timer, Filter, ShieldCheck, X, Lock, Unlock
} from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import PhoneInput from '../components/PhoneInput';
import { useAuth } from '../context/AuthContext';
import './HR.css';

// ======================== DASHBOARD ========================
function DashboardTab() {
    const navigate = useNavigate();
    const [staff] = useLocalStorage('mzs_staff', []);
    
    // KPI Logic
    const totalStaff = staff.filter(s => s.status === 'Active').length || 128;
    // Mock values for UI purposes as real DB integration is not present yet
    const presentToday = 112; 
    const onLeaveToday = 9;
    const pendingLeave = 5;
    const payrollThisMonth = '₹ 18,40,000';
    const openJobs = 3;

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><BarChart3 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> HR Overview</h3>
            <div className="hr-quick-actions">
                <button className="hr-quick-btn" onClick={() => navigate('/hr/staff?action=add')}><UserPlus size={16} color="var(--primary)"/> Add Staff</button>
                <button className="hr-quick-btn" onClick={() => navigate('/hr/attendance')}><CalendarCheck size={16} color="var(--success)"/> Mark Attendance</button>
                <button className="hr-quick-btn" onClick={() => navigate('/hr/leave')}><FileText size={16} color="var(--info)"/> Apply Leave (Admin)</button>
                <button className="hr-quick-btn" onClick={() => navigate('/hr/payroll')}><IndianRupee size={16} color="var(--warning)"/> Run Payroll</button>
                <button className="hr-quick-btn" onClick={() => navigate('/hr/recruitment')}><Briefcase size={16} color="var(--danger)"/> Post Job</button>
            </div>
            <div className="hr-dashboard-grid">
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Total Staff</h4><p>{totalStaff}</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--info-light)' }}><Users size={22} color="var(--info)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Present Today</h4><p className="success">{presentToday}</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={22} color="var(--success)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>On Leave Today</h4><p className="warning">{onLeaveToday}</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--warning-light)' }}><Calendar size={22} color="var(--warning)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Pending Leave Requests</h4><p className="danger">{pendingLeave}</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--danger-light)' }}><AlertTriangle size={22} color="var(--danger)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Payroll This Month</h4><p>{payrollThisMonth}</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--success-light)' }}><IndianRupee size={22} color="var(--success)"/></div>
                </div>
                <div className="hr-kpi-card">
                    <div className="hr-kpi-info"><h4>Open Job Positions</h4><p>{openJobs}</p></div>
                    <div className="hr-kpi-icon" style={{ background: 'var(--info-light)' }}><Briefcase size={22} color="var(--info)"/></div>
                </div>
            </div>
        </div>
    );
}

// ======================== STAFF MANAGEMENT ========================
function StaffTab() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [staff, setStaff] = useLocalStorage('mzs_staff', [
        { id: 'EMP-2024-001', name: 'Rajesh Kumar', role: 'Teacher', dept: 'Mathematics', type: 'Full-time', status: 'Active', joined: '2020-06-15', email: 'rajesh@school.com', phone: '9876543210', dob: '1985-04-12', address: '123 Main St', gender: 'Male' },
        { id: 'EMP-2024-002', name: 'Priya Sharma', role: 'Admin', dept: 'Administration', type: 'Full-time', status: 'Active', joined: '2019-04-01', email: 'priya@school.com', phone: '8765432109', dob: '1988-08-22', address: '456 Cross St', gender: 'Female' },
        { id: 'EMP-2024-003', name: 'Suresh Babu', role: 'Driver', dept: 'Transport', type: 'Contract', status: 'Active', joined: '2023-01-10', email: '', phone: '', dob: '', address: '', gender: 'Male' },
        { id: 'EMP-2024-004', name: 'Anita Verma', role: 'Counsellor', dept: 'Student Welfare', type: 'Part-time', status: 'Active', joined: '2022-08-20', email: '', phone: '', dob: '', address: '', gender: 'Female' },
        { id: 'EMP-2024-005', name: 'Mohan Das', role: 'Teacher', dept: 'Science', type: 'Full-time', status: 'Active', joined: '2021-07-01', email: '', phone: '', dob: '', address: '', gender: 'Male' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('All Departments');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [showSearch, setShowSearch] = useState(false);

    const [selectedProfile, setSelectedProfile] = useState(null);

    const filteredStaff = staff.filter(s => {
        if (['Staff', 'Teacher'].includes(user?.role) && s.email !== user?.email && s.name !== user?.name) {
            return false;
        }
        const term = searchTerm.toLowerCase();
        const matchSearch = !term || `${s.name} ${s.id} ${s.role}`.toLowerCase().includes(term);
        const matchDept = deptFilter === 'All Departments' || s.dept === deptFilter;
        const matchType = typeFilter === 'All Types' || s.type === typeFilter;
        return matchSearch && matchDept && matchType;
    });

    const handleSearch = () => {};

    const [isAdding, setIsAdding] = useState(searchParams.get('action') === 'add');
    const [staffForm, setStaffForm] = useState({
        firstName: '', lastName: '', email: '', phone: '', dob: '', gender: 'Male', address: '',
        role: 'Teacher', dept: 'Mathematics', type: 'Full-time', joined: '',
        basicSalary: '', hra: '', ta: '', da: '', pf: '', tds: '', otherDeductions: '',
        bankName: '', accountName: '', accountNo: '', ifsc: ''
    });

    // Auto-map roles based on employment type
    useEffect(() => {
        if (staffForm.type === 'Part-time' && !['Visiting Teacher', 'Counsellor'].includes(staffForm.role)) {
            setStaffForm(f => ({ ...f, role: 'Visiting Teacher' }));
        } else if (staffForm.type === 'Contract' && !['Driver', 'Security', 'Housekeeping'].includes(staffForm.role)) {
            setStaffForm(f => ({ ...f, role: 'Driver' }));
        } else if (staffForm.type === 'Full-time' && !['Teacher', 'Admin', 'Principal', 'Accountant'].includes(staffForm.role)) {
            setStaffForm(f => ({ ...f, role: 'Teacher' }));
        }
    }, [staffForm.type]);

    const navigate = useNavigate();
    const closeAdd = () => {
        setIsAdding(false);
        navigate('/hr/staff');
    };

    const generateEmpId = () => {
        const year = new Date().getFullYear();
        const existing = staff.filter(s => s.id.includes(`EMP-${year}`));
        const nextNum = String(existing.length + 1).padStart(3, '0');
        return `EMP-${year}-${nextNum}`;
    };

    const handleSaveStaff = async () => {
        if (!staffForm.firstName.trim()) {
            await customAlert('Please enter the staff member\'s first name.', 'Validation Error', 'error');
            return;
        }
        if (!staffForm.role.trim()) {
            await customAlert('Please select or enter the role.', 'Validation Error', 'error');
            return;
        }
        const newStaff = {
            id: generateEmpId(),
            name: `${staffForm.firstName.trim()} ${staffForm.lastName.trim()}`.trim(),
            email: staffForm.email.trim(),
            phone: staffForm.phone.trim(),
            dob: staffForm.dob,
            gender: staffForm.gender,
            dept: staffForm.dept,
            role: staffForm.role.trim(),
            type: staffForm.type,
            joined: staffForm.joined || new Date().toISOString().split('T')[0],
            address: staffForm.address.trim(),
            status: 'Active',
            salaryDetails: {
                basic: staffForm.basicSalary,
                hra: staffForm.hra,
                ta: staffForm.ta,
                da: staffForm.da,
                pf: staffForm.pf,
                tds: staffForm.tds,
                other: staffForm.otherDeductions
            },
            bankDetails: {
                bankName: staffForm.bankName,
                accountName: staffForm.accountName,
                accountNo: staffForm.accountNo,
                ifsc: staffForm.ifsc
            }
        };
        setStaff(prev => [...prev, newStaff]);
        await customAlert(`Staff member "${newStaff.name}" added successfully! (ID: ${newStaff.id})`, 'Success', 'success');
        closeAdd();
    };

    const allDepts = [...new Set(staff.map(s => s.dept))];

    return (
        <div className="animate-fade-in">
            {selectedProfile && (
                <StaffProfileModal staff={selectedProfile} onClose={() => setSelectedProfile(null)} />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Users size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Staff Directory</h3>
                {isAdding ? (
                    <button className="btn btn-outline" onClick={closeAdd}>Back to List</button>
                ) : (
                    <div style={{ display: 'flex', gap: 10 }}>
                        {!['Staff', 'Teacher'].includes(user?.role) && <button className="btn btn-outline" onClick={() => { setShowSearch(!showSearch); if (showSearch) { setSearchTerm(''); setDeptFilter('All Departments'); setTypeFilter('All Types'); } }}><Search size={16}/> {showSearch ? 'Hide Search' : 'Search'}</button>}
                        {!['Staff', 'Teacher'].includes(user?.role) && <button className="btn btn-primary" onClick={() => setIsAdding(true)}><UserPlus size={16}/> Add Staff</button>}
                    </div>
                )}
            </div>

            {isAdding ? (
                <div className="hr-form-panel animate-fade-in" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 24, color: 'var(--primary)' }}>Add New Staff Member</h3>
                    
                    <div style={{ marginBottom: 30, background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e9ecef' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: 16, borderBottom: '1px solid #e9ecef', paddingBottom: 8 }}>Section A: Personal Details</h4>
                        <div className="ado-form form-row-2">
                            <div className="form-group"><label className="form-label">First Name *</label><input type="text" className="form-input" placeholder="First Name" value={staffForm.firstName} onChange={e => setStaffForm({...staffForm, firstName: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-input" placeholder="Last Name" value={staffForm.lastName} onChange={e => setStaffForm({...staffForm, lastName: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Date of Birth</label><input type="date" className="form-input" value={staffForm.dob} onChange={e => setStaffForm({...staffForm, dob: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Gender</label><select className="form-select" value={staffForm.gender} onChange={e => setStaffForm({...staffForm, gender: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div>
                            <div className="form-group"><label className="form-label">Mobile Number *</label><PhoneInput className="form-input" placeholder="Enter mobile number" value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Email Address</label><input type="email" className="form-input" placeholder="Enter email address" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})}/></div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">Address</label><textarea className="form-input" rows={2} placeholder="Full address" value={staffForm.address} onChange={e => setStaffForm({...staffForm, address: e.target.value})}></textarea></div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">Staff Photo</label><input type="file" className="form-input" accept="image/*" /></div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 30, background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e9ecef' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: 16, borderBottom: '1px solid #e9ecef', paddingBottom: 8 }}>Section B: Job Details</h4>
                        <div className="ado-form form-row-2">
                            <div className="form-group"><label className="form-label">Employee ID</label><input type="text" className="form-input" value="Auto-generated on save" disabled style={{ background: '#e9ecef' }}/></div>
                            <div className="form-group"><label className="form-label">Employment Type *</label><select className="form-select" value={staffForm.type} onChange={e => setStaffForm({...staffForm, type: e.target.value})}><option>Full-time</option><option>Part-time</option><option>Contract</option></select></div>
                            <div className="form-group"><label className="form-label">Role *</label><select className="form-select" value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})}>
                                {staffForm.type === 'Full-time' && <><option>Teacher</option><option>Admin</option><option>Principal</option><option>Accountant</option></>}
                                {staffForm.type === 'Part-time' && <><option>Visiting Teacher</option><option>Counsellor</option></>}
                                {staffForm.type === 'Contract' && <><option>Driver</option><option>Security</option><option>Housekeeping</option></>}
                            </select></div>
                            <div className="form-group"><label className="form-label">Department *</label><select className="form-select" value={staffForm.dept} onChange={e => setStaffForm({...staffForm, dept: e.target.value})}><option>Mathematics</option><option>Science</option><option>English</option><option>Administration</option><option>Transport</option><option>Student Welfare</option><option>Support</option></select></div>
                            <div className="form-group"><label className="form-label">Date of Joining</label><input type="date" className="form-input" value={staffForm.joined} onChange={e => setStaffForm({...staffForm, joined: e.target.value})}/></div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 30, background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e9ecef' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: 16, borderBottom: '1px solid #e9ecef', paddingBottom: 8 }}>Section C: Salary & Bank Details</h4>
                        <div className="ado-form form-row-4">
                            <div className="form-group"><label className="form-label">Basic Salary</label><input type="number" className="form-input" placeholder="₹" value={staffForm.basicSalary} onChange={e => setStaffForm({...staffForm, basicSalary: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">HRA</label><input type="number" className="form-input" placeholder="₹" value={staffForm.hra} onChange={e => setStaffForm({...staffForm, hra: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">TA</label><input type="number" className="form-input" placeholder="₹" value={staffForm.ta} onChange={e => setStaffForm({...staffForm, ta: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">DA</label><input type="number" className="form-input" placeholder="₹" value={staffForm.da} onChange={e => setStaffForm({...staffForm, da: e.target.value})}/></div>
                            
                            <div className="form-group"><label className="form-label">PF Deduction</label><input type="number" className="form-input" placeholder="₹" value={staffForm.pf} onChange={e => setStaffForm({...staffForm, pf: e.target.value})} disabled={staffForm.type === 'Contract'}/></div>
                            <div className="form-group"><label className="form-label">TDS</label><input type="number" className="form-input" placeholder="₹" value={staffForm.tds} onChange={e => setStaffForm({...staffForm, tds: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Other Deductions</label><input type="number" className="form-input" placeholder="₹" value={staffForm.otherDeductions} onChange={e => setStaffForm({...staffForm, otherDeductions: e.target.value})}/></div>
                        </div>
                        <div className="ado-form form-row-2" style={{ marginTop: 16 }}>
                            <div className="form-group"><label className="form-label">Bank Account Name</label><input type="text" className="form-input" placeholder="Name as per bank" value={staffForm.accountName} onChange={e => setStaffForm({...staffForm, accountName: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Account Number</label><input type="text" className="form-input" placeholder="A/C No." value={staffForm.accountNo} onChange={e => setStaffForm({...staffForm, accountNo: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">Bank Name</label><input type="text" className="form-input" placeholder="e.g. State Bank of India" value={staffForm.bankName} onChange={e => setStaffForm({...staffForm, bankName: e.target.value})}/></div>
                            <div className="form-group"><label className="form-label">IFSC Code</label><input type="text" className="form-input" placeholder="IFSC" value={staffForm.ifsc} onChange={e => setStaffForm({...staffForm, ifsc: e.target.value})}/></div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button className="btn btn-outline" onClick={closeAdd}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSaveStaff}>Save & Create Profile</button>
                    </div>
                </div>
            ) : (
                <>
                    {showSearch && (
                        <div className="hr-form-panel animate-fade-in" style={{ padding: 16 }}>
                            <div className="ado-form form-row-4">
                                <div className="form-group"><label className="form-label">Search</label><input type="text" className="form-input" placeholder="Name or Employee ID" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}/></div>
                                <div className="form-group"><label className="form-label">Department</label><select className="form-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}><option>All Departments</option>{allDepts.map(d => <option key={d}>{d}</option>)}</select></div>
                                <div className="form-group"><label className="form-label">Employment Type</label><select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}><option>All Types</option><option>Full-time</option><option>Part-time</option><option>Contract</option></select></div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ width: '100%', height: 40 }} onClick={handleSearch}><Search size={16}/> Search</button></div>
                            </div>
                        </div>
                    )}
                    <div className="table-responsive">
                            <div style={{ padding: '8px 0', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}><Filter size={14} style={{ verticalAlign: 'middle', marginRight: 4 }}/> {filteredStaff.length} staff member(s) found</div>
                            <table className="data-table"><thead><tr><th>Employee ID</th><th>Name</th><th>Role</th><th>Department</th><th>Type</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                                <tbody>{filteredStaff.length > 0 ? filteredStaff.map(s => (
                                    <tr key={s.id}><td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{s.id}</td><td className="fw-600">{s.name}</td><td>{s.role}</td><td>{s.dept}</td>
                                        <td><span className={`badge ${s.type === 'Full-time' ? 'badge-success' : s.type === 'Contract' ? 'badge-warning' : 'badge-draft'}`}>{s.type}</span></td>
                                        <td>{s.joined}</td><td><span className="badge badge-success">Active</span></td>
                                        <td><button className="btn-icon" title="View Profile" onClick={() => setSelectedProfile(s)}><Eye size={16}/></button></td></tr>
                                )) : (
                                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No staff members match your search criteria</td></tr>
                                )}</tbody></table>
                        </div>
                </>
            )}
        </div>
    );
}

// ======================== ATTENDANCE ========================
function AttendanceTab() {
    const { user } = useAuth();
    const [staffList] = useLocalStorage('mzs_staff', []);
    const [attendanceRecords, setAttendanceRecords] = useLocalStorage('mzs_attendance', []);
    const [attendanceLocks, setAttendanceLocks] = useLocalStorage('mzs_attendance_locks', {});
    
    const [showFilter, setShowFilter] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterDept, setFilterDept] = useState('All Departments');
    
    const [currentAttendance, setCurrentAttendance] = useState([]);

    const isLocked = attendanceLocks[filterDate] || false;

    const handleLoadStaff = () => {
        let filteredStaff = staffList;
        if (filterDept !== 'All Departments') {
            filteredStaff = staffList.filter(s => s.dept === filterDept);
        }
        
        // Find existing attendance for this date
        const existingAtt = attendanceRecords.filter(a => a.date === filterDate);
        
        const initialAttendance = filteredStaff.map(staff => {
            const existing = existingAtt.find(a => a.staffId === staff.id);
            return {
                staffId: staff.id,
                staffName: staff.name,
                dept: staff.dept,
                status: existing ? existing.status : 'Present',
                remarks: existing ? existing.remarks : ''
            };
        });
        
        setCurrentAttendance(initialAttendance);
        setLoaded(true);
    };

    const handleStatusChange = (staffId, status) => {
        setCurrentAttendance(prev => prev.map(a => a.staffId === staffId ? { ...a, status } : a));
    };

    const handleRemarkChange = (staffId, remarks) => {
        setCurrentAttendance(prev => prev.map(a => a.staffId === staffId ? { ...a, remarks } : a));
    };

    const handleMarkAllPresent = () => {
        setCurrentAttendance(prev => prev.map(a => ({ ...a, status: 'Present', remarks: '' })));
    };

    const handleSaveAttendance = async () => {
        if (isLocked) {
            await customAlert('Attendance for this date is locked. Admin override required.', 'Validation Error', 'error');
            return;
        }

        const toSave = currentAttendance.map(a => ({ ...a, date: filterDate }));
        const otherRecords = attendanceRecords.filter(a => a.date !== filterDate);
        
        setAttendanceRecords([...otherRecords, ...toSave]);
        setAttendanceLocks(prev => ({ ...prev, [filterDate]: true }));
        await customAlert('Daily attendance saved and locked successfully.', 'Success', 'success');
    };

    const handleAdminOverride = async () => {
        setAttendanceLocks(prev => ({ ...prev, [filterDate]: false }));
        await customAlert('Attendance unlocked. Audit log entry created.', 'Admin Override', 'success');
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><CalendarCheck size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Mark Daily Attendance</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline" onClick={() => { setShowFilter(!showFilter); }}><Search size={16}/> {showFilter ? 'Hide Filter' : 'Filter'}</button>
                    {loaded && <button className="btn btn-outline" onClick={handleMarkAllPresent} disabled={isLocked}><CheckCircle2 size={16}/> Mark All Present</button>}
                    <button className="btn btn-success" onClick={handleSaveAttendance} disabled={isLocked || !loaded}><CheckCircle2 size={16}/> Save Attendance</button>
                </div>
            </div>
            {showFilter && (
                <div className="hr-form-panel animate-fade-in" style={{ padding: 16, marginBottom: 20 }}>
                    <div className="ado-form form-row-3">
                        <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={filterDate} onChange={e => setFilterDate(e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Department</label><select className="form-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}><option>All Departments</option><option>Science</option><option>Admin</option><option>Transport</option></select></div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ height: 40 }} onClick={handleLoadStaff}><Filter size={16}/> Load Staff</button></div>
                    </div>
                </div>
            )}
            {loaded && (
                <div className="hr-form-panel animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {isLocked && <Lock size={16} color="var(--danger)" />}
                            Attendance for {filterDate} {isLocked ? '(Locked)' : ''}
                        </h4>
                        {isLocked && ['Super Admin', 'Admin'].includes(user?.role) && (
                            <button className="btn btn-outline btn-sm" onClick={handleAdminOverride}><Unlock size={14}/> Admin Override</button>
                        )}
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead><tr><th>Staff Name</th><th>Department</th><th>Status</th><th>Remarks</th></tr></thead>
                            <tbody>
                                {currentAttendance.map((s, i) => (
                                    <tr key={i}>
                                        <td className="fw-600">{s.staffName}</td>
                                        <td>{s.dept}</td>
                                        <td>
                                            <select className="form-select" value={s.status} onChange={e => handleStatusChange(s.staffId, e.target.value)} disabled={isLocked} style={{ fontSize: '0.85rem', padding: '4px 8px', borderColor: s.status === 'Absent' ? 'var(--danger)' : '' }}>
                                                <option>Present</option><option>Absent</option><option>Late</option><option>Half Day</option><option>On Leave</option>
                                            </select>
                                        </td>
                                        <td><input type="text" className="form-input" placeholder="Optional remark" value={s.remarks} onChange={e => handleRemarkChange(s.staffId, e.target.value)} disabled={isLocked} style={{ fontSize: '0.85rem', padding: '4px 8px' }}/></td>
                                    </tr>
                                ))}
                                {currentAttendance.length === 0 && (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px 0' }}>No staff found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================== LEAVE MANAGEMENT ========================
function LeaveTab() {
    const { user } = useAuth();
    const [staffList] = useLocalStorage('mzs_staff', []);
    const [leaveRequests, setLeaveRequests] = useLocalStorage('mzs_leave_req', [
        { id: 1, staff: 'Suresh Babu', type: 'Casual Leave (CL)', from: '2026-03-28', to: '2026-03-29', days: 2, reason: 'Family function', status: 'Pending', balanceAtTime: 8 },
        { id: 2, staff: 'Anita Verma', type: 'Sick Leave (SL)', from: '2026-04-01', to: '2026-04-03', days: 3, reason: 'Medical appointment', status: 'Pending', balanceAtTime: 10 },
    ]);

    const [isApplying, setIsApplying] = useState(false);
    const [leaveForm, setLeaveForm] = useState({ staff: ['Staff', 'Teacher'].includes(user?.role) ? user?.name : '', type: 'Casual Leave (CL)', from: '', to: '', reason: '' });
    const [viewingDetails, setViewingDetails] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const leaveTypes = [
        { type: 'Casual Leave (CL)', balance: 12 },
        { type: 'Sick Leave (SL)', balance: 12 },
        { type: 'Earned / Paid Leave', balance: 15 },
        { type: 'Maternity Leave', balance: 182 }, // 26 weeks
        { type: 'Paternity Leave', balance: 5 },
        { type: 'Loss of Pay (LOP)', balance: 'Unlimited' },
        { type: 'Optional / Custom', balance: 0 },
    ];

    const calculateWorkingDays = (from, to) => {
        if (!from || !to) return 0;
        let count = 0;
        let curDate = new Date(from);
        let endDate = new Date(to);
        while (curDate <= endDate) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        return count;
    };

    const handleApplyLeave = async () => {
        if (!leaveForm.staff || !leaveForm.from || !leaveForm.to || !leaveForm.reason) {
            await customAlert('Please fill all mandatory fields.', 'Validation Error', 'error');
            return;
        }
        const days = calculateWorkingDays(leaveForm.from, leaveForm.to);
        if (days <= 0) {
            await customAlert('Selected date range has 0 working days.', 'Validation Error', 'error');
            return;
        }

        const lType = leaveTypes.find(t => t.type === leaveForm.type);
        const bal = lType.balance === 'Unlimited' ? 'N/A' : lType.balance;

        // VALIDATION: Leave Cannot Exceed Balance
        if (bal !== 'N/A' && days > bal) {
            await customAlert(`Application rejected: Requested days (${days}) exceed available balance (${bal}) for ${leaveForm.type}.`, 'Validation Error', 'error');
            return;
        }

        // VALIDATION: No Overlapping Leave
        const hasOverlap = leaveRequests.some(r => {
            if (r.staff === leaveForm.staff && r.status !== 'Rejected') {
                const reqFrom = new Date(leaveForm.from);
                const reqTo = new Date(leaveForm.to);
                const existFrom = new Date(r.from);
                const existTo = new Date(r.to);
                return (reqFrom <= existTo && reqTo >= existFrom);
            }
            return false;
        });

        if (hasOverlap) {
            await customAlert('Cannot submit leave request. An overlapping request already exists for this date range.', 'Validation Error', 'error');
            return;
        }

        const newReq = {
            id: Date.now(),
            staff: leaveForm.staff,
            type: leaveForm.type,
            from: leaveForm.from,
            to: leaveForm.to,
            days: days,
            reason: leaveForm.reason,
            status: 'Pending',
            balanceAtTime: bal
        };

        setLeaveRequests(prev => [newReq, ...prev]);
        setIsApplying(false);
        setLeaveForm({ staff: ['Staff', 'Teacher'].includes(user?.role) ? user?.name : '', type: 'Casual Leave (CL)', from: '', to: '', reason: '' });
        await customAlert('Leave application submitted successfully!', 'Success', 'success');
    };

    const handleApprove = async (req) => {
        setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
        setViewingDetails(null);
        await customAlert('Leave request approved successfully.', 'Approved', 'success');
    };

    const handleRejectClick = () => {
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (!rejectReason.trim()) {
            await customAlert('Rejection reason is mandatory.', 'Validation Error', 'error');
            return;
        }
        setLeaveRequests(prev => prev.map(r => r.id === viewingDetails.id ? { ...r, status: 'Rejected', rejectReason: rejectReason } : r));
        setShowRejectModal(false);
        setRejectReason('');
        setViewingDetails(null);
        await customAlert('Leave request rejected.', 'Rejected', 'success');
    };

    const isStaff = ['Staff', 'Teacher'].includes(user?.role);
    const requestsToShow = isStaff ? leaveRequests.filter(r => r.staff === user?.name) : leaveRequests.filter(r => r.status === 'Pending');

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Calendar size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Leave Management</h3>
                {!isApplying ? (
                    <button className="btn btn-primary" onClick={() => setIsApplying(true)}><PlusCircle size={16}/> Apply Leave</button>
                ) : (
                    <button className="btn btn-outline" onClick={() => setIsApplying(false)}>Back to Overview</button>
                )}
            </div>

            {isApplying ? (
                <div className="hr-form-panel animate-fade-in" style={{ padding: 24, maxWidth: 800 }}>
                    <h3 style={{ marginBottom: 24, color: 'var(--primary)' }}>Leave Application Form</h3>
                    <div className="ado-form form-row-2">
                        <div className="form-group">
                            <label className="form-label">Staff Member *</label>
                            <select className="form-select" value={leaveForm.staff} onChange={e => setLeaveForm({...leaveForm, staff: e.target.value})} disabled={isStaff}>
                                <option value="">Select Staff</option>
                                {staffList.map(s => <option key={s.id} value={s.name}>{s.name} ({s.id})</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Leave Type *</label>
                            <select className="form-select" value={leaveForm.type} onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}>
                                {leaveTypes.map(t => <option key={t.type} value={t.type}>{t.type}</option>)}
                            </select>
                        </div>
                        
                        <div className="form-group"><label className="form-label">From Date *</label><input type="date" className="form-input" value={leaveForm.from} onChange={e => setLeaveForm({...leaveForm, from: e.target.value})}/></div>
                        <div className="form-group"><label className="form-label">To Date *</label><input type="date" className="form-input" value={leaveForm.to} onChange={e => setLeaveForm({...leaveForm, to: e.target.value})}/></div>
                        
                        <div className="form-group">
                            <label className="form-label">Calculated Days (excluding weekends)</label>
                            <input type="text" className="form-input" value={calculateWorkingDays(leaveForm.from, leaveForm.to)} disabled style={{ background: '#e9ecef', fontWeight: 'bold' }}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Available Balance</label>
                            <input type="text" className="form-input" value={leaveTypes.find(t => t.type === leaveForm.type)?.balance || 0} disabled style={{ background: '#e9ecef' }}/>
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Reason *</label>
                            <textarea className="form-input" rows={3} placeholder="Please provide reason for leave" value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})}></textarea>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Attach Supporting Document (Optional)</label>
                            <input type="file" className="form-input" accept=".pdf,.jpg,.jpeg,.png"/>
                            <small style={{ color: 'var(--text-muted)' }}>Required for Sick Leave &gt; 2 days.</small>
                        </div>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button className="btn btn-outline" onClick={() => setIsApplying(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleApplyLeave}>Submit Application</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="hr-form-panel">
                        <h3><AlertTriangle size={18}/> {isStaff ? `My Leave Requests (${requestsToShow.length})` : `Pending Approval (${requestsToShow.length})`}</h3>
                        <div className="table-responsive">
                            <table className="data-table"><thead><tr><th>Staff</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Balance</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {requestsToShow.length > 0 ? requestsToShow.map((l, i) => (
                                        <tr key={l.id} className="cursor-pointer hover-bg" onClick={() => setViewingDetails(l)}>
                                            <td className="fw-600">{l.staff}</td>
                                            <td><span className="badge badge-info">{l.type}</span></td>
                                            <td>{l.from}</td><td>{l.to}</td>
                                            <td className="fw-600">{l.days}</td>
                                            <td>{l.balanceAtTime}</td>
                                            <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</td>
                                            <td><span className={`badge ${l.status === 'Approved' ? 'badge-success' : l.status === 'Rejected' ? 'badge-danger' : 'badge-draft'}`}>{l.status}</span></td>
                                            <td><button className="btn-icon"><Eye size={16}/></button></td>
                                        </tr>
                                    )) : <tr><td colSpan="9" style={{ textAlign: 'center', padding: 24 }}>{isStaff ? 'No leave requests found' : 'No pending requests'}</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="hr-form-panel">
                        <h3><FileText size={18}/> Leave Balance Overview Configuration</h3>
                        <div className="table-responsive">
                            <table className="data-table"><thead><tr><th>Leave Type</th><th>Annual Entitlement / Default</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td className="fw-600">Casual Leave (CL)</td><td>12 days/year</td><td>Personal or family reasons</td></tr>
                                    <tr><td className="fw-600">Sick Leave (SL)</td><td>12 days/year</td><td>Medical illness or hospitalization</td></tr>
                                    <tr><td className="fw-600">Earned / Paid Leave</td><td>15 days/year</td><td>Accrued leave; may be carried over</td></tr>
                                    <tr><td className="fw-600">Maternity Leave</td><td>26 weeks</td><td>As per statutory rules</td></tr>
                                    <tr><td className="fw-600">Paternity Leave</td><td>5 days</td><td>For new fathers</td></tr>
                                    <tr><td className="fw-600">Loss of Pay (LOP)</td><td>Unlimited</td><td>No leave balance; salary deducted for absent days</td></tr>
                                    <tr><td className="fw-600">Optional / Custom</td><td>Configurable</td><td>School-defined leave types (e.g., Study Leave)</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Leave Approval Modal */}
            {viewingDetails && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ background: 'white', width: '90%', maxWidth: 500, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>Leave Request Details</h3>
                            <button className="btn-icon" onClick={() => { setViewingDetails(null); setShowRejectModal(false); setRejectReason(''); }}><X size={20}/></button>
                        </div>
                        <div style={{ padding: 24, overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div><label className="form-label">Staff Name</label><p className="fw-600">{viewingDetails.staff}</p></div>
                                <div><label className="form-label">Leave Type</label><p><span className="badge badge-info">{viewingDetails.type}</span></p></div>
                                <div><label className="form-label">Duration</label><p>{viewingDetails.from} to {viewingDetails.to}</p></div>
                                <div><label className="form-label">Total Days</label><p className="fw-600">{viewingDetails.days}</p></div>
                                <div><label className="form-label">Available Balance</label><p>{viewingDetails.balanceAtTime}</p></div>
                            </div>
                            <div>
                                <label className="form-label">Reason</label>
                                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 6, border: '1px solid #e9ecef' }}>{viewingDetails.reason}</div>
                            </div>

                            {showRejectModal && (
                                <div style={{ marginTop: 20, padding: 16, background: '#fff3cd', border: '1px solid #ffe69c', borderRadius: 8 }}>
                                    <label className="form-label text-danger">Rejection Reason (Mandatory) *</label>
                                    <textarea className="form-input" rows={2} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Please state why this leave is rejected"></textarea>
                                    <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                        <button className="btn btn-outline" onClick={() => { setShowRejectModal(false); setRejectReason(''); }}>Cancel</button>
                                        <button className="btn btn-danger" onClick={confirmReject}>Confirm Reject</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {!showRejectModal && (
                            <div style={{ padding: '16px 24px', borderTop: '1px solid #e9ecef', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button className="btn btn-outline" onClick={() => setViewingDetails(null)}>Close</button>
                                {!isStaff && viewingDetails.status === 'Pending' && (
                                    <>
                                        <button className="btn btn-danger" onClick={handleRejectClick}>Reject</button>
                                        <button className="btn btn-success" onClick={() => handleApprove(viewingDetails)}>Approve Leave</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================== PAYROLL ========================
const numberToWords = (num) => {
    if (num === 0) return 'Zero Rupees Only';
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

    const inWords = (n) => {
        if (n < 20) return a[n];
        let val = b[Math.floor(n / 10)];
        if (n % 10 > 0) val += '-' + a[n % 10];
        else val += ' ';
        return val;
    };

    let words = '';
    if (Math.floor(num / 10000000) > 0) {
        words += inWords(Math.floor(num / 10000000)) + 'Crore ';
        num %= 10000000;
    }
    if (Math.floor(num / 100000) > 0) {
        words += inWords(Math.floor(num / 100000)) + 'Lakh ';
        num %= 100000;
    }
    if (Math.floor(num / 1000) > 0) {
        words += inWords(Math.floor(num / 1000)) + 'Thousand ';
        num %= 1000;
    }
    if (Math.floor(num / 100) > 0) {
        words += inWords(Math.floor(num / 100)) + 'Hundred ';
        num %= 100;
    }
    if (num > 0) {
        if (words !== '') words += 'and ';
        words += inWords(num);
    }
    return words.trim() + ' Rupees Only';
};

// ======================== PAYROLL ========================
function PayrollTab() {
    const { user } = useAuth();
    const isStaff = ['Staff', 'Teacher'].includes(user?.role);
    const [activeView, setActiveView] = useState(isStaff ? 'payslips' : 'run'); // 'setup', 'run', 'payslips'
    const [staffList] = useLocalStorage('mzs_staff', []);
    
    // Salary setup state
    const [salarySetup, setSalarySetup] = useLocalStorage('mzs_salary_setup', {
        hraPercent: 40,
        daPercent: 20,
        taFixed: 2000,
        pfPercent: 12,
        esiPercent: 0.75,
        ptFixed: 200,
        payrollCycle: 'Monthly',
        processingDay: 28
    });

    const [payrollRecords, setPayrollRecords] = useLocalStorage('mzs_payroll_records', []);

    // Form states
    const [runMonth, setRunMonth] = useState('March 2026');
    const [runDept, setRunDept] = useState('All Departments');
    const [currentPayroll, setCurrentPayroll] = useState(null);
    const [payslipMonth, setPayslipMonth] = useState('March 2026');
    const [selectedPayslip, setSelectedPayslip] = useState(null);

    const handleSaveSetup = async () => {
        await customAlert('Salary structure saved successfully.', 'Setup Saved', 'success');
    };

    const handleLoadPayroll = () => {
        // Check if already processed
        const existingRecords = payrollRecords.filter(r => r.month === runMonth);
        if (existingRecords.length > 0) {
            // Already processed and locked
            setCurrentPayroll(existingRecords);
            return;
        }

        const records = staffList.map(staff => {
            const basic = parseInt(staff.basicSalary) || 20000; // fallback basic
            const hra = (basic * salarySetup.hraPercent) / 100;
            const da = (basic * salarySetup.daPercent) / 100;
            const gross = basic + hra + da + parseInt(salarySetup.taFixed);
            const pf = (basic * salarySetup.pfPercent) / 100;
            const esi = gross <= 21000 ? (gross * salarySetup.esiPercent) / 100 : 0;
            const pt = parseInt(salarySetup.ptFixed);
            const totalDed = pf + esi + pt;
            const netPay = gross - totalDed;
            
            return {
                staffId: staff.id,
                name: staff.name,
                dept: staff.dept,
                basic,
                hra,
                da,
                ta: parseInt(salarySetup.taFixed),
                gross,
                pf,
                esi,
                pt,
                lop: 0,
                totalDed,
                netPay,
                status: 'Draft'
            };
        });
        setCurrentPayroll(records);
    };

    const processPayroll = async () => {
        const toSave = currentPayroll.map(r => ({ ...r, status: 'Locked', month: runMonth }));
        setPayrollRecords(prev => [...prev.filter(p => p.month !== runMonth), ...toSave]);
        setCurrentPayroll(toSave);
        await customAlert('Payroll processed and records locked for the month.', 'Success', 'success');
    };

    const handleGeneratePayslip = (record) => {
        setSelectedPayslip(record);
    };

    const handleUnlockPayroll = async () => {
        const reason = prompt("Enter audit reason to unlock payroll:");
        if (!reason || !reason.trim()) {
            await customAlert("Admin override failed: Audit reason is required.", "Validation Error", "error");
            return;
        }
        const unlocked = currentPayroll.map(r => ({ ...r, status: 'Draft' }));
        setPayrollRecords(prev => [...prev.filter(p => p.month !== runMonth), ...unlocked]);
        setCurrentPayroll(unlocked);
        await customAlert(`Payroll unlocked. Audit log updated: ${reason}`, "Admin Override", "success");
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><IndianRupee size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Payroll Management</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                    {!isStaff && <button className={`btn ${activeView === 'setup' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveView('setup')}><Settings size={16}/> Salary Setup</button>}
                    {!isStaff && <button className={`btn ${activeView === 'run' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveView('run')}><IndianRupee size={16}/> Run Payroll</button>}
                    <button className={`btn ${activeView === 'payslips' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveView('payslips')}><FileText size={16}/> Payslips</button>
                </div>
            </div>

            {activeView === 'setup' && (
                <div className="hr-form-panel animate-fade-in" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20 }}>Global Salary Structure Configuration</h3>
                    <div className="ado-form form-row-2">
                        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                            <h4 style={{ marginBottom: 16, color: 'var(--success)' }}>Earnings Parameters</h4>
                            <div className="form-group">
                                <label className="form-label">HRA (% of Basic)</label>
                                <input type="number" className="form-input" value={salarySetup.hraPercent} onChange={e => setSalarySetup({...salarySetup, hraPercent: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">DA (% of Basic)</label>
                                <input type="number" className="form-input" value={salarySetup.daPercent} onChange={e => setSalarySetup({...salarySetup, daPercent: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Travel Allowance (Fixed)</label>
                                <input type="number" className="form-input" value={salarySetup.taFixed} onChange={e => setSalarySetup({...salarySetup, taFixed: e.target.value})} />
                            </div>
                        </div>
                        
                        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                            <h4 style={{ marginBottom: 16, color: 'var(--danger)' }}>Deductions Parameters</h4>
                            <div className="form-group">
                                <label className="form-label">Provident Fund (PF) %</label>
                                <input type="number" className="form-input" value={salarySetup.pfPercent} onChange={e => setSalarySetup({...salarySetup, pfPercent: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">ESI % (if Gross &lt;= 21,000)</label>
                                <input type="number" className="form-input" value={salarySetup.esiPercent} onChange={e => setSalarySetup({...salarySetup, esiPercent: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Professional Tax (Fixed)</label>
                                <input type="number" className="form-input" value={salarySetup.ptFixed} onChange={e => setSalarySetup({...salarySetup, ptFixed: e.target.value})} />
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, gridColumn: 'span 2' }}>
                            <h4 style={{ marginBottom: 16 }}>Payroll Cycle Settings</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Payroll Cycle</label>
                                    <select className="form-select" value={salarySetup.payrollCycle} onChange={e => setSalarySetup({...salarySetup, payrollCycle: e.target.value})}>
                                        <option>Monthly</option>
                                        <option>Bi-Weekly</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Processing Day</label>
                                    <input type="number" className="form-input" min="1" max="31" value={salarySetup.processingDay} onChange={e => setSalarySetup({...salarySetup, processingDay: e.target.value})} />
                                    <small style={{ color: 'var(--text-muted)' }}>e.g., 28th of each month</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={handleSaveSetup}>Save Salary Structure</button>
                    </div>
                </div>
            )}

            {activeView === 'run' && (
                <div className="animate-fade-in">
                    <div className="hr-form-panel" style={{ padding: 16 }}>
                        <div className="ado-form form-row-3">
                            <div className="form-group"><label className="form-label">Month</label><select className="form-select" value={runMonth} onChange={e => setRunMonth(e.target.value)}><option>March 2026</option><option>February 2026</option></select></div>
                            <div className="form-group"><label className="form-label">Department</label><select className="form-select" value={runDept} onChange={e => setRunDept(e.target.value)}><option>All Departments</option></select></div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ height: 40 }} onClick={handleLoadPayroll}><Search size={16}/> Load Payroll Data</button></div>
                        </div>
                    </div>

                    {currentPayroll && (
                        <div className="hr-form-panel" style={{ marginTop: 20 }}>
                            <h3>Monthly Payroll Processing - {runMonth}</h3>
                            <div className="table-responsive">
                                <table className="data-table" style={{ fontSize: '0.85rem' }}>
                                    <thead><tr><th>Employee</th><th>Basic</th><th>HRA</th><th>DA</th><th>Gross</th><th>PF</th><th>ESI</th><th>PT</th><th>LOP</th><th>Total Ded.</th><th>Net Pay</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {currentPayroll.map((p, i) => (
                                            <tr key={i}>
                                                <td className="fw-600">{p.name}</td>
                                                <td>₹{p.basic}</td><td>₹{p.hra}</td><td>₹{p.da}</td><td className="fw-600">₹{p.gross}</td>
                                                <td>₹{p.pf}</td><td>₹{p.esi}</td><td>₹{p.pt}</td><td>₹{p.lop}</td><td className="danger">₹{p.totalDed}</td>
                                                <td className="success fw-600">₹{p.netPay}</td>
                                                <td><span className={`badge ${p.status === 'Locked' || p.status === 'Processed' ? 'badge-success' : 'badge-warning'}`}>{p.status === 'Processed' ? 'Locked' : p.status}</span></td>
                                            </tr>
                                        ))}
                                        {currentPayroll.length === 0 && <tr><td colSpan="12" style={{ textAlign: 'center', padding: 20 }}>No staff found for this month.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                            {currentPayroll.length > 0 && currentPayroll[0].status === 'Draft' && (
                                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-primary" onClick={processPayroll}>Process Payroll</button>
                                </div>
                            )}
                            {currentPayroll.length > 0 && (currentPayroll[0].status === 'Locked' || currentPayroll[0].status === 'Processed') && (
                                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Lock size={16}/> Payroll is locked. Editing requires Admin Override.
                                    </div>
                                    {['Super Admin', 'Admin'].includes(user?.role) && (
                                        <button className="btn btn-outline" onClick={handleUnlockPayroll}><Unlock size={16} style={{ marginRight: 8 }}/> Admin Override</button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {activeView === 'payslips' && (
                <div className="animate-fade-in">
                    <div className="hr-form-panel" style={{ padding: 16 }}>
                        <div className="ado-form form-row-3">
                            <div className="form-group"><label className="form-label">Month</label><select className="form-select" value={payslipMonth} onChange={e => setPayslipMonth(e.target.value)}><option>March 2026</option><option>February 2026</option></select></div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-outline" style={{ height: 40 }}><Search size={16}/> Load Processed Payroll</button></div>
                        </div>
                    </div>

                    <div className="table-responsive hr-form-panel" style={{ marginTop: 20 }}>
                        <table className="data-table">
                            <thead><tr><th>Employee ID</th><th>Employee Name</th><th>Net Pay</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {payrollRecords.filter(r => r.month === payslipMonth && (!isStaff || r.name === user?.name)).map((p, i) => (
                                    <tr key={i}>
                                        <td>{p.staffId}</td>
                                        <td className="fw-600">{p.name}</td>
                                        <td className="success fw-600">₹{p.netPay}</td>
                                        <td><span className="badge badge-success">{p.status}</span></td>
                                        <td>
                                            <button className="btn btn-outline btn-sm" onClick={() => handleGeneratePayslip(p)}>Preview</button>
                                        </td>
                                    </tr>
                                ))}
                                {payrollRecords.filter(r => r.month === payslipMonth).length === 0 && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>No processed payroll records found for {payslipMonth}.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {selectedPayslip && (
                        <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="modal-content" style={{ background: 'white', width: '90%', maxWidth: 800, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                                    <h3 style={{ margin: 0 }}>Payslip Preview</h3>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button className="btn btn-primary" onClick={() => customAlert('Payslip downloaded as PDF.', 'Success', 'success')}><Download size={16}/> Download PDF</button>
                                        <button className="btn btn-outline" onClick={() => customAlert('Payslip sent to employee portal.', 'Success', 'success')}>Send via Portal</button>
                                        <button className="btn-icon" onClick={() => setSelectedPayslip(null)}><X size={20}/></button>
                                    </div>
                                </div>
                                <div style={{ padding: 32, overflowY: 'auto' }}>
                                    <div style={{ border: '1px solid #e9ecef', padding: 32 }}>
                                        <div style={{ textAlign: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: 16, marginBottom: 24 }}>
                                            <h2 style={{ color: 'var(--primary)', margin: '0 0 8px 0' }}>Montessori Zone School</h2>
                                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Payslip for the month of {selectedPayslip.month}</p>
                                        </div>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                                            <div>
                                                <p><strong>Employee ID:</strong> {selectedPayslip.staffId}</p>
                                                <p><strong>Name:</strong> {selectedPayslip.name}</p>
                                                <p><strong>Department:</strong> {selectedPayslip.dept}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p><strong>Working Days:</strong> 26</p>
                                                <p><strong>Present Days:</strong> 26</p>
                                                <p><strong>Leave/Absent:</strong> 0</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                            <div>
                                                <h4 style={{ color: 'var(--success)', marginBottom: 12, borderBottom: '1px solid #e9ecef', paddingBottom: 8 }}>Earnings</h4>
                                                <table style={{ width: '100%', fontSize: '0.9rem' }}><tbody>
                                                    <tr><td style={{ padding: '8px 0' }}>Basic Salary</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.basic}</td></tr>
                                                    <tr><td style={{ padding: '8px 0' }}>HRA</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.hra}</td></tr>
                                                    <tr><td style={{ padding: '8px 0' }}>Dearness Allowance</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.da}</td></tr>
                                                    <tr><td style={{ padding: '8px 0' }}>Travel Allowance</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.ta}</td></tr>
                                                    <tr style={{ fontWeight: 700, borderTop: '2px solid var(--border)' }}><td style={{ padding: '8px 0' }}>Gross Salary</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.gross}</td></tr>
                                                </tbody></table>
                                            </div>
                                            <div>
                                                <h4 style={{ color: 'var(--danger)', marginBottom: 12, borderBottom: '1px solid #e9ecef', paddingBottom: 8 }}>Deductions</h4>
                                                <table style={{ width: '100%', fontSize: '0.9rem' }}><tbody>
                                                    <tr><td style={{ padding: '8px 0' }}>Provident Fund (PF)</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.pf}</td></tr>
                                                    <tr><td style={{ padding: '8px 0' }}>ESI</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.esi}</td></tr>
                                                    <tr><td style={{ padding: '8px 0' }}>Professional Tax</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.pt}</td></tr>
                                                    <tr><td style={{ padding: '8px 0' }}>LOP Deduction</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.lop}</td></tr>
                                                    <tr style={{ fontWeight: 700, borderTop: '2px solid var(--border)' }}><td style={{ padding: '8px 0' }}>Total Deductions</td><td style={{ textAlign: 'right' }}>₹{selectedPayslip.totalDed}</td></tr>
                                                </tbody></table>
                                            </div>
                                        </div>
                                        
                                        <div style={{ marginTop: 32, padding: 20, background: 'var(--primary-light)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
                                                {numberToWords(selectedPayslip.netPay)}
                                            </div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                                                Net Pay: ₹{selectedPayslip.netPay}
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
                                            <div style={{ textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: 8, width: 200 }}>
                                                Authorized Signature
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ======================== RECRUITMENT ========================
function RecruitmentTab() {
    const [activeView, setActiveView] = useState('pipeline'); // 'pipeline', 'create_job', 'applications', 'convert_staff'
    const [staffList, setStaffList] = useLocalStorage('mzs_staff', []);
    
    // Sample Initial Data for Jobs and Applications
    const [jobs, setJobs] = useLocalStorage('mzs_jobs', [
        { id: 'JOB-001', title: 'Science Teacher (Physics)', dept: 'Science', vacancies: 1, deadline: '2026-04-15', status: 'Open', desc: 'Teach Physics to high school students.', reqs: 'M.Sc Physics, B.Ed', salary: '40,000 - 50,000' },
        { id: 'JOB-002', title: 'Administrative Assistant', dept: 'Admin', vacancies: 1, deadline: '2026-04-10', status: 'Open', desc: 'Handle front desk and admin tasks.', reqs: 'Graduate, basic computer skills', salary: '20,000 - 25,000' }
    ]);

    const [applications, setApplications] = useLocalStorage('mzs_applications', [
        { id: 'APP-101', jobId: 'JOB-001', name: 'Ramesh Iyer', email: 'ramesh@example.com', phone: '9876543210', date: '2026-03-20', status: 'New', resume: 'resume_ramesh.pdf', feedback: '', interview: null },
        { id: 'APP-102', jobId: 'JOB-001', name: 'Deepa Nair', email: 'deepa@example.com', phone: '9876543211', date: '2026-03-22', status: 'Interview Scheduled', resume: 'resume_deepa.pdf', feedback: '', interview: { date: '2026-03-28', time: '10:00', mode: 'In-person' } },
        { id: 'APP-103', jobId: 'JOB-001', name: 'Kavitha Rao', email: 'kavitha@example.com', phone: '9876543212', date: '2026-03-18', status: 'Selected', resume: 'resume_kavitha.pdf', feedback: 'Excellent demo class', interview: { date: '2026-03-25', time: '11:00', mode: 'Video call' } }
    ]);

    // Form states
    const [jobForm, setJobForm] = useState({ title: '', dept: 'Science', desc: '', reqs: '', salary: '', deadline: '', vacancies: 1 });
    const [selectedJob, setSelectedJob] = useState('JOB-001');
    const [selectedApp, setSelectedApp] = useState(null);
    const [interviewForm, setInterviewForm] = useState({ date: '', time: '', mode: 'In-person' });
    
    // Convert Staff Form states
    const [convertApp, setConvertApp] = useState(null);
    const [convertForm, setConvertForm] = useState({ empId: '', role: '', dept: '', joiningDate: '', basicSalary: '' });

    const handleCreateJob = async (e) => {
        e.preventDefault();
        const newJob = {
            id: `JOB-00${jobs.length + 1}`,
            ...jobForm,
            status: 'Open'
        };
        setJobs([...jobs, newJob]);
        setActiveView('pipeline');
        setJobForm({ title: '', dept: 'Science', desc: '', reqs: '', salary: '', deadline: '', vacancies: 1 });
        await customAlert('Job post created and published successfully.', 'Success', 'success');
    };

    const handleUpdateStatus = (appId, newStatus) => {
        setApplications(apps => apps.map(app => {
            if (app.id === appId) {
                const updatedApp = { ...app, status: newStatus };
                if (newStatus === 'Interview Scheduled') {
                    updatedApp.interview = interviewForm;
                }
                return updatedApp;
            }
            return app;
        }));
        setSelectedApp(null);
        customAlert(`Applicant status updated to ${newStatus}.`, 'Success', 'success');
    };

    const handleConvertSubmit = async (e) => {
        e.preventDefault();
        
        const job = jobs.find(j => j.id === convertApp.jobId);
        if (job) {
            if (job.vacancies <= 0) {
                await customAlert(`Cannot hire candidate. Vacancy limit (0 left) reached for ${job.title}.`, 'Validation Error', 'error');
                return;
            }
            // Decrement vacancy
            setJobs(prevJobs => prevJobs.map(j => j.id === job.id ? { ...j, vacancies: j.vacancies - 1 } : j));
        }

        const newStaff = {
            id: convertForm.empId || `EMP-${Math.floor(Math.random() * 10000)}`,
            name: convertApp.name,
            role: convertForm.role,
            dept: convertForm.dept,
            email: convertApp.email,
            phone: convertApp.phone,
            status: 'Active',
            basicSalary: convertForm.basicSalary,
            joined: convertForm.joiningDate
        };
        setStaffList([...staffList, newStaff]);
        
        // Remove from applications or mark as hired
        setApplications(apps => apps.filter(a => a.id !== convertApp.id));
        setConvertApp(null);
        setActiveView('pipeline');
        await customAlert('Staff record created successfully. Candidate converted.', 'Hired', 'success');
    };

    const pipelineStages = ['New', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'On Hold'];
    
    const renderPipeline = () => {
        const filteredApps = applications.filter(a => a.jobId === selectedJob);
        return (
            <div className="hr-pipeline" style={{ overflowX: 'auto', display: 'flex', paddingBottom: 10 }}>
                {pipelineStages.map(stage => (
                    <div key={stage} className="hr-pipeline-col" style={{ minWidth: 260, flexShrink: 0 }}>
                        <h4 style={{ borderBottom: stage === 'Selected' ? '2px solid var(--success)' : stage === 'Rejected' ? '2px solid var(--danger)' : '2px solid var(--border)', paddingBottom: 8 }}>{stage} ({filteredApps.filter(a => a.status === stage).length})</h4>
                        {filteredApps.filter(a => a.status === stage).map(app => (
                            <div key={app.id} className="hr-pipeline-card" onClick={() => setSelectedApp(app)} style={{ cursor: 'pointer', borderLeft: stage === 'Selected' ? '3px solid var(--success)' : 'none', opacity: stage === 'Rejected' ? 0.6 : 1 }}>
                                <h5>{app.name}</h5>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{app.email}</p>
                                {app.status === 'Interview Scheduled' && app.interview && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 4 }}><Calendar size={12}/> {app.interview.date} at {app.interview.time} ({app.interview.mode})</p>
                                )}
                                {stage === 'Selected' && (
                                    <button className="btn btn-success" style={{ marginTop: 8, fontSize: '0.75rem', padding: '4px 10px', width: '100%' }} onClick={(e) => { e.stopPropagation(); setConvertApp(app); setConvertForm({ empId: `EMP-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`, role: '', dept: jobs.find(j => j.id === app.jobId)?.dept || '', joiningDate: '', basicSalary: '' }); setActiveView('convert_staff'); }}><UserPlus size={14}/> Convert to Staff</button>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Briefcase size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Recruitment Pipeline</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className={`btn ${activeView === 'pipeline' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveView('pipeline')}><List size={16}/> Pipeline</button>
                    <button className={`btn ${activeView === 'create_job' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveView('create_job')}><PlusCircle size={16}/> Create Job Post</button>
                </div>
            </div>

            {activeView === 'pipeline' && (
                <>
                    <div className="hr-form-panel" style={{ padding: 16, marginBottom: 20 }}>
                        <div className="form-group" style={{ maxWidth: 400, margin: 0 }}>
                            <label className="form-label">Select Job Post to View Pipeline</label>
                            <select className="form-select" value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
                                {jobs.map(job => (
                                    <option key={job.id} value={job.id}>{job.title} ({job.dept}) - {job.status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {renderPipeline()}
                </>
            )}

            {activeView === 'create_job' && (
                <div className="hr-form-panel animate-fade-in" style={{ padding: 24, maxWidth: 800 }}>
                    <h3 style={{ marginBottom: 20 }}>Create New Job Post</h3>
                    <form onSubmit={handleCreateJob}>
                        <div className="ado-form form-row-2">
                            <div className="form-group">
                                <label className="form-label">Job Title *</label>
                                <input type="text" className="form-input" required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="e.g. Mathematics Teacher" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department *</label>
                                <select className="form-select" required value={jobForm.dept} onChange={e => setJobForm({...jobForm, dept: e.target.value})}>
                                    <option>Science</option><option>Mathematics</option><option>English</option><option>Admin</option><option>Transport</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Job Description (Responsibilities) *</label>
                                <textarea className="form-input" required rows="3" value={jobForm.desc} onChange={e => setJobForm({...jobForm, desc: e.target.value})}></textarea>
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Requirements (Qualifications, Skills) *</label>
                                <textarea className="form-input" required rows="2" value={jobForm.reqs} onChange={e => setJobForm({...jobForm, reqs: e.target.value})}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Salary Range (Optional)</label>
                                <input type="text" className="form-input" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} placeholder="e.g. 40,000 - 50,000" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Number of Vacancies *</label>
                                <input type="number" className="form-input" required min="1" value={jobForm.vacancies} onChange={e => setJobForm({...jobForm, vacancies: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Application Deadline *</label>
                                <input type="date" className="form-input" required value={jobForm.deadline} onChange={e => setJobForm({...jobForm, deadline: e.target.value})} />
                            </div>
                        </div>
                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button type="button" className="btn btn-outline" onClick={() => setActiveView('pipeline')}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Publish Job</button>
                        </div>
                    </form>
                </div>
            )}

            {activeView === 'convert_staff' && convertApp && (
                <div className="hr-form-panel animate-fade-in" style={{ padding: 24, maxWidth: 800 }}>
                    <h3 style={{ marginBottom: 20, color: 'var(--success)' }}><UserPlus size={20} style={{ display: 'inline', verticalAlign: 'middle' }}/> Convert Candidate to Staff Record</h3>
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                        <div><strong>Candidate:</strong> {convertApp.name}</div>
                        <div><strong>Email:</strong> {convertApp.email}</div>
                        <div><strong>Phone:</strong> {convertApp.phone}</div>
                    </div>
                    <form onSubmit={handleConvertSubmit}>
                        <div className="ado-form form-row-2">
                            <div className="form-group">
                                <label className="form-label">Employee ID *</label>
                                <input type="text" className="form-input" required value={convertForm.empId} onChange={e => setConvertForm({...convertForm, empId: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role / Designation *</label>
                                <input type="text" className="form-input" required value={convertForm.role} onChange={e => setConvertForm({...convertForm, role: e.target.value})} placeholder="e.g. Teacher" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department *</label>
                                <select className="form-select" required value={convertForm.dept} onChange={e => setConvertForm({...convertForm, dept: e.target.value})}>
                                    <option>Science</option><option>Mathematics</option><option>English</option><option>Admin</option><option>Transport</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Joining Date *</label>
                                <input type="date" className="form-input" required value={convertForm.joiningDate} onChange={e => setConvertForm({...convertForm, joiningDate: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Basic Salary (₹) *</label>
                                <input type="number" className="form-input" required value={convertForm.basicSalary} onChange={e => setConvertForm({...convertForm, basicSalary: e.target.value})} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Upload Onboarding Documents</label>
                                <input type="file" className="form-input" multiple />
                            </div>
                        </div>
                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button type="button" className="btn btn-outline" onClick={() => { setActiveView('pipeline'); setConvertApp(null); }}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save & Create Profile</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ background: 'white', width: '90%', maxWidth: 600, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0 }}>Application Details</h3>
                            <button className="btn-icon" onClick={() => setSelectedApp(null)}><X size={20}/></button>
                        </div>
                        <div style={{ padding: 24, overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Name</label><div className="fw-600">{selectedApp.name}</div></div>
                                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Email</label><div>{selectedApp.email}</div></div>
                                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Phone</label><div>{selectedApp.phone}</div></div>
                                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Applied Date</label><div>{selectedApp.date}</div></div>
                                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Current Status</label><div><span className="badge badge-primary">{selectedApp.status}</span></div></div>
                                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Resume</label><div><a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}><FileText size={14}/> View Resume</a></div></div>
                            </div>
                            
                            <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '20px 0' }} />
                            
                            <h4>Update Application Status</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12, marginBottom: 20 }}>
                                {pipelineStages.map(stage => (
                                    <button key={stage} className={`btn btn-sm ${selectedApp.status === stage ? 'btn-primary' : 'btn-outline'}`} onClick={() => {
                                        if (stage === 'Interview Scheduled') {
                                            setInterviewForm({ date: '', time: '', mode: 'In-person' });
                                            setSelectedApp({ ...selectedApp, status: 'Interview Scheduled_pending' });
                                        } else {
                                            handleUpdateStatus(selectedApp.id, stage);
                                        }
                                    }}>{stage}</button>
                                ))}
                            </div>

                            {selectedApp.status === 'Interview Scheduled_pending' && (
                                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginTop: 16 }}>
                                    <h5 style={{ marginBottom: 12 }}>Schedule Interview Details</h5>
                                    <div className="ado-form form-row-2">
                                        <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={interviewForm.date} onChange={e => setInterviewForm({...interviewForm, date: e.target.value})}/></div>
                                        <div className="form-group"><label className="form-label">Time</label><input type="time" className="form-input" value={interviewForm.time} onChange={e => setInterviewForm({...interviewForm, time: e.target.value})}/></div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label className="form-label">Mode</label>
                                            <select className="form-select" value={interviewForm.mode} onChange={e => setInterviewForm({...interviewForm, mode: e.target.value})}>
                                                <option>In-person</option><option>Video call</option><option>Phone call</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 12, textAlign: 'right' }}>
                                        <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(selectedApp.id, 'Interview Scheduled')}>Save & Schedule</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================== DOCUMENTS ========================
function DocumentsTab() {
    const { user } = useAuth();
    const isStaff = ['Staff', 'Teacher'].includes(user?.role);
    const [staffList] = useLocalStorage('mzs_staff', [
        { id: 'EMP-101', name: 'Rajesh Kumar', dept: 'Science' },
        { id: 'EMP-102', name: 'Priya Sharma', dept: 'Admin' },
        { id: 'EMP-103', name: 'Suresh Babu', dept: 'Transport' }
    ]);
    
    // Sample Initial Data for Documents
    const [documents, setDocuments] = useLocalStorage('mzs_documents', [
        { id: 'DOC-001', staffId: 'EMP-101', staffName: 'Rajesh Kumar', type: 'ID Proof (Aadhaar)', reference: 'XXXX-XXXX-1234', uploadDate: '2024-06-15', expiryDate: '' },
        { id: 'DOC-002', staffId: 'EMP-102', staffName: 'Priya Sharma', type: 'Employment Contract', reference: 'CON-2019-002', uploadDate: '2019-04-01', expiryDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0] }, // Expiring in 15 days
        { id: 'DOC-003', staffId: 'EMP-103', staffName: 'Suresh Babu', type: 'Driving License', reference: 'DL-09-XXXXXX', uploadDate: '2023-01-10', expiryDate: '2028-01-10' }
    ]);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isReplaceMode, setIsReplaceMode] = useState(false);
    const [currentDocId, setCurrentDocId] = useState(null);
    
    const [uploadForm, setUploadForm] = useState({
        staffId: '',
        type: 'ID Proof',
        reference: '',
        expiryDate: '',
        file: null
    });

    // Helper to calculate expiry status
    const getExpiryStatus = (expiryDateStr) => {
        if (!expiryDateStr) return { label: 'Valid', class: 'badge-success' };
        
        const expiryDate = new Date(expiryDateStr);
        const today = new Date();
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return { label: 'Expired', class: 'badge-danger' };
        } else if (diffDays <= 30) {
            return { label: 'Expiring Soon', class: 'badge-warning' };
        } else {
            return { label: 'Valid', class: 'badge-success' };
        }
    };

    const handleOpenUploadModal = (doc = null) => {
        if (doc) {
            setIsReplaceMode(true);
            setCurrentDocId(doc.id);
            setUploadForm({
                staffId: doc.staffId,
                type: doc.type,
                reference: doc.reference,
                expiryDate: doc.expiryDate || '',
                file: null
            });
        } else {
            setIsReplaceMode(false);
            setCurrentDocId(null);
            setUploadForm({ staffId: staffList[0]?.id || '', type: 'ID Proof', reference: '', expiryDate: '', file: null });
        }
        setIsUploadModalOpen(true);
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        
        if (!uploadForm.file && !isReplaceMode) {
            await customAlert('Please select a file to upload.', 'Error', 'error');
            return;
        }

        const staffName = staffList.find(s => s.id === uploadForm.staffId)?.name || 'Unknown Staff';
        
        if (isReplaceMode) {
            setDocuments(docs => docs.map(d => {
                if (d.id === currentDocId) {
                    return {
                        ...d,
                        reference: uploadForm.reference,
                        expiryDate: uploadForm.expiryDate,
                        uploadDate: new Date().toISOString().split('T')[0] // Update upload date
                    };
                }
                return d;
            }));
            await customAlert(`Document replaced successfully. Old version archived.`, 'Success', 'success');
        } else {
            const newDoc = {
                id: `DOC-00${documents.length + 1}`,
                staffId: uploadForm.staffId,
                staffName: staffName,
                type: uploadForm.type,
                reference: uploadForm.reference,
                uploadDate: new Date().toISOString().split('T')[0],
                expiryDate: uploadForm.expiryDate
            };
            setDocuments([...documents, newDoc]);
            await customAlert(`Document uploaded and linked to ${staffName}.`, 'Success', 'success');
        }
        setIsUploadModalOpen(false);
    };

    const handlePreview = (doc) => {
        customAlert(`Previewing Document: ${doc.type}\nStaff: ${doc.staffName}\nRef: ${doc.reference || 'N/A'}\nUploaded: ${doc.uploadDate}\nStatus: ${getExpiryStatus(doc.expiryDate).label}`, 'Document Preview', 'info');
    };

    const handleDownload = (doc) => {
        const txt = `Staff Document\nStaff: ${doc.staffName}\nType: ${doc.type}\nRef: ${doc.reference || 'N/A'}\nExpiry: ${doc.expiryDate || 'N/A'}`;
        const blob = new Blob([txt], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${doc.staffName.replace(' ', '_')}_${doc.type.replace(' ', '_')}.txt`;
        a.click();
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Staff Document Repository</h3>
                {!isStaff && <button className="btn btn-primary" onClick={() => handleOpenUploadModal()}><Upload size={16}/> Upload Document</button>}
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Staff</th><th>Document Type</th><th>Reference</th><th>Uploaded</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {documents.filter(d => !isStaff || d.staffName === user?.name).map(doc => {
                            const status = getExpiryStatus(doc.expiryDate);
                            return (
                                <tr key={doc.id}>
                                    <td className="fw-600">{doc.staffName}</td>
                                    <td>{doc.type}</td>
                                    <td>{doc.reference || '—'}</td>
                                    <td>{doc.uploadDate}</td>
                                    <td className={status.label !== 'Valid' && doc.expiryDate ? 'fw-600' : ''} style={{ color: status.label === 'Expired' ? 'var(--danger)' : status.label === 'Expiring Soon' ? 'var(--warning-dark)' : 'inherit' }}>{doc.expiryDate || '—'}</td>
                                    <td><span className={`badge ${status.class}`}>{status.label}</span></td>
                                    <td style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn-icon" title="Preview" onClick={() => handlePreview(doc)}><Eye size={16}/></button>
                                        <button className="btn-icon" title="Download" onClick={() => handleDownload(doc)}><Download size={16}/></button>
                                        {!isStaff && <button className="btn-icon" title="Replace / Update" onClick={() => handleOpenUploadModal(doc)}><Upload size={14}/></button>}
                                    </td>
                                </tr>
                            );
                        })}
                        {documents.filter(d => !isStaff || d.staffName === user?.name).length === 0 && (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px 0' }}>No documents found in repository.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Upload/Replace Document Modal */}
            {isUploadModalOpen && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ background: 'white', width: '90%', maxWidth: 500, borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0 }}>{isReplaceMode ? 'Replace Document' : 'Upload Staff Document'}</h3>
                            <button className="btn-icon" onClick={() => setIsUploadModalOpen(false)}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleUploadSubmit} style={{ padding: 24 }}>
                            <div className="ado-form">
                                <div className="form-group">
                                    <label className="form-label">Staff Member *</label>
                                    <select className="form-select" required value={uploadForm.staffId} onChange={e => setUploadForm({...uploadForm, staffId: e.target.value})} disabled={isReplaceMode}>
                                        <option value="">Select Staff</option>
                                        {staffList.map(staff => (
                                            <option key={staff.id} value={staff.id}>{staff.name} ({staff.dept})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Document Type *</label>
                                    <select className="form-select" required value={uploadForm.type} onChange={e => setUploadForm({...uploadForm, type: e.target.value})} disabled={isReplaceMode}>
                                        <option>ID Proof</option>
                                        <option>Educational Certificate</option>
                                        <option>Experience Certificate</option>
                                        <option>Employment Contract</option>
                                        <option>Medical Certificate</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Document Number / Reference</label>
                                    <input type="text" className="form-input" value={uploadForm.reference} onChange={e => setUploadForm({...uploadForm, reference: e.target.value})} placeholder="e.g. DL-09-XXXXXX" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Expiry Date (If applicable)</label>
                                    <input type="date" className="form-input" value={uploadForm.expiryDate} onChange={e => setUploadForm({...uploadForm, expiryDate: e.target.value})} />
                                    {isReplaceMode && <small style={{ color: 'var(--text-muted)' }}>Updating this will resolve any "Expiring Soon" alerts.</small>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Upload File {isReplaceMode ? '(New Version)' : '*'} <small>(PDF, JPG, PNG - Max 10MB)</small></label>
                                    <input type="file" className="form-input" accept=".pdf,.jpg,.jpeg,.png" required={!isReplaceMode} onChange={e => setUploadForm({...uploadForm, file: e.target.files[0]})} />
                                </div>
                            </div>
                            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{isReplaceMode ? 'Update & Archive Old' : 'Upload Document'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================== PERFORMANCE ========================
function PerformanceTab() {
    const [staffList] = useLocalStorage('mzs_staff', [
        { id: 'EMP-101', name: 'Rajesh Kumar', dept: 'Science' },
        { id: 'EMP-102', name: 'Priya Sharma', dept: 'Admin' },
        { id: 'EMP-103', name: 'Suresh Babu', dept: 'Transport' }
    ]);

    const [reviews, setReviews] = useLocalStorage('mzs_performance', [
        { id: 'REV-001', staffId: 'EMP-101', staffName: 'Rajesh Kumar', period: 'Apr 2024 - Mar 2025', rating: 'Excellent', remarks: 'Exceeds all expectations consistently', linkedAction: 'Promotion', reviewedBy: 'Principal' },
        { id: 'REV-002', staffId: 'EMP-102', staffName: 'Priya Sharma', period: 'Apr 2024 - Mar 2025', rating: 'Good', remarks: 'Reliable, well-organized admin processes', linkedAction: 'Standard Increment', reviewedBy: 'HR Manager' },
        { id: 'REV-003', staffId: 'EMP-103', staffName: 'Suresh Babu', period: 'Apr 2024 - Mar 2025', rating: 'Average', remarks: 'Meets basic requirements; needs punctuality improvement', linkedAction: 'None', reviewedBy: 'HR Manager' }
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        staffId: '',
        period: '',
        rating: 'Good',
        remarks: '',
        linkedAction: 'None'
    });

    const getRatingStyle = (rating) => {
        switch (rating) {
            case 'Excellent': return { class: 'badge-success', icon: '⭐ ' };
            case 'Good': return { class: 'badge-success', icon: '' };
            case 'Average': return { class: 'badge-warning', icon: '' };
            case 'Below Average': return { class: 'badge-danger', icon: '' };
            case 'Poor': return { class: 'badge-danger', icon: '⚠️ ' };
            default: return { class: 'badge-secondary', icon: '' };
        }
    };

    const handleOpenAddModal = () => {
        setReviewForm({
            staffId: staffList[0]?.id || '',
            period: '',
            rating: 'Good',
            remarks: '',
            linkedAction: 'None'
        });
        setIsAddModalOpen(true);
    };

    const handleSaveReview = async (e) => {
        e.preventDefault();
        const staffName = staffList.find(s => s.id === reviewForm.staffId)?.name || 'Unknown Staff';
        
        const newReview = {
            id: `REV-00${reviews.length + 1}`,
            staffId: reviewForm.staffId,
            staffName: staffName,
            period: reviewForm.period,
            rating: reviewForm.rating,
            remarks: reviewForm.remarks,
            linkedAction: reviewForm.linkedAction,
            reviewedBy: 'Admin' // Currently logged in user mock
        };

        setReviews([...reviews, newReview]);
        setIsAddModalOpen(false);
        await customAlert(`Performance review saved for ${staffName}.`, 'Success', 'success');
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Star size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Performance Management</h3>
                <button className="btn btn-primary" onClick={handleOpenAddModal}><PlusCircle size={16}/> Add Review</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Staff</th><th>Review Period</th><th>Rating</th><th>Remarks</th><th>Linked Action</th><th>Reviewed By</th></tr></thead>
                    <tbody>
                        {reviews.map(review => {
                            const rStyle = getRatingStyle(review.rating);
                            return (
                                <tr key={review.id}>
                                    <td className="fw-600">{review.staffName}</td>
                                    <td>{review.period}</td>
                                    <td><span className={`badge ${rStyle.class}`}>{rStyle.icon}{review.rating}</span></td>
                                    <td style={{ maxWidth: 300, whiteSpace: 'normal' }}>{review.remarks}</td>
                                    <td>
                                        {review.linkedAction !== 'None' ? 
                                            <span className="badge badge-draft" style={{ background: '#e0e7ff', color: '#3730a3' }}>{review.linkedAction}</span> 
                                            : '—'}
                                    </td>
                                    <td>{review.reviewedBy}</td>
                                </tr>
                            );
                        })}
                        {reviews.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px 0' }}>No performance reviews found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Review Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ background: 'white', width: '90%', maxWidth: 550, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0 }}>Add Performance Review</h3>
                            <button className="btn-icon" onClick={() => setIsAddModalOpen(false)}><X size={20}/></button>
                        </div>
                        <div style={{ padding: 24, overflowY: 'auto' }}>
                            <form onSubmit={handleSaveReview}>
                                <div className="ado-form">
                                    <div className="form-group">
                                        <label className="form-label">Staff Member *</label>
                                        <select className="form-select" required value={reviewForm.staffId} onChange={e => setReviewForm({...reviewForm, staffId: e.target.value})}>
                                            <option value="">Select Staff</option>
                                            {staffList.map(staff => (
                                                <option key={staff.id} value={staff.id}>{staff.name} ({staff.dept})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Review Period *</label>
                                        <input type="text" className="form-input" required value={reviewForm.period} onChange={e => setReviewForm({...reviewForm, period: e.target.value})} placeholder="e.g. April 2024 to March 2025" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Rating *</label>
                                        <select className="form-select" required value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})}>
                                            <option value="Excellent">Excellent (Consistently exceeds all expectations)</option>
                                            <option value="Good">Good (Meets and often exceeds expectations)</option>
                                            <option value="Average">Average (Meets basic job expectations)</option>
                                            <option value="Below Average">Below Average (Partially meets expectations)</option>
                                            <option value="Poor">Poor (Does not meet expectations)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Detailed Remarks *</label>
                                        <textarea className="form-input" required rows="4" value={reviewForm.remarks} onChange={e => setReviewForm({...reviewForm, remarks: e.target.value})} placeholder="Strengths, areas for improvement..."></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Linked Action (Optional)</label>
                                        <select className="form-select" value={reviewForm.linkedAction} onChange={e => setReviewForm({...reviewForm, linkedAction: e.target.value})}>
                                            <option value="None">None</option>
                                            <option value="Promotion">Promotion</option>
                                            <option value="Standard Increment">Standard Increment</option>
                                            <option value="Performance Improvement Plan">Performance Improvement Plan</option>
                                            <option value="Disciplinary review">Disciplinary review</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Review</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================== SHIFTS ========================
function ShiftsTab() {
    const [staffList] = useLocalStorage('mzs_staff', [
        { id: 'EMP-101', name: 'Rajesh Kumar', dept: 'Science' },
        { id: 'EMP-102', name: 'Priya Sharma', dept: 'Admin' },
        { id: 'EMP-103', name: 'Suresh Babu', dept: 'Transport' }
    ]);

    const [shifts, setShifts] = useLocalStorage('mzs_shifts', [
        { id: 'SHIFT-001', name: 'Morning Shift', startTime: '07:30', endTime: '14:30', minHrs: '6.5', gracePeriod: '15' },
        { id: 'SHIFT-002', name: 'General Shift', startTime: '09:00', endTime: '17:00', minHrs: '7.5', gracePeriod: '15' },
        { id: 'SHIFT-003', name: 'Afternoon Shift', startTime: '12:00', endTime: '19:00', minHrs: '6.5', gracePeriod: '10' }
    ]);

    const [assignments, setAssignments] = useLocalStorage('mzs_shift_assignments', [
        { id: 'ASSGN-001', targetType: 'Department', targetId: 'Admin', targetName: 'Admin Dept', shiftId: 'SHIFT-002', shiftName: 'General Shift', effectiveDate: '2024-04-01', rotation: 'None' }
    ]);

    const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
    const [shiftForm, setShiftForm] = useState({ name: '', startTime: '', endTime: '', minHrs: '', gracePeriod: '15' });

    const [assignForm, setAssignForm] = useState({ targetType: 'Staff', targetId: '', shiftId: '', effectiveDate: '', rotation: '' });

    // Utility: format 24h time to 12h AM/PM
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        let hours = parseInt(h);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
    };

    const handleSaveShift = async (e) => {
        e.preventDefault();
        const newShift = {
            id: `SHIFT-00${shifts.length + 1}`,
            ...shiftForm
        };
        setShifts([...shifts, newShift]);
        setIsAddShiftModalOpen(false);
        setShiftForm({ name: '', startTime: '', endTime: '', minHrs: '', gracePeriod: '15' });
        await customAlert(`Shift "${newShift.name}" saved successfully.`, 'Success', 'success');
    };

    const handleSaveAssignment = async (e) => {
        e.preventDefault();
        if (!assignForm.targetId || !assignForm.shiftId || !assignForm.effectiveDate) {
            await customAlert('Please fill all required assignment fields.', 'Error', 'error');
            return;
        }

        let targetName = '';
        if (assignForm.targetType === 'Department') {
            targetName = assignForm.targetId + ' Dept';
        } else {
            targetName = staffList.find(s => s.id === assignForm.targetId)?.name || 'Unknown Staff';
        }
        
        const shiftName = shifts.find(s => s.id === assignForm.shiftId)?.name || 'Unknown Shift';

        const newAssignment = {
            id: `ASSGN-00${assignments.length + 1}`,
            targetType: assignForm.targetType,
            targetId: assignForm.targetId,
            targetName: targetName,
            shiftId: assignForm.shiftId,
            shiftName: shiftName,
            effectiveDate: assignForm.effectiveDate,
            rotation: assignForm.rotation || 'None'
        };

        setAssignments([...assignments, newAssignment]);
        setAssignForm({ targetType: 'Staff', targetId: '', shiftId: '', effectiveDate: '', rotation: '' });
        await customAlert(`Shift assigned to ${targetName} effectively from ${assignForm.effectiveDate}.`, 'Success', 'success');
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Clock size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Shift & Timetable Management</h3>
                <button className="btn btn-primary" onClick={() => setIsAddShiftModalOpen(true)}><PlusCircle size={16}/> Add Shift</button>
            </div>
            
            <div className="hr-form-panel" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}><Timer size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Defined Shifts</h3>
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Shift Name</th><th>Start Time</th><th>End Time</th><th>Min Working Hrs</th><th>Grace Period</th></tr></thead>
                        <tbody>
                            {shifts.map(shift => (
                                <tr key={shift.id}>
                                    <td className="fw-600">{shift.name}</td>
                                    <td>{formatTime(shift.startTime)}</td>
                                    <td>{formatTime(shift.endTime)}</td>
                                    <td>{shift.minHrs} hrs</td>
                                    <td>{shift.gracePeriod} min</td>
                                </tr>
                            ))}
                            {shifts.length === 0 && (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px 0' }}>No shifts defined.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="hr-form-panel" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}><UserCheck size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Assign Shift</h3>
                <form onSubmit={handleSaveAssignment} className="ado-form form-row-4">
                    <div className="form-group">
                        <label className="form-label">Assign To Type *</label>
                        <select className="form-select" required value={assignForm.targetType} onChange={e => setAssignForm({...assignForm, targetType: e.target.value, targetId: ''})}>
                            <option value="Staff">Individual Staff</option>
                            <option value="Department">Department</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Select {assignForm.targetType} *</label>
                        {assignForm.targetType === 'Department' ? (
                            <select className="form-select" required value={assignForm.targetId} onChange={e => setAssignForm({...assignForm, targetId: e.target.value})}>
                                <option value="">Select Dept</option>
                                <option value="Science">Science</option>
                                <option value="Admin">Admin</option>
                                <option value="Transport">Transport</option>
                                <option value="Accounts">Accounts</option>
                            </select>
                        ) : (
                            <select className="form-select" required value={assignForm.targetId} onChange={e => setAssignForm({...assignForm, targetId: e.target.value})}>
                                <option value="">Select Staff</option>
                                {staffList.map(staff => (
                                    <option key={staff.id} value={staff.id}>{staff.name} ({staff.dept})</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Shift *</label>
                        <select className="form-select" required value={assignForm.shiftId} onChange={e => setAssignForm({...assignForm, shiftId: e.target.value})}>
                            <option value="">Select Shift</option>
                            {shifts.map(shift => (
                                <option key={shift.id} value={shift.id}>{shift.name} ({formatTime(shift.startTime)} - {formatTime(shift.endTime)})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Effective From *</label>
                        <input type="date" className="form-input" required value={assignForm.effectiveDate} onChange={e => setAssignForm({...assignForm, effectiveDate: e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Rotation (Optional)</label>
                        <input type="text" className="form-input" placeholder="e.g. Week A / Week B" value={assignForm.rotation} onChange={e => setAssignForm({...assignForm, rotation: e.target.value})}/>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 40 }}>Save Assignment</button>
                    </div>
                </form>
            </div>

            <div className="hr-form-panel">
                <h3 style={{ marginBottom: 16 }}>Active Assignments</h3>
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Target</th><th>Assigned Shift</th><th>Effective Date</th><th>Rotation</th></tr></thead>
                        <tbody>
                            {assignments.map(assign => (
                                <tr key={assign.id}>
                                    <td className="fw-600">
                                        <span className={`badge ${assign.targetType === 'Department' ? 'badge-draft' : 'badge-success'}`} style={{ marginRight: 8, padding: '2px 6px', fontSize: 10 }}>{assign.targetType}</span>
                                        {assign.targetName}
                                    </td>
                                    <td>{assign.shiftName}</td>
                                    <td>{assign.effectiveDate}</td>
                                    <td>{assign.rotation}</td>
                                </tr>
                            ))}
                            {assignments.length === 0 && (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px 0' }}>No assignments found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Define Shift Modal */}
            {isAddShiftModalOpen && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ background: 'white', width: '90%', maxWidth: 500, borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0 }}>Define New Shift</h3>
                            <button className="btn-icon" onClick={() => setIsAddShiftModalOpen(false)}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSaveShift} style={{ padding: 24 }}>
                            <div className="ado-form">
                                <div className="form-group">
                                    <label className="form-label">Shift Name *</label>
                                    <input type="text" className="form-input" required value={shiftForm.name} onChange={e => setShiftForm({...shiftForm, name: e.target.value})} placeholder="e.g. Morning, General, Night" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Start Time *</label>
                                        <input type="time" className="form-input" required value={shiftForm.startTime} onChange={e => setShiftForm({...shiftForm, startTime: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">End Time *</label>
                                        <input type="time" className="form-input" required value={shiftForm.endTime} onChange={e => setShiftForm({...shiftForm, endTime: e.target.value})} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Min. Working Hours for Full-Day *</label>
                                    <input type="number" step="0.5" className="form-input" required value={shiftForm.minHrs} onChange={e => setShiftForm({...shiftForm, minHrs: e.target.value})} placeholder="e.g. 7.5" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Grace Period (Minutes) *</label>
                                    <input type="number" className="form-input" required value={shiftForm.gracePeriod} onChange={e => setShiftForm({...shiftForm, gracePeriod: e.target.value})} placeholder="e.g. 15" />
                                </div>
                            </div>
                            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsAddShiftModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Shift</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================== REPORTS ========================
function ReportsTab() {
    const [staffList] = useLocalStorage('mzs_staff', []);
    const [attendance] = useLocalStorage('mzs_attendance', []);
    const [leaveList] = useLocalStorage('mzs_leave_req', []);
    const [payroll] = useLocalStorage('mzs_payroll_records', []);
    const [applications] = useLocalStorage('mzs_applications', []);
    const [performance] = useLocalStorage('mzs_performance', []);
    const [documents] = useLocalStorage('mzs_documents', []);

    const [filter, setFilter] = useState({ type: 'Staff List Report', dept: 'All', period: 'All' });
    const [reportData, setReportData] = useState(null);

    const generateReport = () => {
        let data = [];
        let headers = [];

        // Apply Dept Filter
        const filteredStaff = filter.dept === 'All' ? staffList : staffList.filter(s => s.dept === filter.dept);
        const staffIds = filteredStaff.map(s => s.id);

        switch (filter.type) {
            case 'Staff List Report':
                headers = ['Employee ID', 'Name', 'Department', 'Role', 'Joining Date'];
                data = filteredStaff.map(s => [s.id, s.name, s.dept, s.role, s.joined]);
                break;
            case 'Attendance Report (Daily Summary)':
                headers = ['Date', 'Staff Name', 'Department', 'Status', 'Remarks'];
                data = attendance
                    .filter(a => staffIds.includes(a.staffId))
                    .map(a => [a.date, a.staffName, staffList.find(s=>s.id===a.staffId)?.dept||'-', a.status, a.remarks || '-']);
                break;
            case 'Monthly Attendance Report':
                headers = ['Staff Name', 'Department', 'Total Days', 'Present', 'Absent', 'Late', 'Half Day', 'On Leave'];
                data = filteredStaff.map(s => {
                    const staffAtt = attendance.filter(a => a.staffId === s.id);
                    const total = staffAtt.length;
                    const present = staffAtt.filter(a => a.status === 'Present').length;
                    const absent = staffAtt.filter(a => a.status === 'Absent').length;
                    const late = staffAtt.filter(a => a.status === 'Late').length;
                    const halfDay = staffAtt.filter(a => a.status === 'Half Day').length;
                    const onLeave = staffAtt.filter(a => a.status === 'On Leave').length;
                    return [s.name, s.dept, total, present, absent, late, halfDay, onLeave];
                });
                break;
            case 'Staff-wise Attendance Percentage':
                headers = ['Staff Name', 'Department', 'Attendance %'];
                data = filteredStaff.map(s => {
                    const staffAtt = attendance.filter(a => a.staffId === s.id);
                    const total = staffAtt.length;
                    if (total === 0) return [s.name, s.dept, 'N/A'];
                    // Let's count Present and Half Day (as 0.5)
                    const present = staffAtt.filter(a => a.status === 'Present').length;
                    const halfDay = staffAtt.filter(a => a.status === 'Half Day').length;
                    const late = staffAtt.filter(a => a.status === 'Late').length; // Late usually counts as present for percentage unless configured otherwise
                    const score = present + (halfDay * 0.5) + late;
                    const percentage = ((score / total) * 100).toFixed(2) + '%';
                    return [s.name, s.dept, percentage];
                });
                break;
            case 'Absentee Report':
                headers = ['Date', 'Staff Name', 'Department', 'Remarks'];
                data = attendance
                    .filter(a => staffIds.includes(a.staffId) && a.status === 'Absent')
                    .map(a => [a.date, a.staffName, staffList.find(s=>s.id===a.staffId)?.dept||'-', a.remarks || '-']);
                break;
            case 'Leave Report':
                headers = ['Staff Name', 'Leave Type', 'From', 'To', 'Status'];
                // Match by name for legacy data since leave reqs used names instead of IDs
                const staffNames = filteredStaff.map(s => s.name);
                data = leaveList
                    .filter(l => staffNames.includes(l.staff))
                    .map(l => [l.staff, l.type, l.from, l.to, l.status]);
                break;
            case 'Payroll Report':
                headers = ['Staff Name', 'Month', 'Basic Pay', 'Net Pay', 'Status'];
                data = payroll
                    .filter(p => staffIds.includes(p.staffId))
                    .map(p => [p.name, p.month, `₹${p.basic}`, `₹${p.netPay}`, p.status || 'Processed']);
                break;
            case 'Recruitment Report':
                headers = ['Applicant Name', 'Job Post', 'Applied Date', 'Status'];
                data = applications.map(a => [a.name, a.jobId, a.date, a.status]);
                break;
            case 'Performance Report':
                headers = ['Staff Name', 'Review Period', 'Rating', 'Remarks'];
                data = performance
                    .filter(p => staffIds.includes(p.staffId))
                    .map(p => [p.staffName, p.period, p.rating, p.remarks]);
                break;
            case 'Document Expiry Report':
                headers = ['Staff Name', 'Document Type', 'Expiry Date'];
                data = documents
                    .filter(d => staffIds.includes(d.staffId) && d.expiryDate)
                    .map(d => [d.staffName, d.type, d.expiryDate]);
                break;
            default:
                break;
        }

        setReportData({ headers, rows: data, title: filter.type });
    };

    const handleExport = (format) => {
        if (!reportData) return;
        const txt = `${reportData.title}\n\n${reportData.headers.join('\t')}\n` + reportData.rows.map(r => r.join('\t')).join('\n');
        const blob = new Blob([txt], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${reportData.title.replace(/ /g, '_')}.${format}`;
        a.click();
        customAlert(`Report exported successfully as ${format.toUpperCase()}.`, 'Export Complete', 'success');
    };

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Download size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> HR Reports & Analytics</h3>
            
            <div className="hr-form-panel" style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label">Report Type</label>
                    <select className="form-select" value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})}>
                        <option>Staff List Report</option>
                        <option>Attendance Report (Daily Summary)</option>
                        <option>Monthly Attendance Report</option>
                        <option>Staff-wise Attendance Percentage</option>
                        <option>Absentee Report</option>
                        <option>Leave Report</option>
                        <option>Payroll Report</option>
                        <option>Recruitment Report</option>
                        <option>Performance Report</option>
                        <option>Document Expiry Report</option>
                    </select>
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label">Department</label>
                    <select className="form-select" value={filter.dept} onChange={e => setFilter({...filter, dept: e.target.value})}>
                        <option value="All">All Departments</option>
                        <option value="Science">Science</option>
                        <option value="Admin">Admin</option>
                        <option value="Transport">Transport</option>
                        <option value="Student Welfare">Student Welfare</option>
                    </select>
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label">Period</label>
                    <select className="form-select" value={filter.period} onChange={e => setFilter({...filter, period: e.target.value})}>
                        <option value="All">All Time</option>
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                    </select>
                </div>
                <button className="btn btn-primary" style={{ padding: '10px 24px', height: 40 }} onClick={generateReport}>Generate Preview</button>
            </div>

            {reportData ? (
                <div className="hr-form-panel animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ margin: 0 }}>{reportData.title} Preview</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-outline" onClick={() => handleExport('pdf')}><FileText size={16} style={{ marginRight: 6 }}/> PDF</button>
                            <button className="btn btn-outline" onClick={() => handleExport('xlsx')}><Download size={16} style={{ marginRight: 6 }}/> Excel</button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead><tr>{reportData.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                            <tbody>
                                {reportData.rows.map((row, i) => (
                                    <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                                ))}
                                {reportData.rows.length === 0 && (
                                    <tr><td colSpan={reportData.headers.length} style={{ textAlign: 'center', padding: '20px 0' }}>No data found for the selected filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--text-muted)' }}>
                    Select a report type and click Generate Preview to view data. Reports support filtering by date range and department.
                </div>
            )}
        </div>
    );
}

// ======================== SETTINGS ========================
function SettingsTab() {
    const [settings, setSettings] = useLocalStorage('mzs_hr_settings', {
        empIdFormat: 'EMP-YYYY-NNN',
        payrollDay: '28th of each month',
        lateThreshold: 15,
        attendanceLock: '11:59 PM same day',
        leaveYearStart: 'April',
        leaveCarryover: 'Disabled',
        biometricSync: 'Disabled',
        payslipEmail: 'Disabled',
        documentExpiryAlert: 30
    });

    const [formData, setFormData] = useState(settings);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSettings(formData);
        await customAlert('HR settings have been saved successfully.', 'Settings Saved', 'success');
    };

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Settings size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> HR Module Settings</h3>
            <div className="hr-form-panel">
                <div className="ado-form">
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Employee ID Format</label><input type="text" name="empIdFormat" className="form-input" value={formData.empIdFormat} onChange={handleChange}/></div>
                        <div className="form-group"><label className="form-label">Payroll Processing Day</label><select name="payrollDay" className="form-select" value={formData.payrollDay} onChange={handleChange}><option>28th of each month</option><option>Last day of month</option><option>1st of next month</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Late Threshold (minutes after shift start)</label><input type="number" name="lateThreshold" className="form-input" value={formData.lateThreshold} onChange={handleChange}/></div>
                        <div className="form-group"><label className="form-label">Attendance Lock Time</label><select name="attendanceLock" className="form-select" value={formData.attendanceLock} onChange={handleChange}><option>11:59 PM same day</option><option>6:00 PM same day</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Leave Year Start</label><select name="leaveYearStart" className="form-select" value={formData.leaveYearStart} onChange={handleChange}><option>April</option><option>January</option></select></div>
                        <div className="form-group"><label className="form-label">Leave Carryover</label><select name="leaveCarryover" className="form-select" value={formData.leaveCarryover} onChange={handleChange}><option>Disabled</option><option>Enabled — Max 5 days</option><option>Enabled — No Limit</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Biometric Sync</label><select name="biometricSync" className="form-select" value={formData.biometricSync} onChange={handleChange}><option>Disabled</option><option>Enabled (ZKTeco)</option><option>Enabled (ESSL)</option></select></div>
                        <div className="form-group"><label className="form-label">Auto-send Payslip via Email</label><select name="payslipEmail" className="form-select" value={formData.payslipEmail} onChange={handleChange}><option>Disabled</option><option>Enabled</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Document Expiry Alert (days before)</label><input type="number" name="documentExpiryAlert" className="form-input" value={formData.documentExpiryAlert} onChange={handleChange}/></div>
                        <div className="form-group"></div>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}><button className="btn btn-primary" onClick={handleSave}>Save HR Settings</button></div>
                </div>
            </div>
        </div>
    );
}

// ======================== LOGIN MANAGEMENT ========================
// ======================== LOGIN MANAGEMENT ========================
function LoginManagementModal({ isOpen, onClose, mode, user, onSave }) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'Staff / Teacher',
        access: 'Enabled'
    });

    useEffect(() => {
        if (user && mode === 'edit') {
            setFormData(user);
        } else {
            setFormData({ id: '', name: '', email: '', password: '', role: 'Staff / Teacher', access: 'Enabled' });
        }
    }, [user, mode, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.id || !formData.password) {
            customAlert('Please fill all required fields (Name, Email, Staff ID, and Password).', 'Validation Error', 'error');
            return;
        }
        onSave(formData);
        onClose();
    };

    return createPortal(
        <div className="global-dialog-overlay animate-fade-in" style={{ zIndex: 9999 }}>
            <div className="global-dialog-modal animate-slide-up" style={{ maxWidth: 500, padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ color: 'var(--primary)', margin: 0 }}>{mode === 'edit' ? 'Edit User Access' : 'Create New Admin User'}</h2>
                    <button className="btn-icon" onClick={onClose}><X size={20}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="ado-form">
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rajesh Kumar"/>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Email Address *</label>
                            <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="e.g. teacher@mountzion.edu"/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Portal Password *</label>
                            <input type="text" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Set login password"/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Staff ID *</label>
                            <input type="text" className="form-input" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="EMP-XXXX" disabled={mode === 'edit'}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">System Role *</label>
                            <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                <option>Super Admin</option>
                                <option>Admin / Principal</option>
                                <option>Staff / Teacher</option>
                                <option>Accountant</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Portal Access Status</label>
                        <select className="form-select" value={formData.access} onChange={e => setFormData({...formData, access: e.target.value})}>
                            <option>Enabled</option>
                            <option>Disabled</option>
                        </select>
                    </div>

                    <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {mode === 'edit' ? 'Update Access' : 'Save User Credentials'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

function LoginManagementTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('mzs_system_users');
        if (saved) return JSON.parse(saved);
        return [
            { id: 'EMP-2024-001', name: 'Rajesh Kumar', role: 'Staff / Teacher', email: 'teacher@mountzion.edu', password: 'teacher123', access: 'Enabled' },
            { id: 'EMP-2024-002', name: 'Dr. Sarah', role: 'Admin / Principal', email: 'principal@mountzion.edu', password: 'admin123', access: 'Enabled' },
            { id: 'EMP-2024-004', name: 'Vijay Singh', role: 'Accountant', email: 'accountant@mountzion.edu', password: 'finance123', access: 'Enabled' },
        ];
    });

    const [modal, setModal] = useState({ isOpen: false, mode: 'create', user: null });

    useEffect(() => {
        localStorage.setItem('mzs_system_users', JSON.stringify(users));
    }, [users]);

    const toggleAccess = (id) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, access: u.access === 'Enabled' ? 'Disabled' : 'Enabled' } : u));
    };

    const handleSaveUser = (userData) => {
        if (modal.mode === 'create') {
            if (users.find(u => u.id === userData.id)) {
                customAlert('A user with this Staff ID already exists.', 'Error', 'error');
                return;
            }
            setUsers([...users, userData]);
            customAlert('User credentials generated successfully!', 'Success', 'success');
        } else {
            setUsers(users.map(u => u.id === userData.id ? userData : u));
            customAlert('User access updated successfully!', 'Success', 'success');
        }
    };

    const deleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete this user login record?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="animate-fade-in">
            <LoginManagementModal 
                isOpen={modal.isOpen} 
                onClose={() => setModal({ ...modal, isOpen: false })} 
                mode={modal.mode} 
                user={modal.user}
                onSave={handleSaveUser}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><ShieldCheck size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> User Login Management</h3>
                <button className="btn btn-primary" onClick={() => setModal({ isOpen: true, mode: 'create', user: null })}><UserPlus size={16}/> Create Admin User</button>
            </div>

            <div className="hr-form-panel" style={{ padding: 16, marginBottom: 20 }}>
                <div className="ado-form" style={{ display: 'flex', gap: 16 }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <div className="relative">
                            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
                            <input type="text" className="form-input" style={{ paddingLeft: 36 }} placeholder="Search staff by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="data-table">
                    <thead><tr><th>Staff ID</th><th>Name</th><th>Email</th><th>System Role</th><th>Portal Access</th><th>Actions</th></tr></thead>
                    <tbody>
                        {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                            <tr key={u.id}>
                                <td style={{ fontFamily: 'monospace' }}>{u.id}</td>
                                <td className="fw-600">{u.name}</td>
                                <td>{u.email}</td>
                                <td><span className="badge badge-draft">{u.role}</span></td>
                                <td>
                                    <span className={`badge ${u.access === 'Enabled' ? 'badge-success' : 'badge-danger'}`}>
                                        {u.access}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => toggleAccess(u.id)}>
                                            {u.access === 'Enabled' ? 'Revoke' : 'Grant'}
                                        </button>
                                        <button className="btn-icon" title="Edit Access" onClick={() => setModal({ isOpen: true, mode: 'edit', user: u })}><Settings size={16}/></button>
                                        <button className="btn-icon text-danger" title="Delete record" onClick={() => deleteUser(u.id)}><X size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ℹ️ Only Super Admin can manage system login credentials and roles for staff members.
            </p>
        </div>
    );
}

// ======================== MAIN HR COMPONENT ========================
const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['Super Admin', 'Admin', 'HR Manager', 'Staff', 'Teacher', 'CMS Admin'] },
    { id: 'staff', label: 'Staff', icon: Users, roles: ['Super Admin', 'Admin', 'HR Manager', 'Staff', 'Teacher'] },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: ['Super Admin', 'Admin', 'HR Manager'] },
    { id: 'leave', label: 'Leave', icon: Calendar, roles: ['Super Admin', 'Admin', 'HR Manager', 'Staff', 'Teacher'] },
    { id: 'payroll', label: 'Payroll', icon: IndianRupee, roles: ['Super Admin', 'Admin', 'HR Manager', 'Staff', 'Teacher'] },
    { id: 'recruitment', label: 'Recruitment', icon: Briefcase, roles: ['Super Admin', 'Admin', 'HR Manager'] },
    { id: 'documents', label: 'Documents', icon: FileText, roles: ['Super Admin', 'Admin', 'HR Manager', 'Staff', 'Teacher'] },
    { id: 'performance', label: 'Performance', icon: Star, roles: ['Super Admin', 'Admin', 'HR Manager'] },
    { id: 'shifts', label: 'Shifts', icon: Clock, roles: ['Super Admin', 'Admin', 'HR Manager'] },
    { id: 'login-management', label: 'Login Access', icon: ShieldCheck, roles: ['Super Admin'] },
    { id: 'reports', label: 'Reports', icon: Download, roles: ['Super Admin', 'Admin', 'HR Manager'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Super Admin', 'Admin'] },
];

// ======================== STAFF PROFILE MODAL ========================
function StaffProfileModal({ staff, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');

    if (!staff) return null;

    return createPortal(
        <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ background: 'white', width: '90%', maxWidth: 800, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold' }}>
                            {staff.name.charAt(0)}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>{staff.name}</h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{staff.role} • {staff.dept} • {staff.id}</p>
                        </div>
                    </div>
                    <button className="btn-icon" onClick={onClose}><X size={20}/></button>
                </div>
                
                <div style={{ borderBottom: '1px solid #e9ecef', display: 'flex', gap: 24, padding: '0 24px' }}>
                    {['overview', 'attendance', 'leave', 'payroll', 'documents', 'performance'].map(tab => (
                        <button 
                            key={tab} 
                            style={{ 
                                padding: '16px 0', 
                                background: 'none', 
                                border: 'none', 
                                borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                                color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === tab ? '600' : '400',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
                    {activeTab === 'overview' && (
                        <div className="ado-form form-row-2">
                            <div className="form-group"><label className="form-label">Employee ID</label><p>{staff.id}</p></div>
                            <div className="form-group"><label className="form-label">Name</label><p>{staff.name}</p></div>
                            <div className="form-group"><label className="form-label">Role</label><p>{staff.role}</p></div>
                            <div className="form-group"><label className="form-label">Department</label><p>{staff.dept}</p></div>
                            <div className="form-group"><label className="form-label">Employment Type</label><p><span className="badge badge-info">{staff.type || 'Full-time'}</span></p></div>
                            <div className="form-group"><label className="form-label">Date of Joining</label><p>{staff.joined}</p></div>
                            <div className="form-group"><label className="form-label">Email</label><p>{staff.email || 'N/A'}</p></div>
                            <div className="form-group"><label className="form-label">Phone</label><p>{staff.phone || 'N/A'}</p></div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">Address</label><p>{staff.address || 'N/A'}</p></div>
                        </div>
                    )}
                    
                    {activeTab === 'attendance' && (
                        <div>
                            <h4 style={{ marginBottom: 16 }}>Attendance Summary (Current Month)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                                <div style={{ padding: 16, background: 'var(--success-light)', borderRadius: 8 }}><div style={{ fontSize: '0.85rem', color: 'var(--success)' }}>Present</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>20</div></div>
                                <div style={{ padding: 16, background: 'var(--warning-light)', borderRadius: 8 }}><div style={{ fontSize: '0.85rem', color: 'var(--warning)' }}>Late</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2</div></div>
                                <div style={{ padding: 16, background: 'var(--danger-light)', borderRadius: 8 }}><div style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>Absent</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>0</div></div>
                                <div style={{ padding: 16, background: 'var(--info-light)', borderRadius: 8 }}><div style={{ fontSize: '0.85rem', color: 'var(--info)' }}>Leave</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1</div></div>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>* Detailed calendar view would be displayed here.</p>
                        </div>
                    )}

                    {activeTab === 'leave' && (
                        <div>
                            <h4 style={{ marginBottom: 16 }}>Leave Balance</h4>
                            <table className="data-table">
                                <thead><tr><th>Leave Type</th><th>Total Allocated</th><th>Used</th><th>Available</th></tr></thead>
                                <tbody>
                                    <tr><td>Casual Leave</td><td>12</td><td>3</td><td>9</td></tr>
                                    <tr><td>Sick Leave</td><td>10</td><td>2</td><td>8</td></tr>
                                    <tr><td>Privilege Leave</td><td>15</td><td>0</td><td>15</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'payroll' && (
                        <div>
                            <h4 style={{ marginBottom: 16 }}>Recent Payslips</h4>
                            <table className="data-table">
                                <thead><tr><th>Month</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net Pay</th><th>Action</th></tr></thead>
                                <tbody>
                                    <tr><td>Feb 2026</td><td>₹45,000</td><td>₹8,000</td><td>₹3,500</td><td>₹49,500</td><td><button className="btn-icon"><Download size={16}/></button></td></tr>
                                    <tr><td>Jan 2026</td><td>₹45,000</td><td>₹8,000</td><td>₹3,500</td><td>₹49,500</td><td><button className="btn-icon"><Download size={16}/></button></td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div>
                            <h4 style={{ marginBottom: 16 }}>Uploaded Documents</h4>
                            <table className="data-table">
                                <thead><tr><th>Document Type</th><th>Reference</th><th>Uploaded On</th><th>Action</th></tr></thead>
                                <tbody>
                                    <tr><td>Aadhar Card</td><td>UID-1234</td><td>2024-06-15</td><td><button className="btn-icon"><Eye size={16}/></button></td></tr>
                                    <tr><td>PAN Card</td><td>PAN-ABCDE</td><td>2024-06-15</td><td><button className="btn-icon"><Eye size={16}/></button></td></tr>
                                    <tr><td>Degree Certificate</td><td>MSc Math</td><td>2024-06-15</td><td><button className="btn-icon"><Eye size={16}/></button></td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'performance' && (
                        <div>
                            <h4 style={{ marginBottom: 16 }}>Performance Appraisals</h4>
                            <div style={{ padding: 16, border: '1px solid #e9ecef', borderRadius: 8, marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontWeight: '600' }}>Annual Review 2025</span>
                                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>4.5 / 5.0</span>
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Excellent classroom management and student engagement. Consistently meets syllabus targets ahead of schedule.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function HR() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const currentTab = location.pathname.split('/').pop();
    const activeTab = TABS.some(t => t.id === currentTab) ? currentTab : 'dashboard';

    const handleNavigate = (tab) => { navigate(`/hr/${tab}`); };

    // Filter tabs for role
    const filteredTabs = TABS.filter(t => t.roles.includes(user?.role || 'Staff') || (user?.role === 'Teacher' && t.roles.includes('Teacher')));

    return (
        <div className="hr-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb">
                    <Link to="/">Dashboard</Link><span className="separator">/</span><span>HR</span>
                    {activeTab !== 'dashboard' && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{filteredTabs.find(t => t.id === activeTab)?.label}</span></>}
                </div>
                <h1>Human Resources Management</h1>
            </div></div>
            <div className="card hr-card">
                <div className="tabs-header">
                    {filteredTabs.map(tab => { 
                        const Icon = tab.icon; 
                        return <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>; 
                    })}
                </div>
                <div className="tabs-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardTab />} />
                        <Route path="staff" element={<StaffTab />} />
                        <Route path="attendance" element={<AttendanceTab />} />
                        <Route path="leave" element={<LeaveTab />} />
                        <Route path="payroll" element={<PayrollTab />} />
                        <Route path="recruitment" element={<RecruitmentTab />} />
                        <Route path="documents" element={<DocumentsTab />} />
                        <Route path="performance" element={<PerformanceTab />} />
                        <Route path="shifts" element={<ShiftsTab />} />
                        <Route path="login-management" element={<LoginManagementTab />} />
                        <Route path="reports" element={<ReportsTab />} />
                        <Route path="settings" element={<SettingsTab />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
