import React, { useEffect } from 'react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import './LandingPage.css';

export default function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="landing-page">
            <PublicHeader />

            {/* ===== CONTENT SECTION ===== */}
            <section style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container" style={{ maxWidth: '1000px' }}>
                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                        <h2 className="section-title" style={{ fontSize: '2.2rem', fontWeight: '900', color: '#000', marginBottom: '10px' }}>Privacy Policy</h2>
                        <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.3rem', fontWeight: '600', marginBottom: '30px' }}>Mount Zion School</h3>
                    </div>

                    <div style={{ color: '#334155', lineHeight: '1.8', fontSize: '1rem' }}>
                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>1. Introduction</h4>
                            <p>
                                At Mount Zion School, we are committed to protecting the privacy and security of our students, parents, and visitors. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and services.
                            </p>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>2. Information We Collect</h4>
                            <p style={{ marginBottom: '10px' }}>We may collect personal information including, but not limited to:</p>
                            <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                                <li>Contact information (name, email address, phone number)</li>
                                <li>Student records and academic history</li>
                                <li>Parent or guardian details</li>
                                <li>Payment information for fee processing</li>
                                <li>Images and videos from school events</li>
                            </ul>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>3. How We Use Your Information</h4>
                            <p style={{ marginBottom: '10px' }}>The information we collect is used for:</p>
                            <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                                <li>Managing student admissions and enrollment</li>
                                <li>Facilitating academic communication and progress tracking</li>
                                <li>Processing fee payments and financial records</li>
                                <li>Sending school announcements and newsletters</li>
                                <li>Improving our website and educational services</li>
                            </ul>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>4. Data Security</h4>
                            <p>
                                We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems and are required to keep the information confidential.
                            </p>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>5. Third-Party Disclosure</h4>
                            <p>
                                We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide you with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
                            </p>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>6. Contact Us</h4>
                            <p style={{ marginBottom: '20px' }}>If there are any questions regarding this privacy policy, you may contact us using the information below:</p>
                            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '0', borderLeft: '4px solid #f59e0b', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <p style={{ fontWeight: 'bold', color: '#002147', marginBottom: '5px' }}>Mount Zion School</p>
                                <p>Sion Nagar, Purnea - 854301, Bihar</p>
                                <p>Email: mountzionschool2021@gmail.com</p>
                                <p>Phone: 6296490943</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
