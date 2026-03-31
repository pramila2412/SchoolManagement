import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Menu, X, Bell, Search, User, Grid3X3, LogOut, ChevronRight,
} from 'lucide-react';
import { SIDEBAR_MODULES } from './Sidebar';
import './Header.css';

const SEARCHABLE_ITEMS = SIDEBAR_MODULES.flatMap(module => {
    const items = [];
    items.push({ id: `main-${module.id}`, name: module.name, path: module.path, category: 'Main Module' });
    if (module.subModules) {
        module.subModules.forEach((sub, idx) => {
            items.push({ id: `sub-${module.id}-${idx}`, name: sub.name, path: sub.path, category: module.name });
        });
    }
    return items;
});

export default function Header({ onToggleSidebar, sidebarOpen }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Perform module search
    useState(() => {
        // Just mock initialization
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
        const results = SEARCHABLE_ITEMS.filter(item => 
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

    const handleFeatureAlert = (featureName) => {
        alert(`${featureName} feature is under development and will be available soon.`);
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

            <div className="header-right">
                <button className="header-icon-btn" aria-label="Notifications" onClick={() => handleFeatureAlert('Notifications')}>
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>
                <button className="header-icon-btn" aria-label="Apps" onClick={() => handleFeatureAlert('App Grid')}>
                    <Grid3X3 size={20} />
                </button>
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
