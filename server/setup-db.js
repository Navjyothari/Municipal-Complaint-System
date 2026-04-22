const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setup() {
  const defaultClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    database: 'postgres'
  });

  try {
    await defaultClient.connect();
    const res = await defaultClient.query("SELECT 1 FROM pg_database WHERE datname = 'municipal_excellence'");
    if (res.rowCount === 0) {
      console.log('Creating database municipal_excellence...');
      await defaultClient.query('CREATE DATABASE municipal_excellence');
    } else {
      console.log('Database municipal_excellence already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await defaultClient.end();
  }

  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    database: 'municipal_excellence'
  });

  try {
    await client.connect();
    const schemaSql = fs.readFileSync(path.join(__dirname, 'src', 'db', 'schema.sql'), 'utf8');
    console.log('Running schema.sql...');
    await client.query(schemaSql);

    const seedSql = fs.readFileSync(path.join(__dirname, 'src', 'db', 'seed.sql'), 'utf8');
    console.log('Running seed.sql...');
    await client.query(seedSql);

    console.log('Database setup complete!');
  } catch (err) {
    console.error('Error executing sql files:', err);
  } finally {
    await client.end();
  }
}

setup();
