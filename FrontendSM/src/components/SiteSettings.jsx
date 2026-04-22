import React, { useState, useEffect } from 'react';
import { Save, Layout, Image, MessageSquare, Phone, Mail, Globe, Share2, BellRing } from 'lucide-react';
import { customAlert } from '../utils/dialogs';
import './SiteSettings.css';

export default function SiteSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [config, setConfig] = useState({
        header: {
            phone1: '+91 89434 94547',
            phone2: '+91 89434 94548',
            email: 'mountzion@gmail.com',
            socials: {
                facebook: 'https://facebook.com',
                youtube: 'https://youtube.com',
                instagram: 'https://instagram.com',
                whatsapp: 'https://wa.me/918943494547'
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
        }
    });

    useEffect(() => {
        const saved = localStorage.getItem('mzs_site_config');
        if (saved) {
            try {
                setConfig(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse site config", e);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('mzs_site_config', JSON.stringify(config));
        customAlert('Site Configuration updated successfully! Refresh the landing page to see changes.', 'Success', 'success');
    };

    const updateHeader = (field, value) => {
        setConfig(prev => ({ ...prev, header: { ...prev.header, [field]: value } }));
    };

    const updateSocial = (field, value) => {
        setConfig(prev => ({ 
            ...prev, 
            header: { 
                ...prev.header, 
                socials: { ...prev.header.socials, [field]: value } 
            } 
        }));
    };

    const updateHero = (field, value) => {
        setConfig(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
    };

    const updateStrip = (field, value) => {
        setConfig(prev => ({ 
            ...prev, 
            announcements: { 
                ...prev.announcements, 
                heroStrip: { ...prev.announcements.heroStrip, [field]: value } 
            } 
        }));
    };

    const addTickerItem = () => {
        setConfig(prev => ({
            ...prev,
            announcements: {
                ...prev.announcements,
                ticker: [...prev.announcements.ticker, 'New Announcement']
            }
        }));
    };

    const removeTickerItem = (index) => {
        setConfig(prev => ({
            ...prev,
            announcements: {
                ...prev.announcements,
                ticker: prev.announcements.ticker.filter((_, i) => i !== index)
            }
        }));
    };

    const updateTickerItem = (index, value) => {
        const newTicker = [...config.announcements.ticker];
        newTicker[index] = value;
        setConfig(prev => ({
            ...prev,
            announcements: {
                ...prev.announcements,
                ticker: newTicker
            }
        }));
    };

    return (
        <div className="site-settings">
            <div className="settings-sidebar">
                <button 
                    className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    <Layout size={18} /> Header & Footer
                </button>
                <button 
                    className={`settings-nav-item ${activeTab === 'hero' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hero')}
                >
                    <Image size={18} /> Hero Section
                </button>
                <button 
                    className={`settings-nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('announcements')}
                >
                    <BellRing size={18} /> Announcements
                </button>
                <button 
                    className={`settings-nav-item ${activeTab === 'social' ? 'active' : ''}`}
                    onClick={() => setActiveTab('social')}
                >
                    <Share2 size={18} /> Social Links
                </button>
            </div>

            <div className="settings-content">
                {activeTab === 'general' && (
                    <div className="settings-form-section">
                        <h3>Header Information</h3>
                        <div className="settings-grid">
                            <div className="form-group">
                                <label><Phone size={14} /> Phone 1</label>
                                <input type="text" value={config.header.phone1} onChange={e => updateHeader('phone1', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label><Phone size={14} /> Phone 2</label>
                                <input type="text" value={config.header.phone2} onChange={e => updateHeader('phone2', e.target.value)} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label><Mail size={14} /> Official Email</label>
                                <input type="email" value={config.header.email} onChange={e => updateHeader('email', e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'hero' && (
                    <div className="settings-form-section">
                        <h3>Hero Layout Settings</h3>
                        <div className="form-group">
                            <label>Hero Heading</label>
                            <input type="text" value={config.hero.title} onChange={e => updateHero('title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Hero Description</label>
                            <textarea rows="3" value={config.hero.subtitle} onChange={e => updateHero('subtitle', e.target.value)} />
                        </div>
                        <div className="settings-grid">
                            <div className="form-group">
                                <label>CTA Button Text</label>
                                <input type="text" value={config.hero.cta} onChange={e => updateHero('cta', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Background Image Path</label>
                                <input type="text" value={config.hero.image} onChange={e => updateHero('image', e.target.value)} />
                                <span className="help-text">Default: /school.png</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'announcements' && (
                    <div className="settings-form-section">
                        <h3>Ticker News (Scrolling Bar)</h3>
                        <div className="ticker-list">
                            {config.announcements.ticker.map((item, idx) => (
                                <div key={idx} className="ticker-item-edit">
                                    <input type="text" value={item} onChange={e => updateTickerItem(idx, e.target.value)} />
                                    <button className="remove-btn" onClick={() => removeTickerItem(idx)}>×</button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={addTickerItem}>+ Add Ticker Item</button>
                        </div>

                        <h3 style={{ marginTop: 30 }}>Hero Announcement Bar</h3>
                        <div className="form-group">
                            <label>Strip Announcement Message</label>
                            <input type="text" value={config.announcements.heroStrip.text} onChange={e => updateStrip('text', e.target.value)} />
                        </div>
                        <div className="settings-grid">
                            <div className="form-group">
                                <label>Target Link</label>
                                <input type="text" value={config.announcements.heroStrip.link} onChange={e => updateStrip('link', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={config.announcements.heroStrip.show} onChange={e => updateStrip('show', e.target.checked)} />
                                    Show Announcement Strip
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="settings-form-section">
                        <h3>Social Media Presence</h3>
                        <div className="settings-grid">
                            <div className="form-group">
                                <label>Facebook URL</label>
                                <input type="text" value={config.header.socials.facebook} onChange={e => updateSocial('facebook', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>YouTube URL</label>
                                <input type="text" value={config.header.socials.youtube} onChange={e => updateSocial('youtube', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Instagram URL</label>
                                <input type="text" value={config.header.socials.instagram} onChange={e => updateSocial('instagram', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>WhatsApp URL (or Link)</label>
                                <input type="text" value={config.header.socials.whatsapp} onChange={e => updateSocial('whatsapp', e.target.value)} />
                            </div>
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
