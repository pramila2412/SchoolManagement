import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Search, ChevronDown, Filter, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { motion, AnimatePresence } from 'framer-motion';
import './AdmissionPublicPage.css';
import './LandingPage.css';

const API = '/api';

const RESULTS_DATA = [
    { roll: '514', cls: '4', name: 'Jane Cooper', date: '22/Jan/2026', time: '12:30 pm', panel: '4' },
    { roll: '546', cls: '5', name: 'Wade Warren', date: '22/Jan/2026', time: '3:00 pm', panel: '5' },
    { roll: '134', cls: '5', name: 'Esther Howard', date: '22/Jan/2026', time: '3:30 pm', panel: '4' },
    { roll: '544', cls: '5', name: 'Cameron Williamson', date: '22/Jan/2026', time: '4:30 pm', panel: '5' },
    { roll: '124', cls: '6', name: 'Brooklyn Simmons', date: '22/Jan/2026', time: '11:33 am', panel: '6' },
    { roll: '845', cls: '6', name: 'Leslie Alexander', date: '22/Jan/2026', time: '10:00 am', panel: '6' },
    { roll: '213', cls: '7', name: 'Jenny Wilson', date: '22/Jan/2026', time: '11:30 am', panel: '7' },
    { roll: '043', cls: '8', name: 'Guy Hawkins', date: '22/Jan/2026', time: '12:00 am', panel: '7-' },
    { roll: '302', cls: '4', name: 'Robert Fox', date: '23/Jan/2026', time: '10:00 am', panel: '1' },
    { roll: '305', cls: '4', name: 'Dianne Russell', date: '23/Jan/2026', time: '10:30 am', panel: '1' },
    { roll: '310', cls: '4', name: 'Cody Fisher', date: '23/Jan/2026', time: '11:00 am', panel: '1' },
];

const ALL_CLASSES = ['All Classes', 'Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const DEFAULTS = {
    pageTitle: 'Admissions',
    pageSubtitle: 'Join the Mount Zion Family — Where Excellence Begins',
    heroImage: '/school.jpeg',
    admissionProcedure: [
        { text: 'Admission to Nursery class can be secured on the basis of communication with the parents.' },
        { text: 'LKG upwards admission based on clearing up the Entrance Test.' }
    ],
    admissionCriteria: [
        { text: 'Submit the properly filled Registration Form and collect the date of the Entrance Test.' },
        { text: 'Appear for the Entrance Exam at the Scheduled time.' },
        { text: 'Go through the Result.' },
        { text: 'If the student is eligible for the admission, submit the duly filled admission form, along with required documents and passport size photographs.' },
        { text: 'Now collect final confirmation regarding admission and deposit fee.' },
        { text: 'Try to submit original documents at the time of admission.' },
        { text: 'Basic informations like DOB, address, parent\'s name etc. once entered in the school admission register at the time of admission should not be changed under any circumstances.' }
    ],
    requiredDocuments: [
        'Birth Certificate (Original & Photocopy)',
        'Transfer Certificate from previous school',
        'Report Card / Mark Sheet of last class attended',
        'Passport size photographs (4 copies)',
        'Aadhar Card of student and parents',
        'Address Proof (Ration Card / Electricity Bill)',
        'Caste Certificate (if applicable)'
    ],
    feeNote: 'For detailed fee structure, please visit the school office or contact us directly. Fee concessions may be available for meritorious students and siblings.',
    admissionContact: {
        phone: '6296490943',
        email: 'mountzionschool2021@gmail.com',
        officeHours: 'Monday to Saturday, 9:00 AM - 3:00 PM'
    },
    classesOffered: ['Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'],
    admissionOpen: true,
    academicYear: '2025-26'
};

export default function AdmissionPublicPage() {
    const [data, setData] = useState(DEFAULTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('All Classes');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const itemsPerPage = 5;

    const [siteConfig, setSiteConfig] = useState({ achievements: [], certificates: [] });

    const [certIndex, setCertIndex] = useState(0);
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API}/admission-page`);
                if (res.ok) {
                    const d = await res.json();
                    setData({ ...DEFAULTS, ...d });
                }

                // Fetch certificates from landing page config
                const resLP = await fetch(`${API}/landing-page`);
                if (resLP.ok) {
                    const lpData = await resLP.json();
                    setSiteConfig(lpData);
                }
            } catch (err) {
                console.warn('Using default admission data:', err.message);
            }
        })();
    }, []);

    const validCertificates = siteConfig.certificates?.map(c => {
        if (typeof c === 'string') return { title: '', url: c };
        return c;
    }).filter(c => c && c.url) || [];

    // Auto-scroll logic for certificates
    useEffect(() => {
        if (validCertificates.length <= 1) return;
        const timer = setInterval(() => {
            setCertIndex(prev => (prev + 1) % validCertificates.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [validCertificates.length]);

    const nextCert = () => setCertIndex(prev => (prev + 1) % validCertificates.length);
    const prevCert = () => setCertIndex(prev => (prev - 1 + validCertificates.length) % validCertificates.length);

    // Handle click outside for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter and Search Logic
    const filteredResults = useMemo(() => {
        return RESULTS_DATA.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 item.cls.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 item.roll.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesClass = classFilter === 'All Classes' || item.cls === classFilter;
            
            return matchesSearch && matchesClass;
        });
    }, [searchTerm, classFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSelectClass = (cls) => {
        setClassFilter(cls);
        setIsDropdownOpen(false);
        setCurrentPage(1);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const socials = { facebook: 'https://www.facebook.com/share/1DYSZWV8DU/', youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos' };

    return (
        <div className="landing-page admission-public-page">
            <PublicHeader />

            {/* ===== ADMISSION PROCEDURE ===== */}
            <section className="about-us-section" id="procedure" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container">
                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        <div className="rules-image-side" style={{ flex: '1' }}>
                            <div className="rules-image-box" style={{ height: '100%' }}>
                                <img src="/Admission Procedure.png" alt="Admission Procedure" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0', display: 'block' }} />
                            </div>
                        </div>

                        <div className="rules-text-side" style={{ flex: '1.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h2 className="section-title" style={{ marginBottom: '15px', paddingLeft: 0, borderLeft: 'none', fontWeight: '900', color: '#000' }}>Admission Procedure</h2>
                                <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '25px' }}>Mount Zion School</h3>

                                <div className="about-description" style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.8' }}>
                                    <p>Admission to Nursery class can be secured on the basis of communication with the parents.</p>
                                    <p style={{ marginTop: '10px' }}>LKG upwards admission based on clearing up the Entrance Test.</p>
                                    
                                    <p style={{ marginTop: '10px', fontWeight: '700', color: '#0f172a' }}>ADMISSION CRITERIA</p>
                                    <ol style={{ marginTop: '10px', paddingLeft: '20px', listStyleType: 'decimal' }}>
                                        <li style={{ marginBottom: '8px' }}>Submit the properly filled Registration Form and collect the date of the Entrance Test.</li>
                                        <li style={{ marginBottom: '8px' }}>Appear for the Entrance Exam at the Scheduled time.</li>
                                        <li style={{ marginBottom: '8px' }}>Go through the Result.</li>
                                        <li style={{ marginBottom: '8px' }}>If the student is eligible for the admission, submit the duly filled admission form, along with required documents and passport size photographs.</li>
                                        <li style={{ marginBottom: '8px' }}>Now collect final confirmation regarding admission and deposit fee.</li>
                                        <li style={{ marginBottom: '8px' }}>Try to submit original documents at the time of admission.</li>
                                        <li style={{ marginBottom: '0' }}>Basic informations like DOB, address, parent's name etc. once entered in the school admission register at the time of admission should not be changed under any circumstances.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="uniform-visit-container" style={{ marginTop: '30px' }}>
                                <hr className="visit-divider" />
                                <div className="uniform-visit" style={{ marginTop: '15px' }}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEE & PAYMENT ===== */}
            <section className="about-us-section" id="fee" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container">
                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        <div className="rules-text-side" style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h2 className="section-title" style={{ marginBottom: '15px', paddingLeft: 0, borderLeft: 'none', fontWeight: '900', color: '#000' }}>Fee & Payment</h2>
                                <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '25px' }}>Mount Zion School</h3>

                                <div className="about-description" style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.8' }}>
                                    <p>Mount Zion School, Sion Nagar, Purnea has released its fee structure for the academic session 2026-27, covering classes from Nursery to Standard 11. The fees are divided into components such as admission fee, annual (incidental) fee, examination fee, and monthly tuition fee. For lower classes (Nursery to UKG), the total fee is quite affordable at ₹5,500, with admission offered free. As students progress to higher classes, the fees gradually increase, reaching ₹24,700 for Class 9 and ₹21,200 for Classes 5 to 7. For senior classes like Standard 11, the total fee is ₹15,850.</p>
                                    
                                    <p style={{ marginTop: '15px', fontWeight: '700', color: '#0f172a' }}>Special Offer/Highlight:</p>
                                    <p style={{ marginTop: '5px' }}>The school provides free admission for early classes (up to Standard 4), making it budget-friendly for families starting their child's education. The structured and transparent fee system ensures clarity and affordability across all grade levels.</p>
                                </div>
                            </div>

                            <div className="uniform-visit-container" style={{ marginTop: '30px' }}>
                                <hr className="visit-divider" />
                                <div className="uniform-visit" style={{ marginTop: '15px' }}>
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
                            </div>
                        </div>
                        
                        <div className="rules-image-side" style={{ flex: '1' }}>
                            <div className="rules-image-box" style={{ height: '100%' }}>
                                <img src="/Fee details 26-27_cropped.jpg" alt="Fee Structure" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0', display: 'block' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SCHOOL CERTIFICATES ===== */}
            <section className="about-us-section" id="certificates" style={{ padding: '80px 0', background: '#f8fafc' }}>
                <div className="section-container">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 className="section-title" style={{ fontWeight: '900', color: '#000', borderLeft: 'none', paddingLeft: 0 }}>School Certificates</h2>
                        <p style={{ color: '#64748b', marginTop: '10px' }}>Our recognition and academic excellence awards (Click to enlarge)</p>
                    </div>

                    {validCertificates.length > 0 ? (
                        <div className="facilities-carousel-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
                            <button className="carousel-arrow prev" onClick={prevCert} style={{ left: '10px', zIndex: 10 }}>
                                <ChevronLeft size={24} />
                            </button>

                            <div className="carousel-container" style={{ display: 'flex', transition: 'transform 0.5s ease' }}>
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={certIndex}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.5 }}
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                                    >
                                        <div 
                                            onClick={() => setSelectedCert(validCertificates[certIndex])}
                                            style={{ 
                                                width: '100%',
                                                maxWidth: '800px',
                                                height: '550px', 
                                                overflow: 'hidden', 
                                                borderRadius: '12px', 
                                                background: '#fff',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                                cursor: 'zoom-in',
                                                border: '1px solid #e2e8f0',
                                                padding: '20px',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <img 
                                                    src={validCertificates[certIndex].url} 
                                                    alt={validCertificates[certIndex].title} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                                />
                                            </div>
                                            {validCertificates[certIndex].title && (
                                                <div style={{ 
                                                    padding: '20px 0 0', 
                                                    textAlign: 'center',
                                                    borderTop: '1px solid #f1f5f9',
                                                    marginTop: '15px'
                                                }}>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0B3C5D', margin: 0 }}>
                                                        {validCertificates[certIndex].title}
                                                    </h3>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <button className="carousel-arrow next" onClick={nextCert} style={{ right: '10px', zIndex: 10 }}>
                                <ChevronRight size={24} />
                            </button>

                            <div className="carousel-dots" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
                                {validCertificates.map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setCertIndex(i)}
                                        className={`dot ${i === certIndex ? 'active' : ''}`}
                                        style={{ 
                                            width: i === certIndex ? '24px' : '8px', 
                                            height: '8px', 
                                            borderRadius: '4px', 
                                            background: i === certIndex ? '#0B3C5D' : '#cbd5e1',
                                            border: 'none',
                                            transition: 'all 0.3s'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                            <p>No certificates available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ===== LIGHTBOX MODAL ===== */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedCert(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 3000,
                            padding: '40px',
                            cursor: 'zoom-out'
                        }}
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setSelectedCert(null)}
                                style={{
                                    position: 'absolute',
                                    top: '-40px',
                                    right: '0',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '1rem'
                                }}
                            >
                                Close <X size={24} />
                            </button>
                            <img 
                                src={selectedCert.url} 
                                alt={selectedCert.title} 
                                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '4px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
                            />
                            {selectedCert.title && (
                                <div style={{ 
                                    background: 'rgba(255,255,255,0.95)', 
                                    padding: '15px 25px', 
                                    marginTop: '10px', 
                                    borderRadius: '8px', 
                                    textAlign: 'center' 
                                }}>
                                    <h3 style={{ color: '#0B3C5D', margin: 0, fontWeight: '700' }}>{selectedCert.title}</h3>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <PublicFooter />
        </div>
    );
}
