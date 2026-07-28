import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://central_hackathon_user:kjDqZFiemyqSUfeJDJjkVnZIJB3npTyP@dpg-d9jf19l8nd3s73ba2pi0-a.singapore-postgres.render.com/central_hackathon';

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('⚡ Initializing PostgreSQL Database Schema...');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Hackathons Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hackathons (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        organizer_name VARCHAR(255) NOT NULL,
        organizer_initials VARCHAR(10),
        status VARCHAR(50) NOT NULL,
        mode VARCHAR(50) NOT NULL,
        prize_pool VARCHAR(50) NOT NULL,
        participants_count INT DEFAULT 0,
        teams_count INT DEFAULT 0,
        time_left VARCHAR(50),
        difficulty VARCHAR(50),
        tags TEXT[],
        image_gradient TEXT,
        featured BOOLEAN DEFAULT FALSE,
        category VARCHAR(100) DEFAULT 'General',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Teams Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        hackathon_id VARCHAR(100) REFERENCES hackathons(id) ON DELETE CASCADE,
        leader_name VARCHAR(255) NOT NULL,
        leader_email VARCHAR(255) NOT NULL,
        members_count INT DEFAULT 1,
        project_title VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Submissions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(100) PRIMARY KEY,
        hackathon_id VARCHAR(100) REFERENCES hackathons(id) ON DELETE CASCADE,
        team_name VARCHAR(255) NOT NULL,
        project_name VARCHAR(255) NOT NULL,
        tagline TEXT,
        description TEXT,
        github_url TEXT,
        demo_url TEXT,
        video_url TEXT,
        tech_stack TEXT[],
        average_score NUMERIC(5,2) DEFAULT 0,
        evaluated BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Announcements Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id VARCHAR(100) PRIMARY KEY,
        hackathon_id VARCHAR(100) REFERENCES hackathons(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        priority VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Judges Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS judges (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        expertise VARCHAR(255) NOT NULL,
        assigned_track VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Organizers Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizers (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        organization VARCHAR(255) NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        events_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ PostgreSQL Schema Initialized Successfully!');
  } catch (error) {
    console.error('❌ Error initializing database schema:', error);
  } finally {
    client.release();
  }
}
