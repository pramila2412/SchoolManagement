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
        </div>
    );
}
