require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');  // Import the PostgreSQL client
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Use the DATABASE_URL from environment variables
  ssl: {
    rejectUnauthorized: false  // This is needed for Heroku Postgres connections
  }
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the PostgreSQL database.');
  }
});

// Get all departments
app.get('/api/departments', (req, res) => {
  const query = 'SELECT * FROM department';
  pool.query(query)
    .then(({ rows }) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Add a new department
app.post('/api/departments', (req, res) => {
  const { departmentName } = req.body;
  const query = 'INSERT INTO department (name) VALUES ($1)';
  pool.query(query, [departmentName])
    .then(() => {
      res.status(201).json({ message: 'Department added successfully.' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Get all roles
app.get('/api/roles', (req, res) => {
  const query = 'SELECT * FROM role';
  pool.query(query)
    .then(({ rows }) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Add a new role
app.post('/api/roles', async (req, res) => {
  const { roleName, roleSalary, roleDepartment } = req.body;
  const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
  pool.query(query, [roleName, roleSalary, roleDepartment])
    .then(() => {
      res.status(201).json({ message: 'Role added successfully.' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Get all employees
app.get('/api/employees', (req, res) => {
  const query = 'SELECT * FROM employee';
  pool.query(query)
    .then(({ rows }) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Add a new employee
app.post('/api/employees', async (req, res) => {
  const { firstName, lastName, employeeRole, employeeManager } = req.body;
  const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
  pool.query(query, [firstName, lastName, employeeRole, employeeManager])
    .then(() => {
      res.status(201).json({ message: 'Employee added successfully.' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Update an employee's role
app.put('/api/employees/:id/role', async (req, res) => {
  const employeeId = req.params.id;
  const { newRole } = req.body;
  const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
  pool.query(query, [newRole, employeeId])
    .then(() => {
      res.status(200).json({ message: 'Employee role updated successfully.' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
