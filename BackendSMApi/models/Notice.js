const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    effectiveDate: { type: Date, default: Date.now },
    expiryDate: Date,
    visibility: { type: String, enum: ['Entire School', 'Staff Only', 'Students Only', 'Specific Department'], default: 'Entire School' },
    targetDepartment: String,
    attachment: { fileName: String, fileUrl: String },
    pinned: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Expired', 'Archived'], default: 'Active' },
    createdBy: { type: String, default: 'Admin' },
}, { timestamps: true });
module.exports = mongoose.model('Notice', noticeSchema);
