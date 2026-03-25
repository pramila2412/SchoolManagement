const mongoose = require('mongoose');

const timetableEntrySchema = new mongoose.Schema({
    subject: { type: String, required: true },
    subjectCode: String,
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: String,
    hall: String,
    invigilator: String,
});

const examTimetableSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    className: { type: String, required: true },
    section: { type: String, required: true },
    entries: [timetableEntrySchema],
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
}, { timestamps: true });

examTimetableSchema.index({ exam: 1, className: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('ExamTimetable', examTimetableSchema);
