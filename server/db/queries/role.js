const { pool } = require('../utils/db'); // Correct path to db.js

const getRoles = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      LEFT JOIN department ON role.department_id = department.id
      ORDER BY role.id;
    `);
    return rows || [];  // Return an empty array if no rows found
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};





const addRole = async (title, salary, department_id) => {
  try {
    const result = await pool.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING id',
      [title, salary, department_id]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('Error adding role:', error);
    throw error;
  }
};

const deleteRole = async (id) => {
  try {
    const result = await pool.query('DELETE FROM role WHERE id = $1', [id]);
    return result.rowCount;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

const updateRoleTitle = async (id, title) => {
  try {
    const result = await pool.query('UPDATE role SET title = $1 WHERE id = $2', [title, id]);
    return result.rowCount;
  } catch (error) {
    console.error('Error updating role title:', error);
    throw error;
  }
};

const updateRoleSalary = async (id, salary) => {
  try {
    const result = await pool.query('UPDATE role SET salary = $1 WHERE id = $2', [salary, id]);
    return result.rowCount;
  } catch (error) {
    console.error('Error updating role salary:', error);
    throw error;
  }
};

module.exports = { getRoles, addRole, deleteRole, updateRoleTitle, updateRoleSalary };
