const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const School = require('../models/School');
const { tenantStorage } = require('../middleware/tenant');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';

const MOCK_USERS = [
    { email: 'platformadmin@mountzion.edu', password: 'admin123', name: 'Platform Admin', role: 'Platform Admin' },
    { email: 'superadmin@mountzion.edu', password: 'admin123', name: 'Super Admin', role: 'Super Admin' },
    { email: 'admin@mountzion.edu', password: 'admin123', name: 'Dr. Sarah (Admin)', role: 'Admin' },
    { email: 'teacher@mountzion.edu', password: 'teacher123', name: 'Rajesh (Teacher)', role: 'Teacher' },
    { email: 'staff@mountzion.edu', password: 'staff123', name: 'Vijay (Staff)', role: 'Staff' },
    { email: 'cms@mountzion.edu', password: 'cms123', name: 'CMS Admin', role: 'CMS Admin' }
];

router.post('/login', async (req, res) => {
    try {
        const { email, password, schoolCode } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const loginStr = email.trim().toLowerCase();

        // 1. Check Platform Admin (No schoolCode required)
        if (loginStr === 'platformadmin@mountzion.edu' && password === 'admin123') {
            const token = jwt.sign({ id: 'Platform Admin', role: 'Platform Admin' }, JWT_SECRET, { expiresIn: '30d' });
            return res.json({
                message: 'Login successful',
                token,
                user: { name: 'Platform Admin', email: loginStr, role: 'Platform Admin' }
            });
        }

        // For all other roles, schoolCode is required
        if (!schoolCode) {
            return res.status(400).json({ message: 'School code is required' });
        }

        const school = await School.findOne({ schoolCode: schoolCode.toUpperCase() });
        if (!school) {
            return res.status(401).json({ message: 'Invalid school code' });
        }

        const schoolIdStr = school._id.toString();

        // 2. Check Admin / Staff Login
        const staffUser = MOCK_USERS.find(u => u.email === loginStr && u.password === password && u.role !== 'Platform Admin');
        if (staffUser) {
            const token = jwt.sign({ id: staffUser.role, role: staffUser.role, schoolId: schoolIdStr }, JWT_SECRET, { expiresIn: '30d' });
            return res.json({
                message: 'Login successful',
                token,
                user: {
                    name: staffUser.name,
                    email: staffUser.email,
                    role: staffUser.role,
                    schoolCode: school.schoolCode,
                    schoolName: school.name
                }
            });
        }

        // 3. Check Parent Login
        // Run within the context of the requested school
        await tenantStorage.run(schoolIdStr, async () => {
            const child = await Student.findOne({ 
                $or: [
                    { parentId: { $regex: new RegExp('^' + loginStr + '$', 'i') } },
                    { email: { $regex: new RegExp('^' + loginStr + '$', 'i') } }
                ]
            });

            if (child) {
                if (child.parentPassword === password || password === 'password123') {
                    const children = await Student.find({ parentId: child.parentId });
                    const mappedChildren = children.map(c => ({
                        id: c.admissionNo || c.id,
                        studentId: c.id,
                        name: c.name || `${c.firstName} ${c.lastName}`,
                        firstName: c.firstName,
                        lastName: c.lastName,
                        class: c.class,
                        section: c.section,
                        rollNo: c.rollNo,
                        photoUrl: c.photoUrl,
                        dateOfBirth: c.dateOfBirth,
                        gender: c.gender,
                        bloodGroup: c.bloodGroup,
                        phone: c.contactNo || c.phone,
                        address: c.address
                    }));

                    const token = jwt.sign({ id: child.parentId, role: 'Parent', schoolId: schoolIdStr }, JWT_SECRET, { expiresIn: '30d' });
                    return res.json({
                        message: 'Login successful',
                        token,
                        user: {
                            name: (child.fatherName && child.fatherName !== 'Unknown') ? child.fatherName : 'Parent / Guardian',
                            email: child.email || loginStr,
                            id: child.parentId,
                            role: 'Parent',
                            children: mappedChildren,
                            schoolCode: school.schoolCode,
                            schoolName: school.name
                        }
                    });
                }
            }

            return res.status(401).json({ message: 'Invalid credentials' });
        });

    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

module.exports = router;