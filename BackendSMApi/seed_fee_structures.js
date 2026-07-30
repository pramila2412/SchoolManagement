require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const FeeStructure = require('./models/FeeStructure');

const feeByClassData = [
    { classGroup: 'Nursery', classes: ['Nursery'], data: { admissionFee: 3000, annualFee: 2000, examFee: 2000, monthlyFee: 1500 } },
    { classGroup: 'LKG', classes: ['LKG'], data: { admissionFee: 3000, annualFee: 2000, examFee: 2000, monthlyFee: 1500 } },
    { classGroup: 'UKG', classes: ['UKG'], data: { admissionFee: 3000, annualFee: 2000, examFee: 2000, monthlyFee: 1500 } },
    { classGroup: 'Class 1', classes: ['Class 1'], data: { admissionFee: 4000, annualFee: 3000, examFee: 2000, monthlyFee: 2000 } },
    { classGroup: 'Class 2', classes: ['Class 2'], data: { admissionFee: 4000, annualFee: 3000, examFee: 2000, monthlyFee: 2000 } },
    { classGroup: 'Class 3', classes: ['Class 3'], data: { admissionFee: 4000, annualFee: 3000, examFee: 2000, monthlyFee: 2400 } },
    { classGroup: 'Class 4', classes: ['Class 4'], data: { admissionFee: 4000, annualFee: 3000, examFee: 2000, monthlyFee: 2400 } },
    { classGroup: 'Class 5', classes: ['Class 5'], data: { admissionFee: 7500, annualFee: 7950, examFee: 3050, monthlyFee: 2700 } },
    { classGroup: 'Class 6', classes: ['Class 6'], data: { admissionFee: 7500, annualFee: 7950, examFee: 3050, monthlyFee: 2700 } },
    { classGroup: 'Class 7', classes: ['Class 7'], data: { admissionFee: 7500, annualFee: 7950, examFee: 3050, monthlyFee: 2700 } },
    { classGroup: 'Class 8', classes: ['Class 8'], data: { admissionFee: 7500, annualFee: 7950, examFee: 3650, monthlyFee: 3300 } },
    { classGroup: 'Class 9', classes: ['Class 9'], data: { admissionFee: 8000, annualFee: 9150, examFee: 4250, monthlyFee: 3300 } },
    { classGroup: 'Class 10', classes: ['Class 10'], data: { admissionFee: 8000, annualFee: 9150, examFee: 4250, monthlyFee: 3300 } },
    { classGroup: 'Class 11', classes: ['Class 11'], data: { admissionFee: 0, annualFee: 8550, examFee: 4000, monthlyFee: 3300 } },
    { classGroup: 'Class 12', classes: ['Class 12'], data: { admissionFee: 0, annualFee: 8550, examFee: 4000, monthlyFee: 3300 } }
];

const seedFeeStructures = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        for (const item of feeByClassData) {
            const fees = [
                { name: 'Admission Fee', amount: item.data.admissionFee },
                { name: 'Annual Fee', amount: item.data.annualFee },
                { name: 'Examination Fee', amount: item.data.examFee },
                { name: 'Monthly Fee', amount: item.data.monthlyFee }
            ];
            
            const total = item.data.admissionFee + item.data.annualFee + item.data.examFee + item.data.monthlyFee;
            
            // Check if already exists for this class
            const existing = await FeeStructure.findOne({ classGroup: item.classGroup });
            if (!existing) {
                const newStructure = new FeeStructure({
                    classGroup: item.classGroup,
                    classes: item.classes,
                    fees: fees,
                    total: total
                });
                await newStructure.save();
                console.log(`Added fee structure for ${item.classGroup}`);
            } else {
                console.log(`Fee structure for ${item.classGroup} already exists`);
            }
        }
        
        console.log('Fee structure seeding complete');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedFeeStructures();
