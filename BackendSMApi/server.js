require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const studentRoutes = require('./routes/students');
const financeRoutes = require('./routes/finance');
const concessionRoutes = require('./routes/concessions');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/concessions', concessionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server first, then try MongoDB
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Connect to MongoDB (non-blocking — server works without it for auth)
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.warn('⚠️  MongoDB not available:', err.message);
        console.warn('   Auth will still work. Other features need MongoDB.');
    });
