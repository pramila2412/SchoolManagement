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
    
    // Replace Academics dropdown and Curriculum link
    const pattern1 = /<div className="nav-item-dropdown">\s*<Link to="\/academics" className="nav-link( active)?">Academics\s*<ChevronDown[^>]*\/>\s*<\/Link>\s*<div className="dropdown-content">\s*<Link to="\/curriculum" className="dropdown-item">Curriculum<\/Link>\s*<Link to="\/curriculum#uniform" className="dropdown-item">School Uniform<\/Link>\s*<\/div>\s*<\/div>\s*<div className="nav-divider"><\/div>\s*<Link to="\/curriculum" className="nav-link">Curriculum<\/Link>/g;
    
    const replacement1 = '<Link to="/academics" className="nav-link$1">Academics</Link>';
    
    const pattern1_alt = /<div className="nav-item-dropdown">\s*<Link to="\/academics" className="nav-link( active)?">Academics\s*<ChevronDown[^>]*\/>\s*<\/Link>\s*<div className="dropdown-content">\s*<Link to="\/curriculum" className="dropdown-item">Curriculum<\/Link>\s*<Link to="\/curriculum#uniform" className="dropdown-item">School Uniform<\/Link>\s*<\/div>\s*<\/div>/g;
    
    let newContent = content.replace(pattern1, replacement1);
    if (newContent === content) {
        newContent = content.replace(pattern1_alt, replacement1);
    }
    content = newContent;
    
    // Remove mobile menu curriculum link
    const pattern2 = /\s*<Link to="\/curriculum" onClick=\{toggleMobileMenu\}>Curriculum<\/Link>/g;
    content = content.replace(pattern2, '');
    
    // Remove footer curriculum link
    const pattern3 = /\s*<li[^>]*><Link to="\/curriculum">Curriculum<\/Link><\/li>/g;
    content = content.replace(pattern3, '');

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Processed ${filename}`);
});
