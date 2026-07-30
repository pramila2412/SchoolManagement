const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const crypto = require('crypto');

function generatePassword(length = 8) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
}

async function generateParentId() {
    const year = new Date().getFullYear();
    const prefix = `PAR-${year}-`;
    const lastStudent = await Student.findOne({ parentId: new RegExp(`^${prefix}`) })
        .sort({ parentId: -1 });
    
    let seq = 1;
    if (lastStudent && lastStudent.parentId) {
        const lastSeq = parseInt(lastStudent.parentId.split('-')[2], 10);
        if (!isNaN(lastSeq)) seq = lastSeq + 1;
    }
    return `${prefix}${String(seq).padStart(5, '0')}`;
}


// Get all students with optional filters
router.get('/', verifyToken, async (req, res) => {
    try {
        const { class: cls, section, gender, status } = req.query;
        const filter = {};
        if (cls) filter.class = cls;
        if (section) filter.section = section;
        if (gender) filter.gender = gender;
        if (status && status !== 'All') filter.status = status;
        else if (!status) filter.status = { $ne: 'Left' }; // default: hide left students
        const students = await Student.find(filter).sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single student by id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.id });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new student
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const studentData = req.body;
        
        // Auto-generate credentials if not present
        if (!studentData.parentId) {
            studentData.parentId = await generateParentId();
        }
        if (!studentData.parentPassword) {
            studentData.parentPassword = generatePassword();
        }
        if (!studentData.studentPassword) {
            studentData.studentPassword = generatePassword();
        }

        const newStudent = new Student(studentData);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a student
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Soft delete (mark inactive)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            { id: req.params.id },
            { status: 'Inactive' },
            { new: true }
        );
        res.json({ message: 'Student deactivated', student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Hard delete (permanently remove)
router.delete('/:id/hard', verifyToken, isAdmin, async (req, res) => {
    try {
        if (req.user.role !== 'Super Admin') {
            return res.status(403).json({ message: 'Super Admin only' });
        }
        await Student.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Student permanently deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Reset passwords
router.post('/:id/reset-password', async (req, res) => {
    try {
        const { type } = req.body; // 'parent' or 'student'
        const newPassword = generatePassword();
        const update = {};
        
        if (type === 'parent') update.parentPassword = newPassword;
        else if (type === 'student') update.studentPassword = newPassword;
        else return res.status(400).json({ message: 'Invalid password type' });

        const updatedStudent = await Student.findOneAndUpdate(
            { id: req.params.id },
            update,
            { new: true }
        );
        
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Password reset successfully', password: newPassword });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Bulk create students
router.post('/bulk', verifyToken, isAdmin, async (req, res) => {
    try {
        const students = req.body;
        if (!Array.isArray(students)) {
            return res.status(400).json({ message: 'Payload must be an array of students' });
        }
        
        const processedStudents = [];
        
        // Find the starting sequence for Parent ID
        const year = new Date().getFullYear();
        const prefix = `PAR-${year}-`;
        const lastStudent = await Student.findOne({ parentId: new RegExp(`^${prefix}`) })
            .sort({ parentId: -1 });
        
        let seq = 1;
        if (lastStudent && lastStudent.parentId) {
            const lastSeq = parseInt(lastStudent.parentId.split('-')[2], 10);
            if (!isNaN(lastSeq)) seq = lastSeq + 1;
        }
        
        for (const studentData of students) {
            // Auto-generate credentials if not present
            if (!studentData.parentId) {
                studentData.parentId = `${prefix}${String(seq).padStart(5, '0')}`;
                seq++; // Increment for the next student so they are all unique
            }
            if (!studentData.parentPassword) {
                studentData.parentPassword = generatePassword();
            }
            
            if (!studentData.studentPassword) {
                studentData.studentPassword = generatePassword();
            }
            if (!studentData.batch) studentData.batch = new Date().getFullYear().toString();
            if (!studentData.fatherName) studentData.fatherName = 'Unknown';
            if (!studentData.contactNo) studentData.contactNo = 'Unknown';
            if (!studentData.rollNo) studentData.rollNo = 'Pending';
            if (!studentData.admissionNo) studentData.admissionNo = 'Pending';
            processedStudents.push(studentData);

        }

        
        const operations = processedStudents.map(student => ({
            updateOne: {
                filter: { id: student.id },
                update: { $set: student },
                upsert: true
            }
        }));

        const result = await Student.bulkWrite(operations);
        res.status(201).json({ message: `Successfully processed ${operations.length} students (${result.upsertedCount} new, ${result.modifiedCount} updated)` });

    } catch (err) {
        console.error("Bulk Import Error:", err);
        res.status(500).json({ message: err.message || 'Internal server error during bulk import' });
    }
});

module.exports = router;
