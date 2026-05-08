import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Search, ChevronDown, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import './AdmissionPublicPage.css';
import './LandingPage.css';

const API = '/api';

const RESULTS_DATA = [
    { roll: '514', cls: '4', name: 'Jane Cooper', date: '22/Jan/2026', time: '12:30 pm', panel: '4' },
    { roll: '546', cls: '5', name: 'Wade Warren', date: '22/Jan/2026', time: '3:00 pm', panel: '5' },
    { roll: '134', cls: '5', name: 'Esther Howard', date: '22/Jan/2026', time: '3:30 pm', panel: '4' },
    { roll: '544', cls: '5', name: 'Cameron Williamson', date: '22/Jan/2026', time: '4:30 pm', panel: '5' },
    { roll: '124', cls: '6', name: 'Brooklyn Simmons', date: '22/Jan/2026', time: '11:33 am', panel: '6' },
    { roll: '845', cls: '6', name: 'Leslie Alexander', date: '22/Jan/2026', time: '10:00 am', panel: '6' },
    { roll: '213', cls: '7', name: 'Jenny Wilson', date: '22/Jan/2026', time: '11:30 am', panel: '7' },
    { roll: '043', cls: '8', name: 'Guy Hawkins', date: '22/Jan/2026', time: '12:00 am', panel: '7-' },
    { roll: '302', cls: '4', name: 'Robert Fox', date: '23/Jan/2026', time: '10:00 am', panel: '1' },
    { roll: '305', cls: '4', name: 'Dianne Russell', date: '23/Jan/2026', time: '10:30 am', panel: '1' },
    { roll: '310', cls: '4', name: 'Cody Fisher', date: '23/Jan/2026', time: '11:00 am', panel: '1' },
];

const ALL_CLASSES = ['All Classes', 'Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const DEFAULTS = {
    pageTitle: 'Admissions',
    pageSubtitle: 'Join the Mount Zion Family — Where Excellence Begins',
    heroImage: '/school.jpeg',
    admissionProcedure: [
        { text: 'Admission to Nursery class can be secured on the basis of communication with the parents.' },
        { text: 'LKG upwards admission based on clearing up the Entrance Test.' }
    ],
    admissionCriteria: [
        { text: 'Submit the properly filled Registration Form and collect the date of the Entrance Test.' },
        { text: 'Appear for the Entrance Exam at the Scheduled time.' },
        { text: 'Go through the Result.' },
        { text: 'If the student is eligible for the admission, submit the duly filled admission form, along with required documents and passport size photographs.' },
        { text: 'Now collect final confirmation regarding admission and deposit fee.' },
        { text: 'Try to submit original documents at the time of admission.' },
        { text: 'Basic informations like DOB, address, parent\'s name etc. once entered in the school admission register at the time of admission should not be changed under any circumstances.' }
    ],
    requiredDocuments: [
        'Birth Certificate (Original & Photocopy)',
        'Transfer Certificate from previous school',
        'Report Card / Mark Sheet of last class attended',
        'Passport size photographs (4 copies)',
        'Aadhar Card of student and parents',
        'Address Proof (Ration Card / Electricity Bill)',
        'Caste Certificate (if applicable)'
    ],
    feeNote: 'For detailed fee structure, please visit the school office or contact us directly. Fee concessions may be available for meritorious students and siblings.',
    admissionContact: {
        phone: '6296490943',
        email: 'mountzionschool2021@gmail.com',
        officeHours: 'Monday to Saturday, 9:00 AM - 3:00 PM'
    },
    classesOffered: ['Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'],
    admissionOpen: true,
    academicYear: '2025-26'
};

export default function AdmissionPublicPage() {
    const [data, setData] = useState(DEFAULTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('All Classes');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const itemsPerPage = 5;

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API}/admission-page`);
                if (res.ok) {
                    const d = await res.json();
                    setData({ ...DEFAULTS, ...d });
                }
            } catch (err) {
                console.warn('Using default admission data:', err.message);
            }
        })();
    }, []);

    // Handle click outside for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter and Search Logic
    const filteredResults = useMemo(() => {
        return RESULTS_DATA.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 item.cls.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 item.roll.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesClass = classFilter === 'All Classes' || item.cls === classFilter;
            
            return matchesSearch && matchesClass;
        });
    }, [searchTerm, classFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSelectClass = (cls) => {
        setClassFilter(cls);
        setIsDropdownOpen(false);
        setCurrentPage(1);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const socials = { facebook: 'https://www.facebook.com/share/1DYSZWV8DU/', youtube: 'https://www.youtube.com/@MountZionSchoolMadhubaniPurnea/videos' };

    return (
        <div className="landing-page admission-public-page">
            <PublicHeader />

            {/* ===== ADMISSION PROCEDURE ===== */}
            <section className="about-us-section" id="procedure" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container">
                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        <div className="rules-image-side" style={{ flex: '1' }}>
                            <div className="rules-image-box" style={{ height: '100%' }}>
                                <img src="/Admission Procedure.png" alt="Admission Procedure" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0', display: 'block' }} />
                            </div>
                        </div>

                        <div className="rules-text-side" style={{ flex: '1.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h2 className="section-title" style={{ marginBottom: '15px', paddingLeft: 0, borderLeft: 'none', fontWeight: '900', color: '#000' }}>Admission Procedure</h2>
                                <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '25px' }}>Mount Zion School</h3>

                                <div className="about-description" style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.8' }}>
                                    <p>Admission to Nursery class can be secured on the basis of communication with the parents.</p>
                                    <p style={{ marginTop: '10px' }}>LKG upwards admission based on clearing up the Entrance Test.</p>
                                    
                                    <p style={{ marginTop: '10px', fontWeight: '700', color: '#0f172a' }}>ADMISSION CRITERIA</p>
                                    <ol style={{ marginTop: '10px', paddingLeft: '20px', listStyleType: 'decimal' }}>
                                        <li style={{ marginBottom: '8px' }}>Submit the properly filled Registration Form and collect the date of the Entrance Test.</li>
                                        <li style={{ marginBottom: '8px' }}>Appear for the Entrance Exam at the Scheduled time.</li>
                                        <li style={{ marginBottom: '8px' }}>Go through the Result.</li>
                                        <li style={{ marginBottom: '8px' }}>If the student is eligible for the admission, submit the duly filled admission form, along with required documents and passport size photographs.</li>
                                        <li style={{ marginBottom: '8px' }}>Now collect final confirmation regarding admission and deposit fee.</li>
                                        <li style={{ marginBottom: '8px' }}>Try to submit original documents at the time of admission.</li>
                                        <li style={{ marginBottom: '0' }}>Basic informations like DOB, address, parent's name etc. once entered in the school admission register at the time of admission should not be changed under any circumstances.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="uniform-visit-container" style={{ marginTop: '30px' }}>
                                <hr className="visit-divider" />
                                <div className="uniform-visit" style={{ marginTop: '15px' }}>
                                    <span className="visit-text">Visit : </span>
                                    <a href={socials.youtube || '#'} target="_blank" rel="noopener noreferrer" className="visit-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#022a4d" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.582 6.186a2.66 2.66 0 0 0-1.87-1.884C18.062 3.86 12 3.86 12 3.86s-6.062 0-7.712.442a2.66 2.66 0 0 0-1.87 1.884C2 7.846 2 12 2 12s0 4.154.442 5.814a2.66 2.66 0 0 0 1.87 1.884C5.938 20.14 12 20.14 12 20.14s6.062 0 7.712-.442a2.66 2.66 0 0 0 1.87-1.884C22 16.154 22 12 22 12s0-4.154-.418-5.814zM9.993 15.026V8.974L15.286 12l-5.293 3.026z"/>
                                        </svg>
                                    </a>
                                    <a href={socials.facebook || '#'} target="_blank" rel="noopener noreferrer" className="visit-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#022a4d" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEE & PAYMENT ===== */}
            <section className="about-us-section" id="fee" style={{ padding: '80px 0', background: '#f8fafc' }}>
                <div className="section-container">
                    <div className="rules-content-wrapper" style={{ display: 'flex', gap: '60px', alignItems: 'stretch' }}>
                        <div className="rules-text-side" style={{ flex: '1.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h2 className="section-title" style={{ marginBottom: '15px', paddingLeft: 0, borderLeft: 'none', fontWeight: '900', color: '#000' }}>Fee & Payment</h2>
                                <h3 className="about-subheading" style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '600', marginBottom: '25px' }}>Mount Zion School</h3>

                                <div className="about-description" style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.8' }}>
                                    <p>Mount Zion School, Sion Nagar, Purnea has released its fee structure for the academic session 2026-27, covering classes from Nursery to Standard 11. The fees are divided into components such as admission fee, annual (incidental) fee, examination fee, and monthly tuition fee. For lower classes (Nursery to UKG), the total fee is quite affordable at ₹5,500, with admission offered free. As students progress to higher classes, the fees gradually increase, reaching ₹24,700 for Class 9 and ₹21,200 for Classes 5 to 7. For senior classes like Standard 11, the total fee is ₹15,850.</p>
                                    
                                    <p style={{ marginTop: '15px', fontWeight: '700', color: '#0f172a' }}>Special Offer/Highlight:</p>
                                    <p style={{ marginTop: '5px' }}>The school provides free admission for early classes (up to Standard 4), making it budget-friendly for families starting their child's education. The structured and transparent fee system ensures clarity and affordability across all grade levels.</p>
                                </div>
                            </div>

                            <div className="uniform-visit-container" style={{ marginTop: '30px' }}>
                                <hr className="visit-divider" />
                                <div className="uniform-visit" style={{ marginTop: '15px' }}>
                                    <span className="visit-text">Visit : </span>
                                    <a href={socials.youtube || '#'} target="_blank" rel="noopener noreferrer" className="visit-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#022a4d" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.582 6.186a2.66 2.66 0 0 0-1.87-1.884C18.062 3.86 12 3.86 12 3.86s-6.062 0-7.712.442a2.66 2.66 0 0 0-1.87 1.884C2 7.846 2 12 2 12s0 4.154.442 5.814a2.66 2.66 0 0 0 1.87 1.884C5.938 20.14 12 20.14 12 20.14s6.062 0 7.712-.442a2.66 2.66 0 0 0 1.87-1.884C22 16.154 22 12 22 12s0-4.154-.418-5.814zM9.993 15.026V8.974L15.286 12l-5.293 3.026z"/>
                                        </svg>
                                    </a>
                                    <a href={socials.facebook || '#'} target="_blank" rel="noopener noreferrer" className="visit-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#022a4d" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rules-image-side" style={{ flex: '1' }}>
                            <div className="rules-image-box" style={{ background: '#fff', padding: '10px', borderRadius: '0', border: '1px solid #e2e8f0', height: '100%' }}>
                                <img src="/Fee.png" alt="Fee Structure" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0', display: 'block' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== ADMISSION RESULT ===== */}
            <section className="about-us-section" id="result" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="section-container" style={{ maxWidth: '1000px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className="section-title" style={{ fontWeight: '900', color: '#000' }}>Admission Result -2026</h2>
                    </div>

                    <div className="about-description" style={{ color: '#334155', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '40px' }}>
                        <p style={{ fontWeight: '700', color: '#000', marginBottom: '5px' }}>Admission Result & Confirmation</p>
                        <p>After appearing for the entrance examination, parents/guardians are required to check the admission result as per the schedule provided by the school. Students who successfully clear the entrance test (applicable from LKG onwards) or meet the interaction criteria (for Nursery) will be considered eligible for admission.</p>
                        <p style={{ marginTop: '10px' }}>Selected candidates must complete the admission process by submitting the duly filled admission form along with all required documents and passport-size photographs. Final confirmation of admission will be granted only after document verification and payment of the prescribed fees.</p>
                        <p style={{ marginTop: '10px' }}>Parents are advised to submit original documents at the time of admission for verification. It is important to note that basic details such as Date of Birth, address, and parents' names, once recorded in the school admission register, will not be changed under any circumstances.</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '10px 15px', borderRadius: '6px', flex: '1', maxWidth: '400px', border: '1px solid #e2e8f0' }}>
                            <Search size={16} color="#94a3b8" style={{ marginRight: '10px' }} />
                            <input 
                                type="text" 
                                placeholder="Search by Student name, Class, Roll..." 
                                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#334155' }} 
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div className="custom-dropdown-container" style={{ position: 'relative' }} ref={dropdownRef}>
                                <button 
                                    className="dropdown-trigger"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '10px 15px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', minWidth: '160px', justifyContent: 'space-between' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Filter size={16} style={{ marginRight: '8px' }} />
                                        {classFilter === 'All Classes' ? 'All Classes' : `Class ${classFilter}`}
                                    </div>
                                    <ChevronDown size={14} style={{ marginLeft: '10px', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </button>
                                
                                {isDropdownOpen && (
                                    <div 
                                        className="dropdown-options"
                                        style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '5px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '300px', overflowY: 'auto' }}
                                    >
                                        {ALL_CLASSES.map(cls => (
                                            <div 
                                                key={cls} 
                                                className={`dropdown-option ${classFilter === cls ? 'active' : ''}`}
                                                onClick={() => handleSelectClass(cls)}
                                                style={{ 
                                                    padding: '12px 15px', 
                                                    cursor: 'pointer', 
                                                    fontSize: '0.9rem', 
                                                    color: classFilter === cls ? '#fff' : '#475569', 
                                                    background: classFilter === cls ? '#0B3C5D' : 'transparent',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (classFilter !== cls) e.currentTarget.style.background = '#f1f5f9';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (classFilter !== cls) e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                {cls === 'All Classes' ? 'All Classes' : `Class ${cls}`}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', color: '#334155' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Exam Roll Number</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Class</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Name of the Student</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Interview Date</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Interview Time</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>Interview Panel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedResults.length > 0 ? (
                                    paginatedResults.map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '15px 10px' }}>{row.roll}</td>
                                            <td style={{ padding: '15px 10px' }}>{row.cls}</td>
                                            <td style={{ padding: '15px 10px', color: '#0f172a', fontWeight: '500' }}>{row.name}</td>
                                            <td style={{ padding: '15px 10px' }}>
                                                <span style={{ color: '#059669', background: '#d1fae5', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{row.date}</span>
                                            </td>
                                            <td style={{ padding: '15px 10px', fontWeight: '500' }}>{row.time}</td>
                                            <td style={{ padding: '15px 10px' }}>{row.panel}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                            No matching students found for {classFilter === 'All Classes' ? 'any class' : `Class ${classFilter}`}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    borderRadius: '50%', 
                                    border: '1px solid #e2e8f0', 
                                    background: '#fff', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                                    color: currentPage === 1 ? '#e2e8f0' : '#94a3b8' 
                                }}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button 
                                onClick={nextPage}
                                disabled={currentPage === totalPages || totalPages === 0}
                                style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    borderRadius: '50%', 
                                    border: '1px solid #e2e8f0', 
                                    background: '#fff', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', 
                                    color: (currentPage === totalPages || totalPages === 0) ? '#e2e8f0' : '#f59e0b', 
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
                                }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
