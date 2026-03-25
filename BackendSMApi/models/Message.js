const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: String,
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'CollabGroup' },
    type: { type: String, enum: ['Direct', 'Group', 'Broadcast'], default: 'Direct' },
    content: { type: String, required: true },
    attachment: { fileName: String, fileUrl: String },
    status: { type: String, enum: ['Sent', 'Delivered', 'Read', 'Failed'], default: 'Sent' },
}, { timestamps: true });
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
module.exports = mongoose.model('Message', messageSchema);
