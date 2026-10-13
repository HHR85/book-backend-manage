const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'book_manage',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  // 让 DATE / DATETIME 以字符串返回，避免被转成本地时区 Date 导致日期差一天
  dateStrings: true,
});

module.exports = pool;
