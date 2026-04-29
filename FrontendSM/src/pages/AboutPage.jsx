import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Phone, Mail, Facebook, Instagram, Youtube, Twitter, Linkedin,
    MapPin, Search, Wallet, FileText, LogIn, Menu, X,
    ArrowRight, BookOpen, Users, Target, Heart, Award, Clock,
    ChevronRight, ChevronDown, ChevronLeft, GraduationCap, Star, CheckCircle
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
    const { user, logout } = useAuth();
    const [aboutData, setAboutData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [rulesIndex, setRulesIndex] = useState(0);
    const [teamIndex, setTeamIndex] = useState(0);

    const rulesImages = ['/Rules1.png', '/Rules2.png', '/Rules3.png'];
    const teamImages = ['/Team1.png', '/Team2.png', '/Team3.png', '/Team4.png'];

    const nextRule = () => setRulesIndex((prev) => (prev + 1) % rulesImages.length);
    const prevRule = () => setRulesIndex((prev) => (prev - 1 + rulesImages.length) % rulesImages.length);

    const nextTeam = () => setTeamIndex((prev) => (prev + 1) % teamImages.length);
    const prevTeam = () => setTeamIndex((prev) => (prev - 1 + teamImages.length) % teamImages.length);

    const [siteConfig, setSiteConfig] = useState({
        header: {
            phone1: '6296490943',
            phone2: '6296490943',
            email: 'mountzionschool2021@gmail.com',
            socials: {
                facebook: 'https://www.facebook.com/share/1DYSZWV8DU/',
                youtube: 'https://youtube.com',
                instagram: 'https://instagram.com',
                whatsapp: 'https://wa.me/916296490943'
            }
        },
        footer: {
            ctaText: 'EMPOWERING EVERY CHILD TO REACH HIGHER.',
            address: 'MOUNT ZION SCHOOL, SION NAGAR, PURNEA - 854301, BIHAR, Office Timing : 7.00 am to 1:30 pm (Summer), 8.30 am to 2.30 pm (winter), Sunday Holiday',
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

    const phone1 = siteConfig?.header?.phone1 || '6296490943';
    const phone2 = siteConfig?.header?.phone2 || '6296490943';
    const email = siteConfig?.header?.email || 'mountzionschool2021@gmail.com';
    const socials = siteConfig?.header?.socials || {};
    const tickerItems = siteConfig?.announcements?.ticker || [
        'Admission Open for Session 2025-26',
        'Mount Zion School Ranked #1 in Purnea',
        'New Sports Complex Inaugurated'
    ];

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

            {/* ===== HEADER ===== */}
            <header className="landing-header">
                <div className="header-inner" style={{ justifyContent: 'space-between' }}>
                    <Link to="/" className="school-logo" style={{ textDecoration: 'none' }}>
                        <img src="/logo.png" alt="MZ Logo" />
                        <div className="school-logo-text">
                            <h2>MOUNT ZION</h2>
                            <h2>SCHOOL</h2>
                        </div>
                    </Link>
                    <div className="landing-nav">
                        <div className="nav-divider"></div>
                        <Link to="/" className="nav-link">Home <span className="nav-badge">FREE</span></Link>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/about" className="nav-link active">About <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/about" className="dropdown-item">About Mount Zion</Link>
                                <a href="#team" className="dropdown-item">The Team</a>
                                <a href="#rules" className="dropdown-item">Rules & Regulations</a>
                                <a href="#notices" className="dropdown-item">Notice</a>
                            </div>
                        </div>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/admission" className="nav-link">Admission <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <a href="/admission#procedure" className="dropdown-item">Admission Procedure</a>
                                <a href="/admission#fee" className="dropdown-item">Fee & Payment</a>
                                <a href="/admission#result" className="dropdown-item">Admission Result-2026</a>
                            </div>
                        </div>
                        <div className="nav-divider"></div>
                        <Link to="/academics" className="nav-link">Academics <ChevronDown size={14} className="nav-chevron" /></Link>
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

            {/* ===== NEWS TICKER ===== */}
            <div className="news-ticker-bar">
                <div className="ticker-scroll-content">
                    <div className="ticker-track">
                        {tickerItems.map((item, i) => (
                            <span key={i} className="ticker-item">{item} &nbsp; • &nbsp;</span>
                        ))}
                        {tickerItems.map((item, i) => (
                            <span key={i + 'copy'} className="ticker-item">{item} &nbsp; • &nbsp;</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== ABOUT US ===== */}
            <section className="about-us-section" id="about" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container">
                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        <div className="rules-image-side" style={{ flex: '1' }}>
                            <div className="rules-image-box" style={{ height: '100%' }}>
                                <img src="/About Us.png" alt="About Mount Zion School" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0', display: 'block' }} />
                            </div>
                        </div>

                        <div className="rules-text-side" style={{ flex: '1.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: '900', color: '#000' }}>About Us</h2>
                                <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '25px' }}>Mount Zion School</h3>

                                <div className="about-description" style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.8' }}>
                                    <p>Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.</p>
                                    <p style={{ marginTop: '10px' }}>It was established in 1994 and the purpose of starting this school was to give "Education to Everyone". From a humble beginning with the grace of God the school has now become a full-fledged institution. Mount Zion aims at educating different levels of students from different societies and communities and mould them in desired shapes. We give all the concerns for the scholastic and co-scholastic development of students by holding the core of the disciplinary steps.</p>
                                    <p style={{ marginTop: '10px' }}>Apart from this the students are not only to excel in academic interests but also to understand that we all are made in the image of God, who wants to be fulfilled in life and work, in relationship with God, with each other and with the world He made for us to enjoy.</p>
                                </div>
                            </div>

                            <div className="about-social-row" style={{ marginTop: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span className="visit-text" style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '500' }}>Visit &nbsp;&nbsp;&nbsp;:</span>
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: '#000', borderRadius: '50%', color: '#fff', textDecoration: 'none' }}>
                                    <Facebook fill="#fff" strokeWidth={0} size={16} style={{ marginLeft: '1px', marginTop: '1px' }}/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* ===== RULES & REGULATIONS ===== */}
            <section className="about-rules-section" id="rules">
                <div className="section-container">
                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        <div className="rules-text-side" style={{ flex: '1.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: '900', color: '#000' }}>Rules & Regulations</h2>
                                <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '25px' }}>Mount Zion School</h3>

                                <div className="about-description" style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.8' }}>
                                    <p>Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.</p>
                                    <p style={{ marginTop: '10px' }}>It was established in 1994 and the purpose of starting this school was to give "Education to Everyone". From a humble beginning with the grace of God the school has now become a full-fledged institution. Mount Zion aims at educating different levels of students from different societies and communities and mould them in desired shapes. We give all the concerns for the scholastic and co-scholastic development of students by holding the core of the disciplinary steps.</p>
                                    <p style={{ marginTop: '10px' }}>Apart from this the students are not only to excel in academic interests but also to understand that we all are made in the image of God, who wants to be fulfilled in life and work, in relationship with God, with each other and with the world He made for us to enjoy.</p>
                                </div>
                            </div>

                            <div className="about-social-row" style={{ marginTop: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span className="visit-text" style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '500' }}>Visit &nbsp;&nbsp;&nbsp;:</span>
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: '#000', borderRadius: '50%', color: '#fff', textDecoration: 'none' }}>
                                    <Facebook fill="#fff" strokeWidth={0} size={16} style={{ marginLeft: '1px', marginTop: '1px' }}/>
                                </a>
                            </div>
                        </div>

                        <div className="rules-image-side" style={{ flex: '1', position: 'relative' }}>
                            <div className="rules-image-box" style={{ height: '100%' }}>
                                <AnimatePresence mode="wait">
                                    <motion.img 
                                        key={rulesIndex}
                                        src={rulesImages[rulesIndex]} 
                                        alt={`Rules and Regulations ${rulesIndex + 1}`} 
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '0' }}
                                    />
                                </AnimatePresence>
                                <div className="team-arrows" style={{ position: 'absolute', top: '50%', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 10px', transform: 'translateY(-50%)' }}>
                                    <button className="team-carousel-arrow prev" onClick={prevRule} style={{ width: '36px', height: '36px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f59e0b', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}><ChevronLeft size={16}/></button>
                                    <button className="team-carousel-arrow next" onClick={nextRule} style={{ width: '36px', height: '36px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f59e0b', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}><ChevronRight size={16}/></button>
                                </div>
                                <div className="carousel-dots-bottom" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                                    {rulesImages.map((_, idx) => (
                                        <span key={idx} onClick={() => setRulesIndex(idx)} className={`dot ${idx === rulesIndex ? 'active' : ''}`} style={{ width: '8px', height: '8px', background: idx === rulesIndex ? '#475569' : '#e2e8f0', borderRadius: '50%', cursor: 'pointer' }}></span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== OUR TEAM ===== */}
            <section className="about-team-section" id="team" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container" style={{ maxWidth: '1200px' }}>
                    <div className="team-header-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000' }}>Our Team</h2>
                    </div>
                    
                    <div className="team-description-center" style={{ textAlign: 'left', color: '#334155', fontSize: '0.9rem', lineHeight: '1.8', maxWidth: '1000px', margin: '0 auto 50px' }}>
                        <p style={{ marginBottom: '10px' }}>Mount Zion School is a Co-Educational English Medium School.</p>
                        <p>With its motto "Wisdom and Righteousness", we make every unremitting effort not only for academic performance but also for the physical, mental and intellectual development of our learners from various sectors of society by imparting quality education with self-discipline, self esteem and self confidence. Mount Zion School provides a safe and supportive environment to develop their skills for a future that reflects their highest aspiration and challenge to fly them as high as they can.</p>
                    </div>

                    <div className="team-carousel-wrapper" style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
                        <AnimatePresence mode="wait">
                            <motion.img 
                                key={teamIndex}
                                src={teamImages[teamIndex]} 
                                alt={`Our Team ${teamIndex + 1}`} 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4 }}
                                style={{ width: '100%', borderRadius: '0', display: 'block' }} 
                            />
                        </AnimatePresence>
                        <div className="team-arrows" style={{ position: 'absolute', top: '50%', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 20px', transform: 'translateY(-50%)' }}>
                            <button className="team-carousel-arrow prev" onClick={prevTeam} style={{ width: '40px', height: '40px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f59e0b', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}><ChevronLeft size={20}/></button>
                            <button className="team-carousel-arrow next" onClick={nextTeam} style={{ width: '40px', height: '40px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f59e0b', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}><ChevronRight size={20}/></button>
                        </div>
                        <div className="carousel-dots-bottom" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                            {teamImages.map((_, idx) => (
                                <span key={idx} onClick={() => setTeamIndex(idx)} className={`dot ${idx === teamIndex ? 'active' : ''}`} style={{ width: '8px', height: '8px', background: idx === teamIndex ? '#475569' : '#e2e8f0', borderRadius: '50%', cursor: 'pointer' }}></span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== NOTICES ===== */}
            <section className="about-notices-section" id="notices" style={{ padding: '100px 0', background: '#fff', marginTop: '40px' }}>
                <div className="section-container">
                    <div className="notices-header-center" style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#333' }}>Notices</h2>
                    </div>
                    
                    <div className="notice-card-container" style={{ maxWidth: '420px', margin: '0 auto', background: '#F3EADB', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div className="notice-card-image">
                            <img src="/news1.png" alt="Students" style={{ width: '100%', height: '200px', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                        </div>
                        <div className="notice-card-content" style={{ padding: '35px 30px 40px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                <p className="notice-subtitle" style={{ color: '#C25A41', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(194, 90, 65, 0.4)', paddingBottom: '8px', display: 'inline-block' }}>MOUNT ZION SCHOOL, PURNEA</p>
                            </div>
                            <h3 className="notice-title" style={{ color: '#B63A22', fontSize: '1.8rem', fontWeight: '900', margin: '0 0 5px' }}>SCHOOL CLOSED</h3>
                            <p className="notice-reason" style={{ color: '#B63A22', fontSize: '0.8rem', fontWeight: '700', margin: '0 0 35px', letterSpacing: '0.5px' }}>ON ACCOUNT OF MAKAR SANKRANTI FESTIVAL</p>
                            
                            <div className="notice-date-box" style={{ marginBottom: '25px', border: '1px solid #C25A41', background: '#fff' }}>
                                <div className="date-header" style={{ background: '#C25A41', color: '#fff', padding: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Closure Date</div>
                                <div className="date-body" style={{ padding: '15px', color: '#B63A22', fontSize: '0.9rem', fontWeight: '600', background: '#F3EADB' }}>14 January 2030 (Wednesday)</div>
                            </div>
                            
                            <p className="notice-info-text" style={{ color: '#B63A22', fontSize: '0.75rem', lineHeight: '1.6', margin: '0 0 25px', padding: '0 10px' }}>This is to inform parents and students that the school will remain closed on the above mentioned date due to the festival holiday.</p>
                            
                            <div className="notice-date-box" style={{ border: '1px solid #C25A41', background: '#fff' }}>
                                <div className="date-header" style={{ background: '#C25A41', color: '#fff', padding: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Reopening Date</div>
                                <div className="date-body" style={{ padding: '15px', color: '#B63A22', fontSize: '0.9rem', fontWeight: '600', background: '#F3EADB' }}>School will reopen on 15 January 2030 (Thursday)</div>
                            </div>
                        </div>
                        <div className="notice-card-footer" style={{ height: '35px', background: '#AEA194' }}></div>
                    </div>
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
                            <Link to="/about" onClick={toggleMobileMenu}>About</Link>
                            <Link to="/admission" onClick={toggleMobileMenu}>Admission</Link>
                            <Link to="/academics" onClick={toggleMobileMenu}>Academics</Link>
                            <Link to="/curriculum" onClick={toggleMobileMenu}>Curriculum</Link>
                            <Link to="/gallery" onClick={toggleMobileMenu}>Gallery</Link>
                            <Link to="/contact" onClick={toggleMobileMenu}>Contact Us</Link>
                            {user ? (
                                <>
                                    <Link to="/" onClick={toggleMobileMenu}>Dashboard</Link>
                                    <span style={{ cursor: 'pointer', color: '#ff4757', fontWeight: 600 }} onClick={() => { logout(); toggleMobileMenu(); }}>Logout</span>
                                </>
                            ) : (
                                <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
                            )}
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
                                    <a href={socials.facebook} className="social-circle" target="_blank" rel="noopener noreferrer"><Facebook size={16}/></a>
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
                                    <a href="https://maps.app.goo.gl/EqYY3hjh4gDCozwHA" className="map-link" target="_blank" rel="noopener noreferrer">
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
