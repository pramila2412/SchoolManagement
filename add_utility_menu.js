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

files.forEach(filename => {
    const filepath = path.join(directory, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    // 1. Add Info and Search to imports if missing
    if (!content.includes('Info')) {
        content = content.replace(/} from 'lucide-react';/, ", Info } from 'lucide-react';");
    }
    
    // 2. Add utilityMenuOpen state
    if (!content.includes('utilityMenuOpen')) {
        content = content.replace(/const \[mobileMenuOpen, setMobileMenuOpen\] = useState\(false\);/, 
            "const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n    const [utilityMenuOpen, setUtilityMenuOpen] = useState(false);");
    }
    
    // 3. Add the button to the header
    const headerBtnPattern = /<button className="mobile-menu-btn lg-hide" onClick={toggleMobileMenu}>/;
    if (!content.includes('setUtilityMenuOpen')) {
        content = content.replace(headerBtnPattern, 
            `<button className="mobile-menu-btn lg-hide" onClick={() => setUtilityMenuOpen(!utilityMenuOpen)} style={{marginRight: '10px'}}>
                        <Info size={24} />
                    </button>
                    <button className="mobile-menu-btn lg-hide" onClick={toggleMobileMenu}>`);
    }

    // 4. Add the Utility Menu Overlay
    const utilityOverlay = `
            {/* ===== UTILITY MOBILE MENU ===== */}
            <AnimatePresence>
                {utilityMenuOpen && (
                    <motion.div
                        className="mobile-nav-overlay utility-menu-overlay"
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        style={{ background: 'rgba(11, 60, 93, 0.98)', height: 'auto', paddingBottom: '40px' }}
                    >
                        <div className="mobile-nav-content">
                            <button className="close-btn" onClick={() => setUtilityMenuOpen(false)}><X /></button>
                            <h3 style={{ color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Quick Links</h3>
                            
                            <div className="utility-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <a href={\`tel:\${phone1}\`} className="utility-item" style={{ color: 'white', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                                    <Phone size={24} />
                                    <span style={{ fontSize: '0.8rem' }}>Call Us</span>
                                </a>
                                <a href={\`mailto:\${email}\`} className="utility-item" style={{ color: 'white', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                                    <Mail size={24} />
                                    <span style={{ fontSize: '0.8rem' }}>Email</span>
                                </a>
                                <div className="utility-item" style={{ color: 'white', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                                    <Wallet size={24} />
                                    <span style={{ fontSize: '0.8rem' }}>Pay Now</span>
                                </div>
                                <div className="utility-item" style={{ color: 'white', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                                    <FileText size={24} />
                                    <span style={{ fontSize: '0.8rem' }}>TC</span>
                                </div>
                                <Link to="/login" onClick={() => setUtilityMenuOpen(false)} className="utility-item" style={{ color: 'white', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', gridColumn: 'span 2' }}>
                                    <LogIn size={24} />
                                    <span>Login to Portal</span>
                                </Link>
                            </div>

                            <div style={{ marginTop: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '30px' }}>
                                    <Search size={18} color="white" style={{ marginRight: '10px' }} />
                                    <input type="text" placeholder="Search school site..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', flex: 1 }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
`;

    // Insert before the main mobile menu (AnimatePresence)
    if (!content.includes('utility-menu-overlay')) {
        content = content.replace(/{\/\* ===== Mobile Nav ===== \*\/}/, utilityOverlay + '\n            {/* ===== Mobile Nav ===== */}');
    }

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Added Utility Menu to ${filename}`);
});
