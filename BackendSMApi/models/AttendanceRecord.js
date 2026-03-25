const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    admissionNo: String,
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Leave', 'Unmarked'], default: 'Unmarked' },
    remarks: String,
});

const attendanceRecordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    period: String,
    entries: [entrySchema],
    markedBy: { type: String, default: 'Admin' },
}, { timestamps: true });

attendanceRecordSchema.index({ date: 1, class: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);
