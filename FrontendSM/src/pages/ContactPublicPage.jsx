import React, { useState, useEffect } from 'react';
import {
    ChevronDown
} from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import SEO from '../components/SEO';
import './ContactPublicPage.css';
import './LandingPage.css';

const API = '/api';

const DEFAULTS = {
    pageTitle: 'Contact Us',
    pageSubtitle: 'We would love to hear from you',
    heroImage: '/contact.jpeg',
    address: {
        name: 'MOUNT ZION SCHOOL',
        street: 'SION NAGAR',
        cityState: 'PURNEA - 854301, BIHAR'
    },
    contactNumbers: ['6296490943'],
    emails: ['mountzionschool@gmail.com', 'mountzionschool2021@gmail.com'],
    officeTiming: {
        summer: '7.00 am to 1:30 pm (Summer)',
        winter: '8.30 am to 2.30 pm (Winter)',
        holidays: 'Sunday Holiday'
    }
};

export default function ContactPublicPage() {
    const [data, setData] = useState(DEFAULTS);
    
    // Form state
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [countryCode, setCountryCode] = useState('IN');
    const [showCountries, setShowCountries] = useState(false);

    const countries = [
        { code: 'IN', dial: '+91', name: 'India' },
        { code: 'US', dial: '+1', name: 'USA' },
        { code: 'GB', dial: '+44', name: 'UK' },
        { code: 'CA', dial: '+1', name: 'Canada' },
        { code: 'AU', dial: '+61', name: 'Australia' }
    ];

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API}/contact/page`);
                if (res.ok) {
                    const d = await res.json();
                    setData({ ...DEFAULTS, ...d });
                }
            } catch (err) {
                console.warn('Using default contact data:', err.message);
            }
        })();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        
        // Email validation (Strict)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address (e.g., name@domain.com)';
        }
        
        // Phone validation (Exactly 10 digits)
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (phoneDigits.length !== 10) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }
        
        if (!formData.message.trim()) {
            newErrors.message = 'Message cannot be empty';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message should be at least 10 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setSubmitStatus('error');
            setStatusMessage('Please correct the errors in the form.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrors({});
        
        try {
            const res = await fetch(`${API}/contact/inquire`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await res.json();
            
            if (res.ok) {
                setSubmitStatus('success');
                setStatusMessage(result.message);
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
                
                setTimeout(() => setSubmitStatus(null), 5000);
            } else {
                setSubmitStatus('error');
                setStatusMessage(result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setStatusMessage('Failed to send message. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="landing-page contact-public-page">
            <SEO 
                title="Contact Us" 
                description="Get in touch with Mount Zion School. We would love to hear from you."
                keywords="contact mount zion, school contact, mount zion phone number, mount zion address"
                url="https://mountzionschool.in/contact"
            />
            <PublicHeader />

            {/* ===== NEW CONTACT SECTION ===== */}
            <section id="get-in-touch" className="contact-section">
                <div className="section-container">
                    <div className="contact-layout-wrapper">
                        <div className="contact-form-side">
                            <h2 className="contact-heading-text">Get in touch</h2>
                            <p className="contact-subtext">Our friendly team would love to hear from you.</p>

                            <form onSubmit={handleFormSubmit} className="contact-form-element">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First name</label>
                                        <input 
                                            type="text" 
                                            name="firstName" 
                                            value={formData.firstName} 
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                                            placeholder="First name" 
                                            required 
                                            className={errors.firstName ? 'input-error' : ''}
                                            style={{ border: `1px solid ${errors.firstName ? '#ef4444' : '#cbd5e1'}` }}
                                        />
                                        {errors.firstName && <p className="error-text">{errors.firstName}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Last name</label>
                                        <input 
                                            type="text" 
                                            name="lastName" 
                                            value={formData.lastName} 
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                                            placeholder="Last name" 
                                            required 
                                            className={errors.lastName ? 'input-error' : ''}
                                            style={{ border: `1px solid ${errors.lastName ? '#ef4444' : '#cbd5e1'}` }}
                                        />
                                        {errors.lastName && <p className="error-text">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                        placeholder="you@company.com" 
                                        required 
                                        className={errors.email ? 'input-error' : ''}
                                        style={{ border: `1px solid ${errors.email ? '#ef4444' : '#cbd5e1'}` }}
                                    />
                                    {errors.email && <p className="error-text">{errors.email}</p>}
                                </div>

                                <div className="form-group">
                                    <label>Phone number</label>
                                    <div className="phone-input-container" style={{ borderColor: errors.phone ? '#ef4444' : '#cbd5e1' }}>
                                        <div 
                                            className="country-selector"
                                            onClick={() => setShowCountries(!showCountries)}
                                        >
                                            {countryCode} <ChevronDown size={14} />
                                        </div>
                                        
                                        {showCountries && (
                                            <div className="country-dropdown">
                                                {countries.map(c => (
                                                    <div 
                                                        key={c.code}
                                                        className="country-option"
                                                        onClick={() => {
                                                            setCountryCode(c.code);
                                                            setShowCountries(false);
                                                        }}
                                                    >
                                                        <span>{c.name}</span>
                                                        <span style={{ color: '#94a3b8' }}>{c.dial}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFormData({...formData, phone: value});
                                            }}
                                            placeholder="00000 00000" 
                                            className="phone-input-field"
                                            required
                                            maxLength={10}
                                        />
                                    </div>
                                    {errors.phone && <p className="error-text">{errors.phone}</p>}
                                </div>

                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea 
                                        name="message" 
                                        value={formData.message} 
                                        onChange={(e) => setFormData({...formData, message: e.target.value})} 
                                        rows="4"
                                        className={errors.message ? 'input-error' : ''}
                                        style={{ border: `1px solid ${errors.message ? '#ef4444' : '#cbd5e1'}` }}
                                    ></textarea>
                                    {errors.message && <p className="error-text">{errors.message}</p>}
                                </div>

                                <div className="privacy-checkbox-wrapper">
                                    <input type="checkbox" id="privacy" required />
                                    <label htmlFor="privacy">
                                        You agree to our friendly <a href="/privacy-policy">privacy policy</a>.
                                    </label>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="submit-btn">
                                    {isSubmitting ? 'Sending...' : 'Send message'}
                                </button>
                                {submitStatus === 'success' && <p className="success-status">{statusMessage}</p>}
                                {submitStatus === 'error' && <p className="error-status">{statusMessage}</p>}
                            </form>
                        </div>
                        <div className="contact-image-side">
                            <img src="/getintouch.png" alt="Contact" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MAP SECTION ===== */}
            <section id="map" className="map-section">
                <div className="section-container">
                    <h2 className="map-heading">SEE ON MAP</h2>
                    <div className="map-container">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.3367401412197!2d87.4447969!3d25.7924625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eff99ea1e7f3bd%3A0x698a31e366250485!2sMount%20Zion%20School!5e0!3m2!1sen!2sin!4v1777440961542!5m2!1sen!2sin" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mount Zion School Location Map"
                        ></iframe>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
