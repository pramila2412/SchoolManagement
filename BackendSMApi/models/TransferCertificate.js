const mongoose = require('mongoose');

const tcSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    class: String,
    section: String,
    admissionNo: String,
    admissionDate: Date,
    dateOfBirth: Date,
    fatherName: String,
    tcNo: { type: String, unique: true },
    dateOfLeaving: { type: Date, required: true },
    reasonForLeaving: { type: String, required: true },
    conduct: { type: String, enum: ['Good', 'Satisfactory', 'Excellent', 'Needs Improvement'], default: 'Good' },
    medium: { type: String, default: 'English' },
    classLastStudied: String,
    generatedBy: { type: String, default: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('TransferCertificate', tcSchema);
