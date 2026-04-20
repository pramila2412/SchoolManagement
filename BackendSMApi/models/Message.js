const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: String, required: true },
    content: { type: String, default: '' },
    attachment: {
        name: String,
        size: String,
        type: String,
    },
    status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'], default: 'delivered' },
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
