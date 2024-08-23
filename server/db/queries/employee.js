const { pool } = require('../utils/db'); // Correct path to db.js

const getEmployees = async () => {
  try {
    // Directly use pool.query() for PostgreSQL
    const { rows } = await pool.query('SELECT * FROM employee');
    return rows || [];  // Return an empty array if no rows found
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Add employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
  try {
    const result = await pool.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [firstName, lastName, roleId, managerId]
    );
    return result.rows[0].id; // Return the inserted ID
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

const deleteEmployee = async (id) => {
  try {
    const result = await pool.query('DELETE FROM employee WHERE id = $1', [id]);
    return result.rowCount;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

const updateEmployeeRole = async (id, roleId) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, id]);
    connection.release();
    return result.affectedRows;
  } catch (error) {
    console.error(error);
  }
};

//
const updateEmployeeManager = async (id, managerId) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, id]);
    connection.release();
    return result.affectedRows;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getEmployees, addEmployee, deleteEmployee, updateEmployeeRole, updateEmployeeManager };
