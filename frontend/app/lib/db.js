import { Pool } from 'pg';

let pool;

function getDbConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    return { connectionString };
  }
  return {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'pincher_db',
  };
}

function getPool() {
  if (!pool) {
    const config = getDbConfig();
    pool = new Pool({
      ...config,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }
  return pool;
}

let dbInitialized = false;

export async function initDb() {
  if (dbInitialized) return;

  const targetDb = process.env.PGDATABASE || 'pincher_db';

  // 1. First attempt to connect to target pool and create table
  let p = getPool();

  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      persona VARCHAR(50) DEFAULT 'classic',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wardrobe_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      subcategory VARCHAR(100),
      color_hex VARCHAR(20) DEFAULT '#000000',
      color_name VARCHAR(50),
      season VARCHAR(50) DEFAULT 'all',
      occasion VARCHAR(50) DEFAULT 'casual',
      image_url TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_wardrobe_user_id ON wardrobe_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_wardrobe_category ON wardrobe_items(category);
  `;

  try {
    await p.query(createUsersTableQuery);
    dbInitialized = true;
    return;
  } catch (error) {
    // If target database doesn't exist (code 3D000)
    if (error.code === '3D000') {
      console.log(`Database "${targetDb}" does not exist. Creating it now...`);
      // Connect to default 'postgres' database to create the target db
      const config = getDbConfig();
      const adminPool = new Pool({
        ...(config.connectionString
          ? { connectionString: config.connectionString.replace(/\/[^/]+$/, '/postgres') }
          : { ...config, database: 'postgres' }),
        connectionTimeoutMillis: 5000,
      });

      try {
        await adminPool.query(`CREATE DATABASE "${targetDb}";`);
        console.log(`Database "${targetDb}" created successfully!`);
      } catch (createErr) {
        // If already exists or permission denied
        console.warn('Could not auto-create database:', createErr.message);
      } finally {
        await adminPool.end();
      }

      // Retry creating tables on the new database
      await p.query(createUsersTableQuery);
      dbInitialized = true;
      return;
    }

    if (error.code === '28P01') {
      const msg = `PostgreSQL authentication failed for user "${process.env.PGUSER || 'postgres'}". Please update PGPASSWORD / DATABASE_URL in .env.local`;
      console.error(msg);
      const authErr = new Error(msg);
      authErr.code = '28P01';
      throw authErr;
    }

    if (error.code === 'ECONNREFUSED') {
      const msg = `Could not connect to PostgreSQL on ${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}. Please ensure PostgreSQL service is running.`;
      console.error(msg);
      const connErr = new Error(msg);
      connErr.code = 'ECONNREFUSED';
      throw connErr;
    }

    console.error('Failed to initialize PostgreSQL schema:', error);
    throw error;
  }
}

export async function query(text, params) {
  await initDb();
  const p = getPool();
  const start = Date.now();
  try {
    const res = await p.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text: text.slice(0, 80), duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', { text, error: error.message });
    throw error;
  }
}

const db = {
  query,
  initDb,
  getPool,
};

export default db;
