const mongoose = require('mongoose');

const feeInvoiceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentName: { type: String }, // denormalized for easy table rendering
    class: { type: String },
    invoiceNo: { type: String, required: true, unique: true },
    dueDate: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['due', 'overdue', 'paid'], default: 'due' }
}, { timestamps: true });

module.exports = mongoose.model('FeeInvoice', feeInvoiceSchema);
