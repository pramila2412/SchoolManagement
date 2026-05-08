import React, { useState, useEffect } from 'react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
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
    const [data] = useState(DEFAULTS);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="landing-page">
            <PublicHeader />

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

            <PublicFooter />
        </div>
    );
}
