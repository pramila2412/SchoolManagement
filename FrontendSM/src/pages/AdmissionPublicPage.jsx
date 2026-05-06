import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Phone, Mail, Facebook, Youtube,
    MapPin, Search, Wallet, FileText, LogIn, Menu, X,
    ArrowRight, ChevronRight, ChevronDown, CheckCircle, ClipboardList,
    BookOpen, Calendar, Clock, FileCheck, Download, AlertCircle,
    GraduationCap, Users, Star, ChevronLeft, Filter
, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './AdmissionPublicPage.css';
import './LandingPage.css';

const API = '/api';

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
    const { user, logout } = useAuth();
    const [data, setData] = useState(DEFAULTS);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [utilityMenuOpen, setUtilityMenuOpen] = useState(false);
    const [siteConfig, setSiteConfig] = useState({
        header: {
            phone1: '6296490943',
            phone2: '6296490943',
            email: 'mountzionschool2021@gmail.com',
            socials: { facebook: 'https://www.facebook.com/share/1DYSZWV8DU/', youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos' }
        },
        footer: {
            ctaText: 'EMPOWERING EVERY CHILD TO REACH HIGHER.',
            address: 'MOUNT ZION SCHOOL, SION NAGAR, PURNEA - 854301, BIHAR, Office Timing : 7.00 am to 1:30 pm (Summer), 8.30 am to 2.30 pm (winter), Sunday Holiday',
            copyright: 'Copyright © 2025 Mount Zion School, Inc. All rights reserved.'
        }
    });

    useEffect(() => {
        const saved = localStorage.getItem('mzs_site_config');
        if (saved) {
            try { setSiteConfig(prev => ({ ...prev, ...JSON.parse(saved) })); } catch {}
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API}/admission-page`);
                if (res.ok) {
                    const d = await res.json();
                    setData({ ...DEFAULTS, ...d });
                }
            } catch (err) {
                console.warn('Using default admission data:', err.message);
            }
        })();
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const phone1 = siteConfig?.header?.phone1 || '6296490943';
    const phone2 = siteConfig?.header?.phone2 || '6296490943';
    const email = siteConfig?.header?.email || 'mountzionschool2021@gmail.com';
    const socials = siteConfig?.header?.socials || {};

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6 }
    };

    const stepsData = [
        { icon: FileText, title: 'Get Registration Form', desc: 'Collect the registration form from the school office or download it.' },
        { icon: ClipboardList, title: 'Submit Form', desc: 'Submit the properly filled form and collect the Entrance Test date.' },
        { icon: BookOpen, title: 'Entrance Exam', desc: 'Appear for the Entrance Exam at the scheduled time.' },
        { icon: CheckCircle, title: 'Result & Admission', desc: 'Check the result. If eligible, complete the admission formalities.' }
    ];

    const tickerItems = siteConfig?.announcements?.ticker || [
        'Admission Open for Session 2025-26',
        'Mount Zion School Ranked #1 in Purnea',
        'New Sports Complex Inaugurated'
    ];

    return (
        <div className="landing-page admission-public-page">
            {/* ===== TOP BAR ===== */}
            <div className="landing-top-bar">
                <div className="top-bar-content">
                                                            <div className="top-left-socials">
                        <a href={socials.facebook} className="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="white"/></svg></a>
                        <a href={socials.youtube} className="social-icon"><svg width="21" height="15" viewBox="0 0 24 17" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M23.495 2.628c-.232-.866-.918-1.552-1.784-1.784C19.982.417 12 .417 12 .417s-7.982 0-9.711.427c-.866.232-1.552.918-1.784 1.784C.078 4.357.078 8.5.078 8.5s0 4.143.427 5.872c.232.866.918 1.552 1.784 1.784 1.729.427 9.711.427 9.711.427s7.982 0 9.711-.427c.866-.232 1.552-.918 1.784-1.784.427-1.729.427-5.872.427-5.872s0-4.143-.427-5.872zM9.545 12.067V4.933l6.231 3.567-6.231 3.567z" fill="white"/></svg></a>
                    </div>
                    <div className="top-contact-info" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <a href={`tel:${phone1}`} className="top-info-item"><Phone size={14}/> {phone1}</a>
                        <div style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)'}}></div>
                        <a href={`mailto:${email}`} className="top-info-item hide-tablet"><Mail size={14}/> {email}</a>
                        <div style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)'}}></div>
                        <span className="top-link"><Wallet size={14}/> Pay Now</span>
                        <div style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)'}}></div>
                        <span className="top-link"><FileText size={14}/> TC</span>
                        <div style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)'}}></div>
                        <Link to="/login" className="top-link top-login-link"><LogIn size={14}/> Login</Link>
                    </div>
                    <div className="top-right-links">
                        <div className="top-search-box">
                            <Search size={14} className="search-icon-small" />
                            <input type="text" placeholder="Search" />
                        </div>
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
                        <Link to="/" className="nav-link">Home <span className="nav-badge">FREE</span></Link>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/about" className="nav-link">About <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/about" className="dropdown-item">About Mount Zion</Link>
                                <Link to="/about#team" className="dropdown-item">The Team</Link>
                                <Link to="/about#rules" className="dropdown-item">Rules & Regulations</Link>
                                <Link to="/about#notices" className="dropdown-item">Notice</Link>
                            </div>
                        </div>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/admission" className="nav-link active">Admission <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/admission#procedure" className="dropdown-item">Admission Procedure</Link>
                                <Link to="/admission#fee" className="dropdown-item">Fee & Payment</Link>
                                <Link to="/admission#result" className="dropdown-item">Admission Result-2026</Link>
                            </div>
                        </div>
                        <div className="nav-divider"></div>
                        <div className="nav-item-dropdown">
                            <Link to="/academics" className="nav-link">Academics <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/academics#curriculum" className="dropdown-item">Curriculum</Link>
                                <Link to="/academics#uniform" className="dropdown-item">School Uniform</Link>
                            </div>
                        </div>
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
            <section className="about-us-section" id="fee" style={{ padding: '80px 0', background: '#f8fafc' }}>
                <div className="section-container">
                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        <div className="rules-text-side" style={{ flex: '1.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                            <div className="rules-image-box" style={{ background: '#fff', padding: '10px', borderRadius: '0', border: '1px solid #e2e8f0', height: '100%' }}>
                                <img src="/Fee.png" alt="Fee Structure" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0', display: 'block' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== ADMISSION RESULT ===== */}
            <section className="about-us-section" id="result" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container" style={{ maxWidth: '1000px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className="section-title" style={{ fontWeight: '900', color: '#000' }}>Admission Result -2026</h2>
                    </div>

                    <div className="about-description" style={{ color: '#334155', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '40px' }}>
                        <p style={{ fontWeight: '700', color: '#000', marginBottom: '5px' }}>Admission Result & Confirmation</p>
                        <p>After appearing for the entrance examination, parents/guardians are required to check the admission result as per the schedule provided by the school. Students who successfully clear the entrance test (applicable from LKG onwards) or meet the interaction criteria (for Nursery) will be considered eligible for admission.</p>
                        <p style={{ marginTop: '10px' }}>Selected candidates must complete the admission process by submitting the duly filled admission form along with all required documents and passport-size photographs. Final confirmation of admission will be granted only after document verification and payment of the prescribed fees.</p>
                        <p style={{ marginTop: '10px' }}>Parents are advised to submit original documents at the time of admission for verification. It is important to note that basic details such as Date of Birth, address, and parents' names, once recorded in the school admission register, will not be changed under any circumstances.</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '10px 15px', borderRadius: '6px', flex: '1', maxWidth: '400px', border: '1px solid #e2e8f0' }}>
                            <Search size={16} color="#94a3b8" style={{ marginRight: '10px' }} />
                            <input type="text" placeholder="Search by Student name, Class..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#334155' }} />
                        </div>
                        <button style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '10px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>
                            <Filter size={16} style={{ marginRight: '8px' }} /> Filter
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', color: '#334155' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Exam Roll Number</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>Class <ChevronDown size={14} style={{ marginLeft: '5px' }}/></th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Name of the Student</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Interview Date</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Interview Time</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Interview Panel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { roll: '514', cls: '4', name: 'Jane Cooper', date: '22/Jan/2026', time: '12:30 pm', panel: '4' },
                                    { roll: '546', cls: '5', name: 'Wade Warren', date: '22/Jan/2026', time: '3:00 pm', panel: '5' },
                                    { roll: '134', cls: '5', name: 'Esther Howard', date: '22/Jan/2026', time: '3:30 pm', panel: '4' },
                                    { roll: '544', cls: '5', name: 'Cameron Williamson', date: '22/Jan/2026', time: '4:30 pm', panel: '5' },
                                    { roll: '124', cls: '6', name: 'Brooklyn Simmons', date: '22/Jan/2026', time: '11:33 am', panel: '6' },
                                    { roll: '845', cls: '6', name: 'Leslie Alexander', date: '22/Jan/2026', time: '10:00 am', panel: '6' },
                                    { roll: '213', cls: '7', name: 'Jenny Wilson', date: '22/Jan/2026', time: '11:30 am', panel: '7' },
                                    { roll: '043', cls: '8', name: 'Guy Hawkins', date: '22/Jan/2026', time: '12:00 am', panel: '7-' }
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '15px 10px' }}>{row.roll}</td>
                                        <td style={{ padding: '15px 10px' }}>{row.cls}</td>
                                        <td style={{ padding: '15px 10px', color: '#0f172a', fontWeight: '500' }}>{row.name}</td>
                                        <td style={{ padding: '15px 10px' }}>
                                            <span style={{ color: '#059669', background: '#d1fae5', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{row.date}</span>
                                        </td>
                                        <td style={{ padding: '15px 10px', fontWeight: '500' }}>{row.time}</td>
                                        <td style={{ padding: '15px 10px' }}>{row.panel}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '30px', gap: '10px' }}>
                        <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}>
                            <ChevronLeft size={16} />
                        </button>
                        <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f59e0b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            
            {/* ===== Mobile Nav ===== */}
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
                            
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }}></div>
                            
                            <span className="mobile-link" onClick={toggleMobileMenu}><Wallet size={18} style={{marginRight: '10px'}}/> Pay Now</span>
                            <span className="mobile-link" onClick={toggleMobileMenu}><FileText size={18} style={{marginRight: '10px'}}/> TC</span>
                            
                            {user ? (
                                <>
                                    <Link to="/" onClick={toggleMobileMenu}>Dashboard</Link>
                                    <span style={{ cursor: 'pointer', color: '#ff4757', fontWeight: 600 }} onClick={() => { logout(); toggleMobileMenu(); }}>Logout</span>
                                </>
                            ) : (
                                <Link to="/login" onClick={toggleMobileMenu}><LogIn size={18} style={{marginRight: '10px'}}/> Login</Link>
                            )}
                        </div>
</motion.div>
                )}
            </AnimatePresence>

            {/* ===== FOOTER ===== */}
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
                                        <h3>MOUNT ZION SCHOOL</h3>
                                        <p className="footer-affiliation">Affiliated to CBSE, New Delhi upto +2 level</p>
                                        <p className="footer-affiliation-period">Period of Affiliation :2027</p>
                                    </div>
                                </div>
                                <div className="footer-social-circles">
                                    <a href={socials.facebook} className="social-circle" target="_blank" rel="noopener noreferrer"><svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="white"/><path d="M15.89 14.96L16.34 12.06H13.56V10.18C13.56 9.39 13.95 8.62 15.19 8.62H16.45V6.15C16.45 6.15 15.31 5.96 14.22 5.96C11.93 5.96 10.44 7.34 10.44 9.85V12.06H7.9V14.96H10.44V21.96C10.96 22.03 11.48 22.06 12 22.06C12.52 22.06 13.04 22.03 13.56 21.96V14.96H15.89Z" fill="#d31d2a"/></svg></a>
                                    <a href={socials.youtube || '#'} className="social-circle" target="_blank" rel="noopener noreferrer"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M21.582 6.186a2.66 2.66 0 0 0-1.87-1.884C18.062 3.86 12 3.86 12 3.86s-6.062 0-7.712.442a2.66 2.66 0 0 0-1.87 1.884C2 7.846 2 12 2 12s0 4.154.442 5.814a2.66 2.66 0 0 0 1.87 1.884C5.938 20.14 12 20.14 12 20.14s6.062 0 7.712-.442a2.66 2.66 0 0 0 1.87-1.884C22 16.154 22 12 22 12s0-4.154-.418-5.814z" fill="white"/><path d="M9.993 15.026V8.974L15.286 12l-5.293 3.026z" fill="#d31d2a"/></svg></a>
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
                                    <li><Link to="/gallery">Gallery</Link></li>
                                    <li><Link to="/notices">Notices</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>Address</h4>
                                <div className="footer-address">
                                    <div className="address-block">
                                        <p>MOUNT ZION SCHOOL</p>
                                        <p>SION NAGAR</p>
                                        <p>PURNEA - 854301</p>
                                        <p>BIHAR</p>
                                    </div>
                                    <div className="contact-block">
                                        <p>Contact No. 6296490943</p>
                                        <p>Office Timing : 7.00 am to 1:30 pm (Summer)</p>
                                        <p>8.30 am to 2.30 pm (winter)</p>
                                        <p>Sunday Holiday</p>
                                    </div>
                                    <a href="https://maps.app.goo.gl/EqYY3hjh4gDCozwHA" className="map-link" target="_blank" rel="noopener noreferrer">
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
