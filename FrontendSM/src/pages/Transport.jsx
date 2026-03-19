import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Map, Save, FileEdit, Link as LinkIcon } from 'lucide-react';
import './Transport.css';

export default function Transport() {
    const [activeTab, setActiveTab] = useState('addVehicle');

    return (
        <div className="transport-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Transport</span>
                    </div>
                    <h1>Transport Management</h1>
                </div>
            </div>

            <div className="card transport-card">
                <div className="tabs-header">
                    <button 
                        className={`tab-btn ${activeTab === 'addRoute' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addRoute')}
                    >
                        <Map size={18} /> Add Route
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'addVehicle' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addVehicle')}
                    >
                        <Truck size={18} /> Add Vehicle
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assign')}
                    >
                        <LinkIcon size={18} /> Assign Vehicle
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === 'addRoute' && (
                        <div className="animate-fade-in two-col-layout">
                            <div className="form-panel">
                                <h3>Create New Route</h3>
                                <form className="transport-form">
                                    <div className="form-group">
                                        <label className="form-label">Route Title <span className="required">*</span></label>
                                        <input type="text" className="form-input" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Fare (₹)</label>
                                        <input type="number" className="form-input" />
                                    </div>
                                    <div className="form-actions text-right">
                                        <button type="button" className="btn btn-primary"><Save size={18} /> Save</button>
                                    </div>
                                </form>
                            </div>
                            <div className="table-panel">
                                <table className="data-table">
                                    <thead><tr><th>Route Title</th><th>Fare</th><th>Action</th></tr></thead>
                                    <tbody>
                                        <tr><td>City Center to School</td><td>1200</td><td><button className="btn-icon"><FileEdit size={16}/></button></td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'addVehicle' && (
                        <div className="animate-fade-in two-col-layout">
                            <div className="form-panel">
                                <h3>Add Vehicle</h3>
                                <form className="transport-form">
                                    <div className="form-group">
                                        <label className="form-label">Vehicle Number <span className="required">*</span></label>
                                        <input type="text" className="form-input" required placeholder="e.g. MH-12-AB-1234" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Vehicle Model</label>
                                        <input type="text" className="form-input" placeholder="e.g. Tata Starbus" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Year Made</label>
                                        <input type="text" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Driver Name <span className="required">*</span></label>
                                        <input type="text" className="form-input" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Driver License</label>
                                        <input type="text" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Driver Contact</label>
                                        <input type="text" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Note</label>
                                        <textarea className="form-textarea" rows="2"></textarea>
                                    </div>
                                    <div className="form-actions text-right">
                                        <button type="button" className="btn btn-primary"><Save size={18} /> Save</button>
                                    </div>
                                </form>
                            </div>
                            <div className="table-panel table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Vehicle No.</th>
                                            <th>Model</th>
                                            <th>Driver Name</th>
                                            <th>Contact</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fw-600">UP14-CB-9090</td>
                                            <td>Force Traveller</td>
                                            <td>Rajesh Kumar</td>
                                            <td>9876543210</td>
                                            <td><button className="btn-icon"><FileEdit size={16}/></button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'assign' && (
                        <div className="animate-fade-in two-col-layout">
                            <div className="form-panel">
                                <h3>Assign Vehicle on Route</h3>
                                <form className="transport-form">
                                    <div className="form-group">
                                        <label className="form-label">Route <span className="required">*</span></label>
                                        <select className="form-select" required>
                                            <option value="">Select Route</option>
                                            <option value="1">City Center to School</option>
                                        </select>
                                    </div>
                                    <div className="form-group vehicle-checkboxes">
                                        <label className="form-label">Vehicle <span className="required">*</span></label>
                                        <div className="checkbox-list">
                                            <label className="checkbox-item"><input type="checkbox" /> UP14-CB-9090</label>
                                            <label className="checkbox-item"><input type="checkbox" /> HR26-XY-1234</label>
                                            <label className="checkbox-item"><input type="checkbox" /> DL1P-AA-8888</label>
                                        </div>
                                    </div>
                                    <div className="form-actions text-right" style={{marginTop: '20px'}}>
                                        <button type="button" className="btn btn-primary"><Save size={18} /> Assign</button>
                                    </div>
                                </form>
                            </div>
                            <div className="table-panel">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Route</th>
                                            <th>Vehicles Assigned</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fw-600">City Center to School</td>
                                            <td>UP14-CB-9090, DL1P-AA-8888</td>
                                            <td><button className="btn-icon"><FileEdit size={16}/></button></td>
                                        </tr>
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
