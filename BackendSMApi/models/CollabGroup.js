const mongoose = require('mongoose');

const collabGroupSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: String,
    type: { type: String, enum: ['Class Group', 'Department Group', 'Project Group', 'Event Group', 'Parent-Teacher Group', 'Custom'], default: 'Custom' },
    members: [{ name: String, role: { type: String, enum: ['Admin', 'Teacher', 'Student', 'Parent'], default: 'Student' } }],
    groupAdmin: [String],
    visibility: { type: String, enum: ['Open', 'Closed'], default: 'Closed' },
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' },
    createdBy: { type: String, default: 'Admin' },
}, { timestamps: true });
module.exports = mongoose.model('CollabGroup', collabGroupSchema);
