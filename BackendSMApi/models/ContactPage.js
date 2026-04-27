const mongoose = require('mongoose');

const contactPageSchema = new mongoose.Schema({
    pageTitle: { type: String, default: 'Contact Us' },
    pageSubtitle: { type: String, default: 'We would love to hear from you' },
    heroImage: { type: String, default: '/contact.jpeg' },
    
    address: {
        name: { type: String, default: 'MOUNT ZION SCHOOL' },
        street: { type: String, default: 'SION NAGAR' },
        cityState: { type: String, default: 'PURNEA - 854301, BIHAR' }
    },
    
    contactNumbers: {
        type: [String],
        default: ['6296490943']
    },
    
    emails: {
        type: [String],
        default: ['mountzionschool@gmail.com', 'mountzionschool2021@gmail.com']
    },
    
    officeTiming: {
        summer: { type: String, default: '7.00 am to 1:30 pm (Summer)' },
        winter: { type: String, default: '8.30 am to 2.30 pm (Winter)' },
        holidays: { type: String, default: 'Sunday Holiday' }
    }
}, { timestamps: true });

module.exports = mongoose.model('ContactPage', contactPageSchema);
