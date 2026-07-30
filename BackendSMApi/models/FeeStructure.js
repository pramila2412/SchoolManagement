const mongoose = require('mongoose');

const FeeComponentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true }
});

const FeeStructureSchema = new mongoose.Schema({
    classGroup: { type: String },
    classes: [{ type: String }],
    fees: [FeeComponentSchema],
    total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FeeStructure', FeeStructureSchema);
