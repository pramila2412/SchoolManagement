const express = require('express');
const router = express.Router();
const TransferCertificate = require('../models/TransferCertificate');
const Student = require('../models/Student');

// List all TCs
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.class) filter.class = req.query.class;
        res.json(await TransferCertificate.find(filter).sort({ createdAt: -1 }));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Generate TC — also marks student as Left
router.post('/', async (req, res) => {
    try {
        const count = await TransferCertificate.countDocuments();
        const tcNo = `TC-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
        const tc = await TransferCertificate.create({ ...req.body, tcNo });

        // Auto-deactivate student
        if (req.body.studentId) {
            await Student.findOneAndUpdate({ id: req.body.studentId }, { status: 'Left' });
        }
        res.status(201).json(tc);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
