const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Breve test de conexión para cuando se monte en AWS
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error adquiriendo el cliente de la BD:', err.stack);
  }
  console.log('Conexión con PostgreSQL (RDS) establecida con éxito.');
  release();
});

module.exports = pool;
