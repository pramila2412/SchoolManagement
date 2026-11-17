const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const Department = require('../models/Department');

// Get all roles
router.get('/roles', async (req, res) => {
    try {
        const roles = await Role.find().sort({ createdAt: -1 });
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create role
router.post('/roles', async (req, res) => {
    try {
        const newRole = new Role(req.body);
        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete role
router.delete('/roles/:id', async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: 'Role deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all departments
router.get('/departments', async (req, res) => {
    try {
        const departments = await Department.find().sort({ createdAt: -1 });
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create department
router.post('/departments', async (req, res) => {
    try {
        const newDepartment = new Department(req.body);
        const savedDepartment = await newDepartment.save();
        res.status(201).json(savedDepartment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete department
router.delete('/departments/:id', async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ message: 'Department deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
