const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove `getActiveClasses`, `getBatches`, `classes` and `sections` from mockData import
    const mockDataImportRegex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]\.\.\/data\/mockData['"]/g;
    content = content.replace(mockDataImportRegex, (match, imports) => {
        let newImports = imports.split(',').map(s => s.trim()).filter(s => {
            const name = s.split(' as ')[0].trim();
            return !['getActiveClasses', 'classes', 'sections', 'getBatches'].includes(name);
        });
        modified = true;
        if (newImports.length === 0) return '';
        return `import { ${newImports.join(', ')} } from '../data/mockData'`;
    });

    // If file needs useAcademicClassesData but doesn't have it, we should add it?
    // Actually, AddStudent already has its own fetchClasses, EditStudent has useAcademicClassesData.
    // EContent, HomeWork, Students, Admission use getActiveClasses().
    
    // Replace `getActiveClasses()` with `ALL_CLASSES`
    if (content.includes('getActiveClasses()') || content.includes('classes as MOCK_CLASSES') || content.includes('MOCK_CLASSES')) {
        content = content.replace(/getActiveClasses\(\)/g, 'ALL_CLASSES');
        content = content.replace(/MOCK_CLASSES/g, 'ALL_CLASSES');
        
        // ensure import useAcademicClassesData
        if (!content.includes('useAcademicClassesData')) {
            content = "import { useAcademicClassesData } from '../hooks/useAcademicClassesData';\n" + content;
            
            // find component start and insert hook
            content = content.replace(/(export default function \w+\(\)\s*\{)/, "$1\n    const { ALL_CLASSES, getSectionsForClass } = useAcademicClassesData();");
        }
        modified = true;
    }
    
    // Replace `getBatches()` with `years`
    if (content.includes('getBatches()')) {
        content = content.replace(/getBatches\(\)/g, 'years');
        
        // Add hook
        if (!content.includes('useAcademicYears')) {
            content = "import { useAcademicYears } from '../hooks/useAcademicYears';\n" + content;
            content = content.replace(/(export default function \w+\(\)\s*\{)/, "$1\n    const { years } = useAcademicYears();");
        }
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Modified: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

walkDir(directoryPath);
console.log('Done!');
