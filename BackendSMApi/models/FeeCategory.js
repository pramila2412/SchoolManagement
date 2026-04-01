const mongoose = require('mongoose');

const feeCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    frequency: { type: String, required: true },
    classes: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('FeeCategory', feeCategorySchema);
