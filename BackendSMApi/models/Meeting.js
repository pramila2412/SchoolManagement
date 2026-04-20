const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    agenda: String,
    type: { type: String, enum: ['Online', 'In-person', 'Hybrid'], default: 'Online' },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    platform: { type: String, enum: ['Zoom', 'Google Meet', 'Microsoft Teams', 'Manual Link', 'N/A'], default: 'Zoom' },
    meetingLink: String,
    participants: { type: String, default: '' },
    organizer: { type: String, default: 'Admin' },
    organizerRole: { type: String, default: 'Super Admin' },
    sendInvites: { type: Boolean, default: true },
    status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
