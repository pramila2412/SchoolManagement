const mongoose = require('mongoose');

const AcademicSubjectSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    subjectCode: { type: String, required: true },
    type: { type: String, enum: ['Theory', 'Practical', 'Both'], default: 'Theory' },
    assignedClasses: [{ type: String }] // Array of class names
}, { timestamps: true });

module.exports = mongoose.model('AcademicSubject', AcademicSubjectSchema);
