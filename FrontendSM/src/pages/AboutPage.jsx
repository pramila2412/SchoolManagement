import React, { useState, useEffect } from 'react';
import { Facebook, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import './AboutPage.css';
import './LandingPage.css';

const API = '/api';

// Default fallback data
const DEFAULTS = {
    aboutUs: {
        title: 'About Us',
        subtitle: 'Mount Zion School',
        content: '<p>Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.</p><p style="margin-top: 8px;">It was established in 1994 and the purpose of starting this school was to give "Education to Everyone". From a humble beginning with the grace of God the school has now become a full-fledged institution. Mount Zion aims at educating different levels of students from different societies and communities and mould them in desired shapes. We give all the concerns for the scholastic and co-scholastic development of students by holding the core of the disciplinary steps. Apart from this the students are not only to excel in academic interests but also to understand that we all are made in the image of God, who wants to be fulfilled in life and work, in relationship with God, with each other and with the world He made for us to enjoy.</p><div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;"><div style="display: none;">HARDCODED HOURS AND RULES MOVED TO DB</div></div>',
        image1: '/About Us1.jpg',
        image2: '/About Us.png',
        visitUrl: 'https://www.facebook.com/share/1DYSZWV8DU/'
    },
    rules: {
        title: 'Rules & Regulations',
        subtitle: 'Mount Zion School',
        content: '<p style="margin-bottom: 20px;"><strong>MOUNT ZION SCHOOL</strong>, lays great stress on the development of character & conduct among the students and expects them to be worthy of highest standards of behaviour, individually & collectively in our lives. Courtesy, kindness, helpfulness and tolerance are virtues which they are particularly advised to cultivate. The following general rules of discipline should be observed strictly.</p><ol style="padding-left: 20px; margin: 0; list-style-type: decimal;"><li style="margin-bottom: 8px;">Children are strictly forbidden to go out of the school premises during school hours without permission of the Principal.</li><li style="margin-bottom: 8px;">Parents and Guardians are not allowed to see their wards or to visit teachers or to enter school verandah during school hours.</li><li style="margin-bottom: 8px;">Those who come on bicycle, should keep it at the cycle stand, properly locked.</li></ol>',
        images: ['/rule1.jpg', '/rule2.jpg', '/rule3.jpg', '/rule4.jpg']
    },
    team: {
        title: 'Our Team',
        content: '<p style="margin-bottom: 10px;">Mount Zion School is a Co-Educational English Medium School.</p><p>With its motto "Wisdom and Righteousness", we make every unremitting effort not only for academic performance but also for the physical, mental and intellectual development of our learners from various sectors of society by imparting quality education with self-discipline, self esteem and self confidence. Mount Zion School provides a safe and supportive environment to develop their skills for a future that reflects their highest aspiration and challenge to fly them as high as they can.</p>',
        images: ['/Team1.png', '/Team2.png', '/Team3.png', '/Team4.png']
    },
    notices: {
        sectionTitle: 'Notices',
        image: '/news1.png',
        subtitle: 'MOUNT ZION SCHOOL, PURNEA',
        title: 'SCHOOL CLOSED',
        reason: 'ON ACCOUNT OF MAKAR SANKRANTI FESTIVAL',
        closureDate: '14 January 2030 (Wednesday)',
        reopeningDate: 'School will reopen on 15 January 2030 (Thursday)',
        infoText: 'This is to inform parents and students that the school will remain closed on the above mentioned date due to the festival holiday.'
    },
    schoolHours: {
        title: 'INFORMATION ABOUT SCHOOL',
        content: ''
    }
};

export default function AboutPage() {
    const [aboutData, setAboutData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [rulesIndex, setRulesIndex] = useState(0);
    const [teamIndex, setTeamIndex] = useState(0);

    const rulesImages = aboutData.rules.images || DEFAULTS.rules.images;
    const teamImages = aboutData.team.images || DEFAULTS.team.images;

    const nextRule = () => setRulesIndex((prev) => (prev + 1) % rulesImages.length);
    const prevRule = () => setRulesIndex((prev) => (prev - 1 + rulesImages.length) % rulesImages.length);

    const nextTeam = () => setTeamIndex((prev) => (prev + 1) % teamImages.length);
    const prevTeam = () => setTeamIndex((prev) => (prev - 1 + teamImages.length) % teamImages.length);

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const res = await fetch(`${API}/about`);
            if (res.ok) {
                const data = await res.json();
                setAboutData({
                    aboutUs: { ...DEFAULTS.aboutUs, ...(data.aboutUs || {}) },
                    rules: { ...DEFAULTS.rules, ...(data.rules || {}) },
                    team: { ...DEFAULTS.team, ...(data.team || {}) },
                    notices: { ...DEFAULTS.notices, ...(data.notices || {}) },
                    schoolHours: { ...DEFAULTS.schoolHours, ...(data.schoolHours || {}) }
                });
            }
        } catch (err) {
            console.warn('Could not fetch about data from backend, using defaults:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const cleanHTML = (html) => {
        if (!html) return '';
        return html.replace(/&nbsp;/g, ' ');
    };

    return (
        <div className="landing-page about-page">
            <PublicHeader />

            {/* ===== ABOUT US ===== */}
            <section className="about-us-section" id="about">
                <div className="section-container">
                    <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <img src={aboutData.aboutUs.image} alt="About Mount Zion School" style={{ width: '100%', objectFit: 'cover', display: 'block', borderRadius: '8px' }} />
                        </div>

                        {/* Right Side: Text & Information */}
                        <div style={{ flex: '1.2', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                            {/* Top right Visit */}
                            <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>Visit &nbsp;&nbsp;:</span>
                                <a href="https://www.facebook.com/share/1DYSZWV8DU/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', background: '#000', borderRadius: '50%', color: '#fff', textDecoration: 'none' }}>
                                    <Facebook fill="#fff" strokeWidth={0} size={14} style={{ marginLeft: '1px', marginTop: '1px' }}/>
                                </a>
                            </div>

                            <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '900', color: '#000' }}>{aboutData.aboutUs.title}</h2>
                            <h3 style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '15px' }}>{aboutData.aboutUs.subtitle}</h3>

                            <div className="about-rich-content" dangerouslySetInnerHTML={{ __html: cleanHTML(aboutData.aboutUs.content) }} />
                            
                            {/* School Information / Hours integrated below content */}
                            <div className="about-rich-content school-hours-rich-content" dangerouslySetInnerHTML={{ __html: cleanHTML(aboutData.schoolHours.content) }} />
                        </div>
                    </div>
                </div>
            </section>
            {/* ===== RULES & REGULATIONS ===== */}
            <section className="about-rules-section" id="rules">
                <div className="section-container">
                    <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '900', color: '#000' }}>{aboutData.rules.title}</h2>
                    <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '40px' }}>{aboutData.rules.subtitle}</h3>

                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        
                        <div className="rules-text-side" style={{ flex: '1' }}>

                            <div className="about-rich-content" dangerouslySetInnerHTML={{ __html: cleanHTML(aboutData.rules.content) }} />
                        </div>

                        <div className="rules-image-side" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '15px', height: 'auto', paddingTop: '100px' }}>
                            <div className="rules-image-top" style={{ flex: '0.45', minHeight: '200px' }}>
                                <img src={rulesImages[0]} alt="Rules 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            
                            <div className="rules-image-bottom" style={{ flex: '0.55', display: 'flex', gap: '15px', minHeight: '250px' }}>
                                <div className="rules-image-bottom-left" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ flex: '1' }}>
                                        <img src={rulesImages[1]} alt="Rules 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: '1' }}>
                                        <img src={rulesImages[2]} alt="Rules 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div className="rules-image-bottom-right" style={{ flex: '1' }}>
                                    <img src={rulesImages[3]} alt="Rules 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            {/* ===== OUR TEAM ===== */}
            <section className="about-team-section" id="team">
                <div className="section-container">
                    <div className="team-header-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000' }}>{aboutData.team.title}</h2>
                    </div>
                    
                    <div className="about-rich-content" dangerouslySetInnerHTML={{ __html: cleanHTML(aboutData.team.content) }} style={{ textAlign: 'left', margin: '0 auto 50px' }} />

                    <div className="team-carousel-wrapper" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                        <AnimatePresence mode="wait">
                            <motion.img 
                                key={teamIndex}
                                src={teamImages[teamIndex]} 
                                alt={`Our Team ${teamIndex + 1}`} 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4 }}
                                style={{ width: '100%', borderRadius: '0', display: 'block' }} 
                            />
                        </AnimatePresence>
                        <div className="team-arrows" style={{ position: 'absolute', top: '50%', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 20px', transform: 'translateY(-50%)' }}>
                            <button className="team-carousel-arrow prev" onClick={prevTeam} style={{ width: '40px', height: '40px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f59e0b', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}><ChevronLeft size={20}/></button>
                            <button className="team-carousel-arrow next" onClick={nextTeam} style={{ width: '40px', height: '40px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f59e0b', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}><ChevronRight size={20}/></button>
                        </div>
                        <div className="carousel-dots-bottom" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                            {teamImages.map((_, idx) => (
                                <span key={idx} onClick={() => setTeamIndex(idx)} className={`dot ${idx === teamIndex ? 'active' : ''}`} style={{ width: '8px', height: '8px', background: idx === teamIndex ? '#475569' : '#e2e8f0', borderRadius: '50%', cursor: 'pointer' }}></span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== NOTICES ===== */}
            <section className="about-notices-section" id="notices">
                <div className="section-container">
                    <div className="notices-header-center" style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#333' }}>{aboutData.notices.sectionTitle}</h2>
                    </div>
                    
                    <div className="notice-card-container" style={{ maxWidth: '420px', margin: '0 auto', background: '#F3EADB', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div className="notice-card-image">
                            <img src={aboutData.notices.image} alt="Students" style={{ width: '100%', height: '200px', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                        </div>
                        <div className="notice-card-content" style={{ padding: '35px 30px 40px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                <p className="notice-subtitle" style={{ color: '#C25A41', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(194, 90, 65, 0.4)', paddingBottom: '8px', display: 'inline-block' }}>{aboutData.notices.subtitle}</p>
                            </div>
                            <h3 className="notice-title" style={{ color: '#B63A22', fontSize: '1.8rem', fontWeight: '900', margin: '0 0 5px' }}>{aboutData.notices.title}</h3>
                            <p className="notice-reason" style={{ color: '#B63A22', fontSize: '0.8rem', fontWeight: '700', margin: '0 0 35px', letterSpacing: '0.5px' }}>{aboutData.notices.reason}</p>
                            
                            <div className="notice-date-box" style={{ marginBottom: '25px', border: '1px solid #C25A41', background: '#fff' }}>
                                <div className="date-header" style={{ background: '#C25A41', color: '#fff', padding: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Closure Date</div>
                                <div className="date-body" style={{ padding: '15px', color: '#B63A22', fontSize: '0.9rem', fontWeight: '600', background: '#F3EADB' }}>{aboutData.notices.closureDate}</div>
                            </div>
                            
                            <p className="notice-info-text" style={{ color: '#B63A22', fontSize: '0.75rem', lineHeight: '1.6', margin: '0 0 25px', padding: '0 10px' }}>{aboutData.notices.infoText}</p>
                            
                            <div className="notice-date-box" style={{ border: '1px solid #C25A41', background: '#fff' }}>
                                <div className="date-header" style={{ background: '#C25A41', color: '#fff', padding: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Reopening Date</div>
                                <div className="date-body" style={{ padding: '15px', color: '#B63A22', fontSize: '0.9rem', fontWeight: '600', background: '#F3EADB' }}>{aboutData.notices.reopeningDate}</div>
                            </div>
                        </div>
                        <div className="notice-card-footer" style={{ height: '35px', background: '#AEA194' }}></div>
                    </div>
                </div>
            </section>


            
            <PublicFooter />
        </div>
    );
}
