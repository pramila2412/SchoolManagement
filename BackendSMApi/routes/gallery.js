const express = require('express');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');

const DUMMY_IMAGES = [
    { url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80', category: 'Sports', title: 'Basketball Match' },
    { url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=500&q=80', category: 'Sports', title: 'Annual Athletics' },
    { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80', category: 'School Tour', title: 'Campus View' },
    { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80', category: 'School Tour', title: 'Library' },
    { url: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=500&q=80', category: 'Programs and Events', title: 'Science Fair' },
    { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80', category: 'Programs and Events', title: 'Cultural Fest' },
    { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80', category: 'Annual Day', title: 'Dance Performance' },
    { url: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=500&q=80', category: 'Annual Day', title: 'Awards Ceremony' },
    { url: 'https://images.unsplash.com/photo-1577415124269-b911f140e3a3?w=500&q=80', category: 'Meetings', title: 'PTA Meeting' },
    { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&q=80', category: 'Meetings', title: 'Staff Conference' }
];

// GET /api/gallery — Fetch all gallery images
router.get('/', async (req, res) => {
    try {
        let images = await GalleryImage.find().sort({ createdAt: -1 });
        
        // Seed with dummy images if empty
        if (images.length === 0) {
            images = await GalleryImage.insertMany(DUMMY_IMAGES);
        }
        
        res.json(images);
    } catch (err) {
        console.error('Error fetching gallery images:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/gallery — Upload a new gallery image
router.post('/', async (req, res) => {
    try {
        const { url, category, title } = req.body;
        if (!url || !category) {
            return res.status(400).json({ message: 'URL and category are required' });
        }
        
        const newImage = new GalleryImage({ url, category, title });
        await newImage.save();
        res.status(201).json({ message: 'Image added successfully', data: newImage });
    } catch (err) {
        console.error('Error adding gallery image:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// DELETE /api/gallery/:id — Delete a gallery image
router.delete('/:id', async (req, res) => {
    try {
        const deletedImage = await GalleryImage.findByIdAndDelete(req.params.id);
        if (!deletedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json({ message: 'Image deleted successfully', data: deletedImage });
    } catch (err) {
        console.error('Error deleting gallery image:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
