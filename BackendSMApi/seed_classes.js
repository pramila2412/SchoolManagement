require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const AcademicClass = require('./models/AcademicClass');

const seedClasses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const classes = [
            'Nursery', 'LKG', 'UKG',
            'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
            'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
            'Class 11', 'Class 12'
        ];
        
        for (const className of classes) {
            const existing = await AcademicClass.findOne({ className });
            if (!existing) {
                const newClass = new AcademicClass({
                    className,
                    sections: [{ label: 'A', capacity: 40 }, { label: 'B', capacity: 40 }]
                });
                await newClass.save();
                console.log(`Added ${className}`);
            } else {
                console.log(`${className} already exists`);
            }
        }
        
        console.log('Class seeding complete');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedClasses();
