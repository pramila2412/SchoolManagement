import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    IndianRupee, AlertCircle, ArrowRight, TrendingUp, TrendingDown,
    Wallet, Receipt, PieChart, Plus, Search, Edit, Trash2,
} from 'lucide-react';
import { api } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import './Finance.css';

export default function FinancePage() {
    const [tab, setTab] = useState('collection');
    const [dashboardStats, setDashboardStats] = useState({ feesCollected: 0, pendingFees: 0 });
    const [feeInvoices, setFeeInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const [statsData, invoicesData] = await Promise.all([
                    api.getDashboardStats(),
                    api.getInvoices()
                ]);
                setDashboardStats(statsData);
                setFeeInvoices(invoicesData);
            } catch (err) {
                console.error("Failed to load finance data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFinanceData();
    }, []);

    const totalExpected = dashboardStats.feesCollected + dashboardStats.pendingFees;
    const collectionRate = totalExpected > 0 ? Math.round((dashboardStats.feesCollected / totalExpected) * 100) : 0;
    const pendingInvoicesCount = feeInvoices.filter(inv => inv.status !== 'paid').length;

    const handleCollect = async (id) => {
        try {
            await api.updateInvoiceStatus(id, 'paid');
            // Refresh invoices
            const invoicesData = await api.getInvoices();
            setFeeInvoices(invoicesData);
        } catch (err) {
            console.error("Failed to collect invoice", err);
        }
    };

    return (
        <div className="finance-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Finance</span>
                    </div>
                    <h1>Finance Management</h1>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <Link to="/finance/concessions" className="btn btn-outline">
                        <Wallet size={16} /> Concessions
                    </Link>
                </div>
            </div>

            <div className="tabs-header" style={{ marginBottom: 20 }}>
                <button className={`tab-btn ${tab === 'collection' ? 'active' : ''}`} onClick={() => setTab('collection')}>
                    Fee Collection
                </button>
                <button className={`tab-btn ${tab === 'structure' ? 'active' : ''}`} onClick={() => setTab('structure')}>
                    Fee Structure (2026-27)
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading finance data...</div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="card stat-card-finance">
                            <div className="stat-fin-icon" style={{ background: 'var(--success-light)' }}>
                                <IndianRupee size={22} style={{ color: 'var(--success)' }} />
                            </div>
                            <div>
                                <div className="stat-fin-value">{formatCurrency(dashboardStats.feesCollected)}</div>
                                <div className="stat-fin-label">Total Collected</div>
                            </div>
                            <TrendingUp size={20} className="stat-fin-trend" style={{ color: 'var(--success)' }} />
                        </div>
                        <div className="card stat-card-finance">
                            <div className="stat-fin-icon" style={{ background: 'var(--warning-light)' }}>
                                <AlertCircle size={22} style={{ color: 'var(--warning)' }} />
                            </div>
                            <div>
                                <div className="stat-fin-value">{formatCurrency(dashboardStats.pendingFees)}</div>
                                <div className="stat-fin-label">Pending Fees</div>
                            </div>
                            <TrendingDown size={20} className="stat-fin-trend" style={{ color: 'var(--warning)' }} />
                        </div>
                        <div className="card stat-card-finance">
                            <div className="stat-fin-icon" style={{ background: 'var(--info-light)' }}>
                                <Receipt size={22} style={{ color: 'var(--info)' }} />
                            </div>
                            <div>
                                <div className="stat-fin-value">{pendingInvoicesCount}</div>
                                <div className="stat-fin-label">Pending Invoices</div>
                            </div>
                        </div>
                        <div className="card stat-card-finance">
                            <div className="stat-fin-icon" style={{ background: 'var(--accent-light)' }}>
                                <PieChart size={22} style={{ color: 'var(--accent)' }} />
                            </div>
                            <div>
                                <div className="stat-fin-value">{collectionRate}%</div>
                                <div className="stat-fin-label">Collection Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Reminders Table */}
                    <div className="card" style={{ marginBottom: 24 }}>
                        <div className="payment-alert">
                            <AlertCircle size={18} />
                            <span>Following invoices are due/over-due for payment</span>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Class</th>
                                        <th>Invoice No</th>
                                        <th>Due Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeInvoices.map((inv) => (
                                        <tr key={inv._id}>
                                            <td className="td-bold">{inv.studentName}</td>
                                            <td>{inv.class}</td>
                                            <td><code>{inv.invoiceNo}</code></td>
                                            <td>{inv.dueDate}</td>
                                            <td className="td-bold">{formatCurrency(inv.amount)}</td>
                                            <td>
                                                <span className={`badge ${inv.status === 'overdue' ? 'badge-danger' : inv.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                                    {inv.status === 'overdue' ? 'Overdue' : inv.status === 'paid' ? 'Paid' : 'Due'}
                                                </span>
                                            </td>
                                            <td>
                                                {inv.status !== 'paid' && (
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                                                        onClick={() => handleCollect(inv._id)}
                                                    >
                                                        Collect
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {!loading && tab === 'structure' && (
                <div className="card animate-fade-in" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: 'var(--text-dark)' }}>Mount Zion School - Fee Structure 2026-27</h3>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Class Group</th>
                                    <th>Admission Fee</th>
                                    <th>Annual Fee (Incidental)</th>
                                    <th>Examination Fee (1 Year)</th>
                                    <th>Monthly Fee</th>
                                    <th className="td-bold text-right" style={{ background: 'var(--bg)' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="td-bold">NURSERY, LKG & UKG</td>
                                    <td>FREE (3000.00)</td><td>2000.00</td><td>2000.00</td><td>1500.00</td>
                                    <td className="text-right fw-600" style={{ background: 'var(--bg)' }}>5500.00</td>
                                </tr>
                                <tr>
                                    <td className="td-bold">STD. 1 to 2</td>
                                    <td>FREE (4000.00)</td><td>3000.00</td><td>2000.00</td><td>2000.00</td>
                                    <td className="text-right fw-600" style={{ background: 'var(--bg)' }}>7000.00</td>
                                </tr>
                                <tr>
                                    <td className="td-bold">STD. 3 to 4</td>
                                    <td>FREE (4000.00)</td><td>3000.00</td><td>2000.00</td><td>2400.00</td>
                                    <td className="text-right fw-600" style={{ background: 'var(--bg)' }}>7400.00</td>
                                </tr>
                                <tr>
                                    <td className="td-bold">STD. 5 to 7</td>
                                    <td>7500.00</td><td>7950.00</td><td>3050.00</td><td>2700.00</td>
                                    <td className="text-right fw-600" style={{ background: 'var(--bg)' }}>21200.00</td>
                                </tr>
                                <tr>
                                    <td className="td-bold">STD. 8</td>
                                    <td>7500.00</td><td>7950.00</td><td>3650.00</td><td>3300.00</td>
                                    <td className="text-right fw-600" style={{ background: 'var(--bg)' }}>22400.00</td>
                                </tr>
                                <tr>
                                    <td className="td-bold">STD. 9</td>
                                    <td>8000.00</td><td>9150.00</td><td>4250.00</td><td>3300.00</td>
                                    <td className="text-right fw-600" style={{ background: 'var(--bg)' }}>24700.00</td>
                                </tr>
                                <tr>
                                    <td className="td-bold">STD. 11</td>
                                    <td>-</td><td>8550.00</td><td>4000.00</td><td>3300.00</td>
                                    <td className="text-right fw-600" style={{ background: 'var(--bg)' }}>15850.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
