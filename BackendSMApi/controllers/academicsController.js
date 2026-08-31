const AcademicClass = require('../models/AcademicClass');
const AcademicSubject = require('../models/AcademicSubject');
const SubjectTeacherAssignment = require('../models/SubjectTeacherAssignment');
const AcademicYear = require('../models/AcademicYear');

// --- Academic Years ---

exports.getAcademicYears = async (req, res) => {
    try {
        const years = await AcademicYear.find().sort({ createdAt: -1 });
        res.json(years);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createAcademicYear = async (req, res) => {
    try {
        const { label, startDate, endDate, active } = req.body;
        
        if (active) {
            // Unset active for all others in this tenant
            await AcademicYear.updateMany({}, { active: false });
        }
        
        const year = new AcademicYear({ label, startDate, endDate, active });
        await year.save();
        res.status(201).json(year);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, startDate, endDate, active } = req.body;

        if (active) {
            await AcademicYear.updateMany({}, { active: false });
        }
        
        const year = await AcademicYear.findByIdAndUpdate(id, { label, startDate, endDate, active }, { new: true });
        res.json(year);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAcademicYear = async (req, res) => {
    try {
        await AcademicYear.findByIdAndDelete(req.params.id);
        res.json({ message: 'Academic Year deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Classes & Sections ---

exports.getClasses = async (req, res) => {
    try {
        const classes = await AcademicClass.find().sort({ createdAt: 1 });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { className, sections } = req.body;
        
        let academicClass = await AcademicClass.findOne({ className });
        if (academicClass) {
            // Merge existing sections with new sections
            const existingSectionLabels = academicClass.sections.map(s => s.label);
            for (let sec of sections) {
                if (!existingSectionLabels.includes(sec.label)) {
                    academicClass.sections.push(sec);
                } else {
                    // Update existing section details if it exists
                    let existing = academicClass.sections.find(s => s.label === sec.label);
                    existing.capacity = sec.capacity;
                    existing.classTeacher = sec.classTeacher;
                }
            }
            await academicClass.save();
        } else {
            // Create new class
            academicClass = new AcademicClass({ className, sections });
            await academicClass.save();
        }
        
        res.status(201).json(academicClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        await AcademicClass.findByIdAndDelete(req.params.id);
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Subjects ---

exports.getSubjects = async (req, res) => {
    try {
        const subjects = await AcademicSubject.find().sort({ createdAt: 1 });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createSubject = async (req, res) => {
    try {
        const subject = new AcademicSubject(req.body);
        await subject.save();
        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await AcademicSubject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Teacher Assignments ---

exports.getAssignments = async (req, res) => {
    try {
        const { className, section } = req.query;
        let query = {};
        if (className) query.className = className;
        if (section) query.section = section;
        
        const assignments = await SubjectTeacherAssignment.find(query);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.saveAssignments = async (req, res) => {
    try {
        const { className, section, assignments } = req.body;
        
        let assignmentRecord = await SubjectTeacherAssignment.findOne({ className, section });
        if (assignmentRecord) {
            assignmentRecord.assignments = assignments;
            await assignmentRecord.save();
        } else {
            assignmentRecord = new SubjectTeacherAssignment({ className, section, assignments });
            await assignmentRecord.save();
        }
        
        res.status(200).json(assignmentRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
