const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI);
const Staff = require('./models/Staff');
Staff.find({}).then(staffs => {
    console.log("Total staff:", staffs.length);
    staffs.forEach(s => console.log(s.id, s.schoolId, s.name));
    process.exit(0);
});
