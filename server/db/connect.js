const { Pool } = require('pg');
 
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});
 
db.connect((err) => {
  if (err) {
    console.error('Database connection error', err.stack);
  } else {
    console.log('Database connected');
  }
});
 
module.exports = db;