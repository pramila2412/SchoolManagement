import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Menu, X, Bell, Search, User, Grid3X3, LogOut, ChevronRight,
} from 'lucide-react';
import { SIDEBAR_MODULES } from './Sidebar';
import { customAlert } from '../utils/dialogs';
import './Header.css';

export default function Header({ onToggleSidebar, sidebarOpen }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [activities, setActivities] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Fetch notifications
    useEffect(() => {
        if (!user) return;
        fetch(`/api/collaborate/activity?user=${encodeURIComponent(user.name||'')}`)
            .then(r => r.json())
            .then(data => { if(Array.isArray(data)) setActivities(data.slice(0, 5)); })
            .catch(console.error);
    }, [user]);

    // Perform module search
    const searchableItems = SIDEBAR_MODULES.filter(module => {
        if (user?.role === 'Parent') return module.id === 'parent-portal';
        return module.id !== 'parent-portal';
    }).flatMap(module => {
        const items = [];
        items.push({ id: `main-${module.id}`, name: module.name, path: module.path, category: 'Main Module' });
        if (module.subModules) {
            module.subModules.forEach((sub, idx) => {
                items.push({ id: `sub-${module.id}-${idx}`, name: sub.name, path: sub.path, category: module.name });
            });
        }
        return items;
    });

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = searchableItems.filter(item => 
            item.name.toLowerCase().includes(lowerQuery) || 
            item.category.toLowerCase().includes(lowerQuery)
        ).slice(0, 6);

        setSearchResults(results);
        setShowResults(true);
    };

    const handleSelectResult = (path) => {
        navigate(path);
        setSearchQuery('');
        setShowResults(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            handleSelectResult(searchResults[0].path);
        }
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <button
                    className="header-menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <Menu size={22} />
                </button>
                <div className="header-brand">
                    <div className="header-logo">
                        <span className="logo-icon">🏫</span>
                    </div>
                    <div className="header-title">
                        <h1>MOUNT ZION SCHOOL</h1>
                        <span className="header-subtitle">CBSE • Nursery to XII</span>
                    </div>
                </div>
            </div>

            <div 
                className="header-center"
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setShowResults(false);
                    }
                }}
            >
                <form className="header-search" onSubmit={handleSearch}>
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search modules (e.g., student, fees)..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => { if (searchQuery.trim()) setShowResults(true); }}
                        className="search-input"
                    />
                    
                    {showResults && searchResults.length > 0 && (
                        <div className="search-results-dropdown animate-slide-up">
                            <div className="search-results-header">Modules ({searchResults.length})</div>
                            {searchResults.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className="search-result-item"
                                    onClick={() => handleSelectResult(item.path)}
                                >
                                    <div className="search-result-info">
                                        <span className="search-result-name">{item.name}</span>
                                        <span className="search-result-category">{item.category}</span>
                                    </div>
                                    <ChevronRight size={14} className="search-result-icon" />
                                </button>
                            ))}
                        </div>
                    )}
                    {showResults && searchQuery.trim() && searchResults.length === 0 && (
                        <div className="search-results-dropdown animate-slide-up">
                            <div className="search-no-results">
                                <Search size={24} style={{ marginBottom: 10, opacity: 0.5 }} />
                                <p>No modules found for "{searchQuery}"</p>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            <div className="header-right" style={{ gap: 16 }}>
                <div style={{ position: 'relative' }}>
                    <button 
                        className="header-icon-btn" 
                        onClick={() => setShowNotifications(!showNotifications)}
                        onBlur={(e) => {
                            if (!e.currentTarget.parentElement.contains(e.relatedTarget)) {
                                setShowNotifications(false);
                            }
                        }}
                    >
                        <Bell size={20} />
                        {activities.length > 0 && <span style={{ position: 'absolute', top: 5, right: 5, background: 'var(--danger)', color: '#fff', fontSize: '0.65rem', padding: '2px 5px', borderRadius: 10, fontWeight: 700, pointerEvents: 'none' }}>{activities.length}</span>}
                    </button>
                    {showNotifications && (
                        <div className="search-results-dropdown animate-slide-up" style={{ right: -60, left: 'auto', width: 320, padding: 0, zIndex: 1000, boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} tabIndex="-1">
                            <div className="search-results-header" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ color: 'var(--text)' }}>Notification Center</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setActivities([])}>Clear</span>
                            </div>
                            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                {activities.length === 0 ? <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem' }}><Bell size={24} style={{opacity: 0.3, marginBottom: 8}}/><br/>No new notifications</div> : null}
                                {activities.map((act, i) => (
                                    <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => { setShowNotifications(false); navigate('/collaborate'); }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: act.color }}>{act.type}</span>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>{new Date(act.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.title || act.desc}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: 12, textAlign: 'center', borderTop: '1px solid var(--border-light)', background: 'var(--bg)' }}>
                                <button className="btn-link" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => { setShowNotifications(false); navigate('/collaborate'); }}>View Activity Stream</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="header-profile">
                    <div className="profile-avatar">
                        <User size={18} />
                    </div>
                    <div className="profile-info">
                        <span className="profile-name">{user?.name || 'Admin'}</span>
                        <span className="profile-role">{user?.role || 'Super Admin'}</span>
                    </div>
                </div>
                <button
                    className="header-icon-btn logout-btn"
                    onClick={handleLogout}
                    aria-label="Logout"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}
