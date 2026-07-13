const mongoose = require('mongoose');

const SubjectTeacherAssignmentSchema = new mongoose.Schema({
    className: { type: String, required: true },
    section: { type: String, required: true },
    assignments: [{
        subjectName: { type: String, required: true },
        teacherName: { type: String, required: true }
    }]
}, { timestamps: true });

// Ensure unique assignment per class and section
SubjectTeacherAssignmentSchema.index({ className: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('SubjectTeacherAssignment', SubjectTeacherAssignmentSchema);
