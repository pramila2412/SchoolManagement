const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const StudentTransport = require('../models/StudentTransport');
const TransportAttendance = require('../models/TransportAttendance');
const TransportFee = require('../models/TransportFee');

// ======================== DASHBOARD ========================
router.get('/dashboard', async (req, res) => {
    try {
        const [vehicles, routes, students, drivers, fees] = await Promise.all([
            Vehicle.countDocuments(),
            Route.countDocuments({ status: 'Active' }),
            StudentTransport.countDocuments({ status: 'Active' }),
            Driver.countDocuments({ status: 'Active' }),
            TransportFee.find(),
        ]);
        const maintenanceCost = await Vehicle.aggregate([
            { $unwind: '$maintenance' },
            { $group: { _id: null, total: { $sum: '$maintenance.cost' } } }
        ]);
        const pendingAssignments = await StudentTransport.countDocuments({ status: 'Inactive' });
        res.json({
            totalVehicles: vehicles,
            activeRoutes: routes,
            studentsUsingTransport: students,
            driversAssigned: drivers,
            maintenanceCost: maintenanceCost[0]?.total || 0,
            pendingAssignments,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ======================== VEHICLES ========================
router.get('/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('assignedRoute assignedDriver').sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/vehicles', async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/vehicles/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('assignedRoute assignedDriver');
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(vehicle);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/vehicles/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(vehicle);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/vehicles/:id', async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vehicle deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/vehicles/:id/maintenance', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        vehicle.maintenance.push(req.body);
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ======================== DRIVERS ========================
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find().populate('assignedVehicle assignedRoute').sort({ createdAt: -1 });
        res.json(drivers);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/drivers', async (req, res) => {
    try {
        const driver = await Driver.create(req.body);
        res.status(201).json(driver);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/drivers/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id).populate('assignedVehicle assignedRoute');
        if (!driver) return res.status(404).json({ error: 'Driver not found' });
        res.json(driver);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/drivers/:id', async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!driver) return res.status(404).json({ error: 'Driver not found' });
        res.json(driver);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/drivers/:id', async (req, res) => {
    try {
        await Driver.findByIdAndDelete(req.params.id);
        res.json({ message: 'Driver deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/drivers/:id/assign', async (req, res) => {
    try {
        const { vehicleId, routeId } = req.body;
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });
        if (driver.licenseExpiry && new Date(driver.licenseExpiry) < new Date()) {
            return res.status(400).json({ error: 'Cannot assign driver with expired license' });
        }
        driver.assignedVehicle = vehicleId;
        driver.assignedRoute = routeId;
        driver.status = 'Active';
        await driver.save();

        if (vehicleId) await Vehicle.findByIdAndUpdate(vehicleId, { assignedDriver: driver._id });
        if (routeId) {
            await Route.findByIdAndUpdate(routeId, { assignedDriver: driver._id });
            if (vehicleId) await Route.findByIdAndUpdate(routeId, { assignedVehicle: vehicleId });
        }
        res.json(driver);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ======================== ROUTES ========================
router.get('/routes', async (req, res) => {
    try {
        const routes = await Route.find().populate('assignedVehicle assignedDriver').sort({ createdAt: -1 });
        res.json(routes);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/routes', async (req, res) => {
    try {
        const route = await Route.create(req.body);
        res.status(201).json(route);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/routes/:id', async (req, res) => {
    try {
        const route = await Route.findById(req.params.id).populate('assignedVehicle assignedDriver');
        if (!route) return res.status(404).json({ error: 'Route not found' });
        const studentCount = await StudentTransport.countDocuments({ route: route._id, status: 'Active' });
        res.json({ ...route.toJSON(), studentCount });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/routes/:id', async (req, res) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!route) return res.status(404).json({ error: 'Route not found' });
        res.json(route);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/routes/:id', async (req, res) => {
    try {
        await Route.findByIdAndDelete(req.params.id);
        res.json({ message: 'Route deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/routes/:id/stops', async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) return res.status(404).json({ error: 'Route not found' });
        route.stops.push(req.body);
        route.stops.sort((a, b) => a.sequence - b.sequence);
        await route.save();
        res.status(201).json(route);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ======================== STUDENT ASSIGNMENT ========================
router.get('/students', async (req, res) => {
    try {
        const { route, status } = req.query;
        const filter = {};
        if (route) filter.route = route;
        if (status) filter.status = status;
        const assignments = await StudentTransport.find(filter).populate('route').sort({ createdAt: -1 });
        res.json(assignments);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/students', async (req, res) => {
    try {
        const assignment = await StudentTransport.create(req.body);
        res.status(201).json(assignment);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/students/bulk', async (req, res) => {
    try {
        const { students, route, stop } = req.body;
        const assignments = students.map(s => ({ ...s, route, stop, status: 'Active' }));
        const result = await StudentTransport.insertMany(assignments);
        res.status(201).json(result);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/students/:id', async (req, res) => {
    try {
        await StudentTransport.findByIdAndUpdate(req.params.id, { status: 'Inactive' });
        res.json({ message: 'Student unassigned from transport' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ======================== ATTENDANCE ========================
router.get('/attendance', async (req, res) => {
    try {
        const { route, date, trip } = req.query;
        const filter = {};
        if (route) filter.route = route;
        if (date) filter.date = new Date(date);
        if (trip) filter.trip = trip;
        const records = await TransportAttendance.find(filter).populate('route').sort({ date: -1 });
        res.json(records);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/attendance', async (req, res) => {
    try {
        const attendance = await TransportAttendance.findOneAndUpdate(
            { route: req.body.route, date: req.body.date, trip: req.body.trip },
            req.body,
            { upsert: true, new: true, runValidators: true }
        );
        res.status(201).json(attendance);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ======================== FEES ========================
router.get('/fees', async (req, res) => {
    try {
        const fees = await TransportFee.find().populate('route').sort({ createdAt: -1 });
        res.json(fees);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/fees', async (req, res) => {
    try {
        const fee = await TransportFee.create(req.body);
        res.status(201).json(fee);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/fees/:id', async (req, res) => {
    try {
        const fee = await TransportFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!fee) return res.status(404).json({ error: 'Fee not found' });
        res.json(fee);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
