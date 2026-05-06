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

// 1. Add id="curriculum" to CurriculumPage.jsx
const curriculumPath = path.join(directory, 'CurriculumPage.jsx');
if (fs.existsSync(curriculumPath)) {
    let content = fs.readFileSync(curriculumPath, 'utf8');
    content = content.replace(
        /<section style=\{\{ padding: '80px 0', background: '#fff' \}\}>/,
        "<section style={{ padding: '80px 0', background: '#fff' }} id=\"curriculum\">"
    );
    fs.writeFileSync(curriculumPath, content, 'utf8');
}

// 2. Restore dropdowns in all files
files.forEach(filename => {
    const filepath = path.join(directory, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Pattern to find the simple Academics link
    const pattern = /<Link to="\/academics" className="nav-link( active)?">Academics<\/Link>/g;
    
    const replacement = `<div className="nav-item-dropdown">
                            <Link to="/academics" className="nav-link$1">Academics <ChevronDown size={14} className="nav-chevron" /></Link>
                            <div className="dropdown-content">
                                <Link to="/academics#curriculum" className="dropdown-item">Curriculum</Link>
                                <Link to="/academics#uniform" className="dropdown-item">School Uniform</Link>
                            </div>
                        </div>`;
    
    content = content.replace(pattern, replacement);
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Processed ${filename}`);
});
