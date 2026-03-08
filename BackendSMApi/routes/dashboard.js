const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const FeeInvoice = require('../models/FeeInvoice');

router.get('/stats', async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();

        // Calculate total fees collected and pending from Students collection
        const students = await Student.find({}, 'totalFees paidFees');
        let feesCollected = 0;
        let pendingFees = 0;

        students.forEach(s => {
            feesCollected += (s.paidFees || 0);
            pendingFees += ((s.totalFees || 0) - (s.paidFees || 0));
        });

        res.json({
            totalStudents: studentCount,
            feesCollected,
            pendingFees,
            attendanceToday: 91.5 // Mock value for now
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
