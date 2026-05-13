import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ChevronRight, ChevronLeft, GraduationCap,
    Check, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import './LandingPage.css';

export default function LandingPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [siteConfig, setSiteConfig] = useState({
        header: {
            phone: '6296490943',
            email: 'mountzionschool2021@gmail.com',
            socials: {
                facebook: 'https://www.facebook.com/share/1DYSZWV8DU/',
                youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos'
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

    const [facilityIndex, setFacilityIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);
    const [newsIndex, setNewsIndex] = useState(0);
    const [achievementIndex, setAchievementIndex] = useState(0);
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [portalTab, setPortalTab] = useState('parent');

    const CLONE_COUNT = 3;
    const facilitiesLooped = siteConfig?.facilities ? Array(CLONE_COUNT).fill(siteConfig.facilities).flat() : [];
    const newsLooped = siteConfig?.news ? Array(CLONE_COUNT).fill(siteConfig.news).flat() : [];
    const achievementsLooped = siteConfig?.achievements ? Array(CLONE_COUNT).fill(siteConfig.achievements).flat() : [];

    useEffect(() => {
        const updateItems = () => {
            if (window.innerWidth < 640) setItemsToShow(1);
            else if (window.innerWidth < 1024) setItemsToShow(2.2);
            else if (window.innerWidth < 1280) setItemsToShow(3.2);
            else setItemsToShow(3.8);
        };
        updateItems();
        window.addEventListener('resize', updateItems);
        return () => window.removeEventListener('resize', updateItems);
    }, []);

    useEffect(() => {
        if (siteConfig?.facilities) setFacilityIndex(Math.floor(CLONE_COUNT / 2) * siteConfig.facilities.length);
        if (siteConfig?.news) setNewsIndex(Math.floor(CLONE_COUNT / 2) * siteConfig.news.length);
        if (siteConfig?.achievements) setAchievementIndex(Math.floor(CLONE_COUNT / 2) * siteConfig.achievements.length);
    }, [siteConfig]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (siteConfig?.facilities?.length) {
                setFacilityIndex(prev => {
                    const max = Math.max(0, facilitiesLooped.length - Math.ceil(itemsToShow));
                    return prev >= max ? 0 : prev + 1;
                });
            }
            if (siteConfig?.achievements?.length) {
                setAchievementIndex(prev => {
                    const max = Math.max(0, achievementsLooped.length - Math.ceil(itemsToShow));
                    return prev >= max ? 0 : prev + 1;
                });
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [siteConfig, facilitiesLooped.length, achievementsLooped.length, itemsToShow]);

    const nextFacility = () => setFacilityIndex(prev => {
        const max = Math.max(0, facilitiesLooped.length - Math.ceil(itemsToShow));
        return prev >= max ? 0 : prev + 1;
    });
    const prevFacility = () => setFacilityIndex(prev => {
        const max = Math.max(0, facilitiesLooped.length - Math.ceil(itemsToShow));
        return prev <= 0 ? max : prev - 1;
    });

    const nextNews = () => setNewsIndex((prev) => prev + 1);
    const prevNews = () => setNewsIndex((prev) => prev - 1);

    const nextAchievement = () => setAchievementIndex(prev => {
        const max = Math.max(0, achievementsLooped.length - Math.ceil(itemsToShow));
        return prev >= max ? 0 : prev + 1;
    });
    const prevAchievement = () => setAchievementIndex(prev => {
        const max = Math.max(0, achievementsLooped.length - Math.ceil(itemsToShow));
        return prev <= 0 ? max : prev - 1;
    });

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
        const fetchLandingData = async () => {
            try {
                const response = await fetch('/api/landing-page');
                if (response.ok) {
                    const data = await response.json();
                    setSiteConfig(prev => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.error("Failed to fetch landing page config:", err);
            }
        };
        fetchLandingData();
    }, []);

    const heroTitle = siteConfig?.hero?.title || 'A Global Campus for Global Students';
    const heroSubtitle = siteConfig?.hero?.subtitle || 'With a faculty from over 100 countries, we foster a vibrant, inclusive community that is globally connected.';
    const heroImage = siteConfig?.hero?.image === '/school.png' ? '/mount school.jpeg' : (siteConfig?.hero?.image || '/mount school.jpeg');
    const socials = siteConfig?.header?.socials || {};

    return (
        <div className="landing-page">
            <PublicHeader />

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
                
                {siteConfig.announcements.heroStrip.show && (
                    <div className="hero-announcement-strip">
                        <div className="strip-inner">
                            <span className="strip-heading">ANNOUNCEMENTS</span>
                            <div className="strip-divider"></div>
                            <div className="pulse-dot"></div>
                            <span className="strip-text">
                                {siteConfig.announcements.heroStrip.text}
                                <Link to={siteConfig.announcements.heroStrip.link} className="strip-inline-link" style={{ marginLeft: '10px' }}>
                                    Learn More
                                </Link>
                            </span>
                        </div>
                    </div>
                )}
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
                                    <div className="facility-card-item" key={idx} style={{ flex: `0 0 ${100 / facilitiesLooped.length}%`, height: '100%' }}>
                                        <div style={{ 
                                            height: '100%',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: '0'
                                        }}>
                                            <img 
                                                src={fac.image} 
                                                alt={fac.title} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
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
                        <Link to="/gallery" className="view-more-link">
                            View More <div className="arrow-circle-small"><ArrowUpRight size={14} strokeWidth={2}/></div>
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
                    <div className="about-header-row" style={{ width: '100%', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h2 className="section-title">{siteConfig.about.title}</h2>
                        <Link to="/about" className="view-more-link">
                            View More <div className="arrow-circle-small"><ArrowUpRight size={14} strokeWidth={2}/></div>
                        </Link>
                    </div>

                    <div className="about-content-wrapper">
                        <div className="about-text-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px' }}>{siteConfig.about.subtitle}</h3>
                                <div className="about-description" dangerouslySetInnerHTML={{ __html: siteConfig.about.message }} style={{ color: '#334155', fontSize: '0.85rem', lineHeight: '1.6' }} />
                            </div>

                            <div className="uniform-visit-container" style={{ marginTop: '20px' }}>
                                <div className="uniform-visit">
                                    <span className="visit-text">Visit : </span>
                                    <a href={socials.youtube || '#'} target="_blank" rel="noopener noreferrer" className="visit-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#022a4d" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.582 6.186a2.66 2.66 0 0 0-1.87-1.884C18.062 3.86 12 3.86 12 3.86s-6.062 0-7.712.442a2.66 2.66 0 0 0-1.87 1.884C2 7.846 2 12 2 12s0 4.154.442 5.814a2.66 2.66 0 0 0 1.87 1.884C5.938 20.14 12 20.14 12 20.14s6.062 0 7.712-.442a2.66 2.66 0 0 0 1.87-1.884C22 16.154 22 12 22 12s0-4.154-.418-5.814zM9.993 15.026V8.974L15.286 12l-5.293 3.026z"/>
                                        </svg>
                                    </a>
                                    <a href={socials.facebook || '#'} target="_blank" rel="noopener noreferrer" className="visit-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#022a4d" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                                        </svg>
                                    </a>
                                </div>
                                <hr className="visit-divider" />
                            </div>

                        </div>

                        <div className="about-image-side">
                            <div className="principal-image-box">
                                <img src={siteConfig.about.image} alt="About Us" />
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
                                className="facilities-track achievements-track"
                                animate={{ x: `-${achievementIndex * (100 / achievementsLooped.length)}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{ 
                                    display: 'flex',
                                    width: `${(achievementsLooped.length * 100) / itemsToShow}%`
                                }}
                            >
                                {achievementsLooped.map((img, idx) => (
                                    <div className="facility-card-item" key={idx} style={{ flex: `0 0 ${100 / achievementsLooped.length}%`, height: '100%' }}>
                                        <div style={{ 
                                            height: '100%',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <img 
                                                src={img} 
                                                alt="Achievement" 
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#f8fafc' }}
                                            />
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
                    <div className="section-header-centered">
                        <h2 className="section-title">Testimonials</h2>
                        <div className="title-arrow-icon">
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
                                        <div className="author-photo-wrapper">
                                            <img src={siteConfig.testimonials[testimonialIndex].image} alt={siteConfig.testimonials[testimonialIndex].author} />
                                        </div>
                                        <div className="author-info">
                                            <h4>{siteConfig.testimonials[testimonialIndex].author}</h4>
                                            <p>{siteConfig.testimonials[testimonialIndex].id}</p>
                                        </div>
                                    </div>
                                    <div className="testimonial-nav">
                                        <button className="nav-arrow" onClick={prevTestimonial} aria-label="Previous testimonial"><ChevronLeft size={20}/></button>
                                        <button className="nav-arrow" onClick={nextTestimonial} aria-label="Next testimonial"><ChevronRight size={20}/></button>
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


            <PublicFooter />
        </div>
    );
}
