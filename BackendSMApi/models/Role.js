const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

// schoolId is injected by tenantPlugin
module.exports = mongoose.model('Role', RoleSchema);
