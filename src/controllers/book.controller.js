const bookService = require('../services/book.service');
const { ok } = require('../utils/response');

async function list(req, res) {
  const data = await bookService.list({
    page: req.query.page,
    bookName: req.query.bookName,
  });
  ok(res, data, '查询成功');
}

async function detail(req, res) {
  ok(res, await bookService.detail(req.params.id), '查询成功');
}

async function create(req, res) {
  ok(res, await bookService.create(req.body), '新增成功');
}

async function modify(req, res) {
  ok(res, await bookService.modify(req.params.id, req.body), '修改成功');
}

async function remove(req, res) {
  await bookService.remove(req.params.id);
  ok(res, null, '删除成功');
}

module.exports = { list, detail, create, modify, remove };
