const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complainantName: { type: String, required: true },
    phone: { type: String, required: true },
    complainantType: { type: String, required: true, enum: ['Parent', 'Student', 'Staff', 'External'] },
    category: { type: String, required: true, enum: ['Transport', 'Teacher', 'Facility', 'Administration', 'Academic', 'Fee', 'Other'] },
    description: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    assignedTo: { type: String, default: '' },
    expectedResolutionDate: { type: Date, default: null },
    status: { type: String, enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Escalated'], default: 'Pending' },
    resolutionSummary: { type: String, default: '' },
    remarks: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
