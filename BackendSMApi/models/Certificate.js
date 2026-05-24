const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    class: String,
    section: String,
    type: { type: String, enum: ['Bonafide', 'Character', 'Study', 'Migration', 'Fee', 'Custom'], required: true },
    certificateNo: { type: String, unique: true },
    issueDate: { type: Date, default: Date.now },
    purpose: String,
    remarks: String,
    fatherName: String,
    motherName: String,
    dateOfBirth: Date,
    admissionNo: String,
    academicYear: String,
    feeYearStart: String,
    feeYearEnd: String,
    monthlyFee: Number,
    feeMonths: { type: Number, default: 12 },
    totalFee: Number,
    generatedBy: { type: String, default: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
