const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student'); // Need this to verify parent login

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';


// Hardcoded admin users for demo
const MOCK_USERS = [
    { email: 'superadmin@mountzion.edu', password: 'admin123', name: 'Super Admin', role: 'Super Admin' },
    { email: 'admin@mountzion.edu', password: 'admin123', name: 'Dr. Sarah (Admin)', role: 'Admin' },
    { email: 'teacher@mountzion.edu', password: 'teacher123', name: 'Rajesh (Teacher)', role: 'Teacher' },
    { email: 'staff@mountzion.edu', password: 'staff123', name: 'Vijay (Staff)', role: 'Staff' },
    { email: 'cms@mountzion.edu', password: 'cms123', name: 'CMS Admin', role: 'CMS Admin' }
];

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        // 1. Check Admin / Staff Login
        const staffUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        if (staffUser) {
            const token = jwt.sign({ id: staffUser.role, role: staffUser.role }, JWT_SECRET, { expiresIn: '30d' });
            return res.json({
                message: 'Login successful',
                token,
                user: {
                    name: staffUser.name,
                    email: staffUser.email,
                    role: staffUser.role
                }
            });
        }

        // 2. Check Parent Login
        // Parents log in with their Parent ID (PAR-2026-...) or email
        const loginStr = email.trim().toLowerCase();
        
        // Find any child belonging to this parent ID/Email
        const child = await Student.findOne({ 
            $or: [
                { parentId: { $regex: new RegExp('^' + loginStr + '$', 'i') } },
                { email: { $regex: new RegExp('^' + loginStr + '$', 'i') } } // Fallback email
            ]
        });

        if (child) {
            // Verify password
            if (child.parentPassword === password || password === 'password123') { // Master password fallback as originally implemented
                
                // Find all children for this parent
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

                const token = jwt.sign({ id: child.parentId, role: 'Parent' }, JWT_SECRET, { expiresIn: '30d' });
                return res.json({
                    message: 'Login successful',
                    token,
                    user: {
                        name: (child.fatherName && child.fatherName !== 'Unknown') ? child.fatherName : 'Parent / Guardian',
                        email: child.email || loginStr,
                        id: child.parentId,
                        role: 'Parent',
                        children: mappedChildren
                    }
                });
            }
        }

        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;