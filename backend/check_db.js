const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'akib',
  password: '12345678',
  database: 'ecom_db',
});

async function checkDb() {
  try {
    await client.connect();
    console.log('Connected to DB');
    const res = await client.query('SELECT * FROM product;');
    console.log('Products:', res.rows);
  } catch (err) {
    console.error('DB Error:', err);
  } finally {
    await client.end();
  }
}

checkDb();
