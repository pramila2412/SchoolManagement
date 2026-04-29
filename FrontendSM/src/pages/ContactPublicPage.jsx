import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook, Instagram, Youtube, Twitter, Linkedin, MapPin, Search, Wallet, FileText, LogIn, Menu, X, Phone, Mail, ChevronRight, ChevronDown, Send, Clock, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './ContactPublicPage.css';
import './LandingPage.css';

const API = '/api';

const DEFAULTS = {
    pageTitle: 'Contact Us',
    pageSubtitle: 'We would love to hear from you',
    heroImage: '/contact.jpeg',
    address: {
        name: 'MOUNT ZION SCHOOL',
        street: 'SION NAGAR',
        cityState: 'PURNEA - 854301, BIHAR'
    },
    contactNumbers: ['6296490943'],
    emails: ['mountzionschool@gmail.com', 'mountzionschool2021@gmail.com'],
    officeTiming: {
        summer: '7.00 am to 1:30 pm (Summer)',
        winter: '8.30 am to 2.30 pm (Winter)',
        holidays: 'Sunday Holiday'
    }
};

export default function ContactPublicPage() {
    const { user, logout } = useAuth();
    const [data, setData] = useState(DEFAULTS);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
    const [statusMessage, setStatusMessage] = useState('');

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
                const res = await fetch(`${API}/contact/page`);
                if (res.ok) {
                    const d = await res.json();
                    setData({ ...DEFAULTS, ...d });
                }
            } catch (err) {
                console.warn('Using default contact data:', err.message);
            }
        })();
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const phone1 = siteConfig?.header?.phone1 || '6296490943';
    const phone2 = siteConfig?.header?.phone2 || '6296490943';
    const emailHeader = siteConfig?.header?.email || 'mountzionschool2021@gmail.com';
    const socials = siteConfig?.header?.socials || {};

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            const res = await fetch(`${API}/contact/inquire`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await res.json();
            
            if (res.ok) {
                setSubmitStatus('success');
                setStatusMessage(result.message);
                setFormData({ name: '', email: '', phone: '', message: '' });
                
                // Hide success message after 5 seconds
                setTimeout(() => setSubmitStatus(null), 5000);
            } else {
                setSubmitStatus('error');
                setStatusMessage(result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setStatusMessage('Failed to send message. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.1 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="landing-page contact-public-page">
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
                        <a href={`mailto:${emailHeader}`} className="top-info-item hide-tablet"><Mail size={13}/> {emailHeader}</a>
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
                        <Link to="/curriculum" className="nav-link">Curriculum</Link>
                        <div className="nav-divider"></div>
                        <Link to="/gallery" className="nav-link">Gallery</Link>
                        <div className="nav-item-dropdown">
                            <Link to="/contact" className="nav-link active">Contact Us <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <a href="/contact#get-in-touch" className="dropdown-item">Get in touch</a>
                                <a href="/contact#map" className="dropdown-item">See on map</a>
                            </div>
                        </div>
                    </div>
                    <button className="mobile-menu-btn lg-hide" onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            {/* ===== NEW CONTACT SECTION ===== */}
            <section id="get-in-touch" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container" style={{ maxWidth: '1200px' }}>
                    <div style={{ display: 'flex', borderRadius: '0', overflow: 'hidden', boxShadow: 'none', border: 'none' }}>
                        <div style={{ flex: '1', padding: '60px 80px 60px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '15px', color: '#0f172a' }}>Get in touch</h2>
                            <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '1.05rem' }}>Our friendly team would love to hear from you.</p>

                            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ flex: '1' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>First name</label>
                                        <input type="text" name="firstName" placeholder="First name" required style={{ width: '100%', padding: '12px 15px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' }} />
                                    </div>
                                    <div style={{ flex: '1' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Last name</label>
                                        <input type="text" name="lastName" placeholder="Last name" required style={{ width: '100%', padding: '12px 15px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Email</label>
                                    <input type="email" name="email" placeholder="you@company.com" required style={{ width: '100%', padding: '12px 15px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Phone number</label>
                                    <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{ background: '#fff', padding: '12px 15px', borderRight: '1px solid #cbd5e1', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.95rem', cursor: 'pointer' }}>
                                            US <ChevronDown size={14} />
                                        </div>
                                        <input type="tel" name="phone" placeholder="+1 (555) 000-0000" style={{ flex: '1', padding: '12px 15px', border: 'none', fontSize: '0.95rem', outline: 'none' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Message</label>
                                    <textarea name="message" rows="4" style={{ width: '100%', padding: '12px 15px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', resize: 'vertical', outline: 'none' }}></textarea>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '5px' }}>
                                    <input type="checkbox" id="privacy" required style={{ marginTop: '4px', cursor: 'pointer' }} />
                                    <label htmlFor="privacy" style={{ fontSize: '0.9rem', color: '#64748b', cursor: 'pointer' }}>
                                        You agree to our friendly <a href="#" style={{ color: '#64748b', textDecoration: 'underline' }}>privacy policy</a>.
                                    </label>
                                </div>

                                <button type="submit" style={{ width: '100%', padding: '14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }}>
                                    Send message
                                </button>
                            </form>
                        </div>
                        <div style={{ flex: '1', display: 'flex' }}>
                            <img src="/getintouch.png" alt="Contact" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MAP SECTION ===== */}
            <section id="map" style={{ padding: '0 0 80px 0', background: '#fff' }}>
                <div className="section-container" style={{ maxWidth: '1200px' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', marginBottom: '40px', color: '#1e293b' }}>SEE ON MAP</h2>
                    <div style={{ width: '100%', maxWidth: '700px', height: '450px', borderRadius: '0', overflow: 'hidden', margin: '0 auto' }}>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.3367401412197!2d87.4447969!3d25.7924625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eff99ea1e7f3bd%3A0x698a31e366250485!2sMount%20Zion%20School!5e0!3m2!1sen!2sin!4v1777440961542!5m2!1sen!2sin" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mount Zion School Location Map"
                        ></iframe>
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
