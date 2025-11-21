const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || ''
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack || err);
    return;
  }
  console.log('Connected to MySQL as id ' + (db.threadId || 'unknown'));
});

module.exports = db;
