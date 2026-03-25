import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Menu, X, Bell, Search, User, Grid3X3, LogOut,
} from 'lucide-react';
import './Header.css';

export default function Header({ onToggleSidebar, sidebarOpen }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <button
                    className="header-menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
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

            <div className="header-center">
                <div className="header-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search students, modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="header-right">
                <button className="header-icon-btn" aria-label="Notifications">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>
                <button className="header-icon-btn" aria-label="Apps">
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
