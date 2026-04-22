require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as database');
    console.log('\n✅ Database Connection Successful!');
    console.log(`Connected to Database: ${res.rows[0].database}`);
    console.log(`Server Time: ${res.rows[0].current_time}\n`);
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Database Connection Failed!', err.message);
    process.exit(1);
  }
}

testConnection();
