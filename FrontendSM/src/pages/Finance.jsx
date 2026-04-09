import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link, useSearchParams } from 'react-router-dom';
import {
    BarChart3, IndianRupee, SlidersHorizontal, AlertTriangle, FileText,
    TrendingDown, RotateCcw, BookOpen, Monitor, Package,
    Download, Settings, Globe, PlusCircle, Search, CreditCard,
    CheckCircle2, XCircle, Clock, Eye, Printer, UploadCloud,
    TrendingUp, Calculator, Grid
} from 'lucide-react';
import { customAlert, customConfirm } from '../utils/dialogs';
import { api } from '../utils/api';
import './Finance.css';

// ======================== DASHBOARD ========================
function DashboardTab({ onGenerateInvoice }) {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><BarChart3 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Finance Overview</h3>
            
            <div className="fin-quick-actions">
                <button className="fin-quick-btn"><IndianRupee size={16} color="var(--primary)"/> Collect Fee</button>
                <button className="fin-quick-btn"><TrendingDown size={16} color="var(--danger)"/> Record Expense</button>
                <button className="fin-quick-btn" onClick={onGenerateInvoice}><FileText size={16} color="var(--info)"/> Generate Invoice</button>
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
function FeeStructureTab({ structures, setStructures }) {
    const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const DEFAULT_FEE_TYPES = ['Admission Fee', 'Annual Fee', 'Examination Fee', 'Monthly Fee'];
    
    const [isAdding, setIsAdding] = useState(false);
    const [classDropdownOpen, setClassDropdownOpen] = useState(false);
    const [editClassDropdownOpen, setEditClassDropdownOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [newCustomFeeName, setNewCustomFeeName] = useState('');
    const [editCustomFeeName, setEditCustomFeeName] = useState('');
    
    const emptyForm = { classGroup: '', classes: [], fees: DEFAULT_FEE_TYPES.map(name => ({ name, amount: '' })) };
    const [newEntry, setNewEntry] = useState({...emptyForm, fees: emptyForm.fees.map(f => ({...f}))});
    
    const calcTotal = (fees) => fees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    const fmt = (v) => (!v && v !== 0) ? '—' : '₹ ' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 });
    
    const toggleClass = (cls, setter, getter) => {
        if (cls === 'All Classes') {
            setter(prev => prev.classes.includes('All Classes') ? {...prev, classes: [], classGroup: ''} : {...prev, classes: ['All Classes'], classGroup: 'All Classes'});
            return;
        }
        setter(prev => {
            const filtered = prev.classes.filter(c => c !== 'All Classes');
            const updated = filtered.includes(cls) ? filtered.filter(c => c !== cls) : [...filtered, cls];
            return {...prev, classes: updated, classGroup: updated.join(', ')};
        });
    };
    
    // --- Update fee amount in add form ---
    const updateNewFee = (index, amount) => {
        setNewEntry(prev => {
            const fees = [...prev.fees];
            fees[index] = { ...fees[index], amount };
            return { ...prev, fees };
        });
    };
    
    // --- Add custom fee type to add form ---
    const addCustomFeeToNew = () => {
        const name = newCustomFeeName.trim();
        if (!name) return customAlert('Please enter a fee name');
        if (newEntry.fees.some(f => f.name.toLowerCase() === name.toLowerCase())) return customAlert('This fee type already exists');
        setNewEntry(prev => ({ ...prev, fees: [...prev.fees, { name, amount: '' }] }));
        setNewCustomFeeName('');
    };
    
    // --- Remove fee type from add form ---
    const removeNewFee = (index) => {
        setNewEntry(prev => ({ ...prev, fees: prev.fees.filter((_, i) => i !== index) }));
    };
    
    // --- Save new entry ---
    const handleSave = async () => {
        if (newEntry.classes.length === 0) return customAlert('Please select at least one class');
        if (newEntry.fees.length === 0) return customAlert('Please add at least one fee type');
        if (!newEntry.fees.some(f => Number(f.amount) > 0)) return customAlert('Please enter at least one fee amount');
        setSaving(true);
        try {
            const entry = {
                _id: 'fs-' + Date.now(),
                classGroup: newEntry.classGroup,
                classes: [...newEntry.classes],
                fees: newEntry.fees.map(f => ({ name: f.name, amount: Number(f.amount) || 0 })),
                total: calcTotal(newEntry.fees)
            };
            setStructures([entry, ...structures]);
            setIsAdding(false); setClassDropdownOpen(false);
            setNewEntry({...emptyForm, fees: emptyForm.fees.map(f => ({...f}))});
            setNewCustomFeeName('');
            await customAlert('Fee structure added successfully!');
        } catch (err) { await customAlert(err.message || 'Failed to save.'); } finally { setSaving(false); }
    };
    
    // --- Start editing ---
    const startEdit = (s) => {
        setEditingId(s._id);
        setEditData({
            classGroup: s.classGroup,
            classes: [...s.classes],
            fees: s.fees.map(f => ({ ...f }))
        });
        setEditCustomFeeName('');
        setEditClassDropdownOpen(false);
    };
    
    // --- Cancel editing ---
    const cancelEdit = () => {
        setEditingId(null);
        setEditData(null);
        setEditClassDropdownOpen(false);
    };
    
    // --- Update fee in edit form ---
    const updateEditFee = (index, amount) => {
        setEditData(prev => {
            const fees = [...prev.fees];
            fees[index] = { ...fees[index], amount };
            return { ...prev, fees };
        });
    };
    
    // --- Add custom fee type to edit form ---
    const addCustomFeeToEdit = () => {
        const name = editCustomFeeName.trim();
        if (!name) return customAlert('Please enter a fee name');
        if (editData.fees.some(f => f.name.toLowerCase() === name.toLowerCase())) return customAlert('This fee type already exists');
        setEditData(prev => ({ ...prev, fees: [...prev.fees, { name, amount: '' }] }));
        setEditCustomFeeName('');
    };
    
    // --- Remove fee type from edit form ---
    const removeEditFee = (index) => {
        setEditData(prev => ({ ...prev, fees: prev.fees.filter((_, i) => i !== index) }));
    };
    
    // --- Save edit ---
    const saveEdit = async () => {
        if (editData.classes.length === 0) return customAlert('Please select at least one class');
        if (editData.fees.length === 0) return customAlert('Please add at least one fee type');
        if (!editData.fees.some(f => Number(f.amount) > 0)) return customAlert('Please enter at least one fee amount');
        const updated = structures.map(s => {
            if (s._id !== editingId) return s;
            return {
                ...s,
                classGroup: editData.classGroup,
                classes: [...editData.classes],
                fees: editData.fees.map(f => ({ name: f.name, amount: Number(f.amount) || 0 })),
                total: calcTotal(editData.fees)
            };
        });
        setStructures(updated);
        setEditingId(null);
        setEditData(null);
        setEditClassDropdownOpen(false);
        await customAlert('Fee structure updated successfully!');
    };
    
    // --- Delete structure ---
    const handleDelete = async (id) => {
        const ok = await customConfirm('Are you sure you want to delete this fee structure?');
        if (ok) {
            setStructures(structures.filter(s => s._id !== id));
            await customAlert('Fee structure deleted.');
        }
    };
    
    // --- Class multi-select dropdown component ---
    const ClassSelector = ({ data, setData, isOpen, setIsOpen }) => (
        <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Assigned Classes <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
                <div className="form-input" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, minHeight: 44, padding: '6px 12px' }} onClick={() => setIsOpen(!isOpen)}>
                    {data.classes.length === 0 ? <span style={{ color: '#8898aa', fontSize: '0.88rem' }}>Select classes...</span> : data.classes.map(cls => (
                        <span key={cls} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--accent)', color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>
                            {cls}<span style={{ cursor: 'pointer', marginLeft: 2, fontWeight: 'bold' }} onClick={(e) => { e.stopPropagation(); toggleClass(cls, setData); }}>×</span>
                        </span>
                    ))}
                </div>
                {isOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: 260, overflowY: 'auto', marginTop: 4, padding: '8px 0' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', borderBottom: '1px solid #f0f0f5', background: data.classes.includes('All Classes') ? 'rgba(28,167,166,0.08)' : 'transparent' }}>
                            <input type="checkbox" checked={data.classes.includes('All Classes')} onChange={() => toggleClass('All Classes', setData)} style={{ accentColor: 'var(--accent)' }}/>All Classes
                        </label>
                        {ALL_CLASSES.map(cls => (
                            <label key={cls} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', cursor: 'pointer', fontSize: '0.88rem', background: data.classes.includes(cls) ? 'rgba(28,167,166,0.06)' : 'transparent' }}>
                                <input type="checkbox" checked={data.classes.includes('All Classes') || data.classes.includes(cls)} disabled={data.classes.includes('All Classes')} onChange={() => toggleClass(cls, setData)} style={{ accentColor: 'var(--accent)' }}/>Class {cls}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h3 style={{ color: 'var(--primary)', margin: 0 }}><SlidersHorizontal size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Fee Structure 2026-27</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Mount Zion School, Sion Nagar, Purnea</p>
                </div>
                {!isAdding && <button className="btn btn-primary" onClick={() => setIsAdding(true)}><PlusCircle size={16}/> Add Fee Structure</button>}
            </div>
            
            {/* ===== ADD NEW FORM ===== */}
            {isAdding && (
                <div className="card animate-slide-up" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--accent)', borderRadius: 12 }}>
                    <h4 style={{ marginBottom: 20, color: 'var(--primary)' }}>Add New Fee Structure</h4>
                    <ClassSelector data={newEntry} setData={setNewEntry} isOpen={classDropdownOpen} setIsOpen={setClassDropdownOpen} />
                    
                    {/* Dynamic fee rows */}
                    <div style={{ marginBottom: 16 }}>
                        <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Fee Components</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                            {newEntry.fees.map((fee, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', borderRadius: 8, padding: '8px 12px', border: '1px solid #e9ecef' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#8898aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fee.name}</div>
                                        <input type="number" className="form-input" style={{ padding: '6px 10px', fontSize: '0.88rem' }} placeholder="0.00" value={fee.amount} onChange={e => updateNewFee(i, e.target.value)} />
                                    </div>
                                    {!DEFAULT_FEE_TYPES.includes(fee.name) && (
                                        <button type="button" onClick={() => removeNewFee(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4, marginTop: 16 }} title="Remove this fee type">
                                            <XCircle size={16}/>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Add custom fee type */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 20, padding: '12px 16px', background: 'rgba(28,167,166,0.04)', border: '1px dashed var(--accent)', borderRadius: 8 }}>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Add Custom Fee Type</label>
                            <input type="text" className="form-input" placeholder="e.g. Tuition Fee, Special Class Fee, Lab Fee..." value={newCustomFeeName} onChange={e => setNewCustomFeeName(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomFeeToNew())} />
                        </div>
                        <button type="button" className="btn btn-outline" style={{ height: 42, whiteSpace: 'nowrap' }} onClick={addCustomFeeToNew}>
                            <PlusCircle size={14}/> Add Fee
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>Total: {fmt(calcTotal(newEntry.fees))}</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-outline" onClick={() => { setIsAdding(false); setClassDropdownOpen(false); setNewEntry({...emptyForm, fees: emptyForm.fees.map(f => ({...f}))}); setNewCustomFeeName(''); }}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Fee Structure'}</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ===== FEE STRUCTURE CARDS ===== */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
                {structures.map(s => {
                    const isEditing = editingId === s._id;
                    
                    if (isEditing && editData) {
                        // ===== EDIT MODE =====
                        return (
                            <div key={s._id} className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden', border: '2px solid var(--accent)', borderRadius: 12, boxShadow: '0 4px 16px rgba(28,167,166,0.15)' }}>
                                <div style={{ background: 'var(--accent)', color: '#fff', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                                    <span>✏️ Editing Fee Structure</span>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button onClick={saveEdit} style={{ background: '#fff', color: 'var(--accent)', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <CheckCircle2 size={14}/> Save
                                        </button>
                                        <button onClick={cancelEdit} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <XCircle size={14}/> Cancel
                                        </button>
                                    </div>
                                </div>
                                <div style={{ padding: 16 }}>
                                    <ClassSelector data={editData} setData={setEditData} isOpen={editClassDropdownOpen} setIsOpen={setEditClassDropdownOpen} />
                                    
                                    {editData.fees.map((fee, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e9ecef' }}>
                                            <div style={{ flex: 1, fontSize: '0.82rem', fontWeight: 600, color: '#495057', textTransform: 'uppercase' }}>{fee.name}</div>
                                            <input type="number" className="form-input" style={{ width: 130, padding: '6px 10px', fontSize: '0.88rem', textAlign: 'right' }} value={fee.amount} onChange={e => updateEditFee(i, e.target.value)} placeholder="0.00" />
                                            <button type="button" onClick={() => removeEditFee(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4 }} title="Remove fee">
                                                <XCircle size={16}/>
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {/* Add custom fee type in edit mode */}
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                                        <input type="text" className="form-input" style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem' }} placeholder="Add new fee type (e.g. Tuition Fee)..." value={editCustomFeeName} onChange={e => setEditCustomFeeName(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomFeeToEdit())} />
                                        <button type="button" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }} onClick={addCustomFeeToEdit}>
                                            <PlusCircle size={14}/> Add
                                        </button>
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(28,167,166,0.06)', borderRadius: 8, marginTop: 8 }}>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>TOTAL</span>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>{fmt(calcTotal(editData.fees))}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    
                    // ===== VIEW MODE =====
                    return (
                        <div key={s._id} className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e9ecef', borderRadius: 12 }}>
                            <div style={{ background: 'var(--primary)', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: 0.5 }}>{s.classGroup}</span>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button onClick={() => startEdit(s)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600 }} title="Edit">
                                        <Eye size={13}/> Edit
                                    </button>
                                    <button onClick={() => handleDelete(s._id)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#ffcccc', display: 'flex', alignItems: 'center' }} title="Delete">
                                        <XCircle size={14}/>
                                    </button>
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <tbody>
                                    {s.fees && s.fees.map((fee, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f0f0f5' }}>
                                            <td style={{ padding: '10px 16px', color: '#495057', fontWeight: 500 }}>{fee.name.toUpperCase()}</td>
                                            <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#1a1a2e' }}>{fmt(fee.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot><tr style={{ background: '#f8fafc' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>TOTAL</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{fmt(s.total)}</td>
                                </tr></tfoot>
                            </table>
                            <div style={{ padding: '8px 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {s.classes.map((cls, i) => <span key={i} className="badge badge-draft" style={{ fontSize: '0.72rem' }}>{cls}</span>)}
                            </div>
                        </div>
                    );
                })}
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
                            <td>{t.date}</td><td><button className="btn-icon" title="View Details" onClick={() => customAlert(`Transaction Details\n\nTxn ID: ${t.id}\nStudent: ${t.student}\nAmount: ${t.amount}\nGateway: ${t.gateway}\nStatus: ${t.status}\nDate: ${t.date}`)}><Eye size={16}/></button></td></tr>
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
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View Bill" onClick={() => customAlert('Expense Bill\n\nDate: 25-03-2026\nCategory: Maintenance\nAmount: ₹ 4,500\nVendor: Plumbing Services Ltd\nPayment: Bank Transfer\nStatus: Pending Approval')}><Eye size={16}/></button><button className="btn btn-success" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => customAlert('Expense approved successfully!')}>Approve</button></td></tr>
                        <tr><td>20-03-2026</td><td>Supplies</td><td className="fw-600">₹ 15,200</td><td>A1 Stationers</td><td>Cheque</td><td><span className="badge badge-success">Approved</span></td>
                            <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon" title="View Bill" onClick={() => customAlert('Expense Bill\n\nDate: 20-03-2026\nCategory: Supplies\nAmount: ₹ 15,200\nVendor: A1 Stationers\nPayment: Cheque\nStatus: Approved')}><Eye size={16}/></button></td></tr>
                    </tbody></table>
            </div>
        </div>
    );
}

// ======================== INVOICES ========================
function InvoicesTab({ invoices, onGenerateInvoice, onDeleteInvoice }) {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Invoice & Billing</h3>
                <button className="btn btn-primary" onClick={onGenerateInvoice}><PlusCircle size={16}/> Generate Invoice</button>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Invoice #</th><th>Billed To</th><th>Type</th><th>Issue Date</th><th>Due Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {invoices.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No invoices found. Generate one to get started.</td></tr>
                        ) : invoices.map(inv => (
                            <tr key={inv.id}>
                                <td className="fw-600">{inv.invoiceNo}</td>
                                <td>{inv.billedTo}</td>
                                <td>{inv.type}</td>
                                <td>{inv.issueDate}</td>
                                <td>{inv.dueDate}</td>
                                <td>₹ {Number(inv.amount).toLocaleString('en-IN')}</td>
                                <td><span className={`badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{inv.status}</span></td>
                                <td style={{ display: 'flex', gap: 4 }}>
                                    <button className="btn-icon" title="Download Invoice" onClick={() => { 
                                        const txt = `MOUNT ZION SCHOOL\nINVOICE\n${'='.repeat(40)}\nInvoice #: ${inv.invoiceNo}\nBilled To: ${inv.billedTo}\nType: ${inv.type}\nIssue Date: ${inv.issueDate}\nDue Date: ${inv.dueDate}\nAmount: ₹ ${inv.amount}\nStatus: ${inv.status}`; 
                                        const blob = new Blob([txt],{type:'text/plain'}); 
                                        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${inv.invoiceNo}.txt`; a.click(); 
                                    }}><FileText size={16}/></button>
                                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => onDeleteInvoice(inv.id)}><XCircle size={16}/></button>
                                </td>
                            </tr>
                        ))}
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

// ======================== MODAL ========================
function InvoiceModal({ onClose, onSave, count }) {
    const [formData, setFormData] = useState({
        billedTo: '',
        type: 'Student',
        amount: '',
        dueDate: '',
        status: 'Sent'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.billedTo || !formData.amount || !formData.dueDate) {
            return customAlert('Please fill all required fields.', 'Error', 'error');
        }
        
        const invoiceNo = `INV-2026-${String(count + 1).padStart(3, '0')}`;
        onSave({
            ...formData,
            id: Date.now(),
            invoiceNo,
            issueDate: new Date().toISOString().split('T')[0]
        });
        onClose();
    };

    return (
        <div className="global-dialog-overlay animate-fade-in" style={{ zIndex: 9999 }}>
            <div className="global-dialog-modal animate-slide-up" style={{ maxWidth: 500, padding: 32 }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: 24 }}>Generate New Invoice</h3>
                <form onSubmit={handleSubmit} className="ado-form">
                    <div className="form-group">
                        <label className="form-label">Billed To <span className="required">*</span></label>
                        <input type="text" className="form-input" placeholder="Name of Student or Vendor" value={formData.billedTo} onChange={e => setFormData({...formData, billedTo: e.target.value})} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select className="form-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option>Student</option>
                                <option>Vendor</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Amount (₹) <span className="required">*</span></label>
                            <input type="number" className="form-input" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Due Date <span className="required">*</span></label>
                            <input type="date" className="form-input" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option>Sent</option>
                                <option>Paid</option>
                                <option>Draft</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Generate & Save</button>
                    </div>
                </form>
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
    const [invoices, setInvoices] = useLocalStorage('finance_invoices', [
        { id: 1, invoiceNo: 'INV-2026-001', billedTo: 'Ajay Transport', type: 'Vendor', issueDate: '2026-03-20', dueDate: '2026-04-05', amount: 45000, status: 'Sent' },
        { id: 2, invoiceNo: 'INV-2026-002', billedTo: 'Ritika Singh', type: 'Student', issueDate: '2026-03-22', dueDate: '2026-03-30', amount: 2500, status: 'Paid' },
    ]);
    const [feeStructures, setFeeStructures] = useLocalStorage('finance_fee_structures', [
        { _id: '1', classGroup: 'Nursery, LKG & UKG', classes: ['Nursery', 'LKG', 'UKG'], fees: [{ name: 'Admission Fee', amount: 0 }, { name: 'Annual Fee', amount: 2000 }, { name: 'Examination Fee', amount: 2000 }, { name: 'Monthly Fee', amount: 1500 }], total: 5500 },
        { _id: '2', classGroup: 'STD. 1 to 2', classes: ['I', 'II'], fees: [{ name: 'Admission Fee', amount: 0 }, { name: 'Annual Fee', amount: 3000 }, { name: 'Examination Fee', amount: 2000 }, { name: 'Monthly Fee', amount: 2000 }], total: 7000 },
        { _id: '3', classGroup: 'STD. 3 to 4', classes: ['III', 'IV'], fees: [{ name: 'Admission Fee', amount: 0 }, { name: 'Annual Fee', amount: 3000 }, { name: 'Examination Fee', amount: 2000 }, { name: 'Monthly Fee', amount: 2400 }], total: 7400 },
        { _id: '4', classGroup: 'STD. 5 to 7', classes: ['V', 'VI', 'VII'], fees: [{ name: 'Admission Fee', amount: 7500 }, { name: 'Annual Fee', amount: 7950 }, { name: 'Examination Fee', amount: 3050 }, { name: 'Monthly Fee', amount: 2700 }], total: 21200 },
        { _id: '5', classGroup: 'STD. 8', classes: ['VIII'], fees: [{ name: 'Admission Fee', amount: 7500 }, { name: 'Annual Fee', amount: 7950 }, { name: 'Examination Fee', amount: 3650 }, { name: 'Monthly Fee', amount: 3300 }], total: 22400 },
        { _id: '6', classGroup: 'STD. 9', classes: ['IX'], fees: [{ name: 'Admission Fee', amount: 8000 }, { name: 'Annual Fee', amount: 9150 }, { name: 'Examination Fee', amount: 4250 }, { name: 'Monthly Fee', amount: 3300 }], total: 24700 },
        { _id: '7', classGroup: 'STD. 11', classes: ['XI'], fees: [{ name: 'Admission Fee', amount: 0 }, { name: 'Annual Fee', amount: 8550 }, { name: 'Examination Fee', amount: 4000 }, { name: 'Monthly Fee', amount: 3300 }], total: 15850 },
    ]);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    const handleNavigate = (tab) => { setActiveTab(tab); setSearchParams({ tab }); };
    
    useEffect(() => { 
        if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl); 
    }, [tabFromUrl]);

    const handleGenerateInvoice = () => {
        setIsInvoiceModalOpen(true);
    };

    const handleSaveInvoice = (newInv) => {
        setInvoices([newInv, ...invoices]);
        handleNavigate('invoices');
    };

    const handleDeleteInvoice = async (id) => {
        const confirmed = await window.confirm('Are you sure you want to delete this invoice?');
        if (confirmed) {
            setInvoices(invoices.filter(inv => inv.id !== id));
        }
    };

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
                    {activeTab === 'dashboard' && <DashboardTab onGenerateInvoice={handleGenerateInvoice}/>}
                    {activeTab === 'structure' && <FeeStructureTab structures={feeStructures} setStructures={setFeeStructures}/>}
                    {activeTab === 'collection' && <FeeCollectionTab/>}
                    {activeTab === 'online-payments' && <OnlinePaymentsTab/>}
                    {activeTab === 'defaulters' && <DefaultersTab/>}
                    {activeTab === 'expenses' && <ExpensesTab/>}
                    {activeTab === 'invoices' && <InvoicesTab invoices={invoices} onGenerateInvoice={handleGenerateInvoice} onDeleteInvoice={handleDeleteInvoice}/>}
                    {activeTab === 'refunds' && <RefundsTab/>}
                    {activeTab === 'accounting' && <AccountingTab/>}
                    {activeTab === 'assets' && <AssetsTab/>}
                    {activeTab === 'inventory' && <InventoryTab/>}
                    {activeTab === 'reports' && <ReportsTab/>}
                    {activeTab === 'settings' && <SettingsTab/>}
                </div>
            </div>

            {isInvoiceModalOpen && (
                <InvoiceModal 
                    count={invoices.length} 
                    onClose={() => setIsInvoiceModalOpen(false)} 
                    onSave={handleSaveInvoice} 
                />
            )}
        </div>
    );
}
