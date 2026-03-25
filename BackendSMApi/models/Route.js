const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pickupTime: String,
    dropTime: String,
    sequence: { type: Number, required: true },
    latitude: Number,
    longitude: Number,
});

const routeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    startPoint: { type: String, required: true },
    endPoint: { type: String, required: true },
    direction: { type: String, enum: ['Morning', 'Afternoon', 'Both'], default: 'Both' },
    status: { type: String, enum: ['Active', 'Suspended', 'Draft'], default: 'Draft' },
    stops: [stopSchema],
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
