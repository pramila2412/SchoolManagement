const express = require('express');
const router = express.Router();
const School = require('../models/School');


// Platform Admin Only Middleware
const isPlatformAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Platform Admin') {
        return res.status(403).json({ message: 'Require Platform Admin Role!' });
    }
    next();
};

// Get all schools
router.get('/', isPlatformAdmin, async (req, res) => {
    try {
        const schools = await School.find().sort({ createdAt: -1 });
        res.json(schools);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new school
router.post('/', isPlatformAdmin, async (req, res) => {
    try {
        const { schoolCode, name, address, phone, email, status } = req.body;
        if (!schoolCode || !name) return res.status(400).json({ message: 'School code and name required' });
        
        const existing = await School.findOne({ schoolCode: schoolCode.toUpperCase() });
        if (existing) return res.status(400).json({ message: 'School code already exists' });

        const school = new School({
            schoolCode: schoolCode.toUpperCase(),
            name, address, phone, email, status: status || 'Active'
        });
        await school.save();
        res.status(201).json(school);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Edit school
router.put('/:id', isPlatformAdmin, async (req, res) => {
    try {
        const { schoolCode, name, address, phone, email, status } = req.body;
        const school = await School.findById(req.params.id);
        if (!school) return res.status(404).json({ message: 'School not found' });

        if (schoolCode) school.schoolCode = schoolCode.toUpperCase();
        if (name) school.name = name;
        if (address !== undefined) school.address = address;
        if (phone !== undefined) school.phone = phone;
        if (email !== undefined) school.email = email;
        if (status) school.status = status;

        await school.save();
        res.json(school);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete school
router.delete('/:id', isPlatformAdmin, async (req, res) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);
        if (!school) return res.status(404).json({ message: 'School not found' });
        res.json({ message: 'School deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
