const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  password: 'RicoBandito',
  host: 'localhost',
  port: 5432,
  database: 'testcompany',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const departmentSchema = `
  CREATE TABLE IF NOT EXISTS department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
  )
`;

const roleSchema = `
  CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
  )
`;

const employeeSchema = `
  CREATE TABLE IF NOT EXISTS employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
  )
`;

const linkSchemas = async () => {
  try {
    await pool.query(departmentSchema);
    await pool.query(roleSchema);
    await pool.query(employeeSchema);
    console.log('Successfully linked schemas.');
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  pool,
  linkSchemas
};
