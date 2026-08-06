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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
