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
`;

files.forEach(filename => {
    const filepath = path.join(directory, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Replace the entire mobile-nav-content block
    const startPattern = /<div className="mobile-nav-content">/;
    const endPattern = /<\/div>\s*<\/motion\.div>/;
    
    const match = content.match(/<div className="mobile-nav-content">[\s\S]*?<\/div>\s*<\/motion\.div>/);
    if (match) {
        // We need to keep the </motion.div> part
        content = content.replace(/<div className="mobile-nav-content">[\s\S]*?<\/div>\s*(?=<\/motion\.div>)/, mobileNavReplacement);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated mobile menu in ${filename}`);
    } else {
        console.log(`Could not find mobile menu in ${filename}`);
    }
});
