import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function PublicFooter() {
    const [siteConfig, setSiteConfig] = useState({
        header: {
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

    const socials = siteConfig?.header?.socials || {};

    return (
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
                                <a href={socials.facebook} className="social-circle" target="_blank" rel="noopener noreferrer">
                                    <svg width="22" height="22" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" fill="white"/>
                                        <path d="M15.89 14.96L16.34 12.06H13.56V10.18C13.56 9.39 13.95 8.62 15.19 8.62H16.45V6.15C16.45 6.15 15.31 5.96 14.22 5.96C11.93 5.96 10.44 7.34 10.44 9.85V12.06H7.9V14.96H10.44V21.96C10.96 22.03 11.48 22.06 12 22.06C12.52 22.06 13.04 22.03 13.56 21.96V14.96H15.89Z" fill="#d31d2a"/>
                                    </svg>
                                </a>
                                <a href={socials.youtube || '#'} className="social-circle" target="_blank" rel="noopener noreferrer">
                                    <svg width="22" height="22" viewBox="0 0 24 24">
                                        <path d="M21.582 6.186a2.66 2.66 0 0 0-1.87-1.884C18.062 3.86 12 3.86 12 3.86s-6.062 0-7.712.442a2.66 2.66 0 0 0-1.87 1.884C2 7.846 2 12 2 12s0 4.154.442 5.814a2.66 2.66 0 0 0 1.87 1.884C5.938 20.14 12 20.14 12 20.14s6.062 0 7.712-.442a2.66 2.66 0 0 0 1.87-1.884C22 16.154 22 12 22 12s0-4.154-.418-5.814z" fill="white"/>
                                        <path d="M9.993 15.026V8.974L15.286 12l-5.293 3.026z" fill="#d31d2a"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="footer-col">
                            <h4>Useful Links</h4>
                            <ul className="footer-links">
                                <li style={{ marginBottom: '8px' }}><Link to="/">Home</Link></li>
                                <li style={{ marginBottom: '8px' }}><Link to="/about">About</Link></li>
                                <li style={{ marginBottom: '8px' }}><Link to="/admission">Admission</Link></li>
                                <li style={{ marginBottom: '8px' }}><Link to="/academics">Academics</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4>Support</h4>
                            <ul className="footer-links">
                                <li style={{ marginBottom: '8px' }}><Link to="/gallery">Gallery</Link></li>
                                <li style={{ marginBottom: '8px' }}><Link to="/about#notices">Notices</Link></li>
                                <li style={{ marginBottom: '8px' }}><Link to="/contact">Contact</Link></li>
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
                            <Link to="/privacy-policy">Privacy Policy</Link>
                            <span className="separator">|</span>
                            <Link to="/terms-of-service">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
