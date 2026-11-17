const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

// schoolId is injected by tenantPlugin
module.exports = mongoose.model('Department', DepartmentSchema);
