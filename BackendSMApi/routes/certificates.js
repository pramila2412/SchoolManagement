const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// List all certificates (optionally filter by studentId)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.studentId) filter.studentId = req.query.studentId;
        res.json(await Certificate.find(filter).sort({ createdAt: -1 }));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Generate certificate
router.post('/', async (req, res) => {
    try {
        const count = await Certificate.countDocuments();
        const certNo = `CERT-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
        const cert = await Certificate.create({ ...req.body, certificateNo: certNo });
        res.status(201).json(cert);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

// Delete certificate
router.delete('/:id', async (req, res) => {
    try { await Certificate.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
