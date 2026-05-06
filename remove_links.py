import os
import re

directory = r'c:\Users\prami\New folder\SchoolManagement\FrontendSM\src\pages'
files = [
    'LandingPage.jsx',
    'GalleryPublicPage.jsx',
    'CurriculumPage.jsx',
    'ContactPublicPage.jsx',
    'CoCurricularPage.jsx',
    'AdmissionPublicPage.jsx',
    'AboutPage.jsx'
]

for filename in files:
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace Academics dropdown and Curriculum link
    # Using regex to match the block
    pattern1 = r'<div className="nav-item-dropdown">\s*<Link to="/academics" className="nav-link( active)?">Academics\s*<ChevronDown[^>]*/>\s*</Link>\s*<div className="dropdown-content">\s*<Link to="/curriculum" className="dropdown-item">Curriculum</Link>\s*<Link to="/curriculum#uniform" className="dropdown-item">School Uniform</Link>\s*</div>\s*</div>\s*<div className="nav-divider"></div>\s*<Link to="/curriculum" className="nav-link">Curriculum</Link>'
    
    replacement1 = r'<Link to="/academics" className="nav-link\1">Academics</Link>'
    
    # CurriculumPage.jsx has a different structure:
    # it doesn't have the <div className="nav-divider"></div> <Link to="/curriculum" className="nav-link">Curriculum</Link> after the dropdown.
    # It just has the dropdown and then gallery link.
    pattern1_alt = r'<div className="nav-item-dropdown">\s*<Link to="/academics" className="nav-link( active)?">Academics\s*<ChevronDown[^>]*/>\s*</Link>\s*<div className="dropdown-content">\s*<Link to="/curriculum" className="dropdown-item">Curriculum</Link>\s*<Link to="/curriculum#uniform" className="dropdown-item">School Uniform</Link>\s*</div>\s*</div>'
    
    # first try the full one
    new_content = re.sub(pattern1, replacement1, content)
    if new_content == content:
        # try alt one
        new_content = re.sub(pattern1_alt, replacement1, content)
    content = new_content
    
    # Remove mobile menu curriculum link
    pattern2 = r'\s*<Link to="/curriculum" onClick=\{toggleMobileMenu\}>Curriculum</Link>'
    content = re.sub(pattern2, '', content)
    
    # Remove footer curriculum link
    pattern3 = r'\s*<li[^>]*><Link to="/curriculum">Curriculum</Link></li>'
    content = re.sub(pattern3, '', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Processed {filename}')
