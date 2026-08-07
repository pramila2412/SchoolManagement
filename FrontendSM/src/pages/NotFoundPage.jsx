import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="placeholder-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
            <div style={{ background: 'var(--danger-light, #fee2e2)', padding: '24px', borderRadius: '50%', marginBottom: '24px' }}>
                <AlertCircle size={64} color="var(--danger, #ef4444)" />
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '12px' }}>404</h1>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-light)', maxWidth: '400px', marginBottom: '32px', fontSize: '16px', lineHeight: '1.5' }}>
                Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '16px' }}>
                <Home size={20} /> Back to Dashboard
            </Link>
        </div>
    );
}
