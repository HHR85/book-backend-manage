const bookModel = require('../models/book.model');
const { toDateStr } = require('../utils/date');

// 试卷条文 12C：本次不实现登录，当前登录人固定为 admin 用户
const DEFAULT_CREATED_BY = 'admin';
const PAGE_SIZE = 5;

// 数据库行 -> 前端需要的形状（日期格式化 + 类型名兜底）
function toVO(row) {
  if (!row) return null;
  return {
    bookId: row.bookId,
    bookCode: row.bookCode,
    bookName: row.bookName,
    bookType: row.bookType,
    bookTypeName: row.bookTypeName || '',
    bookAuthor: row.bookAuthor,
    publishPress: row.publishPress,
    publishDate: toDateStr(row.publishDate),
    borrowed: row.borrowed,
    createdBy: row.createdBy,
    creationTime: toDateStr(row.creationTime),
    lastUpdateTime: toDateStr(row.lastUpdateTime),
  };
}

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

function notFound(message) {
  const err = new Error(message);
  err.status = 404;
  return err;
}

// 数据库里这些字段是 NOT NULL，缺了必然插入失败，所以先挡住给个明确提示
const REQUIRED = ['bookCode', 'bookName', 'bookType', 'bookAuthor',
  'publishPress', 'publishDate'];

function checkRequired(data) {
  REQUIRED.forEach((key) => {
    const value = data[key];
    if (value === undefined || value === null || String(value).trim() === '') {
      throw badRequest('字段 ' + key + ' 不能为空');
    }
  });
}

function pickBorrowed(value) {
  return Number(value) === 1 ? 1 : 0;
}

async function list({ page = 1, bookName = '' }) {
  const current = Math.max(1, parseInt(page, 10) || 1);
  const keyword = String(bookName || '').trim();

  const { rows, total } = await bookModel.findPage({
    bookName: keyword, page: current, pageSize: PAGE_SIZE,
  });

  return {
    list: rows.map(toVO),
    total,
    page: current,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE) || 1,
  };
}

async function detail(bookId) {
  const row = await bookModel.findById(bookId);
  if (!row) throw notFound('图书不存在');
  return toVO(row);
}

async function create(data) {
  checkRequired(data);
  const bookId = await bookModel.insert({
    bookCode: data.bookCode,
    bookName: data.bookName,
    bookType: data.bookType,
    bookAuthor: data.bookAuthor,
    publishPress: data.publishPress,
    publishDate: data.publishDate,
    borrowed: pickBorrowed(data.borrowed),
    createdBy: data.createdBy || DEFAULT_CREATED_BY, // 默认入库人
  });
  return detail(bookId);
}

async function modify(bookId, data) {
  await detail(bookId);            // 不存在直接 404
  checkRequired(data);
  await bookModel.update(bookId, {
    bookCode: data.bookCode,
    bookName: data.bookName,
    bookType: data.bookType,
    bookAuthor: data.bookAuthor,
    publishPress: data.publishPress,
    publishDate: data.publishDate,
    borrowed: pickBorrowed(data.borrowed),
  });
  return detail(bookId);
}

async function remove(bookId) {
  await detail(bookId);
  await bookModel.remove(bookId);
}

module.exports = { list, detail, create, modify, remove, PAGE_SIZE };
