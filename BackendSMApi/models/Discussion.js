const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    author: { type: String, required: true },
    authorRole: { type: String, default: 'Staff' },
    content: { type: String, required: true },
    attachment: String,
    parentReplyIdx: { type: Number, default: null },
    likes: [{ user: String, reaction: String }],
    createdAt: { type: Date, default: Date.now },
});

const discussionSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Academic', 'General', 'Q&A', 'Events', 'Feedback'], default: 'General' },
    visibility: { type: String, enum: ['School-wide', 'Specific Group', 'Class'], default: 'School-wide' },
    targetGroup: String,
    targetClass: String,
    author: { type: String, default: 'Admin' },
    authorRole: { type: String, default: 'Super Admin' },
    attachment: String,
    replies: [replySchema],
    likes: [{ user: String, reaction: String }],
    pinned: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    editedAt: Date,
    status: { type: String, enum: ['Open', 'Closed', 'Flagged'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);
