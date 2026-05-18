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

// Start with default map of standard categories/subcategories to ensure they always show up
const initialCategoryMap = {
    'Sports': ['Basket Ball', 'Cricket', 'Kabadi'],
    'Programs and Events': ['Independence Day', 'Teachers Day', 'Environment Day', 'Childrens Day'],
    'Annual Day': ['Group Dance', 'Group Song', 'Fancy Dress', 'Mono Act', 'Preach'],
    'Meetings': ['PTA', 'Teachers & Staffs', 'Seminars', 'Science Club', 'Arts Club', 'Groups', 'Alumnis'],
    'Facility': ['Campus View', 'Library', 'Classrooms', 'Laboratory']
};

export default function GalleryPublicPage() {
    const [images, setImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [videoGallery, setVideoGallery] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [activeCategoryTitle, setActiveCategoryTitle] = useState('All Images');
    const [categoryMap, setCategoryMap] = useState(initialCategoryMap);
    
    // For light box
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Auto-scroll logic
    useEffect(() => {
        let interval;
        const currentData = videoGallery || [];
        if (!isVideoPlaying && currentData.length > 0) {
            interval = setInterval(() => {
                setActiveVideoIndex((prev) => (prev + 1) % currentData.length);
            }, 5000); 
        }
        return () => clearInterval(interval);
    }, [isVideoPlaying, videoGallery?.length]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API}/gallery`);
                if (res.ok) {
                    const data = await res.json();
                    setImages(data);
                }

                const resLP = await fetch(`${API}/landing-page?t=${Date.now()}`);
                if (resLP.ok) {
                    const lpData = await resLP.json();
                    setVideoGallery(lpData.videoGallery || []);
                } else {
                    setVideoGallery([]); 
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
        if (images.length > 0) {
            const newMap = { ...initialCategoryMap };
            images.forEach(img => {
                let cat = img.category || 'Custom';
                if (cat === 'Programs & Events') cat = 'Programs and Events';
                if (cat === 'Facilities') cat = 'Facility';
                
                const sub = img.subcategory || 'General';
                if (!newMap[cat]) {
                    newMap[cat] = [];
                }
                if (sub !== 'General' && !newMap[cat].includes(sub)) {
                    newMap[cat].push(sub);
                }
            });
            setCategoryMap(newMap);
        }
    }, [images]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    const filteredImages = activeCategory === 'All' 
        ? images 
        : images.filter(img => {
            if (categoryMap[activeCategory]) {
                const sublist = categoryMap[activeCategory];
                return (
                    img.category === activeCategory || 
                    (activeCategory === 'Programs and Events' && img.category === 'Programs & Events') ||
                    (activeCategory === 'Facility' && img.category === 'Facilities') ||
                    sublist.includes(img.subcategory) ||
                    sublist.includes(img.category)
                );
            }
            return (
                img.subcategory === activeCategory || 
                img.category === activeCategory ||
                (activeCategory === 'Facilities' && img.category === 'Facility') ||
                (activeCategory === 'Facility' && img.category === 'Facilities')
            );
        });

    const activeVideoData = videoGallery || [];
    const currentVideo = activeVideoData[activeVideoIndex] || activeVideoData[0];

    const getYTThumb = (url) => {
        if (!url) return '';
        let id = url.match(/(?:embed\/|v=)([^&?]+)/)?.[1];
        if (!id && url.includes('youtu.be/')) {
            id = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
        }
        return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
    };

    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('/embed/')) return url;
        let id = url.match(/(?:v=|youtu\.be\/|youtube\.com\/watch\?v=)([^&?]+)/)?.[1];
        return id ? `https://www.youtube.com/embed/${id}` : url;
    };

    const currentVideoLink = currentVideo ? getEmbedUrl(currentVideo.videoLink) : '';
    const currentThumb = currentVideo ? (currentVideo.videoThumbnail || getYTThumb(currentVideo.videoLink)) : '';

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                        {Object.entries(categoryMap).map(([catKey, subList]) => (
                            <div key={catKey} style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
                                <h4 
                                    onClick={() => { setActiveCategory(catKey); setActiveCategoryTitle(catKey === 'Programs and Events' ? 'Programs & Events' : catKey); }}
                                    style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', cursor: 'pointer', color: activeCategory === catKey ? '#1CA7A6' : 'white' }}
                                >
                                    {catKey === 'Programs and Events' ? 'Programs & Events' : catKey}
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                    {subList.map(sub => (
                                        <li 
                                            key={sub} 
                                            onClick={() => { setActiveCategory(sub); setActiveCategoryTitle(`${sub} Gallery`); }} 
                                            style={{ cursor: 'pointer', color: activeCategory === sub ? '#1CA7A6' : '#e2e8f0' }}
                                        >
                                            {sub}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
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
                                    <img src={img.url} alt={img.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                    {img.title && <p style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{img.title}</p>}
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🖼️</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#475569' }}>No Images Uploaded</h3>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>There are currently no uploaded images under the "{activeCategoryTitle}" category.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px', gap: '15px' }}>
                        {(() => {
                            const totalItems = filteredImages.length > 0 ? filteredImages.length : (categoryMap[activeCategory] ? 12 : 6);
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
            {activeVideoData.length > 0 && (
                <section className="video-gallery-section">
                <div className="section-container">
                    <div className="video-section-header">
                        <h2>VIDEO GALLERY</h2>
                        <p>Moments that reflect our journey of learning, growth, and excellence.</p>
                    </div>

                    <div className="video-gallery-layout">
                        {/* Left side: Video */}
                        <div className="video-main-player-side">
                            {currentVideo.videoLink ? (
                                <>
                                    <div className="video-aspect-container" style={{ 
                                        backgroundImage: `url(${currentThumb})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}>
                                        {isVideoPlaying ? (
                                            <iframe 
                                                width="100%" 
                                                height="100%" 
                                                src={`${currentVideoLink}${currentVideoLink.includes('?') ? '&' : '?'}autoplay=1`}
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
        
                                    <a href={currentVideo.videoLink} target="_blank" rel="noopener noreferrer" className="video-visit-btn">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.582 6.186a2.66 2.66 0 0 0-1.87-1.884C18.062 3.86 12 3.86 12 3.86s-6.062 0-7.712.442a2.66 2.66 0 0 0-1.87 1.884C2 7.846 2 12 2 12s0 4.154.442 5.814a2.66 2.66 0 0 0 1.87 1.884C5.938 20.14 12 20.14 12 20.14s6.062 0 7.712-.442a2.66 2.66 0 0 0 1.87-1.884C22 16.154 22 12 22 12s0-4.154-.418-5.814zM9.993 15.026V8.974L15.286 12l-5.293 3.026z"/>
                                        </svg>
                                        VISIT NOW
                                    </a>
                                </>
                            ) : (
                                <div style={{ 
                                    height: '400px', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    background: '#f8fafc', 
                                    borderRadius: '12px',
                                    border: '1px dashed #cbd5e1',
                                    color: '#64748b'
                                }}>
                                    <h3 style={{ margin: '0 0 10px' }}>{currentVideo.videoTitle || 'Mount Zion Gallery'}</h3>
                                    <p>Video content coming soon!</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Right side: Testimonial + Thumbnails */}
                        <div className="video-testimonial-side">
                            {(currentVideo.testimonialName || currentVideo.testimonialText) ? (
                                <div className="testimonial-card-v2">
                                    <div className="parent-thumb-wrapper">
                                        <img 
                                            src={currentVideo.testimonialImage || 'https://i.pravatar.cc/150?u=school'} 
                                            alt="Parent" 
                                            onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?u=school'; }}
                                        />
                                    </div>
                                    
                                    <div className="quote-icon-v2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                                    </div>
    
                                    <div className="testimonial-content-v2">
                                        <div className="stars-row">★ ★ ★ ★ ★</div>
                                        {currentVideo.testimonialName && <h4 className="parent-name">{currentVideo.testimonialName}</h4>}
                                        {currentVideo.testimonialRole && <span className="parent-role">{currentVideo.testimonialRole}</span>}
                                        {currentVideo.testimonialText && <p className="parent-message">{currentVideo.testimonialText}</p>}
                                    </div>
                                </div>
                            ) : (
                                <div className="testimonial-card-v2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', opacity: 0.8 }}>
                                    <p style={{ color: '#64748b', fontStyle: 'italic' }}>Feedback from parents and students for this session will be updated soon.</p>
                                </div>
                            )}
 
                            {/* Parent Thumbnails / Scrolling Feedbacks */}
                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', overflowX: 'auto', padding: '10px', width: '100%', justifyContent: 'center' }}>
                                {activeVideoData.map((item, idx) => (
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
                                        <img 
                                            src={item.testimonialImage || 'https://i.pravatar.cc/150?u=school'} 
                                            alt={item.testimonialName || 'Parent'} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                            onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?u=school'; }}
                                        />
                                    </div>
                                ))}
                            </div>
 
                            <div className="video-nav-dots">
                                {activeVideoData.map((_, idx) => (
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
            )}

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
