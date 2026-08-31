import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (from localStorage)
        const savedUser = localStorage.getItem('authUser');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            // Check session timeout for Parent role (30 mins = 1800000 ms)
            if (parsed.role === 'Parent') {
                const lastActivity = localStorage.getItem('authLastActivity');
                if (lastActivity && (Date.now() - parseInt(lastActivity, 10) > 1800000)) {
                    logout();
                    setLoading(false);
                    return;
                }
            }
            setUser(parsed);
            const savedToken = localStorage.getItem('authToken');
            if (savedToken) {
                setToken(savedToken);
            }
            localStorage.setItem('authLastActivity', Date.now().toString());
        }
        setLoading(false);
    }, []);

    // Activity tracker for session timeout
    useEffect(() => {
        if (!user || user.role !== 'Parent') return;

        let timeoutId;
        const SESSION_TIMEOUT = 1800000; // 30 minutes

        const handleActivity = () => {
            localStorage.setItem('authLastActivity', Date.now().toString());
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                logout();
                window.location.href = '/login';
            }, SESSION_TIMEOUT);
        };

        handleActivity(); // Initial setup

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('scroll', handleActivity);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('scroll', handleActivity);
        };
    }, [user]);

    const login = (userData, tokenStr) => {
        setUser(userData);
        setToken(tokenStr);
        localStorage.setItem('authUser', JSON.stringify(userData));
        if (tokenStr) {
            localStorage.setItem('authToken', tokenStr);
        }
        localStorage.setItem('authLastActivity', Date.now().toString());
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authLastActivity');
        localStorage.removeItem('academic_classes');
        localStorage.removeItem('mzs_staff');
        localStorage.removeItem('mzs_attendance');
        localStorage.removeItem('mzs_attendance_locks');
        localStorage.removeItem('mzs_leave_req');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
}
