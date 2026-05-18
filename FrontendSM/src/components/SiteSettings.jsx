import React, { useState, useEffect } from 'react';
import {
    Save, Layout, Image, MessageSquare, Phone, Mail,
    Globe, Share2, BellRing, Briefcase, Award,
    Users, MapPin, Heart, Plus, Trash2, Camera, Info, LogOut, LogIn,
    BookOpen, Shirt, Trophy, Bus, FolderOpen, Calendar, Megaphone, Clock, Video
} from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import './SiteSettings.css';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from '../context/AuthContext';

const compressImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.6) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new window.Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
        };
    });
};

const ABOUT_DEFAULTS = {
    aboutUs: {
        title: 'About Us',
        subtitle: 'Mount Zion School',
        content: `
            <p>Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.</p>
            <p>It was established in 1994 and the purpose of starting this school was to give "Education to Everyone". From a humble beginning with the grace of God the school has now become a full-fledged institution. Mount Zion aims at educating different levels of students from different societies and communities and mould them in desired shapes. We give all the concerns for the scholastic and co-scholastic development of students by holding the core of the disciplinary steps. Apart from this the students are not only to excel in academic interests but also to understand that we all are made in the image of God, who wants to be fulfilled in life and work, in relationship with God, with each other and with the world He made for us to enjoy.</p>
        `,
        image: '/About.jpeg'
    },
    rules: {
        title: 'Rules & Regulations',
        subtitle: 'Mount Zion School',
        content: `
            <p style="margin-bottom: 20px;"><strong>MOUNT ZION SCHOOL</strong>, lays great stress on the development of character & conduct among the students and expects them to be worthy of highest standards of behaviour, individually & collectively in our lives. Courtesy, kindness, helpfulness and tolerance are virtues which they are particularly advised to cultivate. The following general rules of discipline should be observed strictly.</p>
            <ol style="padding-left: 20px; margin: 0; list-style-type: decimal;">
                <li style="margin-bottom: 8px;">Children are strictly forbidden to go out of the school premises during school hours without permission of the Principal.</li>
                <li style="margin-bottom: 8px;">Parents and Guardians are not allowed to see their wards or to visit teachers or to enter school verandah during school hours.</li>
                <li style="margin-bottom: 8px;">Those who come on bicycle, should keep it at the cycle stand, properly locked.</li>
                <li style="margin-bottom: 8px;">Once a student attends the school he/she will not be allowed any short leave. In case of emergency, the child can be escorted home by the parents, with the written permission of the Principal.</li>
                <li style="margin-bottom: 8px;">No student should absent himself / herself, without prior sanction of leave for the school.</li>
                <li style="margin-bottom: 8px;">The date of birth of a pupil as recorded in the admission register cannot be changed.</li>
                <li style="margin-bottom: 8px;">All students should co-operate with the school office bearers in maintaining the over all discipline of the school.</li>
                <li style="margin-bottom: 8px;">All equipments and materials given to the students for their practical works should be handled with due care. Damages & breakages should be paid for.</li>
                <li style="margin-bottom: 8px;">The parents / guardians will not hold the school indemnified against any accident for any other reasonable cause.</li>
                <li style="margin-bottom: 8px;">Every pupil is required to attend school - curricular and co-curricular activities in the prescribed uniform.</li>
                <li style="margin-bottom: 8px;">It is the duty of the pupils to see that the school premises is kept clean and tidy. They are expected to take care of the school property.</li>
                <li style="margin-bottom: 8px;">Parents/Guardians are advised to meet teacher only by prior appointment.</li>
                <li style="margin-bottom: 8px;">A pupil may be sent home during school hours for violating any of the school rules.</li>
                <li style="margin-bottom: 8px;">Malpractice of any kind in the examination will warrant to severe punishment, such as the cancellation of the examination, detentions of the result or even, rustication from the school.</li>
                <li style="margin-bottom: 8px;">The Principal reserves the right to rusticate the student from the school whose conduct in his/her opinion is against good moral tone of the school. The Principal is the sole judge regarding this.</li>
                <li style="margin-bottom: 8px;">A progress report will be issued to the student after every terminal examination which should be returned duly signed by the parent/guardian within 3 days from its receipt.</li>
                <li style="margin-bottom: 8px;">A student will not be permitted to appear in the Terminal examinations, Pre-Board or Annual Examination if his/her attendance is less than 75% before the particular examinations.</li>
                <li style="margin-bottom: 8px;">Pupils whose fees are in arrears will not be permitted to appear in the examination.</li>
                <li style="margin-bottom: 8px;">Parents are requested not to approach school teachers for private tuition.</li>
                <li style="margin-bottom: 8px;">A student who fails in the same class for two years in succession would be rusticated from the school.</li>
                <li style="margin-bottom: 8px;">The school fee covers 12 calendar months. No reduction is made for absence or holiday in either school fee or conveyance.</li>
                <li style="margin-bottom: 8px;">No books, periodicals or newspapers of any objectionable nature shall be brought to the school.</li>
                <li style="margin-bottom: 8px;">No cell phones, cameras, walkman, transistor radios, watches and other similar items shall be brought to the school. Sharp objects, crackers or other harmful materials shall also not be brought.</li>
                <li style="margin-bottom: 8px;">Any loss or damage inflicted on the school property must be duly compensated by the one concerned.</li>
                <li style="margin-bottom: 8px;">Apart from the rules above, the Principal has the right to make changes for the well-functioning of the school.</li>
            </ol>
        `,
        images: ['/rule1.jpg', '/rule2.jpg', '/rule3.jpg', '/rule4.jpg']
    },
    team: {
        title: 'Our Team',
        content: `
            <p style="margin-bottom: 10px;">Mount Zion School is a Co-Educational English Medium School.</p>
            <p>With its motto "Wisdom and Righteousness", we make every unremitting effort not only for academic performance but also for the physical, mental and intellectual development of our learners from various sectors of society by imparting quality education with self-discipline, self esteem and self confidence. Mount Zion School provides a safe and supportive environment to develop their skills for a future that reflects their highest aspiration and challenge to fly them as high as they can.</p>
        `,
        images: ['/Team1.png', '/Team2.png', '/Team3.png', '/Team4.png']
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
    },
    schoolHours: {
        title: 'INFORMATION ABOUT SCHOOL',
        content: `
            <div class="info-title">INFORMATION ABOUT SCHOOL</div>
            <div class="timing-block">
                <span class="timing-label">SCHOOL HOURS:</span>
            </div>
            <div class="timing-block">
                <span class="timing-label">DAY CLASS :</span>
                <span class="timing-detail">ASSEMBLY : 08:30 AM</span>
                <span class="timing-subdetail">Prayer / Pledges / Songs / Scripture</span>
                <span class="timing-detail">CLASS : 08:45 AM to 02:15 PM</span>
                <span class="timing-detail">LUNCH BREAK: 11:25 AM to 11:50 AM</span>
            </div>
            <div class="timing-block">
                <span class="timing-label">MORNING CLASS:</span>
                <span class="timing-detail">ASSEMBLY : 07:30 AM</span>
                <span class="timing-detail">CLASS : 07:45 AM to 01:15 PM</span>
                <span class="timing-detail">LUNCH BREAK: 10:35 AM to 11:00 AM</span>
                <span class="timing-subdetail">Parents should take their child immediately when the class is Over.</span>
            </div>
            <div class="timing-block">
                <span class="timing-label">TIME FOR SEEING THE PRINCIPAL</span>
                <span class="timing-detail">09:30 AM to 11:00 AM (Day Class)</span>
                <span class="timing-detail">08:30 AM to 10:00 AM (Morning Class)</span>
            </div>
            <div class="timing-block">
                <span class="timing-label">TIME FOR SEEING THE TEACHER</span>
                <span class="timing-detail">Every Saturday after school hour with prior appointment through the school diary.</span>
            </div>
        `
    }
};


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

export default function SiteSettings() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [config, setConfig] = useState({
        header: {
            phone: '6296490943',
            email: 'mountzionschool2021@gmail.com',
            socials: {
                facebook: 'https://www.facebook.com/share/1DYSZWV8DU/',
                youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos',
                instagram: 'https://instagram.com',
                whatsapp: 'https://wa.me/916296490943'
            }
        },
        hero: {
            title: 'A Global Campus for Global Students',
            subtitle: 'With a faculty from over 100 countries, we foster a vibrant, inclusive community that is globally connected.',
            cta: "Apply / Admitted? Let's make it official!",
            image: '/school.png'
        },
        announcements: {
            ticker: [
                'Admission Open for Session 2025-26',
                'CBSE Board Results 2024: 100% Pass Rate',
                'Summer Camp Registrations Started!'
            ],
            heroStrip: {
                text: 'Admission Inquiry for 2025-26 academic year is now open',
                link: '/admission',
                show: true
            }
        },
        facilities: [
            { title: 'Transport', image: '/Fac-Transport.png' },
            { title: 'Library', image: '/Fac-Library.png' },
            { title: 'Hostel', image: '/Fac-Hostel.png' },
            { title: 'Auditorium', image: '/Fac-Auditorium.png' },
            { title: 'Play Ground', image: '/Fac-Play.png' },
            { title: 'Computer Lab', image: '/Fac-computer.png' }
        ],
        gallery: [
            { title: 'Sports', category: 'Sports', image: '/Gallery1.png' },
            { title: 'School Tour', category: 'School Tour', image: '/Gallery2.png' },
            { title: 'Programs & Events', category: 'Programs & Events', image: '/Gallery3.png' },
            { title: 'Annual Day', category: 'Annual Day', image: '/Gallery5.png' },
            { title: 'Meetings', category: 'Meetings', image: '/Gallery4.png' }
        ],
        about: {
            title: 'About Us',
            subtitle: 'Mount Zion School',
            message: `
                <p>Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.</p>
                <p>It was established in 1994 and the purpose of starting this school was to give "Education to Everyone". From a humble beginning with the grace of God the school has now become a full-fledged institution. Mount Zion aims at educating different levels of students from different societies and communities and mould them in desired shapes. We give all the concerns for the scholastic and co-scholastic development of students by holding the core of the disciplinary steps.</p>
                <p>Apart from this the students are not only to excel in academic interests but also to understand that we all are made in the image of God, who wants to be fulfilled in life and work, in relationship with God, with each other and with the world He made for us to enjoy.</p>
            `,
            image: '/About.jpeg'
        },
        news: ['/news1.png', '/news2.png'],
        achievements: ['/Achievement1.png', '/Achievement2.png', '/Achievement3.png', '/Achievement4.png'],
        certificates: [],
        videoGallery: [],
        testimonials: [
            {
                text: "Choosing this school was one of the best decisions I've ever made.",
                author: "Ronald Richards",
                id: "ID: 132-44-4589",
                image: "https://i.pravatar.cc/150?u=ronald"
            }
        ],
        connect: {
            title: "Stay Connected with",
            goldText: "Your Child's Progress",
            subtext: "The Mount Zion Parent Portal gives you real-time access to your child's academic journey, attendance, fees, and school communications.",
            features: [
                "View attendance records & daily reports",
                "Track academic performance & grades",
                "Access fee receipts & payment history",
                "Download circulars & notices",
                "Communicate with teachers",
                "View homework & assignments"
            ]
        },
        footer: {
            ctaText: "EMPOWERING EVERY CHILD TO REACH HIGHER.",
            address: "MOUNT ZION SCHOOL, SION NAGAR, PURNEA - 854301, BIHAR, Office Timing : 7.00 am to 1:30 pm (Summer), 8.30 am to 2.30 pm (winter), Sunday Holiday",
            copyright: "Copyright © 2025 Mount Zion School, Inc. All rights reserved."
        }
    });

    const [aboutConfig, setAboutConfig] = useState(ABOUT_DEFAULTS);
    const [curriculumConfig, setCurriculumConfig] = useState(CURRICULUM_DEFAULTS);
    const [admissionConfig, setAdmissionConfig] = useState(ADMISSION_DEFAULTS);
    const [publicGallery, setPublicGallery] = useState([]);
    const [newGalleryTitle, setNewGalleryTitle] = useState('');
    const [customCategory, setCustomCategory] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const safeFetch = async (url) => {
        try {
            const res = await fetch(url);
            if (res.ok) {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    return await res.json();
                }
            }
            return null;
        } catch (e) {
            console.warn(`Failed to fetch ${url}:`, e.message);
            return null;
        }
    };

    const fetchConfig = async () => {
        try {
            const [lpData, aboutData, curData, admData, galData] = await Promise.all([
                safeFetch('/api/landing-page'),
                safeFetch('/api/about'),
                safeFetch('/api/curriculum-page'),
                safeFetch('/api/admission-page'),
                safeFetch('/api/gallery')
            ]);
            if (lpData) {
                setConfig(prev => ({
                    ...prev,
                    ...lpData,
                    header: { ...prev.header, ...(lpData.header || {}) },
                    hero: { ...prev.hero, ...(lpData.hero || {}) },
                    announcements: { ...prev.announcements, ...(lpData.announcements || {}) },
                    connect: { ...prev.connect, ...(lpData.connect || {}) },
                    about: { ...prev.about, ...(lpData.about || {}) },
                    footer: { ...prev.footer, ...(lpData.footer || {}) },
                    certificates: lpData.certificates || [],
                    videoGallery: lpData.videoGallery || []
                }));
            }
            if (aboutData) {
                setAboutConfig(prev => ({
                    ...prev,
                    ...aboutData,
                    aboutUs: { ...prev.aboutUs, ...(aboutData.aboutUs || {}) },
                    rules: { ...prev.rules, ...(aboutData.rules || {}) },
                    team: { ...prev.team, ...(aboutData.team || {}) },
                    notices: { ...prev.notices, ...(aboutData.notices || {}) },
                    schoolHours: { ...prev.schoolHours, ...(aboutData.schoolHours || {}) }
                }));
            }
            if (curData) setCurriculumConfig(prev => ({ ...prev, ...curData }));
            if (admData) setAdmissionConfig(prev => ({ ...prev, ...admData }));
            if (galData) setPublicGallery(galData);
        } catch (err) {
            console.error("Failed to fetch configs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const [resLP, resAbout, resCur, resAdm] = await Promise.all([
                fetch('/api/landing-page', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) }),
                fetch('/api/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aboutConfig) }),
                fetch('/api/curriculum-page', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(curriculumConfig) }),
                fetch('/api/admission-page', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(admissionConfig) })
            ]);

            const results = [
                { name: 'Landing Page', ok: resLP.ok },
                { name: 'About Page', ok: resAbout.ok },
                { name: 'Curriculum', ok: resCur.ok },
                { name: 'Admission', ok: resAdm.ok }
            ];

            const failed = results.filter(r => !r.ok);

            if (failed.length === 0) {
                customAlert('All configurations updated successfully!', 'Success', 'success');
            } else {
                const failedNames = failed.map(f => f.name).join(', ');
                customAlert(`Updated successfully, but failed for: ${failedNames}`, 'Partial Update', 'warning');
            }
        } catch (err) {
            customAlert('Server error: ' + err.message, 'Error', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e, section, field, index = null) => {
        const file = e.target.files[0];
        if (!file) return;
        const base64String = await compressImage(file);
        setConfig(prev => {
            const newConfig = { ...prev };
            if (index !== null && Array.isArray(newConfig[section])) {
                const newArr = [...newConfig[section]];
                if (typeof newArr[index] === 'object') {
                    newArr[index] = { ...newArr[index], [field]: base64String };
                } else {
                    newArr[index] = base64String;
                }
                newConfig[section] = newArr;
            } else if (field) {
                newConfig[section] = { ...newConfig[section], [field]: base64String };
            } else {
                newConfig[section] = base64String;
            }
            return newConfig;
        });
    };


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

    const handleAboutFileUpload = async (e, section, field, index = null) => {
        const file = e.target.files[0];
        if (!file) return;
        const base64String = await compressImage(file);
        if (index !== null) {
            updateAboutArrayItem(section, index, base64String);
        } else {
            updateAboutNested(section, field, base64String);
        }
    };

    const updateCurriculum = (field, value) => {
        setCurriculumConfig(prev => ({ ...prev, [field]: value }));
    };
    const updateCurriculumImage = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        const base64String = await compressImage(file);
        const newArr = [...(curriculumConfig.curriculumImages || [])];
        newArr[index] = base64String;
        setCurriculumConfig(prev => ({ ...prev, curriculumImages: newArr }));
    };
    const updateAdmission = (field, value) => {
        setAdmissionConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleAddGalleryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        let uploadCategory = 'Uncategorized';
        if (activeTab === 'gallery-sports') uploadCategory = 'Sports';
        else if (activeTab === 'gallery-tours') uploadCategory = 'School Tours';
        else if (activeTab === 'gallery-events') uploadCategory = 'Programs & Events';
        else if (activeTab === 'gallery-annual') uploadCategory = 'Annual Day';
        else if (activeTab === 'gallery-meetings') uploadCategory = 'Meetings';
        else if (activeTab === 'gallery-custom') uploadCategory = customCategory || 'Uncategorized';

        const base64String = await compressImage(file);
        const newImage = {
            url: base64String,
            category: uploadCategory,
            title: newGalleryTitle || 'New Gallery Image'
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

    const handleDeleteGalleryImage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPublicGallery(prev => prev.filter(img => img._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateNested = (section, field, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    // Generic array handlers
    const addToArray = (section, defaultValue) => {
        setConfig(prev => ({
            ...prev,
            [section]: [...prev[section], defaultValue]
        }));
    };

    const removeFromArray = (section, index) => {
        setConfig(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const updateArrayItem = (section, index, field, value) => {
        setConfig(prev => {
            const newArr = [...prev[section]];
            if (typeof newArr[index] === 'object') {
                newArr[index] = { ...newArr[index], [field]: value };
            } else {
                newArr[index] = value;
            }
            return { ...prev, [section]: newArr };
        });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                background: '#fff',
                borderBottom: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 'bold' }}>Mount Zion CMS</h2>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
            <div className="site-settings">
                <div className="settings-sidebar">
                    <button className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}><Layout size={18} /> General</button>

                    <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 8px 12px', fontWeight: 700 }}>Home Page</h4>
                    <button className={`settings-nav-item ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}><Image size={18} /> Hero</button>
                    <button className={`settings-nav-item ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}><Users size={18} /> About & News</button>
                    <button className={`settings-nav-item ${activeTab === 'facilities' ? 'active' : ''}`} onClick={() => setActiveTab('facilities')}><Briefcase size={18} /> Facilities</button>
                    <button className={`settings-nav-item ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}><Camera size={18} /> Home Gallery</button>
                    <button className={`settings-nav-item ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}><Award size={18} /> Achievements</button>
                    <button className={`settings-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}><Heart size={18} /> Testimonials</button>

                    <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 8px 12px', fontWeight: 700 }}>About</h4>
                    <button className={`settings-nav-item ${activeTab === 'aboutpage-aboutus' ? 'active' : ''}`} onClick={() => setActiveTab('aboutpage-aboutus')}><Info size={18} /> About Us</button>
                    <button className={`settings-nav-item ${activeTab === 'aboutpage-rules' ? 'active' : ''}`} onClick={() => setActiveTab('aboutpage-rules')}><BookOpen size={18} /> Rules & Regulations</button>
                    <button className={`settings-nav-item ${activeTab === 'aboutpage-team' ? 'active' : ''}`} onClick={() => setActiveTab('aboutpage-team')}><Users size={18} /> Our Team</button>
                    <button className={`settings-nav-item ${activeTab === 'aboutpage-notices' ? 'active' : ''}`} onClick={() => setActiveTab('aboutpage-notices')}><Megaphone size={18} /> Notices</button>
                    <button className={`settings-nav-item ${activeTab === 'aboutpage-hours' ? 'active' : ''}`} onClick={() => setActiveTab('aboutpage-hours')}><Clock size={18} /> School Hours</button>

                    <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 8px 12px', fontWeight: 700 }}>Academics</h4>
                    <button className={`settings-nav-item ${activeTab === 'academics-curriculum' ? 'active' : ''}`} onClick={() => setActiveTab('academics-curriculum')}><BookOpen size={18} /> Curriculum</button>
                    <button className={`settings-nav-item ${activeTab === 'academics-uniform' ? 'active' : ''}`} onClick={() => setActiveTab('academics-uniform')}><Shirt size={18} /> School Uniform</button>

                    <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 8px 12px', fontWeight: 700 }}>Admission</h4>
                    <button className={`settings-nav-item ${activeTab === 'admission' ? 'active' : ''}`} onClick={() => setActiveTab('admission')}><LogIn size={18} /> Admission CMS</button>
                    <button className={`settings-nav-item ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}><Award size={18} /> School Certificates</button>

                    <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 8px 12px', fontWeight: 700 }}>Gallery</h4>
                    <button className={`settings-nav-item ${activeTab === 'gallery-sports' ? 'active' : ''}`} onClick={() => setActiveTab('gallery-sports')}><Trophy size={18} /> Sports</button>
                    <button className={`settings-nav-item ${activeTab === 'gallery-tours' ? 'active' : ''}`} onClick={() => setActiveTab('gallery-tours')}><Bus size={18} /> School Tours</button>
                    <button className={`settings-nav-item ${activeTab === 'gallery-events' ? 'active' : ''}`} onClick={() => setActiveTab('gallery-events')}><Calendar size={18} /> Programs & Events</button>
                    <button className={`settings-nav-item ${activeTab === 'gallery-annual' ? 'active' : ''}`} onClick={() => setActiveTab('gallery-annual')}><Award size={18} /> Annual Day</button>
                    <button className={`settings-nav-item ${activeTab === 'gallery-meetings' ? 'active' : ''}`} onClick={() => setActiveTab('gallery-meetings')}><Users size={18} /> Meetings</button>
                    <button className={`settings-nav-item ${activeTab === 'gallery-custom' ? 'active' : ''}`} onClick={() => setActiveTab('gallery-custom')}><FolderOpen size={18} /> Custom Category</button>
                    <button className={`settings-nav-item ${activeTab === 'video-gallery' ? 'active' : ''}`} onClick={() => setActiveTab('video-gallery')}><Video size={18} /> Video Gallery</button>

                    <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 8px 12px', fontWeight: 700 }}>Footer</h4>
                    <button className={`settings-nav-item ${activeTab === 'footer' ? 'active' : ''}`} onClick={() => setActiveTab('footer')}><MapPin size={18} /> Footer</button>
                </div>

                <div className="settings-content">
                    {activeTab === 'general' && (
                        <div className="settings-form-section">
                            <h3>Header Information</h3>
                            <div className="settings-grid">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="text" value={config.header.phone} onChange={e => updateNested('header', 'phone', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={config.header.email} onChange={e => updateNested('header', 'email', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Facebook URL</label>
                                    <input type="text" value={config.header.socials.facebook} onChange={e => {
                                        const newSocials = { ...config.header.socials, facebook: e.target.value };
                                        updateNested('header', 'socials', newSocials);
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label>YouTube URL</label>
                                    <input type="text" value={config.header.socials.youtube} onChange={e => {
                                        const newSocials = { ...config.header.socials, youtube: e.target.value };
                                        updateNested('header', 'socials', newSocials);
                                    }} />
                                </div>
                            </div>

                            <h3 style={{ marginTop: 40 }}>Announcements Ticker</h3>
                            <div className="items-list">
                                {config.announcements.ticker.map((item, idx) => (
                                    <div key={idx} className="list-item-card">
                                        <input type="text" value={item} onChange={e => {
                                            const newTicker = [...config.announcements.ticker];
                                            newTicker[idx] = e.target.value;
                                            updateNested('announcements', 'ticker', newTicker);
                                        }} />
                                        <button className="remove-btn" onClick={() => {
                                            const newTicker = config.announcements.ticker.filter((_, i) => i !== idx);
                                            updateNested('announcements', 'ticker', newTicker);
                                        }}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => {
                                    const newTicker = [...config.announcements.ticker, 'New Announcement'];
                                    updateNested('announcements', 'ticker', newTicker);
                                }}><Plus size={16} /> Add Ticker Item</button>
                            </div>

                            <h3 style={{ marginTop: 40 }}>Hero Strip Announcement</h3>
                            <div className="settings-grid">
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Strip Text</label>
                                    <input type="text" value={config.announcements.heroStrip.text} onChange={e => {
                                        const newStrip = { ...config.announcements.heroStrip, text: e.target.value };
                                        updateNested('announcements', 'heroStrip', newStrip);
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label>Link</label>
                                    <input type="text" value={config.announcements.heroStrip.link} onChange={e => {
                                        const newStrip = { ...config.announcements.heroStrip, link: e.target.value };
                                        updateNested('announcements', 'heroStrip', newStrip);
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label" style={{ marginTop: 35 }}>
                                        <input type="checkbox" checked={config.announcements.heroStrip.show} onChange={e => {
                                            const newStrip = { ...config.announcements.heroStrip, show: e.target.checked };
                                            updateNested('announcements', 'heroStrip', newStrip);
                                        }} />
                                        Show Announcement Strip
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}


                    {activeTab === 'aboutpage-aboutus' && (
                        <div className="settings-form-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2>About Us</h2>
                            </div>
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
                            <div className="form-group">
                                <label>About Us Image</label>
                                <div className="upload-btn-wrapper" style={{ marginTop: '5px' }}>
                                    <input type="text" value={aboutConfig.aboutUs.image || ''} placeholder="Image URL" onChange={e => updateAboutNested('aboutUs', 'image', e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '10px', border: '1px solid #ccc' }} />
                                    <button className="upload-btn"><Camera size={14} /> Upload Image</button>
                                    <input type="file" accept="image/*" onChange={e => handleAboutFileUpload(e, 'aboutUs', 'image')} />
                                </div>
                                {aboutConfig.aboutUs.image && <div className="preview-mini"><img src={aboutConfig.aboutUs.image} alt="Preview" /></div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'aboutpage-rules' && (
                        <div className="settings-form-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2>Rules & Regulations</h2>
                            </div>
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
                                            <input type="text" value={aboutConfig.rules.images[idx] || ''} placeholder="Image URL" onChange={e => updateAboutArrayItem('rules', idx, e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '10px', border: '1px solid #ccc' }} />
                                            <button className="upload-btn"><Camera size={14} /> Upload Rule {idx + 1}</button>
                                            <input type="file" accept="image/*" onChange={e => handleAboutFileUpload(e, 'rules', null, idx)} />
                                        </div>
                                        {aboutConfig.rules.images[idx] && <div className="preview-mini"><img src={aboutConfig.rules.images[idx]} alt="Preview" /></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'aboutpage-team' && (
                        <div className="settings-form-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2>Our Team</h2>
                            </div>
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
                                            <input type="text" value={img || ''} placeholder="Image URL" onChange={e => updateAboutArrayItem('team', idx, e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '10px', border: '1px solid #ccc' }} />
                                            <button className="upload-btn"><Camera size={14} /> Upload Team {idx + 1}</button>
                                            <input type="file" accept="image/*" onChange={e => handleAboutFileUpload(e, 'team', null, idx)} />
                                        </div>
                                        {img && <div className="preview-mini"><img src={img} alt="Preview" /></div>}
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-primary" onClick={() => updateAboutNested('team', 'images', [...aboutConfig.team.images, ''])}>+ Add More Team Image</button>
                        </div>
                    )}

                    {activeTab === 'aboutpage-notices' && (
                        <div className="settings-form-section">
                            <h2>Notices</h2>
                            <div className="form-group">
                                <label>Section Title</label>
                                <input type="text" value={aboutConfig.notices.sectionTitle} onChange={e => updateAboutNested('notices', 'sectionTitle', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Notice Image</label>
                                <div className="upload-btn-wrapper" style={{ marginTop: '5px' }}>
                                    <input type="text" value={aboutConfig.notices.image || ''} placeholder="Image URL" onChange={e => updateAboutNested('notices', 'image', e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '10px', border: '1px solid #ccc' }} />
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
                    )}

                    {activeTab === 'aboutpage-hours' && (
                        <div className="settings-form-section">
                            <h2>School Hours & Timing</h2>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={aboutConfig.schoolHours.title} onChange={e => updateAboutNested('schoolHours', 'title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Hours Content (HTML format)</label>
                                <ReactQuill theme="snow" value={aboutConfig.schoolHours.content} onChange={val => updateAboutNested('schoolHours', 'content', val)} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'hero' && (
                        <div className="settings-form-section">
                            <h3>Hero Layout</h3>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={config.hero.title} onChange={e => updateNested('hero', 'title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Subtitle</label>
                                <textarea rows="2" value={config.hero.subtitle} onChange={e => updateNested('hero', 'subtitle', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Hero Image</label>
                                <div className="image-upload-wrapper">
                                    <input type="text" value={config.hero.image} onChange={e => updateNested('hero', 'image', e.target.value)} placeholder="Image Path or Base64" />
                                    <div className="upload-btn-wrapper">
                                        <button className="upload-btn"><Camera size={16} /> Upload</button>
                                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'hero', 'image')} />
                                    </div>
                                </div>
                                {config.hero.image && <div className="preview-mini"><img src={config.hero.image} alt="Preview" /></div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'facilities' && (
                        <div className="settings-form-section">
                            <h3>Facilities</h3>
                            <div className="items-list">
                                {config.facilities.map((fac, idx) => (
                                    <div key={idx} className="list-item-card">
                                        <div className="item-row">
                                            <input type="text" placeholder="Title" value={fac.title} onChange={e => updateArrayItem('facilities', idx, 'title', e.target.value)} />
                                            <input type="text" placeholder="Image URL / Path" value={fac.image || ''} onChange={e => updateArrayItem('facilities', idx, 'image', e.target.value)} />
                                            <div className="upload-btn-wrapper">
                                                <button className="upload-btn"><Camera size={14} /></button>
                                                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'facilities', 'image', idx)} />
                                            </div>
                                            <button className="remove-btn" onClick={() => removeFromArray('facilities', idx)}><Trash2 size={16} /></button>
                                        </div>
                                        {fac.image && <div className="preview-mini"><img src={fac.image} alt="Preview" /></div>}
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addToArray('facilities', { title: 'New Facility', image: '' })}><Plus size={16} /> Add Facility</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="settings-form-section">
                            <h3>Gallery Items</h3>
                            <div className="items-list">
                                {config.gallery.map((item, idx) => (
                                    <div key={idx} className="list-item-card">
                                        <div className="item-row">
                                            <input type="text" placeholder="Title" value={item.title} onChange={e => updateArrayItem('gallery', idx, 'title', e.target.value)} />
                                            <input type="text" placeholder="Category" value={item.category} onChange={e => updateArrayItem('gallery', idx, 'category', e.target.value)} />
                                            <div className="upload-btn-wrapper">
                                                <button className="upload-btn"><Camera size={14} /></button>
                                                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'gallery', 'image', idx)} />
                                            </div>
                                            <button className="remove-btn" onClick={() => removeFromArray('gallery', idx)}><Trash2 size={16} /></button>
                                        </div>
                                        {item.image && <div className="preview-mini"><img src={item.image} alt="Preview" /></div>}
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addToArray('gallery', { title: 'New Image', category: 'General', image: '' })}><Plus size={16} /> Add Gallery Item</button>
                            </div>
                        </div>
                    )}


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
                                            <img src={curriculumConfig.curriculumImages[i]} alt="Curriculum" className="preview-img" style={{ height: '100px', objectFit: 'cover' }} />
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

                    {activeTab === 'achievements' && (
                        <div className="settings-form-section">
                            <h3>Achievements (Home Page)</h3>
                            <div className="items-list">
                                {config.achievements.map((a, idx) => (
                                    <div key={idx} className="list-item-card">
                                        <div className="item-row">
                                            <input type="text" value={a || ''} placeholder="Image URL" onChange={e => updateArrayItem('achievements', idx, null, e.target.value)} />
                                            <div className="upload-btn-wrapper">
                                                <button className="upload-btn"><Camera size={14} /></button>
                                                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'achievements', null, idx)} />
                                            </div>
                                            <button className="remove-btn" onClick={() => removeFromArray('achievements', idx)}><Trash2 size={16} /></button>
                                        </div>
                                        {a && <div className="preview-mini"><img src={a} alt="Preview" /></div>}
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addToArray('achievements', '')}><Plus size={16} /> Add Achievement</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'certificates' && (
                        <div className="settings-form-section">
                            <h3>School Certificates (Admission Page)</h3>
                            <div className="items-list">
                                {config.certificates?.map((rawC, idx) => {
                                    const c = typeof rawC === 'string' ? { title: '', url: rawC } : rawC;
                                    return (
                                        <div key={idx} className="list-item-card">
                                            <div className="item-row" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                                                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                                    <input
                                                        type="text"
                                                        style={{ flex: 1 }}
                                                        value={c.title || ''}
                                                        placeholder="Certificate Title (e.g. ISO Certified)"
                                                        onChange={e => updateArrayItem('certificates', idx, 'title', e.target.value)}
                                                    />
                                                    <button className="remove-btn" onClick={() => removeFromArray('certificates', idx)}><Trash2 size={16} /></button>
                                                </div>

                                                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                                    <input
                                                        type="text"
                                                        style={{ flex: 1 }}
                                                        value={c.url || ''}
                                                        placeholder="Image Path (e.g. /land.jpg) or Upload ->"
                                                        onChange={e => updateArrayItem('certificates', idx, 'url', e.target.value)}
                                                    />
                                                    <div className="upload-btn-wrapper">
                                                        <button className="upload-btn"><Camera size={14} /></button>
                                                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'certificates', 'url', idx)} />
                                                    </div>
                                                </div>
                                            </div>
                                            {c.url && <div className="preview-mini" style={{ marginTop: '10px' }}><img src={c.url} alt="Preview" /></div>}
                                        </div>
                                    );
                                })}
                                {(!config.certificates || config.certificates.length === 0) && <p>No certificates added yet.</p>}
                                <button className="add-btn" onClick={() => addToArray('certificates', { title: '', url: '' })}><Plus size={16} /> Add Certificate</button>
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

                    {activeTab === 'about' && (
                        <div className="settings-form-section">
                            <h3>About Us Section</h3>
                            <div className="form-group">
                                <label>Heading</label>
                                <input type="text" value={config.about.title} onChange={e => updateNested('about', 'title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Principal's Message</label>
                                <textarea rows="5" value={config.about.message} onChange={e => updateNested('about', 'message', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>About Image</label>
                                <div className="image-upload-wrapper">
                                    <input type="text" value={config.about.image || ''} placeholder="Image URL" onChange={e => updateNested('about', 'image', e.target.value)} />
                                    <div className="upload-btn-wrapper">
                                        <button className="upload-btn"><Camera size={16} /> Upload</button>
                                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'about', 'image')} />
                                    </div>
                                </div>
                                {config.about.image && <div className="preview-mini"><img src={config.about.image} alt="Preview" /></div>}
                            </div>

                            <h3 style={{ marginTop: 40 }}>Latest News Images</h3>
                            <div className="items-list">
                                {config.news.map((n, idx) => (
                                    <div key={idx} className="list-item-card">
                                        <div className="item-row">
                                            <input type="text" value={n || ''} placeholder="Image URL" onChange={e => updateArrayItem('news', idx, null, e.target.value)} />
                                            <div className="upload-btn-wrapper">
                                                <button className="upload-btn"><Camera size={14} /></button>
                                                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'news', null, idx)} />
                                            </div>
                                            <button className="remove-btn" onClick={() => removeFromArray('news', idx)}><Trash2 size={16} /></button>
                                        </div>
                                        {n && <div className="preview-mini"><img src={n} alt="Preview" /></div>}
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addToArray('news', '')}><Plus size={16} /> Add News Image</button>
                            </div>
                        </div>
                    )}



                    {activeTab === 'testimonials' && (
                        <div className="settings-form-section">
                            <h3>Testimonials</h3>
                            <div className="items-list">
                                {config.testimonials.map((t, idx) => (
                                    <div key={idx} className="list-item-card" style={{ flexDirection: 'column' }}>
                                        <textarea placeholder="Testimonial Text" value={t.text} onChange={e => updateArrayItem('testimonials', idx, 'text', e.target.value)} />
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <input type="text" placeholder="Author" value={t.author} onChange={e => updateArrayItem('testimonials', idx, 'author', e.target.value)} />
                                            <input type="text" placeholder="ID/Subtext" value={t.id} onChange={e => updateArrayItem('testimonials', idx, 'id', e.target.value)} />
                                            <div className="upload-btn-wrapper">
                                                <button className="upload-btn"><Camera size={14} /></button>
                                                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'testimonials', 'image', idx)} />
                                            </div>
                                            <button className="remove-btn" onClick={() => removeFromArray('testimonials', idx)}><Trash2 size={16} /></button>
                                        </div>
                                        {t.image && <div className="preview-mini" style={{ marginTop: 10 }}><img src={t.image} alt="Preview" /></div>}
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addToArray('testimonials', { text: '', author: '', id: '', image: '' })}><Plus size={16} /> Add Testimonial</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'academics-curriculum' && (
                        <div className="settings-form-section">
                            <h2>The Curriculum</h2>
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
                                    <div key={i} className="form-group" style={{ marginBottom: 20 }}>
                                        <label>Grid Image {i + 1}</label>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
                                            {curriculumConfig.curriculumImages && curriculumConfig.curriculumImages[i] && (
                                                <img src={curriculumConfig.curriculumImages[i]} alt="Curriculum" className="preview-img" style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: 4 }} />
                                            )}
                                            <input type="file" accept="image/*" onChange={(e) => updateCurriculumImage(e, i)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'academics-uniform' && (
                        <div className="settings-form-section">
                            <h2>School Uniform</h2>
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
                        <div className="settings-form-section">
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

                    {activeTab && activeTab.startsWith('gallery-') && (
                        <div className="settings-form-section">
                            <h2>{activeTab === 'gallery-custom' ? 'Custom Category Gallery' : activeTab.replace('gallery-', '').toUpperCase() + ' GALLERY'}</h2>
                            <div className="form-group" style={{ marginBottom: 20 }}>
                                <label>Image Title</label>
                                <input type="text" placeholder="Enter image title..." value={newGalleryTitle} onChange={(e) => setNewGalleryTitle(e.target.value)} />
                            </div>
                            {activeTab === 'gallery-custom' && (
                                <div className="form-group" style={{ marginBottom: 20 }}>
                                    <label>Custom Category Name</label>
                                    <input type="text" placeholder="e.g. Science Fair" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Upload New Gallery Image</label>
                                <input type="file" accept="image/*" onChange={handleAddGalleryImage} />
                                <small>Images are uploaded immediately upon selection.</small>
                            </div>
                            <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                                {publicGallery
                                    .filter(img => {
                                        if (activeTab === 'gallery-sports') return img.category === 'Sports';
                                        if (activeTab === 'gallery-tours') return img.category === 'School Tours';
                                        if (activeTab === 'gallery-events') return img.category === 'Programs & Events';
                                        if (activeTab === 'gallery-annual') return img.category === 'Annual Day';
                                        if (activeTab === 'gallery-meetings') return img.category === 'Meetings';
                                        if (activeTab === 'gallery-custom') {
                                            return !['Sports', 'School Tours', 'Programs & Events', 'Annual Day', 'Meetings'].includes(img.category);
                                        }
                                        return true;
                                    })
                                    .map(img => (
                                        <div key={img._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', background: '#fff' }}>
                                            <img src={img.url} alt={img.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
                                            <p style={{ margin: '10px 0 5px', fontWeight: 'bold', fontSize: '0.9rem' }}>{img.title}</p>
                                            <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#666' }}>{img.category}</p>
                                            <button onClick={() => handleDeleteGalleryImage(img._id)} className="save-btn" style={{ background: '#ef4444', padding: '5px 10px', fontSize: '0.8rem', width: '100%', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 4 }}>Delete</button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
 
                 {activeTab === 'video-gallery' && (
                     <div className="settings-form-section">
                         <h3>Video Gallery Management</h3>
                         <div className="items-list">
                             {config.videoGallery?.map((v, idx) => (
                                 <div key={idx} className="list-item-card" style={{ marginBottom: '20px', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', flexDirection: 'column', alignItems: 'stretch' }}>
                                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                         <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                             <label>Video Title</label>
                                             <input type="text" value={v.videoTitle || ''} onChange={e => updateArrayItem('videoGallery', idx, 'videoTitle', e.target.value)} placeholder="e.g. Campus Tour" />
                                         </div>
                                         <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                             <label>Video Link (YouTube Embed URL)</label>
                                             <input type="text" value={v.videoLink || ''} onChange={e => updateArrayItem('videoGallery', idx, 'videoLink', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
                                             <small style={{ color: '#64748b' }}>Leave blank to hide video player for this card.</small>
                                         </div>
                                     </div>
                                     
                                     <h4 style={{ margin: '15px 0 10px', fontSize: '0.9rem', color: '#64748b' }}>Testimonial for this video</h4>
                                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                         <div className="form-group">
                                             <label>Name</label>
                                             <input type="text" value={v.testimonialName || ''} onChange={e => updateArrayItem('videoGallery', idx, 'testimonialName', e.target.value)} />
                                         </div>
                                         <div className="form-group">
                                             <label>Role</label>
                                             <input type="text" value={v.testimonialRole || ''} onChange={e => updateArrayItem('videoGallery', idx, 'testimonialRole', e.target.value)} />
                                         </div>
                                         <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                             <label>Feedback / Message</label>
                                             <textarea style={{ width: '100%', minHeight: '60px', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }} value={v.testimonialText || ''} onChange={e => updateArrayItem('videoGallery', idx, 'testimonialText', e.target.value)} />
                                         </div>
                                         <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                             <label>Testimonial Photo</label>
                                             <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                 <input type="text" style={{ flex: 1 }} value={v.testimonialImage || ''} onChange={e => updateArrayItem('videoGallery', idx, 'testimonialImage', e.target.value)} placeholder="Image Path or Upload ->" />
                                                 <div className="upload-btn-wrapper">
                                                     <button className="upload-btn"><Camera size={14} /></button>
                                                     <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'videoGallery', 'testimonialImage', idx)} />
                                                 </div>
                                             </div>
                                         </div>
                                         <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: '20px' }}>
                                             <button className="remove-btn" onClick={() => removeFromArray('videoGallery', idx)} style={{ padding: '8px 20px', borderRadius: '6px', width: 'auto', height: 'auto', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                 Remove
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                             <button className="add-btn" onClick={() => addToArray('videoGallery', { videoTitle: '', videoLink: '', testimonialName: '', testimonialRole: '', testimonialText: '', testimonialImage: '' })}>
                                 <Plus size={16}/> Add New Gallery Card
                             </button>
                         </div>
                     </div>
                 )}

                    {activeTab === 'footer' && (
                        <div className="settings-form-section">
                            <h3>Footer Settings</h3>
                            <div className="form-group">
                                <label>Footer CTA Text</label>
                                <input type="text" value={config.footer.ctaText} onChange={e => updateNested('footer', 'ctaText', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Full Address</label>
                                <input type="text" value={config.footer.address} onChange={e => updateNested('footer', 'address', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Copyright Text</label>
                                <input type="text" value={config.footer.copyright} onChange={e => updateNested('footer', 'copyright', e.target.value)} />
                            </div>
                        </div>
                    )}

                    <div className="settings-actions">
                        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : <><Save size={18} /> Save All Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
