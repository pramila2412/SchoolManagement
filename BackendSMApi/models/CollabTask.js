const mongoose = require('mongoose');

const collabTaskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: String,
    assignedTo: [{ name: String, role: String }],
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'CollabGroup' },
    groupName: String,
    attachments: [{ fileName: String, fileUrl: String }],
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Overdue', 'Cancelled'], default: 'Pending' },
    createdBy: { type: String, default: 'Admin' },
}, { timestamps: true });
module.exports = mongoose.model('CollabTask', collabTaskSchema);
