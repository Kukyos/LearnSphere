const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../db');
const { generateToken } = require('../middleware/authMiddleware');
const { sendPasswordResetEmail } = require('../services/emailService');

const SALT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY_HOURS = 1;

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {Object} { valid: boolean, message?: string }
 */
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
};

/**
 * Register a new user
 * POST /auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Admin accounts are seeded only — cannot register as admin
    const validRoles = ['learner', 'instructor'];
    const userRole = role && validRoles.includes(role) ? role : 'learner';

    // Check for duplicate email
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, avatar, points, badge, created_at`,
      [name.trim(), email.toLowerCase(), passwordHash, userRole]
    );

    const user = result.rows[0];

    // Generate token
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          points: user.points || 0,
          badge: user.badge || 'Beginner',
          createdAt: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
    });
  }
};

/**
 * Login user
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const result = await db.query(
      'SELECT id, name, email, password_hash, role, avatar, points, badge FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          points: user.points || 0,
          badge: user.badge || 'Beginner',
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
    });
  }
};

/**
 * Request password reset — resets to a temporary password and emails it.
 * POST /auth/forgot
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user
    const userResult = await db.query(
      'SELECT id, email, name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Always return success to prevent email enumeration
    if (userResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a temporary password has been sent.',
      });
    }

    const user = userResult.rows[0];

    // Generate a random temporary password: TempXXXXXX! (meets validation)
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    const tempPassword = `Temp${randomPart}1!`;

    // Hash and store the new password
    const passwordHash = await bcrypt.hash(tempPassword, SALT_ROUNDS);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, user.id]);

    // Send email with the temporary password
    try {
      await sendPasswordResetEmail(user.email, tempPassword);
      console.log(`Password reset email sent to ${user.email}`);
    } catch (emailErr) {
      console.error('Failed to send reset email:', emailErr.message);
      // Still return success — password IS reset, email just failed
    }

    return res.status(200).json({
      success: true,
      message: 'If the email exists, a temporary password has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Password reset request failed. Please try again.',
    });
  }
};

/**
 * Reset password with token
 * POST /auth/reset
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Hash the token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid token
    const tokenResult = await db.query(
      `SELECT prt.id, prt.user_id, prt.expires_at
       FROM password_reset_tokens prt
       WHERE prt.token = $1 AND prt.expires_at > NOW()`,
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    const resetRecord = tokenResult.rows[0];

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update user password
    await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, resetRecord.user_id]
    );

    // Delete used token
    await db.query(
      'DELETE FROM password_reset_tokens WHERE id = $1',
      [resetRecord.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Password reset failed. Please try again.',
    });
  }
};

/**
 * Get current user profile
 * GET /auth/me
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT id, name, email, role, avatar, points, badge, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          points: user.points || 0,
          badge: user.badge || 'Beginner',
          createdAt: user.created_at,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};

/**
 * Update user profile
 * PUT /auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar } = req.body;

    const result = await db.query(
      `UPDATE users SET
         name = COALESCE($1, name),
         avatar = COALESCE($2, avatar)
       WHERE id = $3
       RETURNING id, name, email, role, avatar, points, badge`,
      [name, avatar, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
    return res.json({
      success: true,
      data: {
        user: {
          id: user.id, name: user.name, email: user.email, role: user.role,
          avatar: user.avatar, points: user.points || 0, badge: user.badge || 'Beginner',
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

/**
 * Change password
 * PUT /auth/password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ success: false, message: passwordValidation.message });
    }
    const userResult = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const match = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!match) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

/**
 * List all users (admin only)
 * GET /auth/users
 */
const listUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, avatar, points, badge, created_at FROM users ORDER BY created_at DESC'
    );
    return res.json({
      success: true,
      data: {
        users: result.rows.map(u => ({
          id: u.id, name: u.name, email: u.email, role: u.role,
          avatar: u.avatar, points: u.points || 0, badge: u.badge || 'Beginner',
          createdAt: u.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('List users error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

/**
 * Update a user's role (admin only)
 * PUT /auth/users/:id/role
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const roles = ['learner', 'instructor', 'admin'];
    if (!role || !roles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, message: 'Role updated', data: { user: result.rows[0] } });
  } catch (error) {
    console.error('Update user role error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update role' });
  }
};

/**
 * Delete a user (admin only)
 * DELETE /auth/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    return res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  listUsers,
  updateUserRole,
  deleteUser,
};
