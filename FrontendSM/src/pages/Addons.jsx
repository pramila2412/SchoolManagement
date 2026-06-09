import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link, useSearchParams, useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { classes } from '../data/mockData';
import {
    PlusCircle, Search, Calendar, FileText, Download, Award,
    Image as ImageIcon, Gift, MessageSquare, ClipboardList, BarChart3,
    Settings, Users, Clock, Edit3, Trash2, Eye, MapPin, Phone,
    CheckCircle2, XCircle, Send, Plus, Key, Link as LinkIcon, PieChart,
    UserCheck, FolderOpen, Mail, UploadCloud, ToggleRight
} from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { customAlert, customConfirm } from '../utils/dialogs';
import './Addons.css';

// ======================== VISITORS ========================
function VisitorsTab() {
    const [visitors, setVisitors] = useLocalStorage('addons_visitors', [
        { id: 1, name: 'Suresh Kumar', phone: '9876543210', purpose: 'Parent Visit', person: 'Principal', timeIn: '09:00 AM', timeOut: '10:30 AM', date: '2026-03-25' },
        { id: 2, name: 'Amazon Delivery', phone: '9988776655', purpose: 'Delivery', person: 'Admin Office', timeIn: '10:15 AM', timeOut: '10:20 AM', date: '2026-03-25' },
        { id: 3, name: 'Anita Singh', phone: '9876543211', purpose: 'Meeting', person: 'Class Teacher Gr-3', timeIn: '11:00 AM', timeOut: '-', date: '2026-03-25' }
    ]);
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><UserCheck size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Visitor Log Book</h3>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><PlusCircle size={16}/> New Visitor Entry</button>
            </div>

            {showForm && (
                <div className="ado-form-panel">
                    <h3>New Visitor Entry</h3>
                    <div className="ado-form form-row-3">
                        <div className="form-group"><label className="form-label">Visitor Name *</label><input type="text" className="form-input"/></div>
                        <div className="form-group"><label className="form-label">Mobile Number *</label><PhoneInput className="form-input"/></div>
                        <div className="form-group"><label className="form-label">Purpose of Visit *</label><select className="form-select"><option>Meeting</option><option>Delivery</option><option>Parent Visit</option><option>Interview</option><option>Other</option></select></div>
                        <div className="form-group"><label className="form-label">Person to Meet</label><input type="text" className="form-input"/></div>
                        <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" defaultValue={new Date().toISOString().split('T')[0]}/></div>
                        <div className="form-group"><label className="form-label">Time In</label><input type="time" className="form-input"/></div>
                    </div>
                    <div className="ado-form form-actions"><button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button><button className="btn btn-primary">Save Entry</button></div>
                </div>
            )}

            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Name</th><th>Mobile</th><th>Purpose</th><th>Person to Meet</th><th>Time In</th><th>Time Out</th><th>Actions</th></tr></thead>
                    <tbody>{visitors.map(v => (
                        <tr key={v.id}><td className="fw-600">{v.name}</td><td>{v.phone}</td><td><span className="badge badge-info">{v.purpose}</span></td>
                            <td>{v.person}</td><td>{v.timeIn}</td><td>{v.timeOut === '-' ? <span className="badge badge-warning">Inside Campus</span> : v.timeOut}</td>
                            <td>{v.timeOut === '-' && <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}><Clock size={12}/> Clock Out</button>}</td></tr>
                    ))}</tbody></table>
            </div>
        </div>
    );
}

// ======================== GALLERY ========================
function GalleryTab() {
    const defaultAlbums = [
        { id: 1, name: 'Annual Sports Day 2026', description: 'Highlights from the annual sports event held at the school grounds.', category: 'Sports', audience: 'All Users', status: 'Active', images: [] },
        { id: 2, name: 'Science Exhibition', description: 'Student projects showcased during the annual science fair.', category: 'Academic', audience: 'All Users', status: 'Draft', images: [] },
        { id: 3, name: 'Independence Day Celebration', description: 'Flag hoisting and cultural programme on 15th August.', category: 'Events', audience: 'All Users', status: 'Active', images: [] },
        { id: 4, name: 'Campus Aerial View', description: 'Drone shots of the school campus and facilities.', category: 'Campus', audience: 'Staff Only', status: 'Draft', images: [] }
    ];
    const [albums, setAlbums] = useLocalStorage('addons_gallery_v2', defaultAlbums);
    const [showForm, setShowForm] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [openAlbum, setOpenAlbum] = useState(null);
    const [lightboxImg, setLightboxImg] = useState(null);
    const [lightboxIdx, setLightboxIdx] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', category: 'Academic', audience: 'All Users', status: 'Active' });

    const resetForm = () => { setForm({ name: '', description: '', category: 'Academic', audience: 'All Users', status: 'Active' }); setEditingAlbum(null); };

    const handleCreateGallery = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { await customAlert('Please enter a gallery title.', 'Validation Error', 'error'); return; }
        if (editingAlbum) {
            setAlbums(prev => prev.map(a => a.id === editingAlbum.id ? { ...a, name: form.name.trim(), description: form.description.trim(), category: form.category, audience: form.audience, status: form.status } : a));
            await customAlert(`Gallery "${form.name}" updated successfully!`, 'Success', 'success');
        } else {
            const newAlbum = { id: Date.now(), name: form.name.trim(), description: form.description.trim(), category: form.category, audience: form.audience, status: form.status, images: [] };
            setAlbums(prev => [newAlbum, ...prev]);
            await customAlert(`Gallery "${form.name}" created successfully! Open it to upload images.`, 'Success', 'success');
        }
        resetForm();
        setShowForm(false);
    };

    const handleEditGallery = (album) => {
        setEditingAlbum(album);
        setForm({ name: album.name, description: album.description || '', category: album.category || 'Academic', audience: album.audience || 'All Users', status: album.status });
        setShowForm(true);
    };

    const handleDeleteGallery = async (id, name) => {
        if (await customConfirm(`Delete gallery "${name}" and all its images? This action cannot be undone.`)) {
            setAlbums(prev => prev.filter(a => a.id !== id));
            if (openAlbum && openAlbum.id === id) setOpenAlbum(null);
        }
    };

    const handleToggleStatus = async (id) => {
        setAlbums(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Draft' : 'Active' } : a));
    };

    // ---- Image upload logic ----
    const processFiles = async (files, albumId) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 10 * 1024 * 1024; // 10 MB
        const validFiles = [];
        const errors = [];

        for (const file of files) {
            if (!validTypes.includes(file.type)) { errors.push(`"${file.name}" — unsupported format. Only JPG, PNG, GIF allowed.`); continue; }
            if (file.size > maxSize) { errors.push(`"${file.name}" — exceeds 10 MB limit (${(file.size/1024/1024).toFixed(1)} MB).`); continue; }
            validFiles.push(file);
        }

        if (errors.length > 0) {
            await customAlert(`Some files were skipped:\n\n${errors.join('\n')}`, 'Upload Warning', 'error');
        }

        if (validFiles.length === 0) return;

        const newImages = await Promise.all(validFiles.map(file => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                resolve({ id: Date.now() + Math.random(), name: file.name, src: ev.target.result, caption: '', size: (file.size/1024/1024).toFixed(1) + ' MB', uploadedAt: new Date().toISOString().split('T')[0] });
            };
            reader.readAsDataURL(file);
        })));

        setAlbums(prev => prev.map(a => a.id === albumId ? { ...a, images: [...(a.images || []), ...newImages] } : a));
        // Refresh openAlbum reference
        setOpenAlbum(prev => {
            if (!prev || prev.id !== albumId) return prev;
            const updated = albums.find(a => a.id === albumId);
            return { ...prev, images: [...(prev.images || []), ...newImages] };
        });
        await customAlert(`${newImages.length} image(s) uploaded successfully!`, 'Upload Complete', 'success');
    };

    const handleFileInput = (albumId) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/jpeg,image/png,image/gif';
        input.onchange = () => { if (input.files.length > 0) processFiles(Array.from(input.files), albumId); };
        input.click();
    };

    const handleDrop = (e, albumId) => {
        e.preventDefault(); setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) processFiles(files, albumId);
    };

    const handleUpdateCaption = (albumId, imageId, caption) => {
        setAlbums(prev => prev.map(a => a.id === albumId ? { ...a, images: (a.images || []).map(img => img.id === imageId ? { ...img, caption } : img) } : a));
    };

    const handleDeleteImage = async (albumId, imageId, imageName) => {
        if (await customConfirm(`Delete image "${imageName}"?`)) {
            setAlbums(prev => prev.map(a => a.id === albumId ? { ...a, images: (a.images || []).filter(img => img.id !== imageId) } : a));
            setSelectedImages(prev => prev.filter(id => id !== imageId));
        }
    };

    const handleBulkDelete = async (albumId) => {
        if (selectedImages.length === 0) { await customAlert('No images selected. Click on images to select them for bulk delete.', 'Info', 'info'); return; }
        if (await customConfirm(`Delete ${selectedImages.length} selected image(s)? This cannot be undone.`)) {
            setAlbums(prev => prev.map(a => a.id === albumId ? { ...a, images: (a.images || []).filter(img => !selectedImages.includes(img.id)) } : a));
            setSelectedImages([]);
        }
    };

    const toggleSelectImage = (imageId) => {
        setSelectedImages(prev => prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]);
    };

    const openLightbox = (images, idx) => { setLightboxImg(images); setLightboxIdx(idx); };
    const closeLightbox = () => { setLightboxImg(null); setLightboxIdx(0); };

    // Get current album data from state (always fresh)
    const currentAlbum = openAlbum ? albums.find(a => a.id === openAlbum.id) : null;

    // ---- LIGHTBOX ----
    if (lightboxImg && lightboxImg.length > 0) {
        const img = lightboxImg[lightboxIdx];
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.92)', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={closeLightbox}>
                <div style={{ position: 'absolute', top: 16, right: 24, display: 'flex', gap: 16, zIndex: 10001 }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{lightboxIdx + 1} / {lightboxImg.length}</span>
                    <button onClick={closeLightbox} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, maxWidth: '90vw', maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
                    {lightboxImg.length > 1 && <button onClick={() => setLightboxIdx((lightboxIdx - 1 + lightboxImg.length) % lightboxImg.length)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '2rem', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', flexShrink: 0 }}>‹</button>}
                    <div style={{ textAlign: 'center' }}>
                        <img src={img.src} alt={img.caption || img.name} style={{ maxWidth: '80vw', maxHeight: '75vh', borderRadius: 8, objectFit: 'contain' }} />
                        {(img.caption || img.name) && <p style={{ color: '#fff', marginTop: 12, fontSize: '0.95rem' }}>{img.caption || img.name}</p>}
                    </div>
                    {lightboxImg.length > 1 && <button onClick={() => setLightboxIdx((lightboxIdx + 1) % lightboxImg.length)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '2rem', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', flexShrink: 0 }}>›</button>}
                </div>
            </div>
        );
    }

    // ---- OPEN ALBUM VIEW (image management) ----
    if (currentAlbum) {
        const images = currentAlbum.images || [];
        return (
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="btn btn-outline" onClick={() => { setOpenAlbum(null); setSelectedImages([]); }} style={{ padding: '6px 12px' }}>← Back</button>
                        <div>
                            <h3 style={{ color: 'var(--primary)', margin: 0 }}><ImageIcon size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/>{currentAlbum.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '4px 0 0' }}>{currentAlbum.category} • {currentAlbum.audience} • <span className={`badge ${currentAlbum.status === 'Active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>{currentAlbum.status}</span></p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {selectedImages.length > 0 && <button className="btn btn-danger" onClick={() => handleBulkDelete(currentAlbum.id)} style={{ fontSize: '0.82rem' }}><Trash2 size={14}/> Delete Selected ({selectedImages.length})</button>}
                        <button className="btn btn-primary" onClick={() => handleFileInput(currentAlbum.id)}><UploadCloud size={16}/> Upload Images</button>
                    </div>
                </div>

                {currentAlbum.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 20, padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)' }}>{currentAlbum.description}</p>}

                {/* Drag & Drop Zone */}
                <div
                    className={`gallery-dropzone ${dragOver ? 'gallery-dropzone-active' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => handleDrop(e, currentAlbum.id)}
                    onClick={() => handleFileInput(currentAlbum.id)}
                    style={{ border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', marginBottom: 24, background: dragOver ? 'var(--accent-light, rgba(28,167,166,0.06))' : 'var(--bg)', transition: 'all 0.2s ease' }}
                >
                    <UploadCloud size={40} color={dragOver ? 'var(--accent)' : 'var(--text-muted)'} style={{ marginBottom: 12 }} />
                    <p style={{ fontWeight: 600, color: dragOver ? 'var(--accent)' : 'var(--text)', marginBottom: 4 }}>
                        {dragOver ? 'Drop images here...' : 'Drag & drop images here, or click to browse'}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Supports JPG, PNG, GIF — Max 10 MB per image</p>
                </div>

                {/* Image Grid */}
                {images.length > 0 ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}><ImageIcon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/> {images.length} image(s)</p>
                            <button className="btn btn-outline" onClick={() => setSelectedImages(selectedImages.length === images.length ? [] : images.map(i => i.id))} style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
                                {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                            {images.map((img, idx) => (
                                <div key={img.id} style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: selectedImages.includes(img.id) ? '2px solid var(--accent)' : '1px solid var(--border-light)', position: 'relative', transition: 'all 0.2s ease', boxShadow: selectedImages.includes(img.id) ? '0 0 0 2px var(--accent)' : 'none' }}>
                                    {/* Selection checkbox */}
                                    <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
                                        <input type="checkbox" checked={selectedImages.includes(img.id)} onChange={() => toggleSelectImage(img.id)} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--accent)' }} />
                                    </div>
                                    {/* Action buttons */}
                                    <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 4, zIndex: 2 }}>
                                        <button className="btn-icon" title="View Full Screen" onClick={() => openLightbox(images, idx)} style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={14}/></button>
                                        <button className="btn-icon" title="Delete Image" onClick={() => handleDeleteImage(currentAlbum.id, img.id, img.name)} style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 size={14}/></button>
                                    </div>
                                    {/* Thumbnail */}
                                    <div onClick={() => openLightbox(images, idx)} style={{ cursor: 'pointer' }}>
                                        <img src={img.src} alt={img.caption || img.name} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                                    </div>
                                    {/* Caption */}
                                    <div style={{ padding: '8px 10px' }}>
                                        <input
                                            type="text"
                                            value={img.caption}
                                            onChange={e => handleUpdateCaption(currentAlbum.id, img.id, e.target.value)}
                                            placeholder="Add caption..."
                                            style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--border-light)', background: 'transparent', fontSize: '0.78rem', padding: '4px 0', outline: 'none', color: 'var(--text)' }}
                                        />
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{img.size} • {img.uploadedAt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <ImageIcon size={48} opacity={0.2} style={{ marginBottom: 12 }}/>
                        <p>No images in this gallery yet</p>
                        <p style={{ fontSize: '0.82rem', marginTop: 8 }}>Use the upload area above or click "Upload Images" to add photos</p>
                    </div>
                )}
            </div>
        );
    }

    // ---- GALLERY LIST VIEW ----
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><ImageIcon size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Photo Gallery</h3>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}><PlusCircle size={16}/> Create Gallery</button>
            </div>
            
            {showForm && (
                <div className="ado-form-panel">
                    <h3>{editingAlbum ? 'Edit Gallery' : 'Create New Gallery'}</h3>
                    <form className="ado-form" onSubmit={handleCreateGallery}>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Gallery Title *</label><input type="text" className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Annual Day 2024" /></div>
                            <div className="form-group"><label className="form-label">Category *</label>
                                <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                                    <option>Academic</option><option>Sports</option><option>Events</option><option>Campus</option><option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description of this gallery..."></textarea></div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Audience</label>
                                <select className="form-select" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})}>
                                    <option>All Users</option><option>Students Only</option><option>Staff Only</option><option>Parents</option>
                                </select>
                            </div>
                            <div className="form-group"><label className="form-label">Status</label>
                                <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                                    <option>Active</option><option>Draft</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Send size={16}/> {editingAlbum ? 'Update Gallery' : 'Save Gallery'}</button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Gallery Cards Grid */}
            <div className="ado-gallery-grid">
                {albums.map((album) => {
                    const imgs = album.images || [];
                    const coverImg = imgs.length > 0 ? imgs[0].src : null;
                    return (
                        <div className="ado-gallery-item" key={album.id} style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}>
                            {/* Thumbnail / Cover */}
                            <div className="ado-gallery-img" onClick={() => { setOpenAlbum(album); setSelectedImages([]); }}>
                                {coverImg ? <img src={coverImg} alt={album.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <ImageIcon size={32} opacity={0.5}/>}
                            </div>
                            {/* Action Buttons */}
                            <div className="ado-gallery-action" style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.95)', borderRadius: 'var(--radius-sm)', padding: '2px 4px' }}>
                                <button className="btn-icon" title="Edit Gallery" onClick={(e) => { e.stopPropagation(); handleEditGallery(album); }}><Edit3 size={14}/></button>
                                <button className="btn-icon" title={album.status === 'Active' ? 'Set to Draft' : 'Set to Active'} onClick={(e) => { e.stopPropagation(); handleToggleStatus(album.id); }}><ToggleRight size={14} color={album.status === 'Active' ? 'var(--success)' : 'var(--text-muted)'}/></button>
                                <button className="btn-icon" title="Delete Gallery" onClick={(e) => { e.stopPropagation(); handleDeleteGallery(album.id, album.name); }} style={{ color: 'var(--danger)' }}><Trash2 size={14}/></button>
                            </div>
                            {/* Info */}
                            <div className="ado-gallery-info" onClick={() => { setOpenAlbum(album); setSelectedImages([]); }}>
                                <h5>{album.name}</h5>
                                <p>{imgs.length} Photo{imgs.length !== 1 ? 's' : ''} • <span className={album.status === 'Active' ? 'success' : ''}>{album.status}</span></p>
                                <p style={{ fontSize: '0.7rem', marginTop: 2 }}>{album.category} • {album.audience}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {albums.length === 0 && <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}><ImageIcon size={48} opacity={0.2} style={{ marginBottom: 12 }}/><p>No galleries created yet</p><p style={{ fontSize: '0.82rem', marginTop: 8 }}>Click "Create Gallery" to get started</p></div>}
        </div>
    );
}

// ======================== ALUMNI ========================
function AlumniTab() {
    const defaultAlumni = [
        { id: 1, name: 'Ritika Sharma', batch: '2020', course: 'Science', profession: 'Software Engineer', employer: 'Infosys', location: 'Bangalore', phone: '9988776655', email: 'ritika.sharma@gmail.com', address: '45, MG Road, Bangalore 560001', photo: '' },
        { id: 2, name: 'Animesh Roy', batch: '2019', course: 'Commerce', profession: 'Chartered Accountant', employer: 'Deloitte', location: 'Mumbai', phone: '9888877777', email: 'animesh.roy@outlook.com', address: '12, Andheri West, Mumbai 400058', photo: '' },
        { id: 3, name: 'Pooja Verma', batch: '2022', course: 'Arts', profession: 'Journalist', employer: 'Times of India', location: 'Delhi', phone: '9111122222', email: 'pooja.v@yahoo.com', address: '78, Connaught Place, New Delhi 110001', photo: '' },
        { id: 4, name: 'Rahul Gupta', batch: '2018', course: 'Science', profession: 'Doctor', employer: 'AIIMS', location: 'Patna', phone: '9876512345', email: 'rahul.gupta@gmail.com', address: '23, Boring Road, Patna 800001', photo: '' },
        { id: 5, name: 'Sneha Kumari', batch: '2021', course: 'Commerce', profession: 'Bank PO', employer: 'SBI', location: 'Purnea', phone: '9765432100', email: 'sneha.k@gmail.com', address: '56, Station Road, Purnea 854301', photo: '' }
    ];
    const [alumni, setAlumni] = useLocalStorage('addons_alumni_v2', defaultAlumni);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewProfile, setViewProfile] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBatch, setFilterBatch] = useState('All');
    const [filterCourse, setFilterCourse] = useState('All');
    const [filterCity, setFilterCity] = useState('All');
    const [form, setForm] = useState({ name: '', batch: '', course: 'Science', profession: '', employer: '', location: '', phone: '', email: '', address: '', photo: '' });

    const resetForm = () => { setForm({ name: '', batch: '', course: 'Science', profession: '', employer: '', location: '', phone: '', email: '', address: '', photo: '' }); setEditingId(null); };

    // Unique values for filters
    const allBatches = [...new Set(alumni.map(a => a.batch))].sort((a, b) => b - a);
    const allCourses = [...new Set(alumni.map(a => a.course))];
    const allCities = [...new Set(alumni.map(a => a.location).filter(Boolean))].sort();

    // Filtered alumni
    const filteredAlumni = alumni.filter(a => {
        const term = searchTerm.toLowerCase();
        const matchSearch = !term || `${a.name} ${a.batch} ${a.profession} ${a.employer || ''}`.toLowerCase().includes(term);
        const matchBatch = filterBatch === 'All' || a.batch === filterBatch;
        const matchCourse = filterCourse === 'All' || a.course === filterCourse;
        const matchCity = filterCity === 'All' || a.location === filterCity;
        return matchSearch && matchBatch && matchCourse && matchCity;
    });

    const handlePhotoUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/png,image/gif';
        input.onchange = () => {
            const file = input.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { customAlert('Photo must be under 5 MB.', 'Error', 'error'); return; }
            const reader = new FileReader();
            reader.onload = (ev) => setForm(prev => ({ ...prev, photo: ev.target.result }));
            reader.readAsDataURL(file);
        };
        input.click();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { await customAlert('Please enter the alumni name.', 'Validation Error', 'error'); return; }
        if (!form.batch.trim()) { await customAlert('Please enter the batch / graduation year.', 'Validation Error', 'error'); return; }
        if (!form.phone.trim()) { await customAlert('Please enter a contact number.', 'Validation Error', 'error'); return; }

        if (editingId) {
            setAlumni(prev => prev.map(a => a.id === editingId ? { ...a, ...form, name: form.name.trim(), profession: form.profession.trim(), employer: form.employer.trim(), location: form.location.trim(), phone: form.phone.trim(), email: form.email.trim(), address: form.address.trim() } : a));
            await customAlert(`Alumni record for "${form.name}" updated successfully!`, 'Success', 'success');
        } else {
            const newAlumni = { id: Date.now(), ...form, name: form.name.trim(), profession: form.profession.trim(), employer: form.employer.trim(), location: form.location.trim(), phone: form.phone.trim(), email: form.email.trim(), address: form.address.trim() };
            setAlumni(prev => [newAlumni, ...prev]);
            await customAlert(`Alumni "${form.name}" added successfully!`, 'Success', 'success');
        }
        resetForm();
        setShowForm(false);
    };

    const handleEdit = (a) => {
        setEditingId(a.id);
        setForm({ name: a.name, batch: a.batch, course: a.course, profession: a.profession || '', employer: a.employer || '', location: a.location || '', phone: a.phone || '', email: a.email || '', address: a.address || '', photo: a.photo || '' });
        setShowForm(true);
        setViewProfile(null);
    };

    const handleDelete = async (a) => {
        if (await customConfirm(`Delete alumni record for "${a.name}"? This cannot be undone.`)) {
            setAlumni(prev => prev.filter(x => x.id !== a.id));
            if (viewProfile && viewProfile.id === a.id) setViewProfile(null);
        }
    };

    const handleExport = () => {
        const headers = ['Name', 'Batch', 'Stream', 'Profession', 'Employer', 'City', 'Phone', 'Email', 'Address'];
        const rows = filteredAlumni.map(a => [a.name, a.batch, a.course, a.profession || '', a.employer || '', a.location || '', a.phone || '', a.email || '', `"${(a.address || '').replace(/"/g, '""')}"`]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Alumni_Directory_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        customAlert(`Exported ${filteredAlumni.length} alumni record(s) as CSV.`, 'Export Complete', 'success');
    };

    const clearFilters = () => { setSearchTerm(''); setFilterBatch('All'); setFilterCourse('All'); setFilterCity('All'); };

    // ---- VIEW PROFILE PANEL ----
    if (viewProfile) {
        const a = alumni.find(x => x.id === viewProfile.id) || viewProfile;
        return (
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="btn btn-outline" onClick={() => setViewProfile(null)} style={{ padding: '6px 12px' }}>← Back</button>
                        <h3 style={{ color: 'var(--primary)', margin: 0 }}><Users size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/>Alumni Profile</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline" onClick={() => handleEdit(a)}><Edit3 size={14}/> Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(a)} style={{ fontSize: '0.82rem' }}><Trash2 size={14}/> Delete</button>
                    </div>
                </div>

                <div className="ado-form-panel" style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                    {/* Photo */}
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'var(--bg)', border: '3px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', margin: '0 auto 12px' }}>
                            {a.photo ? <img src={a.photo} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <Users size={48} color="var(--text-muted)"/>}
                        </div>
                        <h4 style={{ margin: '0 0 4px', color: 'var(--text)' }}>{a.name}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>Batch of {a.batch} • {a.course}</p>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Profession</p><p style={{ fontWeight: 500 }}>{a.profession || '—'}</p></div>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Employer</p><p style={{ fontWeight: 500 }}>{a.employer || '—'}</p></div>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Phone</p><p style={{ fontWeight: 500 }}>{a.phone || '—'}</p></div>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Email</p><p style={{ fontWeight: 500 }}>{a.email || '—'}</p></div>
                            <div style={{ gridColumn: 'span 2' }}><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Current City</p><p style={{ fontWeight: 500 }}>{a.location || '—'}</p></div>
                            <div style={{ gridColumn: 'span 2' }}><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Address</p><p style={{ fontWeight: 500 }}>{a.address || '—'}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ---- MAIN LIST VIEW ----
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}><Users size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Alumni Directory</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" onClick={() => { setShowSearch(!showSearch); if (showSearch) clearFilters(); }}><Search size={16}/> {showSearch ? 'Hide Search' : 'Search & Filter'}</button>
                    <button className="btn btn-outline" onClick={handleExport}><Download size={16}/> Export CSV</button>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}><PlusCircle size={16}/> Add Alumni</button>
                </div>
            </div>

            {/* Search & Filters */}
            {showSearch && (
                <div className="ado-form-panel" style={{ padding: 16, marginBottom: 20 }}>
                    <div className="ado-form form-row-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Search</label><input type="text" className="form-input" placeholder="Name, batch, profession..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/></div>
                        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Batch Year</label>
                            <select className="form-select" value={filterBatch} onChange={e => setFilterBatch(e.target.value)}><option value="All">All Batches</option>{allBatches.map(b => <option key={b}>{b}</option>)}</select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Course / Stream</label>
                            <select className="form-select" value={filterCourse} onChange={e => setFilterCourse(e.target.value)}><option value="All">All Streams</option>{allCourses.map(c => <option key={c}>{c}</option>)}</select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">City</label>
                            <select className="form-select" value={filterCity} onChange={e => setFilterCity(e.target.value)}><option value="All">All Cities</option>{allCities.map(c => <option key={c}>{c}</option>)}</select>
                        </div>
                    </div>
                    {(searchTerm || filterBatch !== 'All' || filterCourse !== 'All' || filterCity !== 'All') && (
                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{filteredAlumni.length} result(s) found</span>
                            <button className="btn btn-outline" onClick={clearFilters} style={{ fontSize: '0.78rem', padding: '4px 10px' }}>Clear Filters</button>
                        </div>
                    )}
                </div>
            )}

            {/* Add / Edit Form */}
            {showForm && (
                <div className="ado-form-panel" style={{ marginBottom: 20 }}>
                    <h3>{editingId ? 'Edit Alumni Record' : 'Add New Alumni Record'}</h3>
                    <form className="ado-form" onSubmit={handleSave}>
                        {/* Profile Photo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }} onClick={handlePhotoUpload}>
                                {form.photo ? <img src={form.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <UploadCloud size={24} color="var(--text-muted)"/>}
                            </div>
                            <div>
                                <button type="button" className="btn btn-outline" onClick={handlePhotoUpload} style={{ fontSize: '0.82rem', padding: '6px 12px' }}><UploadCloud size={14}/> Upload Photo</button>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Optional — JPG, PNG, GIF (max 5 MB)</p>
                                {form.photo && <button type="button" style={{ fontSize: '0.75rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 2 }} onClick={() => setForm(prev => ({ ...prev, photo: '' }))}>Remove photo</button>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Alumni Name *</label><input type="text" className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Enter full name"/></div>
                            <div className="form-group"><label className="form-label">Batch / Graduation Year *</label><input type="text" className="form-input" required value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} placeholder="e.g. 2024"/></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Course / Stream *</label>
                                <select className="form-select" value={form.course} onChange={e => setForm({...form, course: e.target.value})}>
                                    <option>Science</option><option>Commerce</option><option>Arts</option><option>Vocational</option><option>Other</option>
                                </select>
                            </div>
                            <div className="form-group"><label className="form-label">Contact Number *</label><PhoneInput className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Enter mobile number"/></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Email Address</label><input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Enter email address"/></div>
                            <div className="form-group"><label className="form-label">Current City / Location</label><input type="text" className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Bangalore"/></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Current Profession</label><input type="text" className="form-input" value={form.profession} onChange={e => setForm({...form, profession: e.target.value})} placeholder="e.g. Software Engineer"/></div>
                            <div className="form-group"><label className="form-label">Employer / Organization</label><input type="text" className="form-input" value={form.employer} onChange={e => setForm({...form, employer: e.target.value})} placeholder="e.g. Infosys, AIIMS"/></div>
                        </div>
                        <div className="form-group"><label className="form-label">Current Address</label><textarea className="form-input" rows="2" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Enter full current address"></textarea></div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Send size={16}/> {editingId ? 'Update Record' : 'Save Alumni'}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Alumni Table */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                <Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/> {filteredAlumni.length} alumni record(s) {filteredAlumni.length !== alumni.length && `(filtered from ${alumni.length} total)`}
            </div>
            <div className="table-responsive">
                <table className="data-table"><thead><tr><th></th><th>Name</th><th>Batch</th><th>Stream</th><th>Profession / Employer</th><th>City</th><th>Contact</th><th>Actions</th></tr></thead>
                    <tbody>{filteredAlumni.length > 0 ? filteredAlumni.map(a => (
                        <tr key={a.id}>
                            <td style={{ width: 40, padding: '6px 8px' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {a.photo ? <img src={a.photo} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <Users size={14} color="var(--text-muted)"/>}
                                </div>
                            </td>
                            <td className="fw-600" style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setViewProfile(a)}>{a.name}</td>
                            <td><span className="badge badge-draft">{a.batch}</span></td>
                            <td>{a.course}</td>
                            <td>{a.profession || '—'}{a.employer ? ` @ ${a.employer}` : ''}</td>
                            <td>{a.location || '—'}</td>
                            <td style={{ fontSize: '0.82rem' }}>
                                {a.phone && <span style={{ display: 'block' }}><Phone size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/>{a.phone}</span>}
                                {a.email && <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)' }}><Mail size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/>{a.email}</span>}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button className="btn-icon" title="View Profile" onClick={() => setViewProfile(a)}><Eye size={16}/></button>
                                    <button className="btn-icon" title="Edit Record" onClick={() => handleEdit(a)}><Edit3 size={16}/></button>
                                    <button className="btn-icon" title="Delete Record" style={{color:'var(--danger)'}} onClick={() => handleDelete(a)}><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No alumni records match your search criteria</td></tr>
                    )}</tbody></table>
            </div>
        </div>
    );
}

// ======================== BIRTHDAYS ========================
function BirthdaysTab() {
    const [dateFilter, setDateFilter] = useState('today');
    const [classFilter, setClassFilter] = useState('All');
    const [sectionFilter, setSectionFilter] = useState('All');
    const [showNotifConfig, setShowNotifConfig] = useState(false);
    const [notifSettings, setNotifSettings] = useLocalStorage('addons_birthday_notifications', {
        dailyAdminAlert: true,
        classTeacherAlert: true,
        studentPortalHighlight: true,
        parentSms: false
    });
    const [notifDismissed, setNotifDismissed] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch students from localStorage
    const allStudents = JSON.parse(localStorage.getItem('mzs_students') || '[]');

    // Helper: get days until next birthday
    const getDaysUntilBirthday = (dobStr) => {
        if (!dobStr) return 999;
        const dob = new Date(dobStr);
        if (isNaN(dob.getTime())) return 999;
        const thisYearBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        thisYearBday.setHours(0, 0, 0, 0);
        if (thisYearBday < today) {
            thisYearBday.setFullYear(today.getFullYear() + 1);
        }
        const diffMs = thisYearBday - today;
        return Math.round(diffMs / (1000 * 60 * 60 * 24));
    };

    // Helper: check if birthday is today
    const isBirthdayToday = (dobStr) => getDaysUntilBirthday(dobStr) === 0;

    // Helper: check if birthday is this week (next 7 days including today)
    const isBirthdayThisWeek = (dobStr) => {
        const days = getDaysUntilBirthday(dobStr);
        return days >= 0 && days <= 6;
    };

    // Helper: check if birthday is this month
    const isBirthdayThisMonth = (dobStr) => {
        if (!dobStr) return false;
        const dob = new Date(dobStr);
        return dob.getMonth() === today.getMonth();
    };

    // Helper: calculate age turning this year
    const getAgeTurning = (dobStr) => {
        if (!dobStr) return '—';
        const dob = new Date(dobStr);
        if (isNaN(dob.getTime())) return '—';
        return today.getFullYear() - dob.getFullYear();
    };

    // Helper: parse class and section from the stored "Class-Section" format
    const parseClass = (classStr) => {
        if (!classStr) return { cls: '', sec: '' };
        const parts = classStr.split('-');
        if (parts.length >= 2) {
            return { cls: parts.slice(0, -1).join('-'), sec: parts[parts.length - 1] };
        }
        return { cls: classStr, sec: '' };
    };

    // Format date for display
    const formatDob = (dobStr) => {
        if (!dobStr) return '—';
        try {
            const d = new Date(dobStr);
            return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch { return dobStr; }
    };

    // Build birthday list from students with DOB
    const studentsWithDob = allStudents.filter(s => s.dateOfBirth && s.status !== 'Inactive');

    // Get unique classes and sections for filters
    const allClasses = [...new Set(studentsWithDob.map(s => parseClass(s.class).cls).filter(Boolean))].sort();
    const allSections = [...new Set(studentsWithDob.map(s => parseClass(s.class).sec).filter(Boolean))].sort();

    // Apply date filter
    let filtered = studentsWithDob.filter(s => {
        if (dateFilter === 'today') return isBirthdayToday(s.dateOfBirth);
        if (dateFilter === 'week') return isBirthdayThisWeek(s.dateOfBirth);
        if (dateFilter === 'month') return isBirthdayThisMonth(s.dateOfBirth);
        return true;
    });

    // Apply class filter
    if (classFilter !== 'All') {
        filtered = filtered.filter(s => parseClass(s.class).cls === classFilter);
    }

    // Apply section filter
    if (sectionFilter !== 'All') {
        filtered = filtered.filter(s => parseClass(s.class).sec === sectionFilter);
    }

    // Sort: today's birthdays first, then by days until birthday
    filtered.sort((a, b) => {
        const aDays = getDaysUntilBirthday(a.dateOfBirth);
        const bDays = getDaysUntilBirthday(b.dateOfBirth);
        return aDays - bDays;
    });

    // Count today's birthdays
    const todayCount = studentsWithDob.filter(s => isBirthdayToday(s.dateOfBirth)).length;
    const weekCount = studentsWithDob.filter(s => isBirthdayThisWeek(s.dateOfBirth)).length;

    // Send greeting handler
    const handleSendGreeting = async (student) => {
        const { cls, sec } = parseClass(student.class);
        await customAlert(
            `Birthday greeting sent! 🎂\n\nTo: ${student.name || student.firstName + ' ' + (student.lastName || '')}\nClass: ${cls}-${sec}\nDate of Birth: ${formatDob(student.dateOfBirth)}\n\n${student.phone ? `Parent Phone: ${student.phone}` : ''}${student.parentEmail ? `\nParent Email: ${student.parentEmail}` : ''}`,
            'Greeting Sent', 'success'
        );
    };

    // Toggle notification setting
    const toggleNotif = (key) => {
        setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="animate-fade-in">
            {/* Daily Notification Banner */}
            {todayCount > 0 && !notifDismissed && (
                <div style={{ background: 'linear-gradient(135deg, #FFF3E0, #FFFDE7)', border: '1px solid #FFB74D', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: '2rem' }}>🎂</span>
                        <div>
                            <p style={{ fontWeight: 700, color: '#E65100', margin: 0, fontSize: '1rem' }}>{todayCount} Student{todayCount > 1 ? 's have' : ' has'} a Birthday Today!</p>
                            <p style={{ fontSize: '0.82rem', color: '#BF360C', margin: '4px 0 0' }}>
                                {notifSettings.dailyAdminAlert ? '✅ Admin alert sent' : '⚠️ Admin alert disabled'} • {notifSettings.classTeacherAlert ? '✅ Class teacher notified' : '⚠️ Teacher alert disabled'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setNotifDismissed(true)} style={{ background: 'none', border: 'none', color: '#BF360C', fontSize: '1.2rem', cursor: 'pointer', padding: 4 }}>×</button>
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}><Gift size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Student Birthdays</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className={`btn ${showNotifConfig ? 'btn-primary' : 'btn-outline'}`} onClick={() => setShowNotifConfig(!showNotifConfig)} style={{ fontSize: '0.82rem' }}><Settings size={14}/> Notifications</button>
                </div>
            </div>

            {/* Notification Configuration Panel */}
            {showNotifConfig && (
                <div className="ado-form-panel" style={{ marginBottom: 20 }}>
                    <h3><Settings size={18}/> Birthday Notification Configuration</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {[
                            { key: 'dailyAdminAlert', label: 'Daily Admin Alert', desc: 'Admin receives list of today\'s birthdays each morning', defaultOn: true },
                            { key: 'classTeacherAlert', label: 'Class Teacher Alert', desc: 'Class teacher notified of birthdays in their class', defaultOn: true },
                            { key: 'studentPortalHighlight', label: 'Student Portal Highlight', desc: 'Birthday student\'s profile highlighted for the day', defaultOn: true },
                            { key: 'parentSms', label: 'Parent SMS / Notification', desc: 'Optional birthday greeting to parent', defaultOn: false }
                        ].map(n => (
                            <div key={n.key} style={{ border: '1px solid var(--border-light)', padding: 16, borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: 4, color: 'var(--text)' }}>{n.label}</h4>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0 }}>{n.desc}</p>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, display: 'inline-block' }}>Default: {n.defaultOn ? 'Enabled' : 'Disabled'}</span>
                                </div>
                                <label className="ado-switch">
                                    <input type="checkbox" checked={notifSettings[n.key]} onChange={() => toggleNotif(n.key)} />
                                    <span className="ado-slider"></span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="ado-stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: 20 }}>
                <div className="ado-stat-card" style={{ cursor: 'pointer', border: dateFilter === 'today' ? '2px solid var(--accent)' : undefined }} onClick={() => setDateFilter('today')}>
                    <div className="ado-stat-icon" style={{ background: '#FFF3E0' }}><span style={{ fontSize: '1.5rem' }}>🎂</span></div>
                    <div className="ado-stat-info"><h4>{todayCount}</h4><p>Today</p></div>
                </div>
                <div className="ado-stat-card" style={{ cursor: 'pointer', border: dateFilter === 'week' ? '2px solid var(--accent)' : undefined }} onClick={() => setDateFilter('week')}>
                    <div className="ado-stat-icon" style={{ background: 'var(--info-light)' }}><Calendar size={22} color="var(--info)"/></div>
                    <div className="ado-stat-info"><h4>{weekCount}</h4><p>This Week</p></div>
                </div>
                <div className="ado-stat-card" style={{ cursor: 'pointer', border: dateFilter === 'month' ? '2px solid var(--accent)' : undefined }} onClick={() => setDateFilter('month')}>
                    <div className="ado-stat-icon" style={{ background: 'var(--success-light)' }}><Calendar size={22} color="var(--success)"/></div>
                    <div className="ado-stat-info"><h4>{studentsWithDob.filter(s => isBirthdayThisMonth(s.dateOfBirth)).length}</h4><p>This Month</p></div>
                </div>
                <div className="ado-stat-card" style={{ cursor: 'pointer', border: dateFilter === 'all' ? '2px solid var(--accent)' : undefined }} onClick={() => setDateFilter('all')}>
                    <div className="ado-stat-icon" style={{ background: 'var(--bg)' }}><Users size={22} color="var(--text-muted)"/></div>
                    <div className="ado-stat-info"><h4>{studentsWithDob.length}</h4><p>All Students</p></div>
                </div>
            </div>

            {/* Filters */}
            <div className="ado-form-panel" style={{ padding: 14, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 140 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Date Range</label>
                    <select className="form-select" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All Birthdays</option>
                    </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 120 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Class</label>
                    <select className="form-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
                        <option value="All">All Classes</option>
                        {allClasses.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 100 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Section</label>
                    <select className="form-select" value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}>
                        <option value="All">All Sections</option>
                        {allSections.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                {(classFilter !== 'All' || sectionFilter !== 'All') && (
                    <button className="btn btn-outline" onClick={() => { setClassFilter('All'); setSectionFilter('All'); }} style={{ fontSize: '0.78rem', padding: '8px 12px', height: 40 }}>Clear</button>
                )}
            </div>

            {/* Results count */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                <Gift size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/> {filtered.length} birthday(s) found
                {dateFilter === 'today' && filtered.length === 0 && ' — no birthdays today'}
            </div>

            {/* Birthday Table */}
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Date of Birth</th>
                            <th>Age Turning</th>
                            <th>Days Until Birthday</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((s, idx) => {
                            const days = getDaysUntilBirthday(s.dateOfBirth);
                            const isToday = days === 0;
                            const { cls, sec } = parseClass(s.class);
                            const studentName = s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || '—';

                            return (
                                <tr key={s.id || idx} style={isToday ? { backgroundColor: '#FFF8E1', borderLeft: '3px solid #FFB74D' } : {}}>
                                    <td style={{ width: 36, padding: '6px 8px' }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: isToday ? '#FFF3E0' : 'var(--bg)', border: isToday ? '2px solid #FFB74D' : '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {s.photoUrl ? <img src={s.photoUrl} alt={studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <span style={{ fontSize: isToday ? '1rem' : '0.8rem' }}>{isToday ? '🎂' : '👤'}</span>}
                                        </div>
                                    </td>
                                    <td className="fw-600" style={isToday ? { color: '#E65100' } : {}}>{studentName} {isToday && '🎉'}</td>
                                    <td>{cls || '—'}</td>
                                    <td>{sec || '—'}</td>
                                    <td>{formatDob(s.dateOfBirth)}</td>
                                    <td style={{ fontWeight: 600 }}>{getAgeTurning(s.dateOfBirth)}</td>
                                    <td>
                                        {isToday ? (
                                            <span className="badge badge-success" style={{ fontWeight: 700 }}>🎂 Today!</span>
                                        ) : days === 1 ? (
                                            <span className="badge badge-warning">Tomorrow</span>
                                        ) : (
                                            <span className="badge badge-draft">{days} day{days !== 1 ? 's' : ''}</span>
                                        )}
                                    </td>
                                    <td>
                                        {isToday ? (
                                            <span className="badge badge-success">🎉 Birthday!</span>
                                        ) : days <= 7 ? (
                                            <span className="badge badge-info">Upcoming</span>
                                        ) : (
                                            <span className="badge badge-draft">Scheduled</span>
                                        )}
                                    </td>
                                    <td>
                                        <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => handleSendGreeting(s)}><Mail size={13}/> Send Greeting</button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                                    <Gift size={36} opacity={0.2} style={{ marginBottom: 8 }}/>
                                    <p style={{ margin: '8px 0 0' }}>
                                        {dateFilter === 'today' ? 'No student birthdays today' :
                                         dateFilter === 'week' ? 'No student birthdays this week' :
                                         dateFilter === 'month' ? 'No student birthdays this month' :
                                         studentsWithDob.length === 0 ? 'No students with date of birth recorded. Add students in the Student module to see birthdays here.' :
                                         'No birthdays match the current filters'}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Auto-fetch info */}
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14}/> Birthdays are automatically fetched from the Student module using Date of Birth field. Total students with DOB: {studentsWithDob.length}
            </p>
        </div>
    );
}

// ======================== MESSAGES ========================
function MessagesTab() {
    const defaultMessages = [
        { id: 1, title: 'Exam Guidelines 2026', content: 'Dear Students,\n\nPlease note the following guidelines for the upcoming annual examination:\n\n1. Report to school by 8:30 AM\n2. Carry your admit card and stationery\n3. Mobile phones are strictly prohibited\n4. Use only blue/black pen for writing\n\nBest of luck!\n\nRegards,\nExamination Cell', to: 'All Students', sender: 'Admin', date: '2026-06-04', time: '09:15 AM', priority: 'Important', delivered: 450, read: 380, isRead: true, replies: [] },
        { id: 2, title: 'Emergency Staff Meeting at 3 PM', content: 'All teaching and non-teaching staff are requested to attend an important meeting in the conference hall at 3:00 PM today.\n\nAgenda:\n- Academic calendar for next term\n- New admission targets\n- Parent-teacher meeting schedule\n\nAttendance is compulsory.', to: 'All Staff', sender: 'Principal', date: '2026-06-05', time: '11:30 AM', priority: 'Urgent', delivered: 52, read: 45, isRead: false, replies: [{ id: 101, from: 'Mrs. Sharma', content: 'Noted. Will be there.', date: '2026-06-05', time: '11:45 AM' }] },
        { id: 3, title: 'Fee Payment Reminder — Q2', content: 'Dear Parents,\n\nThis is a gentle reminder that the Q2 fee payment is due by June 15, 2026. Please make the payment through the parent portal or at the school accounts office.\n\nLate payment will attract a penalty of ₹500.\n\nThank you.', to: 'All Parents', sender: 'Accounts', date: '2026-06-03', time: '10:00 AM', priority: 'Normal', delivered: 320, read: 210, isRead: true, replies: [] },
        { id: 4, title: 'Science Lab Safety Orientation', content: 'Students of Class IX and X are required to attend a mandatory science lab safety orientation on Monday, June 9th.\n\nVenue: Physics Lab\nTime: 2:00 PM - 3:30 PM\n\nPlease wear lab coats.', to: 'Specific Class', targetClass: 'IX', sender: 'HOD Science', date: '2026-06-02', time: '02:00 PM', priority: 'Important', delivered: 85, read: 60, isRead: false, replies: [] },
        { id: 5, title: 'Library Book Return Notice', content: 'Dear Students,\n\nAll library books issued during May must be returned by June 10, 2026. Failure to return will result in a fine and restriction on future borrowing.\n\nLibrary Hours: 9 AM - 4 PM', to: 'All Students', sender: 'Librarian', date: '2026-06-01', time: '08:30 AM', priority: 'Normal', delivered: 450, read: 300, isRead: true, replies: [] }
    ];
    const [messages, setMessages] = useLocalStorage('addons_messages_v2', defaultMessages);
    const [showCompose, setShowCompose] = useState(false);
    const [viewMessage, setViewMessage] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterRecipient, setFilterRecipient] = useState('All');
    const [filterRead, setFilterRead] = useState('All');
    const [replyText, setReplyText] = useState('');
    const [form, setForm] = useState({ title: '', content: '', to: 'All Students', targetClass: '', individualName: '', priority: 'Normal' });

    const resetForm = () => setForm({ title: '', content: '', to: 'All Students', targetClass: '', individualName: '', priority: 'Normal' });

    const badgeColor = (p) => p === 'Urgent' ? 'badge-danger' : p === 'Important' ? 'badge-warning' : 'badge-info';
    const priorityIcon = (p) => p === 'Urgent' ? '🔴' : p === 'Important' ? '🟡' : '🟢';

    const formatDate = (dateStr) => {
        try { return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
        catch { return dateStr; }
    };

    // Filtered messages
    let filtered = [...messages];
    if (filterPriority !== 'All') filtered = filtered.filter(m => m.priority === filterPriority);
    if (filterRecipient !== 'All') filtered = filtered.filter(m => m.to === filterRecipient);
    if (filterRead === 'Unread') filtered = filtered.filter(m => !m.isRead);
    if (filterRead === 'Read') filtered = filtered.filter(m => m.isRead);

    // Stats
    const totalMessages = messages.length;
    const unreadCount = messages.filter(m => !m.isRead).length;
    const urgentCount = messages.filter(m => m.priority === 'Urgent').length;

    // Send message handler
    const handleSend = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { await customAlert('Please enter a message title.', 'Validation', 'error'); return; }
        if (!form.content.trim()) { await customAlert('Please enter message content.', 'Validation', 'error'); return; }
        if (form.to === 'Specific Class' && !form.targetClass) { await customAlert('Please select a class.', 'Validation', 'error'); return; }
        if (form.to === 'Individual' && !form.individualName.trim()) { await customAlert('Please enter the recipient name.', 'Validation', 'error'); return; }

        const recipientCounts = { 'All Staff': 52, 'All Students': 450, 'All Parents': 320, 'Specific Class': 40, 'Individual': 1 };
        const deliveredCount = recipientCounts[form.to] || 1;

        const newMsg = {
            id: Date.now(),
            title: form.title.trim(),
            content: form.content.trim(),
            to: form.to,
            targetClass: form.targetClass,
            individualName: form.individualName.trim(),
            sender: 'Admin',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(),
            priority: form.priority,
            delivered: deliveredCount,
            read: 0,
            isRead: true,
            replies: []
        };
        setMessages(prev => [newMsg, ...prev]);
        resetForm();
        setShowCompose(false);
        await customAlert(`Message "${newMsg.title}" sent successfully to ${form.to}${form.to === 'Specific Class' ? ` (${form.targetClass})` : form.to === 'Individual' ? ` (${form.individualName})` : ''}!\n\nDelivered to ${deliveredCount} recipient(s).`, 'Message Sent ✅', 'success');
    };

    // Mark as read
    const handleMarkRead = (id) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    };

    // Mark as unread
    const handleMarkUnread = (id) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: false } : m));
    };

    // Delete message
    const handleDelete = async (msg) => {
        if (await customConfirm(`Delete message "${msg.title}"? This cannot be undone.`)) {
            setMessages(prev => prev.filter(m => m.id !== msg.id));
            if (viewMessage && viewMessage.id === msg.id) setViewMessage(null);
        }
    };

    // Reply
    const handleReply = async (msgId) => {
        if (!replyText.trim()) { await customAlert('Please enter a reply.', 'Validation', 'error'); return; }
        const newReply = { id: Date.now(), from: 'Admin', content: replyText.trim(), date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() };
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, replies: [...(m.replies || []), newReply] } : m));
        setReplyText('');
        await customAlert('Reply sent successfully!', 'Sent', 'success');
    };

    const clearFilters = () => { setFilterPriority('All'); setFilterRecipient('All'); setFilterRead('All'); };

    // ---- VIEW MESSAGE PANEL ----
    if (viewMessage) {
        const msg = messages.find(m => m.id === viewMessage.id) || viewMessage;
        // Mark as read when viewing
        if (!msg.isRead) handleMarkRead(msg.id);
        const deliveryPct = msg.delivered > 0 ? Math.round((msg.read / msg.delivered) * 100) : 0;

        return (
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="btn btn-outline" onClick={() => setViewMessage(null)} style={{ padding: '6px 12px' }}>← Back</button>
                        <h3 style={{ color: 'var(--primary)', margin: 0 }}><MessageSquare size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/>Message Detail</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline" onClick={() => msg.isRead ? handleMarkUnread(msg.id) : handleMarkRead(msg.id)} style={{ fontSize: '0.82rem' }}>{msg.isRead ? '📭 Mark Unread' : '📬 Mark Read'}</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(msg)} style={{ fontSize: '0.82rem' }}><Trash2 size={14}/> Delete</button>
                    </div>
                </div>

                {/* Message Header */}
                <div className="ado-form-panel" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <h3 style={{ margin: '0 0 8px', color: 'var(--text)', fontSize: '1.15rem' }}>{priorityIcon(msg.priority)} {msg.title}</h3>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                                <span><strong>From:</strong> {msg.sender}</span>
                                <span><strong>To:</strong> {msg.to}{msg.targetClass ? ` (${msg.targetClass})` : ''}{msg.individualName ? ` (${msg.individualName})` : ''}</span>
                                <span><strong>Date:</strong> {formatDate(msg.date)} {msg.time || ''}</span>
                            </div>
                        </div>
                        <span className={`badge ${badgeColor(msg.priority)}`} style={{ fontSize: '0.82rem' }}>{msg.priority}</span>
                    </div>
                </div>

                {/* Message Content */}
                <div className="ado-form-panel" style={{ marginBottom: 16 }}>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.92rem', color: 'var(--text)' }}>{msg.content}</div>
                </div>

                {/* Delivery Tracking */}
                <div className="ado-form-panel" style={{ marginBottom: 16 }}>
                    <h3 style={{ fontSize: '0.95rem' }}><CheckCircle2 size={16}/> Delivery Tracking</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                        <div style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{msg.delivered}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Delivered</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--success)', margin: 0 }}>{msg.read}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Read</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--warning)', margin: 0 }}>{msg.delivered - msg.read}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Unread</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)', margin: 0 }}>{deliveryPct}%</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Read Rate</p>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ marginTop: 12, background: 'var(--border-light)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${deliveryPct}%`, height: '100%', background: 'var(--accent)', borderRadius: 8, transition: 'width 0.5s ease' }}></div>
                    </div>
                </div>

                {/* Replies Section */}
                <div className="ado-form-panel">
                    <h3 style={{ fontSize: '0.95rem' }}><MessageSquare size={16}/> Replies ({(msg.replies || []).length})</h3>
                    {(msg.replies || []).length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                            {msg.replies.map(r => (
                                <div key={r.id} style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>{r.from}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(r.date)} {r.time}</span>
                                    </div>
                                    <p style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>{r.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>No replies yet</p>
                    )}
                    {/* Reply form */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                        <textarea className="form-input" rows="2" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..." style={{ flex: 1, resize: 'none' }}></textarea>
                        <button className="btn btn-primary" onClick={() => handleReply(msg.id)} disabled={!replyText.trim()} style={{ height: 60, padding: '0 20px' }}><Send size={16}/></button>
                    </div>
                </div>
            </div>
        );
    }

    // ---- MAIN INBOX VIEW ----
    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}><MessageSquare size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Message Center</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" onClick={() => setShowFilters(!showFilters)} style={{ fontSize: '0.82rem' }}><Search size={14}/> {showFilters ? 'Hide Filters' : 'Filter'}</button>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowCompose(!showCompose); }}><Send size={16}/> Create Message</button>
                </div>
            </div>

            {/* Stats */}
            <div className="ado-stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 20 }}>
                <div className="ado-stat-card">
                    <div className="ado-stat-icon" style={{ background: 'var(--info-light)' }}><MessageSquare size={22} color="var(--info)"/></div>
                    <div className="ado-stat-info"><h4>{totalMessages}</h4><p>Total Messages</p></div>
                </div>
                <div className="ado-stat-card">
                    <div className="ado-stat-icon" style={{ background: '#FFF3E0' }}><Mail size={22} color="#E65100"/></div>
                    <div className="ado-stat-info"><h4>{unreadCount}</h4><p>Unread</p></div>
                </div>
                <div className="ado-stat-card">
                    <div className="ado-stat-icon" style={{ background: '#FFEBEE' }}><span style={{ fontSize: '1.2rem' }}>🔴</span></div>
                    <div className="ado-stat-info"><h4>{urgentCount}</h4><p>Urgent</p></div>
                </div>
                <div className="ado-stat-card">
                    <div className="ado-stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={22} color="var(--success)"/></div>
                    <div className="ado-stat-info"><h4>{totalMessages - unreadCount}</h4><p>Read</p></div>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="ado-form-panel" style={{ padding: 14, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 120 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Priority</label>
                        <select className="form-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                            <option value="All">All Priorities</option>
                            <option>Normal</option><option>Important</option><option>Urgent</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 130 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Recipient</label>
                        <select className="form-select" value={filterRecipient} onChange={e => setFilterRecipient(e.target.value)}>
                            <option value="All">All Recipients</option>
                            <option>All Staff</option><option>All Students</option><option>All Parents</option><option>Specific Class</option><option>Individual</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 110 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Status</label>
                        <select className="form-select" value={filterRead} onChange={e => setFilterRead(e.target.value)}>
                            <option value="All">All</option><option>Unread</option><option>Read</option>
                        </select>
                    </div>
                    {(filterPriority !== 'All' || filterRecipient !== 'All' || filterRead !== 'All') && (
                        <button className="btn btn-outline" onClick={clearFilters} style={{ fontSize: '0.78rem', padding: '8px 12px', height: 40 }}>Clear</button>
                    )}
                </div>
            )}

            {/* Compose Form */}
            {showCompose && (
                <div className="ado-form-panel" style={{ marginBottom: 20 }}>
                    <h3><Send size={16}/> Create New Message</h3>
                    <form className="ado-form" onSubmit={handleSend}>
                        <div className="form-group">
                            <label className="form-label">Message Title *</label>
                            <input type="text" className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Enter message subject" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Message Content *</label>
                            <textarea className="form-input" rows="6" required value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Write your message here... (plain text or formatted text)" style={{ fontFamily: 'inherit', lineHeight: 1.6 }}></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Select Recipient *</label>
                                <select className="form-select" value={form.to} onChange={e => setForm({...form, to: e.target.value, targetClass: '', individualName: ''})}>
                                    <option>All Staff</option>
                                    <option>All Students</option>
                                    <option>All Parents</option>
                                    <option>Specific Class</option>
                                    <option>Individual</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Priority *</label>
                                <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                                    <option>Normal</option>
                                    <option>Important</option>
                                    <option>Urgent</option>
                                </select>
                            </div>
                        </div>

                        {/* Conditional: Specific Class selector */}
                        {form.to === 'Specific Class' && (
                            <div className="form-group">
                                <label className="form-label">Select Class *</label>
                                <select className="form-select" required value={form.targetClass} onChange={e => setForm({...form, targetClass: e.target.value})}>
                                    <option value="">— Select Class —</option>
                                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Conditional: Individual name */}
                        {form.to === 'Individual' && (
                            <div className="form-group">
                                <label className="form-label">Recipient Name *</label>
                                <input type="text" className="form-input" required value={form.individualName} onChange={e => setForm({...form, individualName: e.target.value})} placeholder="Enter student, parent, or staff name" />
                            </div>
                        )}

                        {/* Priority hint */}
                        <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: form.priority === 'Urgent' ? '#FFEBEE' : form.priority === 'Important' ? '#FFF8E1' : 'var(--bg)', border: `1px solid ${form.priority === 'Urgent' ? '#EF5350' : form.priority === 'Important' ? '#FFB74D' : 'var(--border-light)'}`, marginBottom: 14, fontSize: '0.82rem' }}>
                            {priorityIcon(form.priority)} <strong>{form.priority}</strong> — {form.priority === 'Urgent' ? 'Appears as a top alert with push notification' : form.priority === 'Important' ? 'Highlighted in inbox with emphasis' : 'Standard delivery, no special emphasis'}
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={() => { setShowCompose(false); resetForm(); }}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><Send size={16}/> Send Message</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Messages Table */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                <MessageSquare size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/> {filtered.length} message(s){filtered.length !== messages.length && ` (filtered from ${messages.length} total)`}
            </div>

            <div className="table-responsive">
                <table className="data-table">
                    <thead><tr><th></th><th>Message Title</th><th>Recipient</th><th>Sender</th><th>Priority</th><th>Sent Date</th><th>Delivery</th><th>Actions</th></tr></thead>
                    <tbody>{filtered.length > 0 ? filtered.map(m => (
                        <tr key={m.id} style={{ background: !m.isRead ? 'var(--accent-light, rgba(28,167,166,0.04))' : undefined, cursor: 'pointer' }} onClick={() => setViewMessage(m)}>
                            <td style={{ width: 32, padding: '6px' }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: !m.isRead ? 'var(--accent)' : 'transparent', border: m.isRead ? '1px solid var(--border)' : 'none' }}></div>
                            </td>
                            <td className="fw-600" style={{ color: !m.isRead ? 'var(--primary)' : 'var(--text)' }}>
                                {m.title}
                                {(m.replies || []).length > 0 && <span style={{ fontSize: '0.72rem', color: 'var(--accent)', marginLeft: 6 }}>💬 {m.replies.length}</span>}
                            </td>
                            <td>{m.to}{m.targetClass ? ` (${m.targetClass})` : ''}{m.individualName ? ` (${m.individualName})` : ''}</td>
                            <td>{m.sender}</td>
                            <td><span className={`badge ${badgeColor(m.priority)}`}>{priorityIcon(m.priority)} {m.priority}</span></td>
                            <td style={{ fontSize: '0.82rem' }}>{formatDate(m.date)}<br/><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{m.time || ''}</span></td>
                            <td style={{ fontSize: '0.82rem' }}>
                                <span style={{ color: 'var(--success)' }}>✓ {m.delivered}</span> / <span style={{ color: 'var(--accent)' }}>{m.read} read</span>
                            </td>
                            <td onClick={e => e.stopPropagation()}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button className="btn-icon" title="View Message" onClick={() => setViewMessage(m)}><Eye size={16}/></button>
                                    <button className="btn-icon" title={m.isRead ? 'Mark Unread' : 'Mark Read'} onClick={() => m.isRead ? handleMarkUnread(m.id) : handleMarkRead(m.id)}><Mail size={16}/></button>
                                    <button className="btn-icon" title="Delete" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(m)}><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                            <MessageSquare size={36} opacity={0.2} style={{ marginBottom: 8 }}/>
                            <p style={{ margin: '8px 0 0' }}>{messages.length === 0 ? 'No messages yet. Click "Create Message" to get started.' : 'No messages match the current filters'}</p>
                        </td></tr>
                    )}</tbody>
                </table>
            </div>
        </div>
    );
}

// ======================== FORMS ========================
function FormsTab() {
    const defaultForms = [
        { id: 1, name: 'Annual Transport Feedback', description: 'Collect parent feedback on school transport service quality and safety.', type: 'Feedback', audience: 'Parents', status: 'Active', createdAt: '2026-03-01',
            fields: [
                { id: 1, type: 'Text', label: 'Parent Name', placeholder: 'Enter your name', required: true, options: '' },
                { id: 2, type: 'Dropdown', label: 'Overall Rating', placeholder: '', required: true, options: 'Excellent,Good,Average,Poor' },
                { id: 3, type: 'Paragraph', label: 'Suggestions', placeholder: 'Share your suggestions...', required: false, options: '' }
            ],
            submissions: [
                { id: 101, submittedBy: 'Rajesh Sharma', submittedAt: '2026-03-20 09:15 AM', data: { 'Parent Name': 'Rajesh Sharma', 'Overall Rating': 'Good', 'Suggestions': 'Please improve pickup timing in the morning.' } },
                { id: 102, submittedBy: 'Priya Gupta', submittedAt: '2026-03-21 10:30 AM', data: { 'Parent Name': 'Priya Gupta', 'Overall Rating': 'Excellent', 'Suggestions': 'Very satisfied with the service.' } },
                { id: 103, submittedBy: 'Amit Patel', submittedAt: '2026-03-22 02:45 PM', data: { 'Parent Name': 'Amit Patel', 'Overall Rating': 'Average', 'Suggestions': '' } }
            ]
        },
        { id: 2, name: 'Teacher Device Request', description: 'Staff can request laptops, tablets, or projectors for classroom use.', type: 'Custom', audience: 'Staff', status: 'Active', createdAt: '2026-02-15',
            fields: [
                { id: 1, type: 'Text', label: 'Teacher Name', placeholder: 'Full name', required: true, options: '' },
                { id: 2, type: 'Dropdown', label: 'Device Type', placeholder: '', required: true, options: 'Laptop,Tablet,Projector,Printer' },
                { id: 3, type: 'Paragraph', label: 'Justification', placeholder: 'Why do you need this device?', required: true, options: '' },
                { id: 4, type: 'Date', label: 'Required By', placeholder: '', required: false, options: '' }
            ],
            submissions: [
                { id: 201, submittedBy: 'Mr. Sharma', submittedAt: '2026-03-22 11:00 AM', data: { 'Teacher Name': 'Mr. Sharma', 'Device Type': 'Laptop', 'Justification': 'Need for online class preparation', 'Required By': '2026-04-01' } }
            ]
        },
        { id: 3, name: 'Science Fair Registration', description: 'Student registration form for the inter-school science exhibition.', type: 'Event Sign-up', audience: 'Students', status: 'Closed', createdAt: '2026-01-10',
            fields: [
                { id: 1, type: 'Text', label: 'Student Name', placeholder: 'Enter name', required: true, options: '' },
                { id: 2, type: 'Email', label: 'Email', placeholder: 'student@email.com', required: true, options: '' },
                { id: 3, type: 'Dropdown', label: 'Category', placeholder: '', required: true, options: 'Physics,Chemistry,Biology,Mathematics,Computer Science' },
                { id: 4, type: 'Text', label: 'Project Title', placeholder: 'Enter project title', required: true, options: '' },
                { id: 5, type: 'Paragraph', label: 'Abstract', placeholder: 'Brief description of your project...', required: false, options: '' }
            ],
            submissions: [
                { id: 301, submittedBy: 'Aarav Sharma', submittedAt: '2026-01-15 09:00 AM', data: { 'Student Name': 'Aarav Sharma', 'Email': 'aarav@school.com', 'Category': 'Physics', 'Project Title': 'Solar Energy Model', 'Abstract': 'A working model demonstrating solar power generation.' } },
                { id: 302, submittedBy: 'Diya Patel', submittedAt: '2026-01-16 10:30 AM', data: { 'Student Name': 'Diya Patel', 'Email': 'diya@school.com', 'Category': 'Biology', 'Project Title': 'Plant Growth Study', 'Abstract': 'Effect of music on plant growth.' } }
            ]
        }
    ];
    const FIELD_TYPES = ['Text', 'Number', 'Email', 'Dropdown', 'Checkbox', 'Radio', 'Date', 'File Upload', 'Paragraph'];
    const FORM_TYPES = ['Survey', 'Registration', 'Feedback', 'Event Sign-up', 'Custom'];
    const AUDIENCES = ['All Users', 'Students', 'Parents', 'Staff', 'Teachers'];

    const [forms, setForms] = useLocalStorage('addons_forms_v2', defaultForms);
    const [showBuilder, setShowBuilder] = useState(false);
    const [editingFormId, setEditingFormId] = useState(null);
    const [viewFormId, setViewFormId] = useState(null);
    const [viewSubmission, setViewSubmission] = useState(null);
    const [formMeta, setFormMeta] = useState({ name: '', description: '', type: 'Survey', audience: 'All Users', status: 'Active' });
    const [fields, setFields] = useState([]);
    const [newField, setNewField] = useState({ type: 'Text', label: '', placeholder: '', required: false, options: '' });
    const [dragIdx, setDragIdx] = useState(null);

    const resetBuilder = () => { setFormMeta({ name: '', description: '', type: 'Survey', audience: 'All Users', status: 'Active' }); setFields([]); setEditingFormId(null); setNewField({ type: 'Text', label: '', placeholder: '', required: false, options: '' }); };

    const fieldIcon = (type) => {
        const icons = { 'Text': '✏️', 'Number': '#️⃣', 'Email': '📧', 'Dropdown': '📋', 'Checkbox': '☑️', 'Radio': '🔘', 'Date': '📅', 'File Upload': '📎', 'Paragraph': '📝' };
        return icons[type] || '📄';
    };

    // Add field to form
    const handleAddField = () => {
        if (!newField.label.trim()) { customAlert('Please enter a field label.', 'Required', 'error'); return; }
        if (['Dropdown', 'Checkbox', 'Radio'].includes(newField.type) && !newField.options.trim()) { customAlert('Please enter options (comma-separated).', 'Required', 'error'); return; }
        setFields(prev => [...prev, { ...newField, id: Date.now(), label: newField.label.trim(), placeholder: newField.placeholder.trim(), options: newField.options.trim() }]);
        setNewField({ type: 'Text', label: '', placeholder: '', required: false, options: '' });
    };

    // Remove field
    const handleRemoveField = (id) => setFields(prev => prev.filter(f => f.id !== id));

    // Toggle required
    const handleToggleRequired = (id) => setFields(prev => prev.map(f => f.id === id ? { ...f, required: !f.required } : f));

    // Drag reorder
    const handleDragStart = (idx) => setDragIdx(idx);
    const handleDragOver = (e, idx) => { e.preventDefault(); };
    const handleDrop = (idx) => {
        if (dragIdx === null || dragIdx === idx) return;
        const newFields = [...fields];
        const [moved] = newFields.splice(dragIdx, 1);
        newFields.splice(idx, 0, moved);
        setFields(newFields);
        setDragIdx(null);
    };

    // Save form
    const handleSaveForm = async (e) => {
        e.preventDefault();
        if (!formMeta.name.trim()) { await customAlert('Please enter the form name.', 'Validation', 'error'); return; }
        if (fields.length === 0) { await customAlert('Please add at least one field to the form.', 'Validation', 'error'); return; }

        if (editingFormId) {
            setForms(prev => prev.map(f => f.id === editingFormId ? { ...f, ...formMeta, name: formMeta.name.trim(), description: formMeta.description.trim(), fields } : f));
            await customAlert(`Form "${formMeta.name}" updated successfully!`, 'Updated', 'success');
        } else {
            const newForm = { id: Date.now(), ...formMeta, name: formMeta.name.trim(), description: formMeta.description.trim(), fields, createdAt: new Date().toISOString().split('T')[0], submissions: [] };
            setForms(prev => [newForm, ...prev]);
            await customAlert(`Form "${formMeta.name}" created and published!`, 'Created', 'success');
        }
        resetBuilder();
        setShowBuilder(false);
    };

    // Edit form
    const handleEditForm = (form) => {
        setEditingFormId(form.id);
        setFormMeta({ name: form.name, description: form.description || '', type: form.type || 'Survey', audience: form.audience || 'All Users', status: form.status });
        setFields([...(form.fields || [])]);
        setShowBuilder(true);
        setViewFormId(null);
    };

    // Delete form
    const handleDeleteForm = async (form) => {
        if (await customConfirm(`Delete form "${form.name}" and all its submissions? This cannot be undone.`)) {
            setForms(prev => prev.filter(f => f.id !== form.id));
            if (viewFormId === form.id) setViewFormId(null);
        }
    };

    // Toggle form status (close/reopen)
    const handleToggleStatus = async (id) => {
        setForms(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'Active' ? 'Closed' : 'Active' } : f));
    };

    // Export submissions CSV
    const handleExportCSV = (form) => {
        if (!form.submissions || form.submissions.length === 0) { customAlert('No submissions to export.', 'Info', 'info'); return; }
        const fieldLabels = (form.fields || []).map(f => f.label);
        const headers = ['#', 'Submitted By', 'Submitted At', ...fieldLabels];
        const rows = form.submissions.map((s, i) => [i + 1, s.submittedBy, s.submittedAt, ...fieldLabels.map(l => `"${(s.data[l] || '').replace(/"/g, '""')}"`)] );
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${form.name.replace(/\s+/g, '_')}_Submissions.csv`;
        a.click();
        customAlert(`Exported ${form.submissions.length} submission(s) as CSV.`, 'Export Complete', 'success');
    };

    // ---- VIEW INDIVIDUAL SUBMISSION ----
    if (viewSubmission) {
        const form = forms.find(f => f.id === viewFormId);
        const sub = viewSubmission;
        return (
            <div className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <button className="btn btn-outline" onClick={() => setViewSubmission(null)} style={{ padding: '6px 12px' }}>← Back</button>
                    <h3 style={{ color: 'var(--primary)', margin: 0 }}><FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/>Submission Detail</h3>
                </div>
                <div className="ado-form-panel" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                        <div><p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}><strong>Submitted By:</strong> {sub.submittedBy}</p></div>
                        <div><p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}><strong>Date:</strong> {sub.submittedAt}</p></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {(form?.fields || []).map(field => (
                            <div key={field.id} style={{ padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)' }}>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>{fieldIcon(field.type)} {field.label} {field.required && <span style={{ color: 'var(--danger)' }}>*</span>}</p>
                                <p style={{ fontWeight: 500, fontSize: '0.92rem' }}>{sub.data[field.label] || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No response</span>}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ---- VIEW FORM SUBMISSIONS ----
    if (viewFormId) {
        const form = forms.find(f => f.id === viewFormId);
        if (!form) { setViewFormId(null); return null; }
        const subs = form.submissions || [];
        const completionRate = form.fields?.length > 0 ? Math.round(subs.reduce((acc, s) => acc + (Object.values(s.data).filter(Boolean).length / form.fields.length), 0) / Math.max(subs.length, 1) * 100) : 0;

        return (
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="btn btn-outline" onClick={() => setViewFormId(null)} style={{ padding: '6px 12px' }}>← Back</button>
                        <div>
                            <h3 style={{ color: 'var(--primary)', margin: 0 }}><FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/>{form.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '4px 0 0' }}>{form.type} • {form.audience} • <span className={`badge ${form.status === 'Active' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>{form.status}</span></p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline" onClick={() => handleExportCSV(form)} style={{ fontSize: '0.82rem' }}><Download size={14}/> Export CSV</button>
                        <button className={`btn ${form.status === 'Active' ? 'btn-danger' : 'btn-primary'}`} onClick={() => handleToggleStatus(form.id)} style={{ fontSize: '0.82rem' }}>
                            {form.status === 'Active' ? '🔒 Close Form' : '🔓 Reopen Form'}
                        </button>
                    </div>
                </div>

                {form.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 16, padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)' }}>{form.description}</p>}

                {/* Stats */}
                <div className="ado-stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 20 }}>
                    <div className="ado-stat-card">
                        <div className="ado-stat-icon" style={{ background: 'var(--info-light)' }}><FileText size={22} color="var(--info)"/></div>
                        <div className="ado-stat-info"><h4>{subs.length}</h4><p>Responses</p></div>
                    </div>
                    <div className="ado-stat-card">
                        <div className="ado-stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={22} color="var(--success)"/></div>
                        <div className="ado-stat-info"><h4>{completionRate}%</h4><p>Completion Rate</p></div>
                    </div>
                    <div className="ado-stat-card">
                        <div className="ado-stat-icon" style={{ background: 'var(--bg)' }}><ClipboardList size={22} color="var(--text-muted)"/></div>
                        <div className="ado-stat-info"><h4>{(form.fields || []).length}</h4><p>Fields</p></div>
                    </div>
                </div>

                {/* Submissions Table */}
                {subs.length > 0 ? (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead><tr><th>#</th><th>Submitted By</th><th>Submitted At</th>{(form.fields || []).slice(0, 3).map(f => <th key={f.id}>{f.label}</th>)}{(form.fields || []).length > 3 && <th>...</th>}<th>Actions</th></tr></thead>
                            <tbody>{subs.map((s, i) => (
                                <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => setViewSubmission(s)}>
                                    <td>{i + 1}</td>
                                    <td className="fw-600">{s.submittedBy}</td>
                                    <td style={{ fontSize: '0.82rem' }}>{s.submittedAt}</td>
                                    {(form.fields || []).slice(0, 3).map(f => <td key={f.id} style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.data[f.label] || '—'}</td>)}
                                    {(form.fields || []).length > 3 && <td style={{ color: 'var(--text-muted)' }}>+{(form.fields || []).length - 3} more</td>}
                                    <td onClick={e => e.stopPropagation()}><button className="btn-icon" title="View Full Response" onClick={() => setViewSubmission(s)}><Eye size={16}/></button></td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 8 }}>
                        <FileText size={36} opacity={0.2} style={{ marginBottom: 8 }}/>
                        <p>No submissions yet</p>
                    </div>
                )}
            </div>
        );
    }

    // ---- FORM BUILDER ----
    if (showBuilder) {
        return (
            <div className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <button className="btn btn-outline" onClick={() => { setShowBuilder(false); resetBuilder(); }} style={{ padding: '6px 12px' }}>← Back</button>
                    <h3 style={{ color: 'var(--primary)', margin: 0 }}><FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/>{editingFormId ? 'Edit Form' : 'Create New Form'}</h3>
                </div>

                <form onSubmit={handleSaveForm}>
                    {/* Form Metadata */}
                    <div className="ado-form-panel" style={{ marginBottom: 20 }}>
                        <h3>Form Details</h3>
                        <div className="ado-form">
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Form Name *</label><input type="text" className="form-input" required value={formMeta.name} onChange={e => setFormMeta({...formMeta, name: e.target.value})} placeholder="e.g. Annual Survey 2026"/></div>
                                <div className="form-group"><label className="form-label">Form Type *</label>
                                    <select className="form-select" value={formMeta.type} onChange={e => setFormMeta({...formMeta, type: e.target.value})}>
                                        {FORM_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows="2" value={formMeta.description} onChange={e => setFormMeta({...formMeta, description: e.target.value})} placeholder="Brief description of this form's purpose..."></textarea></div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Target Audience *</label>
                                    <select className="form-select" value={formMeta.audience} onChange={e => setFormMeta({...formMeta, audience: e.target.value})}>
                                        {AUDIENCES.map(a => <option key={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div className="form-group"><label className="form-label">Status *</label>
                                    <select className="form-select" value={formMeta.status} onChange={e => setFormMeta({...formMeta, status: e.target.value})}>
                                        <option>Active</option><option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Field Builder */}
                    <div className="ado-form-panel" style={{ marginBottom: 20 }}>
                        <h3>Form Fields ({fields.length})</h3>

                        {/* Add Field Controls */}
                        <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 10 }}>
                                <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Field Type</label>
                                    <select className="form-select" value={newField.type} onChange={e => setNewField({...newField, type: e.target.value})}>
                                        {FIELD_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Label *</label>
                                    <input type="text" className="form-input" value={newField.label} onChange={e => setNewField({...newField, label: e.target.value})} placeholder="e.g. Full Name"/>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Placeholder</label>
                                    <input type="text" className="form-input" value={newField.placeholder} onChange={e => setNewField({...newField, placeholder: e.target.value})} placeholder="Optional hint text"/>
                                </div>
                            </div>
                            {['Dropdown', 'Checkbox', 'Radio'].includes(newField.type) && (
                                <div className="form-group" style={{ marginBottom: 8 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Options (comma-separated) *</label>
                                    <input type="text" className="form-input" value={newField.options} onChange={e => setNewField({...newField, options: e.target.value})} placeholder="e.g. Option 1, Option 2, Option 3"/>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={newField.required} onChange={e => setNewField({...newField, required: e.target.checked})} style={{ accentColor: 'var(--accent)' }}/>
                                    Required field
                                </label>
                                <button type="button" className="btn btn-outline" onClick={handleAddField} style={{ fontSize: '0.82rem' }}><Plus size={14}/> Add Field</button>
                            </div>
                        </div>

                        {/* Field List (Draggable) */}
                        {fields.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {fields.map((field, idx) => (
                                    <div key={field.id}
                                        draggable
                                        onDragStart={() => handleDragStart(idx)}
                                        onDragOver={(e) => handleDragOver(e, idx)}
                                        onDrop={() => handleDrop(idx)}
                                        style={{ padding: '10px 14px', background: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'move', transition: 'all 0.15s ease' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'grab' }}>⠿</span>
                                            <span style={{ fontSize: '0.82rem' }}>{fieldIcon(field.type)}</span>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{field.label} {field.required && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>*</span>}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{field.type}{field.placeholder ? ` — "${field.placeholder}"` : ''}{field.options ? ` — [${field.options}]` : ''}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <button type="button" className="btn-icon" title={field.required ? 'Set Optional' : 'Set Required'} onClick={() => handleToggleRequired(field.id)} style={{ color: field.required ? 'var(--accent)' : 'var(--text-muted)' }}><CheckCircle2 size={16}/></button>
                                            <button type="button" className="btn-icon" title="Remove Field" onClick={() => handleRemoveField(field.id)} style={{ color: 'var(--danger)' }}><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>💡 Drag fields to reorder them</p>
                            </div>
                        ) : (
                            <div style={{ padding: 32, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--text-muted)' }}>
                                <FileText size={32} opacity={0.2} style={{ marginBottom: 8 }}/>
                                <p>No fields added yet. Use the controls above to add form fields.</p>
                            </div>
                        )}
                    </div>

                    {/* Save */}
                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <button type="button" className="btn btn-outline" onClick={() => { setShowBuilder(false); resetBuilder(); }}>Cancel</button>
                        <button type="submit" className="btn btn-primary"><Send size={16}/> {editingFormId ? 'Update Form' : 'Save Form'}</button>
                    </div>
                </form>
            </div>
        );
    }

    // ---- FORMS LIST VIEW ----
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}><FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Custom Forms & Surveys</h3>
                <button className="btn btn-primary" onClick={() => { resetBuilder(); setShowBuilder(true); }}><Plus size={16}/> Create Form</button>
            </div>

            {/* Stats */}
            <div className="ado-stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 20 }}>
                <div className="ado-stat-card">
                    <div className="ado-stat-icon" style={{ background: 'var(--info-light)' }}><FileText size={22} color="var(--info)"/></div>
                    <div className="ado-stat-info"><h4>{forms.length}</h4><p>Total Forms</p></div>
                </div>
                <div className="ado-stat-card">
                    <div className="ado-stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={22} color="var(--success)"/></div>
                    <div className="ado-stat-info"><h4>{forms.filter(f => f.status === 'Active').length}</h4><p>Active</p></div>
                </div>
                <div className="ado-stat-card">
                    <div className="ado-stat-icon" style={{ background: '#FFEBEE' }}><XCircle size={22} color="var(--danger)"/></div>
                    <div className="ado-stat-info"><h4>{forms.filter(f => f.status === 'Closed' || f.status === 'Inactive').length}</h4><p>Closed</p></div>
                </div>
                <div className="ado-stat-card">
                    <div className="ado-stat-icon" style={{ background: 'var(--bg)' }}><ClipboardList size={22} color="var(--text-muted)"/></div>
                    <div className="ado-stat-info"><h4>{forms.reduce((a, f) => a + (f.submissions || []).length, 0)}</h4><p>Total Submissions</p></div>
                </div>
            </div>

            {/* Forms Table */}
            <div className="table-responsive">
                <table className="data-table">
                    <thead><tr><th>Form Name</th><th>Type</th><th>Audience</th><th>Fields</th><th>Submissions</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
                    <tbody>{forms.length > 0 ? forms.map(f => (
                        <tr key={f.id}>
                            <td className="fw-600" style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setViewFormId(f.id)}>{f.name}</td>
                            <td><span className="badge badge-draft">{f.type}</span></td>
                            <td>{f.audience}</td>
                            <td>{(f.fields || []).length}</td>
                            <td><span className="badge badge-info">{(f.submissions || []).length}</span></td>
                            <td><span className={`badge ${f.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{f.status}</span></td>
                            <td style={{ fontSize: '0.82rem' }}>{f.createdAt}</td>
                            <td>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button className="btn-icon" title="View Submissions" onClick={() => setViewFormId(f.id)}><Eye size={16}/></button>
                                    <button className="btn-icon" title="Edit Form" onClick={() => handleEditForm(f)}><Edit3 size={16}/></button>
                                    <button className="btn-icon" title="Export CSV" onClick={() => handleExportCSV(f)}><Download size={16}/></button>
                                    <button className="btn-icon" title={f.status === 'Active' ? 'Close Form' : 'Reopen Form'} onClick={() => handleToggleStatus(f.id)}><ToggleRight size={16} color={f.status === 'Active' ? 'var(--success)' : 'var(--text-muted)'}/></button>
                                    <button className="btn-icon" title="Delete Form" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteForm(f)}><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                            <FileText size={36} opacity={0.2} style={{ marginBottom: 8 }}/>
                            <p style={{ margin: '8px 0 0' }}>No forms created yet. Click "Create Form" to get started.</p>
                        </td></tr>
                    )}</tbody>
                </table>
            </div>
        </div>
    );
}

// ======================== DOWNLOADS ========================
function DownloadsTab() {
    const defaultDocs = [
        { id: 1, title: 'Syllabus Class X (2026-27)', description: 'Updated CBSE syllabus for all subjects', category: 'Syllabus', audience: 'Students', filename: 'Syllabus_Class10_2026.pdf', size: '2.4 MB', uploadDate: '2026-03-20', publishDate: '2026-03-20', expiryDate: '2027-03-31', dls: 145, version: 1 },
        { id: 2, title: 'Annual Holiday Calendar 2026', description: 'List of all school holidays and vacations', category: 'Circular', audience: 'All Users', filename: 'Holiday_Calendar_2026.pdf', size: '1.1 MB', uploadDate: '2026-01-05', publishDate: '2026-01-05', expiryDate: '2026-12-31', dls: 890, version: 2 },
        { id: 3, title: 'Bus Route Map & Timings', description: 'Transport routes for the new academic session', category: 'Other', audience: 'Parents', filename: 'Transport_Route_Map.png', size: '4.5 MB', uploadDate: '2026-02-15', publishDate: '2026-02-15', expiryDate: '', dls: 320, version: 1 },
        { id: 4, title: 'Medical Leave Form', description: 'Standard form to request medical leave', category: 'Form', audience: 'Staff', filename: 'Medical_Leave_Form.docx', size: '0.5 MB', uploadDate: '2026-04-01', publishDate: '2026-04-01', expiryDate: '', dls: 45, version: 1 }
    ];
    
    const CATEGORIES = ['All', 'Circular', 'Form', 'Syllabus', 'Result', 'Timetable', 'Other'];
    const AUDIENCES = ['All Users', 'Students', 'Parents', 'Staff'];

    const [docs, setDocs] = useLocalStorage('addons_downloads_v2', defaultDocs);
    const [showUpload, setShowUpload] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    
    // Upload form state
    const [form, setForm] = useState({ title: '', description: '', category: 'Circular', audience: 'All Users', publishDate: '', expiryDate: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingDocId, setEditingDocId] = useState(null);

    const todayStr = new Date().toISOString().split('T')[0];

    const resetForm = () => {
        setForm({ title: '', description: '', category: 'Circular', audience: 'All Users', publishDate: todayStr, expiryDate: '' });
        setSelectedFile(null);
        setEditingDocId(null);
    };

    // Filter & Search docs
    let filteredDocs = docs;
    if (activeCategory !== 'All') {
        filteredDocs = filteredDocs.filter(d => d.category === activeCategory);
    }
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredDocs = filteredDocs.filter(d => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.filename.toLowerCase().includes(q));
    }

    // Sort by publish date desc
    filteredDocs.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

    const handleDownload = (d) => {
        // Increment download count
        setDocs(prev => prev.map(item => item.id === d.id ? { ...item, dls: item.dls + 1 } : item));
        
        // Mock download
        const content = `Mock Download for System\n\nTitle: ${d.title}\nDescription: ${d.description}\nCategory: ${d.category}\nAudience: ${d.audience}\nVersion: v${d.version}`; 
        const blob = new Blob([content], {type: 'text/plain'}); 
        const a = document.createElement('a'); 
        a.href = URL.createObjectURL(blob); 
        a.download = d.filename.replace(/\.(pdf|png|docx|xlsx|jpg)$/, '.txt'); 
        a.click(); 
    };

    const handleDelete = async (doc) => { 
        if (await customConfirm(`Delete document "${doc.title}"?`)) {
            setDocs(prev => prev.filter(d => d.id !== doc.id)); 
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { await customAlert('Please enter a document title.', 'Validation', 'error'); return; }
        
        if (editingDocId) {
            // Update existing (version replacement if new file)
            setDocs(prev => prev.map(d => {
                if (d.id === editingDocId) {
                    const isNewFile = selectedFile !== null;
                    return {
                        ...d,
                        ...form,
                        filename: isNewFile ? selectedFile.name : d.filename,
                        size: isNewFile ? (selectedFile.size / 1024 / 1024).toFixed(1) + ' MB' : d.size,
                        version: isNewFile ? d.version + 1 : d.version,
                        uploadDate: isNewFile ? todayStr : d.uploadDate
                    };
                }
                return d;
            }));
            await customAlert('Document updated successfully!', 'Updated', 'success');
        } else {
            // New upload
            if (!selectedFile) { await customAlert('Please select a file to upload.', 'Validation', 'error'); return; }
            const newDoc = {
                id: Date.now(),
                ...form,
                filename: selectedFile.name,
                size: (selectedFile.size / 1024 / 1024).toFixed(1) + ' MB',
                uploadDate: todayStr,
                publishDate: form.publishDate || todayStr,
                dls: 0,
                version: 1
            };
            setDocs(prev => [newDoc, ...prev]);
            await customAlert(`"${form.title}" uploaded and published successfully!`, 'Uploaded', 'success');
        }
        setShowUpload(false);
        resetForm();
    };

    const handleEdit = (doc) => {
        setForm({ title: doc.title, description: doc.description, category: doc.category, audience: doc.audience, publishDate: doc.publishDate, expiryDate: doc.expiryDate || '' });
        setSelectedFile(null); // File is optional on edit
        setEditingDocId(doc.id);
        setShowUpload(true);
    };

    const isExpired = (expiryStr) => expiryStr && new Date(expiryStr) < new Date(todayStr);
    const isScheduled = (publishStr) => publishStr && new Date(publishStr) > new Date(todayStr);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}><FolderOpen size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Resource Downloads</h3>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowUpload(true); }}><UploadCloud size={16}/> Upload Document</button>
            </div>

            {/* Upload Modal / Form */}
            {showUpload && (
                <div className="ado-form-panel" style={{ marginBottom: 24, border: '2px solid var(--accent-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ margin: 0 }}><UploadCloud size={18}/> {editingDocId ? 'Update Document' : 'Upload New Document'}</h3>
                        <button className="btn-icon" onClick={() => setShowUpload(false)}><XCircle size={18}/></button>
                    </div>
                    
                    <form className="ado-form" onSubmit={handleUploadSubmit}>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 2 }}>
                                <label className="form-label">Document Title *</label>
                                <input type="text" className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Physics Syllabus Term 1" />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Category *</label>
                                <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input type="text" className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description of the document contents..." />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Target Audience *</label>
                                <select className="form-select" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})}>
                                    {AUDIENCES.map(a => <option key={a}>{a}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Publish Date</label>
                                <input type="date" className="form-input" value={form.publishDate} onChange={e => setForm({...form, publishDate: e.target.value})} />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Leave blank for immediate</span>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Expiry Date (Optional)</label>
                                <input type="date" className="form-input" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auto-hides after this date</span>
                            </div>
                        </div>

                        <div className="form-group" style={{ border: '1px dashed var(--border)', padding: 20, borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--bg)' }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>{editingDocId ? 'Upload New Version (Optional)' : 'Select File (PDF, DOCX, XLSX, JPG, PNG) *'}</label>
                            <input type="file" id="doc-upload" style={{ display: 'none' }} onChange={e => { if(e.target.files[0]) setSelectedFile(e.target.files[0]); }} />
                            <button type="button" className="btn btn-outline" onClick={() => document.getElementById('doc-upload').click()}><UploadCloud size={16}/> {selectedFile ? 'Change File' : 'Browse Files'}</button>
                            {selectedFile && <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--success)' }}><CheckCircle2 size={14}/> Selected: {selectedFile.name} ({(selectedFile.size/1024/1024).toFixed(2)} MB)</p>}
                            {!selectedFile && editingDocId && <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Current version will be kept if no new file is selected.</p>}
                        </div>

                        <div className="form-actions" style={{ justifyContent: 'flex-end', display: 'flex', gap: 10 }}>
                            <button type="button" className="btn btn-outline" onClick={() => setShowUpload(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary"><CheckCircle2 size={16}/> {editingDocId ? 'Save Changes' : 'Publish Document'}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Controls Bar */}
            <div className="ado-form-panel" style={{ padding: 14, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                {/* Category Tabs */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setActiveCategory(c)} className={`btn ${activeCategory === c ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 12px', fontSize: '0.82rem', borderRadius: 20, whiteSpace: 'nowrap' }}>
                            {c}
                        </button>
                    ))}
                </div>
                {/* Search */}
                <div className="search-box" style={{ margin: 0, minWidth: 250 }}>
                    <Search size={16}/>
                    <input type="text" placeholder="Search title or description..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
            </div>

            {/* Documents List */}
            <div className="table-responsive">
                <table className="data-table">
                    <thead><tr><th>Document</th><th>Category / Audience</th><th>Status</th><th>Publish / Expiry</th><th>Ver</th><th>Downloads</th><th>Actions</th></tr></thead>
                    <tbody>{filteredDocs.length > 0 ? filteredDocs.map(d => {
                        const expired = isExpired(d.expiryDate);
                        const scheduled = isScheduled(d.publishDate);
                        
                        return (
                            <tr key={d.id} style={{ opacity: expired ? 0.6 : 1 }}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <div style={{ padding: 8, background: 'var(--bg)', borderRadius: 8, color: 'var(--primary)' }}><FileText size={24}/></div>
                                        <div>
                                            <p className="fw-600" style={{ margin: '0 0 2px', color: expired ? 'var(--text-muted)' : 'var(--text)' }}>{d.title}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 4px', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.description}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontFamily: 'monospace' }}>{d.filename} • {d.size}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <span className="badge badge-draft" style={{ width: 'fit-content' }}>{d.category}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><Users size={12} style={{ display:'inline', verticalAlign:'middle' }}/> {d.audience}</span>
                                    </div>
                                </td>
                                <td>
                                    {expired ? <span className="badge badge-danger">Expired</span> : 
                                     scheduled ? <span className="badge badge-warning">Scheduled</span> : 
                                     <span className="badge badge-success">Active</span>}
                                </td>
                                <td style={{ fontSize: '0.82rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <span style={{ color: scheduled ? 'var(--warning)' : 'var(--success)' }}>Pub: {d.publishDate}</span>
                                        {d.expiryDate && <span style={{ color: expired ? 'var(--danger)' : 'var(--text-muted)' }}>Exp: {d.expiryDate}</span>}
                                    </div>
                                </td>
                                <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>v{d.version}</td>
                                <td><span className="badge badge-info"><Download size={12}/> {d.dls}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn-icon" title="Download" onClick={() => handleDownload(d)} disabled={scheduled}><Download size={16}/></button>
                                        <button className="btn-icon" title="Edit / New Version" onClick={() => handleEdit(d)}><Edit3 size={16}/></button>
                                        <button className="btn-icon" title="Delete" onClick={() => handleDelete(d)} style={{ color: 'var(--danger)' }}><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    }) : (
                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                            <FolderOpen size={36} opacity={0.2} style={{ marginBottom: 8 }}/>
                            <p style={{ margin: '8px 0 0' }}>No documents found matching your criteria.</p>
                        </td></tr>
                    )}</tbody>
                </table>
            </div>
        </div>
    );
}

// ======================== CERTIFICATES ========================
// ======================== REGISTRATION ========================
function RegistrationTab() {
    const defaultEvents = [
        { id: 1, title: 'Summer Coding Camp', description: 'A 2-week intensive coding bootcamp for beginners.', type: 'Workshop', deadline: '2026-05-01', capacity: 50, audience: 'Students', status: 'Open', createdAt: '2026-03-01',
            fields: [
                { id: 1, type: 'Text', label: 'Student Name', placeholder: '', required: true, options: '' },
                { id: 2, type: 'Dropdown', label: 'Programming Experience', placeholder: '', required: true, options: 'None,Beginner,Intermediate' }
            ],
            registrants: [
                { id: 101, submittedBy: 'Aarav Sharma', submittedAt: '2026-03-20 09:15 AM', status: 'Registered', data: { 'Student Name': 'Aarav Sharma', 'Programming Experience': 'None' } }
            ]
        },
        { id: 2, title: 'Inter-School Debate', description: 'Annual debate competition.', type: 'Event', deadline: '2026-04-10', capacity: 2, audience: 'Students', status: 'Closed', createdAt: '2026-02-15',
            fields: [
                { id: 1, type: 'Text', label: 'Participant Name', placeholder: '', required: true, options: '' }
            ],
            registrants: [
                { id: 201, submittedBy: 'Ananya Verma', submittedAt: '2026-03-10 10:00 AM', status: 'Registered', data: { 'Participant Name': 'Ananya Verma' } },
                { id: 202, submittedBy: 'Karan Mehra', submittedAt: '2026-03-11 11:30 AM', status: 'Registered', data: { 'Participant Name': 'Karan Mehra' } },
                { id: 203, submittedBy: 'Sneha Reddy', submittedAt: '2026-03-12 02:15 PM', status: 'Waitlisted', data: { 'Participant Name': 'Sneha Reddy' } }
            ]
        }
    ];

    const EVENT_TYPES = ['Event', 'Workshop', 'Activity', 'General'];
    const AUDIENCES = ['All Users', 'Students', 'Parents', 'Staff'];
    const FIELD_TYPES = ['Text', 'Number', 'Email', 'Dropdown', 'Checkbox', 'Radio', 'Date', 'File Upload', 'Paragraph'];

    const [events, setEvents] = useLocalStorage('addons_registrations_v2', defaultEvents);
    const [showBuilder, setShowBuilder] = useState(false);
    const [viewEventId, setViewEventId] = useState(null);
    const [editingEventId, setEditingEventId] = useState(null);
    
    // Builder State
    const [eventMeta, setEventMeta] = useState({ title: '', description: '', type: 'Event', deadline: '', capacity: '', audience: 'All Users' });
    const [fields, setFields] = useState([]);
    const [newField, setNewField] = useState({ type: 'Text', label: '', placeholder: '', required: false, options: '' });
    const [dragIdx, setDragIdx] = useState(null);

    const resetBuilder = () => {
        setEventMeta({ title: '', description: '', type: 'Event', deadline: '', capacity: '', audience: 'All Users' });
        setFields([]);
        setEditingEventId(null);
        setNewField({ type: 'Text', label: '', placeholder: '', required: false, options: '' });
    };

    const fieldIcon = (type) => {
        const icons = { 'Text': '✏️', 'Number': '#️⃣', 'Email': '📧', 'Dropdown': '📋', 'Checkbox': '☑️', 'Radio': '🔘', 'Date': '📅', 'File Upload': '📎', 'Paragraph': '📝' };
        return icons[type] || '📄';
    };

    const handleAddField = () => {
        if (!newField.label.trim()) { customAlert('Please enter a field label.', 'Required', 'error'); return; }
        if (['Dropdown', 'Checkbox', 'Radio'].includes(newField.type) && !newField.options.trim()) { customAlert('Please enter options (comma-separated).', 'Required', 'error'); return; }
        setFields(prev => [...prev, { ...newField, id: Date.now(), label: newField.label.trim(), placeholder: newField.placeholder.trim(), options: newField.options.trim() }]);
        setNewField({ type: 'Text', label: '', placeholder: '', required: false, options: '' });
    };
    const handleRemoveField = (id) => setFields(prev => prev.filter(f => f.id !== id));
    const handleToggleRequired = (id) => setFields(prev => prev.map(f => f.id === id ? { ...f, required: !f.required } : f));
    
    const handleDragStart = (idx) => setDragIdx(idx);
    const handleDragOver = (e, idx) => { e.preventDefault(); };
    const handleDrop = (idx) => {
        if (dragIdx === null || dragIdx === idx) return;
        const newFields = [...fields];
        const [moved] = newFields.splice(dragIdx, 1);
        newFields.splice(idx, 0, moved);
        setFields(newFields);
        setDragIdx(null);
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        if (!eventMeta.title.trim()) { await customAlert('Please enter the event title.', 'Validation', 'error'); return; }
        
        let status = 'Open';
        if (eventMeta.capacity) {
            const cap = parseInt(eventMeta.capacity);
            if (editingEventId) {
                const existing = events.find(ev => ev.id === editingEventId);
                const regCount = existing.registrants.filter(r => r.status === 'Registered').length;
                if (regCount >= cap) status = 'Closed';
            }
        }

        if (editingEventId) {
            setEvents(prev => prev.map(ev => ev.id === editingEventId ? { ...ev, ...eventMeta, title: eventMeta.title.trim(), capacity: eventMeta.capacity ? parseInt(eventMeta.capacity) : null, fields, status: ev.status === 'Closed' && status === 'Open' ? 'Open' : (status === 'Closed' ? 'Closed' : ev.status) } : ev));
            await customAlert(`Event updated successfully!`, 'Updated', 'success');
        } else {
            const newEvent = { id: Date.now(), ...eventMeta, title: eventMeta.title.trim(), capacity: eventMeta.capacity ? parseInt(eventMeta.capacity) : null, fields, status: 'Open', createdAt: new Date().toISOString().split('T')[0], registrants: [] };
            setEvents(prev => [newEvent, ...prev]);
            await customAlert(`Event "${eventMeta.title}" created and published!`, 'Created', 'success');
        }
        resetBuilder();
        setShowBuilder(false);
    };

    const handleEditEvent = (ev) => {
        setEditingEventId(ev.id);
        setEventMeta({ title: ev.title, description: ev.description || '', type: ev.type, deadline: ev.deadline || '', capacity: ev.capacity || '', audience: ev.audience });
        setFields([...(ev.fields || [])]);
        setShowBuilder(true);
        setViewEventId(null);
    };

    const handleDeleteEvent = async (ev) => {
        if (await customConfirm(`Delete event "${ev.title}" and all its registrations? This cannot be undone.`)) {
            setEvents(prev => prev.filter(e => e.id !== ev.id));
            if (viewEventId === ev.id) setViewEventId(null);
        }
    };

    const handleToggleStatus = (id) => {
        setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, status: ev.status === 'Open' ? 'Closed' : 'Open' } : ev));
    };

    const handleExportCSV = (ev) => {
        if (!ev.registrants || ev.registrants.length === 0) { customAlert('No registrations to export.', 'Info', 'info'); return; }
        const fieldLabels = (ev.fields || []).map(f => f.label);
        const headers = ['#', 'Name', 'Date', 'Status', ...fieldLabels];
        const rows = ev.registrants.map((r, i) => [i + 1, `"${r.submittedBy}"`, r.submittedAt, r.status, ...fieldLabels.map(l => `"${(r.data[l] || '').replace(/"/g, '""')}"`)] );
        const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${ev.title.replace(/\s+/g, '_')}_Registrations.csv`;
        a.click();
        customAlert(`Exported ${ev.registrants.length} participant(s) as CSV.`, 'Export Complete', 'success');
    };

    const handleCopyLink = async (ev) => {
        const link = `${window.location.origin}/register/${ev.id}`;
        try {
            await navigator.clipboard.writeText(link);
            await customAlert(`Registration link for "${ev.title}" copied to clipboard!`, 'Copied', 'success');
        } catch (err) {
            await customAlert(`Failed to copy link: ${link}`, 'Error', 'error');
        }
    };

    const simulateRegistration = async (evId) => {
        const ev = events.find(e => e.id === evId);
        const name = prompt(`Simulate registration for "${ev.title}"\n\nEnter participant name:`);
        if(!name) return;
        
        let status = 'Registered';
        const currentRegs = ev.registrants.filter(r => r.status === 'Registered').length;
        if (ev.capacity && currentRegs >= ev.capacity) {
            status = 'Waitlisted';
            await customAlert(`Capacity reached. "${name}" has been added to the waitlist.`, 'Waitlisted', 'warning');
        } else {
            if (ev.capacity && (currentRegs + 1) >= ev.capacity) {
                 await customAlert(`Registration successful. Max capacity reached! Event is now Auto-Closed.`, 'Success', 'success');
                 setEvents(prev => prev.map(e => e.id === evId ? { ...e, status: 'Closed' } : e));
            } else {
                 await customAlert(`Registration successful for "${name}". Confirmation sent.`, 'Success', 'success');
            }
        }

        const newReg = { id: Date.now(), submittedBy: name, submittedAt: new Date().toLocaleString(), status, data: {} };
        setEvents(prev => prev.map(e => e.id === evId ? { ...e, registrants: [...e.registrants, newReg] } : e));
    };

    // ---- PARTICIPANTS VIEW ----
    if (viewEventId) {
        const ev = events.find(e => e.id === viewEventId);
        if (!ev) { setViewEventId(null); return null; }
        const regs = ev.registrants || [];
        const registered = regs.filter(r => r.status === 'Registered');
        const waitlisted = regs.filter(r => r.status === 'Waitlisted');

        return (
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="btn btn-outline" onClick={() => setViewEventId(null)} style={{ padding: '6px 12px' }}>← Back</button>
                        <div>
                            <h3 style={{ color: 'var(--primary)', margin: 0 }}><ClipboardList size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/>{ev.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '4px 0 0' }}>{ev.type} • Deadline: {ev.deadline || 'None'} • <span className={`badge ${ev.status === 'Open' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>{ev.status}</span></p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline" onClick={() => simulateRegistration(ev.id)} style={{ fontSize: '0.82rem' }}><Plus size={14}/> Simulate Reg</button>
                        <button className="btn btn-outline" onClick={() => handleExportCSV(ev)} style={{ fontSize: '0.82rem' }}><Download size={14}/> Export CSV</button>
                    </div>
                </div>

                <div className="ado-stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 20 }}>
                    <div className="ado-stat-card">
                        <div className="ado-stat-icon" style={{ background: 'var(--info-light)' }}><Users size={22} color="var(--info)"/></div>
                        <div className="ado-stat-info"><h4>{registered.length}</h4><p>Registered</p></div>
                    </div>
                    {ev.capacity && (
                        <div className="ado-stat-card">
                            <div className="ado-stat-icon" style={{ background: 'var(--bg)' }}><CheckCircle2 size={22} color="var(--text-muted)"/></div>
                            <div className="ado-stat-info"><h4>{ev.capacity}</h4><p>Capacity Limit</p></div>
                        </div>
                    )}
                    <div className="ado-stat-card">
                        <div className="ado-stat-icon" style={{ background: 'var(--warning-light)' }}><Clock size={22} color="var(--warning)"/></div>
                        <div className="ado-stat-info"><h4>{waitlisted.length}</h4><p>Waitlisted</p></div>
                    </div>
                </div>

                {regs.length > 0 ? (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead><tr><th>#</th><th>Participant Name</th><th>Registration Date</th><th>Status</th>{(ev.fields || []).slice(0, 2).map(f => <th key={f.id}>{f.label}</th>)}</tr></thead>
                            <tbody>{regs.map((r, i) => (
                                <tr key={r.id}>
                                    <td>{i + 1}</td>
                                    <td className="fw-600">{r.submittedBy}</td>
                                    <td style={{ fontSize: '0.82rem' }}>{r.submittedAt}</td>
                                    <td><span className={`badge ${r.status === 'Registered' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
                                    {(ev.fields || []).slice(0, 2).map(f => <td key={f.id} style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.data[f.label] || '—'}</td>)}
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 8 }}>
                        <Users size={36} opacity={0.2} style={{ marginBottom: 8 }}/>
                        <p>No participants registered yet</p>
                    </div>
                )}
            </div>
        );
    }

    // ---- EVENT BUILDER ----
    if (showBuilder) {
        return (
            <div className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <button className="btn btn-outline" onClick={() => { setShowBuilder(false); resetBuilder(); }} style={{ padding: '6px 12px' }}>← Back</button>
                    <h3 style={{ color: 'var(--primary)', margin: 0 }}><ClipboardList size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/>{editingEventId ? 'Edit Event' : 'Create Registration Event'}</h3>
                </div>

                <form onSubmit={handleSaveEvent}>
                    <div className="ado-form-panel" style={{ marginBottom: 20 }}>
                        <h3>Event Details</h3>
                        <div className="ado-form">
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 2 }}><label className="form-label">Event Title *</label><input type="text" className="form-input" required value={eventMeta.title} onChange={e => setEventMeta({...eventMeta, title: e.target.value})} placeholder="e.g. Science Fair 2026"/></div>
                                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Type *</label>
                                    <select className="form-select" value={eventMeta.type} onChange={e => setEventMeta({...eventMeta, type: e.target.value})}>
                                        {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows="2" value={eventMeta.description} onChange={e => setEventMeta({...eventMeta, description: e.target.value})} placeholder="Details about the event..."></textarea></div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Registration Deadline</label><input type="date" className="form-input" value={eventMeta.deadline} onChange={e => setEventMeta({...eventMeta, deadline: e.target.value})} /></div>
                                <div className="form-group"><label className="form-label">Max Participants (Capacity)</label><input type="number" min="1" className="form-input" value={eventMeta.capacity} onChange={e => setEventMeta({...eventMeta, capacity: e.target.value})} placeholder="Leave blank for unlimited" /></div>
                                <div className="form-group"><label className="form-label">Target Audience *</label>
                                    <select className="form-select" value={eventMeta.audience} onChange={e => setEventMeta({...eventMeta, audience: e.target.value})}>
                                        {AUDIENCES.map(a => <option key={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ado-form-panel" style={{ marginBottom: 20 }}>
                        <h3>Registration Form Fields ({fields.length})</h3>
                        <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 10 }}>
                                <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Field Type</label>
                                    <select className="form-select" value={newField.type} onChange={e => setNewField({...newField, type: e.target.value})}>
                                        {FIELD_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Label *</label><input type="text" className="form-input" value={newField.label} onChange={e => setNewField({...newField, label: e.target.value})} placeholder="e.g. T-Shirt Size"/></div>
                                <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Placeholder</label><input type="text" className="form-input" value={newField.placeholder} onChange={e => setNewField({...newField, placeholder: e.target.value})} /></div>
                            </div>
                            {['Dropdown', 'Checkbox', 'Radio'].includes(newField.type) && (
                                <div className="form-group" style={{ marginBottom: 8 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Options (comma-separated) *</label><input type="text" className="form-input" value={newField.options} onChange={e => setNewField({...newField, options: e.target.value})} placeholder="Small, Medium, Large"/></div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', cursor: 'pointer' }}><input type="checkbox" checked={newField.required} onChange={e => setNewField({...newField, required: e.target.checked})} style={{ accentColor: 'var(--accent)' }}/>Required field</label>
                                <button type="button" className="btn btn-outline" onClick={handleAddField} style={{ fontSize: '0.82rem' }}><Plus size={14}/> Add Field</button>
                            </div>
                        </div>

                        {fields.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {fields.map((field, idx) => (
                                    <div key={field.id} draggable onDragStart={() => handleDragStart(idx)} onDragOver={(e) => handleDragOver(e, idx)} onDrop={() => handleDrop(idx)} style={{ padding: '10px 14px', background: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'move' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'grab' }}>⠿</span><span style={{ fontSize: '0.82rem' }}>{fieldIcon(field.type)}</span>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{field.label} {field.required && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>*</span>}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{field.type}{field.options ? ` — [${field.options}]` : ''}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <button type="button" className="btn-icon" onClick={() => handleToggleRequired(field.id)} style={{ color: field.required ? 'var(--accent)' : 'var(--text-muted)' }}><CheckCircle2 size={16}/></button>
                                            <button type="button" className="btn-icon" onClick={() => handleRemoveField(field.id)} style={{ color: 'var(--danger)' }}><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (<div style={{ padding: 32, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--text-muted)' }}><ClipboardList size={32} opacity={0.2} style={{ marginBottom: 8 }}/><p>No fields added.</p></div>)}
                    </div>
                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <button type="button" className="btn btn-outline" onClick={() => setShowBuilder(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary"><Send size={16}/> {editingEventId ? 'Update Event' : 'Publish Event'}</button>
                    </div>
                </form>
            </div>
        );
    }

    // ---- LIST VIEW ----
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--primary)' }}><ClipboardList size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Online Registrations</h3>
                <button className="btn btn-primary" onClick={() => { resetBuilder(); setShowBuilder(true); }}><PlusCircle size={16}/> New Registration Event</button>
            </div>
            
            <div className="ado-stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle2 size={24} color="var(--success)"/></div>
                    <div className="ado-stat-info"><h4>{events.filter(e => e.status === 'Open').length}</h4><p>Active Events</p></div></div>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--info-light)' }}><Users size={24} color="var(--info)"/></div>
                    <div className="ado-stat-info"><h4>{events.reduce((acc, ev) => acc + (ev.registrants||[]).filter(r => r.status === 'Registered').length, 0)}</h4><p>Total Participants</p></div></div>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--warning-light)' }}><Clock size={24} color="var(--warning)"/></div>
                    <div className="ado-stat-info"><h4>{events.reduce((acc, ev) => acc + (ev.registrants||[]).filter(r => r.status === 'Waitlisted').length, 0)}</h4><p>Waitlisted</p></div></div>
            </div>

            <div className="table-responsive">
                <table className="data-table"><thead><tr><th>Event Name</th><th>Type</th><th>Deadline</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {events.length > 0 ? events.map(ev => {
                            const registered = (ev.registrants || []).filter(r => r.status === 'Registered').length;
                            const waitlisted = (ev.registrants || []).filter(r => r.status === 'Waitlisted').length;
                            
                            return (
                                <tr key={ev.id}>
                                    <td className="fw-600" style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setViewEventId(ev.id)}>{ev.title}</td>
                                    <td><span className="badge badge-draft">{ev.type}</span></td>
                                    <td style={{ fontSize: '0.85rem' }}>{ev.deadline || '—'}</td>
                                    <td style={{ fontSize: '0.85rem' }}>
                                        {registered} {ev.capacity ? `/ ${ev.capacity}` : ''}
                                        {waitlisted > 0 && <span style={{ color: 'var(--warning)', marginLeft: 4 }}>(+{waitlisted} wait)</span>}
                                    </td>
                                    <td><span className={`badge ${ev.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>{ev.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="btn-icon" title="View list" onClick={() => setViewEventId(ev.id)}><Users size={16}/></button>
                                            <button className="btn-icon" title="Edit Event" onClick={() => handleEditEvent(ev)}><Edit3 size={16}/></button>
                                            <button className="btn-icon" title="Copy Link" onClick={() => handleCopyLink(ev)}><LinkIcon size={16}/></button>
                                            <button className="btn-icon" title={ev.status === 'Open' ? 'Close Registration' : 'Open Registration'} onClick={() => handleToggleStatus(ev.id)}><ToggleRight size={16} color={ev.status === 'Open' ? 'var(--success)' : 'var(--text-muted)'}/></button>
                                            <button className="btn-icon" title="Delete" onClick={() => handleDeleteEvent(ev)} style={{ color: 'var(--danger)' }}><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                                <ClipboardList size={36} opacity={0.2} style={{ marginBottom: 8 }}/>
                                <p>No registration events created yet.</p>
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ======================== REPORTS ========================
function ReportsTab() {
    const REPORTS = [
        { id: 'visitor', name: 'Visitor Report', fields: ['Visitor Name', 'Purpose', 'Time In', 'Time Out'] },
        { id: 'gallery', name: 'Gallery Report', fields: ['Album Name', 'Category', 'Images Count', 'Created At'] },
        { id: 'alumni', name: 'Alumni Report', fields: ['Name', 'Batch', 'Course', 'Profession', 'Status'] },
        { id: 'birthday', name: 'Birthday Report', fields: ['Student Name', 'Class-Sec', 'DOB'] },
        { id: 'message', name: 'Message Report', fields: ['Title', 'Priority', 'Audience', 'Sent At'] },
        { id: 'form', name: 'Form Submissions', fields: ['Form Name', 'Audience', 'Total Subs', 'Status'] },
        { id: 'downloads', name: 'Downloads Report', fields: ['Document', 'Category', 'Downloads', 'Status'] },
        { id: 'registration', name: 'Registration Report', fields: ['Event Name', 'Type', 'Capacity', 'Registered', 'Status'] }
    ];

    const [selectedReport, setSelectedReport] = useState(REPORTS[0].id);
    const [dateRange, setDateRange] = useState('All Time');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [classFilter, setClassFilter] = useState('All');
    
    const [reportData, setReportData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setReportData(null);
        
        setTimeout(() => {
            let data = [];
            
            try {
                if (selectedReport === 'alumni') {
                    const localData = JSON.parse(localStorage.getItem('addons_alumni_v2') || '[]');
                    data = localData.map(a => ({ Name: a.name, Batch: a.batch, Course: a.course, Profession: a.profession, Status: a.status }));
                } 
                else if (selectedReport === 'gallery') {
                    const localData = JSON.parse(localStorage.getItem('addons_gallery_v2') || '[]');
                    data = localData.map(a => ({ 'Album Name': a.name, Category: a.category, 'Images Count': (a.images||[]).length, 'Created At': a.createdAt }));
                }
                else if (selectedReport === 'message') {
                    const localData = JSON.parse(localStorage.getItem('addons_messages_v2') || '[]');
                    data = localData.map(m => ({ Title: m.subject, Priority: m.priority, Audience: m.audience, 'Sent At': m.timestamp }));
                }
                else if (selectedReport === 'form') {
                    const localData = JSON.parse(localStorage.getItem('addons_forms_v2') || '[]');
                    data = localData.map(f => ({ 'Form Name': f.name, Audience: f.audience, 'Total Subs': (f.submissions||[]).length, Status: f.status }));
                }
                else if (selectedReport === 'downloads') {
                    const localData = JSON.parse(localStorage.getItem('addons_downloads_v2') || '[]');
                    data = localData.map(d => ({ Document: d.title, Category: d.category, Downloads: d.dls, Status: (d.expiryDate && new Date(d.expiryDate) < new Date()) ? 'Expired' : 'Active' }));
                }
                else if (selectedReport === 'registration') {
                    const localData = JSON.parse(localStorage.getItem('addons_registrations_v2') || '[]');
                    data = localData.map(e => ({ 'Event Name': e.title, Type: e.type, Capacity: e.capacity || 'Unlimited', Registered: (e.registrants||[]).filter(r=>r.status==='Registered').length, Status: e.status }));
                }
                else if (selectedReport === 'birthday') {
                    const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');
                    data = localData.filter(s => s.dateOfBirth).map(s => ({ 'Student Name': s.name, 'Class-Sec': s.class, DOB: s.dateOfBirth }));
                    if (data.length === 0) data = [{ 'Student Name': 'Aarav Sharma', 'Class-Sec': 'Class 10-A', DOB: '2010-04-15' }];
                }
                else if (selectedReport === 'visitor') {
                    data = [
                        { 'Visitor Name': 'Rajesh Kumar', Purpose: 'Meeting Principal', 'Time In': '09:00 AM', 'Time Out': '10:15 AM' },
                        { 'Visitor Name': 'Sunita Singh', Purpose: 'Admission Inquiry', 'Time In': '10:30 AM', 'Time Out': '11:00 AM' }
                    ];
                }
            } catch (e) {
                console.error(e);
            }

            if (data.length === 0) {
                data = [{ Note: 'No data available matching the selected criteria.' }];
            }

            setReportData({
                meta: REPORTS.find(r => r.id === selectedReport),
                rows: data
            });
            setIsGenerating(false);
            
            customAlert(`Report "${REPORTS.find(r => r.id === selectedReport).name}" generated successfully.`, 'Success', 'success');
        }, 600);
    };

    const handleExport = (format) => {
        if (!reportData || !reportData.rows || reportData.rows.length === 0) return;
        
        const isPdf = format === 'PDF';
        
        const headers = Object.keys(reportData.rows[0]);
        const csvRows = reportData.rows.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','));
        const csv = [headers.join(','), ...csvRows].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${reportData.meta.name.replace(/\s+/g, '_')}_Export.${isPdf ? 'pdf' : 'csv'}`;
        a.click();
        
        customAlert(`Exported as ${isPdf ? 'PDF' : 'Excel/CSV'}.`, 'Export Complete', 'success');
    };

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><BarChart3 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Add-On Reports Engine</h3>
            
            <div className="ado-form-panel" style={{ marginBottom: 24 }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Report Configuration</h4>
                <div className="ado-form">
                    <div className="form-row">
                        <div className="form-group" style={{ flex: 2 }}>
                            <label className="form-label">Select Report Template *</label>
                            <select className="form-select" value={selectedReport} onChange={e => { setSelectedReport(e.target.value); setReportData(null); }}>
                                {REPORTS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Date Range</label>
                            <select className="form-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                                <option>All Time</option><option>Today</option><option>This Week</option><option>This Month</option><option>Last 30 Days</option><option>This Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Category Filter</label>
                            <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option>All</option><option>Specific Category...</option></select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All</option><option>Active</option><option>Inactive / Closed</option></select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Class (Optional)</label>
                            <select className="form-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}><option>All</option><option>Class 1</option><option>Class 10</option></select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : <><FileText size={16}/> Generate Report Preview</>}
                        </button>
                    </div>
                </div>
            </div>

            {reportData ? (
                <div className="ado-form-panel animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>Preview: {reportData.meta.name}</h4>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-outline" onClick={() => handleExport('Excel')}><Download size={14}/> Export Excel</button>
                            <button className="btn btn-outline" onClick={() => handleExport('PDF')}><FileText size={14}/> Export PDF</button>
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {Object.keys(reportData.rows[0]).map(k => <th key={k}>{k}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.rows.map((row, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        {Object.values(row).map((val, j) => <td key={j}>{val}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Showing {reportData.rows.length} records</p>
                </div>
            ) : (
                <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--text-muted)' }}>
                    <BarChart3 size={40} opacity={0.2} style={{ marginBottom: 12 }}/>
                    <p style={{ margin: 0 }}>Select a template and filters, then click <strong>Generate Report Preview</strong> to view data.</p>
                </div>
            )}
        </div>
    );
}

// ======================== ANALYTICS ========================
function AnalyticsTab() {
    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><PieChart size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Engagement Analytics</h3>
            <div className="ado-stats-row">
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--info-light)' }}><UploadCloud size={24} color="var(--info)"/></div>
                    <div className="ado-stat-info"><h4>1,245</h4><p>File Downloads</p></div></div>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--success-light)' }}><MessageSquare size={24} color="var(--success)"/></div>
                    <div className="ado-stat-info"><h4>42,100</h4><p>Messages Delivered</p></div></div>
                <div className="ado-stat-card"><div className="ado-stat-icon" style={{ background: 'var(--accent-light)' }}><UserCheck size={24} color="var(--accent)"/></div>
                    <div className="ado-stat-info"><h4>380</h4><p>Visitors Logged</p></div></div>
            </div>
            <div className="ado-form-panel" style={{ minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={64} color="var(--border)" style={{ marginBottom: 16 }}/>
                <h4 style={{ color: 'var(--text-muted)' }}>Module Usage Distribution</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: 8 }}>Interactive charts will render here showing 30-day activity trends.</p>
            </div>
        </div>
    );
}

// ======================== SETTINGS (LIFECYCLE) ========================
function SettingsTab() {
    const modules = [
        { name: 'Visitor Management', desc: 'Track gate entries and visitor logs', enabled: true },
        { name: 'Gallery', desc: 'School photo albums and event media', enabled: true },
        { name: 'Alumni', desc: 'Past student directory and records', enabled: false },
        { name: 'Student Birthday', desc: 'Daily birthday alerts and lists', enabled: true },
        { name: 'Messages', desc: 'In-app broadcasts and targeted SMS', enabled: true },
        { name: 'Forms', desc: 'Custom form builder for data collection', enabled: true },
        { name: 'Downloads', desc: 'Repository for syllabus and circulars', enabled: true },
        { name: 'Registration', desc: 'Sign-ups for events and workshops', enabled: false },
        { name: 'Reports', desc: 'Cross-module data exports', enabled: true },
        { name: 'Analytics', desc: 'Usage stats and module tracking', enabled: true }
    ];

    return (
        <div className="animate-fade-in">
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}><ToggleRight size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/> Add-On Enable Lifecycle</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 24 }}>Super Admins can enable or disable supplementary modules here. Disabled modules hide from the navigation but retain their backend data.</p>
            
            <div className="ado-toggles-list">
                {modules.map((m, i) => (
                    <div className="ado-toggle-card" key={i}>
                        <div className="ado-toggle-info">
                            <h4>{m.name}</h4>
                            <p>{m.desc}</p>
                        </div>
                        <label className="ado-switch">
                            <input type="checkbox" defaultChecked={m.enabled} />
                            <span className="ado-slider"></span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}


// ======================== MAIN ADDONS COMPONENT ========================
const TABS = [
    { id: 'visitors', label: 'Visitors', icon: UserCheck },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'alumni', label: 'Alumni', icon: Users },
    { id: 'birthdays', label: 'Birthdays', icon: Gift },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'registration', label: 'Registration', icon: ClipboardList },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: ToggleRight },
];

export default function Addons() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const currentTab = location.pathname.split('/').pop();
    const activeTab = TABS.some(t => t.id === currentTab) ? currentTab : 'visitors';

    const handleNavigate = (tab) => { navigate(`/addons/${tab}`); };

    return (
        <div className="addons-page animate-fade-in">
            <div className="page-header"><div>
                <div className="page-breadcrumb">
                    <Link to="/">Dashboard</Link><span className="separator">/</span><span>Add-Ons</span>
                    {activeTab !== 'visitors' && <><span className="separator">/</span><span style={{ textTransform: 'capitalize' }}>{TABS.find(t => t.id === activeTab)?.label}</span></>}
                </div>
                <h1>Supplementary Modules (Add-Ons)</h1>
            </div></div>
            <div className="card addons-card">
                <div className="tabs-header">{TABS.map(tab => { const Icon = tab.icon; return <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNavigate(tab.id)}><Icon size={16}/> {tab.label}</button>; })}</div>
                <div className="tabs-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="visitors" replace />} />
                        <Route path="visitors" element={<VisitorsTab />} />
                        <Route path="gallery" element={<GalleryTab />} />
                        <Route path="alumni" element={<AlumniTab />} />
                        <Route path="birthdays" element={<BirthdaysTab />} />
                        <Route path="messages" element={<MessagesTab />} />
                        <Route path="forms" element={<FormsTab />} />
                        <Route path="downloads" element={<DownloadsTab />} />
                        <Route path="registration" element={<RegistrationTab />} />
                        <Route path="reports" element={<ReportsTab />} />
                        <Route path="analytics" element={<AnalyticsTab />} />
                        <Route path="settings" element={<SettingsTab />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
