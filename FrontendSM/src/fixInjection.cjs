const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'pages');

const filesToProcess = [
    'Admission.jsx',
    'Finance.jsx',
    'StudentReports.jsx',
    'TC.jsx',
    'Addons.jsx'
];

filesToProcess.forEach(file => {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // Check if useAcademicClassesData is already added
    if (!content.includes('const { ALL_CLASSES } = useAcademicClassesData();')) {
        const componentName = file.replace('.jsx', '');
        
        // Find the main component function signature
        const regex = new RegExp(`(export default function ${componentName}\\([^)]*\\) {\\s*)`);
        
        if (regex.test(content)) {
            content = content.replace(regex, `$1const { ALL_CLASSES } = useAcademicClassesData();\n    `);
        } else {
            console.log(`Could not find main component for ${file}`);
        }
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated component body in ${file}`);
    }
});
