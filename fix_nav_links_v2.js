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
    
    // Fix the broken tags first (where it's <Link ...> ... </a>)
    content = content.replace(/<Link to="([^"]+)" className="dropdown-item">([^<]+)<\/a>/g, '<Link to="$1" className="dropdown-item">$2</Link>');
    
    // Also handle any remaining <a> tags correctly
    const dropdownItemPattern = /<a href="([^"]+)" className="dropdown-item">([^<]+)<\/a>/g;
    content = content.replace(dropdownItemPattern, (match, href, text) => {
        let target = href;
        if (href.includes('#')) {
            if (href.includes('team')) target = '/about#team';
            if (href.includes('rules')) target = '/about#rules';
            if (href.includes('notices')) target = '/about#notices';
            if (href.includes('procedure')) target = '/admission#procedure';
            if (href.includes('fee')) target = '/admission#fee';
            if (href.includes('result')) target = '/admission#result';
            if (href.includes('curriculum')) target = '/academics#curriculum';
            if (href.includes('uniform')) target = '/academics#uniform';
        }
        
        if (target.startsWith('/') || target.startsWith('#')) {
             return `<Link to="${target}" className="dropdown-item">${text}</Link>`;
        }
        return match;
    });

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Cleaned up links in ${filename}`);
});
