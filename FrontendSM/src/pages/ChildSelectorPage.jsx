import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ChevronRight, GraduationCap, ArrowLeft, LogOut } from 'lucide-react';
import './ChildSelectorPage.css';

export default function ChildSelectorPage() {
    const { user, logout, login } = useAuth();
    const navigate = useNavigate();

    // If no user or not parent, redirect
    if (!user || user.role !== 'Parent') {
        navigate('/login');
        return null;
    }

    const handleSelect = (child) => {
        // Update user context with selected child
        login({ ...user, selectedChild: child });
        navigate('/parent-portal/dashboard');
    };

    return (
        <div className="cs-page">
            <div className="cs-container">
                <div className="cs-header">
                    <div className="cs-logo">🏫</div>
                    <h1>Select Student Profile</h1>
                    <p>Welcome back, {user.name} ({user.parentId}). Please select a child to continue to the portal.</p>
                </div>

                <div className="cs-grid">
                    {user.children?.map((child) => (
                        <button key={child.id} className="cs-card" onClick={() => handleSelect(child)}>
                            <div className="cs-avatar">
                                <User size={32} />
                            </div>
                            <div className="cs-info">
                                <h3>{child.name}</h3>
                                <div className="cs-meta">
                                    <span><GraduationCap size={14}/> {child.class}</span>
                                    <span>ID: {child.id}</span>
                                </div>
                            </div>
                            <ChevronRight className="cs-chevron" size={20} />
                        </button>
                    ))}
                </div>

                <div className="cs-footer">
                    <button className="cs-logout" onClick={() => { logout(); navigate('/login'); }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
