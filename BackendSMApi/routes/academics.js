const express = require('express');
const router = express.Router();
const academicsController = require('../controllers/academicsController');

// Classes & Sections
router.get('/classes', academicsController.getClasses);
router.post('/classes', academicsController.createClass);
router.delete('/classes/:id', academicsController.deleteClass);

// Subjects
router.get('/subjects', academicsController.getSubjects);
router.post('/subjects', academicsController.createSubject);
router.delete('/subjects/:id', academicsController.deleteSubject);

// Teacher Assignments
router.get('/assignments', academicsController.getAssignments);
router.post('/assignments', academicsController.saveAssignments);

module.exports = router;
