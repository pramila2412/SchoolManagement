import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Eye, Printer, FileText, Award, Plus, Trash2, Download, X } from 'lucide-react';
import { customAlert, customConfirm } from '../utils/dialogs';
import { useLocalStorage } from '../hooks/useLocalStorage';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './Certificates.css';

const API = '/api';

/* ──────────────────────────── helpers ──────────────────────────── */
import { dateToWords, numberToWords } from '../utils/formatters';

function formatDate(dateStr) {
    if (!dateStr) return '____________';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatDOBFigures(dateStr) {
    if (!dateStr) return '____________';
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

/* pronouns helper */
function pronouns(gender) {
    const g = (gender || '').toLowerCase();
    if (g === 'male' || g === 'm') return { heshe: 'He', hisher: 'His', himher: 'him', SoDo: 'S/o' };
    if (g === 'female' || g === 'f') return { heshe: 'She', hisher: 'Her', himher: 'her', SoDo: 'D/o' };
    return { heshe: 'He / She', hisher: 'His / Her', himher: 'him/her', SoDo: 'S/o / D/o' };
}

/* ──────────────────────── Certificate Body Renderers ──────────────────────── */

function FieldValue({ children }) {
    return <span className="cert-field-value">{children || '____________'}</span>;
}

function CertBodyBonafide({ cert }) {
    const p = pronouns(cert.gender);
    return (
        <div className="cert-formal-body">
            <p>
                This is to certify that <FieldValue>{cert.studentName}</FieldValue> {p.SoDo}.
                Mr/Mrs. <FieldValue>{cert.fatherName || cert.parentName}</FieldValue> is a bonafide
                student of our school. {p.hisher} Date of Birth is <FieldValue>{formatDOBFigures(cert.dateOfBirth)}</FieldValue> (in figures)
                {' '}<FieldValue>{dateToWords(cert.dateOfBirth)}</FieldValue> (in words)
                as per our Admission Register.
            </p>
            <p>
                {p.heshe} is studying in Class - <FieldValue>{cert.class}</FieldValue> in the academic year <FieldValue>{cert.academicYear || new Date().getFullYear()}</FieldValue>.
            </p>
            {cert.purpose && (
                <p style={{ marginTop: 12 }}>
                    This certificate is issued on request for the purpose of <FieldValue>{cert.purpose}</FieldValue>.
                </p>
            )}
        </div>
    );
}

function CertBodyFee({ cert }) {
    const p = pronouns(cert.gender);
    const monthly = Number(cert.monthlyFee) || 0;
    const months = Number(cert.feeMonths) || 12;
    const total = monthly * months;
    return (
        <div className="cert-formal-body">
            <p>
                This is to certify that <FieldValue>{cert.studentName}</FieldValue> {p.SoDo}. <FieldValue>{cert.fatherName || cert.parentName}</FieldValue>
                {' '}is studying in Class / Std. <FieldValue>{cert.class}</FieldValue> in this school.
            </p>
            <p>
                {p.hisher} school fees of the year from April <FieldValue>{cert.feeYearStart}</FieldValue> to March <FieldValue>{cert.feeYearEnd}</FieldValue> is as
                follows.
            </p>
            <div className="cert-fee-table">
                <div className="fee-row">
                    <span>Tuition Fee: - <FieldValue>{monthly ? `₹${monthly.toLocaleString('en-IN')}` : '______'}</FieldValue> x <FieldValue>{months}</FieldValue> = Rs. <FieldValue>{total ? `${total.toLocaleString('en-IN')}/-` : '______'}</FieldValue></span>
                </div>
                <div className="cert-fee-total">
                    [Rupees <FieldValue>{total ? numberToWords(total) : '____________'}</FieldValue>]
                </div>
            </div>
        </div>
    );
}

function CertBodyCharacter({ cert }) {
    const p = pronouns(cert.gender);
    return (
        <div className="cert-formal-body">
            <p>
                This is to certify that <FieldValue>{cert.studentName}</FieldValue> {p.SoDo}.
                Mr/Mrs. <FieldValue>{cert.fatherName || cert.parentName}</FieldValue> has been a student of our school.
            </p>
            <p>
                {p.heshe} was studying in Class <FieldValue>{cert.class}</FieldValue> during the academic year <FieldValue>{cert.academicYear || new Date().getFullYear()}</FieldValue>.
            </p>
            <p>
                During {p.hisher.toLowerCase()} stay in this school, {p.hisher.toLowerCase()} character and conduct has been found to be <FieldValue>{cert.remarks || 'Good'}</FieldValue>.
            </p>
            <p>
                We wish {p.himher} all the best in future endeavours.
            </p>
        </div>
    );
}

function CertBodyStudy({ cert }) {
    const p = pronouns(cert.gender);
    return (
        <div className="cert-formal-body">
            <p>
                This is to certify that <FieldValue>{cert.studentName}</FieldValue> {p.SoDo}.
                Mr/Mrs. <FieldValue>{cert.fatherName || cert.parentName}</FieldValue> is/was a student of our school.
            </p>
            <p>
                {p.heshe} has studied in Class <FieldValue>{cert.class}</FieldValue> during the academic year <FieldValue>{cert.academicYear || new Date().getFullYear()}</FieldValue>.
            </p>
            <p>
                This certificate is issued for the purpose of <FieldValue>{cert.purpose || 'general reference'}</FieldValue>.
            </p>
        </div>
    );
}

function CertBodyMigration({ cert }) {
    const p = pronouns(cert.gender);
    return (
        <div className="cert-formal-body">
            <p>
                This is to certify that <FieldValue>{cert.studentName}</FieldValue> {p.SoDo}.
                Mr/Mrs. <FieldValue>{cert.fatherName || cert.parentName}</FieldValue> bearing Admission No. <FieldValue>{cert.admissionNo}</FieldValue> was a student of our school.
            </p>
            <p>
                {p.heshe} has studied in Class <FieldValue>{cert.class}</FieldValue> during the academic year <FieldValue>{cert.academicYear || new Date().getFullYear()}</FieldValue>.
            </p>
            <p>
                {p.heshe} is hereby granted migration from this school. {p.hisher} conduct and character during the stay was <FieldValue>{cert.remarks || 'Good'}</FieldValue>.
            </p>
            <p>
                This certificate is issued on {p.hisher.toLowerCase()} request for the purpose of <FieldValue>{cert.purpose || 'further studies'}</FieldValue>.
            </p>
        </div>
    );
}

function CertBodyCustom({ cert }) {
    return (
        <div className="cert-formal-body">
            <p>
                This is to certify that <FieldValue>{cert.studentName}</FieldValue> is/was a student of
                Class <FieldValue>{cert.class}</FieldValue>, Section <FieldValue>{cert.section}</FieldValue> of our school.
            </p>
            {cert.purpose && (
                <p>This certificate is issued for the purpose of <FieldValue>{cert.purpose}</FieldValue>.</p>
            )}
            {cert.remarks && (
                <p>{cert.remarks}</p>
            )}
        </div>
    );
}

/* ──────────────────────── Formal Certificate Template ──────────────────────── */

export function FormalCertificate({ cert }) {
    const todayFormatted = formatDate(cert.issueDate || new Date().toISOString());
    const title = cert.type === 'Custom' ? 'Certificate' : `${cert.type} Certificate`;

    const bodyMap = {
        Bonafide: CertBodyBonafide,
        Fee: CertBodyFee,
        Character: CertBodyCharacter,
        Study: CertBodyStudy,
        Migration: CertBodyMigration,
        Custom: CertBodyCustom,
    };
    const BodyComponent = bodyMap[cert.type] || CertBodyCustom;

    return (
        <div className="cert-formal-page" id="printable-certificate">
            {/* ── Header ── */}
            <div className="cert-formal-header">
                <img src="/logo.png" alt="Mount Zion School" className="cert-formal-header-logo" />
                <div className="cert-formal-header-info">
                    <h1 className="cert-formal-school-name">Mount Zion School</h1>
                    <p className="cert-formal-address">SION NAGAR, PURNEA - 854 301 (BIHAR)</p>
                    <p className="cert-formal-affiliation">(Affiliated to C.B.S.E., New Delhi)</p>
                    <p className="cert-formal-affiliation-nos">Affiliation No.: 330241 &amp; School No.: 65235</p>
                </div>
            </div>

            <hr className="cert-formal-divider" />

            {/* ── Ref & Date ── */}
            <div className="cert-formal-ref-row">
                <span>Ref. No. MZS Purnea / <FieldValue>{cert.certificateNo}</FieldValue></span>
                <span>Date: <FieldValue>{todayFormatted}</FieldValue></span>
            </div>

            {/* ── Title ── */}
            <h2 className="cert-formal-title">TO WHOM IT MAY CONCERN</h2>

            {/* ── Sub-title ── */}
            <p style={{ textAlign: 'center', marginTop: -18, marginBottom: 24, fontSize: 16, fontWeight: 600, color: '#0B3C5D', letterSpacing: 1 }}>
                — {title} —
            </p>

            {/* ── Body ── */}
            <BodyComponent cert={cert} />

            {/* ── Signature ── */}
            <div className="cert-formal-signature">
                <div className="cert-formal-signature-block">
                    <div className="sig-line"></div>
                    <span className="sig-label">Principal</span>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="cert-formal-footer">
                <span>Date of Issue: {todayFormatted}</span>
                <span>Ref: {cert.certificateNo}</span>
            </div>
        </div>
    );
}

/* ──────────────────────── Download HTML Generator ──────────────────────── */

function buildDownloadHTML(cert) {
    const todayFormatted = formatDate(cert.issueDate || new Date().toISOString());
    const title = cert.type === 'Custom' ? 'Certificate' : `${cert.type} Certificate`;
    const p = pronouns(cert.gender);

    let bodyHtml = '';
    switch (cert.type) {
        case 'Bonafide':
            bodyHtml = `
                <p>This is to certify that <span class="fv">${cert.studentName}</span> ${p.SoDo}.
                Mr/Mrs. <span class="fv">${cert.fatherName || cert.parentName || '____________'}</span> is a bonafide
                student of our school. ${p.hisher} Date of Birth is <span class="fv">${formatDOBFigures(cert.dateOfBirth)}</span> (in figures)
                <span class="fv">${dateToWords(cert.dateOfBirth)}</span> (in words)
                as per our Admission Register.</p>
                <p>${p.heshe} is studying in Class - <span class="fv">${cert.class}</span> in the academic year <span class="fv">${cert.academicYear || new Date().getFullYear()}</span>.</p>
                ${cert.purpose ? `<p>This certificate is issued on request for the purpose of <span class="fv">${cert.purpose}</span>.</p>` : ''}
            `;
            break;
        case 'Fee': {
            const monthly = Number(cert.monthlyFee) || 0;
            const months = Number(cert.feeMonths) || 12;
            const total = monthly * months;
            bodyHtml = `
                <p>This is to certify that <span class="fv">${cert.studentName}</span> ${p.SoDo}. <span class="fv">${cert.fatherName || cert.parentName || '____________'}</span>
                is studying in Class / Std. <span class="fv">${cert.class}</span> in this school.</p>
                <p>${p.hisher} school fees of the year from April <span class="fv">${cert.feeYearStart || '____'}</span> to March <span class="fv">${cert.feeYearEnd || '____'}</span> is as follows.</p>
                <p>Tuition Fee: - <span class="fv">₹${monthly.toLocaleString('en-IN')}</span> x <span class="fv">${months}</span> = Rs. <span class="fv">${total.toLocaleString('en-IN')}/-</span></p>
                <p>[Rupees <span class="fv">${total ? numberToWords(total) : '____________'}</span>]</p>
            `;
            break;
        }
        case 'Character':
            bodyHtml = `
                <p>This is to certify that <span class="fv">${cert.studentName}</span> ${p.SoDo}.
                Mr/Mrs. <span class="fv">${cert.fatherName || cert.parentName || '____________'}</span> has been a student of our school.</p>
                <p>${p.heshe} was studying in Class <span class="fv">${cert.class}</span> during the academic year <span class="fv">${cert.academicYear || new Date().getFullYear()}</span>.</p>
                <p>During ${p.hisher.toLowerCase()} stay in this school, ${p.hisher.toLowerCase()} character and conduct has been found to be <span class="fv">${cert.remarks || 'Good'}</span>.</p>
                <p>We wish ${p.himher} all the best in future endeavours.</p>
            `;
            break;
        case 'Study':
            bodyHtml = `
                <p>This is to certify that <span class="fv">${cert.studentName}</span> ${p.SoDo}.
                Mr/Mrs. <span class="fv">${cert.fatherName || cert.parentName || '____________'}</span> is/was a student of our school.</p>
                <p>${p.heshe} has studied in Class <span class="fv">${cert.class}</span> during the academic year <span class="fv">${cert.academicYear || new Date().getFullYear()}</span>.</p>
                <p>This certificate is issued for the purpose of <span class="fv">${cert.purpose || 'general reference'}</span>.</p>
            `;
            break;
        case 'Migration':
            bodyHtml = `
                <p>This is to certify that <span class="fv">${cert.studentName}</span> ${p.SoDo}.
                Mr/Mrs. <span class="fv">${cert.fatherName || cert.parentName || '____________'}</span> bearing Admission No. <span class="fv">${cert.admissionNo || 'N/A'}</span> was a student of our school.</p>
                <p>${p.heshe} has studied in Class <span class="fv">${cert.class}</span> during the academic year <span class="fv">${cert.academicYear || new Date().getFullYear()}</span>.</p>
                <p>${p.heshe} is hereby granted migration from this school. ${p.hisher} conduct and character during the stay was <span class="fv">${cert.remarks || 'Good'}</span>.</p>
                <p>This certificate is issued on ${p.hisher.toLowerCase()} request for the purpose of <span class="fv">${cert.purpose || 'further studies'}</span>.</p>
            `;
            break;
        default:
            bodyHtml = `
                <p>This is to certify that <span class="fv">${cert.studentName}</span> is/was a student of
                Class <span class="fv">${cert.class}</span>, Section <span class="fv">${cert.section}</span> of our school.</p>
                ${cert.purpose ? `<p>This certificate is issued for the purpose of <span class="fv">${cert.purpose}</span>.</p>` : ''}
                ${cert.remarks ? `<p>${cert.remarks}</p>` : ''}
            `;
    }

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${cert.studentName} - ${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', Georgia, serif; background: #eee; }
        .page {
            width: 210mm; min-height: 297mm; margin: 10mm auto;
            background: #fff; padding: 18mm 20mm 15mm 20mm;
            box-shadow: 0 4px 24px rgba(0,0,0,0.12);
            display: flex; flex-direction: column; position: relative;
        }
        .header { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
        .header img { width: 64px; height: 64px; object-fit: contain; }
        .header-info { flex: 1; text-align: center; }
        .school-name { font-size: 26px; font-weight: 700; color: #0B3C5D; text-transform: uppercase; letter-spacing: 2px; }
        .address { font-size: 13px; color: #333; font-weight: 600; }
        .affiliation { font-size: 12px; color: #555; font-style: italic; }
        .aff-nos { font-size: 11.5px; color: #555; }
        hr.divider { border: none; border-top: 2.5px solid #0B3C5D; margin: 10px 0 14px; }
        .ref-row { display: flex; justify-content: space-between; font-size: 13px; color: #444; margin-bottom: 24px; }
        .title { text-align: center; font-size: 20px; font-weight: 700; color: #0B3C5D; text-decoration: underline; margin-bottom: 6px; letter-spacing: 1px; }
        .subtitle { text-align: center; font-size: 16px; font-weight: 600; color: #0B3C5D; margin-bottom: 24px; }
        .body { font-size: 15px; line-height: 2.1; color: #333; text-align: justify; flex: none; margin-bottom: 40px; }
        .body p { margin: 0 0 12px; }
        .fv { font-weight: 700; color: #0B3C5D; text-decoration: underline dotted #999; text-underline-offset: 2px; text-decoration-thickness: 1.5px; padding: 0 4px; }
        .sig-block { text-align: center; min-width: 180px; float: right; margin-top: 60px; }
        .sig-block .line { border-bottom: 1.5px solid #333; height: 40px; margin-bottom: 4px; }
        .sig-block .label { font-size: 14px; font-weight: 700; }
        .footer { display: flex; justify-content: space-between; margin-top: auto; padding-top: 16px; font-size: 12px; color: #888; clear: both; }
        @media print {
            body { background: #fff; }
            .page { margin: 0; box-shadow: none; width: 100%; }
            @page { size: A4 portrait; margin: 0; }
            .page { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <img src="/logo.png" alt="Mount Zion School" />
            <div class="header-info">
                <div class="school-name">Mount Zion School</div>
                <div class="address">SION NAGAR, PURNEA - 854 301 (BIHAR)</div>
                <div class="affiliation">(Affiliated to C.B.S.E., New Delhi)</div>
                <div class="aff-nos">Affiliation No.: 330241 &amp; School No.: 65235</div>
            </div>
        </div>
        <hr class="divider" />
        <div class="ref-row">
            <span>Ref. No. MZS Purnea / ${cert.certificateNo}</span>
            <span>Date: ${todayFormatted}</span>
        </div>
        <div class="title">TO WHOM IT MAY CONCERN</div>
        <div class="subtitle">— ${title} —</div>
        <div class="body">${bodyHtml}</div>
        <div class="sig-block"><div class="line"></div><span class="label">Principal</span></div>
        <div class="footer">
            <span>Date of Issue: ${todayFormatted}</span>
            <span>Ref: ${cert.certificateNo}</span>
        </div>
    </div>
    <script>window.addEventListener('load', function(){ window.print(); });</script>
</body>
</html>`;
}

/* ──────────────────────── Main Component ──────────────────────── */

export default function Certificates() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('generate');
    const [formData, setFormData] = useState({ class: '', section: '', keyword: '' });
    const [certType, setCertType] = useState('');
    const [purpose, setPurpose] = useState('');
    const [remarks, setRemarks] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [localCertificates, setLocalCertificates] = useLocalStorage('mzs_certificates', []);
    const [apiCertificates, setApiCertificates] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [previewCert, setPreviewCert] = useState(null);

    // Fee-specific state
    const [feeYearStart, setFeeYearStart] = useState('');
    const [feeYearEnd, setFeeYearEnd] = useState('');
    const [monthlyFee, setMonthlyFee] = useState('');
    const [feeMonths, setFeeMonths] = useState('12');

    // Merge API and Local certificates
    const certificates = [...apiCertificates, ...localCertificates].sort((a, b) =>
        new Date(b.issueDate || b.createdAt) - new Date(a.issueDate || a.createdAt)
    );

    // Helper to normalize class names
    const normalizeClass = (cls) => {
        if (!cls) return '';
        return cls.replace(/Grade\s+/i, '').replace(/Class\s+/i, '').trim();
    };

    useEffect(() => {
        fetch(`${API}/certificates`)
            .then(r => r.json())
            .then(data => Array.isArray(data) ? setApiCertificates(data) : setApiCertificates([]))
            .catch(() => setApiCertificates([]));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            let apiStudents = [];
            try {
                let url = `${API}/students?status=Active`;
                if (formData.class) url += `&class=${encodeURIComponent(formData.class)}`;
                if (formData.section) url += `&section=${formData.section}`;
                const res = await fetch(url);
                apiStudents = await res.json();
            } catch (err) { console.error("API search failed", err); }

            const localData = JSON.parse(localStorage.getItem('mzs_students') || '[]');
            const normalizedLocal = localData.map(s => {
                const nameParts = (s.name || '').split(' ');
                return {
                    ...s,
                    firstName: s.firstName || nameParts[0] || 'Unknown',
                    lastName: s.lastName || nameParts.slice(1).join(' ') || '',
                    admissionNo: s.admissionNo || s.id || 'N/A',
                    rollNo: s.rollNo || 'N/A'
                };
            }).filter(s => {
                const searchClass = normalizeClass(formData.class);
                const studentClass = normalizeClass(s.class);
                if (searchClass && studentClass !== searchClass) return false;
                if (formData.section && s.section !== formData.section) return false;
                if (s.status === 'Inactive') return false;
                return true;
            });

            let data = [...apiStudents, ...normalizedLocal];
            if (formData.keyword) {
                const kw = formData.keyword.toLowerCase();
                data = data.filter(s =>
                    `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.rollNo}`.toLowerCase().includes(kw)
                );
            }
            setResults(data);
            setHasSearched(true);
        } catch (err) {
            console.error("Search failed", err);
            setResults([]);
            setHasSearched(true);
        }
    };

    const handleGenerate = async (student) => {
        if (!certType) return await customAlert('Select a certificate type');
        setGenerating(true);
        try {
            const certNo = `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            const body = {
                studentId: student.id || student._id,
                studentName: `${student.firstName} ${student.lastName}`,
                class: student.class,
                section: student.section,
                type: certType,
                purpose,
                remarks,
                certificateNo: certNo,
                issueDate: new Date().toISOString(),
                fatherName: student.fatherName || '',
                motherName: student.motherName || '',
                parentName: student.fatherName || student.motherName || '',
                dateOfBirth: student.dateOfBirth || student.dob || '',
                admissionNo: student.admissionNo || '',
                gender: student.gender || '',
                academicYear: student.academicYear || `${new Date().getFullYear()}`,
                // Fee-specific
                feeYearStart,
                feeYearEnd,
                monthlyFee,
                feeMonths,
            };

            try {
                const res = await fetch(`${API}/certificates`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (res.ok) {
                    const savedCert = await res.json();
                    setApiCertificates([savedCert, ...apiCertificates]);
                } else {
                    setLocalCertificates([body, ...localCertificates]);
                }
            } catch {
                setLocalCertificates([body, ...localCertificates]);
            }

            await customAlert(`Certificate generated! No: ${certNo}`);
            setPurpose('');
            setRemarks('');
        } catch (err) {
            console.error("Generation failed", err);
            await customAlert('Failed to generate certificate');
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!await customConfirm('Delete this certificate?')) return;

        const isLocal = localCertificates.some(c => c._id === id || c.certificateNo === id);
        if (isLocal) {
            setLocalCertificates(localCertificates.filter(c => c._id !== id && c.certificateNo !== id));
            await customAlert('Certificate record deleted locally.');
            return;
        }

        try {
            await fetch(`${API}/certificates/${id}`, { method: 'DELETE' });
            setApiCertificates(apiCertificates.filter(c => c._id !== id));
        } catch (err) {
            console.error("API delete failed", err);
        }
    };

    const getMergedCert = (cert) => {
        const localStudents = JSON.parse(localStorage.getItem('mzs_students') || '[]');
        const student = localStudents.find(s => s.id === cert.studentId || s._id === cert.studentId || s.admissionNo === cert.admissionNo);
        if (!student) return cert;
        return {
            ...cert,
            fatherName: cert.fatherName || student.fatherName || '',
            motherName: cert.motherName || student.motherName || '',
            parentName: cert.parentName || cert.fatherName || student.fatherName || student.motherName || '',
            dateOfBirth: cert.dateOfBirth || student.dateOfBirth || student.dob || '',
            gender: cert.gender || student.gender || '',
            studentName: cert.studentName || `${student.firstName || ''} ${student.lastName || ''}`.trim()
        };
    };

    const handlePrint = (cert) => {
        const mergedCert = getMergedCert(cert);
        const certHtml = buildDownloadHTML(mergedCert);
        const blob = new Blob([certHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    const handleDownload = async (cert) => {
        const mergedCert = getMergedCert(cert);
        setGenerating(true);
        try {
            let element = document.getElementById('printable-certificate');
            let isTemp = false;
            
            if (!element) {
                setPreviewCert(mergedCert);
                await new Promise(r => setTimeout(r, 100)); // wait for render
                element = document.getElementById('printable-certificate');
                isTemp = true;
            }
            
            if (!element) throw new Error("Could not find printable element");

            const originalStyle = element.style.cssText;
            element.style.padding = '18mm 20mm';
            element.style.width = '210mm';
            element.style.background = '#fff';

            const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
            element.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${cert.certificateNo ? cert.certificateNo.replace(/\//g, '-') : 'Certificate'}.pdf`);
            
            if (isTemp) setPreviewCert(null);
        } catch (err) {
            console.error("Download failed", err);
            customAlert("Failed to download PDF.");
        } finally {
            setGenerating(false);
        }
    };

    const openPreview = (student) => {
        if (!certType) {
            customAlert('Please select a Certificate Type from the dropdown above to preview.');
            return;
        }
        setPreviewCert({
            type: certType,
            studentName: `${student.firstName} ${student.lastName}`,
            class: student.class,
            section: student.section,
            purpose: purpose || '',
            remarks: remarks || '',
            issueDate: new Date().toISOString(),
            certificateNo: 'PREVIEW-000',
            fatherName: student.fatherName || '',
            motherName: student.motherName || '',
            parentName: student.fatherName || student.motherName || '',
            dateOfBirth: student.dateOfBirth || student.dob || '',
            admissionNo: student.admissionNo || '',
            gender: student.gender || '',
            academicYear: student.academicYear || `${new Date().getFullYear()}`,
            feeYearStart,
            feeYearEnd,
            monthlyFee,
            feeMonths,
        });
    };

    return (
        <div className="certificates-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link><span className="separator">/</span><span>Certificates</span>
                    </div>
                    <h1>Certificate Management</h1>
                </div>
            </div>

            <div className="attendance-tabs" style={{ marginBottom: 20 }}>
                <button className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`} onClick={() => setActiveTab('generate')}><Plus size={16} /> Generate Certificate</button>
                <button className={`tab-btn ${activeTab === 'issued' ? 'active' : ''}`} onClick={() => setActiveTab('issued')}><Award size={16} /> Issued Certificates ({certificates.length})</button>
            </div>

            {/* ───── Generate Tab ───── */}
            {activeTab === 'generate' && (
                <>
                    <div className="card certificates-filter-card">
                        <form onSubmit={handleSearch}>
                            <div className="form-grid-4">
                                <div className="form-group">
                                    <label className="form-label">Class</label>
                                    <select className="form-select" value={formData.class} onChange={e => setFormData({ ...formData, class: e.target.value })}>
                                        <option value="">All Classes</option>
                                        {['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Section</label>
                                    <select className="form-select" value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })}>
                                        <option value="">All Sections</option>
                                        {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Certificate Type <span className="required">*</span></label>
                                    <select className="form-select" value={certType} onChange={e => {
                                        if (e.target.value === 'Transfer') {
                                            navigate('/tc');
                                        } else {
                                            setCertType(e.target.value);
                                        }
                                    }}>
                                        <option value="">Select Type</option>
                                        <option value="Bonafide">Bonafide Certificate</option>
                                        <option value="Fee">Fee Certificate</option>
                                        <option value="Transfer">Transfer Certificate</option>
                                        <option value="Migration">Migration Certificate</option>
                                        <option value="Custom">Custom Certificate</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                                    <button type="submit" className="btn btn-primary"><Search size={18} /> Search Students</button>
                                </div>
                            </div>

                            <div className="form-row two-cols" style={{ marginTop: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Purpose</label>
                                    <input type="text" className="form-input" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. School transfer, Admission" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Search Student</label>
                                    <input type="text" className="form-input" value={formData.keyword} onChange={e => setFormData({ ...formData, keyword: e.target.value })} placeholder="Search by name..." />
                                </div>
                            </div>

                            {/* Fee Certificate Extra Fields */}
                            {certType === 'Fee' && (
                                <div className="form-row four-cols" style={{ marginTop: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Fee Year Start</label>
                                        <input type="text" className="form-input" value={feeYearStart} onChange={e => setFeeYearStart(e.target.value)} placeholder="e.g. 2024" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Fee Year End</label>
                                        <input type="text" className="form-input" value={feeYearEnd} onChange={e => setFeeYearEnd(e.target.value)} placeholder="e.g. 2025" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Monthly Tuition Fee (₹)</label>
                                        <input type="number" className="form-input" value={monthlyFee} onChange={e => setMonthlyFee(e.target.value)} placeholder="e.g. 3000" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">No. of Months</label>
                                        <input type="number" className="form-input" value={feeMonths} onChange={e => setFeeMonths(e.target.value)} placeholder="12" />
                                    </div>
                                </div>
                            )}

                            {/* Remarks / Conduct for Migration */}
                            {certType === 'Migration' && (
                                <div className="form-row two-cols" style={{ marginTop: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Character / Conduct</label>
                                        <select className="form-select" value={remarks} onChange={e => setRemarks(e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="Excellent">Excellent</option>
                                            <option value="Very Good">Very Good</option>
                                            <option value="Good">Good</option>
                                            <option value="Satisfactory">Satisfactory</option>
                                        </select>
                                    </div>
                                    <div className="form-group" />
                                </div>
                            )}
                        </form>
                    </div>

                    {hasSearched && (
                        <div className="card certificates-results-card animate-fade-in" style={{ marginTop: 24 }}>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead><tr><th>Adm No</th><th>Student</th><th>Class</th><th>Father</th><th>Contact</th><th style={{ textAlign: 'center' }}>Action</th></tr></thead>
                                    <tbody>
                                        {results.length > 0 ? results.map(s => {
                                            const sId = s.id || s._id;
                                            return (
                                                <tr key={sId}>
                                                    <td>{s.admissionNo}</td>
                                                    <td className="fw-600">{s.firstName} {s.lastName}</td>
                                                    <td>{s.class} - {s.section}</td>
                                                    <td>{s.fatherName}</td>
                                                    <td>{s.contactNo}</td>
                                                    <td>
                                                        <div className="action-buttons-center">
                                                            <button
                                                                className="btn btn-outline btn-sm"
                                                                title="Preview Certificate"
                                                                onClick={(e) => { e.preventDefault(); openPreview(s); }}
                                                            >
                                                                <Eye size={16} style={{ marginRight: 4 }} /> Preview
                                                            </button>
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => {
                                                                    if (!certType) {
                                                                        customAlert('Please select a Certificate Type from the dropdown above before generating.');
                                                                        return;
                                                                    }
                                                                    handleGenerate(s);
                                                                }}
                                                                disabled={generating}
                                                            >
                                                                {generating ? '...' : 'Generate'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr><td colSpan="6"><div className="empty-state"><FileText size={48} /><h3>No Students Found</h3></div></td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ───── Issued Tab ───── */}
            {activeTab === 'issued' && (
                <div className="card" style={{ padding: 24 }}>
                    {certificates.length > 0 ? (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead><tr><th>Certificate No</th><th>Student</th><th>Type</th><th>Class</th><th>Issue Date</th><th>Purpose</th><th>Action</th></tr></thead>
                                <tbody>
                                    {certificates.map(c => (
                                        <tr key={c._id || c.certificateNo}>
                                            <td className="fw-600">{c.certificateNo}</td>
                                            <td>{c.studentName}</td>
                                            <td><span className="badge badge-info">{c.type}</span></td>
                                            <td>{c.class} - {c.section}</td>
                                            <td>{new Date(c.issueDate).toLocaleDateString('en-IN')}</td>
                                            <td>{c.purpose || '—'}</td>
                                            <td>
                                                <button className="btn-icon text-primary" title="View Certificate" onClick={() => setPreviewCert(getMergedCert(c))}><Eye size={16} /></button>
                                                <button className="btn-icon" style={{ color: 'var(--text)' }} title="Print Certificate" onClick={() => handlePrint(c)}><Printer size={16} /></button>
                                                <button className="btn-icon text-success" title="Download Certificate" onClick={() => handleDownload(c)}><Download size={16} /></button>
                                                <button className="btn-icon text-danger" title="Delete" onClick={() => handleDelete(c._id || c.certificateNo)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: 40 }}><Award size={48} /><h3>No Certificates Issued Yet</h3><p>Generate certificates from the Generate tab.</p></div>
                    )}
                </div>
            )}

            {/* ───── Preview Modal (Portal) ───── */}
            {previewCert && ReactDOM.createPortal(
                <div className="cert-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setPreviewCert(null); }}>
                    <div className="cert-modal-container">
                        <div className="cert-modal-header">
                            <h2>{previewCert.type} Certificate Preview</h2>
                            <div className="cert-modal-actions">
                                <button className="btn btn-outline" onClick={() => setPreviewCert(null)}><X size={16} /> Close</button>
                                <button className="btn btn-outline" onClick={() => handleDownload(previewCert)} disabled={generating}><Download size={16} /> {generating ? 'Downloading...' : 'Download'}</button>
                                <button className="btn btn-primary" onClick={() => handlePrint(previewCert)}><Printer size={16} /> Print</button>
                            </div>
                        </div>
                        <div className="cert-modal-body">
                            <FormalCertificate cert={previewCert} />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
