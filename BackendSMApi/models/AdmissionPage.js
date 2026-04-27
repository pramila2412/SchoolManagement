const mongoose = require('mongoose');

const admissionPageSchema = new mongoose.Schema({
    pageTitle: { type: String, default: 'Admissions' },
    pageSubtitle: { type: String, default: 'Join the Mount Zion Family — Where Excellence Begins' },
    heroImage: { type: String, default: '/school.jpeg' },

    // Admission Procedure
    admissionProcedure: {
        type: [{
            text: String
        }],
        default: [
            { text: 'Admission to Nursery class can be secured on the basis of communication with the parents.' },
            { text: 'LKG upwards admission based on clearing up the Entrance Test.' }
        ]
    },

    // Admission Criteria
    admissionCriteria: {
        type: [{
            text: String
        }],
        default: [
            { text: 'Submit the properly filled Registration Form and collect the date of the Entrance Test.' },
            { text: 'Appear for the Entrance Exam at the Scheduled time.' },
            { text: 'Go through the Result.' },
            { text: 'If the student is eligible for the admission, submit the duly filled admission form, along with required documents and passport size photographs.' },
            { text: 'Now collect final confirmation regarding admission and deposit fee.' },
            { text: 'Try to submit original documents at the time of admission.' },
            { text: 'Basic informations like DOB, address, parent\'s name etc. once entered in the school admission register at the time of admission should not be changed under any circumstances.' }
        ]
    },

    // Required Documents
    requiredDocuments: {
        type: [String],
        default: [
            'Birth Certificate (Original & Photocopy)',
            'Transfer Certificate from previous school',
            'Report Card / Mark Sheet of last class attended',
            'Passport size photographs (4 copies)',
            'Aadhar Card of student and parents',
            'Address Proof (Ration Card / Electricity Bill)',
            'Caste Certificate (if applicable)'
        ]
    },

    // Fee Structure note
    feeNote: {
        type: String,
        default: 'For detailed fee structure, please visit the school office or contact us directly. Fee concessions may be available for meritorious students and siblings.'
    },

    // Contact info for admission
    admissionContact: {
        phone: { type: String, default: '+91 89434 94547' },
        email: { type: String, default: 'mountzion@gmail.com' },
        officeHours: { type: String, default: 'Monday to Saturday, 9:00 AM - 3:00 PM' }
    },

    // Classes offered
    classesOffered: {
        type: [String],
        default: ['Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII']
    },

    // Admission open status
    admissionOpen: { type: Boolean, default: true },
    academicYear: { type: String, default: '2025-26' }

}, { timestamps: true });

module.exports = mongoose.model('AdmissionPage', admissionPageSchema);
