const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    agenda: String,
    type: { type: String, enum: ['Online', 'In-person', 'Hybrid'], default: 'Online' },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    platform: { type: String, enum: ['Zoom', 'Google Meet', 'Microsoft Teams', 'Manual Link', 'N/A'], default: 'Manual Link' },
    meetingLink: String,
    participants: [{ name: String, role: String }],
    targetGroup: String,
    status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Scheduled' },
    createdBy: { type: String, default: 'Admin' },
}, { timestamps: true });
module.exports = mongoose.model('Meeting', meetingSchema);
