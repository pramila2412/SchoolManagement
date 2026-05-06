import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook, Youtube, MapPin, Search, Wallet, FileText, LogIn, Menu, X, ChevronRight, ChevronDown, Phone, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './CoCurricularPage.css';
import './LandingPage.css';

const DEFAULTS = {
    levels: [
        {
            number: 1,
            title: 'The Foundation Level:',
            subtitle: '(Nursery to Upper Kindergarten)',
            color: '#ef4444',
            subjects: ['English', 'Hindi', 'Mathematics', 'Environmental Science', 'Physical Education', 'Art'],
            streams: []
        },
        {
            number: 2,
            title: 'Primary Level',
            subtitle: '',
            color: '#ef4444',
            subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit (Std III onwards)', 'General Knowledge', 'Moral Values', 'Information Technology', 'Art'],
            streams: []
        },
        {
            number: 3,
            title: 'Middle Level',
            subtitle: '',
            color: '#ef4444',
            subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit', 'General Knowledge', 'Moral Values', 'Information Technology', 'Art'],
            streams: []
        },
        {
            number: 4,
            title: 'Secondary Level',
            subtitle: '',
            color: '#ef4444',
            subjects: ['English', 'Hindi/Sanskrit', 'Mathematics', 'Science', 'Social Studies', 'Information Technology', 'Physical Education'],
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
                    color: '#1e293b',
                    subjects: ['English Core', 'Hindi/Sanskrit', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Physical Education']
                },
                {
                    name: 'Commerce Stream',
                    color: '#1e293b',
                    subjects: ['English Core', 'Business Studies', 'Accountancy', 'Economics', 'Hindi/Sanskrit', 'Physical Education']
                },
                {
                    name: 'Humanities Stream',
                    color: '#1e293b',
                    subjects: ['English Core', 'Hindi/Sanskrit', 'History', 'Geography', 'Economics', 'Political Science', 'Physical Education']
                }
            ]
        }
    ]
};

export default function CoCurricularPage() {
    const { user, logout } = useAuth();
    const [data] = useState(DEFAULTS);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [utilityMenuOpen, setUtilityMenuOpen] = useState(false);
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
        window.scrollTo(0, 0);
    }, []);

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

    return (
        <div className="landing-page">
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
                        <div className="footer-logo-text" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', margin: 0, whiteSpace: 'nowrap' }}>MOUNT ZION SCHOOL</h3>
                            <p className="footer-affiliation" style={{ fontSize: '0.75rem', marginTop: '2px', whiteSpace: 'nowrap' }}>Affiliated to CBSE, New Delhi upto +2 level</p>
                            <p className="footer-affiliation-period" style={{ fontSize: '0.7rem', marginTop: '4px', whiteSpace: 'nowrap' }}>Period of Affiliation :2027</p>
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
                                <Link to="/about#team" className="dropdown-item">The Team</Link>
                                <Link to="/about#rules" className="dropdown-item">Rules & Regulations</Link>
                                <Link to="/about#notices" className="dropdown-item">Notice</Link>
                            </div>
                        </div>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/admission" className="nav-link">Admission <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/admission#procedure" className="dropdown-item">Admission Procedure</Link>
                                <Link to="/admission#fee" className="dropdown-item">Fee & Payment</Link>
                                <Link to="/admission#result" className="dropdown-item">Admission Result-2026</Link>
                            </div>
                        </div>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/academics" className="nav-link active">Academics <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/academics#curriculum" className="dropdown-item">Curriculum</Link>
                                <Link to="/academics#uniform" className="dropdown-item">School Uniform</Link>
                            </div>
                        </div>
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

            {/* ===== THE CURRICULUM SECTION ===== */}
            <section style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container" style={{ maxWidth: '1200px' }}>
                    <div style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        {/* Text Side */}
                        <div style={{ flex: '1' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000', marginBottom: '10px' }}>The Curriculum</h2>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#94a3b8', marginBottom: '30px' }}>Mount Zion School</h3>
                            
                            <p style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '20px' }}>
                                The following subjects are taught at different levels:
                            </p>

                            <div className="curriculum-list" style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                {data.levels.map((level, idx) => (
                                    <div key={idx} style={{ marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <span style={{ color: level.color }}>{level.number}.</span>
                                            <div>
                                                <span style={{ color: level.color }}>{level.title}</span>
                                                {level.subtitle && <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>{level.subtitle}</span>}
                                            </div>
                                        </div>
                                        
                                        {level.subjects && level.subjects.length > 0 && (
                                            <ul style={{ listStyleType: 'disc', paddingLeft: '25px', marginTop: '5px' }}>
                                                {level.subjects.map((sub, sIdx) => (
                                                    <li key={sIdx}>{sub}</li>
                                                ))}
                                            </ul>
                                        )}

                                        {level.streams && level.streams.length > 0 && (
                                            <ul style={{ listStyleType: 'disc', paddingLeft: '25px', marginTop: '5px' }}>
                                                {level.streams.map((stream, stIdx) => (
                                                    <React.Fragment key={stIdx}>
                                                        <li style={{ color: '#1e293b' }}>{stream.name}</li>
                                                        {stream.subjects.map((sub, sIdx) => (
                                                            <li key={`sub-${sIdx}`} style={{ color: '#1e293b' }}>{sub}</li>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image Side */}
                        <div style={{ flex: '1.5', minWidth: '300px' }}>
                            <div className="acad-img-grid" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1.4fr 1fr', 
                                gap: '15px',
                                height: '100%'
                            }}>
                                <div style={{ gridColumn: '1 / -1', height: '100%' }}>
                                    <img src="/curriculum1.jpg" alt="Curriculum 1" style={{ width: '100%', height: '100%', minHeight: '250px', objectFit: 'cover', display: 'block' }} />
                                </div>
                                <div style={{ gridColumn: '1 / 2', height: '100%' }}>
                                    <img src="/curriculum2.jpg" alt="Curriculum 2" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '4/3' }} />
                                </div>
                                <div style={{ gridColumn: '2 / 3', gridRow: '2 / 4', height: '100%' }}>
                                    <img src="/curriculum3.jpg" alt="Curriculum 3" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                </div>
                                <div style={{ gridColumn: '1 / 2', height: '100%' }}>
                                    <img src="/curriculum4.jpg" alt="Curriculum 4" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '4/3' }} />
                                </div>
                            </div>
                        </div>
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
                            
                            <div className="mobile-nav-item">
                                <Link to="/about" onClick={toggleMobileMenu}>About</Link>
                                <div className="mobile-sub-nav">
                                    <Link to="/about" onClick={toggleMobileMenu}>About Mount Zion</Link>
                                    <Link to="/about#team" onClick={toggleMobileMenu}>The Team</Link>
                                    <Link to="/about#rules" onClick={toggleMobileMenu}>Rules & Regulations</Link>
                                    <Link to="/about#notices" onClick={toggleMobileMenu}>Notice</Link>
                                </div>
                            </div>

                            <div className="mobile-nav-item">
                                <Link to="/admission" onClick={toggleMobileMenu}>Admission</Link>
                                <div className="mobile-sub-nav">
                                    <Link to="/admission#procedure" onClick={toggleMobileMenu}>Admission Procedure</Link>
                                    <Link to="/admission#fee" onClick={toggleMobileMenu}>Fee & Payment</Link>
                                    <Link to="/admission#result" onClick={toggleMobileMenu}>Admission Result-2026</Link>
                                </div>
                            </div>

                            <div className="mobile-nav-item">
                                <Link to="/academics" onClick={toggleMobileMenu}>Academics</Link>
                                <div className="mobile-sub-nav">
                                    <Link to="/academics#curriculum" onClick={toggleMobileMenu}>Curriculum</Link>
                                    <Link to="/academics#uniform" onClick={toggleMobileMenu}>School Uniform</Link>
                                </div>
                            </div>

                            <Link to="/gallery" onClick={toggleMobileMenu}>Gallery</Link>
                            <Link to="/contact" onClick={toggleMobileMenu}>Contact Us</Link>
                            
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }}></div>
                            
                            <span className="mobile-link" onClick={toggleMobileMenu}><Wallet size={18} style={{marginRight: '10px'}}/> Pay Now</span>
                            <span className="mobile-link" onClick={toggleMobileMenu}><FileText size={18} style={{marginRight: '10px'}}/> TC</span>
                            
                            {user ? (
                                <>
                                    <Link to="/" onClick={toggleMobileMenu}>Dashboard</Link>
                                    <span style={{ cursor: 'pointer', color: '#ff4757', fontWeight: 600 }} onClick={() => { logout(); toggleMobileMenu(); }}>Logout</span>
                                </>
                            ) : (
                                <Link to="/login" onClick={toggleMobileMenu}><LogIn size={18} style={{marginRight: '10px'}}/> Login</Link>
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
                                    <a href="https://maps.app.goo.gl/EqYY3hjh4gDCozwHA" target="_blank" rel="noopener noreferrer" className="map-link">
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
