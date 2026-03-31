import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, Plus, Edit, Trash2, Wallet, Search,
} from 'lucide-react';
import { api } from '../utils/api';
import './Concessions.css';

// Mock student concessions as they are not mapped to DB yet
const studentConcessions = [
    { id: 1, studentName: 'Ananya Singh', class: 'VII-C', concessionType: 'EWS Concession', value: '100%' },
    { id: 2, studentName: 'Priya Joshi', class: 'Nursery-A', concessionType: 'Staff Ward', value: '50%' }
];

export default function ConcessionPage() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [form, setForm] = useState({ title: '', type: 'Percentage', value: '', status: 'Active' });
    const [concessions, setConcessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConcessions = async () => {
        try {
            const data = await api.getConcessions();
            setConcessions(data);
        } catch (err) {
            console.error("Failed to get concessions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConcessions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createConcession({
                title: form.title,
                type: form.type,
                value: Number(form.value),
                status: form.status
            });
            setShowAddForm(false);
            setForm({ title: '', type: 'Percentage', value: '', status: 'Active' });
            fetchConcessions();
        } catch (err) {
            console.error("Failed to add concession", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this concession?")) {
            try {
                await api.deleteConcession(id);
                fetchConcessions();
            } catch (err) {
                console.error("Failed to delete concession", err);
            }
        }
    };

    return (
        <div className="concession-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <Link to="/finance">Finance</Link>
                        <span className="separator">/</span>
                        <span>Concessions</span>
                    </div>
                    <h1>Concession Management</h1>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                        <Plus size={16} /> Add Concession Type
                    </button>
                    <Link to="/finance" className="btn btn-outline">
                        <ArrowLeft size={16} /> Back
                    </Link>
                </div>
            </div>

            {/* Add Concession Form */}
            {showAddForm && (
                <div className="card add-concession-form animate-slide-up" style={{ marginBottom: 24, padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: 'var(--primary)' }}>Add Concession Type</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Title <span className="required">*</span></label>
                                <input type="text" className="form-input" required placeholder="e.g. Staff Ward" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Type <span className="required">*</span></label>
                                <select className="form-select" value={form.type} onChange={e => {
                                    const nextType = e.target.value;
                                    setForm({ ...form, type: nextType, value: nextType === 'Total Free' ? 100 : form.value });
                                }}>
                                    <option value="Percentage">Percentage</option>
                                    <option value="Fixed">Fixed Amount</option>
                                    <option value="Total Free">Total Free</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Value <span className="required">*</span></label>
                                <input type="number" required className="form-input" placeholder={form.type === 'Percentage' ? 'e.g. 50' : 'e.g. 5000'} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} disabled={form.type === 'Total Free'} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading concessions...</div>
            ) : (
                <>
                    {/* Concession Types Table */}
                    <div className="card" style={{ marginBottom: 24 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Concession Types</h3>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Value</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {concessions.map(c => (
                                        <tr key={c._id}>
                                            <td className="td-bold">{c.title}</td>
                                            <td>{c.type}</td>
                                            <td className="td-bold">{c.type === 'Percentage' || c.type === 'Total Free' ? `${c.value}%` : `₹${c.value.toLocaleString()}`}</td>
                                            <td><span className="badge badge-success">{c.status}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(c._id)}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {concessions.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No concession types found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Student Concessions Table (Mock Data) */}
                    <div className="card">
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Student Concessions (Sample Data)</h3>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Class</th>
                                        <th>Concession Type</th>
                                        <th>Value</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentConcessions.map(sc => (
                                        <tr key={sc.id}>
                                            <td className="td-bold">{sc.studentName}</td>
                                            <td>{sc.class}</td>
                                            <td>{sc.concessionType}</td>
                                            <td className="td-bold">{sc.value}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="btn-icon" style={{ color: 'var(--info)' }}><Edit size={16} /></button>
                                                    <button className="btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
