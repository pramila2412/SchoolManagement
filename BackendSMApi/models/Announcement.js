const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Academic', 'General', 'Urgent', 'Event', 'Holiday'], default: 'General' },
    audience: { type: String, enum: ['Everyone', 'All Staff', 'All Students', 'All Parents', 'Specific Class', 'Specific Group'], required: true },
    targetClass: String,
    targetGroup: String,
    attachments: [{ fileName: String, fileUrl: String }],
    publishMode: { type: String, enum: ['Immediate', 'Scheduled'], default: 'Immediate' },
    scheduledDate: Date,
    sendNotification: { type: Boolean, default: false },
    status: { type: String, enum: ['Draft', 'Scheduled', 'Published', 'Archived'], default: 'Published' },
    createdBy: { type: String, default: 'Admin' },
}, { timestamps: true });
module.exports = mongoose.model('Announcement', announcementSchema);
