const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema({
    // Hero / header info
    pageTitle: { type: String, default: 'About Mount Zion School' },
    pageSubtitle: { type: String, default: 'Nurturing Young Minds Since 1995' },
    heroImage: { type: String, default: '/school.jpeg' },

    // Principal section
    principalName: { type: String, default: 'Dr. Jacob Samuel' },
    principalTitle: { type: String, default: 'OUR PRINCIPAL' },
    principalImage: { type: String, default: '/About.png' },
    principalMessage: {
        type: String,
        default: `<p>It is with immense pride and gratitude that I welcome you to Mount Zion School, an institution that has been a beacon of educational excellence since 1995.</p>
<p><strong>Our Journey: From Humble Beginnings to Remarkable Growth</strong><br/>Twenty-nine years ago, Mount Zion School began with a vision and unwavering faith. What started as a modest initiative with just 5 students has blossomed into a thriving educational community of over 600 students today. This extraordinary growth is not merely a testament to increasing numbers, but a reflection of the trust that generations of parents have placed in us, and the dedication of our exceptional faculty.</p>
<p><strong>The Mount Zion Legacy:</strong><br/>When we opened our doors in 1995, we dreamed of creating more than just a school—we envisioned a nurturing environment where young minds could flourish, where character is built alongside academic achievement, and where every child discovers their unique potential. Today, that dream stands realized in the laughter of our students, the pride of our parents, and the achievements of our alumni.</p>`
    },

    // Mission & Vision
    mission: {
        type: String,
        default: 'To provide quality education that nurtures the intellectual, physical, emotional, and spiritual growth of every student, preparing them to become responsible global citizens.'
    },
    vision: {
        type: String,
        default: 'To be a premier educational institution recognized for academic excellence, innovation, and the holistic development of students rooted in strong moral values.'
    },

    // Core Values
    coreValues: {
        type: [{
            title: String,
            description: String
        }],
        default: [
            { title: 'Excellence in Education', description: 'From our humble beginning with 5 students to our current strength of 600, our commitment to academic excellence has remained unwavering. We combine traditional values with modern teaching methodologies, ensuring our students are prepared for the challenges of tomorrow.' },
            { title: 'Holistic Development', description: 'We believe education extends far beyond textbooks. Our comprehensive approach encompasses academics, sports, arts, life skills, and moral values—nurturing well-rounded individuals ready to contribute meaningfully to society.' },
            { title: 'Individual Attention', description: 'Despite our growth, we have never lost sight of the individual. Each student at Mount Zion receives personalized attention, ensuring no child is left behind and every talent is discovered and nurtured.' },
            { title: 'Faith & Values', description: 'Rooted in strong moral and spiritual values, we guide our students to develop integrity, compassion, and a sense of responsibility towards their community and the world.' }
        ]
    },

    // Statistics
    stats: {
        type: [{
            number: String,
            label: String
        }],
        default: [
            { number: '29+', label: 'Years of Excellence' },
            { number: '600+', label: 'Students Enrolled' },
            { number: '50+', label: 'Dedicated Faculty' },
            { number: '100%', label: 'Board Pass Rate' }
        ]
    },

    // History milestones
    milestones: {
        type: [{
            year: String,
            title: String,
            description: String
        }],
        default: [
            { year: '1995', title: 'Foundation', description: 'Mount Zion School was founded with just 5 students and a dream to provide quality education.' },
            { year: '2005', title: 'CBSE Affiliation', description: 'Achieved CBSE affiliation, marking a major milestone in our journey towards academic excellence.' },
            { year: '2015', title: 'Growing Community', description: 'Crossed 400+ students with state-of-the-art facilities including computer labs and science labs.' },
            { year: '2024', title: 'Modern Campus', description: 'Expanded to 600+ students with modern infrastructure, auditorium, and sports facilities.' }
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model('AboutPage', aboutPageSchema);
