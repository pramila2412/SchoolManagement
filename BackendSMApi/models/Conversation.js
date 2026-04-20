const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    type: { type: String, enum: ['direct', 'group', 'broadcast'], default: 'direct' },
    name: { type: String, required: true },
    role: String,
    participants: [String],
    lastMessage: {
        text: String,
        sender: String,
        time: Date,
    },
    unreadCounts: { type: Map, of: Number, default: {} },
    createdBy: { type: String, default: 'Admin' },
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ 'lastMessage.time': -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
