const db = require('../db');
const { sendCourseInvitationEmail, sendContactEmail } = require('../services/emailService');

/**
 * GET /courses
 * List all published courses (or all for instructors/admins)
 */
const listCourses = async (req, res) => {
  try {
    const isAuth = !!req.user;
    const isPrivileged = isAuth && (req.user.role === 'instructor' || req.user.role === 'admin');

    let query, params;
    if (isPrivileged) {
      // Instructors see their own, admins see all
      if (req.user.role === 'admin') {
        query = `SELECT c.*, 
                   (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrollment_count,
                   (SELECT COUNT(*) FROM reviews r WHERE r.course_id = c.id) AS review_count
                 FROM courses c ORDER BY c.created_at DESC`;
        params = [];
      } else {
        query = `SELECT c.*,
                   (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrollment_count,
                   (SELECT COUNT(*) FROM reviews r WHERE r.course_id = c.id) AS review_count
                 FROM courses c WHERE c.instructor_id = $1 OR c.published = true
                 ORDER BY c.created_at DESC`;
        params = [req.user.id];
      }
    } else {
      query = `SELECT c.*,
                 (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrollment_count,
                 (SELECT COUNT(*) FROM reviews r WHERE r.course_id = c.id) AS review_count
               FROM courses c WHERE c.published = true ORDER BY c.created_at DESC`;
      params = [];
    }

    const result = await db.query(query, params);

    // Attach lessons to each course
    for (const course of result.rows) {
      const lessons = await db.query(
        'SELECT * FROM lessons WHERE course_id = $1 ORDER BY sort_order',
        [course.id]
      );
      course.lessons = lessons.rows;

      // Attach quiz questions to quiz lessons
      for (const lesson of course.lessons) {
        if (lesson.type === 'quiz') {
          const questions = await db.query(
            'SELECT * FROM quiz_questions WHERE lesson_id = $1 ORDER BY sort_order',
            [lesson.id]
          );
          lesson.quiz = { questions: questions.rows };
        }
      }
    }

    return res.json({ success: true, data: { courses: result.rows } });
  } catch (error) {
    console.error('List courses error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};

/**
 * GET /courses/:id
 * Get single course with lessons
 */
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT c.*,
         (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrollment_count,
         (SELECT COUNT(*) FROM reviews r WHERE r.course_id = c.id) AS review_count
       FROM courses c WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const course = result.rows[0];

    // Attach lessons
    const lessons = await db.query(
      'SELECT * FROM lessons WHERE course_id = $1 ORDER BY sort_order',
      [course.id]
    );
    course.lessons = lessons.rows;

    for (const lesson of course.lessons) {
      if (lesson.type === 'quiz') {
        const questions = await db.query(
          'SELECT * FROM quiz_questions WHERE lesson_id = $1 ORDER BY sort_order',
          [lesson.id]
        );
        lesson.quiz = { questions: questions.rows };
      }
    }

    // Attach reviews
    const reviews = await db.query(
      `SELECT r.*, u.name AS user_name, u.avatar AS user_avatar
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.course_id = $1 ORDER BY r.created_at DESC`,
      [course.id]
    );
    course.reviews = reviews.rows;

    return res.json({ success: true, data: { course } });
  } catch (error) {
    console.error('Get course error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch course' });
  }
};

/**
 * POST /courses
 * Create a new course (instructor/admin only)
 */
const createCourse = async (req, res) => {
  try {
    const {
      title, shortDescription, description, coverImage,
      tags, visibility, access, price, published,
      category, difficulty, totalDuration
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const result = await db.query(
      `INSERT INTO courses (title, short_description, description, cover_image,
         tags, visibility, access, price, published, instructor_id, instructor_name,
         category, difficulty, total_duration)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        title,
        shortDescription || '',
        description || '',
        coverImage || '',
        tags || [],
        visibility || 'Everyone',
        access || 'Open',
        price || 0,
        published || false,
        req.user.id,
        req.user.name || '',
        category || '',
        difficulty || 'Beginner',
        totalDuration || ''
      ]
    );

    const course = result.rows[0];
    course.lessons = [];

    return res.status(201).json({ success: true, message: 'Course created', data: { course } });
  } catch (error) {
    console.error('Create course error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create course' });
  }
};

/**
 * PUT /courses/:id
 * Update a course (owner or admin only)
 */
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const existing = await db.query('SELECT instructor_id FROM courses WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    if (req.user.role !== 'admin' && existing.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this course' });
    }

    const {
      title, shortDescription, description, coverImage,
      tags, visibility, access, price, published,
      category, difficulty, totalDuration
    } = req.body;

    const result = await db.query(
      `UPDATE courses SET
         title = COALESCE($1, title),
         short_description = COALESCE($2, short_description),
         description = COALESCE($3, description),
         cover_image = COALESCE($4, cover_image),
         tags = COALESCE($5, tags),
         visibility = COALESCE($6, visibility),
         access = COALESCE($7, access),
         price = COALESCE($8, price),
         published = COALESCE($9, published),
         category = COALESCE($10, category),
         difficulty = COALESCE($11, difficulty),
         total_duration = COALESCE($12, total_duration),
         updated_at = NOW()
       WHERE id = $13
       RETURNING *`,
      [title, shortDescription, description, coverImage,
       tags, visibility, access, price, published,
       category, difficulty, totalDuration, id]
    );

    return res.json({ success: true, message: 'Course updated', data: { course: result.rows[0] } });
  } catch (error) {
    console.error('Update course error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update course' });
  }
};

/**
 * DELETE /courses/:id
 * Delete a course (owner or admin only)
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.query('SELECT instructor_id FROM courses WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    if (req.user.role !== 'admin' && existing.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await db.query('DELETE FROM courses WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('Delete course error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete course' });
  }
};

// ============================================================
// LESSONS
// ============================================================

/**
 * POST /courses/:courseId/lessons
 */
const addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, type, content, duration, downloadAllowed } = req.body;

    // Check course ownership
    const course = await db.query('SELECT instructor_id FROM courses WHERE id = $1', [courseId]);
    if (course.rows.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });
    if (req.user.role !== 'admin' && course.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const maxOrder = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM lessons WHERE course_id = $1', [courseId]);

    const result = await db.query(
      `INSERT INTO lessons (course_id, title, description, type, content, duration, download_allowed, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [courseId, title || '', description || '', type || 'document', content || '', duration || '', downloadAllowed || false, maxOrder.rows[0].next]
    );

    return res.status(201).json({ success: true, data: { lesson: result.rows[0] } });
  } catch (error) {
    console.error('Add lesson error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to add lesson' });
  }
};

/**
 * PUT /courses/:courseId/lessons/:lessonId
 */
const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, description, type, content, duration, downloadAllowed, sortOrder } = req.body;

    const result = await db.query(
      `UPDATE lessons SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         type = COALESCE($3, type),
         content = COALESCE($4, content),
         duration = COALESCE($5, duration),
         download_allowed = COALESCE($6, download_allowed),
         sort_order = COALESCE($7, sort_order)
       WHERE id = $8 RETURNING *`,
      [title, description, type, content, duration, downloadAllowed, sortOrder, lessonId]
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Lesson not found' });
    return res.json({ success: true, data: { lesson: result.rows[0] } });
  } catch (error) {
    console.error('Update lesson error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update lesson' });
  }
};

/**
 * DELETE /courses/:courseId/lessons/:lessonId
 */
const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    await db.query('DELETE FROM lessons WHERE id = $1', [lessonId]);
    return res.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    console.error('Delete lesson error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete lesson' });
  }
};

/**
 * POST /courses/:courseId/lessons/:lessonId/quiz
 * Add or replace quiz questions for a lesson
 */
const setQuizQuestions = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: 'questions array is required' });
    }

    // Check course ownership
    const course = await db.query('SELECT instructor_id FROM courses WHERE id = $1', [courseId]);
    if (course.rows.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });
    if (req.user.role !== 'admin' && course.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const lesson = await db.query('SELECT id FROM lessons WHERE id = $1 AND course_id = $2', [lessonId, courseId]);
    if (lesson.rows.length === 0) return res.status(404).json({ success: false, message: 'Lesson not found' });

    // Replace all questions
    await db.query('DELETE FROM quiz_questions WHERE lesson_id = $1', [lessonId]);
    const inserted = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const result = await db.query(
        `INSERT INTO quiz_questions (lesson_id, text, options, correct_answer, sort_order)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [lessonId, q.text || q.question, q.options, q.correctAnswer, i + 1]
      );
      inserted.push(result.rows[0]);
    }

    await db.query("UPDATE lessons SET type = 'quiz' WHERE id = $1", [lessonId]);
    return res.json({ success: true, data: { questions: inserted } });
  } catch (error) {
    console.error('Set quiz questions error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to save quiz questions' });
  }
};

/**
 * POST /courses/:courseId/invite
 * Send invitation emails for a course
 */
const inviteAttendees = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: 'emails array is required' });
    }

    const course = await db.query('SELECT title, instructor_id FROM courses WHERE id = $1', [courseId]);
    if (course.rows.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });
    if (req.user.role !== 'admin' && course.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const results = { sent: [], failed: [] };
    for (const email of emails) {
      try {
        await sendCourseInvitationEmail(email.trim(), course.rows[0].title, req.user.name || 'An instructor');
        results.sent.push(email.trim());
      } catch (err) {
        console.error(`Failed to send invite to ${email}:`, err.message);
        results.failed.push(email.trim());
      }
    }

    return res.json({
      success: true,
      message: `Sent ${results.sent.length} invitation(s)`,
      data: results,
    });
  } catch (error) {
    console.error('Invite attendees error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to send invitations' });
  }
};

/**
 * POST /courses/:courseId/contact
 * Send a message to all enrolled attendees
 */
const contactAttendees = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    const course = await db.query('SELECT title, instructor_id FROM courses WHERE id = $1', [courseId]);
    if (course.rows.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });
    if (req.user.role !== 'admin' && course.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get all enrolled users' emails
    const enrollments = await db.query(
      `SELECT u.email FROM enrollments e JOIN users u ON e.user_id = u.id WHERE e.course_id = $1`,
      [courseId]
    );

    const results = { sent: [], failed: [] };
    for (const row of enrollments.rows) {
      try {
        await sendContactEmail(row.email, subject, message, req.user.name || 'Instructor');
        results.sent.push(row.email);
      } catch (err) {
        console.error(`Failed to send contact email to ${row.email}:`, err.message);
        results.failed.push(row.email);
      }
    }

    return res.json({
      success: true,
      message: `Sent ${results.sent.length} email(s)`,
      data: results,
    });
  } catch (error) {
    console.error('Contact attendees error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to send messages' });
  }
};

module.exports = {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  setQuizQuestions,
  inviteAttendees,
  contactAttendees,
};
