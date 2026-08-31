const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    schoolCode: { type: String, required: true, unique: true, uppercase: true }, // SION, KOSI
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    status: { type: String, default: 'Active' }
}, { timestamps: true, skipTenant: true });

module.exports = mongoose.model('School', SchoolSchema);
