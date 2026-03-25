const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, enum: ['Routine Service', 'Tyre Change', 'Engine Repair', 'Accident Repair', 'Other'], required: true },
    cost: { type: Number, required: true },
    serviceProvider: String,
    notes: String,
}, { timestamps: true });

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ['Bus', 'Mini Bus', 'Van', 'Auto'], required: true },
    capacity: { type: Number, required: true },
    model: String,
    yearOfManufacture: String,
    insuranceProvider: String,
    policyNumber: String,
    insuranceExpiry: Date,
    rcNumber: String,
    registrationExpiry: Date,
    fitnessCertExpiry: Date,
    status: { type: String, enum: ['Active', 'Under Maintenance', 'Inactive'], default: 'Active' },
    assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    maintenance: [maintenanceSchema],
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
