import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Phone, Mail, Facebook, Twitter, Instagram, Youtube,
    ArrowRight, BookOpen, Users, Shield, Search,
    Menu, X, MapPin, ChevronRight, ChevronLeft, GraduationCap,
    MessageCircle, ExternalLink, ArrowUpRight, Linkedin, Check,
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
            phone1: '+91 89434 94547',
            phone2: '+91 89434 94548',
            email: 'mountzion@gmail.com',
            socials: {
                facebook: 'https://facebook.com',
                youtube: 'https://youtube.com',
                instagram: 'https://instagram.com',
                whatsapp: 'https://wa.me/918943494547'
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
            title: 'Knowing Dr.Jacob Samuel',
            subtitle: 'OUR PRINCIPAL',
            message: `
                <p>It is with immense pride and gratitude that I welcome you to Mount Zion School, an institution that has been a beacon of educational excellence since 1995.</p>
                <p><strong>Our Journey: From Humble Beginnings to Remarkable Growth</strong><br/>
                Twenty-nine years ago, Mount Zion School began with a vision and unwavering faith. What started as a modest initiative with just 5 students has blossomed into a thriving educational community of over 600 students today. This extraordinary growth is not merely a testament to increasing numbers, but a reflection of the trust that generations of parents have placed in us, and the dedication of our exceptional faculty.</p>
                <p><strong>The Mount Zion Legacy :</strong><br/>
                When we opened our doors in 1995, we dreamed of creating more than just a school—we envisioned a nurturing environment where young minds could flourish, where character is built alongside academic achievement, and where every child discovers their unique potential. Today, that dream stands realized in the laughter of our students, the pride of our parents, and the achievements of our alumni.</p>
                <p><strong>Our Core Values</strong><br/>
                <strong>Excellence in Education</strong><br/>
                From our humble beginning with 5 students to our current strength of 600, our commitment to academic excellence has remained unwavering. We combine traditional values with modern teaching methodologies, ensuring our students are prepared for the challenges of tomorrow.</p>
                <p><strong>Holistic Development</strong><br/>
                We believe education extends far beyond textbooks. Our comprehensive approach encompasses academics, sports, arts, life skills, and moral values—nurturing well-rounded individuals ready to contribute meaningfully to society.</p>
                <p><strong>Individual Attention</strong><br/>
                Despite our growth, we have never lost sight of the individual. Each student at Mount Zion receives personalized attention, ensuring no child is left behind and every talent is discovered and nurtured.</p>
            `,
            image: '/About.png'
        },
        news: ['/news1.png', '/news2.png'],
        achievements: ['/Achievement1.png', '/Achievement2.png', '/Achievement3.png', '/Achievement4.png'],
        testimonials: [
            {
                text: "Choosing this school was one of the best decisions I've ever made.",
                author: "Ronald Richards",
                id: "ID: 132-44-4589",
                image: "https://i.pravatar.cc/150?u=ronald"
            }
        ],
        connect: {
            title: "Stay Connected with",
            goldText: "Your Child's Progress",
            subtext: "The Mount Zion Parent Portal gives you real-time access to your child's academic journey.",
            features: ["Attendance", "Performance", "Fees"]
        },
        footer: {
            ctaText: "EMPOWERING EVERY CHILD TO REACH HIGHER.",
            address: "Emily Hattson 940 Goldendale Dr, Wasilla, Alaska 99654, USA",
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

    // Initialize to the middle on mount so user can scroll left or right endlessly
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
    const email = siteConfig?.header?.email || 'mountzionpurnea@gmail.com';
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
                        <Link to="/" className="nav-link active">Home <span className="nav-badge">FREE</span></Link>
                        <div className="nav-divider"></div>
                        <Link to="/about" className="nav-link">About</Link>
                        <div className="nav-divider"></div>
                        <Link to="/admission" className="nav-link">Admission</Link>
                        <div className="nav-divider"></div>
                        <Link to="/academics" className="nav-link">Academics</Link>
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
                            Calls for admission for the academic year 2025-26 now online or <Link to="/admission" className="strip-inline-link">visit our school</Link>
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
                    <div className="gallery-header">
                        <h2 className="section-title">Gallery</h2>
                        <Link to="/gallery" className="view-more-btn">
                            <span>View More</span>
                            <div className="arrow-circle">
                                <ArrowUpRight size={20} />
                            </div>
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
                    <div className="about-content-wrapper">
                        <div className="about-text-side">
                            <div className="about-header-row">
                                <h2 className="section-title">About Us</h2>
                                <Link to="/about" className="view-more-btn">
                                    <span>View More</span>
                                    <div className="arrow-circle">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </Link>
                            </div>
                            
                            <h3 className="about-subheading">{siteConfig.about.title}</h3>
                            <p className="about-label">{siteConfig.about.subtitle}</p>

                            <div className="about-description" dangerouslySetInnerHTML={{ __html: siteConfig.about.message }} />

                            <div className="about-social-row">
                                <span className="visit-text">Visit &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :</span>
                                <div className="social-pill-container">
                                    <a href="#" className="social-pill fb"><Facebook size={18}/></a>
                                    <a href="#" className="social-pill ig"><Instagram size={18}/></a>
                                    <a href="#" className="social-pill tw"><Twitter size={18}/></a>
                                    <a href="#" className="social-pill li"><Linkedin size={18}/></a>
                                </div>
                            </div>
                        </div>

                        <div className="about-image-side">
                            <div className="principal-image-box">
                                <img src={siteConfig.about.image} alt="Principal" />
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
                    <h2 className="section-title text-center">Testimonials</h2>

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
                                        <h3>MOUNT ZION</h3>
                                        <h3>SCHOOL</h3>
                                    </div>
                                </div>
                                <div className="footer-social-circles">
                                    <a href="#" className="social-circle"><Facebook size={16}/></a>
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
                                    <a href="#" className="map-link">
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
