const { pool } = require('./db');

const getRoles = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM role');
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
  }
};

const addRole = async (title, salary, department_id) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department_id]);
    connection.release();
    return result.insertId;
  } catch (error) {
    console.error(error);
  }
};

const deleteRole = async (id) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM role WHERE id = ?', [id]);
    connection.release();
    return result.affectedRows;
  } catch (error) {
    console.error(error);
  }
};

const updateRoleTitle = async (id, title) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('UPDATE role SET title = ? WHERE id = ?', [title, id]);
    connection.release();
    return result.affectedRows;
  } catch (error) {
    console.error(error);
  }
};

const updateRoleSalary = async (id, salary) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('UPDATE role SET salary = ? WHERE id = ?', [salary, id]);
    connection.release();
    return result.affectedRows;
  } catch (error) {
    console.error(error);
  }
};

// Export the functions
module.exports = { getRoles, addRole, deleteRole, updateRoleTitle, updateRoleSalary };
