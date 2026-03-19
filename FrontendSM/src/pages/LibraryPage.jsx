import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Book, BookOpen, User } from 'lucide-react';
import './LibraryPage.css';

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState('books'); // 'books', 'distributed'
    const [books, setBooks] = useState([
        { id: 1, title: 'Concept of Physics Vol 1', author: 'H.C. Verma', category: 'Science', shelf: 'S-12', accNo: 'B-1024', status: 'Available' },
        { id: 2, title: 'Higher Engineering Mathematics', author: 'B.S. Grewal', category: 'Math', shelf: 'M-05', accNo: 'B-1085', status: 'Issued' },
        { id: 3, title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'Biography', shelf: 'G-01', accNo: 'B-1120', status: 'Available' }
    ]);

    const [issuedBooks, setIssuedBooks] = useState([
        { id: 1, bookTitle: 'Higher Engineering Mathematics', issuedTo: 'Rahul Kumar', type: 'Student', class: 'XII-A', issueDate: '2026-03-10', dueDate: '2026-03-25' },
        { id: 2, bookTitle: 'History of India', issuedTo: 'Ms. Anita', type: 'Staff', class: '-', issueDate: '2026-03-05', dueDate: '2026-03-20' }
    ]);

    return (
        <div className="library-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link>
                        <span className="separator">/</span>
                        <span>Academics</span>
                        <span className="separator">/</span>
                        <span>Library</span>
                    </div>
                    <h1>Library Management</h1>
                </div>
                <div>
                    <Link to="/" className="btn btn-outline">
                        <ArrowLeft size={16} /> Back
                    </Link>
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="page-tabs" style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
                <button className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>Browse Books</button>
                <button className={`tab-btn ${activeTab === 'distributed' ? 'active' : ''}`} onClick={() => setActiveTab('distributed')}>Distributed Books</button>
            </div>

            {activeTab === 'books' && (
                <div className="card animate-slide-up">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Library Inventory</h3>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <select className="form-select" style={{ width: 130, padding: '6px' }}>
                                <option value="">Category</option>
                                <option value="Science">Science</option>
                                <option value="Math">Math</option>
                            </select>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-grey)' }} />
                                <input type="text" placeholder="Search title, author..." className="form-input" style={{ paddingLeft: 32, padding: '6px 12px 6px 32px', width: 220 }} />
                            </div>
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Acc. No</th>
                                    <th>Book Title</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Shelf</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.accNo}</td>
                                        <td className="td-bold">{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.category}</td>
                                        <td>{b.shelf}</td>
                                        <td>
                                            <span className={`badge ${b.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'distributed' && (
                <div className="card animate-slide-up">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Issued Books logs</h3>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Book Title</th>
                                    <th>Issued To</th>
                                    <th>Type</th>
                                    <th>Class</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issuedBooks.map(i => (
                                    <tr key={i.id}>
                                        <td className="td-bold">{i.bookTitle}</td>
                                        <td>{i.issuedTo}</td>
                                        <td><span className={`badge ${i.type === 'Student' ? 'badge-info' : 'badge-success'}`}>{i.type}</span></td>
                                        <td>{i.class}</td>
                                        <td>{i.issueDate}</td>
                                        <td><span style={{ color: 'var(--warning)', fontWeight: 500 }}>{i.dueDate}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
