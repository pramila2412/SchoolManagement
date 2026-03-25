const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const ExamTimetable = require('../models/ExamTimetable');
const ExamMarks = require('../models/ExamMarks');
const ExamResult = require('../models/ExamResult');
const GradeScale = require('../models/GradeScale');

// ======================== EXAMS CRUD ========================
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.json(exams);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json(exam);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ error: 'Exam not found' });
        res.json(exam);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!exam) return res.status(404).json({ error: 'Exam not found' });
        res.json(exam);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.params.id);
        await ExamTimetable.deleteMany({ exam: req.params.id });
        await ExamMarks.deleteMany({ exam: req.params.id });
        await ExamResult.deleteMany({ exam: req.params.id });
        res.json({ message: 'Exam and related data deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ======================== SUBJECTS PER EXAM ========================
router.post('/:id/subjects', async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ error: 'Exam not found' });
        const { className, sections, subjects } = req.body;
        const existingClass = exam.classes.find(c => c.className === className);
        if (existingClass) {
            existingClass.sections = sections || existingClass.sections;
            existingClass.subjects = subjects || existingClass.subjects;
        } else {
            exam.classes.push({ className, sections, subjects });
        }
        await exam.save();
        res.json(exam);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ======================== TIMETABLE ========================
router.get('/timetable', async (req, res) => {
    try {
        const { exam, className, section } = req.query;
        const filter = {};
        if (exam) filter.exam = exam;
        if (className) filter.className = className;
        if (section) filter.section = section;
        const timetables = await ExamTimetable.find(filter).populate('exam', 'name status').sort({ createdAt: -1 });
        res.json(timetables);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/timetable', async (req, res) => {
    try {
        const tt = await ExamTimetable.findOneAndUpdate(
            { exam: req.body.exam, className: req.body.className, section: req.body.section },
            req.body,
            { upsert: true, new: true, runValidators: true }
        );
        res.status(201).json(tt);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/timetable/:id/publish', async (req, res) => {
    try {
        const tt = await ExamTimetable.findByIdAndUpdate(req.params.id, { status: 'Published' }, { new: true });
        if (!tt) return res.status(404).json({ error: 'Timetable not found' });
        res.json(tt);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ======================== MARKS ========================
router.get('/marks', async (req, res) => {
    try {
        const { exam, className, section, subject } = req.query;
        const filter = {};
        if (exam) filter.exam = exam;
        if (className) filter.className = className;
        if (section) filter.section = section;
        if (subject) filter.subject = subject;
        const marks = await ExamMarks.find(filter).populate('exam', 'name').sort({ createdAt: -1 });
        res.json(marks);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/marks', async (req, res) => {
    try {
        // Validate marks against max values
        const { entries, maxTheoryMarks, maxPracticalMarks } = req.body;
        if (entries && entries.length > 0) {
            for (const entry of entries) {
                if (maxTheoryMarks && entry.theoryMarks > maxTheoryMarks) {
                    return res.status(400).json({ error: `Theory marks for ${entry.studentName} exceed maximum (${maxTheoryMarks})` });
                }
                if (maxPracticalMarks && entry.practicalMarks > maxPracticalMarks) {
                    return res.status(400).json({ error: `Practical marks for ${entry.studentName} exceed maximum (${maxPracticalMarks})` });
                }
                entry.totalMarks = (entry.theoryMarks || 0) + (entry.practicalMarks || 0);
                entry.status = 'Saved';
            }
        }
        const marks = await ExamMarks.findOneAndUpdate(
            { exam: req.body.exam, className: req.body.className, section: req.body.section, subject: req.body.subject },
            req.body,
            { upsert: true, new: true, runValidators: true }
        );
        res.status(201).json(marks);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ======================== RESULTS PROCESSING ========================
router.post('/results/process', async (req, res) => {
    try {
        const { examId, className, section } = req.body;
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ error: 'Exam not found' });

        // Get all marks for this exam/class/section
        const allMarks = await ExamMarks.find({ exam: examId, className, section });
        if (allMarks.length === 0) return res.status(400).json({ error: 'No marks found for this combination' });

        // Get grade scale
        const grades = await GradeScale.find().sort({ minPercentage: -1 });

        // Get class config for subjects
        const classConfig = exam.classes.find(c => c.className === className);
        if (!classConfig) return res.status(400).json({ error: 'Class not found in exam' });

        // Build student results
        const studentMap = {};
        for (const markSheet of allMarks) {
            for (const entry of markSheet.entries) {
                const key = entry.studentName;
                if (!studentMap[key]) {
                    studentMap[key] = {
                        studentId: entry.studentId,
                        studentName: entry.studentName,
                        rollNo: entry.rollNo,
                        subjects: [],
                        grandTotal: 0,
                        maxGrandTotal: 0,
                    };
                }
                const subjectConfig = classConfig.subjects.find(s => s.name === markSheet.subject);
                const maxMarks = subjectConfig?.totalMarks || markSheet.maxTotalMarks || 100;
                const passingMarks = subjectConfig?.passingMarks || 33;
                const passed = entry.totalMarks >= passingMarks;

                studentMap[key].subjects.push({
                    name: markSheet.subject,
                    code: markSheet.subjectCode,
                    theoryMarks: entry.theoryMarks,
                    practicalMarks: entry.practicalMarks,
                    totalMarks: entry.totalMarks,
                    maxMarks,
                    passingMarks,
                    passed,
                    grade: getGrade(grades, entry.totalMarks, maxMarks),
                });
                studentMap[key].grandTotal += entry.totalMarks;
                studentMap[key].maxGrandTotal += maxMarks;
            }
        }

        // Calculate percentage, grade, pass/fail
        const results = Object.values(studentMap).map(s => {
            s.percentage = s.maxGrandTotal > 0 ? Math.round((s.grandTotal / s.maxGrandTotal) * 10000) / 100 : 0;
            s.grade = getGrade(grades, s.grandTotal, s.maxGrandTotal);
            s.gpa = getGPA(grades, s.percentage);
            s.status = s.subjects.every(sub => sub.passed) ? 'Pass' : 'Fail';
            return s;
        });

        // Calculate ranks
        results.sort((a, b) => b.grandTotal - a.grandTotal);
        let currentRank = 1;
        results.forEach((r, i) => {
            if (i > 0 && r.grandTotal < results[i - 1].grandTotal) currentRank = i + 1;
            r.sectionRank = currentRank;
            r.classRank = currentRank; // Same as section for now
        });

        // Save results
        const savedResults = [];
        for (const r of results) {
            const result = await ExamResult.findOneAndUpdate(
                { exam: examId, studentName: r.studentName, className, section },
                { ...r, exam: examId, className, section },
                { upsert: true, new: true }
            );
            savedResults.push(result);
        }

        res.json({ message: `Results processed for ${savedResults.length} students`, results: savedResults });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/results', async (req, res) => {
    try {
        const { exam, className, section } = req.query;
        const filter = {};
        if (exam) filter.exam = exam;
        if (className) filter.className = className;
        if (section) filter.section = section;
        const results = await ExamResult.find(filter).populate('exam', 'name').sort({ sectionRank: 1 });
        res.json(results);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/results/publish', async (req, res) => {
    try {
        const { examId, className, section } = req.body;
        const filter = { exam: examId };
        if (className) filter.className = className;
        if (section) filter.section = section;
        await ExamResult.updateMany(filter, { published: true });
        await Exam.findByIdAndUpdate(examId, { status: 'Completed' });
        res.json({ message: 'Results published' });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ======================== GRADE SCALE ========================
router.get('/grades', async (req, res) => {
    try {
        const grades = await GradeScale.find().sort({ minPercentage: -1 });
        res.json(grades);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/grades', async (req, res) => {
    try {
        const grade = await GradeScale.create(req.body);
        res.status(201).json(grade);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/grades/:id', async (req, res) => {
    try {
        await GradeScale.findByIdAndDelete(req.params.id);
        res.json({ message: 'Grade deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ======================== ANALYTICS ========================
router.get('/analytics', async (req, res) => {
    try {
        const { examId, className, section } = req.query;
        const filter = {};
        if (examId) filter.exam = examId;
        if (className) filter.className = className;
        if (section) filter.section = section;

        const results = await ExamResult.find(filter);
        const totalStudents = results.length;
        const passCount = results.filter(r => r.status === 'Pass').length;
        const failCount = totalStudents - passCount;
        const avgPercentage = totalStudents > 0 ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / totalStudents * 100) / 100 : 0;
        const topPerformers = [...results].sort((a, b) => b.percentage - a.percentage).slice(0, 10);

        // Subject-wise analysis
        const subjectStats = {};
        results.forEach(r => {
            r.subjects.forEach(s => {
                if (!subjectStats[s.name]) subjectStats[s.name] = { total: 0, count: 0, highest: 0, lowest: Infinity, passCount: 0 };
                subjectStats[s.name].total += s.totalMarks;
                subjectStats[s.name].count += 1;
                subjectStats[s.name].highest = Math.max(subjectStats[s.name].highest, s.totalMarks);
                subjectStats[s.name].lowest = Math.min(subjectStats[s.name].lowest, s.totalMarks);
                if (s.passed) subjectStats[s.name].passCount += 1;
            });
        });
        const subjectAnalysis = Object.entries(subjectStats).map(([name, s]) => ({
            name, average: Math.round(s.total / s.count * 100) / 100, highest: s.highest,
            lowest: s.lowest === Infinity ? 0 : s.lowest, passRate: Math.round(s.passCount / s.count * 10000) / 100,
        }));

        res.json({ totalStudents, passCount, failCount, avgPercentage, passRate: totalStudents > 0 ? Math.round(passCount / totalStudents * 10000) / 100 : 0, topPerformers, subjectAnalysis });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ======================== HELPERS ========================
function getGrade(grades, marks, maxMarks) {
    if (!grades || grades.length === 0) return '—';
    const pct = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;
    const g = grades.find(g => pct >= g.minPercentage && pct <= g.maxPercentage);
    return g ? g.label : '—';
}

function getGPA(grades, percentage) {
    if (!grades || grades.length === 0) return 0;
    const g = grades.find(g => percentage >= g.minPercentage && percentage <= g.maxPercentage);
    return g?.gpa || 0;
}

module.exports = router;
