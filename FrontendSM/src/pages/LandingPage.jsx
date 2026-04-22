import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Phone, Mail, Facebook, Twitter, Instagram, Youtube,
    ArrowRight, BookOpen, Users, Shield, Search,
    Menu, X, MapPin, ChevronRight, GraduationCap,
    MessageCircle, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

export default function LandingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [siteConfig, setSiteConfig] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('mzs_site_config');
        if (saved) {
            setSiteConfig(JSON.parse(saved));
        }
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const handleActionClick = () => {
        if (user) {
            navigate(user.role === 'Parent' ? '/parent-portal' : '/');
        } else {
            navigate('/login');
        }
    };

    // Default values if config not set
    const phone1 = siteConfig?.header?.phone1 || '01234 56789';
    const phone2 = siteConfig?.header?.phone2 || '98745 61230';
    const email = siteConfig?.header?.email || 'mountzionpurnea@gmail.com';
    const tickerItems = siteConfig?.announcements?.ticker || [
        'Admission Open for Session 2025-26',
        'Mount Zion School Ranked #1 in Purnea',
        'New Sports Complex Inaugurated'
    ];
    const heroTitle = siteConfig?.hero?.title || 'A Global Campus for Global Students';
    const heroSubtitle = siteConfig?.hero?.subtitle || 'With a faculty from over 100 countries, we foster a vibrant, inclusive community that is globally connected.';
    const heroStrip = siteConfig?.announcements?.heroStrip || {
        text: 'Admission Inquiry for 2025-26 academic year is now open',
        link: '/admission',
        show: true
    };
    const socials = siteConfig?.header?.socials || {};

    return (
        <div className="landing-page">
            {/* Top Bar */}
            <div className="landing-top-bar">
                <div className="top-bar-content">
                    <div className="top-left-socials">
                        <a href={socials.facebook} className="social-icon"><Facebook size={14}/></a>
                        <a href={socials.youtube} className="social-icon"><Youtube size={14}/></a>
                        <a href={socials.instagram} className="social-icon"><Instagram size={14}/></a>
                        <a href={socials.whatsapp} className="social-icon"><MessageCircle size={14}/></a>
                    </div>
                    <div className="top-contact-info">
                        <a href={`tel:${phone1}`} className="top-info-item"><Phone size={13}/> {phone1}</a>
                        <a href={`tel:${phone2}`} className="top-info-item"><Phone size={13}/> {phone2}</a>
                        <a href={`mailto:${email}`} className="top-info-item hide-tablet"><Mail size={13}/> {email}</a>
                    </div>
                    <div className="top-right-links">
                        <span className="top-link">Pay Now</span>
                        <div className="v-divider"></div>
                        <span className="top-link">TC</span>
                        <div className="v-divider"></div>
                        <Link to="/login" className="top-link login-btn">Login</Link>
                        <div className="top-search-box">
                            <input type="text" placeholder="Search..." />
                            <Search size={14} className="search-icon-small" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header / Nav */}
            <header className="landing-header">
                <div className="header-inner">
                    <div className="school-logo">
                        <img src="https://via.placeholder.com/50x50?text=MZ" alt="MZ Logo" />
                        <div className="school-logo-text">
                            <h2>MOUNT ZION</h2>
                            <p>SCHOOL, PURNEA</p>
                        </div>
                    </div>

                    <nav className="landing-nav">
                        <div className="nav-item-wrap">
                            <Link to="/" className="nav-link active">Home <span className="nav-badge">FREE</span></Link>
                            <div className="nav-divider"></div>
                        </div>
                        <div className="nav-item-wrap">
                            <span className="nav-link">About</span>
                            <div className="nav-divider"></div>
                        </div>
                        <div className="nav-item-wrap">
                            <span className="nav-link">Admission</span>
                            <div className="nav-divider"></div>
                        </div>
                        <div className="nav-item-wrap">
                            <Link to="/academics" className="nav-link">Academics</Link>
                            <div className="nav-divider"></div>
                        </div>
                        <div className="nav-item-wrap">
                            <span className="nav-link">Career</span>
                            <div className="nav-divider"></div>
                        </div>
                        <div className="nav-item-wrap">
                            <span className="nav-link">Gallery</span>
                            <div className="nav-divider"></div>
                        </div>
                        <div className="nav-item-wrap">
                            <span className="nav-link">Contact Us</span>
                        </div>
                    </nav>

                    <button className="mobile-menu-btn lg-hide" onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            {/* Scrolling News Ticker */}
            <div className="news-ticker-bar">
                <div className="ticker-label">LATEST NEWS :</div>
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

            {/* Hero Section */}
            <section className="landing-hero" style={{ backgroundImage: `url("/school.png")` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="hero-heading">{heroTitle}</h1>
                        <p className="hero-description">{heroSubtitle}</p>
                    </motion.div>
                </div>
                
                {/* Hero Announcement Base Strip */}
                {heroStrip.show && (
                    <div className="hero-announcement-strip">
                        <div className="strip-inner">
                            <div className="pulse-dot"></div>
                            <span className="strip-text">{heroStrip.text}</span>
                            <Link to={heroStrip.link} className="strip-link">Click Here <ChevronRight size={16}/></Link>
                        </div>
                    </div>
                )}
            </section>

            {/* Features Preview */}
            <section className="features-preview">
                <div className="section-container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon-box"><Shield size={24}/></div>
                            <h4>Secure Campus</h4>
                            <p>Advanced security systems monitoring 24/7.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon-box"><GraduationCap size={24}/></div>
                            <h4>Excellence</h4>
                            <p>Proven track record of academic success.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon-box"><Users size={24}/></div>
                            <h4>Community</h4>
                            <p>A diverse student body from all walks of life.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Mobile Nav */}
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
                            <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
                            <Link to="/academics" onClick={toggleMobileMenu}>Academics</Link>
                            <span>About Us</span>
                            <span>Contact</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="simple-landing-footer">
                <p>&copy; 2026 Mount Zion School. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
