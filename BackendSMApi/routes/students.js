const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students with optional filters
router.get('/', async (req, res) => {
    try {
        const { class: cls, section, gender, status } = req.query;
        const filter = {};
        if (cls) filter.class = cls;
        if (section) filter.section = section;
        if (gender) filter.gender = gender;
        if (status) filter.status = status;
        else filter.status = { $ne: 'Left' }; // default: hide left students
        const students = await Student.find(filter).sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single student by id
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.id });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new student
router.post('/', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a student
router.put('/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Soft delete (mark inactive)
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            { id: req.params.id },
            { status: 'Inactive' },
            { new: true }
        );
        res.json({ message: 'Student deactivated', student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
