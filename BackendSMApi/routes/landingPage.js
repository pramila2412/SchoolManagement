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
                facilities: [
                    { title: 'Transport', image: '/Fac-Transport.png' },
                    { title: 'Library', image: '/Fac-Library.png' },
                    { title: 'Hostel', image: '/Fac-Hostel.png' },
                    { title: 'Auditorium', image: '/Fac-Auditorium.png' },
                    { title: 'Play Ground', image: '/Fac-Play.png' },
                    { title: 'Computer Lab', image: '/Fac-computer.png' }
                ],
                gallery: [
                    { title: 'Sports', category: 'Sports', image: '/Gallery1.png' },
                    { title: 'School Tour', category: 'School Tour', image: '/Gallery2.png' },
                    { title: 'Programs & Events', category: 'Programs & Events', image: '/Gallery3.png' },
                    { title: 'Annual Day', category: 'Annual Day', image: '/Gallery5.png' },
                    { title: 'Meetings', category: 'Meetings', image: '/Gallery4.png' }
                ],
                news: ['/news1.png', '/news2.png'],
                achievements: ['/Achievement1.png', '/Achievement2.png', '/Achievement3.png', '/Achievement4.png'],
                header: {
                    phone1: '6296490943',
                    phone2: '6296490943',
                    email: 'mountzionschool2021@gmail.com',
                    socials: {
                        facebook: 'https://www.facebook.com/share/1DYSZWV8DU/',
                        youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos'
                    }
                },
                testimonials: [
                    {
                        text: "Choosing this school was one of the best decisions I've ever made. The teachers are incredibly supportive and my child has grown so much.",
                        author: "Ronald Richards",
                        id: "Parent of Class 5 Student",
                        image: "https://i.pravatar.cc/150?u=ronald"
                    },
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
                    subtext: "The Mount Zion Parent Portal gives you real-time access to your child's academic journey, attendance, fees, and school communications.",
                    features: [
                        "View attendance records & daily reports",
                        "Track academic performance & grades",
                        "Access fee receipts & payment history",
                        "Download circulars & notices",
                        "Communicate with teachers",
                        "View homework & assignments"
                    ]
                },
                about: {
                    title: "Principal's Message.",
                    subtitle: "Welcome to Mount Zion School",
                    message: "<p><strong>Motto: WISDOM AND RIGHTEOUSNESS</strong></p><p>It is with great pride and joy that I welcome you to the official website of Mount Zion School, a place where learning meets values and dreams take flight.</p><p>Our motto, <strong>WISDOM AND RIGHTEOUSNESS</strong>, is the guiding light of every step we take. At Mount Zion, we believe education must enlighten the mind with wisdom and strengthen the character with righteousness. We are committed to nurturing young minds who not only excel academically but also grow into compassionate, responsible citizens.</p><p>Over the years, children in thousands have passed out from Mount Zion and are today serving society from reputed posts in Medical, Teaching, Administration, and Engineering. They are building up the society with integrity and excellence, and they remain our greatest achievement and pride.</p><p>Our dedicated team of teachers works tirelessly to create a safe, inclusive, and stimulating environment where students are encouraged to ask questions, think creatively, and grow into lifelong learners.</p><p>To our parents, thank you for your trust and partnership. Together, we will continue to guide our children toward a future filled with purpose and values.</p><p>I invite you to explore our website and discover the Mount Zion spirit. May our children continue to Arise and Shine.</p><div style='text-align: right; margin-top: 30px;'><strong>Warm regards,</strong><br/><strong>REENA ALBERT</strong><br/>Principal.</div>",
                    image: "/About.png"
                },
                footer: {
                    ctaText: "EMPOWERING EVERY CHILD TO REACH HIGHER.",
                    address: "MOUNT ZION SCHOOL, SION NAGAR, PURNEA - 854301, BIHAR, Office Timing : 7.00 am to 1:30 pm (Summer), 8.30 am to 2.30 pm (winter), Sunday Holiday",
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
            await landing.save();
        }
        res.json({ message: 'Landing page updated successfully', data: landing });
    } catch (err) {
        console.error('Error updating landing page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
