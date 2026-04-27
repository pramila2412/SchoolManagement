require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const studentRoutes = require('./routes/students');
const financeRoutes = require('./routes/finance');
const concessionRoutes = require('./routes/concessions');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const transportRoutes = require('./routes/transport');
const examRoutes = require('./routes/exam');
const collaborateRoutes = require('./routes/collaborate');
const attendanceRoutes = require('./routes/attendance');
const certificateRoutes = require('./routes/certificates');
const tcRoutes = require('./routes/tc');
const frontofficeRoutes = require('./routes/frontoffice');
const aboutRoutes = require('./routes/about');
const admissionPageRoutes = require('./routes/admissionPage');
const curriculumPageRoutes = require('./routes/curriculumPage');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/concessions', concessionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/collaborate', collaborateRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/tc', tcRoutes);
app.use('/api/frontoffice', frontofficeRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/admission-page', admissionPageRoutes);
app.use('/api/curriculum-page', curriculumPageRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------- SERVE FRONTEND IN PRODUCTION ----------
const frontendBuildPath = path.join(__dirname, '..', 'FrontendSM', 'dist');
app.use(express.static(frontendBuildPath));

// All non-API routes → React's index.html (SPA client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.warn('⚠️  MongoDB not available:', err.message);
        console.warn('   Auth will still work. Other features need MongoDB.');
    });
