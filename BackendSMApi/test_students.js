require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to DB');
        const students = await Student.find({ class: 'Class 1', section: 'A', status: 'Active' }).sort({ rollNo: 1 });
        console.log('Students:', students);
        process.exit(0);
    } catch(e) {
        console.error("ERROR:", e.message);
        process.exit(1);
    }
}
test();
