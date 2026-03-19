import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Printer, FileText } from 'lucide-react';
import './Certificates.css';

export default function Certificates() {
    const [formData, setFormData] = useState({
        batch: '2024-2025',
        class: '',
        section: '',
        status: 'Active',
        keyword: '',
        certType: '',
        certMaster: ''
    });

    const [filters, setFilters] = useState({
        FirstName: true,
        RollNo: false,
        AdmNo: false,
        FatherName: false,
        LoginId: false,
        ContactMobileNo: false
    });

    const handleFilterChange = (key) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Mock initial empty state (will populate after search in real integration)
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        // Mock data
        setResults([
            { id: 1, batch: '2024-2025', className: 'NURSERY', section: 'A', rollNo: '1', studentName: 'Aarav Kumar', fatherName: 'Raj Kumar', contact: '9876543210', admNo: 'ADM-001' },
            { id: 2, batch: '2024-2025', className: 'NURSERY', section: 'A', rollNo: '2', studentName: 'Diya Patel', fatherName: 'Amit Patel', contact: '9876543211', admNo: 'ADM-002' }
        ]);
        setHasSearched(true);
    };

    return (
        <div className="certificates-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Academics</span>
                        <span className="separator">/</span>
                        <span>Certificates</span>
                    </div>
                    <h1>Generate Student / General Certificates</h1>
                </div>
            </div>

            <div className="card certificates-filter-card">
                <form onSubmit={handleSearch}>
                    <div className="form-grid-4">
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
                                <option value="II">Class II</option>
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
                        <div className="form-group">
                            <label className="form-label">Active/Inactive</label>
                            <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="All">All</option>
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
                            <label key={key} className="checkbox-item cert-checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={filters[key]} 
                                    onChange={() => handleFilterChange(key)} 
                                />
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>

                    <div className="certificate-config-row">
                        <div className="form-group flex-1">
                            <label className="form-label">Certificate Type</label>
                            <select className="form-select" value={formData.certType} onChange={e => setFormData({...formData, certType: e.target.value})}>
                                <option value="">Select Certificate Type</option>
                                <option value="performance">Performance Certificate</option>
                                <option value="character">Character Certificate</option>
                            </select>
                        </div>
                        <div className="form-group flex-1">
                            <label className="form-label">Certificate Master</label>
                            <select className="form-select" value={formData.certMaster} onChange={e => setFormData({...formData, certMaster: e.target.value})}>
                                <option value="">Select Certificate Master</option>
                                <option value="std_perf">Standard Performance</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary search-btn" style={{ alignSelf: 'flex-end', height: '42px' }}>
                            <Search size={18} /> Search
                        </button>
                    </div>
                </form>
            </div>

            {hasSearched && (
                <div className="card certificates-results-card animate-fade-in" style={{ marginTop: '24px' }}>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Batch Name</th>
                                    <th>Class Name</th>
                                    <th>Section Name</th>
                                    <th>Roll No.</th>
                                    <th>Student Name</th>
                                    <th>Father Name</th>
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
                                        <td>{row.section}</td>
                                        <td>{row.rollNo}</td>
                                        <td className="fw-600">{row.studentName}</td>
                                        <td>{row.fatherName}</td>
                                        <td>{row.contact}</td>
                                        <td>{row.admNo}</td>
                                        <td>
                                            <div className="action-buttons-center">
                                                <button className="btn-icon text-primary" title="View Certificate">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="btn-icon text-primary" title="Print Certificate">
                                                    <Printer size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="9">
                                            <div className="empty-state">
                                                <FileText size={48} />
                                                <h3>No Students Found</h3>
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
