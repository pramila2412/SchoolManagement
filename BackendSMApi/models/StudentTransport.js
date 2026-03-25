const mongoose = require('mongoose');

const studentTransportSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    studentName: { type: String, required: true },
    class: String,
    section: String,
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    stop: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

// Prevent duplicate active assignment
studentTransportSchema.index({ studentId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'Active' } });

module.exports = mongoose.model('StudentTransport', studentTransportSchema);
