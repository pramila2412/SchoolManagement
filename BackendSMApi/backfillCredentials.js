const mongoose = require('mongoose');
const crypto = require('crypto');
const Student = require('./models/Student');
require('dotenv').config();

function generatePassword(length = 8) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB. Finding students without parentId...");
        
        const studentsWithoutId = await Student.find({ $or: [{ parentId: { $exists: false } }, { parentId: null }, { parentId: '' }] });
        
        console.log(`Found ${studentsWithoutId.length} students missing credentials.`);
        
        if (studentsWithoutId.length === 0) {
            console.log("All students have credentials!");
            process.exit(0);
        }

        const year = new Date().getFullYear();
        const prefix = `PAR-${year}-`;
        const lastStudent = await Student.findOne({ parentId: new RegExp(`^${prefix}`) })
            .sort({ parentId: -1 });
        
        let seq = 1;
        if (lastStudent && lastStudent.parentId) {
            const lastSeq = parseInt(lastStudent.parentId.split('-')[2], 10);
            if (!isNaN(lastSeq)) seq = lastSeq + 1;
        }

        for (const student of studentsWithoutId) {
            student.parentId = `${prefix}${String(seq).padStart(5, '0')}`;
            student.parentPassword = generatePassword();
            student.studentPassword = generatePassword();
            seq++;
            
            await student.save();
        }
        
        console.log(`Successfully generated and assigned credentials to ${studentsWithoutId.length} students!`);
        process.exit(0);
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    });
