import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Phone, Mail, Facebook, Youtube,
    ArrowRight, BookOpen, Users, Shield, Search,
    Menu, X, MapPin, ChevronRight, ChevronLeft, ChevronDown, GraduationCap,
    MessageCircle, ExternalLink, ArrowUpRight, Check,
    Wallet, FileText, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

export default function LandingPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        hero: {
            title: 'A Global Campus for Global Students',
            subtitle: 'With a faculty from over 100 countries, we foster a vibrant, inclusive community that is globally connected.',
            cta: "Apply / Admitted? Let's make it official!",
            image: '/mount school.jpeg'
        },
        announcements: {
            ticker: [
                'Admission Open for Session 2025-26',
                'CBSE Board Results 2024: 100% Pass Rate',
                'Summer Camp Registrations Started!'
            ],
            heroStrip: {
                text: 'Admission Inquiry for 2025-26 academic year is now open',
                link: '/admission',
                show: true
            }
        },
        facilities: [
            { title: 'Transport', image: '/Fac-Transport.png' },
            { title: 'Library', image: '/Fac-Library.png' },
            { title: 'Hostel', image: '/Fac-Hostel.png' },
            { title: 'Auditorium', image: '/Fac-Auditorium.png' },
            { title: 'Play Ground', image: '/Fac-Play.png' },
            { title: 'Computer Lab', image: '/Fac-computer.png' }
        ],
        gallery: [
            { title: 'Sports', category: 'Sports', image: '/Gallery1.png' },
            { title: 'School Tour', category: 'School Tour', image: '/Gallery2.png' },
            { title: 'Programs & Events', category: 'Programs & Events', image: '/Gallery3.png' },
            { title: 'Annual Day', category: 'Annual Day', image: '/Gallery5.png' },
            { title: 'Meetings', category: 'Meetings', image: '/Gallery4.png' }
        ],
        about: {
            title: "Principal's Message.",
            subtitle: 'Welcome to Mount Zion School',
            message: `
                <p style="margin-bottom: 20px; color: #1e293b; font-size: 0.9rem;"><strong>Motto: &nbsp;WISDOM AND RIGHTEOUSNESS</strong></p>
                <p>It is with great pride and joy that I welcome you to the official website of Mount Zion School, a place where learning meets values and dreams take flight.</p>
                <p>Our motto, WISDOM AND RIGHTEOUSNESS, is the guiding light of every step we take. At Mount Zion, we believe education must enlighten the mind with wisdom and strengthen the character with righteousness. We are committed to nurturing young minds who not only excel academically but also grow into compassionate, responsible citizens.</p>
                <p>Over the years, children in thousands have passed out from Mount Zion and are today serving society from reputed posts in Medical, Teaching, Administration, and Engineering. They are building up the society with integrity and excellence, and they remain our greatest achievement and pride.</p>
                <p>Our dedicated team of teachers works tirelessly to create a safe, inclusive, and stimulating environment where students are encouraged to ask questions, think creatively, and grow into lifelong learners.</p>
                <p>To our parents, thank you for your trust and partnership. Together, we will continue to guide our children toward a future filled with purpose and values.</p>
                <p>I invite you to explore our website and discover the Mount Zion spirit. May our children continue to Arise and Shine.</p>
                <div style="text-align: right; margin-top: 30px; font-size: 0.85rem; color: #1e293b;">
                    <p style="margin:0;">Warm regards,</p>
                    <p style="margin:4px 0 0 0; font-weight: 800; font-size: 0.95rem;">REENA ALBERT</p>
                    <p style="margin:0;">Principal.</p>
                </div>
            `,
            image: '/About.png'
        },
        news: ['/news1.png', '/news2.png'],
        achievements: ['/Achievement1.png', '/Achievement2.png', '/Achievement3.png', '/Achievement4.png'],
        testimonials: [
            {
                text: "Choosing this school was one of the best decisions I've ever made. The teachers are incredibly supportive and my child has grown so much.",
                author: "Ronald Richards",
                id: "Parent of Class 5 Student",
                image: "https://i.pravatar.cc/150?u=ronald"
            },
            {
                text: "The academic curriculum is rigorous but balanced perfectly with sports and extracurricular activities. We couldn't be happier with Mount Zion.",
                author: "Sarah Jenkins",
                id: "Parent of Class 8 Student",
                image: "https://i.pravatar.cc/150?u=sarah"
            },
            {
                text: "The dedication of the staff here is unmatched. They genuinely care about each student's personal and academic development.",
                author: "Michael Chen",
                id: "Parent of Class 10 Student",
                image: "https://i.pravatar.cc/150?u=michael"
            }
        ],
        connect: {
            title: "Stay Connected with",
            goldText: "Your Child's Progress",
            subtext: "The Mount Zion Parent Portal gives you real-time access to your child's academic journey, attendance, fees, and school communications.",
            features: [
                "View attendance records & daily reports",
                "Track academic performance & grades",
                "Access fee receipts & payment history",
                "Download circulars & notices",
                "Communicate with teachers",
                "View homework & assignments"
            ]
        },
        footer: {
            ctaText: "EMPOWERING EVERY CHILD TO REACH HIGHER.",
            address: "MOUNT ZION SCHOOL, SION NAGAR, PURNEA - 854301, BIHAR, Office Timing : 7.00 am to 1:30 pm (Summer), 8.30 am to 2.30 pm (winter), Sunday Holiday",
            copyright: "Copyright © 2025 Mount Zion School, Inc. All rights reserved."
        }
    });

    useEffect(() => {
        const updateItems = () => {
            if (window.innerWidth < 640) setItemsToShow(1.2);
            else if (window.innerWidth < 1024) setItemsToShow(2.2);
            else if (window.innerWidth < 1280) setItemsToShow(3.2);
            else setItemsToShow(3.8);
        };
        updateItems();
        window.addEventListener('resize', updateItems);
        return () => window.removeEventListener('resize', updateItems);
    }, []);

    const [facilityIndex, setFacilityIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);
    const [newsIndex, setNewsIndex] = useState(0);
    const [achievementIndex, setAchievementIndex] = useState(0);
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [portalTab, setPortalTab] = useState('parent');

    const CLONE_COUNT = 40;
    const facilitiesLooped = siteConfig?.facilities ? Array(CLONE_COUNT).fill(siteConfig.facilities).flat() : [];
    const newsLooped = siteConfig?.news ? Array(CLONE_COUNT).fill(siteConfig.news).flat() : [];
    const achievementsLooped = siteConfig?.achievements ? Array(CLONE_COUNT).fill(siteConfig.achievements).flat() : [];

    // Initialize to the middle on mount so user can scroll left or right endlessly For Notice Board 

// School events, Holidays, Admission Related Information , Vacancy, etc.

//  Academic 

// Salient Features of our School
// Important Notice 
// School Uniform
    useEffect(() => {
        if (siteConfig?.facilities) setFacilityIndex(Math.floor(CLONE_COUNT / 2) * siteConfig.facilities.length);
        if (siteConfig?.news) setNewsIndex(Math.floor(CLONE_COUNT / 2) * siteConfig.news.length);
        if (siteConfig?.achievements) setAchievementIndex(Math.floor(CLONE_COUNT / 2) * siteConfig.achievements.length);
    }, [siteConfig]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (siteConfig?.facilities?.length) {
                setFacilityIndex((prev) => prev + 1);
            }
            if (siteConfig?.achievements?.length) {
                setAchievementIndex((prev) => prev + 1);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [siteConfig]);

    const nextFacility = () => setFacilityIndex((prev) => prev + 1);
    const prevFacility = () => setFacilityIndex((prev) => prev - 1);

    const nextNews = () => setNewsIndex((prev) => prev + 1);
    const prevNews = () => setNewsIndex((prev) => prev - 1);

    const nextAchievement = () => setAchievementIndex((prev) => prev + 1);
    const prevAchievement = () => setAchievementIndex((prev) => prev - 1);

    const nextTestimonial = () => {
        if (!siteConfig?.testimonials) return;
        const maxValid = Math.max(0, siteConfig.testimonials.length - 1);
        setTestimonialIndex((prev) => prev >= maxValid ? 0 : prev + 1);
    };
    const prevTestimonial = () => {
        if (!siteConfig?.testimonials) return;
        const maxValid = Math.max(0, siteConfig.testimonials.length - 1);
        setTestimonialIndex((prev) => prev <= 0 ? maxValid : prev - 1);
    };

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

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const handleActionClick = () => {
        if (user) {
            navigate(user.role === 'Parent' ? '/parent-portal' : '/');
        } else {
            navigate('/login');
        }
    };

    const phone1 = siteConfig?.header?.phone1 || '01234 56789';
    const phone2 = siteConfig?.header?.phone2 || '98745 61230';
    const email = siteConfig?.header?.email || 'mountzionschool2021@gmail.com';
    const tickerItems = siteConfig?.announcements?.ticker || [
        'Admission Open for Session 2025-26',
        'Mount Zion School Ranked #1 in Purnea',
        'New Sports Complex Inaugurated'
    ];
    const heroTitle = siteConfig?.hero?.title || 'A Global Campus for Global Students';
    const heroSubtitle = siteConfig?.hero?.subtitle || 'With a faculty from over 100 countries, we foster a vibrant, inclusive community that is globally connected.';
    const heroImage = siteConfig?.hero?.image === '/school.png' ? '/mount school.jpeg' : (siteConfig?.hero?.image || '/mount school.jpeg');
    const heroStrip = siteConfig?.announcements?.heroStrip || {
        text: 'Admission Inquiry for 2025-26 academic year is now open',
        link: '/admission',
        show: true
    };
    const socials = siteConfig?.header?.socials || {};

    return (
        <div className="landing-page">
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
                        <Link to="/" className="nav-link active">Home <span className="nav-badge">FREE</span></Link>
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
                            <Link to="/contact" className="nav-link">Contact Us <ChevronDown size={14} className="nav-chevron" /></Link>
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

            <section className="landing-hero" style={{ backgroundImage: `url("${heroImage}")` }}>
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
                
                <div className="hero-announcement-strip">
                    <div className="strip-inner">
                        <span className="strip-heading">ANNOUNCEMENTS</span>
                        <div className="strip-divider"></div>
                        <div className="pulse-dot"></div>
                        <span className="strip-text">
                            Calls for admission for the academic year 2025-26 now online or <a href="https://maps.app.goo.gl/EqYY3hjh4gDCozwHA" target="_blank" rel="noopener noreferrer" className="strip-inline-link">visit our school</a>
                        </span>
                    </div>
                </div>
            </section>

            <section className="facilities-section">
                <div className="section-container">
                    <h2 className="section-title">Our Facilities</h2>
                    
                    <div className="facilities-carousel-wrapper">
                        <button className="carousel-arrow prev" onClick={prevFacility}>
                            <ChevronLeft size={24} />
                        </button>
                        
                        <div className="facilities-track-container">
                            <motion.div 
                                className="facilities-track"
                                animate={{ x: `-${facilityIndex * (100 / facilitiesLooped.length)}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{ 
                                    display: 'flex',
                                    width: `${(facilitiesLooped.length * 100) / itemsToShow}%`
                                }}
                            >
                                {facilitiesLooped.map((fac, idx) => (
                                    <div className="facility-card-item" key={idx}>
                                        <div 
                                            className="facility-card" 
                                            style={{ backgroundImage: `url(${fac.image})` }}
                                        >
                                            <div className="facility-overlay">
                                                <h4>{fac.title}</h4>
                                                <p>Know More</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        <button className="carousel-arrow next" onClick={nextFacility}>
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="carousel-dots">
                        {siteConfig.facilities.map((_, idx) => {
                            const length = siteConfig.facilities.length;
                            const currentMod = ((facilityIndex % length) + length) % length;
                            return (
                                <button 
                                    key={idx} 
                                    className={`dot ${currentMod === idx ? 'active' : ''}`}
                                    onClick={() => setFacilityIndex(facilityIndex + (idx - currentMod))}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="landing-gallery">
                <div className="section-container">
                    <div className="gallery-header" style={{ display: 'flex', justifyContent: 'flex-start', gap: '80px', alignItems: 'center', marginBottom: '40px' }}>
                        <h2 className="section-title" style={{ margin: 0, paddingLeft: 0, borderLeft: 'none' }}>Gallery</h2>
                        <Link to="/gallery" style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>
                            View More <div style={{ marginLeft: '8px', border: '1.5px solid #1e293b', borderRadius: '50%', padding: '3px', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowUpRight size={14} strokeWidth={2}/></div>
                        </Link>
                    </div>

                    <div className="gallery-bento">
                        {siteConfig.gallery.map((item, idx) => (
                            <div key={idx} className={`gallery-cell gallery-cell-${idx + 1}`}>
                                <img src={item.image} alt={item.title} />
                                <div className="gallery-label">{item.category}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="landing-about">
                <div className="section-container">
                    <div className="about-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        <div className="about-text-side" style={{ flex: 1.2 }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '180px', marginBottom: '10px' }}>
                                <h2 className="section-title" style={{ margin: 0, paddingLeft: 0, borderLeft: 'none' }}>{siteConfig.about.title}</h2>
                                <Link to="/about" style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>
                                    View More <div style={{ marginLeft: '8px', border: '1.5px solid #1e293b', borderRadius: '50%', padding: '3px', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowUpRight size={14} strokeWidth={2}/></div>
                                </Link>
                            </div>
                            
                            <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px' }}>{siteConfig.about.subtitle}</h3>
                            

                            <div className="about-description" dangerouslySetInnerHTML={{ __html: siteConfig.about.message }} style={{ color: '#334155', fontSize: '0.85rem', lineHeight: '1.6' }} />

                            <div className="about-social-row" style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '40px' }}>
                                <span className="visit-text" style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>Visit &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                                <div className="social-pill-container" style={{ display: 'flex', gap: '10px' }}>
                                    <a href={socials.facebook || '#'} className="social-circle" target="_blank" rel="noopener noreferrer" style={{ background: '#fed7aa', color: '#431407', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Facebook size={16} fill="#431407" strokeWidth={0}/></a>
                                    <a href={socials.youtube || '#'} className="social-circle" target="_blank" rel="noopener noreferrer" style={{ background: '#fed7aa', color: '#431407', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Youtube size={16} fill="#431407" strokeWidth={0}/></a>
                                </div>
                            </div>
                        </div>

                        <div className="about-image-side" style={{ flex: 1 }}>
                            <div className="principal-image-box" style={{ height: '100%' }}>
                                <img src={siteConfig.about.image} alt="About Us" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="landing-news">
                <div className="section-container">
                    <h2 className="section-title text-center">Latest News</h2>
                    
                    <div className="news-carousel-wrapper">
                        <button className="carousel-arrow prev" onClick={prevNews}>
                            <ChevronLeft size={24} />
                        </button>
                        
                        <div className="news-viewport">
                            <AnimatePresence mode="wait">
                                {siteConfig.news?.length > 0 && (
                                    <motion.div 
                                        key={newsIndex}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.4 }}
                                        className="news-image-container"
                                    >
                                        <img 
                                            src={siteConfig.news[((newsIndex % siteConfig.news.length) + siteConfig.news.length) % siteConfig.news.length]} 
                                            alt={`News ${newsIndex + 1}`} 
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button className="carousel-arrow next" onClick={nextNews}>
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="carousel-dots">
                        {siteConfig.news.map((_, idx) => {
                            const length = siteConfig.news.length;
                            const currentMod = ((newsIndex % length) + length) % length;
                            return (
                                <button 
                                    key={idx} 
                                    className={`dot ${currentMod === idx ? 'active' : ''}`}
                                    onClick={() => setNewsIndex(newsIndex + (idx - currentMod))}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            <section className="landing-achievements">
                <div className="section-container">
                    <h2 className="section-title text-center">Achievements</h2>
                    
                    <div className="facilities-carousel-wrapper">
                        <button className="carousel-arrow prev" onClick={prevAchievement}>
                            <ChevronLeft size={24} />
                        </button>
                        
                        <div className="facilities-track-container">
                            <motion.div 
                                className="facilities-track"
                                animate={{ x: `-${achievementIndex * (100 / achievementsLooped.length)}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{ 
                                    display: 'flex',
                                    width: `${(achievementsLooped.length * 100) / itemsToShow}%`
                                }}
                            >
                                {achievementsLooped.map((img, idx) => (
                                    <div className="facility-card-item" key={idx}>
                                        <div 
                                            className="facility-card achievement-card" 
                                            style={{ backgroundImage: `url(${img})` }}
                                        >
                                            {/* No overlay for achievement posters usually */}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        <button className="carousel-arrow next" onClick={nextAchievement}>
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="carousel-dots">
                        {siteConfig.achievements.map((_, idx) => {
                            const length = siteConfig.achievements.length;
                            const currentMod = ((achievementIndex % length) + length) % length;
                            return (
                                <button 
                                    key={idx} 
                                    className={`dot ${currentMod === idx ? 'active' : ''}`}
                                    onClick={() => setAchievementIndex(achievementIndex + (idx - currentMod))}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="landing-testimonials">
                <div className="section-container">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                        <h2 className="section-title" style={{ margin: 0, paddingLeft: 0, borderLeft: 'none' }}>Testimonials</h2>
                        <div style={{ border: '1.5px solid var(--mz-blue-dark)', borderRadius: '50%', padding: '4px', color: 'var(--mz-blue-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowUpRight size={20} strokeWidth={2}/>
                        </div>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card-main">
                            <div className="testimonial-content-box">
                                <AnimatePresence mode="wait">
                                    <motion.p 
                                        key={testimonialIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="testimonial-quote"
                                    >
                                        "{siteConfig.testimonials[testimonialIndex].text}"
                                    </motion.p>
                                </AnimatePresence>
                                
                                <div className="testimonial-footer">
                                    <div className="testimonial-author">
                                        <img src={siteConfig.testimonials[testimonialIndex].image} alt={siteConfig.testimonials[testimonialIndex].author} />
                                        <div className="author-info">
                                            <h4>{siteConfig.testimonials[testimonialIndex].author}</h4>
                                            <p>{siteConfig.testimonials[testimonialIndex].id}</p>
                                        </div>
                                    </div>
                                    <div className="testimonial-nav">
                                        <button className="nav-arrow" onClick={prevTestimonial}><ChevronLeft size={20}/></button>
                                        <button className="nav-arrow" onClick={nextTestimonial}><ChevronRight size={20}/></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="cta-box-red">
                            <div className="cta-inner-border">
                                <h3>ACCEPTING APPLICATIONS FOR FALL 2026!</h3>
                                <Link to="/admission" className="apply-now-btn">Apply Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stay Connected Section */}
            <section className="landing-connect">
                <div className="section-container">
                    <div className="connect-grid">
                        <div className="connect-text-side">
                            <h2 className="connect-heading">
                                {siteConfig.connect.title} <br/>
                                <span className="gold-text">{siteConfig.connect.goldText}</span>
                            </h2>
                            <p className="connect-subtext">
                                {siteConfig.connect.subtext}
                            </p>
                            
                            <ul className="connect-features-list">
                                {siteConfig.connect.features.map((feature, idx) => (
                                    <li key={idx}><Check size={18} className="gold-check"/> {feature}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="connect-form-side">
                            <div className="portal-login-card">
                                <div className="portal-header">
                                    <h3>{portalTab === 'parent' ? 'Parent Portal' : 'Student Portal'}</h3>
                                    <p>Mount Zion School, Purnea</p>
                                </div>
                                
                                <div className="portal-tabs">
                                    <button 
                                        className={`portal-tab ${portalTab === 'parent' ? 'active' : ''}`}
                                        onClick={() => setPortalTab('parent')}
                                    >Parent Login</button>
                                    <button 
                                        className={`portal-tab ${portalTab === 'student' ? 'active' : ''}`}
                                        onClick={() => setPortalTab('student')}
                                    >Student Login</button>
                                </div>

                                <div className="portal-form">
                                    <div className="form-group">
                                        <label>User ID / Mobile Number</label>
                                        <input type="text" placeholder="Enter your User ID or Mobile" />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" placeholder="Enter your password" />
                                    </div>
                                    <button className="portal-login-btn">Login to Portal</button>
                                    <a href="#" className="forgot-pass">Forgot Password? Click here</a>
                                </div>
                            </div>
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
