const db = require('../db');

/**
 * POST /enroll/:courseId
 * Enroll in a course
 */
const enroll = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check course exists
    const course = await db.query('SELECT id FROM courses WHERE id = $1', [courseId]);
    if (course.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existing = await db.query(
      'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.user.id, courseId]
    );
    if (existing.rows.length > 0) {
      return res.json({ success: true, message: 'Already enrolled' });
    }

    await db.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)',
      [req.user.id, courseId]
    );

    return res.status(201).json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Enroll error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to enroll' });
  }
};

/**
 * GET /enroll/my
 * Get current user's enrollments with progress
 */
const getMyEnrollments = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT e.*, c.title AS course_title, c.cover_image
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = $1
       ORDER BY e.enrolled_date DESC`,
      [req.user.id]
    );

    // For each enrollment, get lesson progress
    for (const enrollment of result.rows) {
      const progress = await db.query(
        `SELECT lp.lesson_id, lp.completed
         FROM lesson_progress lp
         WHERE lp.user_id = $1 AND lp.course_id = $2`,
        [req.user.id, enrollment.course_id]
      );
      enrollment.lessons_progress = progress.rows;
    }

    return res.json({ success: true, data: { enrollments: result.rows } });
  } catch (error) {
    console.error('Get enrollments error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch enrollments' });
  }
};

/**
 * POST /progress/lesson
 * Mark a lesson as completed
 */
const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({ success: false, message: 'courseId and lessonId are required' });
    }

    await db.query(
      `INSERT INTO lesson_progress (user_id, lesson_id, course_id, completed, completed_at)
       VALUES ($1, $2, $3, true, NOW())
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, completed_at = NOW()`,
      [req.user.id, lessonId, courseId]
    );

    // Check if all lessons in course are complete
    const totalLessons = await db.query('SELECT COUNT(*) FROM lessons WHERE course_id = $1', [courseId]);
    const completedLessons = await db.query(
      'SELECT COUNT(*) FROM lesson_progress WHERE user_id = $1 AND course_id = $2 AND completed = true',
      [req.user.id, courseId]
    );

    if (parseInt(completedLessons.rows[0].count) >= parseInt(totalLessons.rows[0].count) && parseInt(totalLessons.rows[0].count) > 0) {
      // Mark enrollment as completed
      await db.query(
        `UPDATE enrollments SET completed_date = NOW() WHERE user_id = $1 AND course_id = $2`,
        [req.user.id, courseId]
      );
      // Award points
      await db.query(
        `UPDATE users SET points = points + 10 WHERE id = $1`,
        [req.user.id]
      );
    }

    return res.json({ success: true, message: 'Lesson progress updated' });
  } catch (error) {
    console.error('Complete lesson error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update progress' });
  }
};

/**
 * GET /progress/:courseId
 * Get user's progress for a specific course
 */
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await db.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.user.id, courseId]
    );

    const progress = await db.query(
      'SELECT lesson_id, completed, completed_at FROM lesson_progress WHERE user_id = $1 AND course_id = $2',
      [req.user.id, courseId]
    );

    return res.json({
      success: true,
      data: {
        enrolled: enrollment.rows.length > 0,
        enrollment: enrollment.rows[0] || null,
        lessonsProgress: progress.rows,
      },
    });
  } catch (error) {
    console.error('Get progress error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch progress' });
  }
};

/**
 * POST /reviews
 * Add or update a review
 */
const addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    if (!courseId || !rating) {
      return res.status(400).json({ success: false, message: 'courseId and rating are required' });
    }

    const result = await db.query(
      `INSERT INTO reviews (user_id, course_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, course_id)
       DO UPDATE SET rating = $3, comment = $4, created_at = NOW()
       RETURNING *`,
      [req.user.id, courseId, rating, comment || '']
    );

    // Update course average rating
    const avg = await db.query(
      'SELECT AVG(rating)::numeric(3,2) AS avg_rating FROM reviews WHERE course_id = $1',
      [courseId]
    );
    await db.query('UPDATE courses SET rating = $1 WHERE id = $2', [avg.rows[0].avg_rating, courseId]);

    return res.status(201).json({ success: true, data: { review: result.rows[0] } });
  } catch (error) {
    console.error('Add review error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to add review' });
  }
};

/**
 * GET /reviews/:courseId
 * Get reviews for a course
 */
const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const result = await db.query(
      `SELECT r.*, u.name AS user_name, u.avatar AS user_avatar
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.course_id = $1 ORDER BY r.created_at DESC`,
      [courseId]
    );

    return res.json({ success: true, data: { reviews: result.rows } });
  } catch (error) {
    console.error('Get reviews error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

/**
 * GET /reporting
 * Admin/instructor reporting data
 */
const getReportingData = async (req, res) => {
  try {
    let courseFilter = '';
    let params = [];

    if (req.user.role === 'instructor') {
      courseFilter = 'WHERE c.instructor_id = $1';
      params = [req.user.id];
    }

    // Total courses
    const coursesRes = await db.query(
      `SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE published = true) AS published FROM courses c ${courseFilter}`,
      params
    );

    // Total enrollments
    const enrollmentsRes = await db.query(
      `SELECT COUNT(*) AS total FROM enrollments e
       JOIN courses c ON c.id = e.course_id ${courseFilter}`,
      params
    );

    // Completions
    const completionsRes = await db.query(
      `SELECT COUNT(*) AS total FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       ${courseFilter ? courseFilter + ' AND' : 'WHERE'} e.completed_date IS NOT NULL`,
      params
    );

    // Average rating
    const ratingRes = await db.query(
      `SELECT AVG(r.rating)::numeric(3,2) AS avg FROM reviews r
       JOIN courses c ON c.id = r.course_id ${courseFilter}`,
      params
    );

    // Per-enrollment rows for the table
    const rowsRes = await db.query(
      `SELECT
         e.id AS enrollment_id,
         c.title AS course_name,
         u.name AS participant_name,
         e.enrolled_date,
         e.start_date,
         e.completed_date,
         (SELECT COUNT(*) FROM lessons l2 WHERE l2.course_id = c.id) AS total_lessons,
         (SELECT COUNT(*) FROM lesson_progress lp WHERE lp.user_id = u.id AND lp.course_id = c.id AND lp.completed = true) AS completed_lessons
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       JOIN users u ON u.id = e.user_id
       ${courseFilter}
       ORDER BY e.enrolled_date DESC`,
      params
    );

    const rows = rowsRes.rows.map((r, i) => {
      const totalL = parseInt(r.total_lessons) || 1;
      const completedL = parseInt(r.completed_lessons) || 0;
      const completion = Math.round((completedL / totalL) * 100);
      let status = 'Yet to Start';
      if (r.completed_date) status = 'Completed';
      else if (completedL > 0 || r.start_date) status = 'In Progress';
      return {
        srNo: i + 1,
        courseName: r.course_name,
        participantName: r.participant_name,
        enrolledDate: r.enrolled_date?.toISOString().split('T')[0] || '',
        startDate: r.start_date?.toISOString().split('T')[0] || '-',
        timeSpent: completedL > 0 ? `${completedL * 15}m` : '-',
        completion,
        completedDate: r.completed_date?.toISOString().split('T')[0] || '-',
        status,
      };
    });

    return res.json({
      success: true,
      data: {
        totalCourses: parseInt(coursesRes.rows[0].total),
        publishedCourses: parseInt(coursesRes.rows[0].published),
        totalParticipants: parseInt(enrollmentsRes.rows[0].total),
        completed: parseInt(completionsRes.rows[0].total),
        averageRating: parseFloat(ratingRes.rows[0].avg) || 0,
        rows,
      },
    });
  } catch (error) {
    console.error('Reporting error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch reporting data' });
  }
};

/**
 * POST /points/award
 * Award points to a user (for quiz completion, etc.)
 */
const awardPoints = async (req, res) => {
  try {
    const { points } = req.body;
    const amount = parseInt(points) || 0;
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Points must be positive' });
    }

    await db.query('UPDATE users SET points = points + $1 WHERE id = $2', [amount, req.user.id]);

    // Update badge based on new points
    const user = await db.query('SELECT points FROM users WHERE id = $1', [req.user.id]);
    const p = user.rows[0].points;
    let badge = 'Beginner';
    if (p >= 120) badge = 'Master';
    else if (p >= 100) badge = 'Expert';
    else if (p >= 80) badge = 'Specialist';
    else if (p >= 60) badge = 'Achiever';
    else if (p >= 40) badge = 'Explorer';
    else if (p >= 20) badge = 'Newbie';

    await db.query('UPDATE users SET badge = $1 WHERE id = $2', [badge, req.user.id]);

    return res.json({ success: true, data: { points: p, badge } });
  } catch (error) {
    console.error('Award points error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to award points' });
  }
};

module.exports = {
  enroll,
  getMyEnrollments,
  completeLesson,
  getCourseProgress,
  addReview,
  getCourseReviews,
  getReportingData,
  awardPoints,
};
