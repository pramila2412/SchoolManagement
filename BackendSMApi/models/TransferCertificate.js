const mongoose = require('mongoose');

const tcSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    class: String,
    section: String,
    admissionNo: String,
    admissionDate: Date,
    dateOfBirth: Date,
    fatherName: String,
    motherName: String,
    nationality: { type: String, default: 'Indian' },
    scSt: { type: String, default: '' },  // Whether SC or ST
    dateOfFirstAdmission: Date,
    firstAdmissionClass: String,
    dobInWords: String,  // DOB written in words
    tcNo: { type: String, unique: true },
    dateOfLeaving: { type: Date, required: true },
    reasonForLeaving: { type: String, required: true },
    conduct: { type: String, enum: ['Good', 'Satisfactory', 'Excellent', 'Needs Improvement'], default: 'Good' },
    medium: { type: String, default: 'English' },
    classLastStudied: String,
    boardExamResult: String,
    whetherFailed: { type: String, default: 'No' },
    subjectsCompulsory: String,
    subjectsElective: String,
    qualifiedForPromotion: { type: String, default: '' },
    promotionClass: String,
    promotionClassWords: String,
    monthFeesPaid: String,
    feeConcession: { type: String, default: 'None' },
    totalWorkingDays: String,
    totalDaysPresent: String,
    generalConduct: { type: String, default: 'Good' },
    dateOfApplication: Date,
    dateOfIssue: Date,
    otherRemarks: String,
    generatedBy: { type: String, default: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('TransferCertificate', tcSchema);
