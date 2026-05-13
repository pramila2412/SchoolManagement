const fs = require('fs');
let code = fs.readFileSync('FrontendSM/src/pages/AboutPage.jsx', 'utf8');

const defaultBlockRegex = /const DEFAULTS = \{[\s\S]*?\};\n/m;
const newDefaults = `const DEFAULTS = {
    aboutUs: {
        title: 'About Us',
        subtitle: 'Mount Zion School',
        content: '<p>Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.</p><p style="margin-top: 8px;">It was established in 1994 and the purpose of starting this school was to give "Education to Everyone". From a humble beginning with the grace of God the school has now become a full-fledged institution. Mount Zion aims at educating different levels of students from different societies and communities and mould them in desired shapes. We give all the concerns for the scholastic and co-scholastic development of students by holding the core of the disciplinary steps. Apart from this the students are not only to excel in academic interests but also to understand that we all are made in the image of God, who wants to be fulfilled in life and work, in relationship with God, with each other and with the world He made for us to enjoy.</p><div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;"><div style="display: none;">HARDCODED HOURS AND RULES MOVED TO DB</div></div>',
        image1: '/About Us1.jpg',
        image2: '/About Us.png',
        visitUrl: 'https://www.facebook.com/share/1DYSZWV8DU/'
    },
    rules: {
        title: 'Rules & Regulations',
        subtitle: 'Mount Zion School',
        content: '<p style="margin-bottom: 20px;"><strong>MOUNT ZION SCHOOL</strong>, lays great stress on the development of character & conduct among the students and expects them to be worthy of highest standards of behaviour, individually & collectively in our lives. Courtesy, kindness, helpfulness and tolerance are virtues which they are particularly advised to cultivate. The following general rules of discipline should be observed strictly.</p><ol style="padding-left: 20px; margin: 0; list-style-type: decimal;"><li style="margin-bottom: 8px;">Children are strictly forbidden to go out of the school premises during school hours without permission of the Principal.</li><li style="margin-bottom: 8px;">Parents and Guardians are not allowed to see their wards or to visit teachers or to enter school verandah during school hours.</li><li style="margin-bottom: 8px;">Those who come on bicycle, should keep it at the cycle stand, properly locked.</li></ol>',
        images: ['/rule1.jpg', '/rule2.jpg', '/rule3.jpg', '/rule4.jpg']
    },
    team: {
        title: 'Our Team',
        content: '<p style="margin-bottom: 10px;">Mount Zion School is a Co-Educational English Medium School.</p><p>With its motto "Wisdom and Righteousness", we make every unremitting effort not only for academic performance but also for the physical, mental and intellectual development of our learners from various sectors of society by imparting quality education with self-discipline, self esteem and self confidence. Mount Zion School provides a safe and supportive environment to develop their skills for a future that reflects their highest aspiration and challenge to fly them as high as they can.</p>',
        images: ['/Team1.png', '/Team2.png', '/Team3.png', '/Team4.png']
    },
    notices: {
        sectionTitle: 'Notices',
        image: '/news1.png',
        subtitle: 'MOUNT ZION SCHOOL, PURNEA',
        title: 'SCHOOL CLOSED',
        reason: 'ON ACCOUNT OF MAKAR SANKRANTI FESTIVAL',
        closureDate: '14 January 2030 (Wednesday)',
        reopeningDate: 'School will reopen on 15 January 2030 (Thursday)',
        infoText: 'This is to inform parents and students that the school will remain closed on the above mentioned date due to the festival holiday.'
    }
};
`;

code = code.replace(defaultBlockRegex, newDefaults);

const fetchRegex = /setAboutData\(\{ \.\.\.DEFAULTS, \.\.\.data \}\);/;
code = code.replace(fetchRegex, `setAboutData({
                    aboutUs: { ...DEFAULTS.aboutUs, ...(data.aboutUs || {}) },
                    rules: { ...DEFAULTS.rules, ...(data.rules || {}) },
                    team: { ...DEFAULTS.team, ...(data.team || {}) },
                    notices: { ...DEFAULTS.notices, ...(data.notices || {}) }
                });`);

// Fix state array mapping
code = code.replace(/const rulesImages = \[.*?\];/, 'const rulesImages = aboutData.rules.images || DEFAULTS.rules.images;');
code = code.replace(/const teamImages = \[.*?\];/, 'const teamImages = aboutData.team.images || DEFAULTS.team.images;');

// Now we need to dynamically replace the hardcoded content with dangerouslySetInnerHTML from state.
// We will replace the hardcoded HTML blocks with dynamic variables.
code = code.replace(/<h2 style=\{\{ fontSize: '2\.5rem'.*?>About Us<\/h2>/, `<h2 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '900', color: '#000' }}>{aboutData.aboutUs.title}</h2>`);
code = code.replace(/<h3 style=\{\{ color: '#94a3b8'.*?>Mount Zion School<\/h3>/, `<h3 style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '15px' }}>{aboutData.aboutUs.subtitle}</h3>`);
code = code.replace(/<img src="\/About Us1\.jpg".*?\/>/, `<img src={aboutData.aboutUs.image1} alt="About Mount Zion School Top" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />`);
code = code.replace(/<img src="\/About Us\.png".*?\/>/, `<img src={aboutData.aboutUs.image2} alt="About Mount Zion School Bottom" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />`);

// For the about us content we replace the block starting at <div style={{ color: '#334155'...
// We will replace using a simple regex for the whole text side, but wait, it's safer to just replace specific divs.
code = code.replace(/<div style=\{\{ color: '#334155', fontSize: '0\.85rem', lineHeight: '1\.6', marginBottom: '15px' \}\}>[\s\S]*?<\/div>[\s]*<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '10px' \}\}>[\s\S]*?<\/div>/, `<div dangerouslySetInnerHTML={{ __html: aboutData.aboutUs.content }} style={{ color: '#334155', fontSize: '0.85rem', lineHeight: '1.6' }} />`);

code = code.replace(/<h2 className="section-title".*?>Rules & Regulations<\/h2>/, `<h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '900', color: '#000', marginLeft: '-40px' }}>{aboutData.rules.title}</h2>`);
code = code.replace(/<h3 className="about-subheading".*?>Mount Zion School<\/h3>/, `<h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '40px', marginLeft: '-40px' }}>{aboutData.rules.subtitle}</h3>`);
code = code.replace(/<div className="about-description" style=\{\{ color: '#1e293b', fontSize: '0\.85rem', lineHeight: '1\.6' \}\}>[\s\S]*?<\/ol>[\s]*<\/div>/, `<div className="about-description" dangerouslySetInnerHTML={{ __html: aboutData.rules.content }} style={{ color: '#1e293b', fontSize: '0.85rem', lineHeight: '1.6' }} />`);

code = code.replace(/<img src="\/rule1\.jpg"/, `<img src={rulesImages[0]}`);
code = code.replace(/<img src="\/rule2\.jpg"/, `<img src={rulesImages[1]}`);
code = code.replace(/<img src="\/rule3\.jpg"/, `<img src={rulesImages[2]}`);
code = code.replace(/<img src="\/rule4\.jpg"/, `<img src={rulesImages[3]}`);

code = code.replace(/<h2 className="section-title" style=\{\{ fontSize: '2\.5rem', fontWeight: '900', color: '#000' \}\}>Our Team<\/h2>/, `<h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000' }}>{aboutData.team.title}</h2>`);
code = code.replace(/<div className="team-description-center" style=\{\{ textAlign: 'left', color: '#334155', fontSize: '0\.9rem', lineHeight: '1\.8', maxWidth: '1000px', margin: '0 auto 50px' \}\}>[\s\S]*?<\/div>/, `<div className="team-description-center" dangerouslySetInnerHTML={{ __html: aboutData.team.content }} style={{ textAlign: 'left', color: '#334155', fontSize: '0.9rem', lineHeight: '1.8', maxWidth: '1000px', margin: '0 auto 50px' }} />`);

code = code.replace(/<h2 className="section-title" style=\{\{ fontSize: '2\.5rem', fontWeight: '900', color: '#333' \}\}>Notices<\/h2>/, `<h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#333' }}>{aboutData.notices.sectionTitle}</h2>`);
code = code.replace(/<img src="\/news1\.png"/, `<img src={aboutData.notices.image}`);
code = code.replace(/<p className="notice-subtitle".*?>MOUNT ZION SCHOOL, PURNEA<\/p>/, `<p className="notice-subtitle" style={{ color: '#C25A41', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(194, 90, 65, 0.4)', paddingBottom: '8px', display: 'inline-block' }}>{aboutData.notices.subtitle}</p>`);
code = code.replace(/<h3 className="notice-title".*?>SCHOOL CLOSED<\/h3>/, `<h3 className="notice-title" style={{ color: '#B63A22', fontSize: '1.8rem', fontWeight: '900', margin: '0 0 5px' }}>{aboutData.notices.title}</h3>`);
code = code.replace(/<p className="notice-reason".*?>ON ACCOUNT OF MAKAR SANKRANTI FESTIVAL<\/p>/, `<p className="notice-reason" style={{ color: '#B63A22', fontSize: '0.8rem', fontWeight: '700', margin: '0 0 35px', letterSpacing: '0.5px' }}>{aboutData.notices.reason}</p>`);
code = code.replace(/<div className="date-body".*?>14 January 2030 \(Wednesday\)<\/div>/, `<div className="date-body" style={{ padding: '15px', color: '#B63A22', fontSize: '0.9rem', fontWeight: '600', background: '#F3EADB' }}>{aboutData.notices.closureDate}</div>`);
code = code.replace(/<div className="date-body".*?>School will reopen on 15 January 2030 \(Thursday\)<\/div>/, `<div className="date-body" style={{ padding: '15px', color: '#B63A22', fontSize: '0.9rem', fontWeight: '600', background: '#F3EADB' }}>{aboutData.notices.reopeningDate}</div>`);
code = code.replace(/<p className="notice-info-text".*?>This is to inform parents and students that the school will remain closed on the above mentioned date due to the festival holiday\.<\/p>/, `<p className="notice-info-text" style={{ color: '#B63A22', fontSize: '0.75rem', lineHeight: '1.6', margin: '0 0 25px', padding: '0 10px' }}>{aboutData.notices.infoText}</p>`);

fs.writeFileSync('FrontendSM/src/pages/AboutPage.jsx', code);
console.log('Update Complete');
