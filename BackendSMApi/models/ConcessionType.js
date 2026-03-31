const mongoose = require('mongoose');

const concessionTypeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Percentage', 'Fixed', 'Total Free'], required: true },
    value: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('ConcessionType', concessionTypeSchema);
