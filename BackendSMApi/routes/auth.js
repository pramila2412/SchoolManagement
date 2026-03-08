const express = require('express');
const router = express.Router();

// Hardcoded admin user for demo
const ADMIN_USER = {
    email: 'admin@mountzion.edu',
    password: 'admin123',
    name: 'Admin',
    role: 'Super Admin'
};

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
        return res.json({
            message: 'Login successful',
            user: {
                name: ADMIN_USER.name,
                email: ADMIN_USER.email,
                role: ADMIN_USER.role
            }
        });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
});

module.exports = router;
