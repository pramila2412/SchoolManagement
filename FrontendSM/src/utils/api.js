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
