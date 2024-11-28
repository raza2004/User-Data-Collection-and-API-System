import pool from '../../../lib/db';

// Utility function to check and create tables
async function ensureTablesExist() {
  try {
    // Create the users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        gender VARCHAR(10),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create the locations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        userId INT REFERENCES users(id) ON DELETE CASCADE,
        city VARCHAR(100),
        country VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Tables ensured to exist.');
  } catch (err) {
    console.error('Error ensuring tables:', err.message);
    throw err;
  }
}

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const gender = searchParams.get('gender');
  const city = searchParams.get('city');
  const country = searchParams.get('country');
  const fields = searchParams.get('fields');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  try {
    // Ensure the tables exist before querying
    await ensureTablesExist();

    // Dynamic query building
    const conditions = [];
    const values = [];
    let idx = 1;

    if (gender) {
      conditions.push(`gender = $${idx++}`);
      values.push(gender);
    }
    if (city) {
      conditions.push(`city ILIKE $${idx++}`);
      values.push(`%${city}%`);
    }
    if (country) {
      conditions.push(`country ILIKE $${idx++}`);
      values.push(`%${country}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const selectedFields = fields ? fields.split(',').join(', ') : 'users.*, locations.city, locations.country';

    const query = `
      SELECT ${selectedFields} FROM users
      LEFT JOIN locations ON users.id = locations.userId
      ${whereClause}
      LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);

    // Execute query
    const result = await pool.query(query, values);
    return new Response(
      JSON.stringify({ success: true, data: result.rows }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error:', err.message);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
