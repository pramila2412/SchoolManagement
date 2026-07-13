const fs = require('fs');

const path = "C:\\Users\\prami\\New folder\\SchoolManagement\\FrontendSM\\src\\pages\\Academics.jsx";
let content = fs.readFileSync(path, 'utf-8');

// 1. Add the custom hook at the top after imports
const hookCode = `
const useAcademicClassesData = () => {
    const [classesData] = useLocalStorage('academic_classes', []);
    const ALL_CLASSES = classesData.map(c => c.name);
    const getSectionsForClass = (className) => {
        const cls = classesData.find(c => c.name === className);
        return cls && cls.sections ? cls.sections.map(s => s.label) : [];
    };
    return { ALL_CLASSES, getSectionsForClass };
};
`;
if (!content.includes('useAcademicClassesData')) {
    content = content.replace('// ======================== DASHBOARD ========================', hookCode + '\n// ======================== DASHBOARD ========================');
}

// 2. Replace all ALL_CLASSES declarations
content = content.replace(/const ALL_CLASSES = \['Nursery'[^;]+;/g, "const { ALL_CLASSES, getSectionsForClass } = useAcademicClassesData();");

// 3. Replace <option>A</option><option>B</option><option>C</option> with dynamic mapping
// This requires finding the section state variable for each tab.
// Tab 1: TimetableTab -> uses sel.class
// Tab 2: SyllabusTab -> no section?
// Tab 3: LessonPlanTab -> no section?
// Tab 4: AssignmentsTab -> uses form.class
// Tab 5: AttendanceTab -> uses sel.class
// Tab 6: ExamsTab -> uses form.class
// Tab 7: StudyMaterialTab -> uses form.class
// Tab 8: PromotionTab -> uses filter.class

content = content.replace(
    /<select([^>]+value=\{([^\}]+)\.section\}[^>]*)><option>A<\/option><option>B<\/option><option>C<\/option><\/select>/g,
    "<select$1>{getSectionsForClass($2.class).map(s => <option key={s} value={s}>{s}</option>)}</select>"
);
content = content.replace(
    /<option>A<\/option><option>B<\/option><option>C<\/option>/g,
    "{getSectionsForClass(sel?.class || form?.class || filter?.class || 'I').map(s => <option key={s} value={s}>{s}</option>)}"
);

// Specific fix for option>Class {cls}</option> because ALL_CLASSES are no longer Roman numerals but actual names like "LKG"
content = content.replace(/>Class \{cls\}<\/option>/g, ">{cls}</option>");

fs.writeFileSync(path, content);
console.log("Updated successfully");
