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
const Conversation = require('../models/Conversation');

// ======================== DASHBOARD ========================
router.get('/dashboard', async (req, res) => {
    try {
        const today = new Date(); today.setHours(0,0,0,0);
        const weekAgo = new Date(Date.now() - 7*86400000);
        const [discussions, messages, files, announcements, groups, tasks] = await Promise.all([
            Discussion.countDocuments({ status: 'Open' }),
            Message.countDocuments({ createdAt: { $gte: today } }),
            SharedFile.countDocuments({ createdAt: { $gte: today } }),
            Announcement.countDocuments({ status: 'Published', createdAt: { $gte: weekAgo } }),
            CollabGroup.countDocuments({ status: 'Active' }),
            CollabTask.countDocuments({ status: 'Pending' }),
        ]);
        // Pending replies: conversations with unread messages
        const user = req.query.user || '';
        let pendingReplies = 0;
        if (user) {
            const convs = await Conversation.find({ participants: user });
            convs.forEach(c => { pendingReplies += (c.unreadCounts?.get(user) || 0); });
        }
        res.json({ activeDiscussions: discussions, messagesToday: messages, sharedFilesToday: files, announcementsThisWeek: announcements, activeGroups: groups, pendingTasks: tasks, pendingReplies });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ======================== ACTIVITY FEED ========================
router.get('/activity', async (req, res) => {
    try {
        const [announcements, discussions, files, meetings, tasks, notices] = await Promise.all([
            Announcement.find().sort({ createdAt: -1 }).limit(10).lean(),
            Discussion.find().sort({ createdAt: -1 }).limit(10).lean(),
            SharedFile.find().sort({ createdAt: -1 }).limit(10).lean(),
            Meeting.find().sort({ createdAt: -1 }).limit(10).lean(),
            CollabTask.find().sort({ createdAt: -1 }).limit(10).lean(),
            Notice.find().sort({ createdAt: -1 }).limit(10).lean(),
        ]);

        const stream = [];

        announcements.forEach(a => stream.push({ id: a._id, type: 'Announcement', title: a.title, desc: `Published to ${a.audience}`, time: a.createdAt, iconName: 'Megaphone', color: 'var(--success)' }));
        discussions.forEach(d => stream.push({ id: d._id, type: 'Discussion Post', title: d.title, desc: `New topic by ${d.author}`, time: d.createdAt, iconName: 'MessageSquare', color: 'var(--info)' }));
        files.forEach(f => stream.push({ id: f._id, type: 'File Uploaded', title: f.title || f.fileName, desc: `Shared by ${f.uploadedBy || 'Admin'}`, time: f.createdAt, iconName: 'FileUp', color: 'var(--warning)' }));
        meetings.forEach(m => stream.push({ id: m._id, type: 'Meeting Scheduled', title: m.title, desc: `Scheduled by ${m.organizer}`, time: m.createdAt, iconName: 'Video', color: 'var(--primary)' }));
        tasks.forEach(t => stream.push({ id: t._id, type: 'Task Assigned', title: t.title, desc: `Priority: ${t.priority}`, time: t.createdAt, iconName: 'CheckSquare', color: 'var(--danger)' }));
        notices.forEach(n => stream.push({ id: n._id, type: 'Notice Posted', title: n.title, desc: `Visibility: ${n.visibility}`, time: n.createdAt, iconName: 'Clipboard', color: 'var(--secondary)' }));

        stream.sort((a, b) => new Date(b.time) - new Date(a.time));
        res.json(stream.slice(0, 20));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ======================== ANNOUNCEMENTS ========================
router.get('/announcements', async (req, res) => {
    try {
        const filter = {};
        if (req.query.audience) filter.audience = req.query.audience;
        if (req.query.status) filter.status = req.query.status;
        res.json(await Announcement.find(filter).sort({ createdAt: -1 }));
    } catch (e) { res.status(500).json({ error: e.message }); }
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
    try {
        const filter = {};
        if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
        if (req.query.search) {
            const s = req.query.search;
            filter.$or = [
                { title: { $regex: s, $options: 'i' } },
                { content: { $regex: s, $options: 'i' } },
                { author: { $regex: s, $options: 'i' } },
            ];
        }
        res.json(await Discussion.find(filter).sort({ pinned: -1, createdAt: -1 }));
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/discussions', async (req, res) => {
    try { res.status(201).json(await Discussion.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/discussions/:id', async (req, res) => {
    try {
        const update = { ...req.body };
        if (req.body.content) update.editedAt = new Date();
        res.json(await Discussion.findByIdAndUpdate(req.params.id, update, { new: true }));
    } catch (e) { res.status(400).json({ error: e.message }); }
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
router.delete('/discussions/:id/reply/:replyIdx', async (req, res) => {
    try {
        const d = await Discussion.findById(req.params.id);
        if (!d) return res.status(404).json({ error: 'Not found' });
        const idx = parseInt(req.params.replyIdx);
        if (idx >= 0 && idx < d.replies.length) {
            d.replies.splice(idx, 1);
            await d.save();
        }
        res.json(d);
    } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/discussions/:id/pin', async (req, res) => {
    try { const d = await Discussion.findById(req.params.id); d.pinned = !d.pinned; await d.save(); res.json(d); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/discussions/:id/lock', async (req, res) => {
    try { const d = await Discussion.findById(req.params.id); d.locked = !d.locked; await d.save(); res.json(d); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/discussions/:id/like', async (req, res) => {
    try {
        const d = await Discussion.findById(req.params.id);
        if (!d) return res.status(404).json({ error: 'Not found' });
        const { user, reaction } = req.body;
        const idx = d.likes.findIndex(l => l.user === user);
        if (idx >= 0) {
            if (d.likes[idx].reaction === reaction) d.likes.splice(idx, 1);
            else d.likes[idx].reaction = reaction;
        } else {
            d.likes.push({ user, reaction });
        }
        await d.save();
        res.json(d);
    } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/discussions/:id/reply/:replyIdx/like', async (req, res) => {
    try {
        const d = await Discussion.findById(req.params.id);
        if (!d) return res.status(404).json({ error: 'Not found' });
        const rIdx = parseInt(req.params.replyIdx);
        if (rIdx < 0 || rIdx >= d.replies.length) return res.status(404).json({ error: 'Reply not found' });
        const reply = d.replies[rIdx];
        const { user, reaction } = req.body;
        const idx = reply.likes.findIndex(l => l.user === user);
        if (idx >= 0) {
            if (reply.likes[idx].reaction === reaction) reply.likes.splice(idx, 1);
            else reply.likes[idx].reaction = reaction;
        } else {
            reply.likes.push({ user, reaction });
        }
        await d.save();
        res.json(d);
    } catch (e) { res.status(400).json({ error: e.message }); }
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

// ======================== CONVERSATIONS ========================
router.get('/conversations', async (req, res) => {
    try {
        const { user } = req.query;
        if (!user) return res.status(400).json({ error: 'user query param required' });
        const convs = await Conversation.find({ participants: user }).sort({ 'lastMessage.time': -1, createdAt: -1 });
        res.json(convs);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/conversations', async (req, res) => {
    try {
        // For direct messages, check if conversation already exists
        if (req.body.type === 'direct' && req.body.participants?.length === 2) {
            const existing = await Conversation.findOne({
                type: 'direct',
                participants: { $all: req.body.participants, $size: 2 }
            });
            if (existing) return res.json(existing);
        }
        res.status(201).json(await Conversation.create(req.body));
    } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/conversations/:id', async (req, res) => {
    try { res.json(await Conversation.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.put('/conversations/:id/read', async (req, res) => {
    try {
        const { user } = req.body;
        if (!user) return res.status(400).json({ error: 'user required' });
        const conv = await Conversation.findById(req.params.id);
        if (!conv) return res.status(404).json({ error: 'Not found' });
        conv.unreadCounts.set(user, 0);
        await conv.save();
        // Mark messages as read
        await Message.updateMany(
            { conversationId: conv._id, sender: { $ne: user }, status: { $ne: 'read' } },
            { status: 'read' }
        );
        res.json(conv);
    } catch (e) { res.status(400).json({ error: e.message }); }
});
router.delete('/conversations/:id', async (req, res) => {
    try {
        await Message.deleteMany({ conversationId: req.params.id });
        await Conversation.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================== MESSAGES ========================
router.get('/conversations/:id/messages', async (req, res) => {
    try {
        const msgs = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 });
        res.json(msgs);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/conversations/:id/messages', async (req, res) => {
    try {
        const conv = await Conversation.findById(req.params.id);
        if (!conv) return res.status(404).json({ error: 'Conversation not found' });

        const msg = await Message.create({ ...req.body, conversationId: conv._id });

        // Update conversation lastMessage
        conv.lastMessage = {
            text: req.body.attachment?.name ? `📎 ${req.body.attachment.name}` : req.body.content,
            sender: req.body.sender,
            time: new Date(),
        };
        // Increment unread for all participants except sender
        conv.participants.forEach(p => {
            if (p !== req.body.sender) {
                conv.unreadCounts.set(p, (conv.unreadCounts.get(p) || 0) + 1);
            }
        });
        await conv.save();

        res.status(201).json(msg);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

// ======================== MEETINGS ========================
router.get('/meetings', async (req, res) => {
    try {
        const filter = {};
        if (req.query.status && req.query.status !== 'All') filter.status = req.query.status;
        res.json(await Meeting.find(filter).sort({ date: -1, startTime: -1 }));
    } catch (e) { res.status(500).json({ error: e.message }); }
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
