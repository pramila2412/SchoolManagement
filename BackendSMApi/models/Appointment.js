const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    visitorName: { type: String, required: true },
    phone: { type: String, required: true },
    staffMember: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    purpose: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show'], default: 'Scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
