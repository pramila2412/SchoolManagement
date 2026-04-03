import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    BarChart3, IndianRupee, SlidersHorizontal, AlertTriangle, FileText,
    TrendingDown, RotateCcw, BookOpen, Monitor, Package,
    Download, Settings, Globe, PlusCircle, Search, CreditCard,
    CheckCircle2, XCircle, Clock, Eye, Printer, UploadCloud,
    TrendingUp, Calculator, Grid
} from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import { api } from '../utils/api';
import './Finance.css';

// ======================== DASHBOARD ========================
function DashboardTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><BarChart3 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Finance Overview</h3>
            
            <div className="fin-quick-actions">
                <button className="fin-quick-btn"><IndianRupee size={16} color="var(--primary)"/> Collect Fee</button>
                <button className="fin-quick-btn"><TrendingDown size={16} color="var(--danger)"/> Record Expense</button>
                <button className="fin-quick-btn"><FileText size={16} color="var(--info)"/> Generate Invoice</button>
                <button className="fin-quick-btn"><RotateCcw size={16} color="var(--warning)"/> Initiate Refund</button>
            </div>

            <div className="fin-dashboard-grid">
                <div className="fin-kpi-card">
                    <div className="fin-kpi-info"><h4>Total Revenue (MTD)</h4><p className="success">₹ 14,50,000</p></div>
                    <div className="fin-kpi-icon" style={{ background: 'var(--success-light)' }}><TrendingUp size={24} color="var(--success)"/></div>
                </div>
                <div className="fin-kpi-card">
                    <div className="fin-kpi-info"><h4>Total Expenses (MTD)</h4><p className="danger">₹ 3,45,200</p></div>
                    <div className="fin-kpi-icon" style={{ background: 'var(--danger-light)' }}><TrendingDown size={24} color="var(--danger)"/></div>
                </div>
                <div className="fin-kpi-card">
                    <div className="fin-kpi-info"><h4>Outstanding Dues</h4><p className="warning">₹ 8,90,500</p></div>
                    <div className="fin-kpi-icon" style={{ background: 'var(--warning-light)' }}><AlertTriangle size={24} color="var(--warning)"/></div>
                </div>
                <div className="fin-kpi-card">
                    <div className="fin-kpi-info"><h4>Net Balance</h4><p>₹ 11,04,800</p></div>
                    <div className="fin-kpi-icon" style={{ background: 'var(--info-light)' }}><IndianRupee size={24} color="var(--info)"/></div>
                </div>
            </div>

            <div className="fin-form-panel" style={{ minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <BarChart3 size={64} opacity={0.2} style={{ marginBottom: 16 }}/>
                <h4>Revenue vs Expense Trend</h4>
                <p style={{ fontSize: '0.85rem' }}>Interactive line charts will render here showing rolling 12-month data.</p>
            </div>
        </div>
    );
}

// ======================== FEE STRUCTURE ========================
function FeeStructureTab() {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const defaultStructures = [
        { _id: '1', classGroup: 'Nursery, LKG & UKG', classes: ['Nursery', 'LKG', 'UKG'], admissionFee: 0, admissionFeeNote: 'FREE (3,000.00)', annualFee: 2000, examFee: 2000, monthlyFee: 1500, total: 5500 },
        { _id: '2', classGroup: 'STD. 1 to 2', classes: ['I', 'II'], admissionFee: 0, admissionFeeNote: 'FREE (4,000.00)', annualFee: 3000, examFee: 2000, monthlyFee: 2000, total: 7000 },
        { _id: '3', classGroup: 'STD. 3 to 4', classes: ['III', 'IV'], admissionFee: 0, admissionFeeNote: 'FREE (4,000.00)', annualFee: 3000, examFee: 2000, monthlyFee: 2400, total: 7400 },
        { _id: '4', classGroup: 'STD. 5 to 7', classes: ['V', 'VI', 'VII'], admissionFee: 7500, annualFee: 7950, examFee: 3050, monthlyFee: 2700, total: 21200 },
        { _id: '5', classGroup: 'STD. 8', classes: ['VIII'], admissionFee: 7500, annualFee: 7950, examFee: 3650, monthlyFee: 3300, total: 22400 },
        { _id: '6', classGroup: 'STD. 9', classes: ['IX'], admissionFee: 8000, annualFee: 9150, examFee: 4250, monthlyFee: 3300, total: 24700 },
        { _id: '7', classGroup: 'STD. 11', classes: ['XI'], admissionFee: 0, annualFee: 8550, examFee: 4000, monthlyFee: 3300, total: 15850 },
    ];
    const [structures, setStructures] = useState(defaultStructures);
    const [isAdding, setIsAdding] = useState(false);
    const [classDropdownOpen, setClassDropdownOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const emptyForm = { classGroup: '', classes: [], admissionFee: '', annualFee: '', examFee: '', monthlyFee: '' };
    const [newEntry, setNewEntry] = useState({...emptyForm});
    const calcTotal = (e) => (Number(e.admissionFee)||0) + (Number(e.annualFee)||0) + (Number(e.examFee)||0) + (Number(e.monthlyFee)||0);
    const toggleClass = (cls) => {
        if (cls === 'All Classes') {
            setNewEntry(prev => prev.classes.includes('All Classes') ? {...prev, classes: [], classGroup: ''} : {...prev, classes: ['All Classes'], classGroup: 'All Classes'});
            return;
        }
        setNewEntry(prev => {
            const filtered = prev.classes.filter(c => c !== 'All Classes');
            const updated = filtered.includes(cls) ? filtered.filter(c => c !== cls) : [...filtered, cls];
            return {...prev, classes: updated, classGroup: updated.join(', ')};
        });
    };
    const handleSave = async () => {
        if (newEntry.classes.length === 0) return customAlert('Please select at least one class');
        if (!newEntry.annualFee && !newEntry.examFee && !newEntry.monthlyFee && !newEntry.admissionFee) return customAlert('Please enter at least one fee amount');
        setSaving(true);
        try {
            const entry = { ...newEntry, admissionFee: Number(newEntry.admissionFee)||0, annualFee: Number(newEntry.annualFee)||0, examFee: Number(newEntry.examFee)||0, monthlyFee: Number(newEntry.monthlyFee)||0, total: calcTotal(newEntry), _id: 'new-' + Date.now() };
            setStructures([entry, ...structures]);
            setIsAdding(false); setClassDropdownOpen(false); setNewEntry({...emptyForm});
            await customAlert('Fee structure added successfully!');
        } catch (err) { await customAlert(err.message || 'Failed to save.'); } finally { setSaving(false); }
    };
    const fmt = (v) => (!v && v !== 0) ? '—' : '₹ ' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 });

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h3 style={{ color: 'var(--primary)', margin: 0 }}><SlidersHorizontal size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Fee Structure 2026-27</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Mount Zion School, Sion Nagar, Purnea</p>
                </div>
                {!isAdding && <button className="btn btn-primary" onClick={() => setIsAdding(true)}><PlusCircle size={16}/> Add Fee Structure</button>}
            </div>
            {isAdding && (
                <div className="card animate-slide-up" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--accent)', borderRadius: 12 }}>
                    <h4 style={{ marginBottom: 20, color: 'var(--primary)' }}>Add New Fee Structure</h4>
                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <label className="form-label">Assigned Classes <span className="required">*</span></label>
                        <div style={{ position: 'relative' }}>
                            <div className="form-input" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, minHeight: 44, padding: '6px 12px' }} onClick={() => setClassDropdownOpen(!classDropdownOpen)}>
                                {newEntry.classes.length === 0 ? <span style={{ color: '#8898aa', fontSize: '0.88rem' }}>Select classes (e.g. Nursery, LKG, UKG)...</span> : newEntry.classes.map(cls => (
                                    <span key={cls} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--accent)', color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>
                                        {cls}<span style={{ cursor: 'pointer', marginLeft: 2, fontWeight: 'bold' }} onClick={(e) => { e.stopPropagation(); toggleClass(cls); }}>×</span>
                                    </span>
                                ))}
                            </div>
                            {classDropdownOpen && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: 260, overflowY: 'auto', marginTop: 4, padding: '8px 0' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', borderBottom: '1px solid #f0f0f5', background: newEntry.classes.includes('All Classes') ? 'rgba(28,167,166,0.08)' : 'transparent' }}>
                                        <input type="checkbox" checked={newEntry.classes.includes('All Classes')} onChange={() => toggleClass('All Classes')} style={{ accentColor: 'var(--accent)' }}/>All Classes
                                    </label>
                                    {ALL_CLASSES.map(cls => (
                                        <label key={cls} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', cursor: 'pointer', fontSize: '0.88rem', background: newEntry.classes.includes(cls) ? 'rgba(28,167,166,0.06)' : 'transparent' }}>
                                            <input type="checkbox" checked={newEntry.classes.includes('All Classes') || newEntry.classes.includes(cls)} disabled={newEntry.classes.includes('All Classes')} onChange={() => toggleClass(cls)} style={{ accentColor: 'var(--accent)' }}/>Class {cls}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
                        <div className="form-group"><label className="form-label">Admission Fee (₹)</label><input type="number" className="form-input" placeholder="0.00" value={newEntry.admissionFee} onChange={e => setNewEntry({...newEntry, admissionFee: e.target.value})}/></div>
                        <div className="form-group"><label className="form-label">Annual Fee (₹)</label><input type="number" className="form-input" placeholder="0.00" value={newEntry.annualFee} onChange={e => setNewEntry({...newEntry, annualFee: e.target.value})}/></div>
                        <div className="form-group"><label className="form-label">Examination Fee (₹)</label><input type="number" className="form-input" placeholder="0.00" value={newEntry.examFee} onChange={e => setNewEntry({...newEntry, examFee: e.target.value})}/></div>
                        <div className="form-group"><label className="form-label">Monthly Fee (₹)</label><input type="number" className="form-input" placeholder="0.00" value={newEntry.monthlyFee} onChange={e => setNewEntry({...newEntry, monthlyFee: e.target.value})}/></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>Total: {fmt(calcTotal(newEntry))}</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-outline" onClick={() => { setIsAdding(false); setClassDropdownOpen(false); }}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Fee Structure'}</button>
                        </div>
                    </div>
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {structures.map(s => (
                    <div key={s._id} className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e9ecef', borderRadius: 12 }}>
                        <div style={{ background: 'var(--primary)', color: '#fff', padding: '12px 16px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', letterSpacing: 0.5 }}>{s.classGroup}</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <tbody>
                                {(s.admissionFee > 0 || s.admissionFeeNote) && <tr style={{ borderBottom: '1px solid #f0f0f5' }}><td style={{ padding: '10px 16px', color: '#495057', fontWeight: 500 }}>ADMISSION FEE</td><td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#1a1a2e' }}>{s.admissionFeeNote || fmt(s.admissionFee)}</td></tr>}
                                <tr style={{ borderBottom: '1px solid #f0f0f5' }}><td style={{ padding: '10px 16px', color: '#495057', fontWeight: 500 }}>ANNUAL FEE (INCIDENTAL)</td><td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#1a1a2e' }}>{fmt(s.annualFee)}</td></tr>
                                <tr style={{ borderBottom: '1px solid #f0f0f5' }}><td style={{ padding: '10px 16px', color: '#495057', fontWeight: 500 }}>EXAMINATION FEE (1 YEAR)</td><td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#1a1a2e' }}>{fmt(s.examFee)}</td></tr>
                                <tr style={{ borderBottom: '1px solid #f0f0f5' }}><td style={{ padding: '10px 16px', color: '#495057', fontWeight: 500 }}>MONTHLY FEE</td><td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#1a1a2e' }}>{fmt(s.monthlyFee)}</td></tr>
                            </tbody>
                            <tfoot><tr style={{ background: '#f8fafc' }}><td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>TOTAL</td><td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{fmt(s.total)}</td></tr></tfoot>
                        </table>
                        <div style={{ padding: '8px 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {s.classes.map((cls, i) => <span key={i} className="badge badge-draft" style={{ fontSize: '0.72rem' }}>{cls}</span>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}




// ======================== FEE COLLECTION ========================
function FeeCollectionTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [reference, setReference] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    // Fee structure mapping by class
    const feeByClass = {
        'Nursery': { admissionFee: 3000, annualFee: 2000, examFee: 2000, monthlyFee: 1500 },
        'LKG': { admissionFee: 3000, annualFee: 2000, examFee: 2000, monthlyFee: 1500 },
        'UKG': { admissionFee: 3000, annualFee: 2000, examFee: 2000, monthlyFee: 1500 },
        'I': { admissionFee: 4000, annualFee: 3000, examFee: 2000, monthlyFee: 2000 },
        'II': { admissionFee: 4000, annualFee: 3000, examFee: 2000, monthlyFee: 2000 },
        'III': { admissionFee: 4000, annualFee: 3000, examFee: 2000, monthlyFee: 2400 },
        'IV': { admissionFee: 4000, annualFee: 3000, examFee: 2000, monthlyFee: 2400 },
        'V': { admissionFee: 7500, annualFee: 7950, examFee: 3050, monthlyFee: 2700 },
        'VI': { admissionFee: 7500, annualFee: 7950, examFee: 3050, monthlyFee: 2700 },
        'VII': { admissionFee: 7500, annualFee: 7950, examFee: 3050, monthlyFee: 2700 },
        'VIII': { admissionFee: 7500, annualFee: 7950, examFee: 3650, monthlyFee: 3300 },
        'IX': { admissionFee: 8000, annualFee: 9150, examFee: 4250, monthlyFee: 3300 },
        'X': { admissionFee: 8000, annualFee: 9150, examFee: 4250, monthlyFee: 3300 },
        'XI': { admissionFee: 0, annualFee: 8550, examFee: 4000, monthlyFee: 3300 },
        'XII': { admissionFee: 0, annualFee: 8550, examFee: 4000, monthlyFee: 3300 },
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) return customAlert('Please enter a student name or admission number');
        setSearching(true);
        setHasSearched(true);
        setSelectedStudent(null);
        try {
            const allStudents = await api.getStudents();
            const term = searchTerm.toLowerCase();
            const filtered = allStudents.filter(s => 
                `${s.firstName || ''} ${s.lastName || ''} ${s.admissionNo || ''} ${s.id || ''}`.toLowerCase().includes(term)
            );
            setSearchResults(filtered);
        } catch (err) {
            console.error(err);
            await customAlert('Failed to search students. Please check your connection.');
        } finally {
            setSearching(false);
        }
    };

    const selectStudent = (student) => {
        setSelectedStudent(student);
        setSearchResults([]);
    };

    const getFeeComponents = (student) => {
        const cls = student.class || '';
        const fees = feeByClass[cls] || { admissionFee: 0, annualFee: 0, examFee: 0, monthlyFee: 0 };
        const paidFees = Number(student.paidFees) || 0;
        const totalFees = fees.admissionFee + fees.annualFee + fees.examFee + fees.monthlyFee;
        
        // Distribute paid amount across fee components in order
        let remaining = paidFees;
        const components = [];
        
        const addComponent = (name, amount) => {
            const paid = Math.min(remaining, amount);
            remaining -= paid;
            components.push({ name, due: amount, paid, balance: amount - paid });
        };
        
        if (fees.admissionFee > 0) addComponent('Admission Fee', fees.admissionFee);
        addComponent('Annual Fee (Incidental)', fees.annualFee);
        addComponent('Examination Fee (1 Year)', fees.examFee);
        addComponent('Monthly Fee', fees.monthlyFee);
        
        return { components, totalFees, paidFees, totalBalance: totalFees - paidFees };
    };

    const fmt = (v) => '₹ ' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 });
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><IndianRupee size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Student Fee Collection</h3>
            
            <div className="fin-form-panel">
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="form-label">Search Student</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter student name or admission number..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleSearch} disabled={searching} style={{ height: 42, marginBottom: 0 }}>
                        <Search size={16}/> {searching ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="card" style={{ padding: 0, marginTop: 16, border: '1px solid #e9ecef', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e9ecef', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {searchResults.length} student(s) found — click to select
                    </div>
                    {searchResults.map(s => (
                        <div key={s._id || s.id} onClick={() => selectStudent(s)} style={{
                            padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            cursor: 'pointer', borderBottom: '1px solid #f0f0f5', transition: 'background 0.2s'
                        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,167,166,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <div>
                                <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{s.firstName} {s.lastName}</span>
                                <span style={{ marginLeft: 12, fontSize: '0.82rem', color: '#8898aa' }}>Class {s.class} - Section {s.section}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 12, fontSize: '0.82rem', color: '#495057' }}>
                                <span>Adm: <strong>{s.admissionNo}</strong></span>
                                <span>Roll: <strong>{s.rollNo}</strong></span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {hasSearched && searchResults.length === 0 && !selectedStudent && !searching && (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', marginTop: 16 }}>
                    <Search size={40} style={{ opacity: 0.2, marginBottom: 8 }}/> 
                    <p>No students found matching "<strong>{searchTerm}</strong>"</p>
                </div>
            )}

            {/* Fee Ledger for Selected Student */}
            {selectedStudent && (() => {
                const { components, totalFees, paidFees, totalBalance } = getFeeComponents(selectedStudent);
                const status = totalBalance <= 0 ? 'PAID' : paidFees > 0 ? 'PARTIAL DUE' : 'UNPAID';
                const statusColor = totalBalance <= 0 ? 'var(--success)' : 'var(--warning)';
                return (
                    <div className="fin-doc-preview" style={{ marginTop: 16 }}>
                        <div className="fin-doc-header">
                            <div>
                                <div className="fin-doc-title">Fee Receipt / Ledger</div>
                                <div className="fin-doc-meta">
                                    <p><strong>Student:</strong> {selectedStudent.firstName} {selectedStudent.lastName} (Adm: {selectedStudent.admissionNo})</p>
                                    <p><strong>Class:</strong> {selectedStudent.class} - Section {selectedStudent.section}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="fin-doc-meta">
                                    <p><strong>Date:</strong> {today}</p>
                                    <p><strong>Status:</strong> <span style={{ fontWeight: 600, color: statusColor }}>{status}</span></p>
                                </div>
                            </div>
                        </div>
                        <table className="fin-doc-table">
                            <thead><tr><th>Fee Component</th><th>Total Due</th><th>Paid</th><th>Balance</th></tr></thead>
                            <tbody>
                                {components.map((c, i) => (
                                    <tr key={i}>
                                        <td>{c.name}</td>
                                        <td>{fmt(c.due)}</td>
                                        <td style={{ color: c.paid > 0 ? 'var(--success)' : 'inherit' }}>{fmt(c.paid)}</td>
                                        <td style={{ color: c.balance > 0 ? 'var(--warning)' : 'var(--success)', fontWeight: c.balance > 0 ? 600 : 400 }}>{fmt(c.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="fin-doc-total-row">
                                <tr>
                                    <td style={{ textAlign: 'right', fontWeight: 700 }}>TOTAL</td>
                                    <td style={{ fontWeight: 700 }}>{fmt(totalFees)}</td>
                                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>{fmt(paidFees)}</td>
                                    <td style={{ fontWeight: 700, color: totalBalance > 0 ? 'var(--warning)' : 'var(--success)' }}>{fmt(totalBalance)}</td>
                                </tr>
                            </tfoot>
                        </table>

                        {totalBalance > 0 && (
                            <div className="form-row-3" style={{ marginTop: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Payment Mode</label>
                                    <select className="form-select" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                                        <option>Cash</option><option>UPI</option><option>Credit Card</option><option>Cheque</option><option>Demand Draft</option><option>Bank Transfer</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Reference / UTR</label>
                                    <input type="text" className="form-input" placeholder="e.g. UPI Ref..." value={reference} onChange={e => setReference(e.target.value)}/>
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <button className="btn btn-primary" style={{ width: '100%', height: 40 }} onClick={() => customAlert('Payment collection feature coming soon!')}>
                                        <IndianRupee size={16}/> Collect {fmt(totalBalance)}
                                    </button>
                                </div>
                            </div>
                        )}
                        {totalBalance <= 0 && (
                            <div style={{ padding: 20, textAlign: 'center', background: 'rgba(40,167,69,0.06)', borderRadius: 8, marginTop: 16, color: 'var(--success)', fontWeight: 600 }}>
                                <CheckCircle2 size={20} style={{ verticalAlign: 'middle', marginRight: 8 }}/>All fees are fully paid for this student.
                            </div>
                        )}
                    </div>
                );
            })()}
        </div>
    );
}

// ======================== ONLINE PAYMENTS ========================
function OnlinePaymentsTab() {
    const txns = [
        { id: 'pay_Nj3kLp', student: 'Aarav Singh', amount: '₹ 15,000', gateway: 'Razorpay', status: 'Success', date: '2026-03-25 10:45 AM' },
        { id: 'pay_Mk8qRt', student: 'Pooja Verma', amount: '₹ 4,500', gateway: 'PayU', status: 'Pending', date: '2026-03-25 09:12 AM' },
        { id: 'pay_Xf2sWw', student: 'Rohan Das', amount: '₹ 12,000', gateway: 'Stripe', status: 'Failed', date: '2026-03-24 14:30 PM' },
    ];
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Globe size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Online Payment Reconciliation</h3>
                <button className="btn btn-outline"><RotateCcw size={16}/> Sync Webhooks</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Txn ID</th><th>Student</th><th>Amount</th><th>Gateway</th><th>Status</th><th>Timestamp</th><th>Actions</th></tr></thead>
                    <tbody>{txns.map(t => (
                        <tr key={t.id}><td><span style={{ fontFamily: 'monospace', color: 'var(--text-light)' }}>{t.id}</span></td>
                            <td className="fw-600">{t.student}</td><td>{t.amount}</td><td>{t.gateway}</td>
                            <td>{t.status === 'Success' ? <span className="badge badge-success"><CheckCircle2 size={12}/> Success</span> : t.status === 'Failed' ? <span className="badge badge-danger"><XCircle size={12}/> Failed</span> : <span className="badge badge-warning"><Clock size={12}/> Pending</span>}</td>
                            <td>{t.date}</td><td><button className="btn-icon" title="View Details"><Eye size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== DEFAULTERS ========================
function DefaultersTab() {
    const [showFilter, setShowFilter] = useState(false);
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><AlertTriangle size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Fee Defaulter List</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline" onClick={() => { setShowFilter(!showFilter); if (showFilter) setLoaded(false); }}><Search size={16}/> {showFilter ? 'Hide Filter' : 'Filter'}</button>
                    <button className="btn btn-danger"><FileText size={16}/> Generate Notices</button>
                </div>
            </div>
            {showFilter && (
                <div className="fin-form-panel animate-fade-in" style={{ padding: 16 }}>
                    <div className="ado-form form-row-4">
                        <div className="form-group"><label className="form-label">Class</label><select className="form-select"><option>All Classes</option></select></div>
                        <div className="form-group"><label className="form-label">Overdue By</label><select className="form-select"><option>&gt; 30 Days</option><option>&gt; 60 Days</option></select></div>
                        <div className="form-group"><label className="form-label">Min Amount</label><input type="number" className="form-input" defaultValue={1000}/></div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ width: '100%', height: 40 }} onClick={() => setLoaded(true)}><Search size={16}/> Filter</button></div>
                    </div>
                </div>
            )}
            {loaded && (
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th><input type="checkbox"/></th><th>Student Name</th><th>Class</th><th>Overdue Amount</th><th>Days Since Due</th><th>Parent Contact</th></tr></thead>
                        <tbody>
                            <tr><td><input type="checkbox"/></td><td className="fw-600">Vikram Aditya</td><td>10-B</td><td className="danger fw-600">₹ 24,000</td><td><span className="badge badge-danger">45 Days</span></td><td>9988776655</td></tr>
                            <tr><td><input type="checkbox"/></td><td className="fw-600">Neha Sharma</td><td>8-A</td><td className="danger fw-600">₹ 12,000</td><td><span className="badge badge-warning">15 Days</span></td><td>9876543210</td></tr>
                        </tbody></table>
                </div>
            )}
        </div>
    );
}

// ======================== EXPENSES ========================
function ExpensesTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><TrendingDown size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Expense Management</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Add Expense</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Vendor / Payee</th><th>Payment Mode</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        <tr><td>25-03-2026</td><td>Maintenance</td><td className="fw-600">₹ 4,500</td><td>Plumbing Services Ltd</td><td>Bank Transfer</td><td><span className="badge badge-warning">Pending Approval</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View Bill"><Eye size={16}/></button><button className="btn btn-success" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Approve</button></td></tr>
                        <tr><td>20-03-2026</td><td>Supplies</td><td className="fw-600">₹ 15,200</td><td>A1 Stationers</td><td>Cheque</td><td><span className="badge badge-success">Approved</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View Bill"><Eye size={16}/></button></td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== INVOICES ========================
function InvoicesTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Invoice & Billing</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Generate Invoice</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Invoice #</th><th>Billed To</th><th>Type</th><th>Issue Date</th><th>Due Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">INV-2026-001</td><td>Ajay Transport</td><td>Vendor</td><td>2026-03-20</td><td>2026-04-05</td><td>₹ 45,000</td><td><span className="badge badge-warning">Sent</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View PDF"><FileText size={16}/></button></td></tr>
                        <tr><td className="fw-600">INV-2026-002</td><td>Ritika Singh</td><td>Student</td><td>2026-03-22</td><td>2026-03-30</td><td>₹ 2,500</td><td><span className="badge badge-success">Paid</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View PDF"><FileText size={16}/></button></td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== REFUNDS ========================
function RefundsTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><RotateCcw size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Refund Management</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Initiate Refund</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Refund Ref</th><th>Org. Receipt</th><th>Student</th><th>Amount</th><th>Reason</th><th>Mode</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">REF-001</td><td>REC-9082</td><td>Arjun Patel</td><td>₹ 5,000</td><td>Overpayment</td><td>Online Reversal</td><td><span className="badge badge-warning">Processing</span></td></tr>
                        <tr><td className="fw-600">REF-002</td><td>REC-8112</td><td>Meera Joshi</td><td>₹ 45,000</td><td>Withdrawal</td><td>Bank Transfer</td><td><span className="badge badge-success">Completed</span></td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== ACCOUNTING ========================
function AccountingTab() {
    const [showFilter, setShowFilter] = useState(false);
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><BookOpen size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Accounting (Double-Entry)</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline" onClick={() => { setShowFilter(!showFilter); if (showFilter) setLoaded(false); }}><Search size={16}/> {showFilter ? 'Hide Filter' : 'Filter'}</button>
                    <button className="btn btn-outline"><Grid size={16}/> Chart of Accounts</button>
                    <button className="btn btn-primary"><PlusCircle size={16}/> Journal Entry</button>
                </div>
            </div>
            
            {showFilter && (
                <div className="fin-form-panel animate-fade-in" style={{ padding: 16 }}>
                    <div className="ado-form form-row-3">
                        <div className="form-group"><label className="form-label">Select Account to view Ledger</label><select className="form-select"><option>1001 - Cash in Hand</option><option>1002 - HDFC Bank A/c</option><option>4001 - Tuition Fee Income</option></select></div>
                        <div className="form-group"><label className="form-label">Date Range</label><select className="form-select"><option>This Month</option><option>Last Month</option></select></div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ height: 40 }} onClick={() => setLoaded(true)}><Search size={16}/> Load Ledger</button></div>
                    </div>
                </div>
            )}

            {loaded && (
                <div className="table-responsive">
                    <table className="data-table"><thead><tr><th>Date</th><th>Description / Narration</th><th>Voucher / Ref</th><th>Debit (Dr)</th><th>Credit (Cr)</th><th>Balance</th></tr></thead>
                        <tbody>
                            <tr><td>01-03-2026</td><td className="fw-600">Opening Balance</td><td>-</td><td>-</td><td>-</td><td className="fw-600">₹ 4,50,000 (Dr)</td></tr>
                            <tr><td>05-03-2026</td><td>Fee Collection - Receipt #8112</td><td>RCP-8112</td><td className="ledger-debit">₹ 45,000</td><td>-</td><td className="fw-600">₹ 4,95,000 (Dr)</td></tr>
                            <tr><td>10-03-2026</td><td>Office Supplies Invoice #99</td><td>JRN-011</td><td>-</td><td className="ledger-credit">₹ 15,200</td><td className="fw-600">₹ 4,79,800 (Dr)</td></tr>
                        </tbody></table>
                </div>
            )}
        </div>
    );
}

// ======================== ASSETS ========================
function AssetsTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Monitor size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Fixed Asset Management</h3>
                <button className="btn btn-primary"><PlusCircle size={16}/> Register Asset</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Asset ID</th><th>Name</th><th>Category</th><th>Purchase Date</th><th>Purchase Value</th><th>Current Book Value</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">AST-101</td><td>Computer Lab PCs (30)</td><td>Electronics</td><td>2024-05-10</td><td>₹ 15,000,000</td><td>₹ 9,000,000</td><td><span className="badge badge-success">Active</span></td></tr>
                        <tr><td className="fw-600">AST-102</td><td>School Bus - Route 2</td><td>Vehicle</td><td>2022-01-15</td><td>₹ 25,000,000</td><td>₹ 15,000,000</td><td><span className="badge badge-success">Active</span></td></tr>
                        <tr><td className="fw-600">AST-103</td><td>Admin Office Printer</td><td>Electronics</td><td>2025-10-20</td><td>₹ 45,000</td><td>₹ 40,000</td><td><span className="badge badge-warning">Under Repair</span></td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== INVENTORY ========================
function InventoryTab() {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><Package size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Inventory Tracking (Finance Linked)</h3>
                <div style={{ display: 'flex', gap: 10 }}><button className="btn btn-outline"><IndianRupee size={16}/> Record Purchase</button><button className="btn btn-primary"><PlusCircle size={16}/> Add Item</button></div>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Item Code</th><th>Name</th><th>Category</th><th>In Stock</th><th>Reorder Level</th><th>Unit Cost</th><th>GL Linked</th></tr></thead>
                    <tbody>
                        <tr><td className="fw-600">INV-01</td><td>A4 Paper Rim</td><td>Stationery</td><td>120 Rims</td><td>20 Rims</td><td>₹ 250</td><td>5001 - Supplies</td></tr>
                        <tr><td className="fw-600">INV-02</td><td>Whiteboard Markers (Box)</td><td>Stationery</td><td className="danger fw-600">5 Boxes</td><td>10 Boxes</td><td>₹ 450</td><td>5001 - Supplies</td></tr>
                        <tr><td className="fw-600">INV-03</td><td>Chemistry Lab Beakers</td><td>Lab Consumables</td><td>45 Units</td><td>10 Units</td><td>₹ 120</td><td>5003 - Lab Expense</td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== REPORTS ========================
function ReportsTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Download size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Financial Reports</h3>
            <div className="fin-form-panel" style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 24 }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}><label className="form-label">Report Type</label>
                    <select className="form-select"><option>Daily Fee Collection Report</option><option>Outstanding Dues Report (Aging)</option><option>Income vs Expense (P&L)</option><option>Balance Sheet</option><option>Expense Register</option><option>Asset Register & Depreciation</option></select></div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}><label className="form-label">Period</label>
                    <select className="form-select"><option>Financial Year 2025-26</option><option>This Month</option><option>Today</option></select></div>
                <button className="btn btn-primary" style={{ padding: '10px 24px', height: 40 }}><Download size={16}/> Export Report</button>
            </div>
            <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--text-muted)' }}>
                Select a financial report template and click Export to generate PDF/Excel. Accounting period locks explicitly restrict backwards editing to guarantee report integrity.
            </div>
        </div>
    );
}

// ======================== SETTINGS ========================
function SettingsTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><Settings size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Finance Module Settings</h3>
            <div className="fin-form-panel">
                <div className="ado-form">
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Expense Approval Workflow</label><select className="form-select"><option>Enabled - Require Admin Approval</option><option>Disabled - Auto Approve</option></select></div>
                        <div className="form-group"><label className="form-label">Refund Approval Workflow</label><select className="form-select"><option>Enabled - Require Admin Approval</option><option>Disabled - Auto Approve</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Default Currency</label><select className="form-select"><option>INR (₹)</option><option>USD ($)</option></select></div>
                        <div className="form-group"><label className="form-label">Payment Gateway Integration</label><select className="form-select"><option>Razorpay</option><option>PayU</option><option>Stripe</option><option>None</option></select></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Depreciation Method</label><select className="form-select"><option>Straight-Line Method</option><option>Written Down Value</option></select></div>
                        <div className="form-group"><label className="form-label">Invoice Tax Generation</label><select className="form-select"><option>Disabled (0%)</option><option>Enable GST (18%)</option></select></div>
                    </div>
                    <div className="form-actions"><button className="btn btn-primary">Save Finance Configurations</button></div>
                </div>
            </div>
        </div>
    );
}

// ======================== MAIN FINANCE COMPONENT ========================
const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'structure', label: 'Fee Structure', icon: SlidersHorizontal },
    { id: 'collection', label: 'Collection', icon: IndianRupee },
    { id: 'online-payments', label: 'Online Payments', icon: Globe },
    { id: 'defaulters', label: 'Defaulters', icon: AlertTriangle },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'refunds', label: 'Refunds', icon: RotateCcw },
    { id: 'accounting', label: 'Accounting', icon: BookOpen },
    { id: 'assets', label: 'Assets', icon: Monitor },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Reports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Finance() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard');
    const handleNavigate = (tab) => { setActiveTab(tab); setSearchParams({ tab }); };
    useEffect(() => { if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl); }, [tabFromUrl]);

    return (
        <div className="finance-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb">
                    <Link to="/">Dashboard</Link><span className="separator">/</span><span>Finance</span>
                    {activeTab !== 'dashboard' && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{TABS.find(t => t.id === activeTab)?.label}</span></>}
                </div>
                <h1>Finance & Accounting Management</h1>
            </div></div>
            <div className="card finance-card">
                <div className="tabs-header">{TABS.map(tab => { const Icon = tab.icon; return <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>; })}</div>
                <div className="tabs-content">
                    {activeTab === 'dashboard' && <DashboardTab/>}
                    {activeTab === 'structure' && <FeeStructureTab/>}
                    {activeTab === 'collection' && <FeeCollectionTab/>}
                    {activeTab === 'online-payments' && <OnlinePaymentsTab/>}
                    {activeTab === 'defaulters' && <DefaultersTab/>}
                    {activeTab === 'expenses' && <ExpensesTab/>}
                    {activeTab === 'invoices' && <InvoicesTab/>}
                    {activeTab === 'refunds' && <RefundsTab/>}
                    {activeTab === 'accounting' && <AccountingTab/>}
                    {activeTab === 'assets' && <AssetsTab/>}
                    {activeTab === 'inventory' && <InventoryTab/>}
                    {activeTab === 'reports' && <ReportsTab/>}
                    {activeTab === 'settings' && <SettingsTab/>}
                </div>
            </div>
        </div>
    );
}
