const API_BASE_URL = '/api';

const getHeaders = (extraHeaders = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = { ...extraHeaders };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

export const api = {
    // Dashboard
    getDashboardStats: async () => {
        const res = await fetch(`${API_BASE_URL}/dashboard/stats`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    // Students
    getStudents: async () => {
        const res = await fetch(`${API_BASE_URL}/students?status=All`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch students');
        return res.json();
    },
    getStudentsByFilter: async (classFilter, sectionFilter) => {
        let url = `${API_BASE_URL}/students?`;
        if (classFilter && classFilter !== 'All Classes') url += `class=${encodeURIComponent(classFilter)}&`;
        if (sectionFilter && sectionFilter !== 'All Sections') url += `section=${encodeURIComponent(sectionFilter)}&`;
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch filtered students');
        return res.json();
    },
    getStudentById: async (id) => {
        const res = await fetch(`${API_BASE_URL}/students/${id}`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch student');
        return res.json();
    },
    deleteStudent: async (id) => {
        const res = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE', headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to delete student');
        return res.json();
    },
    hardDeleteStudent: async (id) => {
        const res = await fetch(`${API_BASE_URL}/students/${id}/hard`, { method: 'DELETE', headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to permanently delete student');
        return res.json();
    },
    createStudent: async (data) => {
        const res = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || errorData?.error || 'Failed to create student');
        }
        return res.json();
    },
    updateStudent: async (id, data) => {
        const res = await fetch(`${API_BASE_URL}/students/${id}`, {
            method: 'PUT',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || errorData?.error || 'Failed to update student');
        }
        return res.json();
    },

    // Finance
    getFeeCategories: async () => {
        const res = await fetch(`${API_BASE_URL}/finance/categories`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch fee categories');
        return res.json();
    },
    createFeeCategory: async (data) => {
        const res = await fetch(`${API_BASE_URL}/finance/categories`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create fee category');
        return res.json();
    },
    getInvoices: async () => {
        const res = await fetch(`${API_BASE_URL}/finance/invoices`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch invoices');
        return res.json();
    },
    updateInvoiceStatus: async (id, status) => {
        const res = await fetch(`${API_BASE_URL}/finance/invoices/${id}`, {
            method: 'PUT',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Failed to update invoice');
        return res.json();
    },
    getFeeStructures: async () => {
        const res = await fetch(`${API_BASE_URL}/finance/fee-structures`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch fee structures');
        return res.json();
    },
    createFeeStructure: async (data) => {
        const res = await fetch(`${API_BASE_URL}/finance/fee-structures`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create fee structure');
        return res.json();
    },
    updateFeeStructure: async (id, data) => {
        const res = await fetch(`${API_BASE_URL}/finance/fee-structures/${id}`, {
            method: 'PUT',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update fee structure');
        return res.json();
    },
    deleteFeeStructure: async (id) => {
        const res = await fetch(`${API_BASE_URL}/finance/fee-structures/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete fee structure');
        return res.json();
    },

    // Concessions
    getConcessions: async () => {
        const res = await fetch(`${API_BASE_URL}/concessions`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch concessions');
        return res.json();
    },
    createConcession: async (data) => {
        const res = await fetch(`${API_BASE_URL}/concessions`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create concession');
        return res.json();
    },
    deleteConcession: async (id) => {
        const res = await fetch(`${API_BASE_URL}/concessions/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete concession');
        return res.json();
    },

    // Admission
    submitAdmissionApplication: async (data) => {
        const res = await fetch(`${API_BASE_URL}/admission/apply`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to submit application');
        return res.json();
    },
    getAdmissionApplications: async () => {
        const res = await fetch(`${API_BASE_URL}/admission/applications`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch applications');
        return res.json();
    },
    updateAdmissionApplicationStatus: async (id, data) => {
        const res = await fetch(`${API_BASE_URL}/admission/applications/${id}/status`, {
            method: 'PUT',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update application status');
        return res.json();
    },
    updateAdmissionApplicationDocuments: async (id, documents) => {
        const res = await fetch(`${API_BASE_URL}/admission/applications/${id}/documents`, {
            method: 'PUT',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ documents }),
        });
        if (!res.ok) throw new Error('Failed to update application documents');
        return res.json();
    }
};
