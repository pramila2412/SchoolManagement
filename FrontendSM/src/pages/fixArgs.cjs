const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const updates = {
    'Attendance.jsx': 'formData?.class',
    'EContent.jsx': 'addForm?.class',
    'EditStudent.jsx': 'formData?.class',
    'HomeWork.jsx': 'assignForm?.class',
    'Reports.jsx': 'reportForm?.class',
    'Students.jsx': "classFilter === 'All Classes' ? 'I' : classFilter"
};

Object.keys(updates).forEach(f => {
    const filePath = path.join(srcDir, f);
    if (!fs.existsSync(filePath)) return;
    let c = fs.readFileSync(filePath, 'utf8');
    c = c.replace(/getSectionsForClass\([^)]*\)/g, 'getSectionsForClass(' + updates[f] + ' || \'I\')');
    fs.writeFileSync(filePath, c);
    console.log('Fixed arguments in', f);
});
