const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'your-mysql-username',
  password: 'your-mysql-password',
  database: 'department_db'
});

const departmentSchema = `
  CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
  )
`;

const roleSchema = `
  CREATE TABLE role (
    id INT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
  )
`;

const employeeSchema = `
  CREATE TABLE employee (
    id INT PRIMARY KEY,
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
    const connection = await pool.getConnection();
    await connection.query(departmentSchema);
    await connection.query(roleSchema);
    await connection.query(employeeSchema);
    connection.release();
    console.log('Successfully linked schemas.');
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  pool,
  linkSchemas
};
