const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// Get all staff
router.get('/', async (req, res) => {
    try {
        const staffList = await Staff.find().sort({ name: 1 });
        res.json(staffList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new staff member
router.post('/', async (req, res) => {
    try {
        const staff = new Staff(req.body);
        await staff.save();
        res.status(201).json(staff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a staff member
router.put('/:id', async (req, res) => {
    try {
        // Find by custom 'id' field (EMP-2026-001) or MongoDB _id
        let query = req.params.id.startsWith('EMP') ? { id: req.params.id } : { _id: req.params.id };
        
        const updatedStaff = await Staff.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedStaff) return res.status(404).json({ message: 'Staff member not found' });
        res.json(updatedStaff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a staff member
router.delete('/:id', async (req, res) => {
    try {
        let query = req.params.id.startsWith('EMP') ? { id: req.params.id } : { _id: req.params.id };
        const staff = await Staff.findOneAndDelete(query);
        if (!staff) return res.status(404).json({ message: 'Staff member not found' });
        res.json({ message: 'Staff member deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
