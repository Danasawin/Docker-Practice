import express from 'express';
const app = express();
const port = 3000; // You can change this port if needed
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();



const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Check DB connection endpoint
app.get('/check-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'success',
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
