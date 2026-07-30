const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_12345', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized! Token expired or invalid.' });
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== 'Super Admin' && req.user.role !== 'Admin' && req.user.role !== 'HR')) {
        return res.status(403).json({ message: 'Require Admin Role!' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };