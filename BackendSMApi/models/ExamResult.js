const mongoose = require('mongoose');

const subjectResultSchema = new mongoose.Schema({
    name: String,
    code: String,
    theoryMarks: Number,
    practicalMarks: Number,
    totalMarks: Number,
    maxMarks: Number,
    grade: String,
    passingMarks: Number,
    passed: Boolean,
});

const examResultSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    className: { type: String, required: true },
    section: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    studentName: { type: String, required: true },
    rollNo: String,
    subjects: [subjectResultSchema],
    grandTotal: Number,
    maxGrandTotal: Number,
    percentage: Number,
    grade: String,
    gpa: Number,
    classRank: Number,
    sectionRank: Number,
    status: { type: String, enum: ['Pass', 'Fail'], required: true },
    published: { type: Boolean, default: false },
    teacherRemarks: String,
    principalRemarks: String,
}, { timestamps: true });

examResultSchema.index({ exam: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('ExamResult', examResultSchema);
