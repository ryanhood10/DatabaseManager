const { pool } = require('./db');

//query to get departments
const getDepartments = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM department');
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
  }
};

// query to add a department
const addDepartment = async (name) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO department (name) VALUES (?)', [name]);
    connection.release();
    return result.insertId;
  } catch (error) {
    console.error(error);
  }
};

//query to delete a department
const deleteDepartment = async (id) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM department WHERE id = ?', [id]);
    connection.release();
    return result.affectedRows;
  } catch (error) {
    console.error(error);
  }
};

//query to update a Department Name
const updateDepartmentName = async (id, name) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('UPDATE department SET name = ? WHERE id = ?', [name, id]);
    connection.release();
    return result.affectedRows;
  } catch (error) {
    console.error(error);
  }
};

// Export the functions
module.exports = {getDepartments, addDepartment, deleteDepartment, updateDepartmentName};
