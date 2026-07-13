const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Examination.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add import
if (!content.includes('import { useAcademicClassesData }')) {
    content = content.replace("import React,", "import { useAcademicClassesData } from '../hooks/useAcademicClassesData';\nimport React,");
}

// 2. Remove mockData import and STANDARD_CLASSES export
content = content.replace(/import \{ getActiveClasses \} from '\.\.\/data\/mockData';/g, '');
content = content.replace(/export const STANDARD_CLASSES = getActiveClasses\(\);/g, '');

// 3. Replace STANDARD_CLASSES with ALL_CLASSES
content = content.replace(/STANDARD_CLASSES/g, 'ALL_CLASSES');

// 4. Inject hook in all components
const components = [
    'ExamSetupTab',
    'TimetableTab',
    'HallTicketsTab',
    'MarksEntryTab',
    'ResultsTab',
    'ReportCardsTab',
    'AnalyticsTab'
];

components.forEach(comp => {
    const regex = new RegExp(`(function ${comp}\\([^)]*\\) {\\s*)`);
    if (regex.test(content) && !content.includes(`function ${comp}() {
    const { ALL_CLASSES, getSectionsForClass } = useAcademicClassesData();`)) {
        content = content.replace(regex, `$1const { ALL_CLASSES, getSectionsForClass } = useAcademicClassesData();\n    `);
    }
});

// Also inject in SettingsTab if needed? SettingsTab doesn't seem to use it based on grep, but just in case.
const regex = new RegExp(`(function SettingsTab\\([^)]*\\) {\\s*)`);
if (regex.test(content) && content.includes('ALL_CLASSES') && !content.includes(`function SettingsTab() {
    const { ALL_CLASSES, getSectionsForClass } = useAcademicClassesData();`)) {
    content = content.replace(regex, `$1const { ALL_CLASSES, getSectionsForClass } = useAcademicClassesData();\n    `);
}


fs.writeFileSync(filePath, content);
console.log('Fixed Examination.jsx');
