const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    purpose: { type: String, required: true, enum: ['Meeting', 'Admission Enquiry', 'Delivery', 'Parent Visit', 'Interview', 'Other'] },
    staffMeeting: { type: String, default: '' },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date, default: null },
    status: { type: String, enum: ['Checked In', 'Checked Out'], default: 'Checked In' },
    note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
