import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Search, FileEdit, FileText, Eye, Printer, Trash2, Download } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getBatches, classes } from '../data/mockData';
import { dateToWords, classToWords } from '../utils/formatters';
import { customAlert, customConfirm } from '../utils/dialogs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './TC.css';

const API = '/api';

const getActiveBatch = () => {
    try {
        const academicYears = JSON.parse(localStorage.getItem('academic_years') || '[]');
        const activeYear = academicYears.find(y => y.active === true);
        return activeYear ? activeYear.label : '2024-2025';
    } catch (e) {
        return '2024-2025';
    }
};

const DEFAULT_TC_FORM = {
    dateOfLeaving: '',
    reasonForLeaving: '',
    conduct: 'Good',
    medium: 'English',
    nationality: 'Indian',
    scSt: '',
    dateOfFirstAdmission: '',
    firstAdmissionClass: '',
    dobInWords: '',
    classLastStudied: '',
    boardExamResult: '',
    whetherFailed: 'No',
    subjectsCompulsory: '',
    subjectsElective: '',
    qualifiedForPromotion: '',
    promotionClass: '',
    promotionClassWords: '',
    monthFeesPaid: '',
    feeConcession: 'None',
    totalWorkingDays: '',
    totalDaysPresent: '',
    ncc: 'No',
    gamesPlayed: '',
    generalConduct: 'Good',
    dateOfApplication: new Date().toISOString().split('T')[0],
    dateOfIssue: new Date().toISOString().split('T')[0],
    otherRemarks: ''
};

/* ───────── helper: build the printable TC HTML (opened in new window) ───────── */
function buildTcHtml(tc) {
    const dobDate = tc.dateOfBirth ? new Date(tc.dateOfBirth) : null;
    const dobFormatted = dobDate ? dobDate.toLocaleDateString('en-IN') : '...............';
    const dobDay = dobDate ? String(dobDate.getDate()).padStart(2, '0') : '..';
    const dobMonth = dobDate ? String(dobDate.getMonth() + 1).padStart(2, '0') : '..';
    const dobYear = dobDate ? String(dobDate.getFullYear()) : '....';

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${tc.studentName} - Transfer Certificate</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Times New Roman', Georgia, serif; background: #e8e8e8; }
.tc-page {
    width: 210mm; min-height: 297mm; margin: 10mm auto; background: #fff;
    padding: 18mm 20mm 14mm 20mm; box-shadow: 0 4px 24px rgba(0,0,0,.12);
    position: relative;
}
/* header */
.tc-header { text-align: center; margin-bottom: 10px; }
.tc-header-top { display: flex; align-items: center; justify-content: center; gap: 18px; }
.tc-logo { width: 72px; height: 72px; object-fit: contain; }
.tc-school-info { text-align: center; }
.tc-school-name { font-size: 28px; font-weight: 700; color: #0B3C5D; letter-spacing: 2px; text-transform: uppercase; }
.tc-school-affil { font-size: 13px; color: #0B3C5D; margin-top: 2px; }
.tc-school-addr { font-size: 13px; color: #0B3C5D; }
.tc-affil-row { display: flex; justify-content: center; gap: 40px; margin-top: 4px; font-size: 12px; color: #333; }
/* title */
.tc-formal-title { background: #c0392b; color: #fff; font-size: 18px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; text-align: center; padding-top: 5px; padding-bottom: 9px; margin: 12px auto 10px; width: 70%; }
.tc-meta-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 14px; }
/* fields */
.tc-fields { font-size: 13.5px; line-height: 1.8; color: #333; }
.tc-field { display: flex; margin-bottom: 1px; }
.tc-field-no { min-width: 28px; font-weight: 600; }
.tc-field-label { min-width: 320px; }
.tc-field-value { flex: 1; border-bottom: 1px dotted #999; padding-left: 6px; min-height: 22px; }
.tc-field-sub { padding-left: 28px; display: flex; }
.tc-field-inline { display: flex; gap: 20px; padding-left: 28px; }
.tc-field-inline .tc-field-label { min-width: 200px; }
.tc-dob-boxes { display: inline-block; margin-left: 4px; }
.tc-dob-box { display: inline-block; width: 24px; border: 1px solid #333; margin-right: 2px; text-align: center; font-size: 13px; padding-top: 1px; padding-bottom: 6px; vertical-align: -2px; }
/* footer */
.tc-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; padding-top: 10px; }
.tc-sig-block { text-align: center; font-size: 12px; color: #333; width: 180px; }
.tc-sig-block.right-block { text-align: center; }
.tc-sig-block em { font-style: italic; }
@media print {
    body { background: #fff; }
    .tc-page { margin: 0; box-shadow: none; width: 100%; min-height: 100vh; padding: 8mm 15mm 8mm 15mm; }
    @page { size: A4 portrait; margin: 0; }
    .tc-page { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
</style>
</head>
<body>
<div class="tc-page">
    <div class="tc-header">
        <div class="tc-header-top">
            <img src="/logo.png" class="tc-logo" alt="Logo" onerror="this.style.display='none'" />
            <div class="tc-school-info">
                <div class="tc-school-name">MOUNT ZION SCHOOL</div>
                <div class="tc-school-affil">AFFILIATED TO C.B.S.E., NEW DELHI</div>
                <div class="tc-school-addr">SION NAGAR, PURNEA – 854 301 (BIHAR)</div>
            </div>
        </div>
        <div class="tc-affil-row">
            <span>Affiliation No.: <strong>330241</strong></span>
            <span>School No.: <strong>65235</strong></span>
        </div>
    </div>

    <div class="tc-formal-title">TRANSFER CERTIFICATE</div>

    <div class="tc-meta-row">
        <span>TC No: <strong>${tc.tcNo || '...............'}</strong></span>
        <span>Admission No: <strong>${tc.admissionNo || '...............'}</strong></span>
    </div>

    <div class="tc-fields">
        <div class="tc-field"><span class="tc-field-no">1.</span><span class="tc-field-label">Name of the Pupil</span><span class="tc-field-value">${tc.studentName || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">2.</span><span class="tc-field-label">Father's / Guardian's Name</span><span class="tc-field-value">${tc.fatherName || ''}</span></div>
        <div class="tc-field-sub"><span class="tc-field-label" style="min-width:320px;padding-left:28px">Mother's Name</span><span class="tc-field-value">${tc.motherName || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">3.</span><span class="tc-field-label">Nationality</span><span class="tc-field-value">${tc.nationality || 'Indian'}</span></div>

        <div class="tc-field"><span class="tc-field-no">4.</span><span class="tc-field-label">Whether S.C. or S.T.</span><span class="tc-field-value">${tc.scSt || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">5.</span><span class="tc-field-label">Date of first admission in the School</span><span class="tc-field-value">${tc.dateOfFirstAdmission || (tc.admissionDate ? new Date(tc.admissionDate).toLocaleDateString('en-IN') : '')}</span></div>
        <div class="tc-field-sub"><span class="tc-field-label" style="min-width:320px;padding-left:28px">In Class</span><span class="tc-field-value">${tc.firstAdmissionClass || ''}</span></div>

        <div class="tc-field">
            <span class="tc-field-no">6.</span>
            <span class="tc-field-label">Date of Birth (in figures)</span>
            <span class="tc-field-value">
                ${dobFormatted}
                <span class="tc-dob-boxes">
                    ${dobDigits.map(d => `<span class="tc-dob-box">${d}</span>`).join('')}
                </span>
            </span>
        </div>
        <div class="tc-field-sub"><span class="tc-field-label" style="min-width:320px;padding-left:28px">(in words)</span><span class="tc-field-value">${tc.dobInWords || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">7.</span><span class="tc-field-label">Class in which the pupil studied last</span><span class="tc-field-value">${tc.classLastStudied || tc.class || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">8.</span><span class="tc-field-label">School/Board Annual Exam last taken with result</span><span class="tc-field-value">${tc.boardExamResult || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">9.</span><span class="tc-field-label">Whether failed, if so, once/twice in the same class</span><span class="tc-field-value">${tc.whetherFailed || 'No'}</span></div>

        <div class="tc-field"><span class="tc-field-no">10.</span><span class="tc-field-label">Subjects studied – Compulsory</span><span class="tc-field-value">${tc.subjectsCompulsory || ''}</span></div>
        <div class="tc-field-sub"><span class="tc-field-label" style="min-width:320px;padding-left:28px">Elective</span><span class="tc-field-value">${tc.subjectsElective || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">11.</span><span class="tc-field-label">Whether qualified for promotion to higher class</span><span class="tc-field-value">${tc.qualifiedForPromotion || ''}</span></div>
        <div class="tc-field-sub"><span class="tc-field-label" style="min-width:320px;padding-left:28px">If so, to which class (in figures)</span><span class="tc-field-value">${tc.promotionClass || ''}</span></div>
        <div class="tc-field-sub"><span class="tc-field-label" style="min-width:320px;padding-left:28px">(in words)</span><span class="tc-field-value">${tc.promotionClassWords || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">12.</span><span class="tc-field-label">Month up to which the pupil has paid school fees</span><span class="tc-field-value">${tc.monthFeesPaid || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">13.</span><span class="tc-field-label">Any fee concession availed of; nature of concession</span><span class="tc-field-value">${tc.feeConcession || 'None'}</span></div>

        <div class="tc-field"><span class="tc-field-no">14.</span><span class="tc-field-label">Total No. of School working days</span><span class="tc-field-value">${tc.totalWorkingDays || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">15.</span><span class="tc-field-label">Total No. of days she/he was present</span><span class="tc-field-value">${tc.totalDaysPresent || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">16.</span><span class="tc-field-label">Whether NCC Cadet/Boy Scout/Girl Guide (details may be given)</span><span class="tc-field-value">${tc.ncc || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">17.</span><span class="tc-field-label">Games played or extra-curricular activities in which the pupil usually took part</span><span class="tc-field-value">${tc.gamesPlayed || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">18.</span><span class="tc-field-label">General Conduct</span><span class="tc-field-value">${tc.generalConduct || tc.conduct || 'Good'}</span></div>

        <div class="tc-field"><span class="tc-field-no">19.</span><span class="tc-field-label">Date of application for Certificate</span><span class="tc-field-value">${tc.dateOfApplication ? new Date(tc.dateOfApplication).toLocaleDateString('en-IN') : ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">20.</span><span class="tc-field-label">Date of issue of Certificate</span><span class="tc-field-value">${tc.dateOfIssue ? new Date(tc.dateOfIssue).toLocaleDateString('en-IN') : ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">21.</span><span class="tc-field-label">Reasons for leaving the School</span><span class="tc-field-value">${tc.reasonForLeaving || ''}</span></div>

        <div class="tc-field"><span class="tc-field-no">22.</span><span class="tc-field-label">Any other remarks</span><span class="tc-field-value">${tc.otherRemarks || ''}</span></div>
    </div>

    <div class="tc-footer">
        <div class="tc-sig-block"><em>Sig. of Class Teacher</em></div>
        <div class="tc-sig-block"><strong>Checked by</strong><br />(Full name &amp; Designation)</div>
        <div class="tc-sig-block right-block"><strong>Principal</strong></div>
    </div>
</div>
<script>window.addEventListener('load',function(){window.print();});</script>
</body>
</html>`;
}

/* ───────── helper: TC Preview content (rendered inside portal) ───────── */
function TcPreviewContent({ tc }) {
    const dobDate = tc.dateOfBirth ? new Date(tc.dateOfBirth) : null;
    const dobFormatted = dobDate ? dobDate.toLocaleDateString('en-IN') : '...............';
    const dobDay = dobDate ? String(dobDate.getDate()).padStart(2, '0') : '';
    const dobMonth = dobDate ? String(dobDate.getMonth() + 1).padStart(2, '0') : '';
    const dobYear = dobDate ? String(dobDate.getFullYear()) : '';
    const dobDigits = (dobDay + dobMonth + dobYear).split('');

    return (
        <div className="tc-formal-page" id="printable-tc">
            {/* ──── Header ──── */}
            <div className="tc-formal-header">
                <div className="tc-header-top-row">
                    <img src="/logo.png" alt="Logo" className="tc-formal-logo" onError={e => e.target.style.display = 'none'} />
                    <div className="tc-header-text">
                        <h1 className="tc-school-name-formal">MOUNT ZION SCHOOL</h1>
                        <p className="tc-affil-line">AFFILIATED TO C.B.S.E., NEW DELHI</p>
                        <p className="tc-addr-line">SION NAGAR, PURNEA – 854 301 (BIHAR)</p>
                    </div>
                </div>
                <div className="tc-affil-nos">
                    <span>Affiliation No.: <strong>330241</strong></span>
                    <span>School No.: <strong>65235</strong></span>
                </div>
            </div>

            {/* ──── Title ──── */}
            <div className="tc-formal-title">TRANSFER CERTIFICATE</div>

            {/* ──── Meta row ──── */}
            <div className="tc-formal-meta">
                <span>TC No: <strong>{tc.tcNo || '...............'}</strong></span>
                <span>Admission No: <strong>{tc.admissionNo || '...............'}</strong></span>
            </div>

            {/* ──── Fields ──── */}
            <div className="tc-formal-fields">
                <Field no="1" label="Name of the Pupil" value={tc.studentName} />
                <Field no="2" label="Father's / Guardian's Name" value={tc.fatherName} />
                <SubField label="Mother's Name" value={tc.motherName} />
                <Field no="3" label="Nationality" value={tc.nationality || 'Indian'} />
                <Field no="4" label="Whether S.C. or S.T." value={tc.scSt} />
                <Field no="5" label="Date of first admission in the School" value={tc.dateOfFirstAdmission || (tc.admissionDate ? new Date(tc.admissionDate).toLocaleDateString('en-IN') : '')} />
                <SubField label="In Class" value={tc.firstAdmissionClass} />

                {/* DOB with boxes */}
                <div className="tc-formal-field">
                    <span className="tc-f-no">6.</span>
                    <span className="tc-f-label">Date of Birth (in figures)</span>
                    <span className="tc-f-value">
                        {dobFormatted}
                        {dobDigits.length > 0 && (
                            <span className="tc-dob-boxes">
                                {dobDigits.map((d, i) => <span key={i} className="tc-dob-box">{d}</span>)}
                            </span>
                        )}
                    </span>
                </div>
                <SubField label="(in words)" value={tc.dobInWords} />

                <Field no="7" label="Class in which the pupil studied last" value={tc.classLastStudied || tc.class} />
                <Field no="8" label="School/Board Annual Exam last taken with result" value={tc.boardExamResult} />
                <Field no="9" label="Whether failed, if so, once/twice in the same class" value={tc.whetherFailed || 'No'} />
                <Field no="10" label="Subjects studied – Compulsory" value={tc.subjectsCompulsory} />
                <SubField label="Elective" value={tc.subjectsElective} />
                <Field no="11" label="Whether qualified for promotion to higher class" value={tc.qualifiedForPromotion} />
                <SubField label="If so, to which class (in figures)" value={tc.promotionClass} />
                <SubField label="(in words)" value={tc.promotionClassWords} />
                <Field no="12" label="Month up to which the pupil has paid school fees" value={tc.monthFeesPaid} />
                <Field no="13" label="Any fee concession availed of; nature of concession" value={tc.feeConcession || 'None'} />
                <Field no="14" label="Total No. of School working days" value={tc.totalWorkingDays} />
                <Field no="15" label="Total No. of days she/he was present" value={tc.totalDaysPresent} />
                <Field no="16" label="Whether NCC Cadet/Boy Scout/Girl Guide (details may be given)" value={tc.ncc} />
                <Field no="17" label="Games played or extra-curricular activities in which the pupil usually took part" value={tc.gamesPlayed} />
                <Field no="18" label="General Conduct" value={tc.generalConduct || tc.conduct || 'Good'} />
                <Field no="19" label="Date of application for Certificate" value={tc.dateOfApplication ? new Date(tc.dateOfApplication).toLocaleDateString('en-IN') : ''} />
                <Field no="20" label="Date of issue of Certificate" value={tc.dateOfIssue ? new Date(tc.dateOfIssue).toLocaleDateString('en-IN') : ''} />
                <Field no="21" label="Reasons for leaving the School" value={tc.reasonForLeaving} />
                <Field no="22" label="Any other remarks" value={tc.otherRemarks} />
            </div>

            {/* ──── Footer ──── */}
            <div className="tc-formal-footer">
                <div className="tc-sig-block">
                    <em>Sig. of Class Teacher</em>
                </div>
                <div className="tc-sig-block">
                    <strong>Checked by</strong><br />
                    <span style={{ fontSize: '0.75rem' }}>(Full name &amp; Designation)</span>
                </div>
                <div className="tc-sig-block tc-sig-right">
                    <strong>Principal</strong>
                </div>
            </div>
        </div>
    );
}

function Field({ no, label, value }) {
    return (
        <div className="tc-formal-field">
            <span className="tc-f-no">{no}.</span>
            <span className="tc-f-label">{label}</span>
            <span className="tc-f-value">{value || ''}</span>
        </div>
    );
}

function SubField({ label, value }) {
    return (
        <div className="tc-formal-field tc-formal-sub">
            <span className="tc-f-no" />
            <span className="tc-f-label">{label}</span>
            <span className="tc-f-value">{value || ''}</span>
        </div>
    );
}

/* ═══════════════════════════════ MAIN COMPONENT ═══════════════════════════════ */
export default function TC() {
    const [activeView, setActiveView] = useState('search');
    const [formData, setFormData] = useState({ batch: getActiveBatch(), class: '', section: '', keyword: '' });
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [tcForm, setTcForm] = useState({ ...DEFAULT_TC_FORM });
    const [generating, setGenerating] = useState(false);
    const [tcList, setTcList] = useLocalStorage('issued_tcs', []);
    const [academicSubjects] = useLocalStorage('academic_subjects', []);
    const [previewTc, setPreviewTc] = useState(null);

    /* ── Delete TC ── */
    const handleDeleteTc = async (id) => {
        if (await customConfirm("Are you sure you want to delete this TC record?")) {
            setTcList(prev => prev.filter(tc => tc.tcNo !== id));
            await customAlert('TC record deleted.');
        }
    };

    /* ── View TC (preview modal) ── */
    const handleViewTc = (tc) => {
        setPreviewTc(tc);
    };

    /* ── Print TC (new window) ── */
    const handlePrintTc = (tc) => {
        const html = buildTcHtml(tc);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 200);
    };

    /* ── Download TC as PDF ── */
    const handleDownloadTc = async (tc) => {
        setGenerating(true);
        try {
            let element = document.getElementById('printable-tc');
            let isTemp = false;
            
            if (!element) {
                setPreviewTc(tc);
                await new Promise(r => setTimeout(r, 100)); // wait for render
                element = document.getElementById('printable-tc');
                isTemp = true;
            }
            
            if (!element) throw new Error("Could not find printable element");

            // Temporary styling for better PDF rendering
            const originalStyle = element.style.cssText;
            element.style.padding = '8mm 15mm';
            element.style.width = '210mm'; // A4 width
            element.style.background = '#fff';

            const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
            
            // Restore styling
            element.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${tc.tcNo ? tc.tcNo.replace(/\//g, '-') : 'TC'}.pdf`);
            
            if (isTemp) setPreviewTc(null);
        } catch (err) {
            console.error("Download failed", err);
            customAlert("Failed to download PDF.");
        } finally {
            setGenerating(false);
        }
    };

    /* ── Normalize class name helper ── */
    const normalizeClass = (cls) => {
        if (!cls) return '';
        return cls.replace(/Grade\s+/i, '').replace(/Class\s+/i, '').trim();
    };

    /* ── Search students ── */
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

            if (formData.batch) {
                data = data.filter(s => s.batch === formData.batch || s.academicYear === formData.batch);
            }

            if (formData.keyword) {
                const kw = formData.keyword.toLowerCase();
                data = data.filter(s => `${s.firstName || ''} ${s.lastName || ''} ${s.admissionNo || ''} ${s.rollNo || ''} ${s.fatherName || ''}`.toLowerCase().includes(kw));
            }
            setResults(data);
            setHasSearched(true);
        } catch (err) {
            console.error("Search failed", err);
            setResults([]);
            setHasSearched(true);
        }
    };

    /* ── Open TC generation form ── */
    const openTcForm = (student) => {
        setSelectedStudent(student);
        let dobWords = '';
        if (student.dateOfBirth) dobWords = dateToWords(student.dateOfBirth);
        
        let scStValue = '';
        if (student.category && ['SC', 'ST', 'OBC'].includes(student.category.toUpperCase())) {
            scStValue = student.category.toUpperCase();
        }

        setTcForm({
            ...DEFAULT_TC_FORM,
            scSt: scStValue,
            dobInWords: dobWords,
            dateOfFirstAdmission: student.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : '',
            firstAdmissionClass: '',
            classLastStudied: student.class || '',
            dateOfApplication: new Date().toISOString().split('T')[0],
            dateOfIssue: new Date().toISOString().split('T')[0],
        });
        setActiveView('generate');
    };

    /* ── Generate TC ── */
    const handleGenerate = async () => {
        if (!tcForm.dateOfLeaving || !tcForm.reasonForLeaving) return await customAlert('Please fill Date of Leaving and Reason for Leaving.');
        setGenerating(true);
        try {
            const body = {
                studentId: selectedStudent.id,
                studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
                class: selectedStudent.class,
                section: selectedStudent.section,
                admissionNo: selectedStudent.admissionNo,
                admissionDate: selectedStudent.admissionDate,
                dateOfBirth: selectedStudent.dateOfBirth,
                fatherName: selectedStudent.fatherName,
                motherName: selectedStudent.motherName || '',
                ...tcForm,
            };
            const tc = {
                ...body,
                tcNo: `TC/${new Date().getFullYear()}/${tcList.length + 101}`,
                _id: Date.now()
            };
            setTcList([tc, ...tcList]);
            await customAlert(`TC Generated! TC No: ${tc.tcNo}`);
            setActiveView('search');
            setResults(results.filter(r => r.id !== selectedStudent.id));
        } catch { await customAlert('Failed to generate TC'); }
        finally { setGenerating(false); }
    };

    /* ── Update form helper ── */
    const u = (field) => (e) => setTcForm({ ...tcForm, [field]: e.target.value });

    return (
        <div className="tc-page animate-fade-in">
            <div className="page-header">
                <div>
                    <div className="page-breadcrumb">
                        <Link to="/">Dashboard</Link><span className="separator">/</span><span>Transfer Certificate</span>
                    </div>
                    <h1>Transfer Certificate (TC)</h1>
                </div>
            </div>

            {/* ═══════ SEARCH VIEW ═══════ */}
            {activeView === 'search' && (
                <>
                    <div className="card tc-filter-card">
                        <form onSubmit={handleSearch}>
                            <div className="form-grid-3">
                                <div className="form-group">
                                    <label className="form-label">Batch</label>
                                    <select className="form-select" value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })}>
                                        {getBatches().map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
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
                            </div>
                            <div className="form-group" style={{ marginTop: 20 }}>
                                <label className="form-label">Search Student</label>
                                <input type="text" className="form-input" placeholder="Search by name, admission no..." value={formData.keyword} onChange={e => setFormData({ ...formData, keyword: e.target.value })} />
                            </div>
                            <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                                <button type="submit" className="btn btn-primary"><Search size={18} /> Search</button>
                            </div>
                        </form>
                    </div>

                    {hasSearched && (
                        <div className="card tc-results-card animate-slide-up" style={{ marginTop: 24 }}>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead><tr><th>Adm No</th><th>Student</th><th>Class</th><th>Father</th><th>Contact</th><th style={{ textAlign: 'center' }}>Action</th></tr></thead>
                                    <tbody>
                                        {results.length > 0 ? results.map(s => {
                                            const sId = s.id || s._id;
                                            return (
                                                <tr key={sId}>
                                                    <td>{s.admissionNo}</td>
                                                    <td className="fw-600">{(s.firstName || '') + ' ' + (s.lastName || '')}</td>
                                                    <td>{s.class} - {s.section}</td>
                                                    <td>{s.fatherName}</td>
                                                    <td>{s.contactNo}</td>
                                                    <td><div className="action-buttons-center"><button className="btn btn-primary btn-sm" onClick={() => openTcForm(s)}>Generate TC</button></div></td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr><td colSpan="6"><div className="empty-state"><FileText size={48} /><h3>No Active Students Found</h3></div></td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ─── Recently Issued TCs ─── */}
                    {tcList.length > 0 && (
                        <div className="card" style={{ marginTop: 24, padding: 24 }}>
                            <h3 style={{ marginBottom: 16 }}>Recently Issued TCs</h3>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead><tr><th>TC No</th><th>Student</th><th>Class</th><th>Date of Leaving</th><th>Reason</th><th>Conduct</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {tcList.map(tc => (
                                            <tr key={tc.tcNo}>
                                                <td className="fw-600">{tc.tcNo}</td>
                                                <td>{tc.studentName}</td>
                                                <td>{tc.class} - {tc.section}</td>
                                                <td>{new Date(tc.dateOfLeaving).toLocaleDateString('en-IN')}</td>
                                                <td>{tc.reasonForLeaving}</td>
                                                <td><span className="badge badge-success">{tc.generalConduct || tc.conduct}</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button className="btn-icon" onClick={() => handleViewTc(tc)} title="View"><Eye size={16} /></button>
                                                        <button className="btn-icon" onClick={() => handlePrintTc(tc)} title="Print"><Printer size={16} /></button>
                                                        <button className="btn-icon" onClick={() => handleDownloadTc(tc)} title="Download"><Download size={16} /></button>
                                                        <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteTc(tc.tcNo)} title="Delete"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ GENERATE VIEW — Full 22-field form ═══════ */}
            {activeView === 'generate' && selectedStudent && (
                <div className="card tc-generate-card">
                    <h3 className="tc-gen-title">Generate TC for {selectedStudent.firstName} {selectedStudent.lastName}</h3>

                    {/* Student info summary */}
                    <div className="tc-student-summary">
                        <div><span>Admission No</span><p>{selectedStudent.admissionNo}</p></div>
                        <div><span>Class</span><p>{selectedStudent.class} - {selectedStudent.section}</p></div>
                        <div><span>Father's Name</span><p>{selectedStudent.fatherName}</p></div>
                        <div><span>Date of Birth</span><p>{selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-IN') : '—'}</p></div>
                    </div>

                    {/* ── Group 1: Personal ── */}
                    <fieldset className="tc-fieldset">
                        <legend>Personal Details</legend>
                        <div className="tc-form-grid">
                            <div className="form-group">
                                <label className="form-label">Nationality</label>
                                <input type="text" className="form-input" value={tcForm.nationality} onChange={u('nationality')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Whether S.C. or S.T.</label>
                                <input type="text" className="form-input" value={tcForm.scSt} onChange={u('scSt')} placeholder="e.g. General, SC, ST, OBC" />
                            </div>
                            <div className="form-group span-2">
                                <label className="form-label">Date of Birth (in words)</label>
                                <input type="text" className="form-input" value={tcForm.dobInWords} onChange={u('dobInWords')} placeholder="e.g. Fifteenth March Two Thousand Ten" />
                            </div>
                        </div>
                    </fieldset>

                    {/* ── Group 2: Admission & Class ── */}
                    <fieldset className="tc-fieldset">
                        <legend>Admission &amp; Class Details</legend>
                        <div className="tc-form-grid">
                            <div className="form-group">
                                <label className="form-label">Date of First Admission</label>
                                <input type="date" className="form-input" value={tcForm.dateOfFirstAdmission} onChange={u('dateOfFirstAdmission')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">First Admission Class</label>
                                <select className="form-select" value={tcForm.firstAdmissionClass} onChange={u('firstAdmissionClass')}>
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Class Last Studied</label>
                                <input type="text" className="form-input" value={tcForm.classLastStudied} onChange={u('classLastStudied')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Board/Annual Exam Result</label>
                                <input type="text" className="form-input" value={tcForm.boardExamResult} onChange={u('boardExamResult')} placeholder="e.g. Passed, Appeared" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Whether Failed</label>
                                <select className="form-select" value={tcForm.whetherFailed} onChange={u('whetherFailed')}>
                                    <option value="No">No</option>
                                    <option value="Yes, Once">Yes, Once</option>
                                    <option value="Yes, Twice">Yes, Twice</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* ── Group 3: Subjects & Promotion ── */}
                    <fieldset className="tc-fieldset">
                        <legend>Subjects &amp; Promotion</legend>
                        <div className="tc-form-grid">
                            <div className="form-group span-2">
                                <label className="form-label">Subjects – Compulsory</label>
                                <select className="form-select" value={tcForm.subjectsCompulsory} onChange={u('subjectsCompulsory')}>
                                    <option value="">Select Subject</option>
                                    {academicSubjects.length > 0 
                                        ? academicSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                                        : <><option value="Mathematics">Mathematics</option><option value="Science">Science</option><option value="English">English</option><option value="Hindi">Hindi</option><option value="Computer Science">Computer Science</option></>
                                    }
                                </select>
                            </div>
                            <div className="form-group span-2">
                                <label className="form-label">Subjects – Elective</label>
                                <select className="form-select" value={tcForm.subjectsElective} onChange={u('subjectsElective')}>
                                    <option value="">Select Subject</option>
                                    {academicSubjects.length > 0 
                                        ? academicSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                                        : <><option value="Mathematics">Mathematics</option><option value="Science">Science</option><option value="English">English</option><option value="Hindi">Hindi</option><option value="Computer Science">Computer Science</option></>
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Qualified for Promotion?</label>
                                <select className="form-select" value={tcForm.qualifiedForPromotion} onChange={u('qualifiedForPromotion')}>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Promotion Class (figures)</label>
                                <select className="form-select" value={tcForm.promotionClass} onChange={(e) => {
                                    const val = e.target.value;
                                    setTcForm({ ...tcForm, promotionClass: val, promotionClassWords: classToWords(val) });
                                }}>
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Promotion Class (words)</label>
                                <input type="text" className="form-input" value={tcForm.promotionClassWords} onChange={u('promotionClassWords')} placeholder="e.g. Sixth" />
                            </div>
                        </div>
                    </fieldset>

                    {/* ── Group 4: Fees & Attendance ── */}
                    <fieldset className="tc-fieldset">
                        <legend>Fees &amp; Attendance</legend>
                        <div className="tc-form-grid">
                            <div className="form-group">
                                <label className="form-label">Month Fees Paid Up To</label>
                                <input type="text" className="form-input" value={tcForm.monthFeesPaid} onChange={u('monthFeesPaid')} placeholder="e.g. March 2025" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fee Concession</label>
                                <input type="text" className="form-input" value={tcForm.feeConcession} onChange={u('feeConcession')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Total Working Days</label>
                                <input type="text" className="form-input" value={tcForm.totalWorkingDays} onChange={u('totalWorkingDays')} placeholder="e.g. 220" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Total Days Present</label>
                                <input type="text" className="form-input" value={tcForm.totalDaysPresent} onChange={u('totalDaysPresent')} placeholder="e.g. 200" />
                            </div>
                        </div>
                    </fieldset>

                    {/* ── Group 5: Leaving & Conduct ── */}
                    <fieldset className="tc-fieldset">
                        <legend>Leaving Details</legend>
                        <div className="tc-form-grid">
                            <div className="form-group span-2">
                                <label className="form-label">Whether NCC Cadet/Boy Scout/Girl Guide</label>
                                <input type="text" className="form-input" value={tcForm.ncc} onChange={u('ncc')} placeholder="e.g. No" />
                            </div>
                            <div className="form-group span-2">
                                <label className="form-label">Games played or extra-curricular activities</label>
                                <input type="text" className="form-input" value={tcForm.gamesPlayed} onChange={u('gamesPlayed')} placeholder="e.g. Football, Debate" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date of Leaving <span className="required">*</span></label>
                                <input type="date" className="form-input" value={tcForm.dateOfLeaving} onChange={u('dateOfLeaving')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Reason for Leaving <span className="required">*</span></label>
                                <input type="text" className="form-input" value={tcForm.reasonForLeaving} onChange={u('reasonForLeaving')} placeholder="e.g. Transfer, Relocation" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">General Conduct</label>
                                <select className="form-select" value={tcForm.generalConduct} onChange={u('generalConduct')}>
                                    {['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Medium of Instruction</label>
                                <select className="form-select" value={tcForm.medium} onChange={u('medium')}>
                                    <option value="English">English</option><option value="Hindi">Hindi</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date of Application</label>
                                <input type="date" className="form-input" value={tcForm.dateOfApplication} onChange={u('dateOfApplication')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date of Issue</label>
                                <input type="date" className="form-input" value={tcForm.dateOfIssue} onChange={u('dateOfIssue')} />
                            </div>
                            <div className="form-group span-2">
                                <label className="form-label">Other Remarks</label>
                                <input type="text" className="form-input" value={tcForm.otherRemarks} onChange={u('otherRemarks')} placeholder="Any other remarks..." />
                            </div>
                        </div>
                    </fieldset>

                    <div className="tc-gen-actions">
                        <button className="btn btn-outline" onClick={() => setActiveView('search')}>Cancel</button>
                        <button className="btn btn-outline" onClick={() => {
                            const preview = {
                                studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
                                class: selectedStudent.class,
                                section: selectedStudent.section,
                                admissionNo: selectedStudent.admissionNo,
                                admissionDate: selectedStudent.admissionDate,
                                dateOfBirth: selectedStudent.dateOfBirth,
                                fatherName: selectedStudent.fatherName,
                                motherName: selectedStudent.motherName || '',
                                tcNo: `TC/${new Date().getFullYear()}/PREVIEW`,
                                ...tcForm,
                            };
                            setPreviewTc(preview);
                        }}><Eye size={16} /> Preview TC</button>
                        <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                            {generating ? 'Generating...' : 'Generate TC'}
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════ PREVIEW MODAL (Portal) ═══════ */}
            {previewTc && ReactDOM.createPortal(
                <div className="tc-modal-overlay">
                    <div className="tc-modal-container">
                        <div className="tc-modal-header">
                            <h2>Transfer Certificate Preview</h2>
                            <div className="tc-modal-actions">
                                <button className="btn btn-outline" onClick={() => setPreviewTc(null)}>Close</button>
                                <button className="btn btn-outline" onClick={() => handleDownloadTc(previewTc)} disabled={generating}><Download size={16} /> {generating ? 'Downloading...' : 'Download'}</button>
                                <button className="btn btn-primary" onClick={() => handlePrintTc(previewTc)}><Printer size={16} /> Print</button>
                            </div>
                        </div>
                        <div className="tc-modal-body">
                            <TcPreviewContent tc={previewTc} />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
