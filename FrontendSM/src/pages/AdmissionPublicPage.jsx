import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Phone, Mail, Facebook, Instagram, Youtube, Twitter, Linkedin,
    MapPin, Search, Wallet, FileText, LogIn, Menu, X,
    ArrowRight, ChevronRight, CheckCircle, ClipboardList,
    BookOpen, Calendar, Clock, FileCheck, Download, AlertCircle,
    GraduationCap, Users, Star
} from 'lucide-react';
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
        phone: '+91 89434 94547',
        email: 'mountzion@gmail.com',
        officeHours: 'Monday to Saturday, 9:00 AM - 3:00 PM'
    },
    classesOffered: ['Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'],
    admissionOpen: true,
    academicYear: '2025-26'
};

export default function AdmissionPublicPage() {
    const { user } = useAuth();
    const [data, setData] = useState(DEFAULTS);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [siteConfig, setSiteConfig] = useState({
        header: {
            phone1: '+91 89434 94547',
            phone2: '+91 89434 94548',
            email: 'mountzion@gmail.com',
            socials: { facebook: '#', youtube: '#', instagram: '#', whatsapp: '#' }
        },
        footer: {
            ctaText: 'EMPOWERING EVERY CHILD TO REACH HIGHER.',
            address: 'Emily Hattson 940 Goldendale Dr, Wasilla, Alaska 99654, USA',
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
    const phone1 = siteConfig?.header?.phone1 || '+91 89434 94547';
    const phone2 = siteConfig?.header?.phone2 || '+91 89434 94548';
    const email = siteConfig?.header?.email || 'mountzion@gmail.com';
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

    return (
        <div className="landing-page admission-public-page">
            {/* ===== TOP BAR ===== */}
            <div className="landing-top-bar">
                <div className="top-bar-content">
                    <div className="top-left-socials">
                        <a href={socials.facebook} className="social-icon"><Facebook size={14} fill="white" strokeWidth={0}/></a>
                        <a href={socials.youtube} className="social-icon"><Youtube size={14} fill="white" strokeWidth={0}/></a>
                        <a href={socials.instagram} className="social-icon"><Instagram size={14}/></a>
                        <a href={socials.whatsapp} className="social-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </a>
                    </div>
                    <div className="top-contact-info">
                        <a href={`tel:${phone1}`} className="top-info-item"><Phone size={13}/> {phone1}</a>
                        <a href={`tel:${phone2}`} className="top-info-item"><Phone size={13}/> {phone2}</a>
                        <a href={`mailto:${email}`} className="top-info-item hide-tablet"><Mail size={13}/> {email}</a>
                    </div>
                    <div className="top-right-links">
                        <span className="top-link"><Wallet size={13}/> Pay Now</span>
                        <span className="top-link"><FileText size={13}/> TC</span>
                        <Link to="/login" className="top-link top-login-link"><LogIn size={13}/> Login</Link>
                        <div className="top-search-box">
                            <Search size={13} className="search-icon-small" />
                            <input type="text" placeholder="Search" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== HEADER ===== */}
            <header className="landing-header">
                <div className="header-inner">
                    <div className="landing-nav">
                        <Link to="/" className="school-logo" style={{ textDecoration: 'none' }}>
                            <img src="/logo.png" alt="MZ Logo" />
                            <div className="school-logo-text">
                                <h2>MOUNT ZION</h2>
                                <h2>SCHOOL</h2>
                            </div>
                        </Link>
                        <div className="nav-divider"></div>
                        <Link to="/" className="nav-link">Home</Link>
                        <div className="nav-divider"></div>
                        <Link to="/about" className="nav-link">About</Link>
                        <div className="nav-divider"></div>
                        <Link to="/admission" className="nav-link active">Admission</Link>
                        <div className="nav-divider"></div>
                        <Link to="/academics" className="nav-link">Academics</Link>
                        <div className="nav-divider"></div>
                        <Link to="/curriculum" className="nav-link">Curriculum</Link>
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

            {/* ===== HERO BANNER ===== */}
            <section className="adm-hero" style={{ backgroundImage: `url("${data.heroImage}")` }}>
                <div className="adm-hero-overlay"></div>
                <motion.div className="adm-hero-content" {...fadeInUp}>
                    <div className="about-breadcrumb">
                        <Link to="/">Home</Link>
                        <ChevronRight size={14} />
                        <span>Admissions</span>
                    </div>
                    <h1>{data.pageTitle}</h1>
                    <p>{data.pageSubtitle}</p>
                    {data.admissionOpen && (
                        <div className="adm-open-badge">
                            <span className="adm-pulse"></span>
                            Admissions Open for {data.academicYear}
                        </div>
                    )}
                </motion.div>
            </section>

            {/* ===== QUICK STEPS ===== */}
            <section className="adm-steps-section">
                <div className="section-container">
                    <div className="adm-steps-grid">
                        {stepsData.map((step, idx) => {
                            const IconComp = step.icon;
                            return (
                                <motion.div
                                    className="adm-step-card"
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                                >
                                    <div className="adm-step-number">{String(idx + 1).padStart(2, '0')}</div>
                                    <div className="adm-step-icon">
                                        <IconComp size={28} />
                                    </div>
                                    <h4>{step.title}</h4>
                                    <p>{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== ADMISSION PROCEDURE ===== */}
            <section className="adm-procedure-section">
                <div className="section-container">
                    <motion.div className="adm-procedure-grid" {...fadeInUp}>
                        <div className="adm-procedure-left">
                            <span className="adm-section-tag">HOW IT WORKS</span>
                            <h2>Admission Procedure</h2>
                            <div className="adm-procedure-list">
                                {data.admissionProcedure.map((item, idx) => (
                                    <div className="adm-procedure-item" key={idx}>
                                        <div className="adm-bullet"></div>
                                        <p>{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="adm-procedure-right">
                            <div className="adm-procedure-image-wrap">
                                <img src="/school.jpeg" alt="Mount Zion School" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== ADMISSION CRITERIA ===== */}
            <section className="adm-criteria-section">
                <div className="section-container">
                    <motion.div {...fadeInUp}>
                        <div className="adm-criteria-header">
                            <span className="adm-section-tag">REQUIREMENTS</span>
                            <h2>Admission Criteria</h2>
                        </div>
                        <div className="adm-criteria-list">
                            {data.admissionCriteria.map((item, idx) => (
                                <motion.div
                                    className="adm-criteria-item"
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                                >
                                    <div className="adm-criteria-num">{String(idx + 1).padStart(2, '0')}</div>
                                    <p>{item.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== CLASSES OFFERED ===== */}
            <section className="adm-classes-section">
                <div className="section-container">
                    <motion.div {...fadeInUp}>
                        <div className="adm-classes-header">
                            <span className="adm-section-tag">ACADEMIC PROGRAMS</span>
                            <h2>Classes We Offer</h2>
                        </div>
                        <div className="adm-classes-grid">
                            {data.classesOffered.map((cls, idx) => (
                                <motion.div
                                    className="adm-class-chip"
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                                >
                                    <GraduationCap size={16} />
                                    <span>{cls}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== REQUIRED DOCUMENTS ===== */}
            <section className="adm-docs-section">
                <div className="section-container">
                    <motion.div className="adm-docs-grid" {...fadeInUp}>
                        <div className="adm-docs-left">
                            <span className="adm-section-tag">CHECKLIST</span>
                            <h2>Required Documents</h2>
                            <p className="adm-docs-intro">Please ensure you have the following documents ready at the time of admission:</p>
                            <div className="adm-docs-list">
                                {data.requiredDocuments.map((doc, idx) => (
                                    <div className="adm-doc-item" key={idx}>
                                        <FileCheck size={18} className="adm-doc-icon" />
                                        <span>{doc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="adm-docs-right">
                            <div className="adm-fee-card">
                                <div className="adm-fee-icon"><Wallet size={28} /></div>
                                <h3>Fee Information</h3>
                                <p>{data.feeNote}</p>
                                <div className="adm-fee-divider"></div>
                                <div className="adm-important-note">
                                    <AlertCircle size={18} />
                                    <span>Basic information like DOB, address, parent's name etc. once entered in the admission register should not be changed under any circumstances.</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== CONTACT / CTA ===== */}
            <section className="adm-contact-section">
                <div className="section-container">
                    <motion.div className="adm-contact-grid" {...fadeInUp}>
                        <div className="adm-contact-info">
                            <h2>Get in Touch for Admissions</h2>
                            <p>Have questions about the admission process? Our team is here to help.</p>
                            <div className="adm-contact-cards">
                                <div className="adm-contact-card">
                                    <Phone size={22} />
                                    <div>
                                        <span className="adm-contact-label">Call Us</span>
                                        <a href={`tel:${data.admissionContact.phone}`}>{data.admissionContact.phone}</a>
                                    </div>
                                </div>
                                <div className="adm-contact-card">
                                    <Mail size={22} />
                                    <div>
                                        <span className="adm-contact-label">Email Us</span>
                                        <a href={`mailto:${data.admissionContact.email}`}>{data.admissionContact.email}</a>
                                    </div>
                                </div>
                                <div className="adm-contact-card">
                                    <Clock size={22} />
                                    <div>
                                        <span className="adm-contact-label">Office Hours</span>
                                        <span>{data.admissionContact.officeHours}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="adm-cta-box">
                            <div className="adm-cta-inner">
                                <h3>Ready to Apply?</h3>
                                <p>Take the first step towards your child's bright future at Mount Zion School.</p>
                                <div className="adm-cta-buttons">
                                    <a href={`tel:${data.admissionContact.phone}`} className="adm-cta-btn primary">
                                        <Phone size={18} /> Call Now
                                    </a>
                                    <a href={`mailto:${data.admissionContact.email}`} className="adm-cta-btn secondary">
                                        <Mail size={18} /> Email Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
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
                            <Link to="/about" onClick={toggleMobileMenu}>About Us</Link>
                            <Link to="/admission" onClick={toggleMobileMenu}>Admission</Link>
                            <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
                            <Link to="/academics" onClick={toggleMobileMenu}>Academics</Link>
                            <span>Contact</span>
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
                                        <h3>MOUNT ZION</h3>
                                        <h3>SCHOOL</h3>
                                    </div>
                                </div>
                                <div className="footer-social-circles">
                                    <a href="#" className="social-circle"><Facebook size={16}/></a>
                                    <a href="#" className="social-circle"><Instagram size={16}/></a>
                                    <a href="#" className="social-circle"><Linkedin size={16}/></a>
                                    <a href="#" className="social-circle"><Twitter size={16}/></a>
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
                                    <li><Link to="/curriculum">Curriculum</Link></li>
                                    <li><Link to="/gallery">Gallery</Link></li>
                                    <li><Link to="/notices">Notices</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>Address</h4>
                                <div className="footer-address">
                                    {siteConfig.footer.address.split(',').map((line, i) => (
                                        <p key={i}>{line.trim()}</p>
                                    ))}
                                    <a href="#" className="map-link">
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
