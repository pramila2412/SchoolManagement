require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const FeeInvoice = require('./models/FeeInvoice');
const ConcessionType = require('./models/ConcessionType');

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        // Clear existing data
        await Student.deleteMany({});
        await FeeInvoice.deleteMany({});
        await ConcessionType.deleteMany({});
        console.log('Existing data cleared.');

        // Seed Students
        const students = await Student.insertMany([
            {
                id: 'STU001', firstName: 'Aarav', lastName: 'Sharma', gender: 'Male',
                fatherName: 'Rajesh Sharma', motherName: 'Priya Sharma', batch: '2024-2025',
                class: 'X', section: 'A', email: 'rajesh.sharma@email.com', contactNo: '9876543210',
                address: '121 MG Road, New Delhi', rollNo: '01', admissionNo: 'ADM2024001',
                category: 'General', facility: ['Transport'], totalFees: 45000, paidFees: 30000,
                attendance: 92, newStudent: false
            },
            {
                id: 'STU002', firstName: 'Diya', lastName: 'Patel', gender: 'Female',
                fatherName: 'Amit Patel', motherName: 'Neha Patel', batch: '2024-2025',
                class: 'IX', section: 'B', email: 'amit.patel@email.com', contactNo: '9876543211',
                address: '45 Park Street, Mumbai', rollNo: '05', admissionNo: 'ADM2024002',
                category: 'OBC', facility: ['Library'], totalFees: 40000, paidFees: 40000,
                attendance: 98, newStudent: false
            },
            {
                id: 'STU003', firstName: 'Rohan', lastName: 'Gupta', gender: 'Male',
                fatherName: 'Sanjay Gupta', motherName: 'Anita Gupta', batch: '2024-2025',
                class: 'VIII', section: 'A', email: 'sanjay.gupta@email.com', contactNo: '9876543212',
                address: '77 Lake View, Bangalore', rollNo: '12', admissionNo: 'ADM2024003',
                category: 'General', facility: ['Transport', 'Hostel'], totalFees: 60000, paidFees: 15000,
                attendance: 74, newStudent: true
            }
        ]);

        // Seed Invoices
        await FeeInvoice.insertMany([
            { studentId: students[0]._id, studentName: 'Aarav Sharma', class: 'X-A', invoiceNo: 'FEE-2024-001', dueDate: '2024-07-15', amount: 15000, status: 'overdue' },
            { studentId: students[2]._id, studentName: 'Rohan Gupta', class: 'VIII-A', invoiceNo: 'FEE-2024-002', dueDate: '2024-08-01', amount: 45000, status: 'due' }
        ]);

        // Seed Concessions
        await ConcessionType.insertMany([
            { title: 'Staff Ward', type: 'Percentage', value: 50, status: 'Active' },
            { title: 'Sibling Discount', type: 'Fixed', value: 5000, status: 'Active' },
            { title: 'Merit Scholarship', type: 'Percentage', value: 25, status: 'Active' },
            { title: 'EWS Concession', type: 'Percentage', value: 100, status: 'Active' }
        ]);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
