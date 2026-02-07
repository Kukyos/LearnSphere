const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Optional auth middleware — attaches user if token present, but doesn't block
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  const jwt = require('jsonwebtoken');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
  } catch (_) { /* ignore invalid tokens */ }
  next();
};

// Public (with optional auth for instructors to see their drafts)
router.get('/', optionalAuth, courseController.listCourses);
router.get('/:id', optionalAuth, courseController.getCourse);

// Protected — instructor/admin only
router.post('/', authenticateToken, authorizeRoles('instructor', 'admin'), courseController.createCourse);
router.put('/:id', authenticateToken, authorizeRoles('instructor', 'admin'), courseController.updateCourse);
router.delete('/:id', authenticateToken, authorizeRoles('instructor', 'admin'), courseController.deleteCourse);

// Lessons — instructor/admin only
router.post('/:courseId/lessons', authenticateToken, authorizeRoles('instructor', 'admin'), courseController.addLesson);
router.put('/:courseId/lessons/:lessonId', authenticateToken, authorizeRoles('instructor', 'admin'), courseController.updateLesson);
router.delete('/:courseId/lessons/:lessonId', authenticateToken, authorizeRoles('instructor', 'admin'), courseController.deleteLesson);

// Quiz questions — instructor/admin only
router.post('/:courseId/lessons/:lessonId/quiz', authenticateToken, authorizeRoles('instructor', 'admin'), courseController.setQuizQuestions);

module.exports = router;
