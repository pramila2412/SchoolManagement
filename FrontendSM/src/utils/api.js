const API_BASE_URL = '/api';

export const api = {
    // Dashboard
    getDashboardStats: async () => {
        const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    // Students
    getStudents: async () => {
        const res = await fetch(`${API_BASE_URL}/students`);
        if (!res.ok) throw new Error('Failed to fetch students');
        return res.json();
    },
    getStudentsByFilter: async (classFilter, sectionFilter) => {
        let url = `${API_BASE_URL}/students?`;
        if (classFilter && classFilter !== 'All Classes') url += `class=${encodeURIComponent(classFilter)}&`;
        if (sectionFilter && sectionFilter !== 'All Sections') url += `section=${encodeURIComponent(sectionFilter)}&`;
        if (classFilter !== 'All Classes' && !classFilter.includes('Class')) {
           // Ensure format matches DB
           // Reference DB seems to use "Grade 1" or "Nursery" or just numbers.
           // `routes/students.js` does direct match `if (cls) filter.class = cls;`
           // Based on Admission form it's `Grade X` but Students page uses `Nursery`, `I`, `X` etc.
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch filtered students');
        return res.json();
    },
    getStudentById: async (id) => {
        const res = await fetch(`${API_BASE_URL}/students/${id}`);
        if (!res.ok) throw new Error('Failed to fetch student');
        return res.json();
    },
    createStudent: async (data) => {
        const res = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create student');
        return res.json();
    },

    // Finance
    getInvoices: async () => {
        const res = await fetch(`${API_BASE_URL}/finance/invoices`);
        if (!res.ok) throw new Error('Failed to fetch invoices');
        return res.json();
    },
    updateInvoiceStatus: async (id, status) => {
        const res = await fetch(`${API_BASE_URL}/finance/invoices/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Failed to update invoice');
        return res.json();
    },

    // Concessions
    getConcessions: async () => {
        const res = await fetch(`${API_BASE_URL}/concessions`);
        if (!res.ok) throw new Error('Failed to fetch concessions');
        return res.json();
    },
    createConcession: async (data) => {
        const res = await fetch(`${API_BASE_URL}/concessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create concession');
        return res.json();
    },
    deleteConcession: async (id) => {
        const res = await fetch(`${API_BASE_URL}/concessions/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete concession');
        return res.json();
    }
};
