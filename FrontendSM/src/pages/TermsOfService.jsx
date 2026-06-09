import React, { useEffect } from 'react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import SEO from '../components/SEO';
import './LandingPage.css';

export default function TermsOfService() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="landing-page">
            <SEO 
                title="Terms of Service" 
                description="Mount Zion School Terms of Service. Please read the rules and regulations governing the use of our website."
                url="https://mountzionschool.in/terms-of-service"
            />
            <PublicHeader />

            {/* ===== CONTENT SECTION ===== */}
            <section style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container" style={{ maxWidth: '1000px' }}>
                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                        <h2 className="section-title" style={{ fontSize: '2.2rem', fontWeight: '900', color: '#000', marginBottom: '10px' }}>Terms of Service</h2>
                        <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.3rem', fontWeight: '600', marginBottom: '30px' }}>Mount Zion School</h3>
                    </div>

                    <div style={{ color: '#334155', lineHeight: '1.8', fontSize: '1rem' }}>
                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>1. Acceptance of Terms</h4>
                            <p>
                                By accessing or using the Mount Zion School website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>2. Use of Website</h4>
                            <p style={{ marginBottom: '10px' }}>Permission is granted to temporarily download one copy of the materials (information or software) on Mount Zion School's website for personal, non-commercial transitory viewing only. Under this license you may not:</p>
                            <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                                <li>Modify or copy the materials;</li>
                                <li>Use the materials for any commercial purpose, or for any public display;</li>
                                <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
                                <li>Remove any copyright or other proprietary notations from the materials;</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ul>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>3. Academic Policies</h4>
                            <p>
                                All information regarding admissions, fees, and curriculum is subject to change without prior notice. The school reserves the right to modify academic schedules, rules, and regulations as deemed necessary for the betterment of the institution and its students.
                            </p>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>4. Intellectual Property</h4>
                            <p>
                                The content, logo, images, and software on this website are the property of Mount Zion School and are protected by applicable copyright and trademark laws. Unauthorized use of any materials may violate copyright, trademark, and other laws.
                            </p>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>5. Limitation of Liability</h4>
                            <p>
                                In no event shall Mount Zion School or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website, even if the school has been notified orally or in writing of the possibility of such damage.
                            </p>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>6. Governing Law</h4>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the laws of Bihar, India, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                            </p>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: '#002147', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>7. Changes to Terms</h4>
                            <p>
                                Mount Zion School may revise these Terms of Service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
