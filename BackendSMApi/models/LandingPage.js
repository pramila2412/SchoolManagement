const mongoose = require('mongoose');

const LandingPageSchema = new mongoose.Schema({
    header: {
        phone1: { type: String, default: '6296490943' },
        phone2: { type: String, default: '6296490943' },
        email: { type: String, default: 'mountzionschool2021@gmail.com' },
        socials: {
            facebook: { type: String, default: 'https://www.facebook.com/share/1DYSZWV8DU/' },
            youtube: { type: String, default: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos' }
        }
    },
    hero: {
        title: { type: String, default: 'A Global Campus for Global Students' },
        subtitle: { type: String, default: 'With a faculty from over 100 countries, we foster a vibrant, inclusive community that is globally connected.' },
        cta: { type: String, default: "Apply / Admitted? Let's make it official!" },
        image: { type: String, default: '/mount school.jpeg' }
    },
    announcements: {
        ticker: { type: [String], default: [
            'Admission Open for Session 2025-26',
            'CBSE Board Results 2024: 100% Pass Rate',
            'Summer Camp Registrations Started!'
        ]},
        heroStrip: {
            text: { type: String, default: 'Admission Inquiry for 2025-26 academic year is now open' },
            link: { type: String, default: '/admission' },
            show: { type: Boolean, default: true }
        }
    },
    facilities: [{
        title: String,
        image: String
    }],
    gallery: [{
        title: String,
        category: String,
        image: String
    }],
    about: {
        title: { type: String, default: "Principal's Message." },
        subtitle: { type: String, default: 'Welcome to Mount Zion School' },
        message: { type: String, default: "<p><strong>Motto: WISDOM AND RIGHTEOUSNESS</strong></p><p>It is with great pride and joy that I welcome you to the official website of Mount Zion School, a place where learning meets values and dreams take flight.</p><p>Our motto, <strong>WISDOM AND RIGHTEOUSNESS</strong>, is the guiding light of every step we take. At Mount Zion, we believe education must enlighten the mind with wisdom and strengthen the character with righteousness. We are committed to nurturing young minds who not only excel academically but also grow into compassionate, responsible citizens.</p><p>Over the years, children in thousands have passed out from Mount Zion and are today serving society from reputed posts in Medical, Teaching, Administration, and Engineering. They are building up the society with integrity and excellence, and they remain our greatest achievement and pride.</p><p>Our dedicated team of teachers works tirelessly to create a safe, inclusive, and stimulating environment where students are encouraged to ask questions, think creatively, and grow into lifelong learners.</p><p>To our parents, thank you for your trust and partnership. Together, we will continue to guide our children toward a future filled with purpose and values.</p><p>I invite you to explore our website and discover the Mount Zion spirit. May our children continue to Arise and Shine.</p><div style='text-align: right; margin-top: 30px;'><strong>Warm regards,</strong><br/><strong>REENA ALBERT</strong><br/>Principal.</div>" },
        image: { type: String, default: '/About.png' }
    },
    news: [String],
    achievements: [String],
    testimonials: [{
        text: String,
        author: String,
        id: String,
        image: String
    }],
    connect: {
        title: { type: String, default: "Stay Connected with" },
        goldText: { type: String, default: "Your Child's Progress" },
        subtext: { type: String, default: "" },
        features: [String]
    },
    footer: {
        ctaText: { type: String, default: "EMPOWERING EVERY CHILD TO REACH HIGHER." },
        address: { type: String, default: "" },
        copyright: { type: String, default: "" }
    }
}, { timestamps: true });

module.exports = mongoose.model('LandingPage', LandingPageSchema);
