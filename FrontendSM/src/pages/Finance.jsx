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
    const defaultStructures = [
        { _id: '1', name: 'Annual Fee', amount: 10000, frequency: 'One-time', classes: 'All Classes' },
        { _id: '2', name: 'Grade 10 - Annual Package', amount: 85000, frequency: 'Installments (4)', classes: '10-A, 10-B' },
        { _id: '3', name: 'Grade 1 to 5 - Tuition Fee', amount: 45000, frequency: 'Installments (4)', classes: '1 to 5 all' },
        { _id: '4', name: 'Transport - Route A', amount: 12000, frequency: 'Monthly (₹ 1,000)', classes: 'All Routes' },
    ];
    
    const [structures, setStructures] = useState(defaultStructures);
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', amount: '', frequency: 'One-time', classes: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.getFeeCategories().then(data => {
            if (data && data.length > 0) setStructures(data);
        }).catch(() => {});
    }, []);

    const handleSave = async () => {
        if (!newCategory.name || !newCategory.amount || !newCategory.classes) {
            return customAlert('Please fill all required fields: Name, Amount, Classes');
        }
        setSaving(true);
        try {
            const added = await api.createFeeCategory(newCategory);
            setStructures([added, ...structures]);
            setIsAdding(false);
            setNewCategory({ name: '', amount: '', frequency: 'One-time', classes: '' });
            await customAlert('Fee Category successfully added!');
        } catch (err) {
            await customAlert('Failed to create fee category. It might already exist.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><SlidersHorizontal size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Fee Structure & Categories</h3>
                {!isAdding && <button className="btn btn-primary" onClick={() => setIsAdding(true)}><PlusCircle size={16}/> New Fee Category</button>}
            </div>
            
            {isAdding && (
                <div className="card animate-slide-up" style={{ padding: 20, marginBottom: 24, border: '1px solid var(--border)' }}>
                    <h4 style={{ marginBottom: 16 }}>Add New Fee Category</h4>
                    <div className="form-row two-cols">
                        <div className="form-group">
                            <label className="form-label">Category Name <span className="required">*</span></label>
                            <input type="text" className="form-input" placeholder="e.g. Activity Fee" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Amount (₹) <span className="required">*</span></label>
                            <input type="number" className="form-input" placeholder="e.g. 5000" value={newCategory.amount} onChange={e => setNewCategory({...newCategory, amount: e.target.value})} />
                        </div>
                    </div>
                    <div className="form-row two-cols">
                        <div className="form-group">
                            <label className="form-label">Frequency</label>
                            <select className="form-select" value={newCategory.frequency} onChange={e => setNewCategory({...newCategory, frequency: e.target.value})}>
                                <option value="One-time">One-time</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Annually">Annually</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Assigned Classes <span className="required">*</span></label>
                            <select className="form-select" value={newCategory.classes} onChange={e => setNewCategory({...newCategory, classes: e.target.value})}>
                                <option value="" disabled>Select Class</option>
                                <option value="All Classes">All Classes</option>
                                {['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(c => <option key={c} value={c}>Class {c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                        <button className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Category'}</button>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Category Name</th><th>Total Amount</th><th>Frequency</th><th>Assigned Classes</th><th>Actions</th></tr></thead>
                    <tbody>{structures.map(s => (
                        <tr key={s._id || s.id}><td className="fw-600">{s.name}</td><td>₹ {s.amount}</td><td>{s.frequency}</td><td><span className="badge badge-draft">{s.classes}</span></td>
                        <td style={{ display: 'flex', gap: 4 }}><button className="btn-icon"><Settings size={16}/></button><button className="btn-icon"><Calculator size={16}/></button></td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== FEE COLLECTION ========================
function FeeCollectionTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><IndianRupee size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Student Fee Collection</h3>
            
            <div className="fin-form-panel">
                <div className="ado-form form-row-3">
                    <div className="form-group"><label className="form-label">Search Student</label><div style={{ display: 'flex', gap: 8 }}><input type="text" className="form-input" placeholder="Name or Admission No."/><button className="btn btn-primary"><Search size={16}/></button></div></div>
                    <div className="form-group"><label className="form-label">Class</label><select className="form-select"><option>Grade 10</option></select></div>
                    <div className="form-group"><label className="form-label">Section</label><select className="form-select"><option>10-A</option></select></div>
                </div>
            </div>

            <div className="fin-doc-preview">
                <div className="fin-doc-header">
                    <div>
                        <div className="fin-doc-title">Fee Receipt / Ledger</div>
                        <div className="fin-doc-meta"><p><strong>Student:</strong> Rahul Kumar (Adm: 2026/014)</p><p><strong>Class:</strong> 10-A</p></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="fin-doc-meta"><p><strong>Date:</strong> 25-03-2026</p><p><strong>Status:</strong> <span className="warning" style={{ fontWeight: 600 }}>PARTIAL DUE</span></p></div>
                    </div>
                </div>
                <table className="fin-doc-table">
                    <thead><tr><th>Fee Component</th><th>Total Due</th><th>Paid</th><th>Balance</th><th>Pay Now</th></tr></thead>
                    <tbody>
                        <tr><td>Q1 Tuition Fee</td><td>₹ 15,000</td><td>₹ 15,000</td><td>₹ 0</td><td><input type="number" className="form-input" style={{ width: 100 }} disabled/></td></tr>
                        <tr><td>Q2 Tuition Fee</td><td>₹ 15,000</td><td>₹ 0</td><td className="warning">₹ 15,000</td><td><input type="number" className="form-input" style={{ width: 100 }} defaultValue={15000}/></td></tr>
                        <tr><td>Computer Lab Fee</td><td>₹ 2,000</td><td>₹ 0</td><td className="warning">₹ 2,000</td><td><input type="number" className="form-input" style={{ width: 100 }} defaultValue={2000}/></td></tr>
                    </tbody>
                    <tfoot className="fin-doc-total-row"><tr><td colSpan="3" style={{ textAlign: 'right' }}>Total Paying:</td><td colSpan="2" className="success">₹ 17,000</td></tr></tfoot>
                </table>

                <div className="form-row-3" style={{ marginTop: 20 }}>
                    <div className="form-group"><label className="form-label">Payment Mode</label><select className="form-select"><option>Cash</option><option>UPI</option><option>Credit Card</option><option>Cheque</option><option>Demand Draft</option></select></div>
                    <div className="form-group"><label className="form-label">Reference / UTR Link</label><input type="text" className="form-input" placeholder="e.g. UPI Ref..."/></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ width: '100%', height: 40 }}><IndianRupee size={16}/> Collect Payment</button></div>
                </div>
            </div>
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
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><AlertTriangle size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Fee Defaulter List</h3>
                <button className="btn btn-danger"><FileText size={16}/> Generate Notices</button>
            </div>
            <div className="fin-form-panel" style={{ padding: 16 }}>
                <div className="ado-form form-row-4">
                    <div className="form-group"><label className="form-label">Class</label><select className="form-select"><option>All Classes</option></select></div>
                    <div className="form-group"><label className="form-label">Overdue By</label><select className="form-select"><option>&gt; 30 Days</option><option>&gt; 60 Days</option></select></div>
                    <div className="form-group"><label className="form-label">Min Amount</label><input type="number" className="form-input" defaultValue={1000}/></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ width: '100%', height: 40 }}><Search size={16}/> Filter</button></div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th><input type="checkbox"/></th><th>Student Name</th><th>Class</th><th>Overdue Amount</th><th>Days Since Due</th><th>Parent Contact</th></tr></thead>
                    <tbody>
                        <tr><td><input type="checkbox"/></td><td className="fw-600">Vikram Aditya</td><td>10-B</td><td className="danger fw-600">₹ 24,000</td><td><span className="badge badge-danger">45 Days</span></td><td>9988776655</td></tr>
                        <tr><td><input type="checkbox"/></td><td className="fw-600">Neha Sharma</td><td>8-A</td><td className="danger fw-600">₹ 12,000</td><td><span className="badge badge-warning">15 Days</span></td><td>9876543210</td></tr>
                    </tbody></table>
            </div>
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
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><BookOpen size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Accounting (Double-Entry)</h3>
                <div style={{ display: 'flex', gap: 10 }}><button className="btn btn-outline"><Grid size={16}/> Chart of Accounts</button><button className="btn btn-primary"><PlusCircle size={16}/> Journal Entry</button></div>
            </div>
            
            <div className="fin-form-panel" style={{ padding: 16 }}>
                <div className="ado-form form-row-3">
                    <div className="form-group"><label className="form-label">Select Account to view Ledger</label><select className="form-select"><option>1001 - Cash in Hand</option><option>1002 - HDFC Bank A/c</option><option>4001 - Tuition Fee Income</option></select></div>
                    <div className="form-group"><label className="form-label">Date Range</label><select className="form-select"><option>This Month</option><option>Last Month</option></select></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ height: 40 }}><Search size={16}/> Load Ledger</button></div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Date</th><th>Description / Narration</th><th>Voucher / Ref</th><th>Debit (Dr)</th><th>Credit (Cr)</th><th>Balance</th></tr></thead>
                    <tbody>
                        <tr><td>01-03-2026</td><td className="fw-600">Opening Balance</td><td>-</td><td>-</td><td>-</td><td className="fw-600">₹ 4,50,000 (Dr)</td></tr>
                        <tr><td>05-03-2026</td><td>Fee Collection - Receipt #8112</td><td>RCP-8112</td><td className="ledger-debit">₹ 45,000</td><td>-</td><td className="fw-600">₹ 4,95,000 (Dr)</td></tr>
                        <tr><td>10-03-2026</td><td>Office Supplies Invoice #99</td><td>JRN-011</td><td>-</td><td className="ledger-credit">₹ 15,200</td><td className="fw-600">₹ 4,79,800 (Dr)</td></tr>
                    </tbody></table>
            </div>
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
