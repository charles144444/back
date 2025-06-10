const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      INSERT INTO properties (title, price, location, bedrooms, bathrooms, area, image) VALUES
      ('Modern Family Home', 450000, '123 Sunny St, Springfield', 3, 2, 1800, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'),
      ('Luxury Condo', 750000, '456 Downtown Ave, Metropolis', 2, 2, 1200, 'https://images.unsplash.com/photo-1600566752355-35792bed2df1')
    `);
    await client.query('COMMIT');
    console.log('Database seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();