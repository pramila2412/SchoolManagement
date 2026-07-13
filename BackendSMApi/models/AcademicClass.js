const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
    label: { type: String, required: true },
    capacity: { type: Number, default: 40 },
    classTeacher: { type: String } 
});

const AcademicClassSchema = new mongoose.Schema({
    className: { type: String, required: true, unique: true },
    sections: [SectionSchema]
}, { timestamps: true });

module.exports = mongoose.model('AcademicClass', AcademicClassSchema);
