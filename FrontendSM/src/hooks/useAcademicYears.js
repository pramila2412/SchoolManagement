import { useState, useEffect } from 'react';

export const useAcademicYears = () => {
    const [years, setYears] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('academic_years');
            if (saved) {
                const parsed = JSON.parse(saved);
                const labels = parsed.map(y => y.label);
                setYears(Array.from(new Set(labels)));
            }
        } catch (e) {
            console.error('Failed to parse academic_years from localStorage', e);
        }
    }, []);

    const activeYear = years.length > 0 ? years[0] : '2024-2025';

    return { years: years.length > 0 ? years : ['2024-2025'], activeYear };
};
