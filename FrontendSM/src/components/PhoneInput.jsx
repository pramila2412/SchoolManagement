import React, { useState } from 'react';

export default function PhoneInput({ value, onChange, placeholder, required, className = 'form-input', name }) {
    const [internalValue, setInternalValue] = useState(value || '');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        
        setInternalValue(val);
        if (onChange) {
            onChange({ target: { name: name || 'phone', value: val } });
        }
        
        if (val.length > 0 && val.length !== 10) {
            setError('Mobile number must be exactly 10 digits');
        } else {
            setError('');
        }
    };

    const handleBlur = (e) => {
        const val = onChange && value !== undefined ? value : internalValue;
        if (val && val.length !== 10) {
            setError('Mobile number must be exactly 10 digits');
        }
    };

    const displayValue = onChange && value !== undefined ? value : internalValue;

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input 
                type="tel" 
                name={name}
                className={className} 
                placeholder={placeholder || "Enter phone number"} 
                required={required} 
                value={displayValue || ''} 
                onChange={handleChange} 
                onBlur={handleBlur}
            />
            {error && <div style={{ color: 'var(--danger, red)', fontSize: '0.8rem', marginTop: '4px' }}>{error}</div>}
        </div>
    );
}
