const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Discussion = require('../models/Discussion');
const CollabGroup = require('../models/CollabGroup');
const SharedFile = require('../models/SharedFile');
const Message = require('../models/Message');
const Meeting = require('../models/Meeting');
const CollabTask = require('../models/CollabTask');
const Notice = require('../models/Notice');

// ======================== DASHBOARD ========================
router.get('/dashboard', async (req, res) => {
    try {
        const today = new Date(); today.setHours(0,0,0,0);
        const [discussions, messages, files, announcements, groups, tasks] = await Promise.all([
            Discussion.countDocuments({ status: 'Open' }),
            Message.countDocuments({ createdAt: { $gte: today } }),
            SharedFile.countDocuments({ createdAt: { $gte: today } }),
            Announcement.countDocuments({ status: 'Published', createdAt: { $gte: new Date(Date.now() - 7*86400000) } }),
            CollabGroup.countDocuments({ status: 'Active' }),
            CollabTask.countDocuments({ status: 'Pending' }),
        ]);
        res.json({ activeDiscussions: discussions, messagesToday: messages, sharedFilesToday: files, announcementsThisWeek: announcements, activeGroups: groups, pendingTasks: tasks });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ======================== ANNOUNCEMENTS ========================
router.get('/announcements', async (req, res) => {
    try { res.json(await Announcement.find().sort({ createdAt: -1 })); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/announcements', async (req, res) => {
    try { res.status(201).json(await Announcement.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/announcements/:id', async (req, res) => {
    try { res.json(await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.delete('/announcements/:id', async (req, res) => {
    try { await Announcement.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================== DISCUSSIONS ========================
router.get('/discussions', async (req, res) => {
    try { res.json(await Discussion.find().sort({ pinned: -1, createdAt: -1 })); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/discussions', async (req, res) => {
    try { res.status(201).json(await Discussion.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/discussions/:id/reply', async (req, res) => {
    try {
        const d = await Discussion.findById(req.params.id);
        if (!d) return res.status(404).json({ error: 'Not found' });
        if (d.locked) return res.status(403).json({ error: 'Thread is locked' });
        d.replies.push(req.body);
        await d.save();
        res.json(d);
    } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/discussions/:id/pin', async (req, res) => {
    try { const d = await Discussion.findById(req.params.id); d.pinned = !d.pinned; await d.save(); res.json(d); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/discussions/:id/lock', async (req, res) => {
    try { const d = await Discussion.findById(req.params.id); d.locked = !d.locked; await d.save(); res.json(d); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.delete('/discussions/:id', async (req, res) => {
    try { await Discussion.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================== GROUPS ========================
router.get('/groups', async (req, res) => {
    try { res.json(await CollabGroup.find().sort({ createdAt: -1 })); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/groups', async (req, res) => {
    try { res.status(201).json(await CollabGroup.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/groups/:id', async (req, res) => {
    try { res.json(await CollabGroup.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.delete('/groups/:id', async (req, res) => {
    try { await CollabGroup.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================== FILES ========================
router.get('/files', async (req, res) => {
    try { res.json(await SharedFile.find().sort({ createdAt: -1 })); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/files', async (req, res) => {
    try { res.status(201).json(await SharedFile.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.delete('/files/:id', async (req, res) => {
    try { await SharedFile.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================== MESSAGES ========================
router.get('/messages', async (req, res) => {
    try {
        const { sender, recipient, groupId } = req.query;
        const filter = {};
        if (sender) filter.sender = sender;
        if (recipient) filter.recipient = recipient;
        if (groupId) filter.groupId = groupId;
        res.json(await Message.find(filter).sort({ createdAt: -1 }).limit(100));
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/messages', async (req, res) => {
    try { res.status(201).json(await Message.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});

// ======================== MEETINGS ========================
router.get('/meetings', async (req, res) => {
    try { res.json(await Meeting.find().sort({ date: -1 })); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/meetings', async (req, res) => {
    try { res.status(201).json(await Meeting.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/meetings/:id', async (req, res) => {
    try { res.json(await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.delete('/meetings/:id', async (req, res) => {
    try { await Meeting.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================== TASKS ========================
router.get('/tasks', async (req, res) => {
    try { res.json(await CollabTask.find().sort({ dueDate: 1 })); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/tasks', async (req, res) => {
    try { res.status(201).json(await CollabTask.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/tasks/:id', async (req, res) => {
    try { res.json(await CollabTask.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.delete('/tasks/:id', async (req, res) => {
    try { await CollabTask.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================== NOTICES ========================
router.get('/notices', async (req, res) => {
    try {
        // Auto-expire old notices
        await Notice.updateMany({ expiryDate: { $lt: new Date() }, status: 'Active' }, { status: 'Expired' });
        res.json(await Notice.find().sort({ pinned: -1, effectiveDate: -1 }));
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/notices', async (req, res) => {
    try { res.status(201).json(await Notice.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/notices/:id/pin', async (req, res) => {
    try { const n = await Notice.findById(req.params.id); n.pinned = !n.pinned; await n.save(); res.json(n); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.delete('/notices/:id', async (req, res) => {
    try { await Notice.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
