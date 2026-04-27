const express = require('express');
const router = express.Router();
const ContactPage = require('../models/ContactPage');
const ContactInquiry = require('../models/ContactInquiry');

// GET /api/contact/page — Fetch contact page content
router.get('/page', async (req, res) => {
    try {
        let contactDetails = await ContactPage.findOne();
        if (!contactDetails) {
            contactDetails = await ContactPage.create({});
        }
        res.json(contactDetails);
    } catch (err) {
        console.error('Error fetching contact page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/contact/page — Update contact page content (Super Admin)
router.put('/page', async (req, res) => {
    try {
        let contactDetails = await ContactPage.findOne();
        if (!contactDetails) {
            contactDetails = await ContactPage.create(req.body);
        } else {
            Object.assign(contactDetails, req.body);
            await contactDetails.save();
        }
        res.json({ message: 'Contact page updated successfully', data: contactDetails });
    } catch (err) {
        console.error('Error updating contact page:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/contact/inquire — Submit a contact form inquiry
router.post('/inquire', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }
        
        const newInquiry = new ContactInquiry({ name, email, phone, message });
        await newInquiry.save();
        
        res.status(201).json({ message: 'Your message has been sent successfully. We will get back to you soon!', data: newInquiry });
    } catch (err) {
        console.error('Error submitting inquiry:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/contact/inquiries — Fetch all inquiries (Super Admin)
router.get('/inquiries', async (req, res) => {
    try {
        const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        console.error('Error fetching inquiries:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
