import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, ArrowRight, Sparkles, Layout, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import './Login.css';

const features = [
    { icon: Layout, title: 'Smart Dashboard', desc: 'Centralized view of all activities.' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for high-performance workflows.' },
    { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Bank-grade encryption for all data.' },
];

export default function LoginPage() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('admin'); // 'admin' or 'parent'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lockout, setLockout] = useState(null); // Timestamp when lockout ends

    useEffect(() => {
        if (user) {
            if (user.role === 'Parent') {
                if (user.children && user.children.length > 1) {
                    navigate('/parent-selector', { replace: true });
                } else {
                    navigate('/parent-portal', { replace: true });
                }
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [user, navigate]);

    // Check for lockout on mount or change
    useEffect(() => {
        if (lockout && Date.now() > lockout) {
            setLockout(null);
            setAttempts(0);
        }
    }, [lockout]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (lockout && Date.now() < lockout) {
            const timeLeft = Math.ceil((lockout - Date.now()) / 60000);
            setError(`Account locked. Please wait ${timeLeft} minutes.`);
            return;
        }

        if (!email.trim() || !password.trim()) {
            setError(loginType === 'admin' ? 'Please enter both email and password' : 'Please enter both Parent ID and password');
            return;
        }

        setLoading(true);
        try {
            // Mocking API for Parent/Admin based on LoginType
            // Dynamic Parent Login check from mzs_students
            if (loginType === 'parent') {
                const globalStudents = JSON.parse(localStorage.getItem('mzs_students') || '[]');
                const loginStr = email.trim().toLowerCase();
                
                // Find all children belonging to this parent ID or parentEmail
                const parentChildren = globalStudents.filter(s => 
                    (s.parentId && s.parentId.toLowerCase() === loginStr) || 
                    (s.parentEmail && s.parentEmail.toLowerCase() === loginStr)
                );

                if (parentChildren.length > 0) {
                    // Check if any of these children's parentPassword matches
                    const matchByPass = parentChildren.find(s => s.parentPassword === password);
                    
                    if (matchByPass) {
                        login({ 
                            name: parentChildren[0].parentName || 'Parent / Guardian',
                            id: parentChildren[0].parentId,
                            parentId: parentChildren[0].parentId,
                            parentEmail: parentChildren[0].parentEmail,
                            role: 'Parent', 
                            children: parentChildren.map(s => ({
                                name: s.name,
                                firstName: s.firstName,
                                lastName: s.lastName,
                                id: s.admissionNo,
                                class: s.class,
                                rollNo: s.rollNo,
                                dateOfBirth: s.dateOfBirth,
                                gender: s.gender,
                                bloodGroup: s.bloodGroup,
                                phone: s.phone,
                                guardianPhone: s.guardianPhone,
                                address: s.address,
                                photoUrl: s.photoUrl,
                                motherName: s.motherName
                            })),
                            firstLogin: matchByPass.firstLogin || false
                        });
                        setAttempts(0);
                        return;
                    }
                }

                handleFailedAttempt();
                return;
            }

            // Check System Users from localStorage first
            const savedUsers = localStorage.getItem('mzs_system_users');
            if (savedUsers) {
                const systemUsers = JSON.parse(savedUsers);
                const portalUser = systemUsers.find(u => u.email === email && u.access === 'Enabled');
                
                if (portalUser) {
                    // Check custom password if set, otherwise fallback to role-based default
                    const validPassword = portalUser.password || 
                        (portalUser.role.toLowerCase().includes('teacher') ? 'teacher123' : 
                         portalUser.role.toLowerCase().includes('accountant') ? 'finance123' : 'admin123');
                    
                    if (password === validPassword) {
                        login(portalUser);
                        setAttempts(0);
                        return;
                    }
                }
            }

            // Fallback: local credential check when backend is offline
            const mockUsers = [
                { email: 'admin@mountzion.edu', password: 'admin123', name: 'Super Admin', role: 'Super Admin' },
                { email: 'principal@mountzion.edu', password: 'admin123', name: 'Dr. Sarah', role: 'Admin / Principal' },
                { email: 'teacher@mountzion.edu', password: 'teacher123', name: 'Rajesh Kumar', role: 'Staff / Teacher' },
                { email: 'accountant@mountzion.edu', password: 'finance123', name: 'Vijay Singh', role: 'Accountant' }
            ];

            const found = mockUsers.find(u => u.email === email && u.password === password);
            if (found) {
                login(found);
                setAttempts(0);
            } else {
                handleFailedAttempt();
            }
        } catch {
            setError('System error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleFailedAttempt = () => {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        if (nextAttempts >= 5) {
            setLockout(Date.now() + 30 * 60 * 1000); // 30 mins lockout
            setError('Too many failed attempts. Account locked for 30 minutes.');
        } else {
            setError(`Invalid credentials. Attempt ${nextAttempts} of 5.`);
        }
    };

    return (
        <div className="login-wrapper relative min-h-screen bg-black text-white flex overflow-hidden font-sans">
            {/* React Bits Style Animated Background Layers */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[140px] mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                
                {/* Dot Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:32px_32px] opacity-30"></div>
            </div>

            {/* Main Content Layout */}
            <div className="relative z-10 flex w-full max-w-7xl mx-auto items-center justify-between p-6 lg:p-12 gap-12">
                
                {/* Left Section - Hero & Branding (Hidden on mobile) */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hidden lg:flex flex-col flex-1 pb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-sky-400 backdrop-blur-md w-fit mb-8">
                        <Sparkles size={14} />
                        <span>Next Generation OS</span>
                    </div>

                    <h1 className="text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                        Welcome to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400">
                            Mount Zion
                        </span>
                    </h1>
                    
                    <p className="text-lg text-white/60 max-w-md mb-12 font-medium">
                        Securely access your institution's infrastructure with our unified authentication system.
                    </p>

                    <div className="space-y-6 max-w-sm">
                        {features.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className="flex gap-4 group"
                            >
                                <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{item.title}</h3>
                                    <p className="text-sm text-white/50">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Section - Login Form */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-[440px] mx-auto lg:mx-0"
                >
                    {/* Mobile-only branding (shown when hero is hidden) */}
                    <div className="login-mobile-brand">
                        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400">
                            Mount Zion School
                        </h1>
                        <p className="text-white/50">School Management System</p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl mb-6 relative">
                        <div 
                            className="absolute bg-gradient-to-r from-teal-500/20 to-sky-500/20 border border-teal-500/30 rounded-xl transition-all duration-300 ease-out"
                            style={{ 
                                width: 'calc(50% - 4px)', 
                                height: 'calc(100% - 8px)',
                                top: '4px',
                                left: loginType === 'admin' ? '4px' : 'calc(50%)' 
                            }}
                        />
                        <button 
                            onClick={() => setLoginType('admin')}
                            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-colors relative z-10 ${loginType === 'admin' ? 'text-teal-400' : 'text-white/40 hover:text-white/60'}`}
                        >
                            Admin / Staff
                        </button>
                        <button 
                            onClick={() => setLoginType('parent')}
                            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-colors relative z-10 ${loginType === 'parent' ? 'text-teal-400' : 'text-white/40 hover:text-white/60'}`}
                        >
                            Parent Login
                        </button>
                    </div>

                    {/* Glowing border wrapper */}
                    <div className="relative group rounded-3xl">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 rounded-3xl opacity-30 group-hover:opacity-60 blur-sm transition-opacity duration-500"></div>
                        
                        <Card className="relative bg-black/40 border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden p-2">
                            <CardContent className="p-8 pb-10">
                                
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-semibold text-white mb-2">
                                        {loginType === 'admin' ? 'Institution Login' : 'Parent Access Portal'}
                                    </h2>
                                    <p className="text-sm text-white/50">
                                        {loginType === 'admin' ? 'Access your school management dashboard' : 'Enter your Parent ID to view child details'}
                                    </p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div 
                                            key={error}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="mb-6"
                                        >
                                            <div className="p-3 text-sm bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2">
                                                <AlertTriangle size={16} />
                                                {error}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-white/70 text-xs uppercase tracking-wider font-semibold">
                                            {loginType === 'admin' ? 'Work Email' : 'Parent ID'}
                                        </Label>
                                        <div className="relative group/input">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-teal-400 transition-colors">
                                                <User size={18} />
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder={loginType === 'admin' ? 'admin@mountzion.edu' : 'PAR-2025-00421'}
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-1 focus-visible:ring-teal-400 focus-visible:border-teal-400 transition-all hover:bg-white/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-white/70 text-xs uppercase tracking-wider font-semibold">Password</Label>
                                            <a href="#" className="text-xs text-teal-400 hover:text-teal-300 transition-colors">Forgot Password?</a>
                                        </div>
                                        <div className="relative group/input">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-teal-400 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-1 focus-visible:ring-teal-400 focus-visible:border-teal-400 transition-all hover:bg-white/10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full h-12 mt-4 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-white rounded-xl font-medium shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all duration-300 relative overflow-hidden group/btn"
                                    >
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                        
                                        <span className="relative flex items-center justify-center gap-2">
                                            {loading ? 'Authenticating...' : loginType === 'admin' ? 'Staff Login' : 'Access Portal'}
                                            {!loading && <ArrowRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />}
                                        </span>
                                    </Button>
                                </form>

                                {/* Demo Hint */}
                                <div className="mt-8 text-center pt-6 border-t border-white/10">
                                    <p className="text-xs text-white/40 mb-2 font-medium">{loginType === 'admin' ? 'DEMO ACCESS' : 'HOW TO LOGIN'}</p>
                                    <div className="inline-block px-4 py-2 rounded-lg bg-black/50 border border-white/5 text-sm text-white/60 font-mono">
                                        {loginType === 'admin' ? 'admin@mountzion.edu / admin123' : 'Use Parent Email & Password set during student admission'}
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
                
            </div>
        </div>
    );
}
