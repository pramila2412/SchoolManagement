import { useState, useEffect } from 'react';

export const useAcademicYears = () => {
    const [years, setYears] = useState([]);
    const [activeYear, setActiveYear] = useState('');
    const [loading, setLoading] = useState(true);
    const [academicYearsData, setAcademicYearsData] = useState([]);

    const fetchYears = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/academics/years');
            if (res.ok) {
                const data = await res.json();
                setAcademicYearsData(data);
                const labels = data.map(y => y.label);
                setYears(Array.from(new Set(labels)));
                
                const active = data.find(y => y.active);
                if (active) {
                    setActiveYear(active.label);
                } else if (data.length > 0) {
                    setActiveYear(data[0].label);
                }
            }
        } catch (e) {
            console.error('Failed to fetch academic years', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    return { years, activeYear, loading, academicYearsData, refetch: fetchYears };
};
