import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database Schema on Start
initDatabase();

// 1. Health Check & Connection Status
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW(), current_database(), version()');
    res.json({
      status: 'healthy',
      database: 'PostgreSQL (Render Cloud)',
      timestamp: result.rows[0].now,
      dbName: result.rows[0].current_database,
      version: result.rows[0].version
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 2. Hackathons API
app.get('/api/hackathons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hackathons ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hackathons', async (req, res) => {
  const { id, title, organizer_name, organizer_initials, status, mode, prize_pool, time_left, difficulty, tags, image_gradient, featured, category } = req.body;
  try {
    const query = `
      INSERT INTO hackathons (id, title, organizer_name, organizer_initials, status, mode, prize_pool, time_left, difficulty, tags, image_gradient, featured, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const values = [id || `h-${Date.now()}`, title, organizer_name, organizer_initials || 'HC', status || 'Live', mode || 'Online', prize_pool, time_left || '2 Days Left', difficulty || 'Intermediate', tags || [], image_gradient || 'from-indigo-600 to-purple-600', featured || false, category || 'General'];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Judges API
app.get('/api/judges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM judges ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/judges', async (req, res) => {
  const { name, email, expertise, assigned_track, avatar } = req.body;
  try {
    const query = `
      INSERT INTO judges (id, name, email, expertise, assigned_track, avatar)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const id = `j-${Date.now()}`;
    const result = await pool.query(query, [id, name, email, expertise, assigned_track, avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/judges/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM judges WHERE id = $1', [req.params.id]);
    res.json({ message: 'Judge deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Organizers API
app.get('/api/organizers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM organizers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/organizers', async (req, res) => {
  const { name, email, organization, verified } = req.body;
  try {
    const query = `
      INSERT INTO organizers (id, name, email, organization, verified)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const id = `o-${Date.now()}`;
    const result = await pool.query(query, [id, name, email, organization, verified || true]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Teams & Submissions API
app.get('/api/teams', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teams ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/teams', async (req, res) => {
  const { name, hackathon_id, leader_name, leader_email, project_title } = req.body;
  try {
    const query = `
      INSERT INTO teams (id, name, hackathon_id, leader_name, leader_email, project_title)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const id = `t-${Date.now()}`;
    const result = await pool.query(query, [id, name, hackathon_id, leader_name, leader_email, project_title]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Hackathon Central Express Server running on http://localhost:${PORT}`);
  console.log(`🐘 Connected to PostgreSQL: central_hackathon`);
});
