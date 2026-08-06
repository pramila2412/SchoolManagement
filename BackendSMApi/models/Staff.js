const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // EMP-2026-001
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    dob: { type: String },
    gender: { type: String },
    dept: { type: String, required: true },
    role: { type: String, required: true },
    type: { type: String, required: true }, // Full-time, Part-time, Contract
    joined: { type: String },
    address: { type: String },
    photoUrl: { type: String }, // Base64 or URL
    status: { type: String, default: 'Active' },
    
    salaryDetails: {
        basic: { type: String },
        hra: { type: String },
        ta: { type: String },
        da: { type: String },
        pf: { type: String },
        tds: { type: String },
        other: { type: String }
    },
    
    bankDetails: {
        bankName: { type: String },
        accountName: { type: String },
        accountNo: { type: String },
        ifsc: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Staff', StaffSchema);
