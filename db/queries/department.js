const { pool } = require('./db');

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

//export the model
module.exports = { getDepartments};