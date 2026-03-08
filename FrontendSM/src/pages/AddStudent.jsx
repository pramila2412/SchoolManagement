import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, PlusCircle } from 'lucide-react';
import { classes, sections, batches, categories } from '../data/mockData';
import { api } from '../utils/api';
import './AddStudent.css';

export default function AddStudent() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        batch: '2024-2025',
        class: '',
        section: '',
        firstName: '',
        lastName: '',
        gender: 'Male',
        fatherName: '',
        motherName: '',
        contactNo: '',
        email: '',
        address: '',
        rollNo: '',
        admissionNo: '',
        feesStartDate: '',
        applicationNo: '',
        facility: [],
        newStudent: true,
        category: 'General'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const newFacilities = checked
                ? [...formData.facility, value]
                : formData.facility.filter(f => f !== value);
            setFormData({ ...formData, facility: newFacilities });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
        if (!formData.class) newErrors.class = 'Class is required';
        if (!formData.section) newErrors.section = 'Section is required';
        if (!formData.contactNo.trim()) newErrors.contactNo = 'Contact Number is required';
        if (!formData.fatherName.trim()) newErrors.fatherName = "Father's Name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // Auto-generate ID just for the demo based on Name and RollNo
            const newId = `STU${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            const newStudent = {
                ...formData,
                id: newId,
                totalFees: 45000, // Default fee
                paidFees: 0,
                attendance: 100
            };

            await api.createStudent(newStudent);
            navigate('/students');
        } catch (err) {
            console.error("Failed to add student", err);
            // Fallback/error alert
            alert("Failed to add student to DB. Check server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-student-page animate-fade-in">
            <div className="page-header" style={{ marginBottom: 24 }}>
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <Link to="/students">Students</Link>
                        <span className="separator">/</span>
                        <span>Add Student</span>
                    </div>
                    <h1>Add New Student</h1>
                </div>
                <Link to="/students" className="btn btn-outline" style={{ background: '#fff' }}>
                    <ArrowLeft size={16} /> Back to Students
                </Link>
            </div>

            <div className="card form-container">
                <form onSubmit={handleSubmit}>
                    {/* BASIC INFORMATION */}
                    <div className="form-section">
                        <h3 className="section-title">BASIC INFORMATION</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Batch <span className="required">*</span></label>
                                <select className="form-select" name="batch" value={formData.batch} onChange={handleChange}>
                                    {batches.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Class <span className="required">*</span></label>
                                <select className={`form-select ${errors.class ? 'error' : ''}`} name="class" value={formData.class} onChange={handleChange}>
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                {errors.class && <span className="error-text">{errors.class}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section <span className="required">*</span></label>
                                <select className={`form-select ${errors.section ? 'error' : ''}`} name="section" value={formData.section} onChange={handleChange}>
                                    <option value="">Select Section</option>
                                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.section && <span className="error-text">{errors.section}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">First Name <span className="required">*</span></label>
                                <input type="text" className={`form-input ${errors.firstName ? 'error' : ''}`} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" />
                                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-input" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
                                    <span>Male</span>
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
                                    <span>Female</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* PARENT & CONTACT DETAILS */}
                    <div className="form-section">
                        <h3 className="section-title">PARENT & CONTACT DETAILS</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Father's Name <span className="required">*</span></label>
                                <input type="text" className={`form-input ${errors.fatherName ? 'error' : ''}`} name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter father's name" />
                                {errors.fatherName && <span className="error-text">{errors.fatherName}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mother's Name</label>
                                <input type="text" className="form-input" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Enter mother's name" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Contact No <span className="required">*</span></label>
                                <input type="text" className={`form-input ${errors.contactNo ? 'error' : ''}`} name="contactNo" value={formData.contactNo} onChange={handleChange} placeholder="Enter contact no" />
                                {errors.contactNo && <span className="error-text">{errors.contactNo}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">E-mail ID</label>
                                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <textarea className="form-input" name="address" value={formData.address} onChange={handleChange} placeholder="Enter full address" rows="3"></textarea>
                        </div>
                    </div>

                    {/* ACADEMIC & FACILITY */}
                    <div className="form-section">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Roll No</label>
                                <input type="text" className="form-input" name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Enter Roll No" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Admission No</label>
                                <input type="text" className="form-input" name="admissionNo" value={formData.admissionNo} onChange={handleChange} placeholder="Enter Admission No" />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: 20 }}>
                            <label className="form-label">Facility</label>
                            <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="facility" value="Hostel" checked={formData.facility.includes('Hostel')} onChange={handleChange} />
                                    <span>Hostel</span>
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="facility" value="Transport" checked={formData.facility.includes('Transport')} onChange={handleChange} />
                                    <span>Transport</span>
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="facility" value="Library" checked={formData.facility.includes('Library')} onChange={handleChange} />
                                    <span>Library</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-row" style={{ marginTop: 24 }}>
                            <div className="form-group">
                                <label className="form-label">New Student?</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input type="radio" name="newStudent" value="true" checked={formData.newStudent === true} onChange={() => setFormData({ ...formData, newStudent: true })} />
                                        <span>Yes</span>
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="newStudent" value="false" checked={formData.newStudent === false} onChange={() => setFormData({ ...formData, newStudent: false })} />
                                        <span>No</span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* FORM ACTIONS */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-warning" onClick={() => navigate('/students')}>
                            Cancel
                        </button>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button type="button" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--warning)', borderColor: 'var(--warning)' }}>
                                <PlusCircle size={16} /> Add More Info
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120, justifyContent: 'center' }}>
                                {isSubmitting ? 'Saving...' : <><Save size={16} /> Submit</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
