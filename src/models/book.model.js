const pool = require('../config/db');

// 分页列表：书名模糊 + 入库时间降序
async function findPage({ bookName, page, pageSize }) {
  const where = bookName ? 'WHERE b.bookName LIKE ?' : '';
  const params = bookName ? [`%${bookName}%`] : [];

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM book_info b ${where}`, params);

  const [rows] = await pool.query(
    `SELECT b.*, t.typeName AS bookTypeName
       FROM book_info b
       LEFT JOIN book_type t ON t.id = b.bookType
       ${where}
      ORDER BY b.creationTime DESC, b.bookId DESC
      LIMIT ? OFFSET ?`,
    [...params, pageSize, (page - 1) * pageSize]);

  return { rows, total: countRows[0].total };
}

async function findById(bookId) {
  const [rows] = await pool.query(
    `SELECT b.*, t.typeName AS bookTypeName
       FROM book_info b
       LEFT JOIN book_type t ON t.id = b.bookType
      WHERE b.bookId = ?`,
    [bookId]);
  return rows[0] || null;
}

// 新增：creationTime 取当前时间，lastUpdateTime 留空
async function insert(data) {
  const [result] = await pool.execute(
    `INSERT INTO book_info
       (bookCode, bookName, bookType, bookAuthor, publishPress, publishDate,
        borrowed, createdBy, creationTime, lastUpdateTime)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NULL)`,
    [data.bookCode, data.bookName, data.bookType, data.bookAuthor,
      data.publishPress, data.publishDate, data.borrowed, data.createdBy]);
  return result.insertId;
}

// 修改：createdBy 与 creationTime 不参与更新
async function update(bookId, data) {
  const [result] = await pool.execute(
    `UPDATE book_info
        SET bookCode = ?, bookName = ?, bookType = ?, bookAuthor = ?,
            publishPress = ?, publishDate = ?, borrowed = ?, lastUpdateTime = NOW()
      WHERE bookId = ?`,
    [data.bookCode, data.bookName, data.bookType, data.bookAuthor,
      data.publishPress, data.publishDate, data.borrowed, bookId]);
  return result.affectedRows;
}

async function remove(bookId) {
  const [result] = await pool.execute('DELETE FROM book_info WHERE bookId = ?', [bookId]);
  return result.affectedRows;
}

module.exports = { findPage, findById, insert, update, remove };
