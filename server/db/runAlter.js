const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function runAlter() {
  const alterPath = path.join(__dirname, 'alter.sql');
  const sql = fs.readFileSync(alterPath, 'utf8');

  await pool.query(sql);
  console.log('Database alter script applied');
}

module.exports = runAlter;
