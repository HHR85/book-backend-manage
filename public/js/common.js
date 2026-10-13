// 后端统一返回 { success, message, data }
// 这里把 HTTP 错误也解析成同样的结构，页面只需判断 res.success
function request(options) {
  return $.ajax(options).then(
    function (res) {
      return res;
    },
    function (xhr) {
      var body;
      try {
        body = JSON.parse(xhr.responseText);
      } catch (e) {
        body = { success: false, message: '请求失败（HTTP ' + xhr.status + '）', data: null };
      }
      return body;
    }
  );
}

function apiGet(url, params) {
  return request({ url: url, type: 'GET', data: params || {} });
}

function apiPost(url, data) {
  return request({
    url: url, type: 'POST',
    contentType: 'application/json', data: JSON.stringify(data || {})
  });
}

function apiPut(url, data) {
  return request({
    url: url, type: 'PUT',
    contentType: 'application/json', data: JSON.stringify(data || {})
  });
}

function apiDelete(url) {
  return request({ url: url, type: 'DELETE' });
}

// 取地址栏参数，例如 detail.html?id=3
function query(name) {
  var m = location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}

// 今天的 YYYY-MM-DD
function today() {
  var d = new Date();
  var p = function (n) { return (n < 10 ? '0' : '') + n; };
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

// 列表页查询条件：详情/新增/修改返回时靠它还原
function saveQuery(obj) {
  sessionStorage.setItem('bookQuery', JSON.stringify(obj));
}

function loadQuery() {
  try {
    return JSON.parse(sessionStorage.getItem('bookQuery')) || {};
  } catch (e) {
    return {};
  }
}
