const mongoose = require('mongoose');

const postalItemSchema = new mongoose.Schema({
    direction: { type: String, required: true, enum: ['Inward', 'Outward'] },
    // Inward fields
    senderName: { type: String, default: '' },
    senderAddress: { type: String, default: '' },
    recipient: { type: String, default: '' },
    // Outward fields
    receiverName: { type: String, default: '' },
    receiverAddress: { type: String, default: '' },
    // Common fields
    parcelType: { type: String, enum: ['Letter', 'Package', 'Document', 'Courier', 'Speed Post', 'Registered Post'], default: 'Letter' },
    courierCompany: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    contents: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Received', 'Delivered', 'Dispatched', 'In Transit'], default: 'Received' },
}, { timestamps: true });

module.exports = mongoose.model('PostalItem', postalItemSchema);
