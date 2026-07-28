const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://central_hackathon_user:kjDqZFiemyqSUfeJDJjkVnZIJB3npTyP@dpg-d9jf19l8nd3s73ba2pi0-a.singapore-postgres.render.com/central_hackathon',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('Successfully connected to the Render database!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Current time from DB:', res.rows[0].now);
  })
  .catch(err => {
    console.error('Connection error:', err.message);
  })
  .finally(() => {
    client.end();
  });
