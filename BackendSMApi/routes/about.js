const express = require('express');
const router = express.Router();
const AboutPage = require('../models/AboutPage');

// GET /api/about — Fetch the about page content
router.get('/', async (req, res) => {
    try {
        let about = await AboutPage.findOne();
        if (!about) {
            // Create default document if none exists
            about = await AboutPage.create({});
        }
        res.json(about);
    } catch (err) {
        console.error('Error fetching about page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/about — Update about page content (Super Admin)
router.put('/', async (req, res) => {
    try {
        let about = await AboutPage.findOne();
        if (!about) {
            about = await AboutPage.create(req.body);
        } else {
            Object.assign(about, req.body);
            await about.save();
        }
        res.json({ message: 'About page updated successfully', data: about });
    } catch (err) {
        console.error('Error updating about page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
