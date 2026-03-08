const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g. STU001
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: String,
    batch: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    email: String,
    contactNo: { type: String, required: true },
    address: String,
    rollNo: { type: String, required: true },
    admissionNo: { type: String, required: true },
    category: { type: String, required: true },
    facility: [String],

    // App-specific data
    totalFees: { type: Number, default: 0 },
    paidFees: { type: Number, default: 0 },
    attendance: { type: Number, default: 100 },
    newStudent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
