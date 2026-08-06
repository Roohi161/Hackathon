import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:GcoRpNacdMQhstDIpJNvPRuTOMvWUvKV@hayabusa.proxy.rlwy.net:12184/railway',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ CONNECTED TO RAILWAY POSTGRESQL DATABASE!');
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('📅 Railway Server Time:', res.rows[0].now);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  });
