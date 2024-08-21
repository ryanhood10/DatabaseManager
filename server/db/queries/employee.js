const { pool } = require('./db');

const getEmployees = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM employee');
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
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
