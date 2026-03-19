import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileEdit, FileText } from 'lucide-react';
import './TC.css';

export default function TC() {
    const [formData, setFormData] = useState({
        batch: '2024-2025',
        class: '',
        section: '',
        keyword: ''
    });

    const [filters, setFilters] = useState({
        Name: true,
        RollNo: false,
        AdmNo: false,
        FatherName: false,
        MotherName: false,
        LoginId: false,
        Mobile: false
    });

    const handleFilterChange = (key) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        // Mock data
        setResults([
            { id: 1, batch: '2024-2025', className: 'NURSERY - A', rollNo: '12', studentName: 'Rohan Verma', fatherName: 'Vikash Verma', contact: '9876500001', admNo: 'ADM-101' },
            { id: 2, batch: '2024-2025', className: 'NURSERY - A', rollNo: '15', studentName: 'Sneha Singh', fatherName: 'Manoj Singh', contact: '9876500002', admNo: 'ADM-105' }
        ]);
        setHasSearched(true);
    };

    return (
        <div className="tc-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Front Office</span>
                        <span className="separator">/</span>
                        <span>TC Requests</span>
                    </div>
                    <h1>View TC Request</h1>
                </div>
            </div>

            <div className="card tc-filter-card">
                <form onSubmit={handleSearch}>
                    <div className="form-grid-3">
                        <div className="form-group">
                            <label className="form-label">Batch</label>
                            <select className="form-select" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})}>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2023-2024">2023-2024</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Class</label>
                            <select className="form-select" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})}>
                                <option value="">Select Class</option>
                                <option value="NURSERY">NURSERY</option>
                                <option value="I">Class I</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section</label>
                            <select className="form-select" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})}>
                                <option value="">Select Section</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label className="form-label">Select Student</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter Keyword..." 
                            value={formData.keyword}
                            onChange={e => setFormData({...formData, keyword: e.target.value})}
                        />
                    </div>

                    <div className="checkbox-row">
                        {Object.keys(filters).map(key => (
                            <label key={key} className="checkbox-item tc-checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={filters[key]} 
                                    onChange={() => handleFilterChange(key)} 
                                />
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>

                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '10px 30px' }}>
                            <Search size={18} /> Search
                        </button>
                    </div>
                </form>
            </div>

            {hasSearched && (
                <div className="card tc-results-card animate-slide-up" style={{ marginTop: '24px' }}>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Batch</th>
                                    <th>Class & Sec</th>
                                    <th>Roll No.</th>
                                    <th>Student</th>
                                    <th>Father</th>
                                    <th>Contact No.</th>
                                    <th>Adm No.</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? results.map(row => (
                                    <tr key={row.id}>
                                        <td>{row.batch}</td>
                                        <td>{row.className}</td>
                                        <td>{row.rollNo}</td>
                                        <td className="fw-600">{row.studentName}</td>
                                        <td>{row.fatherName}</td>
                                        <td>{row.contact}</td>
                                        <td>{row.admNo}</td>
                                        <td>
                                            <div className="action-buttons-center">
                                                <button className="btn-icon text-info" title="Manage TC">
                                                    <FileEdit size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8">
                                            <div className="empty-state">
                                                <FileText size={48} />
                                                <h3>No TC Requests Found</h3>
                                                <p>Try adjusting your search filters to find records.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
