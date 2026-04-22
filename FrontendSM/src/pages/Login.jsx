import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        <div className="login-new-wrapper min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4">
            {/* Navy Background Block (Figma style) */}
            <div className="absolute top-0 left-0 w-full h-[350px] bg-[#051A29] z-0"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[500px]"
            >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8 pb-4 text-center">
                        <h1 className="text-3xl font-extrabold text-[#0B3C5D] mb-2">Parent Portal</h1>
                        <p className="text-sm text-gray-500 font-medium">Mount Zion School, Purnea</p>
                    </div>

                    {/* Figma Style Tabs */}
                    <div className="flex p-2 bg-gray-100/50">
                        <button 
                            onClick={() => setLoginType('parent')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${loginType === 'parent' ? 'bg-white text-[#0B3C5D] shadow-sm rounded-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Parent <span className={loginType === 'parent' ? 'bg-yellow-400 px-1' : ''}>Login</span>
                        </button>
                        <button 
                            onClick={() => setLoginType('admin')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${loginType === 'admin' ? 'bg-[#0B3C5D] text-white shadow-sm rounded-lg' : 'text-gray-400 hover:text-gray-600 font-bold'}`}
                        >
                            Staff <span className={loginType === 'admin' ? 'bg-yellow-400 text-black px-1' : ''}>Login</span>
                        </button>
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3"
                                >
                                    <AlertTriangle size={18} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#0B3C5D] uppercase tracking-wide">
                                    {loginType === 'admin' ? 'User ID / Email' : 'User ID / Mobile Number'}
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder={loginType === 'admin' ? 'Enter Admin ID' : 'Enter your User ID or Mobile'}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B3C5D]/20 focus:border-[#0B3C5D] transition-all outline-none text-gray-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-bold text-[#0B3C5D] uppercase tracking-wide">Password</label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full h-14 pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B3C5D]/20 focus:border-[#0B3C5D] transition-all outline-none text-gray-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-14 bg-[#0B3C5D] hover:bg-[#051A29] text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        <span className="bg-yellow-400 text-black px-1 mr-1">Login</span> to Portal
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <button type="button" className="text-sm font-bold text-gray-500 hover:text-[#0B3C5D]">
                                    Forgot Password? <span className="text-[#0B3C5D] underline ml-1">Click here</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Don't have an account? <span className="text-[#0B3C5D] font-bold cursor-pointer hover:underline">Contact Administrator</span>
                    </p>
                    <Link to="/" className="inline-block mt-4 text-[#1CA7A6] font-bold flex items-center justify-center gap-1 hover:gap-2 transition-all">
                        ← Back to Main Website
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
