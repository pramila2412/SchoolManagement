import { useLocalStorage } from './useLocalStorage';

export const useAcademicClassesData = () => {
    const [classesData] = useLocalStorage('academic_classes', []);
    
    // Ensure classesData is an array to prevent errors if localStorage is malformed
    const validData = Array.isArray(classesData) ? classesData : [];
    
    const ALL_CLASSES = validData.map(c => c.name);
    
    const getSectionsForClass = (className) => {
        const cls = validData.find(c => c.name === className);
        return cls && cls.sections ? cls.sections.map(s => s.label) : [];
    };
    
    return { ALL_CLASSES, getSectionsForClass };
};
