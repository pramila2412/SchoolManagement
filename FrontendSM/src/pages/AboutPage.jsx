import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Phone, Mail, Facebook, Youtube,
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
                youtube: 'https://youtube.com'
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
                        <a href={socials.facebook} className="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="white"/></svg></a>
                        <a href={socials.youtube} className="social-icon"><svg width="21" height="15" viewBox="0 0 24 17" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M23.495 2.628c-.232-.866-.918-1.552-1.784-1.784C19.982.417 12 .417 12 .417s-7.982 0-9.711.427c-.866.232-1.552.918-1.784 1.784C.078 4.357.078 8.5.078 8.5s0 4.143.427 5.872c.232.866.918 1.552 1.784 1.784 1.729.427 9.711.427 9.711.427s7.982 0 9.711-.427c.866-.232 1.552-.918 1.784-1.784.427-1.729.427-5.872.427-5.872s0-4.143-.427-5.872zM9.545 12.067V4.933l6.231 3.567-6.231 3.567z" fill="white"/></svg></a>
                    </div>
                    <div className="top-contact-info" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <a href={`tel:${phone1}`} className="top-info-item"><Phone size={14}/> {phone1}</a>
                        <div style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)'}}></div>
                        <a href={`mailto:${email}`} className="top-info-item hide-tablet"><Mail size={14}/> {email}</a>
                        <div style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)'}}></div>
                        <span className="top-link"><Wallet size={14}/> Pay Now</span>
                        <div style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)'}}></div>
                        <span className="top-link"><FileText size={14}/> TC</span>
                        <div style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)'}}></div>
                        <Link to="/login" className="top-link top-login-link"><LogIn size={14}/> Login</Link>
                    </div>
                    <div className="top-right-links">
                        <div className="top-search-box">
                            <Search size={14} className="search-icon-small" />
                            <input type="text" placeholder="Search" />
                        </div>
                    </div>
                    </div>
            </div>

            {/* ===== HEADER ===== */}
            <header className="landing-header">
                <div className="header-inner" style={{ justifyContent: 'space-between' }}>
                    <Link to="/" className="school-logo footer-logo" style={{ textDecoration: 'none', margin: 0, padding: '10px 15px', gap: '12px' }}>
                        <img src="/logo.png" alt="MZ Logo" style={{ height: '50px' }} />
                        <div className="footer-logo-text" style={{ textAlign: 'center', maxWidth: '200px' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0, whiteSpace: 'nowrap' }}>MOUNT ZION SCHOOL</h3>
                            <p className="footer-affiliation" style={{ fontSize: '0.75rem', marginTop: '2px', whiteSpace: 'normal', lineHeight: '1.2' }}>Affiliated to CBSE, New Delhi upto +2 level</p>
                            <p className="footer-affiliation-period" style={{ fontSize: '0.7rem', marginTop: '4px', whiteSpace: 'normal' }}>Period of Affiliation :2027</p>
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
                        <div className="nav-item-dropdown">
                            <Link to="/academics" className="nav-link">Academics <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/curriculum" className="dropdown-item">Curriculum</Link>
                                <Link to="/curriculum#uniform" className="dropdown-item">School Uniform</Link>
                            </div>
                        </div>
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
                <div className="section-container" style={{ maxWidth: '1200px' }}>
                    <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {/* Left Side: Images */}
                        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <img src="/About Us1.jpg" alt="About Mount Zion School Top" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
                            <img src="/About Us.png" alt="About Mount Zion School Bottom" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>

                        {/* Right Side: Text & Information */}
                        <div style={{ flex: '1.2', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                            {/* Top right Visit */}
                            <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>Visit &nbsp;&nbsp;:</span>
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', background: '#000', borderRadius: '50%', color: '#fff', textDecoration: 'none' }}>
                                    <Facebook fill="#fff" strokeWidth={0} size={14} style={{ marginLeft: '1px', marginTop: '1px' }}/>
                                </a>
                                <a href={socials.youtube} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', background: '#000', borderRadius: '50%', color: '#fff', textDecoration: 'none' }}>
                                    <Youtube fill="#fff" strokeWidth={0} size={14} style={{ marginLeft: '1px', marginTop: '1px' }}/>
                                </a>
                            </div>

                            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '900', color: '#000' }}>About Us</h2>
                            <h3 style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '25px' }}>Mount Zion School</h3>

                            <div style={{ color: '#334155', fontSize: '0.85rem', lineHeight: '1.8', marginBottom: '40px' }}>
                                <p>Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.</p>
                                <p style={{ marginTop: '15px' }}>It was established in 1994 and the purpose of starting this school was to give "Education to Everyone". From a humble beginning with the grace of God the school has now become a full-fledged institution. Mount Zion aims at educating different levels of students from different societies and communities and mould them in desired shapes. We give all the concerns for the scholastic and co-scholastic development of students by holding the core of the disciplinary steps. Apart from this the students are not only to excel in academic interests but also to understand that we all are made in the image of God, who wants to be fulfilled in life and work, in relationship with God, with each other and with the world He made for us to enjoy.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#000', textTransform: 'uppercase', marginBottom: '5px' }}>INFORMATION ABOUT SCHOOL</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>SCHOOL HOURS:</p>
                                    
                                    <p style={{ fontSize: '0.85rem', color: '#000', fontWeight: '900', marginTop: '10px' }}>DAY CLASS :</p>
                                    <div style={{ fontSize: '0.85rem', color: '#334155', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '5px 10px', marginTop: '5px' }}>
                                        <span>ASSEMBLY</span>
                                        <span>: 08:30 AM<br/><span style={{ paddingLeft: '10px' }}>Prayer / Pledges / Songs / Scripture</span></span>
                                        <span>CLASS</span>
                                        <span>: 08:45 AM to 02:15 PM</span>
                                        <span style={{ gridColumn: '1 / -1' }}>LUNCH BREAK: 11:25 AM to 11:50 AM</span>
                                    </div>
                                    
                                    <p style={{ fontSize: '0.85rem', color: '#000', fontWeight: '900', marginTop: '20px' }}>MORNING CLASS:</p>
                                    <div style={{ fontSize: '0.85rem', color: '#334155', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '5px 10px', marginTop: '5px' }}>
                                        <span>ASSEMBLY</span>
                                        <span>: 07:30 AM</span>
                                        <span>CLASS</span>
                                        <span>: 07:45 AM to 01:15 PM</span>
                                        <span style={{ gridColumn: '1 / -1' }}>LUNCH BREAK: 10:35 AM to 11:00 AM</span>
                                        <span style={{ gridColumn: '1 / -1' }}>Parents should take their child immediately when the class is Over.</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '10px' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#000', textTransform: 'uppercase', marginBottom: '5px' }}>TIME FOR SEEING THE PRINCIPAL</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
                                        09:30 AM to 11:00 AM (Day Class)<br/>
                                        08:30 AM to 10:00 AM (Morning Class)
                                    </p>
                                </div>

                                <div style={{ marginTop: '5px' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#000', textTransform: 'uppercase', marginBottom: '5px' }}>TIME FOR SEEING THE TEACHER</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
                                        Every Saturday after school hour with prior appointment<br/>
                                        through the school diary.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* ===== RULES & REGULATIONS ===== */}
            <section className="about-rules-section" id="rules" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '50px', alignItems: 'stretch' }}>
                        
                        <div className="rules-text-side" style={{ flex: '1.5' }}>
                            <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: '900', color: '#000' }}>Rules & Regulations</h2>
                            <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '25px' }}>Mount Zion School</h3>

                            <div className="about-description" style={{ color: '#1e293b', fontSize: '0.85rem', lineHeight: '1.6' }}>
                                <p style={{ marginBottom: '20px' }}><strong>MOUNT ZION SCHOOL</strong>, lays great stress on the development of character & conduct among the students and expects them to be worthy of highest standards of behaviour, individually & collectively in our lives. Courtesy, kindness, helpfulness and tolerance are virtues which they are particularly advised to cultivate. The following general rules of discipline should be observed strictly.</p>
                                
                                <ol style={{ paddingLeft: '20px', margin: 0, listStyleType: 'decimal' }}>
                                    <li style={{ marginBottom: '8px' }}>Children are strictly forbidden to go out of the school premises during school hours without permission of the Principal.</li>
                                    <li style={{ marginBottom: '8px' }}>Parents and Guardians are not allowed to see their wards or to visit teachers or to enter school verandah during school hours.</li>
                                    <li style={{ marginBottom: '8px' }}>Those who come on bicycle, should keep it at the cycle stand, properly locked.</li>
                                    <li style={{ marginBottom: '8px' }}>Once a student attends the school he/she will not be allowed any short leave. In case of emergency, the child can be escorted home by the parents, with the written permission of the Principal.</li>
                                    <li style={{ marginBottom: '8px' }}>No student should absent himself / herself, without prior sanction of leave for the school.</li>
                                    <li style={{ marginBottom: '8px' }}>The date of birth of a pupil as recorded in the admission register cannot be changed.</li>
                                    <li style={{ marginBottom: '8px' }}>All students should co-operate with the school office bearers in maintaining the over all discipline of the school.</li>
                                    <li style={{ marginBottom: '8px' }}>All equipments and materials given to the students for their practical works should be handled with due care. Damages & breakages should be paid for.</li>
                                    <li style={{ marginBottom: '8px' }}>The parents / guardians will not hold the school idemnified against any accident for any other reasonable cause.</li>
                                    <li style={{ marginBottom: '8px' }}>Every pupil is required to attend school - curricular and co -curricular activities in the prescribed uniform.</li>
                                    <li style={{ marginBottom: '8px' }}>It is the duty of the pupils to see that the school premises is kept clean and tidy. They are expected to take care of the school property.</li>
                                    <li style={{ marginBottom: '8px' }}>Parents/Guardians are advised to meet teacher only by prior appointment.</li>
                                    <li style={{ marginBottom: '8px' }}>A pupil may be sent home during school hours for violating any of the school rules.</li>
                                    <li style={{ marginBottom: '8px' }}>Malpractice of any kind in the examination will warrant to severe punishment, such as the cancellation of the examination, detentions of the result or even, rustication from the school.</li>
                                    <li style={{ marginBottom: '8px' }}>The Principal reserves the right to rusticate the student from the school whose conduct in his/her opinion is against good moral tone of the school. The Principal is the sole judge regarding the dismissal of a student.</li>
                                    <li style={{ marginBottom: '8px' }}>A progress report will be issued to the student after every terminal examination which should be returned duly signed by the parent/guardian within 3 days from its receipt.</li>
                                    <li style={{ marginBottom: '8px' }}>A student will not be permitted to appear in the Terminal examinations, Pre- Board or Annual Examination if his/her attendance is less than 75% before the particular examinations.</li>
                                    <li style={{ marginBottom: '8px' }}>Pupils whose fees are in arrears will not be permitted to appear in the examination.</li>
                                    <li style={{ marginBottom: '8px' }}>Parents are requested not to approach school teachers for private tuition.</li>
                                    <li style={{ marginBottom: '8px' }}>A student who fails in the same class for two years in succession would be rusticated from the school.</li>
                                    <li style={{ marginBottom: '8px' }}>The school fee covers 12 calender months, No reduction is made for absence or holiday in either school fee or conveyance.</li>
                                    <li style={{ marginBottom: '8px' }}>No books, periodicals or newspapers of any objectionable nature shall be brought to the school.</li>
                                    <li style={{ marginBottom: '8px' }}>No cell phones, cameras, walkman, transistor radios, watches and other similar items shall be brought to the school. Sharp objects, crackers or other harmful materials shall also not be brought to the school.</li>
                                    <li style={{ marginBottom: '8px' }}>Any loss or damage inflicted on the school property must be duly compensated by the one concerned.</li>
                                    <li style={{ marginBottom: '8px' }}>Apart from the rules above, the Principal has the right to make changes for the well-functioning of the school.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="rules-image-side" style={{ flex: '0.8', display: 'flex', flexDirection: 'column', gap: '15px', height: 'auto' }}>
                            <div className="rules-image-top" style={{ flex: '0.45', minHeight: '200px' }}>
                                <img src="/rule1.jpg" alt="Rules 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            
                            <div className="rules-image-bottom" style={{ flex: '0.55', display: 'flex', gap: '15px', minHeight: '250px' }}>
                                <div className="rules-image-bottom-left" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ flex: '1' }}>
                                        <img src="/rule2.jpg" alt="Rules 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: '1' }}>
                                        <img src="/rule3.jpg" alt="Rules 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div className="rules-image-bottom-right" style={{ flex: '1' }}>
                                    <img src="/rule4.jpg" alt="Rules 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                        <h3>MOUNT ZION SCHOOL</h3>
                                        <p className="footer-affiliation">Affiliated to CBSE, New Delhi upto +2 level</p>
                                        <p className="footer-affiliation-period">Period of Affiliation :2027</p>
                                    </div>
                                </div>
                                <div className="footer-social-circles">
                                    <a href={socials.facebook} className="social-circle" target="_blank" rel="noopener noreferrer"><svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="white"/><path d="M15.89 14.96L16.34 12.06H13.56V10.18C13.56 9.39 13.95 8.62 15.19 8.62H16.45V6.15C16.45 6.15 15.31 5.96 14.22 5.96C11.93 5.96 10.44 7.34 10.44 9.85V12.06H7.9V14.96H10.44V21.96C10.96 22.03 11.48 22.06 12 22.06C12.52 22.06 13.04 22.03 13.56 21.96V14.96H15.89Z" fill="#d31d2a"/></svg></a>
                                    <a href={socials.youtube || '#'} className="social-circle" target="_blank" rel="noopener noreferrer"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M21.582 6.186a2.66 2.66 0 0 0-1.87-1.884C18.062 3.86 12 3.86 12 3.86s-6.062 0-7.712.442a2.66 2.66 0 0 0-1.87 1.884C2 7.846 2 12 2 12s0 4.154.442 5.814a2.66 2.66 0 0 0 1.87 1.884C5.938 20.14 12 20.14 12 20.14s6.062 0 7.712-.442a2.66 2.66 0 0 0 1.87-1.884C22 16.154 22 12 22 12s0-4.154-.418-5.814z" fill="white"/><path d="M9.993 15.026V8.974L15.286 12l-5.293 3.026z" fill="#d31d2a"/></svg></a>
                                </div>
                            </div>

                            <div className="footer-col">
                                <h4>Useful Links</h4>
                                <ul className="footer-links">
                                    <li style={{ marginBottom: '8px' }}><Link to="/">Home</Link></li>
                                    <li style={{ marginBottom: '8px' }}><Link to="/about">About</Link></li>
                                    <li style={{ marginBottom: '8px' }}><Link to="/admission">Admission</Link></li>
                                    <li style={{ marginBottom: '8px' }}><Link to="/academics">Academics</Link></li>
                                </ul>
                            </div>

                            <div className="footer-col">
                                <h4>Support</h4>
                                <ul className="footer-links">
                                    <li style={{ marginBottom: '8px' }}><Link to="/curriculum">Curriculum</Link></li>
                                    <li style={{ marginBottom: '8px' }}><Link to="/gallery">Gallery</Link></li>
                                    <li style={{ marginBottom: '8px' }}><Link to="/notices">Notices</Link></li>
                                    <li style={{ marginBottom: '8px' }}><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>

                            <div className="footer-col">
                                <h4>Address</h4>
                                <div className="footer-address">
                                    <div className="address-block">
                                        <p>MOUNT ZION SCHOOL</p>
                                        <p>SION NAGAR</p>
                                        <p>PURNEA - 854301</p>
                                        <p>BIHAR</p>
                                    </div>
                                    <div className="contact-block">
                                        <p>Contact No. 6296490943</p>
                                        <p>Office Timing : 7.00 am to 1:30 pm (Summer)</p>
                                        <p>8.30 am to 2.30 pm (winter)</p>
                                        <p>Sunday Holiday</p>
                                    </div>
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
