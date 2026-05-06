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
    
    // Convert <a> with href to <Link> with to for about/admission/academics
    // About section
    content = content.replace(/<a href="(\/about)?#team"/g, '<Link to="/about#team"');
    content = content.replace(/<a href="(\/about)?#rules"/g, '<Link to="/about#rules"');
    content = content.replace(/<a href="(\/about)?#notices"/g, '<Link to="/about#notices"');
    
    // Admission section
    content = content.replace(/<a href="(\/admission)?#procedure"/g, '<Link to="/admission#procedure"');
    content = content.replace(/<a href="(\/admission)?#fee"/g, '<Link to="/admission#fee"');
    content = content.replace(/<a href="(\/admission)?#result"/g, '<Link to="/admission#result"');
    
    // Academics section (if any <a> left)
    content = content.replace(/<a href="(\/academics)?#curriculum"/g, '<Link to="/academics#curriculum"');
    content = content.replace(/<a href="(\/academics)?#uniform"/g, '<Link to="/academics#uniform"');
    
    // Close the tags correctly
    // This is tricky if there are other <a> tags, but in the dropdown they usually end with </a>
    // We only replaced the opening tag above. Let's replace the closing tag for these specific links.
    // Actually, we can just replace </a> with </Link> if we are careful.
    // But better to do it in one go.
    
    // Let's refine the regex to be more robust
    const dropdownItemPattern = /<a href="([^"]+)" className="dropdown-item">([^<]+)<\/a>/g;
    content = content.replace(dropdownItemPattern, (match, href, text) => {
        if (href.startsWith('#') || href.startsWith('/about') || href.startsWith('/admission') || href.startsWith('/academics')) {
            let target = href;
            if (href === '#team' || href === '/about#team') target = '/about#team';
            if (href === '#rules' || href === '/about#rules') target = '/about#rules';
            if (href === '#notices' || href === '/about#notices') target = '/about#notices';
            if (href === '#procedure' || href === '/admission#procedure') target = '/admission#procedure';
            if (href === '#fee' || href === '/admission#fee') target = '/admission#fee';
            if (href === '#result' || href === '/admission#result') target = '/admission#result';
            if (href === '#curriculum' || href === '/academics#curriculum') target = '/academics#curriculum';
            if (href === '#uniform' || href === '/academics#uniform') target = '/academics#uniform';
            
            return `<Link to="${target}" className="dropdown-item">${text}</Link>`;
        }
        return match;
    });

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Fixed links in ${filename}`);
});
