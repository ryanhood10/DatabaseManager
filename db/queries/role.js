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
  
module.exports = { getRoles };