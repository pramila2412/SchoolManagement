const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find().sort({ name: 1 });
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new teacher
router.post('/', async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
