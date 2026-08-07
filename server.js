import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const railwayUrl = 'postgresql://postgres:GcoRpNacdMQhstDIpJNvPRuTOMvWUvKV@hayabusa.proxy.rlwy.net:12184/railway';
const pool = new pg.Pool({
  connectionString: railwayUrl,
  ssl: { rejectUnauthorized: false }
});

app.get('/api/v1/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      db: 'connected',
      time: result.rows[0].now,
      railwayHost: 'tokaido.proxy.rlwy.net:27364'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      error: error.message
    });
  }
});

// Map frontend statuses to the DB HackathonStatus enum.
// The organizer portal sends 'live' / 'upcoming' / 'ended' / 'draft';
// Postgres only accepts the enum values below.
const STATUS_MAP = {
  LIVE: 'REGISTRATION_OPEN',
  ACTIVE: 'REGISTRATION_OPEN',
  OPEN: 'REGISTRATION_OPEN',
  UPCOMING: 'PUBLISHED',
  PUBLISHED: 'PUBLISHED',
  PUBLISH: 'PUBLISHED',
  ENDED: 'COMPLETED',
  COMPLETED: 'COMPLETED',
  DRAFT: 'DRAFT',
  IN_PROGRESS: 'IN_PROGRESS',
  REGISTRATION_OPEN: 'REGISTRATION_OPEN',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  EVALUATION: 'EVALUATION',
  ARCHIVED: 'ARCHIVED',
  CANCELLED: 'CANCELLED',
};

const VALID_MODES = ['ONLINE', 'HYBRID', 'IN_PERSON'];

function normalizeStatus(raw) {
  return STATUS_MAP[String(raw || '').toUpperCase()] || 'IN_PROGRESS';
}

function normalizeMode(raw) {
  const mode = String(raw || 'ONLINE').toUpperCase();
  return VALID_MODES.includes(mode) ? mode : 'ONLINE';
}

function nullIfEmpty(value) {
  return value === undefined || value === null || value === '' ? null : value;
}

async function storeHackathon(req, res) {
  try {
    const h = req.body || {};
    const title = h.title || 'Untitled Event';
    const slug = (h.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) + '-' + Date.now().toString().slice(-4);

    const insertQuery = `
      INSERT INTO hackathons (
        id, title, slug, tagline, description, banner, "prizePool", mode, status,
        location, category, website,
        "registrationStart", "registrationEnd", "startDate", "endDate", "submissionDeadline",
        "organizerId", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        '9787ab28-e14f-4c6a-83b1-774ca48a9d25', NOW(), NOW()
      ) RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      title,
      slug,
      nullIfEmpty(h.tagline),
      nullIfEmpty(h.description),
      nullIfEmpty(h.banner),
      nullIfEmpty(h.prizePool),
      normalizeMode(h.mode),
      normalizeStatus(h.status),
      nullIfEmpty(h.location),
      nullIfEmpty(h.category),
      nullIfEmpty(h.website),
      nullIfEmpty(h.registrationStart),
      nullIfEmpty(h.registrationEnd),
      nullIfEmpty(h.startDate),
      nullIfEmpty(h.endDate),
      nullIfEmpty(h.submissionDeadline),
    ]);
    console.log('✅ HACKATHON STORED IN RAILWAY POSTGRESQL:', result.rows[0].title, `(status=${result.rows[0].status})`);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Failed to store hackathon in Railway:', error.message);
    res.status(500).json({ error: error.message });
  }
}

const LIST_HACKATHONS = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hackathons ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GET_HACKATHON_BY_ID = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hackathons WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Hackathon not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

app.get('/api/v1/hackathons', LIST_HACKATHONS);
app.get('/api/v1/hackathons/:id', GET_HACKATHON_BY_ID);
app.post('/api/v1/hackathons', storeHackathon);

// Alias routes without /api/v1 prefix
app.get('/hackathons', LIST_HACKATHONS);
app.get('/hackathons/:id', GET_HACKATHON_BY_ID);
app.post('/hackathons', storeHackathon);

// ===== Registrations =====
// Stored in Postgres so participant and organizer see the same data
// regardless of which browser/session they use.
const LIST_REGISTRATIONS = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registrations ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const CREATE_REGISTRATION = async (req, res) => {
  try {
    const r = req.body || {};
    const id = r.id || `reg-${Date.now()}`;
    const insertQuery = `
      INSERT INTO registrations (
        id, "groupName", code, "leaderEmail", "groupSize", status,
        "hackathonId", "hackathonTitle", "registrationType", "registeredAt", members
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      id,
      nullIfEmpty(r.groupName),
      nullIfEmpty(r.code),
      nullIfEmpty(r.leaderEmail),
      nullIfEmpty(r.groupSize),
      nullIfEmpty(r.status) || 'UNDER_REVIEW',
      nullIfEmpty(r.hackathonId),
      nullIfEmpty(r.hackathonTitle),
      nullIfEmpty(r.registrationType),
      nullIfEmpty(r.registeredAt),
      JSON.stringify(r.members || [])
    ]);
    console.log('✅ REGISTRATION STORED IN RAILWAY POSTGRESQL:', result.rows[0].groupName, `(status=${result.rows[0].status})`);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Failed to store registration in Railway:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const UPDATE_REGISTRATION_STATUS = async (req, res) => {
  try {
    const status = req.body?.status || 'UNDER_REVIEW';
    const result = await pool.query(
      'UPDATE registrations SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Registration not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

app.get('/api/v1/registrations', LIST_REGISTRATIONS);
app.post('/api/v1/registrations', CREATE_REGISTRATION);
app.patch('/api/v1/registrations/:id', UPDATE_REGISTRATION_STATUS);

// Alias routes without /api/v1 prefix
app.get('/registrations', LIST_REGISTRATIONS);
app.post('/registrations', CREATE_REGISTRATION);
app.patch('/registrations/:id', UPDATE_REGISTRATION_STATUS);

async function initRegistrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      "groupName" TEXT,
      code TEXT,
      "leaderEmail" TEXT,
      "groupSize" TEXT,
      status TEXT DEFAULT 'UNDER_REVIEW',
      "hackathonId" TEXT,
      "hackathonTitle" TEXT,
      "registrationType" TEXT,
      "registeredAt" TEXT,
      members JSONB DEFAULT '[]'::jsonb,
      "createdAt" TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('✅ Registrations table ready');
}

initRegistrationsTable()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to init registrations table:', error.message);
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  });
