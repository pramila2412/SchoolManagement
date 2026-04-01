const express = require('express');
const router = express.Router();
const FeeInvoice = require('../models/FeeInvoice');
const FeeCategory = require('../models/FeeCategory');

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

module.exports = router;
