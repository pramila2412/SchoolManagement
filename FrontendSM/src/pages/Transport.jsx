import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, Truck, Users as UsersIcon, Map, UserCheck, MapPin,
    ClipboardCheck, IndianRupee, Save, FileEdit, Trash2, PlusCircle,
    Bus, Route as RouteIcon, Navigation, Clock, Gauge, AlertTriangle,
    ChevronRight, CheckCircle2, XCircle, Search, Filter, Download,
    Wrench, Shield, Calendar, Phone, CreditCard, Eye
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { customAlert, customConfirm } from '../utils/dialogs';
import PhoneInput from '../components/PhoneInput';
import './Transport.css';

// Helper to get initials
const getInitials = n => n ? n.split(' ').map(x=>x[0]).join('').toUpperCase() : '?';

// ======================== DASHBOARD TAB ========================
function DashboardTab({ onNavigate }) {
    const [vehicles] = useLocalStorage('transport_vehicles', []);
    const [routes] = useLocalStorage('transport_routes', []);
    const [drivers] = useLocalStorage('transport_drivers', []);
    const [assignments] = useLocalStorage('transport_assignments', []);

    const maintenanceCost = vehicles.reduce((acc, v) => acc + (v.maintenance?.reduce((sum, m) => sum + (Number(m.cost) || 0), 0) || 0), 0);

    const kpis = [
        { label: 'Total Vehicles', value: vehicles.length, icon: Truck, color: 'var(--info)', bg: 'var(--info-light)' },
        { label: 'Active Routes', value: routes.filter(r => r.status === 'Active').length, icon: RouteIcon, color: 'var(--accent)', bg: 'var(--accent-light)' },
        { label: 'Students Using Transport', value: assignments.length, icon: UsersIcon, color: 'var(--success)', bg: 'var(--success-light)' },
        { label: 'Drivers Assigned', value: drivers.filter(d => d.vehicleId).length, icon: UserCheck, color: 'var(--primary)', bg: 'rgba(11,60,93,0.1)' },
        { label: 'Maintenance Cost', value: `₹${maintenanceCost.toLocaleString('en-IN')}`, icon: Wrench, color: 'var(--warning)', bg: 'var(--warning-light)' },
        { label: 'Pending Assignments', value: assignments.filter(a => a.status === 'Pending').length, icon: AlertTriangle, color: 'var(--danger)', bg: 'var(--danger-light)' },
    ];
    const quickActions = [
        { label: 'Add Vehicle', icon: Truck, tab: 'vehicles' },
        { label: 'Create Route', icon: Map, tab: 'routes' },
        { label: 'Assign Driver', icon: UserCheck, tab: 'drivers' },
        { label: 'Assign Student', icon: UsersIcon, tab: 'students' },
        { label: 'Track Vehicle', icon: Navigation, tab: 'tracking' },
    ];
    return (
        <div className="animate-fade-in">
            <div className="transport-kpi-grid">
                {kpis.map((k, i) => {
                    const Icon = k.icon;
                    return (
                        <div className="kpi-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="kpi-icon" style={{ background: k.bg }}>
                                <Icon size={24} style={{ color: k.color }} />
                            </div>
                            <div className="kpi-info">
                                <h4>{k.value}</h4>
                                <p>{k.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="section-divider"><ChevronRight size={18} /> Quick Actions</div>
            <div className="transport-quick-actions">
                {quickActions.map((a, i) => {
                    const Icon = a.icon;
                    return (
                        <button key={i} className="btn btn-outline" onClick={() => onNavigate(a.tab)}>
                            <Icon size={16} /> {a.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ======================== VEHICLES TAB ========================
function VehiclesTab() {
    const [vehicles, setVehicles] = useLocalStorage('transport_vehicles', []);
    const [form, setForm] = useState({ vehicleNumber: '', type: 'Bus', capacity: '', model: '', yearOfManufacture: '', insuranceProvider: '', policyNumber: '', insuranceExpiry: '', rcNumber: '', registrationExpiry: '', fitnessCertExpiry: '' });
    const [showMaint, setShowMaint] = useState(null);
    const [maintForm, setMaintForm] = useState({ date: '', type: 'Routine Service', cost: '', serviceProvider: '', notes: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newVehicle = { 
            ...form, 
            _id: Date.now(), 
            capacity: Number(form.capacity),
            status: 'Active',
            maintenance: []
        };
        setVehicles([newVehicle, ...vehicles]);
        setForm({ vehicleNumber: '', type: 'Bus', capacity: '', model: '', yearOfManufacture: '', insuranceProvider: '', policyNumber: '', insuranceExpiry: '', rcNumber: '', registrationExpiry: '', fitnessCertExpiry: '' });
        await customAlert('Vehicle added successfully');
    };

    const handleDelete = async (id) => {
        if (!await customConfirm('Delete this vehicle?')) return;
        setVehicles(prev => prev.filter(v => v._id !== id));
    };

    const handleMaintSubmit = async (e) => {
        e.preventDefault();
        const updated = vehicles.map(v => {
            if (v._id === showMaint) {
                return {
                    ...v,
                    maintenance: [...(v.maintenance || []), { ...maintForm, _id: Date.now(), cost: Number(maintForm.cost) }]
                };
            }
            return v;
        });
        setVehicles(updated);
        setMaintForm({ date: '', type: 'Routine Service', cost: '', serviceProvider: '', notes: '' });
        setShowMaint(null);
        await customAlert('Maintenance record saved');
    };

    const handleView = (v) => {
        const maintCount = v.maintenance?.length || 0;
        customAlert(`
            Vehicle Details
            ---------------
            No: ${v.vehicleNumber}
            Type: ${v.type}
            Capacity: ${v.capacity}
            Model: ${v.model || 'N/A'}
            Status: ${v.status}
            Maintenance Records: ${maintCount}
        `);
    };

    const statusBadge = (status) => {
        const cls = status === 'Active' ? 'badge-active' : status === 'Under Maintenance' ? 'badge-maintenance' : 'badge-inactive';
        return <span className={`badge ${cls}`}>{status}</span>;
    };

    return (
        <div className="animate-fade-in two-col-layout">
            <div className="form-panel">
                <h3>Add New Vehicle</h3>
                <form className="transport-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Vehicle Number <span className="required">*</span></label>
                        <input type="text" className="form-input" required placeholder="e.g. MH-12-AB-1234" value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Vehicle Type <span className="required">*</span></label>
                            <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option>Bus</option><option>Mini Bus</option><option>Van</option><option>Auto</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Capacity <span className="required">*</span></label>
                            <input type="number" className="form-input" required value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Model</label>
                            <input type="text" className="form-input" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Year of Manufacture</label>
                            <input type="text" className="form-input" value={form.yearOfManufacture} onChange={e => setForm({ ...form, yearOfManufacture: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Insurance Provider</label>
                            <input type="text" className="form-input" value={form.insuranceProvider} onChange={e => setForm({ ...form, insuranceProvider: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Policy Number</label>
                            <input type="text" className="form-input" value={form.policyNumber} onChange={e => setForm({ ...form, policyNumber: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Insurance Expiry</label>
                            <input type="date" className="form-input" value={form.insuranceExpiry} onChange={e => setForm({ ...form, insuranceExpiry: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">RC Number</label>
                            <input type="text" className="form-input" value={form.rcNumber} onChange={e => setForm({ ...form, rcNumber: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Registration Expiry</label>
                            <input type="date" className="form-input" value={form.registrationExpiry} onChange={e => setForm({ ...form, registrationExpiry: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fitness Cert Expiry</label>
                            <input type="date" className="form-input" value={form.fitnessCertExpiry} onChange={e => setForm({ ...form, fitnessCertExpiry: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary"><Save size={16} /> Save Vehicle</button>
                    </div>
                </form>

                {showMaint && (
                    <>
                        <div className="section-divider" style={{ marginTop: 28 }}><Wrench size={16} /> Add Maintenance Record</div>
                        <form className="transport-form" onSubmit={handleMaintSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Date <span className="required">*</span></label>
                                    <input type="date" className="form-input" required value={maintForm.date} onChange={e => setMaintForm({ ...maintForm, date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Type <span className="required">*</span></label>
                                    <select className="form-select" value={maintForm.type} onChange={e => setMaintForm({ ...maintForm, type: e.target.value })}>
                                        <option>Routine Service</option><option>Tyre Change</option><option>Engine Repair</option><option>Accident Repair</option><option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Cost (₹) <span className="required">*</span></label>
                                    <input type="number" className="form-input" required value={maintForm.cost} onChange={e => setMaintForm({ ...maintForm, cost: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Service Provider</label>
                                    <input type="text" className="form-input" value={maintForm.serviceProvider} onChange={e => setMaintForm({ ...maintForm, serviceProvider: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <textarea className="form-textarea" rows="2" value={maintForm.notes} onChange={e => setMaintForm({ ...maintForm, notes: e.target.value })} />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowMaint(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary"><Save size={16} /> Save Record</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
            <div className="table-panel table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Vehicle No.</th>
                            <th>Type</th>
                            <th>Capacity</th>
                            <th>Model</th>
                            <th>Status</th>
                            <th>Insurance Exp.</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No vehicles registered yet</td></tr>
                        ) : vehicles.map(v => (
                            <tr key={v._id}>
                                <td className="fw-600">{v.vehicleNumber}</td>
                                <td>{v.type}</td>
                                <td>{v.capacity}</td>
                                <td>{v.model || '—'}</td>
                                <td>{statusBadge(v.status)}</td>
                                <td>{v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString('en-IN') : '—'}</td>
                                <td>
                                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                        <button className="btn-icon" onClick={()=>handleView(v)} title="View"><Eye size={16}/></button>
                                        <button className="btn-icon" title="Maintenance" onClick={() => setShowMaint(showMaint === v._id ? null : v._id)}><Wrench size={16} /></button>
                                        <button className="btn-icon" style={{color:'var(--danger)'}} title="Delete" onClick={() => handleDelete(v._id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ======================== DRIVERS TAB ========================
function DriversTab() {
    const [drivers, setDrivers] = useLocalStorage('transport_drivers', []);
    const [vehicles] = useLocalStorage('transport_vehicles', []);
    const [routes] = useLocalStorage('transport_routes', []);
    const [form, setForm] = useState({ firstName: '', lastName: '', mobile: '', licenseNumber: '', licenseCategory: 'LMV', licenseExpiry: '', dob: '', gender: 'Male', address: '' });
    const [showAssign, setShowAssign] = useState(null);
    const [assignForm, setAssignForm] = useState({ vehicleId: '', routeId: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDriver = {
            ...form,
            _id: Date.now(),
            status: 'Active'
        };
        setDrivers([newDriver, ...drivers]);
        setForm({ firstName: '', lastName: '', mobile: '', licenseNumber: '', licenseCategory: 'LMV', licenseExpiry: '', dob: '', gender: 'Male', address: '' });
        await customAlert('Driver details saved');
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        setDrivers(prev => prev.map(d => d._id === showAssign ? { ...d, ...assignForm } : d));
        setShowAssign(null);
        setAssignForm({ vehicleId: '', routeId: '' });
        await customAlert('Driver assignment updated');
    };

    const handleDelete = async (id) => {
        if (!await customConfirm('Delete this driver?')) return;
        setDrivers(prev => prev.filter(d => d._id !== id));
    };

    const handleView = (d) => {
        const v = vehicles.find(vx => vx._id === d.vehicleId);
        const r = routes.find(rx => rx._id === d.routeId);
        customAlert(`
            Driver Details
            --------------
            Name: ${d.firstName} ${d.lastName}
            Mobile: ${d.mobile}
            License: ${d.licenseNumber} (${d.licenseCategory})
            Status: ${d.status}
            Vehicle: ${v?.vehicleNumber || 'Unassigned'}
            Route: ${r?.name || 'Unassigned'}
        `);
    };

    const statusBadge = (status) => {
        const map = { 'Active': 'badge-active', 'On Leave': 'badge-warning', 'Unassigned': 'badge-info', 'Inactive': 'badge-inactive' };
        return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
    };

    return (
        <div className="animate-fade-in two-col-layout">
            <div className="form-panel">
                <h3>Add New Driver</h3>
                <form className="transport-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">First Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mobile <span className="required">*</span></label>
                        <PhoneInput className="form-input" required value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">License Number <span className="required">*</span></label>
                            <input type="text" className="form-input" required value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">License Category <span className="required">*</span></label>
                            <select className="form-select" value={form.licenseCategory} onChange={e => setForm({ ...form, licenseCategory: e.target.value })}>
                                <option>LMV</option><option>HMV</option><option>PSV</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">License Expiry <span className="required">*</span></label>
                            <input type="date" className="form-input" required value={form.licenseExpiry} onChange={e => setForm({ ...form, licenseExpiry: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date of Birth</label>
                            <input type="date" className="form-input" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <select className="form-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <textarea className="form-textarea" rows="2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary"><Save size={16} /> Save Driver</button>
                    </div>
                </form>

                {showAssign && (
                    <>
                        <div className="section-divider" style={{ marginTop: 28 }}><UserCheck size={16} /> Assign Driver</div>
                        <form className="transport-form" onSubmit={handleAssign}>
                            <div className="form-group">
                                <label className="form-label">Vehicle</label>
                                <select className="form-select" value={assignForm.vehicleId} onChange={e => setAssignForm({ ...assignForm, vehicleId: e.target.value })}>
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNumber} ({v.type})</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Route</label>
                                <select className="form-select" value={assignForm.routeId} onChange={e => setAssignForm({ ...assignForm, routeId: e.target.value })}>
                                    <option value="">Select Route</option>
                                    {routes.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowAssign(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary"><Save size={16} /> Assign</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
            <div className="table-panel table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>License</th>
                            <th>Category</th>
                            <th>License Exp.</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No drivers registered yet</td></tr>
                        ) : drivers.map(d => (
                            <tr key={d._id}>
                                <td className="fw-600">{d.firstName} {d.lastName}</td>
                                <td>{d.mobile}</td>
                                <td>{d.licenseNumber}</td>
                                <td>{d.licenseCategory}</td>
                                <td>{d.licenseExpiry ? new Date(d.licenseExpiry).toLocaleDateString('en-IN') : '—'}</td>
                                <td>{statusBadge(d.status)}</td>
                                <td>
                                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                        <button className="btn-icon" onClick={()=>handleView(d)} title="View"><Eye size={16}/></button>
                                        <button className="btn-icon" title="Assign" onClick={() => setShowAssign(showAssign === d._id ? null : d._id)}><UserCheck size={16} /></button>
                                        <button className="btn-icon" style={{color:'var(--danger)'}} title="Delete" onClick={() => handleDelete(d._id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ======================== ROUTES TAB ========================
function RoutesTab() {
    const [routes, setRoutes] = useLocalStorage('transport_routes', []);
    const [form, setForm] = useState({ name: '', startPoint: '', endPoint: '', direction: 'Both' });
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [stopForm, setStopForm] = useState({ name: '', pickupTime: '', dropTime: '', sequence: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newRoute = {
            ...form,
            _id: Date.now(),
            status: 'Active',
            stops: []
        };
        setRoutes([newRoute, ...routes]);
        setForm({ name: '', startPoint: '', endPoint: '', direction: 'Both' });
        await customAlert('Route created successfully');
    };

    const handleAddStop = async (e) => {
        e.preventDefault();
        setRoutes(prev => prev.map(r => {
            if (r._id === selectedRoute) {
                return {
                    ...r,
                    stops: [...(r.stops || []), { ...stopForm, _id: Date.now(), sequence: Number(stopForm.sequence) }]
                };
            }
            return r;
        }));
        setStopForm({ name: '', pickupTime: '', dropTime: '', sequence: '' });
        await customAlert('Stop added to route');
    };

    const handleDelete = async (id) => {
        if (!await customConfirm('Delete this route?')) return;
        setRoutes(prev => prev.filter(r => r._id !== id));
        if (selectedRoute === id) setSelectedRoute(null);
    };

    const handleStatusChange = async (id, status) => {
        setRoutes(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    };

    const handleView = (r) => {
        customAlert(`
            Route Details
            -------------
            Name: ${r.name}
            Route: ${r.startPoint} to ${r.endPoint}
            Direction: ${r.direction}
            Stops: ${r.stops?.length || 0}
            Status: ${r.status}
        `);
    };

    const selected = routes.find(r => r._id === selectedRoute);

    return (
        <div className="animate-fade-in">
            <div className="two-col-layout">
                <div className="form-panel">
                    <h3>Create New Route</h3>
                    <form className="transport-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Route Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required placeholder="e.g. Route A - North Zone" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Start Point <span className="required">*</span></label>
                                <input type="text" className="form-input" required value={form.startPoint} onChange={e => setForm({ ...form, startPoint: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">End Point <span className="required">*</span></label>
                                <input type="text" className="form-input" required value={form.endPoint} onChange={e => setForm({ ...form, endPoint: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Direction</label>
                            <select className="form-select" value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })}>
                                <option>Morning</option><option>Afternoon</option><option>Both</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary"><Save size={16} /> Save Route</button>
                        </div>
                    </form>

                    {selectedRoute && selected && (
                        <>
                            <div className="section-divider" style={{ marginTop: 28 }}><MapPin size={16} /> Add Stop to: {selected.name}</div>
                            <form className="transport-form" onSubmit={handleAddStop}>
                                <div className="form-group">
                                    <label className="form-label">Stop Name <span className="required">*</span></label>
                                    <input type="text" className="form-input" required value={stopForm.name} onChange={e => setStopForm({ ...stopForm, name: e.target.value })} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Pickup Time</label>
                                        <input type="time" className="form-input" value={stopForm.pickupTime} onChange={e => setStopForm({ ...stopForm, pickupTime: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Drop Time</label>
                                        <input type="time" className="form-input" value={stopForm.dropTime} onChange={e => setStopForm({ ...stopForm, dropTime: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Sequence # <span className="required">*</span></label>
                                    <input type="number" className="form-input" required value={stopForm.sequence} onChange={e => setStopForm({ ...stopForm, sequence: e.target.value })} />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary"><PlusCircle size={16} /> Add Stop</button>
                                </div>
                            </form>

                            {selected.stops && selected.stops.length > 0 && (
                                <div className="stops-list">
                                    {selected.stops.sort((a, b) => a.sequence - b.sequence).map((s, i) => (
                                        <div className="stop-item" key={i}>
                                            <div className="stop-number">{s.sequence}</div>
                                            <div className="stop-details">
                                                <h5>{s.name}</h5>
                                                <span>{s.pickupTime && `Pickup: ${s.pickupTime}`} {s.dropTime && `| Drop: ${s.dropTime}`}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="table-panel table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Route Name</th>
                                <th>Start → End</th>
                                <th>Direction</th>
                                <th>Stops</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No routes created yet</td></tr>
                            ) : routes.map(r => (
                                <tr key={r._id} style={{ background: selectedRoute === r._id ? 'var(--accent-light)' : undefined }}>
                                    <td className="fw-600">{r.name}</td>
                                    <td>{r.startPoint} → {r.endPoint}</td>
                                    <td>{r.direction}</td>
                                    <td>{r.stops?.length || 0}</td>
                                    <td>
                                        <select className="form-select" value={r.status} onChange={e => handleStatusChange(r._id, e.target.value)} style={{ padding: '4px 8px', fontSize: '0.8rem', minWidth: '100px' }}>
                                            <option>Active</option><option>Suspended</option><option>Draft</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                            <button className="btn-icon" onClick={()=>handleView(r)} title="View"><Eye size={16}/></button>
                                            <button className="btn-icon" title="Manage Stops" onClick={() => setSelectedRoute(selectedRoute === r._id ? null : r._id)}><MapPin size={16} /></button>
                                            <button className="btn-icon" style={{color:'var(--danger)'}} title="Delete" onClick={() => handleDelete(r._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ======================== STUDENTS TAB ========================
function StudentsTab() {
    const [assignments, setAssignments] = useLocalStorage('transport_assignments', []);
    const [routes] = useLocalStorage('transport_routes', []);
    const [form, setForm] = useState({ studentName: '', class: '', section: '', routeId: '', stop: '', startDate: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const route = routes.find(r => r._id === Number(form.routeId) || r._id === form.routeId);
        const newAssignment = {
            ...form,
            _id: Date.now(),
            route: route,
            status: 'Active'
        };
        setAssignments([newAssignment, ...assignments]);
        setForm({ studentName: '', class: '', section: '', routeId: '', stop: '', startDate: '' });
        await customAlert('Student assigned to route successfully');
    };

    const handleUnassign = async (id) => {
        if (!await customConfirm('Unassign this student from transport?')) return;
        setAssignments(prev => prev.filter(a => a._id !== id));
    };

    return (
        <div className="animate-fade-in">
            <div className="two-col-layout">
                <div className="form-panel">
                    <h3>Assign Student to Route</h3>
                    <form className="transport-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Student Name <span className="required">*</span></label>
                            <input type="text" className="form-input" required value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Class</label>
                                <input type="text" className="form-input" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section</label>
                                <input type="text" className="form-input" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} />
                            </div>
                        </div>
                         <div className="form-group">
                            <label className="form-label">Route <span className="required">*</span></label>
                            <select className="form-select" required value={form.routeId} onChange={e => setForm({ ...form, routeId: e.target.value, stop: '' })}>
                                <option value="">Select Route</option>
                                {routes.filter(r => r.status === 'Active').map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stop <span className="required">*</span></label>
                            <select className="form-select" required value={form.stop} onChange={e => setForm({ ...form, stop: e.target.value })}>
                                <option value="">Select Stop</option>
                                {routes.find(r => r._id == form.routeId)?.stops?.sort((a, b) => a.sequence - b.sequence).map((s, i) => <option key={i} value={s.name}>{s.sequence}. {s.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input type="date" className="form-input" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary"><Save size={16} /> Assign Student</button>
                        </div>
                    </form>
                </div>
                <div className="table-panel table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Class</th>
                                <th>Route</th>
                                <th>Stop</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No students assigned yet</td></tr>
                            ) : assignments.map(a => (
                                <tr key={a._id}>
                                    <td className="fw-600">{a.studentName}</td>
                                    <td>{a.class} {a.section}</td>
                                    <td>{a.route?.name || '—'}</td>
                                    <td>{a.stop}</td>
                                    <td><span className={`badge ${a.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{a.status}</span></td>
                                    <td>
                                        <button className="btn-icon" title="Unassign" onClick={() => handleUnassign(a._id)}><XCircle size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ======================== TRACKING TAB ========================
function TrackingTab() {
    const [vehicles] = useLocalStorage('transport_vehicles', []);
    const [drivers] = useLocalStorage('transport_drivers', []);
    const [routes] = useLocalStorage('transport_routes', []);
    const activeVehicles = vehicles.filter(v => v.status === 'Active');

    return (
        <div className="animate-fade-in">
            <div className="simulated-map">
                <div className="map-label">
                    <Navigation size={36} />
                    <p><strong>Live Vehicle Tracking</strong></p>
                    <p>GPS integration required. Connect GPS devices to enable real-time tracking.</p>
                </div>
            </div>
            <div className="section-divider"><Bus size={18} /> Active Vehicles ({activeVehicles.length})</div>
            {activeVehicles.length === 0 ? (
                <div className="transport-empty"><Bus size={40} /><p>No active vehicles to track</p></div>
            ) : (
                <div className="tracking-grid">
                    {activeVehicles.map(v => (
                        <div className="tracking-card" key={v._id}>
                            <div className="tracking-card-header">
                                <h4><Truck size={18} /> {v.vehicleNumber}</h4>
                                <span className="badge badge-active">Active</span>
                            </div>
                            <div className="tracking-card-body">
                                <div className="tracking-detail"><span>Type</span><span>{v.type}</span></div>
                                <div className="tracking-detail"><span>Model</span><span>{v.model || '—'}</span></div>
                                <div className="tracking-detail"><span>Capacity</span><span>{v.capacity} seats</span></div>
                                <div className="tracking-detail"><span>Driver</span><span>{drivers.find(d => d.vehicleId == v._id)?.firstName ? `${drivers.find(d => d.vehicleId == v._id).firstName} ${drivers.find(d => d.vehicleId == v._id).lastName}` : 'Unassigned'}</span></div>
                                <div className="tracking-detail"><span>Route</span><span>{routes.find(r => r._id == drivers.find(d => d.vehicleId == v._id)?.routeId)?.name || 'Unassigned'}</span></div>
                                <div className="tracking-progress">
                                    <div className="tracking-detail"><span>Status</span><span style={{ color: 'var(--accent)' }}>Awaiting GPS</span></div>
                                    <div className="tracking-progress-bar"><div className="tracking-progress-fill" style={{ width: '0%' }} /></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ======================== ATTENDANCE TAB ========================
function AttendanceTab() {
    const [routes] = useLocalStorage('transport_routes', []);
    const [students] = useLocalStorage('transport_assignments', []);
    const [attendance, setAttendance] = useLocalStorage('transport_attendance', []);
    const [filters, setFilters] = useState({ route: '', date: new Date().toISOString().split('T')[0], trip: 'Morning Pickup' });
    const [records, setRecords] = useState({});

    const filteredStudents = students.filter(s => s.status === 'Active' && (!filters.route || s.route?._id == filters.route || s.routeId == filters.route));

    const toggleStatus = (studentId) => {
        setRecords(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'Boarded' ? 'Not Boarded' : 'Boarded'
        }));
    };

    const handleSave = async () => {
        if (!filters.route) return await customAlert('Please select a route.');
        const attendanceRecords = filteredStudents.map(s => ({
            studentId: s._id,
            studentName: s.studentName,
            stop: s.stop,
            status: records[s._id] || 'Not Boarded',
            remarks: ''
        }));
        
        const newEntry = {
            _id: Date.now(),
            routeId: filters.route,
            date: filters.date,
            trip: filters.trip,
            records: attendanceRecords
        };
        setAttendance([newEntry, ...attendance]);
        await customAlert('Attendance saved locally!');
    };

    return (
        <div className="animate-fade-in">
            <div className="attendance-filter-row">
                <div className="form-group">
                    <label className="form-label">Route</label>
                    <select className="form-select" value={filters.route} onChange={e => setFilters({ ...filters, route: e.target.value })}>
                        <option value="">All Routes</option>
                        {routes.filter(r => r.status === 'Active').map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" value={filters.date} onChange={e => setFilters({ ...filters, date: e.target.value })} />
                </div>
                <div className="form-group">
                    <label className="form-label">Trip</label>
                    <select className="form-select" value={filters.trip} onChange={e => setFilters({ ...filters, trip: e.target.value })}>
                        <option>Morning Pickup</option><option>Afternoon Drop</option>
                    </select>
                </div>
                <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-end' }}><Save size={16} /> Save Attendance</button>
            </div>

            {filteredStudents.length === 0 ? (
                <div className="transport-empty"><ClipboardCheck size={40} /><p>No students assigned to the selected route</p></div>
            ) : (
                <div className="attendance-student-list">
                    {filteredStudents.map(s => (
                        <div className="attendance-student-row" key={s._id}>
                            <div className="student-info">
                                <h5>{s.studentName}</h5>
                                <span>{s.class} {s.section} • Stop: {s.stop}</span>
                            </div>
                            <div className="attendance-actions">
                                <button className={`btn-sm ${records[s._id] === 'Boarded' ? 'btn-boarded' : 'btn-not-boarded'}`} onClick={() => toggleStatus(s._id)}>
                                    {records[s._id] === 'Boarded' ? <><CheckCircle2 size={14} /> Boarded</> : <><CheckCircle2 size={14} /> Board</>}
                                </button>
                                <button className={`btn-sm btn-not-boarded ${records[s._id] === 'Not Boarded' ? 'active-not-boarded' : ''}`} onClick={() => setRecords(prev => ({ ...prev, [s._id]: 'Not Boarded' }))}>
                                    <XCircle size={14} /> Absent
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ======================== FEES TAB ========================
function FeesTab() {
    const [fees, setFees] = useLocalStorage('transport_fees', []);
    const [routes] = useLocalStorage('transport_routes', []);
    const [form, setForm] = useState({ routeId: '', amount: '', frequency: 'Monthly', session: '2025-2026' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const route = routes.find(r => r._id == form.routeId);
        const newFee = { 
            ...form, 
            _id: Date.now(),
            routeName: route?.name || '',
            amount: Number(form.amount) 
        };
        setFees([newFee, ...fees]);
        setForm({ routeId: '', amount: '', frequency: 'Monthly', session: '2025-2026' });
        await customAlert('Fee configuration saved');
    };

    const handleDelete = async (id) => {
        if (!await customConfirm('Delete this fee configuration?')) return;
        setFees(prev => prev.filter(f => f._id !== id));
    };

    return (
        <div className="animate-fade-in">
            <div className="two-col-layout">
                <div className="form-panel">
                    <h3>Fee Configuration</h3>
                    <form className="transport-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Route <span className="required">*</span></label>
                            <select className="form-select" required value={form.routeId} onChange={e => setForm({ ...form, routeId: e.target.value })}>
                                <option value="">Select Route</option>
                                {routes.filter(r => r.status === 'Active').map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fee Amount (₹) <span className="required">*</span></label>
                            <input type="number" className="form-input" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Frequency</label>
                                <select className="form-select" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
                                    <option>Monthly</option><option>Quarterly</option><option>Annual</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Academic Session <span className="required">*</span></label>
                                <input type="text" className="form-input" required value={form.session} onChange={e => setForm({ ...form, session: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary"><Save size={16} /> Save Fee</button>
                        </div>
                    </form>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="section-divider"><CreditCard size={18} /> Configured Fees</div>
                    {fees.length === 0 ? (
                        <div className="transport-empty"><CreditCard size={40} /><p>No fees configured yet</p></div>
                    ) : (
                        <div className="fee-config-grid">
                            {fees.map(f => (
                                <div className="fee-card" key={f._id}>
                                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                                        <h4><RouteIcon size={16} /> {f.routeName}</h4>
                                        <button className="btn-icon" style={{color:'var(--danger)',padding:0}} onClick={()=>handleDelete(f._id)}><Trash2 size={14}/></button>
                                    </div>
                                    <div className="fee-amount">₹{Number(f.amount).toLocaleString('en-IN')}</div>
                                    <div className="fee-meta">{f.frequency} • Session: {f.session}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ======================== MAIN COMPONENT ========================
const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'drivers', label: 'Drivers', icon: UsersIcon },
    { id: 'routes', label: 'Routes', icon: Map },
    { id: 'students', label: 'Students', icon: UserCheck },
    { id: 'tracking', label: 'Tracking', icon: Navigation },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'fees', label: 'Fees', icon: IndianRupee },
];

export default function Transport() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard');

    const handleNavigate = (tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    useEffect(() => {
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    return (
        <div className="transport-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Transport</span>
                        {activeTab !== 'dashboard' && (
                            <>
                                <span className="separator">/</span>
                                <span style={{ textTransform: 'capitalize' }}>{activeTab}</span>
                            </>
                        )}
                    </div>
                    <h1>Transport Management</h1>
                </div>
            </div>

            <div className="card transport-card">
                <div className="tabs-header">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => handleNavigate(tab.id)}
                            >
                                <Icon size={16} /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="tabs-content">
                    {activeTab === 'dashboard' && <DashboardTab onNavigate={handleNavigate} />}
                    {activeTab === 'vehicles' && <VehiclesTab />}
                    {activeTab === 'drivers' && <DriversTab />}
                    {activeTab === 'routes' && <RoutesTab />}
                    {activeTab === 'students' && <StudentsTab />}
                    {activeTab === 'tracking' && <TrackingTab />}
                    {activeTab === 'attendance' && <AttendanceTab />}
                    {activeTab === 'fees' && <FeesTab />}
                </div>
            </div>
        </div>
    );
}
