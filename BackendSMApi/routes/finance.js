const express = require('express');
const router = express.Router();
const FeeInvoice = require('../models/FeeInvoice');
const FeeCategory = require('../models/FeeCategory');
const FeeStructure = require('../models/FeeStructure');

// Get all fee categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await FeeCategory.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new fee category
router.post('/categories', async (req, res) => {
    try {
        const newCategory = new FeeCategory(req.body);
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all fee invoices
router.get('/invoices', async (req, res) => {
    try {
        const invoices = await FeeInvoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an invoice status
router.put('/invoices/:id', async (req, res) => {
    try {
        const updatedInvoice = await FeeInvoice.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedInvoice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// =======================
// Fee Structures
// =======================

// Get all fee structures
router.get('/fee-structures', async (req, res) => {
    try {
        const structures = await FeeStructure.find().sort({ createdAt: -1 });
        res.json(structures);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new fee structure
router.post('/fee-structures', async (req, res) => {
    try {
        const newStructure = new FeeStructure(req.body);
        const savedStructure = await newStructure.save();
        res.status(201).json(savedStructure);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a fee structure
router.put('/fee-structures/:id', async (req, res) => {
    try {
        const updatedStructure = await FeeStructure.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedStructure);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a fee structure
router.delete('/fee-structures/:id', async (req, res) => {
    try {
        await FeeStructure.findByIdAndDelete(req.params.id);
        res.json({ message: 'Fee structure deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
