const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: String,
    type: { type: String, enum: ['Theory', 'Practical', 'Both'], default: 'Theory' },
    teacher: String,
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    theoryMarks: Number,
    practicalMarks: Number,
});

const classConfigSchema = new mongoose.Schema({
    className: { type: String, required: true },
    sections: [String],
    subjects: [subjectSchema],
});

const examSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true },
    type: { type: String, enum: ['Theory', 'Practical', 'Both'], default: 'Theory' },
    classes: [classConfigSchema],
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['Draft', 'Scheduled', 'Ongoing', 'Completed'], default: 'Draft' },
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
