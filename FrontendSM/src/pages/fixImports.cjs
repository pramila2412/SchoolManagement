const fs = require('fs');
['Collaborate.jsx', 'Reports.jsx'].forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    c = "import { useAcademicClassesData } from '../hooks/useAcademicClassesData';\n" + c;
    fs.writeFileSync(f, c);
    console.log('Fixed', f);
});
