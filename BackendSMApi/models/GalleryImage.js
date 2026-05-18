const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
    url: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true
    },
    subcategory: {
        type: String,
        default: 'General'
    },
    title: { 
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
