const mongoose = require('mongoose');

const markEntrySchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    studentName: { type: String, required: true },
    rollNo: String,
    theoryMarks: { type: Number, default: 0 },
    practicalMarks: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    remarks: String,
    status: { type: String, enum: ['Saved', 'Pending'], default: 'Pending' },
});

const examMarksSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    className: { type: String, required: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    subjectCode: String,
    maxTheoryMarks: Number,
    maxPracticalMarks: Number,
    maxTotalMarks: Number,
    entries: [markEntrySchema],
}, { timestamps: true });

examMarksSchema.index({ exam: 1, className: 1, section: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('ExamMarks', examMarksSchema);
