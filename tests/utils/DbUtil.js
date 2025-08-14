const mysql = require('mysql2/promise');
require('dotenv').config();

class DbUtil {
  constructor(config) {
    // If no config is provided, use environment variables
    this.config = config || {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306
    };
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await mysql.createConnection(this.config);
    }
    return this.connection;
  }

  async query(sql, params = []) {
    const conn = await this.connect();
    const [rows] = await conn.execute(sql, params);
    return rows;
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}

module.exports = DbUtil; 