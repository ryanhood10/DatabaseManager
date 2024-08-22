const { pool } = require('../utils/db'); // Correct path to db.js


// Query to get departments
const getDepartments = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM department');
    return rows || [];  // Return an empty array if no rows found
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Query to add a department
const addDepartment = async (name) => {
  try {
    const result = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING id', [name]);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
};

// Query to delete a department
const deleteDepartment = async (id) => {
  try {
    const result = await pool.query('DELETE FROM department WHERE id = $1', [id]);
    return result.rowCount;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

// Query to update a department name
const updateDepartmentName = async (id, name) => {
  try {
    const result = await pool.query('UPDATE department SET name = $1 WHERE id = $2', [name, id]);
    return result.rowCount;
  } catch (error) {
    console.error('Error updating department name:', error);
    throw error;
  }
};

// Export the functions
module.exports = { getDepartments, addDepartment, deleteDepartment, updateDepartmentName };
