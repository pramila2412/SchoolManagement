const mongoose = require('mongoose');

const transportFeeSchema = new mongoose.Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    routeName: String,
    amount: { type: Number, required: true },
    frequency: { type: String, enum: ['Monthly', 'Quarterly', 'Annual'], default: 'Monthly' },
    session: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('TransportFee', transportFeeSchema);
