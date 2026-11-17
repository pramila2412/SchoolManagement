require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tenantPlugin = require('./models/plugins/tenantPlugin');
mongoose.plugin(tenantPlugin);

const path = require('path');
const { verifyToken } = require('./middleware/authMiddleware');

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
const landingPageRoutes = require('./routes/landingPage');
const uploadRoutes = require('./routes/upload');
const admissionRoutes = require('./routes/admission');
const academicsRoutes = require('./routes/academics');
const teacherRoutes = require('./routes/teachers');
const staffRoutes = require('./routes/staff');
const schoolsRoutes = require('./routes/schools');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

const hrSettingsRoutes = require('./routes/hrSettings');

// --- PUBLIC ROUTES (No Token Required) ---
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/admission-page', admissionPageRoutes);
app.use('/api/curriculum-page', curriculumPageRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/landing-page', landingPageRoutes);
app.use('/api/admission', admissionRoutes);

// --- PROTECTED ROUTES (Requires Token & Tenant Filtering) ---
app.use('/api/students', verifyToken, studentRoutes);
app.use('/api/finance', verifyToken, financeRoutes);
app.use('/api/concessions', verifyToken, concessionRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);
app.use('/api/transport', verifyToken, transportRoutes);
app.use('/api/exam', verifyToken, examRoutes);
app.use('/api/collaborate', verifyToken, collaborateRoutes);
app.use('/api/attendance', verifyToken, attendanceRoutes);
app.use('/api/certificates', verifyToken, certificateRoutes);
app.use('/api/tc', verifyToken, tcRoutes);
app.use('/api/frontoffice', verifyToken, frontofficeRoutes);
app.use('/api/upload', verifyToken, uploadRoutes);
app.use('/api/academics', verifyToken, academicsRoutes);
app.use('/api/teachers', verifyToken, teacherRoutes);
app.use('/api/staff', verifyToken, staffRoutes);
app.use('/api/schools', verifyToken, schoolsRoutes);
app.use('/api/hr-settings', verifyToken, hrSettingsRoutes);

// Serve public uploads directory
const frontendPublicPath = path.join(__dirname, '..', 'FrontendSM', 'public');
app.use(express.static(frontendPublicPath));

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
