// 统一响应格式：{ success, message, data }
function ok(res, data = null, message = '操作成功') {
  res.json({ success: true, message, data });
}

function fail(res, status = 500, message = '服务器内部错误') {
  res.status(status).json({ success: false, message, data: null });
}

module.exports = { ok, fail };
