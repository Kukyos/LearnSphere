-- LearnSphere Database Schema
-- Run: psql -U postgres -d learnsphere -f schema.sql

-- ============================================================
-- USERS & AUTH
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'learner' CHECK (role IN ('learner', 'instructor', 'admin')),
    avatar TEXT,
    points INTEGER DEFAULT 0,
    badge TEXT DEFAULT 'Beginner',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    cover_image TEXT DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    rating NUMERIC(3,2) DEFAULT 0,
    visibility TEXT DEFAULT 'Everyone' CHECK (visibility IN ('Everyone', 'Signed In')),
    access TEXT DEFAULT 'Open' CHECK (access IN ('Open', 'On Invitation', 'On Payment')),
    price NUMERIC(10,2) DEFAULT 0,
    published BOOLEAN DEFAULT false,
    instructor_id INT REFERENCES users(id) ON DELETE SET NULL,
    instructor_name TEXT DEFAULT '',
    category TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'Beginner',
    views_count INT DEFAULT 0,
    total_duration TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    type TEXT DEFAULT 'document' CHECK (type IN ('video', 'document', 'image', 'quiz')),
    content TEXT DEFAULT '',
    duration TEXT DEFAULT '',
    download_allowed BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- QUIZZES (attached to lessons)
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    type TEXT DEFAULT 'mcq' CHECK (type IN ('mcq', 'fill_blank')),
    options TEXT[] NOT NULL DEFAULT '{}',
    correct_answer INT NOT NULL DEFAULT 0,
    correct_text TEXT DEFAULT '',
    sort_order INT DEFAULT 0
);

-- ============================================================
-- ENROLLMENTS & PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_date TIMESTAMP DEFAULT NOW(),
    start_date TIMESTAMP,
    completed_date TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id);

-- ============================================================
-- SEED: Run `npm run seed` after creating the tables above
-- to insert the default admin user.
-- Admin email:    admin@learnsphere.com
-- Admin password: Admin@123
-- ============================================================
