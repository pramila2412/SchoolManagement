import React, { useState, useEffect } from 'react';
import { 
    Save, Layout, Image, MessageSquare, Phone, Mail, 
    Globe, Share2, BellRing, Briefcase, Award, 
    Users, MapPin, Heart, Plus, Trash2, Camera
} from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import './SiteSettings.css';

export default function SiteSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [config, setConfig] = useState({
        header: {
            phone1: '6296490943',
            phone2: '6296490943',
            email: 'mountzionschool2021@gmail.com',
            socials: {
                facebook: 'https://www.facebook.com/share/1DYSZWV8DU/',
                youtube: 'https://youtube.com',
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
            image: '/About.png'
        },
        news: ['/news1.png', '/news2.png'],
        achievements: ['/Achievement1.png', '/Achievement2.png', '/Achievement3.png', '/Achievement4.png'],
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

    useEffect(() => {
        const saved = localStorage.getItem('mzs_site_config');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with default to ensure new fields exist
                setConfig(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse site config", e);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('mzs_site_config', JSON.stringify(config));
        customAlert('Site Configuration updated successfully! Refresh the landing page to see changes.', 'Success', 'success');
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
        const newArr = [...config[section]];
        if (typeof newArr[index] === 'object') {
            newArr[index] = { ...newArr[index], [field]: value };
        } else {
            newArr[index] = value;
        }
        setConfig(prev => ({ ...prev, [section]: newArr }));
    };

    return (
        <div className="site-settings">
            <div className="settings-sidebar">
                <button className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}><Layout size={18} /> General</button>
                <button className={`settings-nav-item ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}><Image size={18} /> Hero</button>
                <button className={`settings-nav-item ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}><Users size={18} /> About & News</button>
                <button className={`settings-nav-item ${activeTab === 'facilities' ? 'active' : ''}`} onClick={() => setActiveTab('facilities')}><Briefcase size={18} /> Facilities</button>
                <button className={`settings-nav-item ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}><Camera size={18} /> Gallery</button>
                <button className={`settings-nav-item ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}><Award size={18} /> Achievements</button>
                <button className={`settings-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}><Heart size={18} /> Testimonials</button>
                <button className={`settings-nav-item ${activeTab === 'connect' ? 'active' : ''}`} onClick={() => setActiveTab('connect')}><Globe size={18} /> Parent Portal</button>
                <button className={`settings-nav-item ${activeTab === 'footer' ? 'active' : ''}`} onClick={() => setActiveTab('footer')}><MapPin size={18} /> Footer</button>
            </div>

            <div className="settings-content">
                {activeTab === 'general' && (
                    <div className="settings-form-section">
                        <h3>Header Information</h3>
                        <div className="settings-grid">
                            <div className="form-group">
                                <label>Phone 1</label>
                                <input type="text" value={config.header.phone1} onChange={e => updateNested('header', 'phone1', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Phone 2</label>
                                <input type="text" value={config.header.phone2} onChange={e => updateNested('header', 'phone2', e.target.value)} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Email</label>
                                <input type="email" value={config.header.email} onChange={e => updateNested('header', 'email', e.target.value)} />
                            </div>
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
                            <label>Hero Image (Path)</label>
                            <input type="text" value={config.hero.image} onChange={e => updateNested('hero', 'image', e.target.value)} />
                        </div>
                    </div>
                )}

                {activeTab === 'facilities' && (
                    <div className="settings-form-section">
                        <h3>Facilities</h3>
                        <div className="items-list">
                            {config.facilities.map((fac, idx) => (
                                <div key={idx} className="list-item-card">
                                    <input type="text" placeholder="Title" value={fac.title} onChange={e => updateArrayItem('facilities', idx, 'title', e.target.value)} />
                                    <input type="text" placeholder="Image Path" value={fac.image} onChange={e => updateArrayItem('facilities', idx, 'image', e.target.value)} />
                                    <button className="remove-btn" onClick={() => removeFromArray('facilities', idx)}><Trash2 size={16}/></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addToArray('facilities', { title: 'New Facility', image: '/Fac-Transport.png' })}><Plus size={16}/> Add Facility</button>
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="settings-form-section">
                        <h3>Gallery Items</h3>
                        <div className="items-list">
                            {config.gallery.map((item, idx) => (
                                <div key={idx} className="list-item-card">
                                    <input type="text" placeholder="Title" value={item.title} onChange={e => updateArrayItem('gallery', idx, 'title', e.target.value)} />
                                    <input type="text" placeholder="Category" value={item.category} onChange={e => updateArrayItem('gallery', idx, 'category', e.target.value)} />
                                    <input type="text" placeholder="Image Path" value={item.image} onChange={e => updateArrayItem('gallery', idx, 'image', e.target.value)} />
                                    <button className="remove-btn" onClick={() => removeFromArray('gallery', idx)}><Trash2 size={16}/></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addToArray('gallery', { title: 'New Image', category: 'General', image: '/Gallery1.png' })}><Plus size={16}/> Add Gallery Item</button>
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
                            <label>About Image Path</label>
                            <input type="text" value={config.about.image} onChange={e => updateNested('about', 'image', e.target.value)} />
                        </div>

                        <h3 style={{ marginTop: 40 }}>Latest News Images</h3>
                        <div className="items-list">
                            {config.news.map((n, idx) => (
                                <div key={idx} className="list-item-card">
                                    <input type="text" value={n} onChange={e => updateArrayItem('news', idx, null, e.target.value)} />
                                    <button className="remove-btn" onClick={() => removeFromArray('news', idx)}><Trash2 size={16}/></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addToArray('news', '/news1.png')}><Plus size={16}/> Add News Image</button>
                        </div>
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="settings-form-section">
                        <h3>Achievements Posters</h3>
                        <div className="items-list">
                            {config.achievements.map((a, idx) => (
                                <div key={idx} className="list-item-card">
                                    <input type="text" value={a} onChange={e => updateArrayItem('achievements', idx, null, e.target.value)} />
                                    <button className="remove-btn" onClick={() => removeFromArray('achievements', idx)}><Trash2 size={16}/></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addToArray('achievements', '/Achievement1.png')}><Plus size={16}/> Add Achievement</button>
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
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <input type="text" placeholder="Author" value={t.author} onChange={e => updateArrayItem('testimonials', idx, 'author', e.target.value)} />
                                        <input type="text" placeholder="ID/Subtext" value={t.id} onChange={e => updateArrayItem('testimonials', idx, 'id', e.target.value)} />
                                        <input type="text" placeholder="Image URL" value={t.image} onChange={e => updateArrayItem('testimonials', idx, 'image', e.target.value)} />
                                        <button className="remove-btn" onClick={() => removeFromArray('testimonials', idx)}><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addToArray('testimonials', { text: '', author: '', id: '', image: '' })}><Plus size={16}/> Add Testimonial</button>
                        </div>
                    </div>
                )}

                {activeTab === 'connect' && (
                    <div className="settings-form-section">
                        <h3>Parent Portal CTA</h3>
                        <div className="form-group">
                            <label>Heading (First Line)</label>
                            <input type="text" value={config.connect.title} onChange={e => updateNested('connect', 'title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Gold Text (Second Line)</label>
                            <input type="text" value={config.connect.goldText} onChange={e => updateNested('connect', 'goldText', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Subtext</label>
                            <textarea rows="3" value={config.connect.subtext} onChange={e => updateNested('connect', 'subtext', e.target.value)} />
                        </div>
                        <h4>Feature List</h4>
                        <div className="items-list">
                            {config.connect.features.map((f, idx) => (
                                <div key={idx} className="list-item-card">
                                    <input type="text" value={f} onChange={e => updateArrayItem('connect', idx, null, e.target.value)} />
                                    <button className="remove-btn" onClick={() => removeFromArray('connect', idx)}><Trash2 size={16}/></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addToArray('connect', 'New Feature')}><Plus size={16}/> Add Feature</button>
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
                    <button className="btn btn-primary btn-lg" onClick={handleSave}>
                        <Save size={18} /> Save All Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
