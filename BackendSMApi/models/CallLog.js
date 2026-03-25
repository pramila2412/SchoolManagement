const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
    callType: { type: String, required: true, enum: ['Incoming', 'Outgoing'] },
    callerName: { type: String, required: true },
    phone: { type: String, required: true },
    purpose: { type: String, required: true, enum: ['General Inquiry', 'Admission', 'Complaint', 'Follow-up', 'Emergency', 'Other'] },
    notes: { type: String, default: '' },
    duration: { type: String, default: '' },
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date, default: null },
    assignedTo: { type: String, default: '' },
    status: { type: String, enum: ['Logged', 'Pending Follow-up', 'Overdue', 'Completed'], default: 'Logged' },
    completionNotes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('CallLog', callLogSchema);
