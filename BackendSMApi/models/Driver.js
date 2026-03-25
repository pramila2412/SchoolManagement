const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licenseCategory: { type: String, enum: ['LMV', 'HMV', 'PSV'], required: true },
    licenseExpiry: { type: Date, required: true },
    dob: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: String,
    status: { type: String, enum: ['Active', 'On Leave', 'Unassigned', 'Inactive'], default: 'Unassigned' },
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
}, { timestamps: true });

driverSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

driverSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Driver', driverSchema);
