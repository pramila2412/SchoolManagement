const mongoose = require('mongoose');

const sharedFileSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: String,
    fileName: { type: String, required: true },
    fileUrl: String,
    fileSize: Number,
    fileType: String,
    category: { type: String, enum: ['Study Material', 'Assignment', 'Notice', 'Event', 'Other'], default: 'Other' },
    audience: { type: String, enum: ['Everyone', 'All Staff', 'All Students', 'Specific Group', 'Specific Class'], default: 'Everyone' },
    targetGroup: String,
    targetClass: String,
    accessLevel: { type: String, enum: ['View Only', 'Download Allowed', 'Restricted'], default: 'Download Allowed' },
    expiryDate: Date,
    uploadedBy: { type: String, default: 'Admin' },
}, { timestamps: true });
module.exports = mongoose.model('SharedFile', sharedFileSchema);
