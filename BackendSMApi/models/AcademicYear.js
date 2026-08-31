const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
    label: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
