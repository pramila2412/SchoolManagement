import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Phone, Mail, Facebook, Instagram, Youtube, Twitter, Linkedin, MapPin, Search, Wallet, FileText, LogIn, Menu, X, ChevronRight, ChevronDown, BookOpen, Clock, FileCheck, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './CurriculumPage.css';
import './LandingPage.css';

const API = '/api';

const DEFAULTS = {
    pageTitle: 'The Curriculum',
    pageSubtitle: 'The following subjects are taught at different levels:',
    heroImage: '/school.jpeg',
    levels: [
        {
            number: 1,
            title: 'The Foundation Level',
            subtitle: '(Nursery to Upper Kindergarten)',
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
};

export default function CurriculumPage() {
    const { user, logout } = useAuth();
    const [data, setData] = useState(DEFAULTS);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [siteConfig, setSiteConfig] = useState({
        header: {
            phone1: '6296490943',
            phone2: '6296490943',
            email: 'mountzionschool2021@gmail.com',
            socials: { facebook: 'https://www.facebook.com/share/1DYSZWV8DU/', youtube: '#', instagram: '#', whatsapp: '#' }
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
            try { setSiteConfig(prev => ({ ...prev, ...JSON.parse(saved) })); } catch {}
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API}/curriculum-page`);
                if (res.ok) {
                    const d = await res.json();
                    setData({ ...DEFAULTS, ...d });
                }
            } catch (err) {
                console.warn('Using default curriculum data:', err.message);
            }
        })();
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const phone1 = siteConfig?.header?.phone1 || '6296490943';
    const phone2 = siteConfig?.header?.phone2 || '6296490943';
    const email = siteConfig?.header?.email || 'mountzionschool2021@gmail.com';
    const socials = siteConfig?.header?.socials || {};

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.1 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="landing-page curriculum-page">
            {/* ===== TOP BAR ===== */}
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
                            <Link to="/about" className="nav-link">About <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/about" className="dropdown-item">About Mount Zion</Link>
                                <a href="/about#team" className="dropdown-item">The Team</a>
                                <a href="/about#rules" className="dropdown-item">Rules & Regulations</a>
                                <a href="/about#notices" className="dropdown-item">Notice</a>
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
                        <Link to="/curriculum" className="nav-link active">Curriculum</Link>
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
            <section className="curr-hero" style={{ backgroundImage: `url("${data.heroImage}")` }}>
                <div className="curr-hero-overlay"></div>
                <motion.div className="curr-hero-content" {...fadeInUp}>
                    <div className="about-breadcrumb">
                        <Link to="/">Home</Link>
                        <ChevronRight size={14} />
                        <span>Curriculum</span>
                    </div>
                    <h1>{data.pageTitle}</h1>
                    <p>{data.pageSubtitle}</p>
                </motion.div>
            </section>

            {/* ===== CURRICULUM LEVELS ===== */}
            <section className="curr-levels-section">
                <div className="section-container">
                    <div className="curr-masonry-grid">
                        {data.levels.map((level, idx) => (
                            <motion.div 
                                className="curr-level-card" 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <div className="curr-level-header" style={{ borderBottomColor: level.color }}>
                                    <div className="curr-level-number" style={{ color: level.color }}>
                                        {level.number}.
                                    </div>
                                    <div className="curr-level-title-wrap">
                                        <h3 style={{ color: level.color }}>{level.title}</h3>
                                        {level.subtitle && <span className="curr-level-subtitle">{level.subtitle}</span>}
                                    </div>
                                </div>
                                
                                {level.subjects && level.subjects.length > 0 && (
                                    <ul className="curr-subjects-list">
                                        {level.subjects.map((sub, sIdx) => (
                                            <li key={sIdx}>
                                                <div className="curr-bullet" style={{ backgroundColor: level.color }}></div>
                                                {sub}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {level.streams && level.streams.length > 0 && (
                                    <div className="curr-streams-container">
                                        {level.streams.map((stream, stIdx) => (
                                            <div className="curr-stream-block" key={stIdx}>
                                                <h4 className="curr-stream-name" style={{ color: stream.color }}>
                                                    <span className="curr-diamond" style={{ backgroundColor: stream.color }}></span>
                                                    {stream.name}
                                                </h4>
                                                <ul className="curr-subjects-list stream-list">
                                                    {stream.subjects.map((sub, sIdx) => (
                                                        <li key={sIdx}>
                                                            <div className="curr-bullet" style={{ backgroundColor: '#0ea5e9' }}></div>
                                                            {sub}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
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

            {/* ===== FOOTER ===== */}
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
