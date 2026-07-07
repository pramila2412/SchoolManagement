const mongoose = require('mongoose');

const admissionApplicationSchema = new mongoose.Schema({
    // Student Info
    fullName: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String },
    religion: { type: String },
    category: { type: String, default: 'General' },
    nationality: { type: String, default: 'Indian' },
    
    // Parent Details
    fatherName: { type: String },
    fatherOccupation: { type: String },
    motherName: { type: String, required: true },
    motherOccupation: { type: String },
    primaryContact: { type: String, required: true },
    email: { type: String, required: true },
    annualIncome: { type: String },
    
    // Address
    permanentAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    sameAddress: { type: Boolean, default: false },
    
    // Academic History
    prevSchool: { type: String },
    lastClass: { type: String },
    marks: { type: String },
    tcNumber: { type: String },
    medium: { type: String },
    
    // Admission Details
    applyingClass: { type: String, required: true },
    sectionPref: { type: String },
    admissionDate: { type: String, required: true },
    
    // Document Uploads
    documents: [{
        name: { type: String },
        status: { type: String, default: 'Uploaded' } // Uploaded, Verified, Pending
    }],
    
    // Status
    status: { type: String, enum: ['Submitted', 'Under Review', 'Approved', 'Rejected'], default: 'Submitted' },
    rejectReason: { type: String },
    internalRemarks: { type: String },
    
    appliedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AdmissionApplication', admissionApplicationSchema);
