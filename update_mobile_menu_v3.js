const fs = require('fs');
const path = require('path');

const directory = path.join('c:', 'Users', 'prami', 'New folder', 'SchoolManagement', 'FrontendSM', 'src', 'pages');
const files = [
    'LandingPage.jsx',
    'GalleryPublicPage.jsx',
    'CurriculumPage.jsx',
    'ContactPublicPage.jsx',
    'CoCurricularPage.jsx',
    'AdmissionPublicPage.jsx',
    'AboutPage.jsx'
];

const mobileNavReplacement = `
                        <div className="mobile-nav-content">
                            <button className="close-btn" onClick={toggleMobileMenu}><X /></button>
                            
                            <div className="mobile-nav-item">
                                <Link to="/" onClick={toggleMobileMenu}>Home</Link>
                            </div>
                            
                            <div className="mobile-nav-item">
                                <Link to="/about" onClick={toggleMobileMenu} style={{ color: '#ffb800' }}>About Us</Link>
                                <div className="mobile-sub-nav">
                                    <Link to="/about" onClick={toggleMobileMenu}>About Mount Zion</Link>
                                    <Link to="/about#team" onClick={toggleMobileMenu}>The Team</Link>
                                    <Link to="/about#rules" onClick={toggleMobileMenu}>Rules & Regulations</Link>
                                    <Link to="/about#notices" onClick={toggleMobileMenu}>Notice</Link>
                                </div>
                            </div>

                            <div className="mobile-nav-item">
                                <Link to="/admission" onClick={toggleMobileMenu} style={{ color: '#ffb800' }}>Admission</Link>
                                <div className="mobile-sub-nav">
                                    <Link to="/admission#procedure" onClick={toggleMobileMenu}>Admission Procedure</Link>
                                    <Link to="/admission#fee" onClick={toggleMobileMenu}>Fee & Payment</Link>
                                    <Link to="/admission#result" onClick={toggleMobileMenu}>Admission Result-2026</Link>
                                </div>
                            </div>

                            <div className="mobile-nav-item">
                                <Link to="/academics" onClick={toggleMobileMenu} style={{ color: '#ffb800' }}>Academics</Link>
                                <div className="mobile-sub-nav">
                                    <Link to="/academics#curriculum" onClick={toggleMobileMenu}>Curriculum</Link>
                                    <Link to="/academics#uniform" onClick={toggleMobileMenu}>School Uniform</Link>
                                </div>
                            </div>

                            <div className="mobile-nav-item">
                                <Link to="/gallery" onClick={toggleMobileMenu}>Gallery</Link>
                            </div>
                            
                            <div className="mobile-nav-item">
                                <Link to="/contact" onClick={toggleMobileMenu}>Contact Us</Link>
                            </div>

                            {/* Utility Section: Pay Now, TC, Search */}
                            <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <Wallet size={24} color="#1CA7A6" />
                                        <span style={{ fontSize: '0.8rem', color: 'white' }}>Pay Now</span>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={24} color="#1CA7A6" />
                                        <span style={{ fontSize: '0.8rem', color: 'white' }}>TC</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: '30px' }}>
                                    <Search size={18} color="rgba(255,255,255,0.6)" style={{ marginRight: '10px' }} />
                                    <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
                                </div>
                            </div>
                            
                            {/* Contact & Social Section */}
                            <div className="mobile-contact-section">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <a href={\`tel:\${siteConfig.header.phone1}\`} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                                        <Phone size={18} color="#ffb800" /> {siteConfig.header.phone1}
                                    </a>
                                    <a href={\`mailto:\${siteConfig.header.email}\`} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                                        <Mail size={18} color="#ffb800" /> {siteConfig.header.email}
                                    </a>
                                </div>
                                
                                <div className="mobile-social-row">
                                    <a href={siteConfig.header.socials.facebook} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', color: 'white' }}>
                                        <Facebook size={20} />
                                    </a>
                                    <a href={siteConfig.header.socials.youtube} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', color: 'white' }}>
                                        <Youtube size={20} />
                                    </a>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {user ? (
                                    <>
                                        <Link to="/" onClick={toggleMobileMenu} style={{ color: '#1CA7A6' }}>Dashboard</Link>
                                        <span style={{ cursor: 'pointer', color: '#ff4757', fontWeight: 600 }} onClick={() => { logout(); toggleMobileMenu(); }}>Logout</span>
                                    </>
                                ) : (
                                    <Link to="/login" onClick={toggleMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1CA7A6' }}>
                                        <LogIn size={20} /> Login
                                    </Link>
                                )}
                            </div>
                        </div>
`;

files.forEach(filename => {
    const filepath = path.join(directory, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Replace the entire mobile-nav-content block
    const match = content.match(/<div className="mobile-nav-content">[\s\S]*?<\/div>\s*<\/motion\.div>/);
    if (match) {
        content = content.replace(/<div className="mobile-nav-content">[\s\S]*?<\/div>\s*(?=<\/motion\.div>)/, mobileNavReplacement);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated mobile menu in ${filename}`);
    } else {
        console.log(`Could not find mobile menu in ${filename}`);
    }
});
