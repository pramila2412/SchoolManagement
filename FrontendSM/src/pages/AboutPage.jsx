import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Phone, Mail, Facebook, Instagram, Youtube, Twitter, Linkedin,
    MapPin, Search, Wallet, FileText, LogIn, Menu, X,
    ArrowRight, BookOpen, Users, Target, Heart, Award, Clock,
    ChevronRight, GraduationCap, Star, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './AboutPage.css';
import './LandingPage.css';

const API = '/api';

// Default fallback data
const DEFAULTS = {
    pageTitle: 'About Mount Zion School',
    pageSubtitle: 'Nurturing Young Minds Since 1995',
    heroImage: '/school.jpeg',
    principalName: 'Dr. Jacob Samuel',
    principalTitle: 'OUR PRINCIPAL',
    principalImage: '/About.png',
    principalMessage: `<p>It is with immense pride and gratitude that I welcome you to Mount Zion School, an institution that has been a beacon of educational excellence since 1995.</p>
<p><strong>Our Journey: From Humble Beginnings to Remarkable Growth</strong><br/>Twenty-nine years ago, Mount Zion School began with a vision and unwavering faith. What started as a modest initiative with just 5 students has blossomed into a thriving educational community of over 600 students today.</p>
<p><strong>The Mount Zion Legacy:</strong><br/>When we opened our doors in 1995, we dreamed of creating more than just a school—we envisioned a nurturing environment where young minds could flourish, where character is built alongside academic achievement, and where every child discovers their unique potential.</p>`,
    mission: 'To provide quality education that nurtures the intellectual, physical, emotional, and spiritual growth of every student, preparing them to become responsible global citizens.',
    vision: 'To be a premier educational institution recognized for academic excellence, innovation, and the holistic development of students rooted in strong moral values.',
    coreValues: [
        { title: 'Excellence in Education', description: 'From our humble beginning with 5 students to our current strength of 600, our commitment to academic excellence has remained unwavering.' },
        { title: 'Holistic Development', description: 'We believe education extends far beyond textbooks. Our comprehensive approach encompasses academics, sports, arts, life skills, and moral values.' },
        { title: 'Individual Attention', description: 'Despite our growth, we have never lost sight of the individual. Each student at Mount Zion receives personalized attention.' },
        { title: 'Faith & Values', description: 'Rooted in strong moral and spiritual values, we guide our students to develop integrity, compassion, and responsibility.' }
    ],
    stats: [
        { number: '29+', label: 'Years of Excellence' },
        { number: '600+', label: 'Students Enrolled' },
        { number: '50+', label: 'Dedicated Faculty' },
        { number: '100%', label: 'Board Pass Rate' }
    ],
    milestones: [
        { year: '1995', title: 'Foundation', description: 'Mount Zion School was founded with just 5 students and a dream to provide quality education.' },
        { year: '2005', title: 'CBSE Affiliation', description: 'Achieved CBSE affiliation, marking a major milestone in our journey towards academic excellence.' },
        { year: '2015', title: 'Growing Community', description: 'Crossed 400+ students with state-of-the-art facilities including computer labs and science labs.' },
        { year: '2024', title: 'Modern Campus', description: 'Expanded to 600+ students with modern infrastructure, auditorium, and sports facilities.' }
    ]
};

const valueIcons = [BookOpen, Users, Target, Heart];

export default function AboutPage() {
    const { user } = useAuth();
    const [aboutData, setAboutData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [siteConfig, setSiteConfig] = useState({
        header: {
            phone1: '+91 89434 94547',
            phone2: '+91 89434 94548',
            email: 'mountzion@gmail.com',
            socials: {
                facebook: 'https://facebook.com',
                youtube: 'https://youtube.com',
                instagram: 'https://instagram.com',
                whatsapp: 'https://wa.me/918943494547'
            }
        },
        footer: {
            ctaText: 'EMPOWERING EVERY CHILD TO REACH HIGHER.',
            address: 'Emily Hattson 940 Goldendale Dr, Wasilla, Alaska 99654, USA',
            copyright: 'Copyright © 2025 Mount Zion School, Inc. All rights reserved.'
        }
    });

    useEffect(() => {
        const saved = localStorage.getItem('mzs_site_config');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSiteConfig(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse site config", e);
            }
        }
    }, []);

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const res = await fetch(`${API}/about`);
            if (res.ok) {
                const data = await res.json();
                setAboutData({ ...DEFAULTS, ...data });
            }
        } catch (err) {
            console.warn('Could not fetch about data from backend, using defaults:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const phone1 = siteConfig?.header?.phone1 || '+91 89434 94547';
    const phone2 = siteConfig?.header?.phone2 || '+91 89434 94548';
    const email = siteConfig?.header?.email || 'mountzion@gmail.com';
    const socials = siteConfig?.header?.socials || {};

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="landing-page about-page">
            {/* ===== TOP BAR (same as landing) ===== */}
            <div className="landing-top-bar">
                <div className="top-bar-content">
                    <div className="top-left-socials">
                        <a href={socials.facebook} className="social-icon"><Facebook size={14} fill="white" strokeWidth={0}/></a>
                        <a href={socials.youtube} className="social-icon"><Youtube size={14} fill="white" strokeWidth={0}/></a>
                        <a href={socials.instagram} className="social-icon"><Instagram size={14}/></a>
                        <a href={socials.whatsapp} className="social-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </a>
                    </div>
                    <div className="top-contact-info">
                        <a href={`tel:${phone1}`} className="top-info-item"><Phone size={13}/> {phone1}</a>
                        <a href={`tel:${phone2}`} className="top-info-item"><Phone size={13}/> {phone2}</a>
                        <a href={`mailto:${email}`} className="top-info-item hide-tablet"><Mail size={13}/> {email}</a>
                    </div>
                    <div className="top-right-links">
                        <span className="top-link"><Wallet size={13}/> Pay Now</span>
                        <span className="top-link"><FileText size={13}/> TC</span>
                        <Link to="/login" className="top-link top-login-link"><LogIn size={13}/> Login</Link>
                        <div className="top-search-box">
                            <Search size={13} className="search-icon-small" />
                            <input type="text" placeholder="Search" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== HEADER (same as landing) ===== */}
            <header className="landing-header">
                <div className="header-inner">
                    <div className="landing-nav">
                        <Link to="/" className="school-logo" style={{ textDecoration: 'none' }}>
                            <img src="/logo.png" alt="MZ Logo" />
                            <div className="school-logo-text">
                                <h2>MOUNT ZION</h2>
                                <h2>SCHOOL</h2>
                            </div>
                        </Link>
                        <div className="nav-divider"></div>
                        <Link to="/" className="nav-link">Home</Link>
                        <div className="nav-divider"></div>
                        <Link to="/about" className="nav-link active">About</Link>
                        <div className="nav-divider"></div>
                        <span className="nav-link">Admission</span>
                        <div className="nav-divider"></div>
                        <Link to="/academics" className="nav-link">Academics</Link>
                        <div className="nav-divider"></div>
                        <Link to="/curriculum" className="nav-link">Curriculum</Link>
                        <div className="nav-divider"></div>
                        <Link to="/gallery" className="nav-link">Gallery</Link>
                        <div className="nav-divider"></div>
                        <Link to="/contact" className="nav-link">Contact Us</Link>
                    </div>

                    <button className="mobile-menu-btn lg-hide" onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            {/* ===== HERO BANNER ===== */}
            <section className="about-hero" style={{ backgroundImage: `url("${aboutData.heroImage}")` }}>
                <div className="about-hero-overlay"></div>
                <motion.div className="about-hero-content" {...fadeInUp}>
                    <div className="about-breadcrumb">
                        <Link to="/">Home</Link>
                        <ChevronRight size={14} />
                        <span>About Us</span>
                    </div>
                    <h1>{aboutData.pageTitle}</h1>
                    <p>{aboutData.pageSubtitle}</p>
                </motion.div>
            </section>

            {/* ===== STATISTICS STRIP ===== */}
            <section className="about-stats-strip">
                <div className="section-container">
                    <div className="stats-grid">
                        {aboutData.stats.map((stat, idx) => (
                            <motion.div 
                                className="stat-item" 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <span className="stat-number">{stat.number}</span>
                                <span className="stat-label">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SCHOOL IMAGE + INTRO ===== */}
            <section className="about-intro-section">
                <div className="section-container">
                    <motion.div className="about-intro-grid" {...fadeInUp}>
                        <div className="about-intro-image">
                            <img src="/school.jpeg" alt="Mount Zion School Campus" />
                            <div className="image-accent-border"></div>
                        </div>
                        <div className="about-intro-text">
                            <span className="about-section-tag">WHO WE ARE</span>
                            <h2>Welcome to Mount Zion School</h2>
                            <p>
                                Mount Zion School, Purnea, has been a beacon of educational excellence since 1995. 
                                What started as a modest initiative with just 5 students has blossomed into a thriving 
                                educational community of over 600 students today.
                            </p>
                            <p>
                                Our institution is dedicated to nurturing young minds and shaping them into responsible, 
                                compassionate, and confident individuals ready to take on the challenges of the future.
                            </p>
                            <div className="intro-highlights">
                                <div className="intro-highlight-item">
                                    <CheckCircle size={20} className="highlight-icon" />
                                    <span>CBSE Affiliated</span>
                                </div>
                                <div className="intro-highlight-item">
                                    <CheckCircle size={20} className="highlight-icon" />
                                    <span>Nursery to Class XII</span>
                                </div>
                                <div className="intro-highlight-item">
                                    <CheckCircle size={20} className="highlight-icon" />
                                    <span>Modern Infrastructure</span>
                                </div>
                                <div className="intro-highlight-item">
                                    <CheckCircle size={20} className="highlight-icon" />
                                    <span>Experienced Faculty</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== MISSION & VISION ===== */}
            <section className="about-mv-section">
                <div className="section-container">
                    <div className="mv-grid">
                        <motion.div className="mv-card mission-card" {...fadeInUp}>
                            <div className="mv-icon-wrap">
                                <Target size={32} />
                            </div>
                            <h3>Our Mission</h3>
                            <p>{aboutData.mission}</p>
                        </motion.div>
                        <motion.div 
                            className="mv-card vision-card" 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="mv-icon-wrap">
                                <Star size={32} />
                            </div>
                            <h3>Our Vision</h3>
                            <p>{aboutData.vision}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== PRINCIPAL'S MESSAGE ===== */}
            <section className="about-principal-section">
                <div className="section-container">
                    <motion.div className="principal-grid" {...fadeInUp}>
                        <div className="principal-photo-side">
                            <div className="principal-photo-frame">
                                <img src={aboutData.principalImage} alt={aboutData.principalName} />
                            </div>
                            <div className="principal-name-card">
                                <h4>{aboutData.principalName}</h4>
                                <span>{aboutData.principalTitle}</span>
                            </div>
                        </div>
                        <div className="principal-message-side">
                            <span className="about-section-tag">FROM THE PRINCIPAL'S DESK</span>
                            <h2>Knowing {aboutData.principalName}</h2>
                            <div 
                                className="principal-msg-content"
                                dangerouslySetInnerHTML={{ __html: aboutData.principalMessage }}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== CORE VALUES ===== */}
            <section className="about-values-section">
                <div className="section-container">
                    <div className="values-header">
                        <span className="about-section-tag">WHAT DRIVES US</span>
                        <h2>Our Core Values</h2>
                    </div>
                    <div className="values-grid">
                        {aboutData.coreValues.map((value, idx) => {
                            const IconComp = valueIcons[idx % valueIcons.length];
                            return (
                                <motion.div 
                                    className="value-card" 
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                                >
                                    <div className="value-icon-circle">
                                        <IconComp size={24} />
                                    </div>
                                    <h4>{value.title}</h4>
                                    <p>{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== MILESTONES / TIMELINE ===== */}
            <section className="about-timeline-section">
                <div className="section-container">
                    <div className="timeline-header">
                        <span className="about-section-tag">OUR JOURNEY</span>
                        <h2>Milestones</h2>
                    </div>
                    <div className="timeline-track">
                        {aboutData.milestones.map((milestone, idx) => (
                            <motion.div 
                                className={`timeline-item ${idx % 2 === 0 ? 'top' : 'bottom'}`} 
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                            >
                                <div className="timeline-year">{milestone.year}</div>
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h4>{milestone.title}</h4>
                                    <p>{milestone.description}</p>
                                </div>
                            </motion.div>
                        ))}
                        <div className="timeline-line"></div>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="about-cta-section">
                <div className="section-container">
                    <motion.div className="about-cta-inner" {...fadeInUp}>
                        <h2>Ready to Join the Mount Zion Family?</h2>
                        <p>Begin your child's journey towards excellence today</p>
                        <Link to="/admission" className="about-cta-btn">
                            Apply for Admission <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ===== Mobile Nav ===== */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        className="mobile-nav-overlay"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                    >
                        <div className="mobile-nav-content">
                            <button className="close-btn" onClick={toggleMobileMenu}><X /></button>
                            <Link to="/" onClick={toggleMobileMenu}>Home</Link>
                            <Link to="/about" onClick={toggleMobileMenu}>About Us</Link>
                            <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
                            <Link to="/academics" onClick={toggleMobileMenu}>Academics</Link>
                            <span>Contact</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== FOOTER (same as landing) ===== */}
            <footer className="main-footer">
                <div className="footer-top-cta">
                    <div className="section-container">
                        <div className="footer-cta-inner">
                            <h2>{siteConfig.footer.ctaText}</h2>
                            <Link to="/admission" className="apply-btn-footer">Apply for Application</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-main-content">
                    <div className="section-container">
                        <div className="footer-grid">
                            <div className="footer-col brand-col">
                                <div className="footer-logo">
                                    <img src="/logo.png" alt="MZ Logo" />
                                    <div className="footer-logo-text">
                                        <h3>MOUNT ZION</h3>
                                        <h3>SCHOOL</h3>
                                    </div>
                                </div>
                                <div className="footer-social-circles">
                                    <a href="#" className="social-circle"><Facebook size={16}/></a>
                                    <a href="#" className="social-circle"><Instagram size={16}/></a>
                                    <a href="#" className="social-circle"><Linkedin size={16}/></a>
                                    <a href="#" className="social-circle"><Twitter size={16}/></a>
                                </div>
                            </div>

                            <div className="footer-col">
                                <h4>Useful Links</h4>
                                <ul className="footer-links">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about">About</Link></li>
                                    <li><Link to="/admission">Admission</Link></li>
                                    <li><Link to="/academics">Academics</Link></li>
                                </ul>
                            </div>

                            <div className="footer-col">
                                <h4>Support</h4>
                                <ul className="footer-links">
                                    <li><Link to="/curriculum">Curriculum</Link></li>
                                    <li><Link to="/gallery">Gallery</Link></li>
                                    <li><Link to="/notices">Notices</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>

                            <div className="footer-col">
                                <h4>Address</h4>
                                <div className="footer-address">
                                    {siteConfig.footer.address.split(',').map((line, i) => (
                                        <p key={i}>{line.trim()}</p>
                                    ))}
                                    <a href="#" className="map-link">
                                        <MapPin size={16} />
                                        <span>See on Map</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="section-container">
                        <div className="bottom-inner">
                            <p className="copyright">{siteConfig.footer.copyright}</p>
                            <div className="bottom-links">
                                <a href="#">Privacy Policy</a>
                                <span className="separator">|</span>
                                <a href="#">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
