const express = require('express');
const router = express.Router();
const AttendanceRecord = require('../models/AttendanceRecord');
const Student = require('../models/Student');

// Get students for a class/section (to populate attendance grid)
router.get('/students', async (req, res) => {
    try {
        const { class: cls, section } = req.query;
        if (!cls || !section) return res.status(400).json({ message: 'Class and section required' });
        const students = await Student.find({ class: cls, section, status: 'Active' }).sort({ rollNo: 1 });
        res.json(students.map(s => ({ studentId: s.id, studentName: `${s.firstName} ${s.lastName}`, admissionNo: s.admissionNo, rollNo: s.rollNo })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get attendance for a date/class/section
router.get('/', async (req, res) => {
    try {
        const { date, class: cls, section } = req.query;
        const filter = {};
        if (date) filter.date = new Date(date);
        if (cls) filter.class = cls;
        if (section) filter.section = section;
        res.json(await AttendanceRecord.find(filter).sort({ date: -1 }));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Save / update attendance
router.post('/', async (req, res) => {
    try {
        const { date, class: cls, section, period, entries } = req.body;
        const existing = await AttendanceRecord.findOne({ date: new Date(date), class: cls, section });
        if (existing) {
            existing.entries = entries;
            existing.period = period;
            await existing.save();
            return res.json(existing);
        }
        const record = await AttendanceRecord.create({ date: new Date(date), class: cls, section, period, entries });
        res.status(201).json(record);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

// Monthly report: get all records for a class/section in a month
router.get('/report/monthly', async (req, res) => {
    try {
        const { class: cls, section, month, year } = req.query;
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);
        const records = await AttendanceRecord.find({ class: cls, section, date: { $gte: start, $lte: end } }).sort({ date: 1 });
        res.json(records);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Student-wise summary
router.get('/report/student/:studentId', async (req, res) => {
    try {
        const records = await AttendanceRecord.find({ 'entries.studentId': req.params.studentId });
        let total = 0, present = 0, absent = 0, late = 0, leave = 0;
        records.forEach(r => {
            const entry = r.entries.find(e => e.studentId === req.params.studentId);
            if (entry) { total++; if (entry.status === 'Present') present++; else if (entry.status === 'Absent') absent++; else if (entry.status === 'Late') late++; else if (entry.status === 'Leave') leave++; }
        });
        res.json({ totalDays: total, present, absent, late, leave, percentage: total > 0 ? Math.round((present / total) * 100) : 0 });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
