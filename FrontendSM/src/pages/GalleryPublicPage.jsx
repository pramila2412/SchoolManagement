import React, { useState, useEffect } from 'react';
import {
    ChevronRight, ChevronDown, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import './GalleryPublicPage.css';
import './LandingPage.css';

const API = '/api';

const CATEGORY_MAP = {
    'Sports': ['Basket Ball', 'Cricket', 'Kabadi'],
    'School Tour': ['Ooty', 'Kodaikanal', 'Hyderabad Film City'],
    'Programs and Events': ['Independence Day', 'Teachers Day', 'Environment Day', 'Childrens Day'],
    'Annual Day': ['Group Dance', 'Group Song', 'Fancy Dress', 'Mono Act', 'Preach'],
    'Meetings': ['PTA', 'Teachers & Staffs', 'Seminars', 'Science Club', 'Arts Club', 'Groups', 'Alumnis'],
    'Facilities': ['Campus View', 'Library', 'Classrooms', 'Laboratory']
};

const VIDEO_GALLERY_DATA = [
    {
        videoLink: "https://www.youtube.com/embed/5Peo-ivmupE",
        videoThumbnail: "https://img.youtube.com/vi/5Peo-ivmupE/maxresdefault.jpg",
        videoTitle: "How to get started",
        videoPart: "Part 1",
        testimonialName: "Sandra Henry",
        testimonialRole: "Alumni - University Assistant",
        testimonialText: "\"Mount Zion School has shaped my child's character and confidence. The care and values they instill are truly exceptional.\"",
        testimonialImage: "https://i.pravatar.cc/150?u=sandra"
    },
    {
        videoLink: "https://www.youtube.com/embed/5Peo-ivmupE",
        videoThumbnail: "https://img.youtube.com/vi/5Peo-ivmupE/maxresdefault.jpg",
        videoTitle: "Campus Tour & Facilities",
        videoPart: "Part 2",
        testimonialName: "John Doe",
        testimonialRole: "Parent",
        testimonialText: "\"The facilities and the teaching staff are world-class. We couldn't have asked for a better environment for our son.\"",
        testimonialImage: "https://i.pravatar.cc/150?u=john"
    },
    {
        videoLink: "https://www.youtube.com/embed/5Peo-ivmupE",
        videoThumbnail: "https://img.youtube.com/vi/5Peo-ivmupE/maxresdefault.jpg",
        videoTitle: "Annual Day Highlights",
        videoPart: "Part 3",
        testimonialName: "Maria Garcia",
        testimonialRole: "Parent",
        testimonialText: "\"Seeing my daughter perform on stage with so much confidence brought tears to my eyes. Thank you Mount Zion!\"",
        testimonialImage: "https://i.pravatar.cc/150?u=maria"
    },
    {
        videoLink: "https://www.youtube.com/embed/5Peo-ivmupE",
        videoThumbnail: "https://img.youtube.com/vi/5Peo-ivmupE/maxresdefault.jpg",
        videoTitle: "Sports Achievements",
        videoPart: "Part 4",
        testimonialName: "David Smith",
        testimonialRole: "Alumni",
        testimonialText: "\"The sports infrastructure and coaching helped me secure a national level scholarship. Proud to be an alumni.\"",
        testimonialImage: "https://i.pravatar.cc/150?u=david"
    }
];

export default function GalleryPublicPage() {
    const [images, setImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [activeCategoryTitle, setActiveCategoryTitle] = useState('All Images');
    
    // For light box
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Auto-scroll logic
    useEffect(() => {
        let interval;
        if (!isVideoPlaying) {
            interval = setInterval(() => {
                setActiveVideoIndex((prev) => (prev + 1) % VIDEO_GALLERY_DATA.length);
            }, 5000); // Change every 5 seconds
        }
        return () => clearInterval(interval);
    }, [isVideoPlaying]);

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

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    const filteredImages = activeCategory === 'All' 
        ? images 
        : images.filter(img => {
            const isMainTopic = CATEGORY_MAP[activeCategory];
            if (isMainTopic) {
                return CATEGORY_MAP[activeCategory].includes(img.category);
            }
            return img.category === activeCategory;
        });

    return (
        <div className="landing-page gallery-public-page">
            <PublicHeader />

            <section style={{ backgroundColor: '#002147', color: 'white', padding: '40px 0' }}>
                <div className="section-container" style={{ position: 'relative' }}>
                    <div 
                        onClick={() => { setActiveCategory('All'); setActiveCategoryTitle('All Images'); }}
                        style={{ position: 'absolute', top: '-10px', right: '0', display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: activeCategory === 'All' ? '#1CA7A6' : '#cbd5e1', cursor: 'pointer' }}
                    >
                        Browse All <ChevronDown size={14} style={{ marginLeft: '5px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '20px' }}>
                        <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                            <h4 
                                onClick={() => { setActiveCategory('Sports'); setActiveCategoryTitle('Sports'); }}
                                style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', cursor: 'pointer', color: activeCategory === 'Sports' ? '#1CA7A6' : 'white' }}
                            >
                                Sports
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li onClick={() => { setActiveCategory('Basket Ball'); setActiveCategoryTitle('Basket Ball Winners'); }} style={{ cursor: 'pointer', color: activeCategory === 'Basket Ball' ? '#1CA7A6' : '#e2e8f0' }}>Basket Ball</li>
                                <li onClick={() => { setActiveCategory('Cricket'); setActiveCategoryTitle('Cricket Winners'); }} style={{ cursor: 'pointer', color: activeCategory === 'Cricket' ? '#1CA7A6' : '#e2e8f0' }}>Cricket</li>
                                <li onClick={() => { setActiveCategory('Kabadi'); setActiveCategoryTitle('Kabadi Winners'); }} style={{ cursor: 'pointer', color: activeCategory === 'Kabadi' ? '#1CA7A6' : '#e2e8f0' }}>Kabadi</li>
                            </ul>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                            <h4 
                                onClick={() => { setActiveCategory('School Tour'); setActiveCategoryTitle('School Tour'); }}
                                style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', cursor: 'pointer', color: activeCategory === 'School Tour' ? '#1CA7A6' : 'white' }}
                            >
                                School Tours
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li onClick={() => { setActiveCategory('Ooty'); setActiveCategoryTitle('Ooty Tour'); }} style={{ cursor: 'pointer', color: activeCategory === 'Ooty' ? '#1CA7A6' : '#e2e8f0' }}>Ooty</li>
                                <li onClick={() => { setActiveCategory('Kodaikanal'); setActiveCategoryTitle('Kodaikanal Tour'); }} style={{ cursor: 'pointer', color: activeCategory === 'Kodaikanal' ? '#1CA7A6' : '#e2e8f0' }}>Kodaikanal</li>
                                <li onClick={() => { setActiveCategory('Hyderabad Film City'); setActiveCategoryTitle('Hyderabad Film City Tour'); }} style={{ cursor: 'pointer', color: activeCategory === 'Hyderabad Film City' ? '#1CA7A6' : '#e2e8f0' }}>Hyderabad Film City</li>
                            </ul>
                        </div>
                        <div style={{ flex: '1', minWidth: '200px', marginBottom: '20px' }}>
                            <h4 
                                onClick={() => { setActiveCategory('Programs and Events'); setActiveCategoryTitle('Programs & Events'); }}
                                style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', cursor: 'pointer', color: activeCategory === 'Programs and Events' ? '#1CA7A6' : 'white' }}
                            >
                                Programs & Events
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li onClick={() => { setActiveCategory('Independence Day'); setActiveCategoryTitle('Independence Day Celebration'); }} style={{ cursor: 'pointer', color: activeCategory === 'Independence Day' ? '#1CA7A6' : '#e2e8f0' }}>Independence Day</li>
                                <li onClick={() => { setActiveCategory('Teachers Day'); setActiveCategoryTitle('Teachers Day Celebration'); }} style={{ cursor: 'pointer', color: activeCategory === 'Teachers Day' ? '#1CA7A6' : '#e2e8f0' }}>Teachers Day</li>
                                <li onClick={() => { setActiveCategory('Environment Day'); setActiveCategoryTitle('Environment Day Celebration'); }} style={{ cursor: 'pointer', color: activeCategory === 'Environment Day' ? '#1CA7A6' : '#e2e8f0' }}>Environment Day</li>
                                <li onClick={() => { setActiveCategory('Childrens Day'); setActiveCategoryTitle('Childrens Day Celebration'); }} style={{ cursor: 'pointer', color: activeCategory === 'Childrens Day' ? '#1CA7A6' : '#e2e8f0' }}>Childrens Day</li>
                            </ul>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                            <h4 
                                onClick={() => { setActiveCategory('Annual Day'); setActiveCategoryTitle('Annual Day'); }}
                                style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', cursor: 'pointer', color: activeCategory === 'Annual Day' ? '#1CA7A6' : 'white' }}
                            >
                                Annual Day
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li onClick={() => { setActiveCategory('Group Dance'); setActiveCategoryTitle('Annual Day - Group Dance'); }} style={{ cursor: 'pointer', color: activeCategory === 'Group Dance' ? '#1CA7A6' : '#e2e8f0' }}>Group Dance</li>
                                <li onClick={() => { setActiveCategory('Group Song'); setActiveCategoryTitle('Annual Day - Group Song'); }} style={{ cursor: 'pointer', color: activeCategory === 'Group Song' ? '#1CA7A6' : '#e2e8f0' }}>Group Song</li>
                                <li onClick={() => { setActiveCategory('Fancy Dress'); setActiveCategoryTitle('Annual Day - Fancy Dress'); }} style={{ cursor: 'pointer', color: activeCategory === 'Fancy Dress' ? '#1CA7A6' : '#e2e8f0' }}>Fancy Dress</li>
                                <li onClick={() => { setActiveCategory('Mono Act'); setActiveCategoryTitle('Annual Day - Mono Act'); }} style={{ cursor: 'pointer', color: activeCategory === 'Mono Act' ? '#1CA7A6' : '#e2e8f0' }}>Mono Act</li>
                                <li onClick={() => { setActiveCategory('Preach'); setActiveCategoryTitle('Annual Day - Preach'); }} style={{ cursor: 'pointer', color: activeCategory === 'Preach' ? '#1CA7A6' : '#e2e8f0' }}>Preach</li>
                            </ul>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                            <h4 
                                onClick={() => { setActiveCategory('Meetings'); setActiveCategoryTitle('Meetings'); }}
                                style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', cursor: 'pointer', color: activeCategory === 'Meetings' ? '#1CA7A6' : 'white' }}
                            >
                                Meetings
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li onClick={() => { setActiveCategory('PTA'); setActiveCategoryTitle('PTA Meeting'); }} style={{ cursor: 'pointer', color: activeCategory === 'PTA' ? '#1CA7A6' : '#e2e8f0' }}>PTA</li>
                                <li onClick={() => { setActiveCategory('Teachers & Staffs'); setActiveCategoryTitle('Teachers & Staffs Meeting'); }} style={{ cursor: 'pointer', color: activeCategory === 'Teachers & Staffs' ? '#1CA7A6' : '#e2e8f0' }}>Teachers & Staffs</li>
                                <li onClick={() => { setActiveCategory('Seminars'); setActiveCategoryTitle('Seminars'); }} style={{ cursor: 'pointer', color: activeCategory === 'Seminars' ? '#1CA7A6' : '#e2e8f0' }}>Seminars</li>
                                <li onClick={() => { setActiveCategory('Science Club'); setActiveCategoryTitle('Science Club'); }} style={{ cursor: 'pointer', color: activeCategory === 'Science Club' ? '#1CA7A6' : '#e2e8f0' }}>Science Club</li>
                                <li onClick={() => { setActiveCategory('Arts Club'); setActiveCategoryTitle('Arts Club'); }} style={{ cursor: 'pointer', color: activeCategory === 'Arts Club' ? '#1CA7A6' : '#e2e8f0' }}>Arts Club</li>
                                <li onClick={() => { setActiveCategory('Groups'); setActiveCategoryTitle('Groups Meeting'); }} style={{ cursor: 'pointer', color: activeCategory === 'Groups' ? '#1CA7A6' : '#e2e8f0' }}>Groups</li>
                                <li onClick={() => { setActiveCategory('Alumnis'); setActiveCategoryTitle('Alumnis Meeting'); }} style={{ cursor: 'pointer', color: activeCategory === 'Alumnis' ? '#1CA7A6' : '#e2e8f0' }}>Alumnis</li>
                            </ul>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                            <h4 
                                onClick={() => { setActiveCategory('Facilities'); setActiveCategoryTitle('Campus & Facilities'); }}
                                style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', cursor: 'pointer', color: activeCategory === 'Facilities' ? '#1CA7A6' : 'white' }}
                            >
                                Facilities
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li onClick={() => { setActiveCategory('Campus View'); setActiveCategoryTitle('Campus View'); }} style={{ cursor: 'pointer', color: activeCategory === 'Campus View' ? '#1CA7A6' : '#e2e8f0' }}>Campus View</li>
                                <li onClick={() => { setActiveCategory('Library'); setActiveCategoryTitle('Library'); }} style={{ cursor: 'pointer', color: activeCategory === 'Library' ? '#1CA7A6' : '#e2e8f0' }}>Library</li>
                                <li onClick={() => { setActiveCategory('Classrooms'); setActiveCategoryTitle('Classrooms'); }} style={{ cursor: 'pointer', color: activeCategory === 'Classrooms' ? '#1CA7A6' : '#e2e8f0' }}>Classrooms</li>
                                <li onClick={() => { setActiveCategory('Laboratory'); setActiveCategoryTitle('Laboratory'); }} style={{ cursor: 'pointer', color: activeCategory === 'Laboratory' ? '#1CA7A6' : '#e2e8f0' }}>Laboratory</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
             {/* ===== IMAGE GALLERY SECTION ===== */}
            <section style={{ padding: '60px 0', background: '#fff' }}>
                <div className="section-container">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontStyle: 'italic', marginBottom: '30px', color: '#334155' }}>{activeCategoryTitle}</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                        {filteredImages.length > 0 ? (
                            filteredImages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((img, i) => (
                                <div key={img._id || i} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', background: '#fff', padding: '15px', cursor: 'pointer' }} onClick={() => setSelectedImage(img)}>
                                    <img src={img.url || `/Gallery${i % 4 + 1}.png`} alt={img.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                    {img.title && <p style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{img.title}</p>}
                                </div>
                            ))
                        ) : (
                            [...Array(CATEGORY_MAP[activeCategory] ? 12 : 6)].slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((_, i) => (
                                <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', background: '#fff', padding: '15px' }}>
                                    <img src={`/Gallery${(i + (currentPage - 1) * itemsPerPage) % 4 + 1}.png`} alt={activeCategoryTitle} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px', gap: '15px' }}>
                        {(() => {
                            const totalItems = filteredImages.length > 0 ? filteredImages.length : (CATEGORY_MAP[activeCategory] ? 12 : 6);
                            const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
                            
                            return (
                                <>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            style={{ 
                                                width: '36px', 
                                                height: '36px', 
                                                borderRadius: '50%', 
                                                background: currentPage === i + 1 ? '#002147' : '#d8b4e2', 
                                                color: '#fff', 
                                                border: 'none', 
                                                fontWeight: 'bold', 
                                                cursor: 'pointer',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    {currentPage < totalPages && (
                                        <button 
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            style={{ background: 'transparent', border: 'none', color: '#334155', fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}
                                        >
                                            Next <ChevronRight size={16} style={{ marginLeft: '5px' }} />
                                        </button>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </section>

            {/* ===== VIDEO GALLERY SECTION ===== */}
            <section className="video-gallery-section">
                <div className="section-container">
                    <div className="video-section-header">
                        <h2>VIDEO GALLERY</h2>
                        <p>Moments that reflect our journey of learning, growth, and excellence.</p>
                    </div>

                    <div className="video-gallery-layout">
                        {/* Left side: Video */}
                        <div className="video-main-player-side">
                            <div className="video-aspect-container" style={{ 
                                backgroundImage: `url(${VIDEO_GALLERY_DATA[activeVideoIndex].videoThumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
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
                                    <div className="video-placeholder-content" style={{ background: 'rgba(0,0,0,0.4)' }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            <div onClick={() => setIsVideoPlaying(true)} className="play-button-outer">
                                                <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '15px solid #fff', marginLeft: '5px' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <a href={VIDEO_GALLERY_DATA[activeVideoIndex].videoLink} target="_blank" rel="noopener noreferrer" className="video-visit-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.582 6.186a2.66 2.66 0 0 0-1.87-1.884C18.062 3.86 12 3.86 12 3.86s-6.062 0-7.712.442a2.66 2.66 0 0 0-1.87 1.884C2 7.846 2 12 2 12s0 4.154.442 5.814a2.66 2.66 0 0 0 1.87 1.884C5.938 20.14 12 20.14 12 20.14s6.062 0 7.712-.442a2.66 2.66 0 0 0 1.87-1.884C22 16.154 22 12 22 12s0-4.154-.418-5.814zM9.993 15.026V8.974L15.286 12l-5.293 3.026z"/>
                                </svg>
                                VISIT NOW
                            </a>
                        </div>
                        
                        {/* Right side: Testimonial + Thumbnails */}
                        <div className="video-testimonial-side">
                            <div className="testimonial-card-v2">
                                <div className="parent-thumb-wrapper">
                                    <img src={VIDEO_GALLERY_DATA[activeVideoIndex].testimonialImage} alt="Parent" />
                                </div>
                                
                                <div className="quote-icon-v2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                                </div>

                                <div className="testimonial-content-v2">
                                    <div className="stars-row">★ ★ ★ ★ ★</div>
                                    <h4 className="parent-name">{VIDEO_GALLERY_DATA[activeVideoIndex].testimonialName}</h4>
                                    <span className="parent-role">{VIDEO_GALLERY_DATA[activeVideoIndex].testimonialRole}</span>
                                    <p className="parent-message">{VIDEO_GALLERY_DATA[activeVideoIndex].testimonialText}</p>
                                </div>
                            </div>

                            {/* Parent Thumbnails / Scrolling Feedbacks */}
                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', overflowX: 'auto', padding: '10px', width: '100%', justifyContent: 'center' }}>
                                {VIDEO_GALLERY_DATA.map((item, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => { setActiveVideoIndex(idx); setIsVideoPlaying(false); }}
                                        style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            borderRadius: '50%', 
                                            border: activeVideoIndex === idx ? '3px solid #d97706' : '3px solid transparent', 
                                            padding: '2px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            flexShrink: 0,
                                            opacity: activeVideoIndex === idx ? 1 : 0.6
                                        }}
                                    >
                                        <img src={item.testimonialImage} alt={item.testimonialName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    </div>
                                ))}
                            </div>

                            <div className="video-nav-dots">
                                {VIDEO_GALLERY_DATA.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => { setActiveVideoIndex(idx); setIsVideoPlaying(false); }}
                                        className={`nav-dot ${activeVideoIndex === idx ? 'active' : ''}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        className="gal-lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="gal-lightbox-close" onClick={() => setSelectedImage(null)}>
                            <X size={32} />
                        </button>
                        <motion.div 
                            className="gal-lightbox-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={selectedImage.url || `/Gallery1.png`} alt={selectedImage.title} />
                            <div className="gal-lightbox-caption">
                                <h3>{selectedImage.title}</h3>
                                <span>{selectedImage.category}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <PublicFooter />
        </div>
    );
}
