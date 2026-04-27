const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
    url: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: ['Sports', 'School Tour', 'Programs and Events', 'Annual Day', 'Meetings']
    },
    title: { 
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
