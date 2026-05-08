import React, { useState, useEffect } from 'react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import './CurriculumPage.css';
import './LandingPage.css';

const API = '/api';

const DEFAULTS = {
    pageTitle: 'The Curriculum',
    pageSubtitle: 'The following subjects are taught at different levels:',
    heroImage: '/school.jpeg',
    levels: [
        {
            number: 1,
            title: 'The Foundation Level',
            subtitle: '(Nursery to Upper Kindergarten)',
            color: '#1CA7A6',
            subjects: ['English', 'Hindi', 'Mathematics', 'Environmental Science', 'Physical Education', 'Art'],
            streams: []
        },
        {
            number: 2,
            title: 'Primary Level',
            subtitle: '',
            color: '#0B3C5D',
            subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit (Std III onwards)', 'General Knowledge', 'Moral Values', 'Information Technology', 'Art'],
            streams: []
        },
        {
            number: 3,
            title: 'Middle Level',
            subtitle: '',
            color: '#6366f1',
            subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit', 'General Knowledge', 'Moral Values', 'Information Technology', 'Art'],
            streams: []
        },
        {
            number: 4,
            title: 'Secondary Level',
            subtitle: '',
            color: '#d946ef',
            subjects: ['English', 'Hindi / Sanskrit', 'Mathematics', 'Science', 'Social Studies', 'Information Technology', 'Physical Education'],
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
                    color: '#0B3C5D',
                    subjects: ['English Core', 'Hindi / Sanskrit', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Physical Education']
                },
                {
                    name: 'Commerce Stream',
                    color: '#ef4444',
                    subjects: ['English Core', 'Business Studies', 'Accountancy', 'Economics', 'Hindi / Sanskrit', 'Physical Education']
                },
                {
                    name: 'Humanities Stream',
                    color: '#1CA7A6',
                    subjects: ['English Core', 'Hindi / Sanskrit', 'History', 'Geography', 'Economics', 'Political Science', 'Physical Education']
                }
            ]
        }
    ]
};

export default function CurriculumPage() {
    const [data, setData] = useState(DEFAULTS);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API}/curriculum-page`);
                if (res.ok) {
                    const d = await res.json();
                    setData({ ...DEFAULTS, ...d });
                }
            } catch (err) {
                console.warn('Using default curriculum data:', err.message);
            }
        })();
    }, []);

    const socials = { facebook: 'https://www.facebook.com/share/1DYSZWV8DU/', youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos' };

    return (
        <div className="landing-page curriculum-page">
            <PublicHeader />

            {/* ===== THE CURRICULUM SECTION ===== */}
            <section style={{ padding: '80px 0', background: '#fff' }} id="curriculum">
                <div className="section-container" style={{ maxWidth: '1200px' }}>
                    <div style={{ display: 'flex', gap: '60px', alignItems: 'stretch', flexWrap: 'wrap' }}>
                        {/* Text Side */}
                        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000', marginBottom: '10px', fontFamily: "'Inter', sans-serif" }}>{data.pageTitle}</h2>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#94a3b8', marginBottom: '10px', fontFamily: "'Inter', sans-serif" }}>Mount Zion School</h3>
                            
                            <p style={{ color: '#334155', fontSize: '0.85rem', marginBottom: '10px', fontWeight: '600' }}>
                                {data.pageSubtitle}
                            </p>

                            <div className="curriculum-list" style={{ color: '#334155', fontSize: '0.8rem', lineHeight: '1.3' }}>
                                {data.levels.map((level, idx) => (
                                    <div key={idx} style={{ marginBottom: '8px' }}>
                                        <div style={{ marginBottom: '1px' }}>
                                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{level.number}. {level.title}:</span>
                                            {level.subtitle && <p style={{ fontWeight: 'bold', color: '#000', margin: '0' }}>{level.subtitle}</p>}
                                        </div>
                                        
                                        {level.subjects && level.subjects.length > 0 && (
                                            <ul style={{ listStyleType: 'none', paddingLeft: '5px', marginTop: '1px' }}>
                                                {level.subjects.map((sub, sIdx) => (
                                                    <li key={sIdx} style={{ position: 'relative', paddingLeft: '15px', marginBottom: '1px' }}>
                                                        <span style={{ position: 'absolute', left: 0 }}>•</span> {sub}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {level.streams && level.streams.length > 0 && (
                                            <div style={{ paddingLeft: '5px', marginTop: '1px' }}>
                                                {level.streams.map((stream, stIdx) => (
                                                    <div key={stIdx} style={{ marginBottom: '4px' }}>
                                                        <span style={{ fontWeight: 'bold', color: '#ef4444' }}>• {stream.name}</span>
                                                        <ul style={{ listStyleType: 'none', paddingLeft: '10px', marginTop: '1px' }}>
                                                            {stream.subjects.map((sub, sIdx) => (
                                                                <li key={`sub-${sIdx}`} style={{ position: 'relative', paddingLeft: '15px', marginBottom: '1px' }}>
                                                                    <span style={{ position: 'absolute', left: 0 }}>•</span> {sub}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
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
                                marginTop: '180px',
                                minHeight: '650px'
                            }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <img src="/curriculum1.jpg" alt="Curriculum 1" style={{ width: '100%', height: '100%', minHeight: '300px', objectFit: 'cover', display: 'block' }} />
                                </div>
                                <div style={{ gridColumn: '1 / 2' }}>
                                    <img src="/curriculum2.jpg" alt="Curriculum 2" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '4/3' }} />
                                </div>
                                <div style={{ gridColumn: '2 / 3', gridRow: '2 / 4' }}>
                                    <img src="/curriculum3.jpg" alt="Curriculum 3" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                </div>
                                <div style={{ gridColumn: '1 / 2' }}>
                                    <img src="/curriculum4.jpg" alt="Curriculum 4" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '4/3' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SCHOOL UNIFORM SECTION ===== */}
            <section className="school-uniform-section" id="uniform">
                <div className="section-container">
                    <div className="uniform-content-wrapper">
                        <div className="uniform-image-col">
                            <img src="/uniform.png" alt="School Uniform Students" />
                        </div>
                        <div className="uniform-text-col">
                            <h2>School Uniform</h2>
                            <h3 className="uniform-subtitle">Mount Zion School</h3>
                            
                            <div className="uniform-details">
                                <div className="uniform-group">
                                    <h4>For Boys:-</h4>
                                    <p>Khaki grey Trousers and Blue stripped Shirts with school emblem<br/>
                                    Tie, Belt, khaki grey socks and Black Shoes</p>
                                </div>
                                
                                <div className="uniform-group">
                                    <h4>For Senior Girls:-</h4>
                                    <p>Khaki grey Salwar and Blue stripped three fourth sleeved Kurti with khaki grey waistcoat with school emblem.<br/>
                                    Khaki grey socks and Black Shoes.</p>
                                </div>
                                
                                <div className="uniform-group">
                                    <h4>Junior Girls:-</h4>
                                    <p>Khaki grey tunic with school emblem and Blue stripped Shirts<br/>
                                    Tie, belt, Khaki grey socks and Black Shoes.</p>
                                </div>
                                
                                <div className="uniform-group">
                                    <h4>Monday and Saturday</h4>
                                    <p>P.T. uniform for Std. 1 to 10</p>
                                </div>
                                
                                <div className="uniform-group">
                                    <h4>Black trousers and House T- shirts</h4>
                                    <p>White socks and respective House colour shoes.</p>
                                </div>
                            </div>
                            
                            <div className="uniform-visit-container">
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
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
