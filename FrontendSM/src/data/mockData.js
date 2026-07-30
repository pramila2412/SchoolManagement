// ===== Mock Data for School Management App =====

export const students = [];

// Classes and Sections have been migrated to backend/hooks

export const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

export const feeInvoices = [
  { id: 'INV001', studentId: 'STU001', studentName: 'Aarav Sharma', class: 'X-A', invoiceNo: 'FEE-2024-001', dueDate: '2024-07-15', amount: 15000, status: 'overdue' },
  { id: 'INV002', studentId: 'STU003', studentName: 'Rohan Gupta', class: 'VIII-A', invoiceNo: 'FEE-2024-002', dueDate: '2024-08-01', amount: 13000, status: 'due' },
  { id: 'INV003', studentId: 'STU005', studentName: 'Arjun Reddy', class: 'VI-A', invoiceNo: 'FEE-2024-003', dueDate: '2024-06-30', amount: 35000, status: 'overdue' },
  { id: 'INV004', studentId: 'STU007', studentName: 'Karan Mehta', class: 'IV-A', invoiceNo: 'FEE-2024-004', dueDate: '2024-09-01', amount: 14000, status: 'due' },
];

export const concessionTypes = [
  { id: 'CON001', title: 'Staff Ward', type: 'Percentage', value: 50, status: 'Active' },
  { id: 'CON002', title: 'Sibling Discount', type: 'Fixed', value: 5000, status: 'Active' },
  { id: 'CON003', title: 'Merit Scholarship', type: 'Percentage', value: 25, status: 'Active' },
  { id: 'CON004', title: 'EWS Concession', type: 'Percentage', value: 100, status: 'Active' },
];

export const studentConcessions = [
  { id: 'SC001', studentId: 'STU004', studentName: 'Ananya Singh', class: 'VII-C', concessionType: 'EWS Concession', value: '100%' },
  { id: 'SC002', studentId: 'STU008', studentName: 'Priya Joshi', class: 'Nursery-A', concessionType: 'Staff Ward', value: '50%' },
];

export const dashboardStats = {
  totalStudents: 847,
  totalTeachers: 52,
  feesCollected: 2340000,
  pendingFees: 680000,
  attendanceToday: 91.5,
  newAdmissions: 23,
};

export const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  {
    id: 'student',
    name: 'Student',
    icon: 'Users',
    path: '/students',
    subModules: [
      { name: 'Student Information', path: '/students' },
      { name: 'Add Student', path: '/students/add' },
      { name: 'Student Attendance', path: '/attendance' },
      { name: 'Certificates', path: '/certificates' },
      { name: 'Announcement', path: '/announcements' },
      { name: 'TC', path: '/tc' },
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'IndianRupee',
    path: '/finance',
    subModules: [
      { name: 'Fees Collection', path: '/finance' },
      { name: 'Concessions', path: '/finance/concessions' },
      { name: 'Expenses', path: '/finance/expenses' },
    ]
  },
  { id: 'attendance', name: 'Attendance', icon: 'CalendarCheck', path: '/attendance' },
  { id: 'library', name: 'Library', icon: 'BookOpen', path: '/library' },
  { id: 'transport', name: 'Transport', icon: 'Bus', path: '/transport' },
  { id: 'examination', name: 'Examination', icon: 'FileText', path: '/examination' },
  { id: 'frontoffice', name: 'Front Office', icon: 'Building', path: '/front-office' },
];
