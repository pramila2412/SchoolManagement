const express = require('express');
const router = express.Router();
const AdmissionApplication = require('../models/AdmissionApplication');

// POST: Submit a new application
router.post('/apply', async (req, res) => {
    try {
        const newApplication = new AdmissionApplication(req.body);
        const savedApp = await newApplication.save();
        res.status(201).json(savedApp);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Fetch all applications
router.get('/applications', async (req, res) => {
    try {
        const applications = await AdmissionApplication.find().sort({ appliedDate: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: Update status (Approve/Reject)
router.put('/applications/:id/status', async (req, res) => {
    try {
        const { status, rejectReason, internalRemarks } = req.body;
        const app = await AdmissionApplication.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        if (status) app.status = status;
        if (rejectReason !== undefined) app.rejectReason = rejectReason;
        if (internalRemarks !== undefined) app.internalRemarks = internalRemarks;
        
        const updatedApp = await app.save();
        res.json(updatedApp);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Update document verification status
router.put('/applications/:id/documents', async (req, res) => {
    try {
        const { documents } = req.body;
        const app = await AdmissionApplication.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        app.documents = documents;
        
        const updatedApp = await app.save();
        res.json(updatedApp);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
