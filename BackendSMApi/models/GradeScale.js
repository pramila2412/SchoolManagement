const mongoose = require('mongoose');

const gradeScaleSchema = new mongoose.Schema({
    label: { type: String, required: true, trim: true },
    minPercentage: { type: Number, required: true },
    maxPercentage: { type: Number, required: true },
    gpa: Number,
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('GradeScale', gradeScaleSchema);
