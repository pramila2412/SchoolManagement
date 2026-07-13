const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'pages');

const filesToProcess = [
    'Admission.jsx',
    'Certificates.jsx',
    'Examination.jsx',
    'StudentReports.jsx',
    'TC.jsx'
];

filesToProcess.forEach(file => {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // Add useAcademicClassesData to Examination if not there
    if (file === 'Examination.jsx') {
        if (!content.includes('import { useAcademicClassesData }')) {
            content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { useAcademicClassesData } from '../hooks/useAcademicClassesData';");
        }
        if (!content.includes('const { ALL_CLASSES, getSectionsForClass }')) {
            const regex = new RegExp(`(export default function Examination\\([^)]*\\) {\\s*)`);
            content = content.replace(regex, `$1const { ALL_CLASSES, getSectionsForClass } = useAcademicClassesData();\n    `);
        }
        
        // Update ALL_CLASSES in Examination
        content = content.replace(/\{(\['Nursery'[^\]]+\])\.map/g, "{ALL_CLASSES.map");
        
        // Fix Examination.jsx sections:
        // {['A','B','C','D'].map(sec => {
        content = content.replace(/\{\['A','B','C','D'\]\.map\((sec|s) =>/g, "{getSectionsForClass(classInput.className || 'I').map($1 =>");
    } else {
        // Add getSectionsForClass to existing imports in other files
        if (content.includes('const { ALL_CLASSES } = useAcademicClassesData();')) {
            content = content.replace('const { ALL_CLASSES } = useAcademicClassesData();', 'const { ALL_CLASSES, getSectionsForClass } = useAcademicClassesData();');
        }
    }
    
    // Replace hardcoded sections
    if (file === 'Admission.jsx') {
        content = content.replace(/\{\['A', 'B', 'C', 'D'\]\.map\((sec|s) =>/g, "{getSectionsForClass(form.class || 'I').map($1 =>");
    }
    
    if (file === 'Certificates.jsx') {
        content = content.replace(/\{\['A', 'B', 'C', 'D'\]\.map\((sec|s) =>/g, "{getSectionsForClass(filter.class || 'I').map($1 =>");
    }
    
    if (file === 'TC.jsx') {
        content = content.replace(/\{\['A', 'B', 'C', 'D'\]\.map\((sec|s) =>/g, "{getSectionsForClass(filter.class || 'I').map($1 =>");
    }
    
    if (file === 'StudentReports.jsx') {
        content = content.replace(/const sections = \['A','B','C','D'\];/g, "const sections = getSectionsForClass(filters.class || 'I');");
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated sections in ${file}`);
    }
});
