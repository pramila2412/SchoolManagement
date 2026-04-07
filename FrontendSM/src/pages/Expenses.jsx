import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Paperclip, IndianRupee, FileText, Trash2, Eye } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { customAlert, customConfirm } from '../utils/dialogs';
import './Expenses.css';

export default function Expenses() {
    const [activeTab, setActiveTab] = useState('add');
    const [expenses, setExpenses] = useLocalStorage('expenses_list', [
        { id: 1, expenseHead: 'Electricity', name: 'Electricity Board', invoiceNo: 'INV-1029', date: '2026-03-18', amount: '12500.00', description: 'March 2026 Bill' }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        expenseHead: '',
        name: '',
        invoiceNo: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: ''
    });

    const triggerUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                customAlert(`File "${file.name}" attached successfully!`);
                setFormData(prev => ({ ...prev, attachment: file.name }));
            }
        };
        input.click();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const newExpense = {
            ...formData,
            id: Date.now()
        };
        setExpenses(prev => [newExpense, ...prev]);
        setFormData({
            expenseHead: '',
            name: '',
            invoiceNo: '',
            date: new Date().toISOString().split('T')[0],
            amount: '',
            description: ''
        });
        await customAlert('Expense saved successfully!');
        setActiveTab('search');
    };

    const handleDelete = async (id) => {
        if (await customConfirm("Are you sure you want to delete this expense record?")) {
            setExpenses(prev => prev.filter(exp => exp.id !== id));
            await customAlert('Expense deleted successfully!');
        }
    };

    const handleView = (exp) => {
        customAlert(`
            Expense Details
            ----------------
            Name: ${exp.name}
            Head: ${exp.expenseHead}
            Invoice: ${exp.invoiceNo}
            Date: ${exp.date}
            Amount: ₹${Number(exp.amount).toLocaleString()}
            Description: ${exp.description || 'N/A'}
        `);
    };

    const filteredExpenses = expenses.filter(exp => 
        !searchTerm || 
        exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.expenseHead.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="expenses-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Finance</span>
                        <span className="separator">/</span>
                        <span>Expenses</span>
                    </div>
                    <h1>Manage Expenses</h1>
                </div>
            </div>

            <div className="card expenses-card">
                <div className="tabs-header">
                    <button 
                        className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        <PlusCircle size={18} /> Add Expense
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        <Search size={18} /> Search Expense
                    </button>
                    <button className="tab-btn text-muted"> Expense Head</button>
                </div>

                <div className="tabs-content">
                    {activeTab === 'add' && (
                        <form onSubmit={handleSave} className="animate-fade-in exp-form-layout">
                            <div className="form-column">
                                <div className="form-group">
                                    <label className="form-label">Expense Head <span className="required">*</span></label>
                                    <select className="form-select" required value={formData.expenseHead} onChange={e => setFormData({...formData, expenseHead: e.target.value})}>
                                        <option value="">Select</option>
                                        <option value="Electricity">Electricity Bill</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Office Supp">Office Supplies</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Name <span className="required">*</span></label>
                                    <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Invoice Number</label>
                                    <input type="text" className="form-input" value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date <span className="required">*</span></label>
                                    <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Amount (₹) <span className="required">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text"><IndianRupee size={16} /></span>
                                        <input type="number" className="form-input" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-column">
                                <div className="form-group document-upload-zone" onClick={triggerUpload} style={{ cursor: 'pointer' }}>
                                    <label className="form-label">Attach Document</label>
                                    <div className="upload-box">
                                        <Paperclip size={24} className="text-muted" />
                                        <p>Drop a file here or <span>click to upload</span></p>
                                        {formData.attachment && <p style={{ color: 'var(--success)', marginTop: 4, fontSize: '0.8rem' }}>Selected: {formData.attachment}</p>}
                                    </div>
                                </div>        <div className="form-group flex-fill">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-textarea" rows="5" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                </div>

                                <div className="form-actions text-right" style={{ marginTop: '20px' }}>
                                    <button type="submit" className="btn btn-primary">Save Expense</button>
                                </div>
                            </div>
                        </form>
                    )}

                    {activeTab === 'search' && (
                        <div className="animate-fade-in">
                            <div className="filter-row" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                <input type="text" className="form-input" placeholder="Search by Keyword" style={{ maxWidth: '300px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                <button className="btn btn-primary" onClick={() => {}}><Search size={18} /> Search</button>
                            </div>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Invoice No</th>
                                            <th>Expense Head</th>
                                            <th>Date</th>
                                            <th>Amount (₹)</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {filteredExpenses.map(exp => (
                                        <tr key={exp.id}>
                                            <td className="fw-600">{exp.name}</td>
                                            <td>{exp.invoiceNo}</td>
                                            <td>{exp.expenseHead}</td>
                                            <td>{exp.date}</td>
                                            <td className="fw-600">{Number(exp.amount).toLocaleString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="btn-icon text-info" title="View" onClick={() => handleView(exp)}><Eye size={18} /></button>
                                                    <button className="btn-icon text-danger" title="Delete" onClick={() => handleDelete(exp.id)}><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredExpenses.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No expenses found.</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
