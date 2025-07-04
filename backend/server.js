import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pkg from 'pg';

dotenv.config();
const { Pool } = pkg;
const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://10.241.0.246:5000' // Adjust based on your frontend
}));

// ✅ Set up PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

// ✅ Simple health check
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ✅ Check database connection
app.get('/check-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users LIMIT 1');
    res.json({
      status: 'success',
      message: 'Database connection successful',
      data: result.rows,
    });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
