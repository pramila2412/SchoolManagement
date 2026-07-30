import { useState, useEffect } from 'react';

export const useAcademicSubjectsData = () => {
    const [subjectsData, setSubjectsData] = useState(() => {
        const saved = localStorage.getItem('academic_subjects');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const headers = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                
                const res = await fetch('/api/academics/subjects', { headers });
                if (res.ok) {
                    const data = await res.json();
                    const formatted = data.map(s => s.name);
                    setSubjectsData(formatted);
                    localStorage.setItem('academic_subjects', JSON.stringify(formatted));
                }
            } catch (err) {
                console.error("Failed to fetch academic subjects", err);
            }
        };
        fetchSubjects();
    }, []);

    const validData = Array.isArray(subjectsData) ? subjectsData : [];
    const ALL_SUBJECTS = validData;
    
    return { ALL_SUBJECTS };
};
