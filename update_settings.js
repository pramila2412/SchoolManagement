const fs = require('fs');
let code = fs.readFileSync('FrontendSM/src/components/SiteSettings.jsx', 'utf8');

// 1. Add ReactQuill imports
if (!code.includes('react-quill')) {
    code = code.replace(
        "import './SiteSettings.css';",
        "import './SiteSettings.css';\nimport ReactQuill from 'react-quill';\nimport 'react-quill/dist/quill.snow.css';"
    );
}

// Add 'Info' icon to lucide-react if not present
if (!code.includes('Info')) {
    code = code.replace(/Camera\n/, "Camera, Info\n");
}

// 2. Add DEFAULTS for aboutConfig
const aboutDefaults = `const ABOUT_DEFAULTS = {
    aboutUs: {
        title: 'About Us',
        subtitle: 'Mount Zion School',
        content: '',
        image1: '',
        image2: ''
    },
    rules: {
        title: 'Rules & Regulations',
        subtitle: 'Mount Zion School',
        content: '',
        images: ['', '', '', '']
    },
    team: {
        title: 'Our Team',
        content: '',
        images: ['', '', '', '']
    },
    notices: {
        sectionTitle: 'Notices',
        image: '',
        subtitle: 'MOUNT ZION SCHOOL, PURNEA',
        title: 'SCHOOL CLOSED',
        reason: 'ON ACCOUNT OF MAKAR SANKRANTI FESTIVAL',
        closureDate: '14 January 2030 (Wednesday)',
        reopeningDate: 'School will reopen on 15 January 2030 (Thursday)',
        infoText: 'This is to inform parents and students that the school will remain closed on the above mentioned date due to the festival holiday.'
    }
};

export default function SiteSettings() {`;

code = code.replace("export default function SiteSettings() {", aboutDefaults);

// 3. Add state aboutConfig
code = code.replace("const [loading, setLoading] = useState(true);", "const [aboutConfig, setAboutConfig] = useState(ABOUT_DEFAULTS);\n    const [loading, setLoading] = useState(true);");

// 4. Update fetchConfig
const newFetch = `const fetchConfig = async () => {
        try {
            const [lpRes, aboutRes] = await Promise.all([
                fetch('/api/landing-page'),
                fetch('/api/about')
            ]);
            if (lpRes.ok) {
                const lpData = await lpRes.json();
                setConfig(prev => ({ ...prev, ...lpData }));
            }
            if (aboutRes.ok) {
                const aboutData = await aboutRes.json();
                setAboutConfig(prev => ({
                    aboutUs: { ...prev.aboutUs, ...(aboutData.aboutUs || {}) },
                    rules: { ...prev.rules, ...(aboutData.rules || {}) },
                    team: { ...prev.team, ...(aboutData.team || {}) },
                    notices: { ...prev.notices, ...(aboutData.notices || {}) }
                }));
            }
        } catch (err) {
            console.error("Failed to fetch configs:", err);
        } finally {
            setLoading(false);
        }
    };`;

code = code.replace(/const fetchConfig = async \(\) => \{[\s\S]*?\};/, newFetch);

// 5. Update handleSave
const newSave = `const handleSave = async () => {
        setSaving(true);
        try {
            const [resLP, resAbout] = await Promise.all([
                fetch('/api/landing-page', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(config)
                }),
                fetch('/api/about', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(aboutConfig)
                })
            ]);
            if (resLP.ok && resAbout.ok) {
                customAlert('Site Configuration updated successfully!', 'Success', 'success');
            } else {
                customAlert('Error saving configurations', 'Update Failed', 'error');
            }
        } catch (err) {
            customAlert('Server error: ' + err.message, 'Error', 'error');
        } finally {
            setSaving(false);
        }
    };`;

code = code.replace(/const handleSave = async \(\) => \{[\s\S]*?\};/, newSave);

// 6. Update updateNested to support aboutConfig
// Actually, it's easier to create updateAboutNested
const updateAboutNested = `
    const updateAboutNested = (section, field, value) => {
        setAboutConfig(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const updateAboutArrayItem = (section, index, value) => {
        const newArr = [...aboutConfig[section].images];
        newArr[index] = value;
        updateAboutNested(section, 'images', newArr);
    };

    const handleAboutFileUpload = (e, section, field, index = null) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            if (index !== null) {
                updateAboutArrayItem(section, index, base64String);
            } else {
                updateAboutNested(section, field, base64String);
            }
        };
        reader.readAsDataURL(file);
    };
`;

code = code.replace("const updateNested = (section, field, value) => {", updateAboutNested + "const updateNested = (section, field, value) => {");

// 7. Add Sidebar Tab
code = code.replace(
    "<button className={`settings-nav-item ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}><Image size={18} /> Hero</button>",
    "<button className={`settings-nav-item ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}><Image size={18} /> Hero</button>\n                <button className={`settings-nav-item ${activeTab === 'aboutpage' ? 'active' : ''}`} onClick={() => setActiveTab('aboutpage')}><Info size={18} /> About Page CMS</button>"
);

// 8. Add AboutPage CMS Tab Content
const aboutPageTab = `
                {activeTab === 'aboutpage' && (
                    <div className="settings-form-section">
                        <h2>About Page CMS</h2>
                        
                        {/* 1. About Us Section */}
                        <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h3>1. About Us Section</h3>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={aboutConfig.aboutUs.title} onChange={e => updateAboutNested('aboutUs', 'title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Subtitle</label>
                                <input type="text" value={aboutConfig.aboutUs.subtitle} onChange={e => updateAboutNested('aboutUs', 'subtitle', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Content (HTML format supported)</label>
                                <ReactQuill theme="snow" value={aboutConfig.aboutUs.content} onChange={val => updateAboutNested('aboutUs', 'content', val)} />
                            </div>
                            <div className="settings-grid">
                                <div className="form-group">
                                    <label>Image 1 (Top)</label>
                                    <div className="upload-btn-wrapper" style={{ marginTop: '5px' }}>
                                        <button className="upload-btn"><Camera size={14} /> Upload Image 1</button>
                                        <input type="file" accept="image/*" onChange={e => handleAboutFileUpload(e, 'aboutUs', 'image1')} />
                                    </div>
                                    {aboutConfig.aboutUs.image1 && <div className="preview-mini"><img src={aboutConfig.aboutUs.image1} alt="Preview" /></div>}
                                </div>
                                <div className="form-group">
                                    <label>Image 2 (Bottom)</label>
                                    <div className="upload-btn-wrapper" style={{ marginTop: '5px' }}>
                                        <button className="upload-btn"><Camera size={14} /> Upload Image 2</button>
                                        <input type="file" accept="image/*" onChange={e => handleAboutFileUpload(e, 'aboutUs', 'image2')} />
                                    </div>
                                    {aboutConfig.aboutUs.image2 && <div className="preview-mini"><img src={aboutConfig.aboutUs.image2} alt="Preview" /></div>}
                                </div>
                            </div>
                        </div>

                        {/* 2. Rules & Regulations Section */}
                        <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h3>2. Rules & Regulations</h3>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={aboutConfig.rules.title} onChange={e => updateAboutNested('rules', 'title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Subtitle</label>
                                <input type="text" value={aboutConfig.rules.subtitle} onChange={e => updateAboutNested('rules', 'subtitle', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Rules Content</label>
                                <ReactQuill theme="snow" value={aboutConfig.rules.content} onChange={val => updateAboutNested('rules', 'content', val)} />
                            </div>
                            <label>Rules Images (4 required)</label>
                            <div className="settings-grid">
                                {[0, 1, 2, 3].map(idx => (
                                    <div className="form-group" key={idx}>
                                        <div className="upload-btn-wrapper">
                                            <button className="upload-btn"><Camera size={14} /> Upload Rule {idx+1}</button>
                                            <input type="file" accept="image/*" onChange={e => handleAboutFileUpload(e, 'rules', null, idx)} />
                                        </div>
                                        {aboutConfig.rules.images[idx] && <div className="preview-mini"><img src={aboutConfig.rules.images[idx]} alt="Preview" /></div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Our Team Section */}
                        <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h3>3. Our Team</h3>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={aboutConfig.team.title} onChange={e => updateAboutNested('team', 'title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Team Description</label>
                                <ReactQuill theme="snow" value={aboutConfig.team.content} onChange={val => updateAboutNested('team', 'content', val)} />
                            </div>
                            <label>Team Images Carousel</label>
                            <div className="settings-grid">
                                {aboutConfig.team.images.map((img, idx) => (
                                    <div className="form-group" key={idx}>
                                        <div className="upload-btn-wrapper">
                                            <button className="upload-btn"><Camera size={14} /> Upload Team {idx+1}</button>
                                            <input type="file" accept="image/*" onChange={e => handleAboutFileUpload(e, 'team', null, idx)} />
                                        </div>
                                        {img && <div className="preview-mini"><img src={img} alt="Preview" /></div>}
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-primary" onClick={() => updateAboutNested('team', 'images', [...aboutConfig.team.images, ''])}>+ Add More Team Image</button>
                        </div>

                        {/* 4. Notices Section */}
                        <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h3>4. Notices</h3>
                            <div className="form-group">
                                <label>Section Title</label>
                                <input type="text" value={aboutConfig.notices.sectionTitle} onChange={e => updateAboutNested('notices', 'sectionTitle', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Notice Image</label>
                                <div className="upload-btn-wrapper" style={{ marginTop: '5px' }}>
                                    <button className="upload-btn"><Camera size={14} /> Upload Notice Image</button>
                                    <input type="file" accept="image/*" onChange={e => handleAboutFileUpload(e, 'notices', 'image')} />
                                </div>
                                {aboutConfig.notices.image && <div className="preview-mini"><img src={aboutConfig.notices.image} alt="Preview" /></div>}
                            </div>
                            <div className="form-group">
                                <label>Notice Subtitle (Small Top Text)</label>
                                <input type="text" value={aboutConfig.notices.subtitle} onChange={e => updateAboutNested('notices', 'subtitle', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Notice Main Title (e.g. SCHOOL CLOSED)</label>
                                <input type="text" value={aboutConfig.notices.title} onChange={e => updateAboutNested('notices', 'title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Reason/Sub-reason</label>
                                <input type="text" value={aboutConfig.notices.reason} onChange={e => updateAboutNested('notices', 'reason', e.target.value)} />
                            </div>
                            <div className="settings-grid">
                                <div className="form-group">
                                    <label>Closure Date Text</label>
                                    <input type="text" value={aboutConfig.notices.closureDate} onChange={e => updateAboutNested('notices', 'closureDate', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Reopening Date Text</label>
                                    <input type="text" value={aboutConfig.notices.reopeningDate} onChange={e => updateAboutNested('notices', 'reopeningDate', e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Additional Info Text</label>
                                <textarea rows="3" value={aboutConfig.notices.infoText} onChange={e => updateAboutNested('notices', 'infoText', e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}
`;

code = code.replace("{activeTab === 'hero' && (", aboutPageTab + "{activeTab === 'hero' && (");

fs.writeFileSync('FrontendSM/src/components/SiteSettings.jsx', code);
console.log('Site Settings updated.');
