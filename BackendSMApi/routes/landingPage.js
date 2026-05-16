const express = require('express');
const router = express.Router();
const LandingPage = require('../models/LandingPage');

// GET /api/landing-page — Fetch landing page content
router.get('/', async (req, res) => {
    try {
        let landing = await LandingPage.findOne();
        if (!landing) {
            // Create default entry if none exists
            landing = await LandingPage.create({
                header: {
                    phone: '6296490943',
                    email: 'mountzionschool2021@gmail.com',
                    socials: {
                        facebook: 'https://www.facebook.com/share/1DYSZWV8DU/',
                        youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos',
                        instagram: 'https://instagram.com',
                        whatsapp: 'https://wa.me/916296490943'
                    }
                },
                hero: {
                    title: 'A Global Campus for Global Students',
                    subtitle: 'With a faculty from over 100 countries, we foster a vibrant, inclusive community that is globally connected.',
                    cta: "Apply / Admitted? Let's make it official!",
                    image: '/mount school.jpeg'
                },
                announcements: {
                    ticker: [
                        'Admission Open for Session 2025-26',
                        'Mount Zion School Ranked #1 in Purnea',
                        'New Sports Complex Inaugurated'
                    ]
                },
                facilities: [
                    { title: 'Smart Classrooms', image: '/Facility1.png' },
                    { title: 'Science Labs', image: '/Facility2.png' },
                    { title: 'Sports Complex', image: '/Facility3.png' },
                    { title: 'Library', image: '/Facility4.png' }
                ],
                gallery: [
                    { title: 'Annual Day 2024', category: 'Events', image: '/Gallery1.png' },
                    { title: 'Sports Meet', category: 'Sports', image: '/Gallery2.png' },
                    { title: 'Science Exhibition', category: 'Academic', image: '/Gallery3.png' },
                    { title: 'Campus View', category: 'Campus', image: '/Gallery4.png' }
                ],
                news: [
                    'Registration Open for 2025-26',
                    'Summer Vacation starts from June 1st'
                ],
                achievements: [
                    'Best School Award 2023',
                    'District Sports Championship'
                ],
                testimonials: [
                    {
                        text: "The academic curriculum is rigorous but balanced perfectly with sports and extracurricular activities. We couldn't be happier with Mount Zion.",
                        author: "Sarah Jenkins",
                        id: "Parent of Class 8 Student",
                        image: "https://i.pravatar.cc/150?u=sarah"
                    },
                    {
                        text: "The dedication of the staff here is unmatched. They genuinely care about each student's personal and academic development.",
                        author: "Michael Chen",
                        id: "Parent of Class 10 Student",
                        image: "https://i.pravatar.cc/150?u=michael"
                    }
                ],
                connect: {
                    title: "Stay Connected with",
                    goldText: "Your Child's Progress",
                    subtext: "The Mount Zion Parent Portal gives you real-time access to your child's academic journey.",
                    features: [
                        "View attendance records",
                        "Track academic performance",
                        "Access fee receipts"
                    ]
                },
                about: {
                    title: "Principal's Message.",
                    subtitle: "Welcome to Mount Zion School",
                    message: "<p>Mount Zion School is committed to providing quality education...</p>",
                    image: "/About.jpeg"
                },
                footer: {
                    ctaText: "EMPOWERING EVERY CHILD TO REACH HIGHER.",
                    address: "MOUNT ZION SCHOOL, SION NAGAR, PURNEA - 854301, BIHAR",
                    copyright: "Copyright © 2025 Mount Zion School, Inc. All rights reserved."
                }
            });
        }
        res.json(landing);
    } catch (err) {
        console.error('Error fetching landing page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/landing-page — Update landing page content (Super Admin)
router.put('/', async (req, res) => {
    try {
        let landing = await LandingPage.findOne();
        if (!landing) {
            landing = await LandingPage.create(req.body);
        } else {
            Object.assign(landing, req.body);
            // Explicitly mark nested array fields as modified so Mongoose saves them
            if (req.body.videoGallery) landing.markModified('videoGallery');
            if (req.body.certificates) landing.markModified('certificates');
            if (req.body.testimonials) landing.markModified('testimonials');
            if (req.body.facilities) landing.markModified('facilities');
            if (req.body.gallery) landing.markModified('gallery');
            await landing.save();
        }
        res.json({ message: 'Landing page updated successfully', data: landing });
    } catch (err) {
        console.error('Error updating landing page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
