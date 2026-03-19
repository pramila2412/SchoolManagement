import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import './AcademicCalendar.css';

export default function AcademicCalendar() {
    const [activeView, setActiveView] = useState('list'); // 'list', 'grid'
    const [events, setEvents] = useState([
        { id: 1, title: 'Annual Sports Day', date: '2026-04-10', time: '09:00 AM', location: 'School Ground', type: 'Event' },
        { id: 2, title: 'Parent-Teacher Meeting', date: '2026-04-18', time: '10:00 AM', location: 'Respective Classrooms', type: 'Meeting' },
        { id: 3, title: 'Easter Holiday', date: '2026-04-03', time: 'Full Day', location: '-', type: 'Holiday' },
        { id: 4, title: 'Science Exhibition', date: '2026-05-05', time: '10:30 AM', location: 'Auditorium', type: 'Event' }
    ]);

    // Mock Calendar Grid Data (Days in April 2026 for example)
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="academic-calendar-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Academics</span>
                        <span className="separator">/</span>
                        <span>Academic Calendar</span>
                    </div>
                    <h1>Academic Calendar</h1>
                </div>
                <div>
                    <Link to="/" className="btn btn-outline">
                        <ArrowLeft size={16} /> Back
                    </Link>
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="page-tabs" style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
                <button className={`tab-btn ${activeView === 'list' ? 'active' : ''}`} onClick={() => setActiveView('list')}>List View</button>
                <button className={`tab-btn ${activeView === 'grid' ? 'active' : ''}`} onClick={() => setActiveView('grid')}>Calendar View</button>
            </div>

            {activeView === 'list' && (
                <div className="card animate-slide-up">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Upcoming Events & Holidays</h3>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <select className="form-select" style={{ width: 140 }}>
                                <option value="April">April 2026</option>
                                <option value="May">May 2026</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ padding: 20 }}>
                        <div className="events-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {events.map(event => (
                                <div key={event.id} className="event-item" style={{ display: 'flex', border: '1px solid var(--border-light)', borderRadius: 8, padding: 16, alignItems: 'center', transition: 'transform 0.2s', background: 'var(--bg-light)' }}>
                                    <div className="event-date-badge" style={{ background: event.type === 'Holiday' ? 'var(--danger-light)' : 'var(--primary-light)', padding: '12px 16px', borderRadius: 8, textAlign: 'center', minWidth: 70 }}>
                                        <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, color: event.type === 'Holiday' ? 'var(--danger)' : 'var(--primary)' }}>{new Date(event.date).getDate()}</span>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-grey)' }}>{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <div style={{ marginLeft: 20, flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{event.title} <span className={`badge ${event.type === 'Holiday' ? 'badge-danger' : event.type === 'Meeting' ? 'badge-warning' : 'badge-success'}`} style={{ marginLeft: 8, fontSize: '0.75rem' }}>{event.type}</span></h4>
                                        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: '0.85rem', color: 'var(--text-grey)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {event.time}</span>
                                            {event.location !== '-' && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {event.location}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'grid' && (
                <div className="card animate-slide-up" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ color: 'var(--primary)' }}>April 2026</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-outline" style={{ padding: '6px 12px' }}>Prev</button>
                            <button className="btn btn-outline" style={{ padding: '6px 12px' }}>Next</button>
                        </div>
                    </div>
                    <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-dark)', padding: 8, background: 'var(--bg-light)', borderRadius: 4 }}>{day}</div>
                        ))}
                        {/* Empty cells before 1st April (assuming starts on Wednesday for demo) */}
                        <div style={{ padding: 12 }}></div>
                        <div style={{ padding: 12 }}></div>
                        <div style={{ padding: 12 }}></div>

                        {daysInMonth.map(day => {
                            const hasEvent = events.some(e => new Date(e.date).getDate() === day && new Date(e.date).getMonth() === 3); // Month 3=April
                            return (
                                <div key={day} style={{ border: '1px solid var(--border-light)', borderRadius: 4, padding: 12, minHeight: 80, position: 'relative', background: hasEvent ? 'var(--primary-light)' : 'none' }}>
                                    <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>{day}</span>
                                    {hasEvent && (
                                        <div style={{ marginTop: 4, fontSize: '0.65rem', padding: '2px 4px', background: 'var(--primary)', color: 'white', borderRadius: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            Event
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
