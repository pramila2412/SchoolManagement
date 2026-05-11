import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    Phone, Mail, Search, Wallet, FileText, LogIn, Menu, X, ChevronDown, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PUBLIC_PAGES = [
    { name: 'Home', path: '/', category: 'General' },
    { name: 'About Mount Zion', path: '/about', category: 'About' },
    { name: 'The Team', path: '/about#team', category: 'About' },
    { name: 'Rules & Regulations', path: '/about#rules', category: 'About' },
    { name: 'Notice Board', path: '/about#notices', category: 'About' },
    { name: 'Admission', path: '/admission', category: 'Admission' },
    { name: 'Admission Procedure', path: '/admission#procedure', category: 'Admission' },
    { name: 'Fee & Payment', path: '/admission#fee', category: 'Admission' },
    { name: 'Admission Result 2026', path: '/admission#result', category: 'Admission' },
    { name: 'Academics', path: '/academics', category: 'Academics' },
    { name: 'Curriculum', path: '/academics#curriculum', category: 'Academics' },
    { name: 'School Uniform', path: '/academics#uniform', category: 'Academics' },
    { name: 'Gallery', path: '/gallery', category: 'Media' },
    { name: 'Contact Us', path: '/contact', category: 'Support' },
    { name: 'Co-Curricular Activities', path: '/co-curricular', category: 'Academics' },
    { name: 'Privacy Policy', path: '/privacy-policy', category: 'Legal' },
    { name: 'Terms of Service', path: '/terms-of-service', category: 'Legal' },
];

export default function PublicHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    
    const [siteConfig, setSiteConfig] = useState({
        header: {
            phone1: '6296490943',
            email: 'mountzionschool2021@gmail.com',
            socials: { facebook: 'https://www.facebook.com/share/1DYSZWV8DU/', youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos' }
        },
        announcements: {
            ticker: [
                'Admission Open for Session 2025-26',
                'Mount Zion School Ranked #1 in Purnea',
                'New Sports Complex Inaugurated'
            ]
        }
    });

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const response = await fetch('/api/landing-page');
                if (response.ok) {
                    const data = await response.json();
                    setSiteConfig(prev => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.error("Failed to fetch header config:", err);
            }
        };
        fetchHeaderData();
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = PUBLIC_PAGES.filter(item => 
            item.name.toLowerCase().includes(lowerQuery) || 
            item.category.toLowerCase().includes(lowerQuery)
        ).slice(0, 6);

        setSearchResults(results);
        setShowResults(true);
    };

    const handleSelectResult = (path) => {
        if (path.includes('#')) {
            const [basePath, hash] = path.split('#');
            if (location.pathname === basePath) {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                    const offset = 100; // Account for sticky header
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                navigate(path);
                // The scroll will be handled by the useEffect watching location
            }
        } else {
            navigate(path);
            window.scrollTo(0, 0);
        }
        setSearchQuery('');
        setShowResults(false);
    };

    // Effect to handle scrolling to hash on page change
    useEffect(() => {
        if (location.hash) {
            const hash = location.hash.replace('#', '');
            setTimeout(() => {
                const element = document.getElementById(hash);
                if (element) {
                    const offset = 100;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 500); // Wait for page content to render
        }
    }, [location.pathname, location.hash]);

    const phone1 = siteConfig?.header?.phone1 || '6296490943';
    const email = siteConfig?.header?.email || 'mountzionschool2021@gmail.com';
    const socials = siteConfig?.header?.socials || {};
    const tickerItems = siteConfig?.announcements?.ticker || [];

    return (
        <>
            {/* ===== TOP BAR ===== */}
            <div className="landing-top-bar">
                <div className="top-bar-content">
                    <div className="top-left-socials">
                        <a href={socials.facebook} className="social-icon" target="_blank" rel="noopener noreferrer">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="white"/>
                            </svg>
                        </a>
                        <a href={socials.youtube} className="social-icon" target="_blank" rel="noopener noreferrer">
                            <svg width="21" height="15" viewBox="0 0 24 17" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.495 2.628c-.232-.866-.918-1.552-1.784-1.784C19.982.417 12 .417 12 .417s-7.982 0-9.711.427c-.866.232-1.552.918-1.784 1.784C.078 4.357.078 8.5.078 8.5s0 4.143.427 5.872c.232.866.918 1.552 1.784 1.784 1.729.427 9.711.427 9.711.427s7.982 0 9.711-.427c.866-.232 1.552-.918 1.784-1.784.427-1.729.427-5.872.427-5.872s0-4.143-.427-5.872zM9.545 12.067V4.933l6.231 3.567-6.231 3.567z" fill="white"/>
                            </svg>
                        </a>
                    </div>
                    <div className="top-contact-info" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <a href={`tel:${phone1}`} className="top-info-item"><Phone size={14}/> {phone1}</a>
                        <div style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)'}}></div>
                        <a href={`mailto:${email}`} className="top-info-item hide-tablet"><Mail size={14}/> {email}</a>
                    </div>
                    <div className="top-right-links" style={{ position: 'relative' }}>
                        <div className="top-search-box">
                            <Search size={14} className="search-icon-small" />
                            <input 
                                type="text" 
                                placeholder="Search pages..." 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => { if (searchQuery.trim()) setShowResults(true); }}
                                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            />
                        </div>
                        
                        <AnimatePresence>
                            {showResults && (
                                <motion.div 
                                    className="public-search-results"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        width: '280px',
                                        background: '#fff',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                        borderRadius: '8px',
                                        zIndex: 2100,
                                        marginTop: '10px',
                                        overflow: 'hidden',
                                        border: '1px solid #e2e8f0'
                                    }}
                                >
                                    {searchResults.length > 0 ? (
                                        searchResults.map((result, idx) => (
                                            <div 
                                                key={idx}
                                                className="search-result-item"
                                                onClick={() => handleSelectResult(result.path)}
                                                style={{
                                                    padding: '12px 15px',
                                                    borderBottom: idx === searchResults.length - 1 ? 'none' : '1px solid #f1f5f9',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{result.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{result.category}</div>
                                                </div>
                                                <ChevronRight size={14} color="#94a3b8" />
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                                            No results found
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ===== HEADER ===== */}
            <header className="landing-header">
                <div className="header-inner" style={{ justifyContent: 'space-between' }}>
                    <Link to="/" className="school-logo footer-logo" style={{ textDecoration: 'none', margin: 0, padding: '10px 15px', gap: '12px' }}>
                        <img src="/logo.png" alt="MZ Logo" style={{ height: '50px' }} />
                        <div className="footer-logo-text" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', margin: 0, whiteSpace: 'nowrap' }}>MOUNT ZION SCHOOL</h3>
                            <p className="footer-affiliation" style={{ fontSize: '0.75rem', marginTop: '2px', whiteSpace: 'nowrap' }}>Affiliated to CBSE, New Delhi upto +2 level</p>
                            <p className="footer-affiliation-period" style={{ fontSize: '0.7rem', marginTop: '4px', whiteSpace: 'nowrap' }}>Period of Affiliation :2027</p>
                        </div>
                    </Link>
                    <div className="landing-nav">
                        <div className="nav-divider"></div>
                        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home <span className="nav-badge">FREE</span></Link>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/about" className="dropdown-item">About Mount Zion</Link>
                                <Link to="/about#team" className="dropdown-item">The Team</Link>
                                <Link to="/about#rules" className="dropdown-item">Rules & Regulations</Link>
                                <Link to="/about#notices" className="dropdown-item">Notice</Link>
                            </div>
                        </div>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/admission" className={`nav-link ${location.pathname === '/admission' ? 'active' : ''}`}>Admission <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/admission#procedure" className="dropdown-item">Admission Procedure</Link>
                                <Link to="/admission#fee" className="dropdown-item">Fee & Payment</Link>
                                <Link to="/admission#result" className="dropdown-item">Admission Result-2026</Link>
                            </div>
                        </div>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/academics" className={`nav-link ${location.pathname === '/academics' ? 'active' : ''}`}>Academics <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/academics#curriculum" className="dropdown-item">Curriculum</Link>
                                <Link to="/academics#uniform" className="dropdown-item">School Uniform</Link>
                            </div>
                        </div>
                        <div className="nav-divider"></div>
                        <Link to="/gallery" className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}>Gallery</Link>
                        <div className="nav-divider"></div>
                        <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact Us</Link>
                    </div>
                    <button className="mobile-menu-btn lg-hide" onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            {/* ===== NEWS TICKER ===== */}
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

            {/* ===== MOBILE NAV ===== */}
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
                            
                            <div className="mobile-nav-item">
                                <Link to="/about" onClick={toggleMobileMenu}>About</Link>
                                <div className="mobile-sub-nav">
                                    <Link to="/about" onClick={toggleMobileMenu}>About Mount Zion</Link>
                                    <Link to="/about#team" onClick={toggleMobileMenu}>The Team</Link>
                                    <Link to="/about#rules" onClick={toggleMobileMenu}>Rules & Regulations</Link>
                                    <Link to="/about#notices" onClick={toggleMobileMenu}>Notice</Link>
                                </div>
                            </div>

                            <div className="mobile-nav-item">
                                <Link to="/admission" onClick={toggleMobileMenu}>Admission</Link>
                                <div className="mobile-sub-nav">
                                    <Link to="/admission#procedure" onClick={toggleMobileMenu}>Admission Procedure</Link>
                                    <Link to="/admission#fee" onClick={toggleMobileMenu}>Fee & Payment</Link>
                                    <Link to="/admission#result" onClick={toggleMobileMenu}>Admission Result-2026</Link>
                                </div>
                            </div>

                            <div className="mobile-nav-item">
                                <Link to="/academics" onClick={toggleMobileMenu}>Academics</Link>
                                <div className="mobile-sub-nav">
                                    <Link to="/academics#curriculum" onClick={toggleMobileMenu}>Curriculum</Link>
                                    <Link to="/academics#uniform" onClick={toggleMobileMenu}>School Uniform</Link>
                                </div>
                            </div>

                            <Link to="/gallery" onClick={toggleMobileMenu}>Gallery</Link>
                            <Link to="/contact" onClick={toggleMobileMenu}>Contact Us</Link>
                            
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
