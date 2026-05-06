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
    
    // 1. Remove the Info button from the header
    const infoBtnPattern = /<button className="mobile-menu-btn lg-hide" onClick={() => setUtilityMenuOpen\(!utilityMenuOpen\)} style={{marginRight: '10px'}}>\s*<Info size={24} \/>\s*<\/button>/g;
    content = content.replace(infoBtnPattern, '');

    // 2. Remove the Utility Menu Overlay block
    const utilityOverlayPattern = /{\/\* ===== UTILITY MOBILE MENU ===== \*\/}[\s\S]*?{\/\* ===== Mobile Nav ===== \*\/}/;
    content = content.replace(utilityOverlayPattern, '{/* ===== Mobile Nav ===== */}');

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Cleaned up header in ${filename}`);
});
