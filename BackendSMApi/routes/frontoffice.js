const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const CallLog = require('../models/CallLog');
const Enquiry = require('../models/Enquiry');
const Complaint = require('../models/Complaint');
const PostalItem = require('../models/PostalItem');
const Appointment = require('../models/Appointment');

// ───────── DASHBOARD KPIs ─────────
router.get('/dashboard', async (req, res) => {
    try {
        const today = new Date(); today.setHours(0,0,0,0);
        const [visitors, calls, enquiries, complaints, postalItems, appointments] = await Promise.all([
            Visitor.countDocuments({ checkInTime: { $gte: today } }),
            CallLog.countDocuments({ createdAt: { $gte: today } }),
            Enquiry.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Complaint.countDocuments({ status: { $nin: ['Resolved', 'Closed'] } }),
            PostalItem.countDocuments({ createdAt: { $gte: today } }),
            Appointment.countDocuments({ date: { $gte: today } }),
        ]);
        const enquiryMap = {};
        enquiries.forEach(e => { enquiryMap[e._id] = e.count; });
        res.json({
            visitorsToday: visitors,
            callsToday: calls,
            enquiriesOpen: (enquiryMap['New'] || 0) + (enquiryMap['In Progress'] || 0),
            enquiriesClosed: (enquiryMap['Closed'] || 0) + (enquiryMap['Converted'] || 0),
            complaintsPending: complaints,
            postalToday: postalItems,
            appointmentsUpcoming: appointments,
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ───────── VISITORS ─────────
router.get('/visitors', async (req, res) => {
    try {
        const { date, status, purpose } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (purpose) filter.purpose = purpose;
        if (date) {
            const d = new Date(date); d.setHours(0,0,0,0);
            const next = new Date(d); next.setDate(next.getDate() + 1);
            filter.checkInTime = { $gte: d, $lt: next };
        }
        const visitors = await Visitor.find(filter).sort({ checkInTime: -1 }).limit(200);
        res.json(visitors);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/visitors', async (req, res) => {
    try {
        const visitor = new Visitor(req.body);
        await visitor.save();
        res.status(201).json(visitor);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/visitors/:id/checkout', async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(req.params.id, {
            checkOutTime: new Date(),
            status: 'Checked Out',
        }, { new: true });
        if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
        res.json(visitor);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ───────── CALL LOGS ─────────
router.get('/calls', async (req, res) => {
    try {
        const { status, callType } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (callType) filter.callType = callType;
        const calls = await CallLog.find(filter).sort({ createdAt: -1 }).limit(200);
        res.json(calls);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/calls', async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.followUpRequired && data.followUpDate) data.status = 'Pending Follow-up';
        const call = new CallLog(data);
        await call.save();
        res.status(201).json(call);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/calls/:id/complete', async (req, res) => {
    try {
        const call = await CallLog.findByIdAndUpdate(req.params.id, {
            status: 'Completed',
            completionNotes: req.body.completionNotes || '',
        }, { new: true });
        res.json(call);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ───────── ENQUIRIES ─────────
router.get('/enquiries', async (req, res) => {
    try {
        const { status, enquiryType, source } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (enquiryType) filter.enquiryType = enquiryType;
        if (source) filter.source = source;
        const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).limit(200);
        res.json(enquiries);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/enquiries', async (req, res) => {
    try {
        const enquiry = new Enquiry(req.body);
        await enquiry.save();
        res.status(201).json(enquiry);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/enquiries/:id', async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(enquiry);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/enquiries/:id/convert', async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: 'Converted' }, { new: true });
        res.json(enquiry);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ───────── COMPLAINTS ─────────
router.get('/complaints', async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        const complaints = await Complaint.find(filter).sort({ createdAt: -1 }).limit(200);
        res.json(complaints);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/complaints', async (req, res) => {
    try {
        const complaint = new Complaint(req.body);
        await complaint.save();
        res.status(201).json(complaint);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/complaints/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(complaint);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/complaints/:id/resolve', async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, {
            status: 'Resolved',
            resolutionSummary: req.body.resolutionSummary || '',
        }, { new: true });
        res.json(complaint);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ───────── POSTAL ─────────
router.get('/postal', async (req, res) => {
    try {
        const { direction, parcelType } = req.query;
        const filter = {};
        if (direction) filter.direction = direction;
        if (parcelType) filter.parcelType = parcelType;
        const items = await PostalItem.find(filter).sort({ createdAt: -1 }).limit(200);
        res.json(items);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/postal', async (req, res) => {
    try {
        const item = new PostalItem(req.body);
        if (item.direction === 'Outward') item.status = 'Dispatched';
        await item.save();
        res.status(201).json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/postal/:id', async (req, res) => {
    try {
        const item = await PostalItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ───────── APPOINTMENTS ─────────
router.get('/appointments', async (req, res) => {
    try {
        const { status, staffMember } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (staffMember) filter.staffMember = staffMember;
        const appts = await Appointment.find(filter).sort({ date: -1 }).limit(200);
        res.json(appts);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/appointments', async (req, res) => {
    try {
        const appt = new Appointment(req.body);
        await appt.save();
        res.status(201).json(appt);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/appointments/:id', async (req, res) => {
    try {
        const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(appt);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
