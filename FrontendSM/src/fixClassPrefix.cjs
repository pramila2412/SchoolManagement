const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'pages');

const filesToProcess = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx'));

filesToProcess.forEach(file => {
    const filePath = path.join(srcDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    // 1. Remove "Class " prefix in dropdowns
    // e.g., <option key={c} value={c}>Class {c}</option> -> <option key={c} value={c}>{c}</option>
    content = content.replace(/>Class \{([^}]+)\}<\/option>/g, '>{$1}</option>');
    // e.g., Class {cls} -> {cls}
    content = content.replace(/>Class \{cls\}/g, '>{cls}');
    
    // Check if it has mockData imports
    if (content.includes('getActiveClasses')) {
        // Remove getActiveClasses from mockData import
        content = content.replace(/,\s*getActiveClasses/g, '');
        content = content.replace(/getActiveClasses\(\)\.map/g, 'ALL_CLASSES.map');
        
        // Ensure useAcademicClassesData is imported
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { useState", "import { useAcademicClassesData } from '../hooks/useAcademicClassesData';\nimport { useState");
        }
        
        // Inject hook inside component
        const componentName = file.replace('.jsx', '');
        const regex = new RegExp(`(export default function ${componentName}\\([^)]*\\) {\\s*)`);
        if (regex.test(content) && !content.includes('const { ALL_CLASSES')) {
            content = content.replace(regex, `$1const { ALL_CLASSES, getSectionsForClass } = useAcademicClassesData();\n    `);
        }
    }
    
    // Also replace getActiveSections
    if (content.includes('getActiveSections')) {
        content = content.replace(/,\s*getActiveSections/g, '');
        content = content.replace(/getActiveSections\([^)]*\)\.map/g, "getSectionsForClass(classFilter || filter?.class || form?.class || 'I').map");
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
});
