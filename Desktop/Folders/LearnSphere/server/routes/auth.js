const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /auth/forgot
 * @desc    Request password reset token
 * @access  Public
 */
router.post('/forgot', authController.forgotPassword);

/**
 * @route   POST /auth/reset
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset', authController.resetPassword);

/**
 * @route   GET /auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, authController.getProfile);

/**
 * @route   GET /auth/admin
 * @desc    Admin-only test route
 * @access  Private (Admin only)
 */
router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin access granted',
    data: { user: req.user },
  });
});

/**
 * @route   GET /auth/instructor
 * @desc    Instructor and admin test route
 * @access  Private (Instructor, Admin)
 */
router.get('/instructor', authenticateToken, authorizeRoles('instructor', 'admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Instructor access granted',
    data: { user: req.user },
  });
});

module.exports = router;
