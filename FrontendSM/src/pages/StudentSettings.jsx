import { useState } from 'react';
import { Settings, Download, Save, ListTree, Calendar, Hash, CheckSquare } from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import './StudentSettings.css';

export default function StudentSettings() {
    const [idFormat, setIdFormat] = useState('STU-YYYY-NNN');
    const [academicYear, setAcademicYear] = useState('2024-2025');

    const handleSave = (e) => {
        e.preventDefault();
        customAlert('Settings saved successfully!');
    };

    const handleDownloadTemplate = () => {
        const headers = ['Student ID', 'Admission No', 'Roll No', 'First Name', 'Last Name', 'Class', 'Section', 'Gender', 'Phone', 'Email', 'Status'];
        const csvRows = [headers.join(',')];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'Bulk_Import_Template.csv');
        a.click();
    };

    return (
        <div className="student-settings-page animate-fade-in" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Student Module Settings</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Configure student module behaviors and data formats.</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="settings-grid" style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                
                {/* ID Format */}
                <div className="card settings-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '8px' }}>
                            <Hash size={20} />
                        </div>
                        <h3>Student ID Format</h3>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Prefix + Auto-increment format</label>
                        <select className="form-select" value={idFormat} onChange={(e) => setIdFormat(e.target.value)}>
                            <option value="STU-YYYY-NNN">STU-YYYY-NNN (e.g. STU-2024-001)</option>
                            <option value="STU-NNN">STU-NNN (e.g. STU-001)</option>
                            <option value="YYYY-NNN">YYYY-NNN (e.g. 2024-001)</option>
                        </select>
                    </div>
                </div>

                {/* Required Fields */}
                <div className="card settings-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '8px' }}>
                            <CheckSquare size={20} />
                        </div>
                        <h3>Required Fields</h3>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mandatory Form Fields</label>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked disabled /> Name</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked disabled /> Class</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked disabled /> DOB</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked disabled /> Roll No</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked /> Blood Group</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked /> Address</label>
                        </div>
                    </div>
                </div>

                {/* Class & Section Setup */}
                <div className="card settings-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '8px' }}>
                            <ListTree size={20} />
                        </div>
                        <h3>Class & Section Setup</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>Manage classes (Nursery - XII) and sections (A, B, C...)</p>
                    <button className="btn btn-outline" style={{ width: '100%' }}>Manage Classes & Sections</button>
                </div>

                {/* Academic Year */}
                <div className="card settings-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '8px' }}>
                            <Calendar size={20} />
                        </div>
                        <h3>Academic Year Setup</h3>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Current Academic Year</label>
                        <select className="form-select" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                            <option value="2023-2024">2023-2024</option>
                            <option value="2024-2025">2024-2025</option>
                            <option value="2025-2026">2025-2026</option>
                        </select>
                    </div>
                </div>

                {/* Bulk Import */}
                <div className="card settings-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '8px' }}>
                            <Download size={20} />
                        </div>
                        <h3>Bulk Import Format</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>Download the standard Excel/CSV template for bulk student imports.</p>
                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleDownloadTemplate}>
                        <Download size={16} /> Download Template
                    </button>
                </div>

            </div>
        </div>
    );
}
