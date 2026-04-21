import React, { useState, useEffect } from 'react';
import { Users, Activity, LayoutDashboard, Search, Eye, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import './ParentPortal.css';

const TABS = [
    { id: 'list', label: 'Parents List', icon: Users },
    { id: 'activities', label: 'Parent Activities', icon: Activity },
];

export default function AdminParentPortal() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const [searchTerm, setSearchTerm] = useState('');
    
    const [parents, setParents] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        // Group students by parentId
        const globalStudents = JSON.parse(localStorage.getItem('mzs_students') || '[]');
        const parentsMap = {};

        globalStudents.forEach(student => {
            if (student.parentId) {
                if (!parentsMap[student.parentId]) {
                    parentsMap[student.parentId] = {
                        parentId: student.parentId,
                        parentName: student.parentName || student.fatherName || 'Unknown Parent',
                        email: student.parentEmail || 'N/A',
                        phone: student.phone || student.guardianPhone || 'N/A',
                        children: [],
                        lastLogin: student.firstLogin === false ? 'Recent' : 'Never logged in'
                    };
                }
                parentsMap[student.parentId].children.push({
                    id: student.id,
                    name: student.name || `${student.firstName} ${student.lastName}`,
                    class: student.class
                });
            }
        });

        setParents(Object.values(parentsMap));

        // Generate mock activities based on fee payments and mock logins
        const allPayments = JSON.parse(localStorage.getItem('mzs_fee_payments') || '[]');
        const activityLog = [];
        
        allPayments.forEach(p => {
            const student = globalStudents.find(s => s.id === p.studentId);
            if (student && student.parentId) {
                activityLog.push({
                    id: p.id || Math.random().toString(36).substr(2, 9),
                    parentId: student.parentId,
                    parentName: student.parentName || student.fatherName || 'Unknown',
                    action: `Paid Fees: ₹${p.amount} for ${student.firstName}`,
                    date: p.date,
                    type: 'payment'
                });
            }
        });

        // Add some mock logins
        Object.values(parentsMap).forEach((p, i) => {
            if (p.lastLogin === 'Recent') {
                activityLog.push({
                    id: `log-${i}`,
                    parentId: p.parentId,
                    parentName: p.parentName,
                    action: 'Logged into Parent Portal',
                    date: new Date().toISOString().split('T')[0],
                    type: 'login'
                });
            }
        });

        activityLog.sort((a, b) => new Date(b.date) - new Date(a.date));
        setActivities(activityLog);

    }, []);

    const filteredParents = parents.filter(p => 
        p.parentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.parentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNavigate = (tab) => {
        setSearchParams({ tab });
    };

    return (
        <div className="admin-parent-portal-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Parent Portal Administration</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Manage parents, track their activities, and oversee portal usage.
                    </p>
                </div>
            </div>

            <div className="card pp-card" style={{ marginTop: '20px' }}>
                <div className="tabs-header">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button 
                                key={tab.id} 
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} 
                                onClick={() => handleNavigate(tab.id)}
                            >
                                <Icon size={16}/> {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="tabs-content" style={{ padding: '24px' }}>
                    {activeTab === 'list' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '6px 12px', width: '300px' }}>
                                    <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search by Parent Name or ID..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
                                    />
                                </div>
                                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Filter size={16} /> Filter
                                </button>
                            </div>

                            {filteredParents.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No parents found.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Parent ID</th>
                                                <th>Name</th>
                                                <th>Contact Info</th>
                                                <th>Children Connected</th>
                                                <th>Last Login</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredParents.map((parent, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ fontFamily: 'monospace' }}>{parent.parentId}</td>
                                                    <td style={{ fontWeight: '600' }}>{parent.parentName}</td>
                                                    <td>
                                                        <div style={{ fontSize: '0.85rem' }}>{parent.email}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{parent.phone}</div>
                                                    </td>
                                                    <td>
                                                        {parent.children.map((c, i) => (
                                                            <div key={i} style={{ fontSize: '0.85rem' }}>
                                                                • {c.name} ({c.class})
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${parent.lastLogin === 'Recent' ? 'badge-success' : 'badge-draft'}`}>
                                                            {parent.lastLogin}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button className="icon-btn" title="View Details">
                                                            <Eye size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'activities' && (
                        <div>
                            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Recent Parent Activities</h3>
                            {activities.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No recent activities found.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Parent Name</th>
                                                <th>Activity Type</th>
                                                <th>Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activities.map((act, idx) => (
                                                <tr key={idx}>
                                                    <td>{act.date}</td>
                                                    <td style={{ fontWeight: '600' }}>
                                                        {act.parentName}
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>{act.parentId}</div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${act.type === 'payment' ? 'badge-warning' : 'badge-info'}`}>
                                                            {act.type.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td>{act.action}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
