import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customConfirm } from '../utils/dialogs';

export default function Schools() {
    const { token } = useAuth();
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        schoolCode: '', name: '', address: '', phone: '', email: '', status: 'Active'
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    const fetchSchools = async () => {
        try {
            const res = await fetch('/api/schools', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setSchools(data);
            } else {
                setError(data.message || 'Failed to fetch schools');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const url = editingId ? `/api/schools/${editingId}` : '/api/schools';
            const method = editingId ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            const data = await res.json();
            if (res.ok) {
                setFormData({ schoolCode: '', name: '', address: '', phone: '', email: '', status: 'Active' });
                setEditingId(null);
                fetchSchools();
            } else {
                setError(data.message || 'Action failed');
            }
        } catch (err) {
            setError('Error processing request');
        }
    };

    const handleEdit = (school) => {
        setFormData({
            schoolCode: school.schoolCode,
            name: school.name,
            address: school.address || '',
            phone: school.phone || '',
            email: school.email || '',
            status: school.status || 'Active'
        });
        setEditingId(school._id);
    };

    const handleDelete = async (id) => {
        const confirmed = await customConfirm('Are you sure you want to delete this school?');
        if (!confirmed) return;
        try {
            const res = await fetch(`/api/schools/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchSchools();
            } else {
                const data = await res.json();
                setError(data.message || 'Delete failed');
            }
        } catch (err) {
            setError('Error deleting school');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0B3C5D] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Building2 size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Platform Admin Dashboard</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage all school branches</p>
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200">{error}</div>}

            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? 'Edit School Branch' : 'Add New Branch'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">School Code</label>
                                <input required type="text" placeholder="e.g. SION" className="w-full p-2 border rounded-md uppercase" value={formData.schoolCode} onChange={e => setFormData({...formData, schoolCode: e.target.value})} />
                                <p className="text-xs text-gray-500">A short unique code (e.g. SION, KOSI)</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">School Name</label>
                                <input required type="text" placeholder="Mount Zion Sion Nagar" className="w-full p-2 border rounded-md" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Address</label>
                                <input type="text" className="w-full p-2 border rounded-md" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Phone</label>
                                <input type="text" className="w-full p-2 border rounded-md" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Email</label>
                                <input type="email" className="w-full p-2 border rounded-md" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Status</label>
                                <select className="w-full p-2 border rounded-md" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="submit" className="bg-[#0B3C5D] hover:bg-[#051A29] text-white">
                                {editingId ? 'Update Branch' : 'Add Branch'}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={() => { setEditingId(null); setFormData({schoolCode: '', name: '', address: '', phone: '', email: '', status: 'Active'}); }}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>School Branches</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 font-semibold text-sm">Code</th>
                                    <th className="p-3 font-semibold text-sm">Name</th>
                                    <th className="p-3 font-semibold text-sm">Address</th>
                                    <th className="p-3 font-semibold text-sm">Status</th>
                                    <th className="p-3 font-semibold text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schools.map(school => (
                                    <tr key={school._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-bold text-[#0B3C5D]">{school.schoolCode}</td>
                                        <td className="p-3">{school.name}</td>
                                        <td className="p-3 text-sm text-gray-600">{school.address}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${school.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {school.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button onClick={() => handleEdit(school)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(school._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {schools.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center text-gray-500">No schools found. Add one above.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
