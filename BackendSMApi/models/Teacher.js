const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    employeeId: { type: String },
    department: { type: String },
    contactEmail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
