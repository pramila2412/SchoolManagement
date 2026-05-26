import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Hook to easily check role permissions within components.
 */
export function useRole() {
    const { user } = useAuth();
    const role = user?.role || '';

    return {
        role,
        isSuperAdmin: role === 'Super Admin',
        isAdmin: role === 'Admin',
        isTeacher: role === 'Teacher',
        isStaff: role === 'Staff',
        isParent: role === 'Parent',

        // Granular permissions based on the matrix
        canAddStudent: ['Super Admin', 'Admin', 'Staff'].includes(role),
        canEditStudent: ['Super Admin', 'Admin', 'Staff'].includes(role),
        canDeleteStudent: ['Super Admin', 'Admin'].includes(role),
        canHardDeleteStudent: role === 'Super Admin',
        canIssueTC: ['Super Admin', 'Admin', 'Staff'].includes(role),
        canManageSettings: ['Super Admin', 'Admin'].includes(role),
    };
}

/**
 * Component wrapper that only renders children if the user's role is in the allowedRoles array.
 */
export default function RoleGuard({ allowedRoles, children, fallback = null }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    
    if (!user || !allowedRoles.includes(user.role)) {
        return fallback;
    }
    
    return children;
}

/**
 * HOC for Route Protection
 */
export function RouteRoleGuard({ allowedRoles, children }) {
    const { user, loading } = useAuth();
    if (loading) return null;

    if (!user || !allowedRoles.includes(user.role)) {
        // Redirect unauthorized users to the dashboard
        return <Navigate to="/" replace />;
    }

    return children;
}
