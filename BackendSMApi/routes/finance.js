const express = require('express');
const router = express.Router();
const FeeInvoice = require('../models/FeeInvoice');

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
