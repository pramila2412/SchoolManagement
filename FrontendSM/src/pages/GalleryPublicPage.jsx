import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook, Youtube, MapPin, Search, Wallet, FileText, LogIn, Menu, X, Phone, Mail, ChevronRight, ChevronDown, ArrowRight, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './GalleryPublicPage.css';
import './LandingPage.css';

const API = '/api';

const CATEGORIES = ['All', 'Sports', 'School Tour', 'Programs and Events', 'Annual Day', 'Meetings'];

const VIDEO_GALLERY_DATA = [
    {
        videoLink: "https://www.youtube.com/embed/5Peo-ivmupE",
        videoTitle: "How to get started",
        videoPart: "Part 1",
        testimonialName: "Sandra Henry",
        testimonialRole: "Alumni - University Assistant",
        testimonialText: "\"Mount Zion School has shaped my child's character and confidence. The care and values they instill are truly exceptional.\"",
        testimonialImage: "/principal.jpeg"
    },
    {
        videoLink: "https://www.youtube.com/embed/5Peo-ivmupE",
        videoTitle: "Campus Tour & Facilities",
        videoPart: "Part 2",
        testimonialName: "John Doe",
        testimonialRole: "Parent",
        testimonialText: "\"The facilities and the teaching staff are world-class. We couldn't have asked for a better environment for our son.\"",
        testimonialImage: "/principal.jpeg"
    },
    {
        videoLink: "https://www.youtube.com/embed/5Peo-ivmupE",
        videoTitle: "Annual Day Highlights",
        videoPart: "Part 3",
        testimonialName: "Maria Garcia",
        testimonialRole: "Parent",
        testimonialText: "\"Seeing my daughter perform on stage with so much confidence brought tears to my eyes. Thank you Mount Zion!\"",
        testimonialImage: "/principal.jpeg"
    },
    {
        videoLink: "https://www.youtube.com/embed/5Peo-ivmupE",
        videoTitle: "Sports Achievements",
        videoPart: "Part 4",
        testimonialName: "David Smith",
        testimonialRole: "Alumni",
        testimonialText: "\"The sports infrastructure and coaching helped me secure a national level scholarship. Proud to be an alumni.\"",
        testimonialImage: "/principal.jpeg"
    }
];
export default function GalleryPublicPage() {
    const { user, logout } = useAuth();
    const [images, setImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    
    // For light box
    const [selectedImage, setSelectedImage] = useState(null);

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
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '15px' }}>
                            VIDEO GALLERY 
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: '#475569' }}>Moments that reflect our journey of learning, growth, and excellence.</p>
                    </div>

                    <div style={{ background: '#fcfaf6', display: 'flex', padding: '40px', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Left side: Video + Button */}
                        <div style={{ flex: '1.5', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ 
                                background: 'linear-gradient(135deg, #7c3aed 0%, rgba(139, 92, 246, 0.8) 50%, #93c5fd 100%)', 
                                borderRadius: '8px', 
                                aspectRatio: '16/9', 
                                position: 'relative', 
                                padding: isVideoPlaying ? '0' : '20px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                overflow: 'hidden'
                            }}>
                                {isVideoPlaying ? (
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={`${VIDEO_GALLERY_DATA[activeVideoIndex].videoLink}?autoplay=1`}
                                        title="YouTube video player" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    ></iframe>
                                ) : (
                                    <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: 0, top: '40%' }}>
                                                <span style={{ background: 'rgba(255,255,255,0.3)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '8px' }}>{VIDEO_GALLERY_DATA[activeVideoIndex].videoPart}</span>
                                                <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '500', letterSpacing: '0.5px' }}>{VIDEO_GALLERY_DATA[activeVideoIndex].videoTitle}</h3>
                                            </div>
                                            <div onClick={() => setIsVideoPlaying(true)} style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                                                <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '15px solid #fff', marginLeft: '5px' }}></div>
                                            </div>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                                            <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #fff' }}></div>
                                            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%', background: '#fff', borderRadius: '2px' }}></div>
                                                <div style={{ position: 'absolute', left: '30%', top: '50%', transform: 'translateY(-50%)', width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <a href="https://www.youtube.com/watch?v=5Peo-ivmupE" target="_blank" rel="noopener noreferrer" style={{ background: '#002147', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', width: 'max-content', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', borderRadius: '4px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.582 6.186a2.66 2.66 0 0 0-1.87-1.884C18.062 3.86 12 3.86 12 3.86s-6.062 0-7.712.442a2.66 2.66 0 0 0-1.87 1.884C2 7.846 2 12 2 12s0 4.154.442 5.814a2.66 2.66 0 0 0 1.87 1.884C5.938 20.14 12 20.14 12 20.14s6.062 0 7.712-.442a2.66 2.66 0 0 0 1.87-1.884C22 16.154 22 12 22 12s0-4.154-.418-5.814zM9.993 15.026V8.974L15.286 12l-5.293 3.026z"/>
                                </svg>
                                VISIT NOW
                            </a>
                        </div>
                        
                        {/* Right side: Testimonial */}
                        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ background: '#fff', padding: '30px 20px', borderRadius: '12px', width: '100%', maxWidth: '300px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative', marginTop: '20px' }}>
                                <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #22c55e', padding: '3px', background: '#fff' }}>
                                    <img src={VIDEO_GALLERY_DATA[activeVideoIndex].testimonialImage} alt="Parent" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                </div>
                                
                                <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#002147', opacity: 0.8 }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', color: '#f59e0b', fontSize: '0.8rem', gap: '2px', marginBottom: '10px' }}>
                                        ★ ★ ★ ★ ★
                                    </div>

                                    <h4 style={{ color: '#002147', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '2px' }}>{VIDEO_GALLERY_DATA[activeVideoIndex].testimonialName}</h4>
                                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{VIDEO_GALLERY_DATA[activeVideoIndex].testimonialRole}</span>
                                    
                                    <p style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic', lineHeight: '1.6', marginTop: '15px' }}>
                                        {VIDEO_GALLERY_DATA[activeVideoIndex].testimonialText}
                                    </p>
                                </div>
                            </div>

                            {/* Carousel dots below the card */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '25px' }}>
                                {VIDEO_GALLERY_DATA.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => { setActiveVideoIndex(idx); setIsVideoPlaying(false); }}
                                        style={{ 
                                            width: activeVideoIndex === idx ? '14px' : '10px', 
                                            height: activeVideoIndex === idx ? '14px' : '10px', 
                                            borderRadius: '50%', 
                                            border: activeVideoIndex === idx ? '1px solid #d97706' : 'none', 
                                            background: activeVideoIndex === idx ? 'transparent' : '#cbd5e1',
                                            padding: activeVideoIndex === idx ? '2px' : '0', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        {activeVideoIndex === idx && <div style={{ width: '6px', height: '6px', background: '#d97706', borderRadius: '50%' }}></div>}
                                    </div>
                                ))}
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
