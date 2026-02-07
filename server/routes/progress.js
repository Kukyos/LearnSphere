const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Enrollment
router.post('/enroll/:courseId', authenticateToken, progressController.enroll);
router.get('/enroll/my', authenticateToken, progressController.getMyEnrollments);

// Lesson progress
router.post('/progress/lesson', authenticateToken, progressController.completeLesson);
router.get('/progress/:courseId', authenticateToken, progressController.getCourseProgress);

// Reviews
router.post('/reviews', authenticateToken, progressController.addReview);
router.get('/reviews/:courseId', progressController.getCourseReviews);

// Reporting — instructor/admin only
router.get('/reporting', authenticateToken, authorizeRoles('instructor', 'admin'), progressController.getReportingData);

// Points
router.post('/points/award', authenticateToken, progressController.awardPoints);

module.exports = router;
