const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('./models/Student');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    // find all students
    const students = await Student.find({});
    console.log("Total students:", students.length);
    students.forEach(s => {
        console.log(s.id, s.firstName, s.class, s.section, s.schoolId, s.status);
    });
    process.exit(0);
});
