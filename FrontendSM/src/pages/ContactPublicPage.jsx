import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook, Youtube, MapPin, Search, Wallet, FileText, LogIn, Menu, X, Phone, Mail, ChevronRight, ChevronDown, Send, Clock, CheckCircle
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
            socials: { facebook: 'https://www.facebook.com/share/1DYSZWV8DU/', youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos' }
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

                                <button type="submit" style={{ width: '100%', padding: '14px', background: '#0B3C5D', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }}>
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
