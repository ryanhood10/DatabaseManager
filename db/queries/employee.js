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


module.exports = {   getEmployees };