import { useState, useEffect } from 'react';
import { api } from '../utils/api'; // Or just use fetch if api doesn't have it

export const useAcademicClassesData = () => {
    const [classesData, setClassesData] = useState(() => {
        const saved = localStorage.getItem('academic_classes');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // We use getHeaders from api to ensure we are authorized if the endpoint requires it.
                // Alternatively, we can just use fetch since /api/academics/classes might be public or token-based.
                const token = localStorage.getItem('authToken');
                const headers = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                
                const res = await fetch('/api/academics/classes', { headers });
                if (res.ok) {
                    const data = await res.json();
                    const formatted = data.map(c => ({
                        name: c.className,
                        sections: c.sections
                    }));
                    setClassesData(formatted);
                    localStorage.setItem('academic_classes', JSON.stringify(formatted));
                }
            } catch (err) {
                console.error("Failed to fetch academic classes", err);
            }
        };
        fetchClasses();
    }, []);

    const validData = Array.isArray(classesData) ? classesData : [];
    
    const classOrder = [
        "Play Group", "Pre-Nursery", "Nursery", "LKG", "UKG", "KG",
        "I", "Class 1", "Class I", "1",
        "II", "Class 2", "Class II", "2",
        "III", "Class 3", "Class III", "3",
        "IV", "Class 4", "Class IV", "4",
        "V", "Class 5", "Class V", "5",
        "VI", "Class 6", "Class VI", "6",
        "VII", "Class 7", "Class VII", "7",
        "VIII", "Class 8", "Class VIII", "8",
        "IX", "Class 9", "Class IX", "9",
        "X", "Class 10", "Class X", "10",
        "XI", "Class 11", "Class XI", "11",
        "XII", "Class 12", "Class XII", "12"
    ];

    const ALL_CLASSES = validData.map(c => c.name).sort((a, b) => {
        // Handle case variations implicitly by ignoring case in the match if necessary,
        // but since our predefined array is exact, we'll try an exact match first,
        // or a case-insensitive match if needed.
        const aIndex = classOrder.findIndex(item => item.toLowerCase() === a.toLowerCase());
        const bIndex = classOrder.findIndex(item => item.toLowerCase() === b.toLowerCase());
        
        let indexA = aIndex !== -1 ? aIndex : 999;
        let indexB = bIndex !== -1 ? bIndex : 999;
        
        if (indexA !== indexB) {
            return indexA - indexB;
        }
        return a.localeCompare(b, undefined, { numeric: true });
    });
    const getSectionsForClass = (className) => {
        const cls = validData.find(c => c.name === className);
        return cls && cls.sections ? cls.sections.map(s => s.label) : [];
    };
    
    return { ALL_CLASSES, getSectionsForClass };
};
