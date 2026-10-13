const { fail } = require('../utils/response');

// 兜住所有未捕获异常
function errorHandler(err, req, res, next) {
  console.error('[error]', err);
  fail(res, err.status || 500, err.message || '服务器内部错误');
}

// 包装 async controller：抛出的异常自动交给 errorHandler
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, wrap };
