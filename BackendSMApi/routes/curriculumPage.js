const express = require('express');
const router = express.Router();
const CurriculumPage = require('../models/CurriculumPage');

// GET /api/curriculum-page — Fetch curriculum page content
router.get('/', async (req, res) => {
    try {
        let curriculum = await CurriculumPage.findOne();
        if (!curriculum) {
            curriculum = await CurriculumPage.create({});
        }
        res.json(curriculum);
    } catch (err) {
        console.error('Error fetching curriculum page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/curriculum-page — Update curriculum page content (Super Admin)
router.put('/', async (req, res) => {
    try {
        let curriculum = await CurriculumPage.findOne();
        if (!curriculum) {
            curriculum = await CurriculumPage.create(req.body);
        } else {
            Object.assign(curriculum, req.body);
            await curriculum.save();
        }
        res.json({ message: 'Curriculum page updated successfully', data: curriculum });
    } catch (err) {
        console.error('Error updating curriculum page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
