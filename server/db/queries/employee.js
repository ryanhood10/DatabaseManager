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

const addEmployee = async (firstName, lastName, roleId, managerId) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
    connection.release();
    return result.insertId;
  } catch (error) {
    console.error(error);
  }
};

const deleteEmployee = async (id) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM employee WHERE id = ?', [id]);
    connection.release();
    return result.affectedRows;
  } catch (error) {
    console.error(error);
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
