const mongoose = require('mongoose');

const curriculumPageSchema = new mongoose.Schema({
    pageTitle: { type: String, default: 'The Curriculum' },
    pageSubtitle: { type: String, default: 'The following subjects are taught at different levels' },
    heroImage: { type: String, default: '/school.jpeg' },

    levels: {
        type: [{
            number: Number,
            title: String,
            subtitle: String,
            color: String,
            subjects: [String],
            streams: [{
                name: String,
                color: String,
                subjects: [String]
            }]
        }],
        default: [
            {
                number: 1,
                title: 'The Foundation Level',
                subtitle: 'Nursery to Upper Kindergarten',
                color: '#1CA7A6',
                subjects: ['English', 'Hindi', 'Mathematics', 'Environmental Science', 'Physical Education', 'Art'],
                streams: []
            },
            {
                number: 2,
                title: 'Primary Level',
                subtitle: '',
                color: '#0B3C5D',
                subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit (Std III onwards)', 'General Knowledge', 'Moral Values', 'Information Technology', 'Art'],
                streams: []
            },
            {
                number: 3,
                title: 'Middle Level',
                subtitle: '',
                color: '#6366f1',
                subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit', 'General Knowledge', 'Moral Values', 'Information Technology', 'Art'],
                streams: []
            },
            {
                number: 4,
                title: 'Secondary Level',
                subtitle: '',
                color: '#d946ef',
                subjects: ['English', 'Hindi / Sanskrit', 'Mathematics', 'Science', 'Social Studies', 'Information Technology', 'Physical Education'],
                streams: []
            },
            {
                number: 5,
                title: 'Senior Secondary Level',
                subtitle: '',
                color: '#ef4444',
                subjects: [],
                streams: [
                    {
                        name: 'Science Stream',
                        color: '#0B3C5D',
                        subjects: ['English Core', 'Hindi / Sanskrit', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Physical Education']
                    },
                    {
                        name: 'Commerce Stream',
                        color: '#ef4444',
                        subjects: ['English Core', 'Business Studies', 'Accountancy', 'Economics', 'Hindi / Sanskrit', 'Physical Education']
                    },
                    {
                        name: 'Humanities Stream',
                        color: '#1CA7A6',
                        subjects: ['English Core', 'Hindi / Sanskrit', 'History', 'Geography', 'Economics', 'Political Science', 'Physical Education']
                    }
                ]
            }
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model('CurriculumPage', curriculumPageSchema);
