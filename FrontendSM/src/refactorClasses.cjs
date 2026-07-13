const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'pages');

const filesToProcess = [
    'Academics.jsx',
    'AddStudent.jsx',
    'Admission.jsx',
    'AdmissionPublicPage.jsx',
    'Certificates.jsx',
    'Finance.jsx',
    'FrontOffice.jsx',
    'StudentReports.jsx',
    'TC.jsx',
    'Addons.jsx'
];

filesToProcess.forEach(file => {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // 1. Academics.jsx
    if (file === 'Academics.jsx') {
        // Remove the inline hook definition
        content = content.replace(/\/\/ Global Hook for Academics[\s\S]*?return \{ ALL_CLASSES, getSectionsForClass \};\n\};\n\n/, '');
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { useLocalStorage } from '../hooks/useLocalStorage';", "import { useLocalStorage } from '../hooks/useLocalStorage';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
    }
    
    // 2. AddStudent.jsx
    if (file === 'AddStudent.jsx') {
        content = content.replace("import { classes, sections, getBatches, categories } from '../data/mockData';", "import { getBatches, categories } from '../data/mockData';");
        // AddStudent.jsx is already using academicClasses from fetch inside AddStudent, so it might not need the hook. But it is good to clean up the import.
    }
    
    // 3. Admission.jsx
    if (file === 'Admission.jsx') {
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { useLocalStorage } from '../hooks/useLocalStorage';", "import { useLocalStorage } from '../hooks/useLocalStorage';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
        if (!content.includes('const { ALL_CLASSES }')) {
            content = content.replace("const [metrics, setMetrics]", "const { ALL_CLASSES } = useAcademicClassesData();\n    const [metrics, setMetrics]");
        }
        content = content.replace(/\{(\['Nursery'[^\]]+\])\.map/g, "{ALL_CLASSES.map");
    }
    
    // 4. AdmissionPublicPage.jsx
    if (file === 'AdmissionPublicPage.jsx') {
        // This is a landing page. LocalStorage might not be populated if it's the first time, but we'll use the hook.
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
        // Remove ALL_CLASSES constant if exists
        content = content.replace(/const ALL_CLASSES = \['All Classes', 'Nursery', [^;]+;/g, "");
        if (!content.includes('const { ALL_CLASSES }')) {
            content = content.replace("function AdmissionPublicPage() {", "function AdmissionPublicPage() {\n    const { ALL_CLASSES } = useAcademicClassesData();");
        }
        content = content.replace(/classesOffered: \['Nursery'[^\]]+\]/, "classesOffered: ALL_CLASSES.length > 0 ? ALL_CLASSES : ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']");
    }
    
    // 5. Certificates.jsx
    if (file === 'Certificates.jsx') {
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { customAlert, customConfirm } from '../utils/dialogs';", "import { customAlert, customConfirm } from '../utils/dialogs';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
        if (!content.includes('const { ALL_CLASSES }')) {
            content = content.replace("const [certType, setCertType]", "const { ALL_CLASSES } = useAcademicClassesData();\n    const [certType, setCertType]");
        }
        content = content.replace(/\{(\['Nursery'[^\]]+\])\.map/g, "{ALL_CLASSES.map");
    }
    
    // 6. Finance.jsx
    if (file === 'Finance.jsx') {
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { useLocalStorage } from '../hooks/useLocalStorage';", "import { useLocalStorage } from '../hooks/useLocalStorage';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
        if (!content.includes('const { ALL_CLASSES }')) {
            content = content.replace("const [activeTab, setActiveTab]", "const { ALL_CLASSES } = useAcademicClassesData();\n    const [activeTab, setActiveTab]");
        }
        content = content.replace(/const ALL_CLASSES = \['Nursery'[^;]+;/g, "");
    }
    
    // 7. FrontOffice.jsx
    if (file === 'FrontOffice.jsx') {
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { useLocalStorage } from '../hooks/useLocalStorage';", "import { useLocalStorage } from '../hooks/useLocalStorage';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
        if (!content.includes('const { ALL_CLASSES }')) {
            content = content.replace("const [activeTab, setActiveTab]", "const { ALL_CLASSES } = useAcademicClassesData();\n    const [activeTab, setActiveTab]");
        }
        content = content.replace(/\{(\['Nursery'[^\]]+\])\.map/g, "{ALL_CLASSES.map");
    }
    
    // 8. StudentReports.jsx
    if (file === 'StudentReports.jsx') {
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { customAlert } from '../utils/dialogs';", "import { customAlert } from '../utils/dialogs';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
        if (!content.includes('const { ALL_CLASSES }')) {
            content = content.replace("const [activeTab, setActiveTab]", "const { ALL_CLASSES } = useAcademicClassesData();\n    const [activeTab, setActiveTab]");
        }
        content = content.replace(/const classes = \['Nursery'[^;]+;/g, "const classes = ALL_CLASSES;");
    }
    
    // 9. TC.jsx
    if (file === 'TC.jsx') {
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { customAlert, customConfirm } from '../utils/dialogs';", "import { customAlert, customConfirm } from '../utils/dialogs';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
        if (!content.includes('const { ALL_CLASSES }')) {
            content = content.replace("const [searchTerm, setSearchTerm]", "const { ALL_CLASSES } = useAcademicClassesData();\n    const [searchTerm, setSearchTerm]");
        }
        content = content.replace(/\{(\['Nursery'[^\]]+\])\.map/g, "{ALL_CLASSES.map");
    }
    
    // 10. Addons.jsx
    if (file === 'Addons.jsx') {
        content = content.replace("import { classes } from '../data/mockData';", "");
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { customAlert, customConfirm } from '../utils/dialogs';", "import { customAlert, customConfirm } from '../utils/dialogs';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
        if (!content.includes('const { ALL_CLASSES }')) {
            content = content.replace("const [activeSection, setActiveSection]", "const { ALL_CLASSES } = useAcademicClassesData();\n    const [activeSection, setActiveSection]");
        }
        content = content.replace(/\{classes\.map/g, "{ALL_CLASSES.map");
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
});
