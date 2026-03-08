const express = require('express');
const router = express.Router();
const ConcessionType = require('../models/ConcessionType');

// Get all concession types
router.get('/', async (req, res) => {
    try {
        const concessions = await ConcessionType.find().sort({ createdAt: -1 });
        res.json(concessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new concession type
router.post('/', async (req, res) => {
    try {
        const newConcession = new ConcessionType(req.body);
        const savedConcession = await newConcession.save();
        res.status(201).json(savedConcession);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a concession type
router.delete('/:id', async (req, res) => {
    try {
        await ConcessionType.findByIdAndDelete(req.params.id);
        res.json({ message: 'Concession deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
