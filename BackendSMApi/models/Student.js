const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g. STU-2024-001
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    gender: { type: String, required: true },
    dateOfBirth: Date,
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''], default: '' },
    religion: String,
    category: { type: String, default: 'General' },

    // Parent / Guardian
    fatherName: { type: String, required: true },
    motherName: String,
    guardianPhone: String,
    guardianOccupation: String,

    // Contact
    email: String,
    contactNo: { type: String, required: true },
    address: String,

    // Academic
    batch: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    rollNo: { type: String, required: true },
    admissionNo: { type: String, required: true },
    admissionDate: Date,
    academicYear: String,

    // Facility & status
    facility: [String],
    photoUrl: String,
    birthCertificateUrl: String,
    previousTcUrl: String,
    status: { type: String, enum: ['Active', 'Inactive', 'Left'], default: 'Active' },
    newStudent: { type: Boolean, default: false },

    // Finance
    totalFees: { type: Number, default: 0 },
    paidFees: { type: Number, default: 0 },
    attendance: { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
