import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, PlusCircle } from 'lucide-react';
import { classes, sections, getBatches, categories } from '../data/mockData';
import { api } from '../utils/api';
import { customAlert } from '../utils/dialogs';
import PhoneInput from '../components/PhoneInput';
import './AddStudent.css';

export default function AddStudent() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        batch: '2024-2025',
        class: '',
        section: '',
        firstName: '',
        lastName: '',
        gender: 'Male',
        dateOfBirth: '',
        bloodGroup: '',
        religion: '',
        fatherName: '',
        motherName: '',
        guardianPhone: '',
        guardianOccupation: '',
        contactNo: '',
        email: '',
        address: '',
        rollNo: '',
        admissionNo: '',
        admissionDate: '',
        feesStartDate: '',
        applicationNo: '',
        facility: [],
        newStudent: true,
        category: 'General',
        photo: null,
        birthCertificate: null,
        previousTC: null
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
            if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, [name]: e.target.files[0] });
            if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        const requiredStrFields = [
            'firstName', 'lastName', 'dateOfBirth', 'gender', 'bloodGroup', 
            'address', 'contactNo', 'email', 'fatherName', 'motherName', 
            'batch', 'class', 'section', 'rollNo', 'admissionDate', 'admissionNo'
        ];
        
        let hasMissing = false;
        requiredStrFields.forEach(field => {
            if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
                newErrors[field] = true;
                hasMissing = true;
            }
        });

        if (!formData.photo) { newErrors.photo = true; hasMissing = true; }
        if (!formData.birthCertificate) { newErrors.birthCertificate = true; hasMissing = true; }

        if (hasMissing) {
            setFormError('Please fill the required fields');
        } else {
            setFormError('');
        }

        if (formData.contactNo && formData.contactNo.length !== 10) {
            newErrors.contactNoMsg = 'Please enter exact 10 digits mobile number';
        }
        if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.emailMsg = 'Invalid email format';
            if (!newErrors.email) newErrors.email = true;
        }

        setErrors(newErrors);
        return !hasMissing && !newErrors.contactNoMsg && !newErrors.emailMsg;
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) return resolve(null);
            if (typeof file === 'string') return resolve(file); // Already a URL or base64
            
            if (file.type && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                        resolve(dataUrl);
                    };
                    img.onerror = (error) => reject(error);
                };
                reader.onerror = (error) => reject(error);
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const photoUrl = await convertToBase64(formData.photo);
            const birthCertificateUrl = await convertToBase64(formData.birthCertificate);
            const previousTcUrl = await convertToBase64(formData.previousTC);

            const newId = `STU-${formData.batch.split('-')[0]}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            const newStudent = {
                ...formData,
                id: newId,
                status: 'Active',
                totalFees: 45000,
                paidFees: 0,
                attendance: 100,
                photoUrl,
                birthCertificateUrl,
                previousTcUrl
            };
            
            delete newStudent.photo;
            delete newStudent.birthCertificate;
            delete newStudent.previousTC;

            await api.createStudent(newStudent);
            navigate('/students');
        } catch (err) {
            console.error("Failed to add student", err);
            await customAlert("Failed to add student to DB. Check server.");
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

            <div className="card add-student-form">
                <form onSubmit={handleSubmit}>
                    {formError && (
                        <div style={{ color: 'var(--danger)', marginBottom: '24px', fontWeight: 'bold', fontSize: '1rem', padding: '12px 16px', background: 'var(--danger-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--danger)' }}>
                            {formError}
                        </div>
                    )}
                    
                    {/* PERSONAL INFORMATION */}
                    <div className="form-section">
                        <h3 className="form-section-title">PERSONAL INFORMATION</h3>
                        <div className="form-row two-cols">
                            <div className="form-group">
                                <label className="form-label">First Name <span className="required">*</span></label>
                                <input type="text" className={`form-input ${errors.firstName ? 'error' : ''}`} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name <span className="required">*</span></label>
                                <input type="text" className={`form-input ${errors.lastName ? 'error' : ''}`} name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Gender <span className="required">*</span></label>
                                <div className="radio-group" style={errors.gender ? { border: '1px solid var(--danger)', padding: '8px', borderRadius: '4px' } : { padding: '8px' }}>
                                    <label className="radio-label"><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /><span>Male</span></label>
                                    <label className="radio-label"><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /><span>Female</span></label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date of Birth <span className="required">*</span></label>
                                <input type="date" className={`form-input ${errors.dateOfBirth ? 'error' : ''}`} name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Blood Group <span className="required">*</span></label>
                                <select className={`form-select ${errors.bloodGroup ? 'error' : ''}`} name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                                    <option value="">Select</option>
                                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row two-cols">
                            <div className="form-group">
                                <label className="form-label">Religion</label>
                                <input type="text" className="form-input" name="religion" value={formData.religion} onChange={handleChange} placeholder="Enter religion" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* PARENT & CONTACT DETAILS */}
                    <div className="form-section">
                        <h3 className="form-section-title">PARENT & CONTACT DETAILS</h3>
                        <div className="form-row two-cols">
                            <div className="form-group">
                                <label className="form-label">Father's Name <span className="required">*</span></label>
                                <input type="text" className={`form-input ${errors.fatherName ? 'error' : ''}`} name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter father's name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mother's Name <span className="required">*</span></label>
                                <input type="text" className={`form-input ${errors.motherName ? 'error' : ''}`} name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Enter mother's name" />
                            </div>
                        </div>

                        <div className="form-row two-cols">
                            <div className="form-group">
                                <label className="form-label">Guardian Phone</label>
                                <PhoneInput className="form-input" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} placeholder="Enter guardian phone" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Guardian Occupation</label>
                                <input type="text" className="form-input" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} placeholder="Enter occupation" />
                            </div>
                        </div>

                        <div className="form-row two-cols">
                            <div className="form-group">
                                <label className="form-label">Contact No <span className="required">*</span></label>
                                <PhoneInput className={`form-input ${errors.contactNo ? 'error' : ''}`} name="contactNo" value={formData.contactNo} onChange={handleChange} placeholder="10-digit mobile number" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">E-mail ID <span className="required">*</span></label>
                                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
                                {errors.emailMsg && <span className="error-text" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--danger)', marginTop: '4px' }}>{errors.emailMsg}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address <span className="required">*</span></label>
                            <textarea className={`form-input ${errors.address ? 'error' : ''}`} name="address" value={formData.address} onChange={handleChange} placeholder="Enter full address" rows="3"></textarea>
                        </div>
                    </div>

                    {/* ADMISSION & ACADEMIC */}
                    <div className="form-section">
                        <h3 className="form-section-title">ADMISSION & ACADEMIC</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Batch <span className="required">*</span></label>
                                <select className={`form-select ${errors.batch ? 'error' : ''}`} name="batch" value={formData.batch} onChange={handleChange}>
                                    {getBatches().map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Class <span className="required">*</span></label>
                                <select className={`form-select ${errors.class ? 'error' : ''}`} name="class" value={formData.class} onChange={handleChange}>
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section <span className="required">*</span></label>
                                <select className={`form-select ${errors.section ? 'error' : ''}`} name="section" value={formData.section} onChange={handleChange}>
                                    <option value="">Select Section</option>
                                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row two-cols">
                            <div className="form-group">
                                <label className="form-label">Roll No <span className="required">*</span></label>
                                <input type="text" className={`form-input ${errors.rollNo ? 'error' : ''}`} name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Enter Roll No" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Admission No <span className="required">*</span></label>
                                <input type="text" className={`form-input ${errors.admissionNo ? 'error' : ''}`} name="admissionNo" value={formData.admissionNo} onChange={handleChange} placeholder="Enter Admission No" />
                            </div>
                        </div>

                        <div className="form-row two-cols">
                            <div className="form-group">
                                <label className="form-label">Admission Date <span className="required">*</span></label>
                                <input type="date" className={`form-input ${errors.admissionDate ? 'error' : ''}`} name="admissionDate" value={formData.admissionDate} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Student?</label>
                                <div className="radio-group" style={{ padding: '8px' }}>
                                    <label className="radio-label"><input type="radio" name="newStudent" value="true" checked={formData.newStudent === true} onChange={() => setFormData({ ...formData, newStudent: true })} /><span>Yes</span></label>
                                    <label className="radio-label"><input type="radio" name="newStudent" value="false" checked={formData.newStudent === false} onChange={() => setFormData({ ...formData, newStudent: false })} /><span>No</span></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* UPLOAD DOCUMENTS */}
                    <div className="form-section">
                        <h3 className="form-section-title">UPLOAD DOCUMENTS</h3>
                        <div className="form-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            <div className="form-group">
                                <label className="form-label">Photo <span className="required">*</span></label>
                                <input type="file" className={`form-input ${errors.photo ? 'error' : ''}`} name="photo" onChange={handleFileChange} accept="image/*" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Birth Certificate <span className="required">*</span></label>
                                <input type="file" className={`form-input ${errors.birthCertificate ? 'error' : ''}`} name="birthCertificate" onChange={handleFileChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Previous TC <span style={{fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '4px'}}>(Optional)</span></label>
                                <input type="file" className="form-input" name="previousTC" onChange={handleFileChange} />
                            </div>
                        </div>
                    </div>

                    {/* FACILITY */}
                    <div className="form-section">
                        <h3 className="form-section-title">FACILITY</h3>
                        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                            {['Hostel', 'Transport', 'Library'].map(f => (
                                <label key={f} className="checkbox-label">
                                    <input type="checkbox" name="facility" value={f} checked={formData.facility.includes(f)} onChange={handleChange} />
                                    <span>{f}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* FORM ACTIONS */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-warning" onClick={() => navigate('/students')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120, justifyContent: 'center' }}>
                            {isSubmitting ? 'Saving...' : <><Save size={16} /> Submit</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
