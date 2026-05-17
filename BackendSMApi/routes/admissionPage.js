const express = require('express');
const router = express.Router();
const AdmissionPage = require('../models/AdmissionPage');

// GET /api/admission-page — Fetch admission page content
router.get('/', async (req, res) => {
    try {
        let admission = await AdmissionPage.findOne();
        if (!admission) {
            admission = await AdmissionPage.create({});
        }
        res.json(admission);
    } catch (err) {
        console.error('Error fetching admission page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/admission-page — Update admission page content (Super Admin)
router.put('/', async (req, res) => {
    try {
        let admission = await AdmissionPage.findOne();
        if (!admission) {
            admission = await AdmissionPage.create(req.body);
        } else {
            const updateData = { ...req.body };
            delete updateData._id;
            delete updateData.__v;
            admission.set(updateData);
            if (req.body.admissionProcedure) admission.markModified('admissionProcedure');
            if (req.body.admissionCriteria) admission.markModified('admissionCriteria');
            if (req.body.requiredDocuments) admission.markModified('requiredDocuments');
            if (req.body.admissionContact) admission.markModified('admissionContact');
            if (req.body.classesOffered) admission.markModified('classesOffered');
            await admission.save();
        }
        res.json({ message: 'Admission page updated successfully', data: admission });
    } catch (err) {
        console.error('Error updating admission page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
