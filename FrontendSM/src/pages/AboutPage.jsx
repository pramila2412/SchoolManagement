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
    pageTitle: 'About Mount Zion School',
    pageSubtitle: 'Nurturing Young Minds Since 1995',
    heroImage: '/school.jpeg',
    principalName: 'Dr. Jacob Samuel',
    principalTitle: 'OUR PRINCIPAL',
    principalImage: '/About.png',
    principalMessage: `<p>It is with immense pride and gratitude that I welcome you to Mount Zion School, an institution that has been a beacon of educational excellence since 1995.</p>
<p><strong>Our Journey: From Humble Beginnings to Remarkable Growth</strong><br/>Twenty-nine years ago, Mount Zion School began with a vision and unwavering faith. What started as a modest initiative with just 5 students has blossomed into a thriving educational community of over 600 students today.</p>
<p><strong>The Mount Zion Legacy:</strong><br/>When we opened our doors in 1995, we dreamed of creating more than just a school—we envisioned a nurturing environment where young minds could flourish, where character is built alongside academic achievement, and where every child discovers their unique potential.</p>`,
    mission: 'To provide quality education that nurtures the intellectual, physical, emotional, and spiritual growth of every student, preparing them to become responsible global citizens.',
    vision: 'To be a premier educational institution recognized for academic excellence, innovation, and the holistic development of students rooted in strong moral values.',
    coreValues: [
        { title: 'Excellence in Education', description: 'From our humble beginning with 5 students to our current strength of 600, our commitment to academic excellence has remained unwavering.' },
        { title: 'Holistic Development', description: 'We believe education extends far beyond textbooks. Our comprehensive approach encompasses academics, sports, arts, life skills, and moral values.' },
        { title: 'Individual Attention', description: 'Despite our growth, we have never lost sight of the individual. Each student at Mount Zion receives personalized attention.' },
        { title: 'Faith & Values', description: 'Rooted in strong moral and spiritual values, we guide our students to develop integrity, compassion, and responsibility.' }
    ],
    stats: [
        { number: '29+', label: 'Years of Excellence' },
        { number: '600+', label: 'Students Enrolled' },
        { number: '50+', label: 'Dedicated Faculty' },
        { number: '100%', label: 'Board Pass Rate' }
    ],
    milestones: [
        { year: '1995', title: 'Foundation', description: 'Mount Zion School was founded with just 5 students and a dream to provide quality education.' },
        { year: '2005', title: 'CBSE Affiliation', description: 'Achieved CBSE affiliation, marking a major milestone in our journey towards academic excellence.' },
        { year: '2015', title: 'Growing Community', description: 'Crossed 400+ students with state-of-the-art facilities including computer labs and science labs.' },
        { year: '2024', title: 'Modern Campus', description: 'Expanded to 600+ students with modern infrastructure, auditorium, and sports facilities.' }
    ]
};

export default function AboutPage() {
    const [aboutData, setAboutData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [rulesIndex, setRulesIndex] = useState(0);
    const [teamIndex, setTeamIndex] = useState(0);

    const rulesImages = ['/Rules1.png', '/Rules2.png', '/Rules3.png'];
    const teamImages = ['/Team1.png', '/Team2.png', '/Team3.png', '/Team4.png'];

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
                setAboutData({ ...DEFAULTS, ...data });
            }
        } catch (err) {
            console.warn('Could not fetch about data from backend, using defaults:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-page about-page">
            <PublicHeader />

            {/* ===== ABOUT US ===== */}
            <section className="about-us-section" id="about">
                <div className="section-container">
                    <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {/* Left Side: Images */}
                        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <img src="/About Us1.jpg" alt="About Mount Zion School Top" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
                            <img src="/About Us.png" alt="About Mount Zion School Bottom" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
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

                            <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '900', color: '#000' }}>About Us</h2>
                            <h3 style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '15px' }}>Mount Zion School</h3>

                            <div style={{ color: '#334155', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '15px' }}>
                                <p>Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.</p>
                                <p style={{ marginTop: '8px' }}>It was established in 1994 and the purpose of starting this school was to give "Education to Everyone". From a humble beginning with the grace of God the school has now become a full-fledged institution. Mount Zion aims at educating different levels of students from different societies and communities and mould them in desired shapes. We give all the concerns for the scholastic and co-scholastic development of students by holding the core of the disciplinary steps. Apart from this the students are not only to excel in academic interests but also to understand that we all are made in the image of God, who wants to be fulfilled in life and work, in relationship with God, with each other and with the world He made for us to enjoy.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#000', textTransform: 'uppercase', marginBottom: '5px' }}>INFORMATION ABOUT SCHOOL</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>SCHOOL HOURS:</p>
                                    
                                    <p style={{ fontSize: '0.85rem', color: '#000', fontWeight: '900', marginTop: '5px' }}>DAY CLASS :</p>
                                    <div style={{ fontSize: '0.85rem', color: '#334155', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '5px 10px', marginTop: '5px' }}>
                                        <span>ASSEMBLY</span>
                                        <span>: 08:30 AM<br/><span style={{ paddingLeft: '10px' }}>Prayer / Pledges / Songs / Scripture</span></span>
                                        <span>CLASS</span>
                                        <span>: 08:45 AM to 02:15 PM</span>
                                        <span style={{ gridColumn: '1 / -1' }}>LUNCH BREAK: 11:25 AM to 11:50 AM</span>
                                    </div>
                                    
                                    <p style={{ fontSize: '0.85rem', color: '#000', fontWeight: '900', marginTop: '10px' }}>MORNING CLASS:</p>
                                    <div style={{ fontSize: '0.85rem', color: '#334155', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '5px 10px', marginTop: '5px' }}>
                                        <span>ASSEMBLY</span>
                                        <span>: 07:30 AM</span>
                                        <span>CLASS</span>
                                        <span>: 07:45 AM to 01:15 PM</span>
                                        <span style={{ gridColumn: '1 / -1' }}>LUNCH BREAK: 10:35 AM to 11:00 AM</span>
                                        <span style={{ gridColumn: '1 / -1' }}>Parents should take their child immediately when the class is Over.</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '5px' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#000', textTransform: 'uppercase', marginBottom: '5px' }}>TIME FOR SEEING THE PRINCIPAL</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
                                        09:30 AM to 11:00 AM (Day Class)<br/>
                                        08:30 AM to 10:00 AM (Morning Class)
                                    </p>
                                </div>

                                <div style={{ marginTop: '5px' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#000', textTransform: 'uppercase', marginBottom: '5px' }}>TIME FOR SEEING THE TEACHER</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
                                        Every Saturday after school hour with prior appointment<br/>
                                        through the school diary.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* ===== RULES & REGULATIONS ===== */}
            <section className="about-rules-section" id="rules">
                <div className="section-container">
                    <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '900', color: '#000', marginLeft: '-40px' }}>Rules & Regulations</h2>
                    <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '40px', marginLeft: '-40px' }}>Mount Zion School</h3>

                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        
                        <div className="rules-text-side" style={{ flex: '1' }}>

                            <div className="about-description" style={{ color: '#1e293b', fontSize: '0.85rem', lineHeight: '1.6' }}>
                                <p style={{ marginBottom: '20px' }}><strong>MOUNT ZION SCHOOL</strong>, lays great stress on the development of character & conduct among the students and expects them to be worthy of highest standards of behaviour, individually & collectively in our lives. Courtesy, kindness, helpfulness and tolerance are virtues which they are particularly advised to cultivate. The following general rules of discipline should be observed strictly.</p>
                                
                                <ol style={{ paddingLeft: '20px', margin: 0, listStyleType: 'decimal' }}>
                                    <li style={{ marginBottom: '8px' }}>Children are strictly forbidden to go out of the school premises during school hours without permission of the Principal.</li>
                                    <li style={{ marginBottom: '8px' }}>Parents and Guardians are not allowed to see their wards or to visit teachers or to enter school verandah during school hours.</li>
                                    <li style={{ marginBottom: '8px' }}>Those who come on bicycle, should keep it at the cycle stand, properly locked.</li>
                                    <li style={{ marginBottom: '8px' }}>Once a student attends the school he/she will not be allowed any short leave. In case of emergency, the child can be escorted home by the parents, with the written permission of the Principal.</li>
                                    <li style={{ marginBottom: '8px' }}>No student should absent himself / herself, without prior sanction of leave for the school.</li>
                                    <li style={{ marginBottom: '8px' }}>The date of birth of a pupil as recorded in the admission register cannot be changed.</li>
                                    <li style={{ marginBottom: '8px' }}>All students should co-operate with the school office bearers in maintaining the over all discipline of the school.</li>
                                    <li style={{ marginBottom: '8px' }}>All equipments and materials given to the students for their practical works should be handled with due care. Damages & breakages should be paid for.</li>
                                    <li style={{ marginBottom: '8px' }}>The parents / guardians will not hold the school idemnified against any accident for any other reasonable cause.</li>
                                    <li style={{ marginBottom: '8px' }}>Every pupil is required to attend school - curricular and co -curricular activities in the prescribed uniform.</li>
                                    <li style={{ marginBottom: '8px' }}>It is the duty of the pupils to see that the school premises is kept clean and tidy. They are expected to take care of the school property.</li>
                                    <li style={{ marginBottom: '8px' }}>Parents/Guardians are advised to meet teacher only by prior appointment.</li>
                                    <li style={{ marginBottom: '8px' }}>A pupil may be sent home during school hours for violating any of the school rules.</li>
                                    <li style={{ marginBottom: '8px' }}>Malpractice of any kind in the examination will warrant to severe punishment, such as the cancellation of the examination, detentions of the result or even, rustication from the school.</li>
                                    <li style={{ marginBottom: '8px' }}>The Principal reserves the right to rusticate the student from the school whose conduct in his/her opinion is against good moral tone of the school. The Principal is the sole judge regarding the dismissal of a student.</li>
                                    <li style={{ marginBottom: '8px' }}>A progress report will be issued to the student after every terminal examination which should be returned duly signed by the parent/guardian within 3 days from its receipt.</li>
                                    <li style={{ marginBottom: '8px' }}>A student will not be permitted to appear in the Terminal examinations, Pre- Board or Annual Examination if his/her attendance is less than 75% before the particular examinations.</li>
                                    <li style={{ marginBottom: '8px' }}>Pupils whose fees are in arrears will not be permitted to appear in the examination.</li>
                                    <li style={{ marginBottom: '8px' }}>Parents are requested not to approach school teachers for private tuition.</li>
                                    <li style={{ marginBottom: '8px' }}>A student who fails in the same class for two years in succession would be rusticated from the school.</li>
                                    <li style={{ marginBottom: '8px' }}>The school fee covers 12 calender months, No reduction is made for absence or holiday in either school fee or conveyance.</li>
                                    <li style={{ marginBottom: '8px' }}>No books, periodicals or newspapers of any objectionable nature shall be brought to the school.</li>
                                    <li style={{ marginBottom: '8px' }}>No cell phones, cameras, walkman, transistor radios, watches and other similar items shall be brought to the school. Sharp objects, crackers or other harmful materials shall also not be brought to the school.</li>
                                    <li style={{ marginBottom: '8px' }}>Any loss or damage inflicted on the school property must be duly compensated by the one concerned.</li>
                                    <li style={{ marginBottom: '8px' }}>Apart from the rules above, the Principal has the right to make changes for the well-functioning of the school.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="rules-image-side" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '15px', height: 'auto', paddingTop: '100px' }}>
                            <div className="rules-image-top" style={{ flex: '0.45', minHeight: '200px' }}>
                                <img src="/rule1.jpg" alt="Rules 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            
                            <div className="rules-image-bottom" style={{ flex: '0.55', display: 'flex', gap: '15px', minHeight: '250px' }}>
                                <div className="rules-image-bottom-left" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ flex: '1' }}>
                                        <img src="/rule2.jpg" alt="Rules 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: '1' }}>
                                        <img src="/rule3.jpg" alt="Rules 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div className="rules-image-bottom-right" style={{ flex: '1' }}>
                                    <img src="/rule4.jpg" alt="Rules 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                        <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000' }}>Our Team</h2>
                    </div>
                    
                    <div className="team-description-center" style={{ textAlign: 'left', color: '#334155', fontSize: '0.9rem', lineHeight: '1.8', maxWidth: '1000px', margin: '0 auto 50px' }}>
                        <p style={{ marginBottom: '10px' }}>Mount Zion School is a Co-Educational English Medium School.</p>
                        <p>With its motto "Wisdom and Righteousness", we make every unremitting effort not only for academic performance but also for the physical, mental and intellectual development of our learners from various sectors of society by imparting quality education with self-discipline, self esteem and self confidence. Mount Zion School provides a safe and supportive environment to develop their skills for a future that reflects their highest aspiration and challenge to fly them as high as they can.</p>
                    </div>

                    <div className="team-carousel-wrapper" style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
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
                        <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#333' }}>Notices</h2>
                    </div>
                    
                    <div className="notice-card-container" style={{ maxWidth: '420px', margin: '0 auto', background: '#F3EADB', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div className="notice-card-image">
                            <img src="/news1.png" alt="Students" style={{ width: '100%', height: '200px', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                        </div>
                        <div className="notice-card-content" style={{ padding: '35px 30px 40px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                <p className="notice-subtitle" style={{ color: '#C25A41', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(194, 90, 65, 0.4)', paddingBottom: '8px', display: 'inline-block' }}>MOUNT ZION SCHOOL, PURNEA</p>
                            </div>
                            <h3 className="notice-title" style={{ color: '#B63A22', fontSize: '1.8rem', fontWeight: '900', margin: '0 0 5px' }}>SCHOOL CLOSED</h3>
                            <p className="notice-reason" style={{ color: '#B63A22', fontSize: '0.8rem', fontWeight: '700', margin: '0 0 35px', letterSpacing: '0.5px' }}>ON ACCOUNT OF MAKAR SANKRANTI FESTIVAL</p>
                            
                            <div className="notice-date-box" style={{ marginBottom: '25px', border: '1px solid #C25A41', background: '#fff' }}>
                                <div className="date-header" style={{ background: '#C25A41', color: '#fff', padding: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Closure Date</div>
                                <div className="date-body" style={{ padding: '15px', color: '#B63A22', fontSize: '0.9rem', fontWeight: '600', background: '#F3EADB' }}>14 January 2030 (Wednesday)</div>
                            </div>
                            
                            <p className="notice-info-text" style={{ color: '#B63A22', fontSize: '0.75rem', lineHeight: '1.6', margin: '0 0 25px', padding: '0 10px' }}>This is to inform parents and students that the school will remain closed on the above mentioned date due to the festival holiday.</p>
                            
                            <div className="notice-date-box" style={{ border: '1px solid #C25A41', background: '#fff' }}>
                                <div className="date-header" style={{ background: '#C25A41', color: '#fff', padding: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Reopening Date</div>
                                <div className="date-body" style={{ padding: '15px', color: '#B63A22', fontSize: '0.9rem', fontWeight: '600', background: '#F3EADB' }}>School will reopen on 15 January 2030 (Thursday)</div>
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
