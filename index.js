// const fs = require('fs');
// const path = require('path');

// const roleSchemaPath = path.join(__dirname, './schemas/role.sql');
// const roleSchema = fs.readFileSync(roleSchemaPath, 'utf-8');
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'employee_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//testing pool
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
  

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
