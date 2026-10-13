const bookTypeService = require('../services/bookType.service');
const { ok } = require('../utils/response');

async function list(req, res) {
  ok(res, await bookTypeService.list(), '查询成功');
}

module.exports = { list };
