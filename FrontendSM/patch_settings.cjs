const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'SiteSettings.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add Defaults
const defaultsAddition = `
const CURRICULUM_DEFAULTS = {
    pageTitle: 'The Curriculum',
    pageSubtitle: 'The following subjects are taught at different levels',
    heroImage: '/school.jpeg',
    curriculumImages: ['/curriculum1.jpg', '/curriculum2.jpg', '/curriculum3.jpg', '/curriculum4.jpg'],
    uniformTitle: 'School Uniform',
    uniformSubtitle: 'Mount Zion School',
    uniformImage: '/uniform.png'
};

const ADMISSION_DEFAULTS = {
    pageTitle: 'Admissions',
    pageSubtitle: 'Join the Mount Zion Family — Where Excellence Begins',
    heroImage: '/school.jpeg',
    admissionOpen: true,
    academicYear: '2025-26',
    feeNote: 'For detailed fee structure, please visit the school office or contact us directly. Fee concessions may be available for meritorious students and siblings.'
};
`;
content = content.replace("export default function SiteSettings() {", defaultsAddition + "\nexport default function SiteSettings() {");

// 2. Add States
const statesAddition = `
    const [curriculumConfig, setCurriculumConfig] = useState(CURRICULUM_DEFAULTS);
    const [admissionConfig, setAdmissionConfig] = useState(ADMISSION_DEFAULTS);
    const [publicGallery, setPublicGallery] = useState([]);
`;
content = content.replace("const [aboutConfig, setAboutConfig] = useState(ABOUT_DEFAULTS);", "const [aboutConfig, setAboutConfig] = useState(ABOUT_DEFAULTS);" + statesAddition);

// 3. Update Fetch Config
const fetchOld = `            const [lpRes, aboutRes] = await Promise.all([
                fetch('/api/landing-page'),
                fetch('/api/about')
            ]);`;
const fetchNew = `            const [lpRes, aboutRes, curRes, admRes, galRes] = await Promise.all([
                fetch('/api/landing-page'),
                fetch('/api/about'),
                fetch('/api/curriculum'),
                fetch('/api/admission'),
                fetch('/api/gallery')
            ]);`;
content = content.replace(fetchOld, fetchNew);

const fetchSetOld = `            if (aboutRes.ok) {
                const aboutData = await aboutRes.json();
                setAboutConfig(prev => ({
                    aboutUs: { ...prev.aboutUs, ...(aboutData.aboutUs || {}) },
                    rules: { ...prev.rules, ...(aboutData.rules || {}) },
                    team: { ...prev.team, ...(aboutData.team || {}) },
                    notices: { ...prev.notices, ...(aboutData.notices || {}) }
                }));
            }`;
const fetchSetNew = fetchSetOld + `
            if (curRes.ok) setCurriculumConfig(await curRes.json());
            if (admRes.ok) setAdmissionConfig(await admRes.json());
            if (galRes.ok) setPublicGallery(await galRes.json());`;
content = content.replace(fetchSetOld, fetchSetNew);

// 4. Update Save Config
const saveOld = `            const [resLP, resAbout] = await Promise.all([
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
            ]);`;
const saveNew = `            const [resLP, resAbout, resCur, resAdm] = await Promise.all([
                fetch('/api/landing-page', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) }),
                fetch('/api/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aboutConfig) }),
                fetch('/api/curriculum', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(curriculumConfig) }),
                fetch('/api/admission', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(admissionConfig) })
            ]);`;
content = content.replace(saveOld, saveNew);

const saveCheckOld = "if (resLP.ok && resAbout.ok) {";
const saveCheckNew = "if (resLP.ok && resAbout.ok && resCur.ok && resAdm.ok) {";
content = content.replace(saveCheckOld, saveCheckNew);

// 5. Add Custom Handlers
const handlersAddition = `
    const updateCurriculum = (field, value) => {
        setCurriculumConfig(prev => ({ ...prev, [field]: value }));
    };
    const updateCurriculumImage = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const newArr = [...(curriculumConfig.curriculumImages || [])];
            newArr[index] = reader.result;
            setCurriculumConfig(prev => ({ ...prev, curriculumImages: newArr }));
        };
        reader.readAsDataURL(file);
    };
    const updateAdmission = (field, value) => {
        setAdmissionConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleAddGalleryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            const newImage = {
                url: base64String,
                category: 'Uncategorized',
                title: 'New Gallery Image'
            };
            try {
                const res = await fetch('/api/gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newImage)
                });
                if (res.ok) {
                    const data = await res.json();
                    setPublicGallery(prev => [data.data, ...prev]);
                    customAlert('Image uploaded to Public Gallery!', 'Success', 'success');
                }
            } catch (err) {
                console.error(err);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteGalleryImage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            const res = await fetch(\`/api/gallery/\${id}\`, { method: 'DELETE' });
            if (res.ok) {
                setPublicGallery(prev => prev.filter(img => img._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };
`;
content = content.replace("const updateNested = (section, field, value) => {", handlersAddition + "\nconst updateNested = (section, field, value) => {");

// 6. Add Tabs
const tabsOld = `                    <button className={\`cms-tab \${activeTab === 'about' ? 'active' : ''}\`} onClick={() => setActiveTab('about')}>
                        <Info size={16} /> About Page CMS
                    </button>
                </div>`;
const tabsNew = `                    <button className={\`cms-tab \${activeTab === 'about' ? 'active' : ''}\`} onClick={() => setActiveTab('about')}>
                        <Info size={16} /> About Page CMS
                    </button>
                    <button className={\`cms-tab \${activeTab === 'academics' ? 'active' : ''}\`} onClick={() => setActiveTab('academics')}>
                        <Briefcase size={16} /> Academics CMS
                    </button>
                    <button className={\`cms-tab \${activeTab === 'admission' ? 'active' : ''}\`} onClick={() => setActiveTab('admission')}>
                        <Users size={16} /> Admission CMS
                    </button>
                    <button className={\`cms-tab \${activeTab === 'gallery' ? 'active' : ''}\`} onClick={() => setActiveTab('gallery')}>
                        <Image size={16} /> Public Gallery
                    </button>
                </div>`;
content = content.replace(tabsOld, tabsNew);

// 7. Add Content Sections
const sectionsAddition = `
                {activeTab === 'academics' && (
                    <div className="cms-section">
                        <h3>Academics (Curriculum) Page</h3>
                        <div className="form-group">
                            <label>Page Title</label>
                            <input type="text" value={curriculumConfig.pageTitle || ''} onChange={e => updateCurriculum('pageTitle', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Page Subtitle</label>
                            <input type="text" value={curriculumConfig.pageSubtitle || ''} onChange={e => updateCurriculum('pageSubtitle', e.target.value)} />
                        </div>
                        <h4>Curriculum Grid Images (4 Images)</h4>
                        <div className="image-grid-edit">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="form-group">
                                    <label>Grid Image {i + 1}</label>
                                    {curriculumConfig.curriculumImages && curriculumConfig.curriculumImages[i] && (
                                        <img src={curriculumConfig.curriculumImages[i]} alt="Curriculum" className="preview-img" style={{height: '100px', objectFit: 'cover'}} />
                                    )}
                                    <input type="file" accept="image/*" onChange={(e) => updateCurriculumImage(e, i)} />
                                </div>
                            ))}
                        </div>
                        <div className="form-group">
                            <label>Uniform Section Title</label>
                            <input type="text" value={curriculumConfig.uniformTitle || ''} onChange={e => updateCurriculum('uniformTitle', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Uniform Section Subtitle</label>
                            <input type="text" value={curriculumConfig.uniformSubtitle || ''} onChange={e => updateCurriculum('uniformSubtitle', e.target.value)} />
                        </div>
                    </div>
                )}

                {activeTab === 'admission' && (
                    <div className="cms-section">
                        <h3>Admission Page</h3>
                        <div className="form-group">
                            <label>Page Title</label>
                            <input type="text" value={admissionConfig.pageTitle || ''} onChange={e => updateAdmission('pageTitle', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Page Subtitle</label>
                            <input type="text" value={admissionConfig.pageSubtitle || ''} onChange={e => updateAdmission('pageSubtitle', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                            <input type="checkbox" id="admissionOpen" checked={admissionConfig.admissionOpen} onChange={e => updateAdmission('admissionOpen', e.target.checked)} style={{ width: 'auto' }} />
                            <label htmlFor="admissionOpen" style={{ marginBottom: 0 }}>Admissions Currently Open</label>
                        </div>
                        <div className="form-group">
                            <label>Academic Year</label>
                            <input type="text" value={admissionConfig.academicYear || ''} onChange={e => updateAdmission('academicYear', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Fee Structure Note</label>
                            <textarea rows="3" value={admissionConfig.feeNote || ''} onChange={e => updateAdmission('feeNote', e.target.value)} />
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="cms-section">
                        <h3>Public Gallery Images</h3>
                        <div className="form-group">
                            <label>Upload New Gallery Image</label>
                            <input type="file" accept="image/*" onChange={handleAddGalleryImage} />
                            <small>Images are uploaded immediately upon selection.</small>
                        </div>
                        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                            {publicGallery.map(img => (
                                <div key={img._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', background: '#fff' }}>
                                    <img src={img.url} alt={img.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <p style={{ margin: '10px 0 5px', fontWeight: 'bold', fontSize: '0.9rem' }}>{img.title}</p>
                                    <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#666' }}>{img.category}</p>
                                    <button onClick={() => handleDeleteGalleryImage(img._id)} className="save-btn" style={{ background: '#ef4444', padding: '5px 10px', fontSize: '0.8rem', width: '100%' }}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
`;
content = content.replace("                {activeTab === 'about' && (", sectionsAddition + "\n                {activeTab === 'about' && (");

fs.writeFileSync(filePath, content, 'utf-8');
console.log('SiteSettings.jsx patched successfully via node.');
