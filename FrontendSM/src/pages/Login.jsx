import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, ArrowRight, Shield } from 'lucide-react';
import './Login.css';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Invalid credentials');
                return;
            }

            login(data.user);
        } catch (err) {
            setError('Server unreachable. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Animated background */}
            <div className="login-bg">
                <div className="bg-orb orb-1"></div>
                <div className="bg-orb orb-2"></div>
                <div className="bg-orb orb-3"></div>
                <div className="bg-orb orb-4"></div>
                <div className="bg-grid"></div>
            </div>

            {/* Left Panel — Branding */}
            <div className="login-left">
                <div className="login-branding">
                    <div className="brand-badge">
                        <span>🏫</span>
                    </div>
                    <h1 className="brand-title">
                        <span className="brand-mount">Mount</span>
                        <span className="brand-zion">Zion</span>
                    </h1>
                    <p className="brand-tagline">School Management System</p>
                    <div className="brand-divider"></div>
                    <p className="brand-subtitle">CBSE Affiliated • Nursery to Class X</p>

                    <div className="brand-features">
                        <div className="feature-item">
                            <div className="feature-dot"></div>
                            <span>Student & Staff Management</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-dot"></div>
                            <span>Fee Collection & Finance</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-dot"></div>
                            <span>Attendance & Exam Reports</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-dot"></div>
                            <span>Transport & Hostel Tracking</span>
                        </div>
                    </div>
                </div>

                <div className="brand-footer">
                    <Shield size={14} />
                    <span>Secure admin portal with end-to-end encryption</span>
                </div>
            </div>

            {/* Right Panel — Login Form */}
            <div className="login-right">
                <div className="login-card">
                    {/* Welcome Header */}
                    <div className="login-card-header">
                        <div className="header-accent"></div>
                        <h2>Welcome Back</h2>
                        <p>Enter your credentials to access the dashboard</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="login-error">
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-field">
                            <label>Email Address</label>
                            <div className="login-input-wrap">
                                <div className="input-icon-circle">
                                    <User size={16} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="admin@mountzion.edu"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            <div className="field-header">
                                <label>Password</label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>
                            <div className="login-input-wrap">
                                <div className="input-icon-circle">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="login-eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="login-remember">
                            <label className="remember-label">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                <span>Keep me signed in</span>
                            </label>
                        </div>

                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                            {!loading && <ArrowRight size={18} />}
                            <div className="btn-shine"></div>
                        </button>
                    </form>

                    {/* Demo Hint */}
                    <div className="login-hint">
                        <div className="hint-label">Demo Access</div>
                        <div className="hint-creds">
                            <code>admin@mountzion.edu</code> / <code>admin123</code>
                        </div>
                    </div>
                </div>

                <p className="login-copyright">© 2024 Mount Zion School. All rights reserved.</p>
            </div>
        </div>
    );
}
