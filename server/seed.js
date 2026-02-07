/**
 * LearnSphere Database Seed Script
 * Creates the default admin user.
 *
 * Usage:
 *   1. Ensure PostgreSQL is running and the database exists
 *   2. Run schema first:  npm run db:init
 *   3. Then seed:         npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');

const ADMIN_EMAIL = 'admin@learnsphere.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'LearnSphere Admin';

async function seed() {
  console.log('🌱 Seeding LearnSphere database...\n');

  try {
    // ── Admin user ─────────────────────────────────────────
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [ADMIN_EMAIL]);

    if (existing.rows.length > 0) {
      console.log('✅ Admin user already exists (id:', existing.rows[0].id, ')');
    } else {
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      const result = await db.query(
        `INSERT INTO users (name, email, password_hash, role, badge)
         VALUES ($1, $2, $3, 'admin', 'Admin')
         RETURNING id, name, email, role`,
        [ADMIN_NAME, ADMIN_EMAIL, hash]
      );
      const admin = result.rows[0];
      console.log('✅ Admin user created');
      console.log(`   ID    : ${admin.id}`);
      console.log(`   Name  : ${admin.name}`);
      console.log(`   Email : ${admin.email}`);
      console.log(`   Role  : ${admin.role}`);
    }

    console.log('\n📋 Admin credentials:');
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log('\n⚠️  Change the admin password after first login in production!\n');

    await db.pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error('   Make sure the database exists and schema.sql has been run.');
    await db.pool.end();
    process.exit(1);
  }
}

seed();
