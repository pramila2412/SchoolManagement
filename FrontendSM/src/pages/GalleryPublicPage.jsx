import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook, Instagram, Youtube, Twitter, Linkedin, MapPin, Search, Wallet, FileText, LogIn, Menu, X, Phone, Mail, ChevronRight, ChevronDown, ArrowRight, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './GalleryPublicPage.css';
import './LandingPage.css';

const API = '/api';

const CATEGORIES = ['All', 'Sports', 'School Tour', 'Programs and Events', 'Annual Day', 'Meetings'];

export default function GalleryPublicPage() {
    const { user, logout } = useAuth();
    const [images, setImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // For light box
    const [selectedImage, setSelectedImage] = useState(null);

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
        const fetchGallery = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API}/gallery`);
                if (res.ok) {
                    const data = await res.json();
                    setImages(data);
                }
            } catch (err) {
                console.error('Error fetching gallery:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const phone1 = siteConfig?.header?.phone1 || '6296490943';
    const phone2 = siteConfig?.header?.phone2 || '6296490943';
    const email = siteConfig?.header?.email || 'mountzionschool2021@gmail.com';
    const socials = siteConfig?.header?.socials || {};

    const filteredImages = activeCategory === 'All' 
        ? images 
        : images.filter(img => img.category === activeCategory);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.1 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="landing-page gallery-public-page">
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
                        <Link to="/curriculum" className="nav-link">Curriculum</Link>
                        <div className="nav-divider"></div>
                        <Link to="/gallery" className="nav-link active">Gallery</Link>
                        <div className="nav-divider"></div>
                        <span className="nav-link">Contact Us</span>
                    </div>
                    <button className="mobile-menu-btn lg-hide" onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            {/* ===== DARK NAVIGATION CATEGORIES ===== */}
            <section style={{ backgroundColor: '#002147', color: 'white', padding: '40px 0' }}>
                <div className="section-container" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '0', display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                        Browse All <ChevronDown size={14} style={{ marginLeft: '5px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '20px' }}>
                        <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Sports</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li>Basket Ball</li>
                                <li>Cricket</li>
                                <li>Kabadi</li>
                            </ul>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>School Tours</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li>Ooty</li>
                                <li>Kodaikanal</li>
                                <li>Hyderabad Film City</li>
                            </ul>
                        </div>
                        <div style={{ flex: '1', minWidth: '200px', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Programs & Events</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li>Independence Day</li>
                                <li>Teachers Day</li>
                                <li>Environment Day</li>
                                <li>Childrens Day</li>
                            </ul>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Annual Day</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li>Group Dance</li>
                                <li>Group Song</li>
                                <li>Fancy Dress</li>
                                <li>Mono Act</li>
                                <li>Preach</li>
                            </ul>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Meetings</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li>PTA</li>
                                <li>Teachers & Staffs</li>
                                <li>Seminars</li>
                                <li>Science Club</li>
                                <li>Arts Club</li>
                                <li>Groups</li>
                                <li>Alumnis</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== IMAGE GALLERY SECTION ===== */}
            <section style={{ padding: '60px 0', background: '#fff' }}>
                <div className="section-container">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontStyle: 'italic', marginBottom: '30px', color: '#334155' }}>Basket Ball Winners</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', background: '#fff', padding: '15px' }}>
                                <img src={`/Gallery${i % 4 + 1}.png`} alt="Basket Ball" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                            </div>
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px', gap: '15px' }}>
                        <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#d8b4e2', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>1</button>
                        <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#d8b4e2', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>2</button>
                        <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#d8b4e2', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>3</button>
                        <button style={{ background: 'transparent', border: 'none', color: '#334155', fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                            Next <ChevronRight size={16} style={{ marginLeft: '5px' }} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== VIDEO GALLERY SECTION ===== */}
            <section style={{ padding: '80px 0', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
                <div className="section-container" style={{ maxWidth: '1000px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '15px' }}>Video Gallery</h2>
                        <p style={{ fontSize: '1.1rem', color: '#475569' }}>Moments that reflect our journey of learning, growth, and excellence.</p>
                    </div>

                    <div style={{ background: '#faf8f5', borderRadius: '16px', display: 'flex', overflow: 'hidden', minHeight: '400px', position: 'relative', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '300px', padding: '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#334155', lineHeight: '1.2', marginBottom: '15px' }}>What Parents are saying</h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '30px', maxWidth: '300px' }}>We already made a lot of beautiful journey of amazing stories that inspire you</p>
                            <button style={{ background: '#002147', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px', cursor: 'pointer', width: 'max-content', display: 'flex', alignItems: 'center' }}>
                                <Youtube size={16} style={{ marginRight: '8px' }} /> VISIT NOW
                            </button>
                        </div>
                        
                        <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
                            <img src="/principal.jpeg" alt="Video thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <div style={{ width: '0', height: '0', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid #002147', marginLeft: '4px' }}></div>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: '#d97706', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                                <ArrowRight size={20} />
                            </div>
                        </div>

                        {/* Testimonial Overlay Card */}
                        <div style={{ position: 'absolute', top: '50%', right: '40px', transform: 'translateY(-50%)', background: '#fff', padding: '30px', borderRadius: '12px', width: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} className="testimonial-card">
                            <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', width: '50px', height: '50px', borderRadius: '50%', border: '3px solid #fff', overflow: 'hidden' }}>
                                <img src="/principal.jpeg" alt="Parent" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <h4 style={{ color: '#0369a1', fontWeight: 'bold', fontSize: '1rem', marginBottom: '2px' }}>Sandra Henry</h4>
                                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Alumni - University Assistant</span>
                                
                                <div style={{ color: '#f59e0b', margin: '10px 0', fontSize: '0.9rem' }}>★★★★★</div>
                                
                                <div style={{ fontSize: '2rem', color: '#0369a1', lineHeight: '0.5', textAlign: 'left', marginTop: '10px' }}>"</div>
                                <p style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', lineHeight: '1.6' }}>
                                    "Mount Zion School has shaped my child's character and confidence. The care and values they instill are truly exceptional."
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Testimonial Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #d97706', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '6px', height: '6px', background: '#d97706', borderRadius: '50%' }}></div>
                        </div>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1', alignSelf: 'center' }}></div>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1', alignSelf: 'center' }}></div>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1', alignSelf: 'center' }}></div>
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
