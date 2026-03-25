const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    studentName: String,
    stop: String,
    status: { type: String, enum: ['Boarded', 'Not Boarded'], required: true },
    remarks: String,
});

const transportAttendanceSchema = new mongoose.Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    date: { type: Date, required: true },
    trip: { type: String, enum: ['Morning Pickup', 'Afternoon Drop'], required: true },
    records: [attendanceRecordSchema],
}, { timestamps: true });

transportAttendanceSchema.index({ route: 1, date: 1, trip: 1 }, { unique: true });

module.exports = mongoose.model('TransportAttendance', transportAttendanceSchema);
