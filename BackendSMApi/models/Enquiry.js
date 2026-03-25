const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    enquiryType: { type: String, required: true, enum: ['Admission', 'General', 'Fee', 'Academic', 'Facility', 'Other'] },
    source: { type: String, enum: ['Walk-in', 'Phone', 'Online', 'Email', 'Referral', 'Social Media'], default: 'Walk-in' },
    message: { type: String, default: '' },
    assignedTo: { type: String, default: '' },
    followUpDate: { type: Date, default: null },
    status: { type: String, enum: ['New', 'In Progress', 'Converted', 'Closed'], default: 'New' },
    // Admission-specific fields
    studentName: { type: String, default: '' },
    parentName: { type: String, default: '' },
    classInterested: { type: String, default: '' },
    academicYear: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
