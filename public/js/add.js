// 必填校验：试卷指定的 6 项在前，作者/出版社/出版日期在库里也是 NOT NULL，
// 不校验的话保存必然失败，所以一并校验
var RULES = [
  ['#bookCode', '图书编号'],
  ['#bookName', '图书名称'],
  ['#bookType', '图书类型'],
  ['#borrowed', '是否借阅'],
  ['#createdBy', '入库人'],
  ['#creationTime', '入库时间'],
  ['#bookAuthor', '作者'],
  ['#publishPress', '出版社'],
  ['#publishDate', '出版日期']
];

function check(form) {
  for (var i = 0; i < RULES.length; i++) {
    var input = form.find(RULES[i][0]);
    if ($.trim(input.val()) === '') {
      alert('请输入' + RULES[i][1]);
      input.focus();
      return false;
    }
  }
  return true;
}

function collect(form) {
  return {
    bookCode: $.trim(form.find('#bookCode').val()),
    bookName: $.trim(form.find('#bookName').val()),
    bookType: form.find('#bookType').val(),
    bookAuthor: $.trim(form.find('#bookAuthor').val()),
    publishPress: $.trim(form.find('#publishPress').val()),
    publishDate: form.find('#publishDate').val(),
    borrowed: form.find('#borrowed').val(),
    createdBy: $.trim(form.find('#createdBy').val()),
    creationTime: form.find('#creationTime').val()
  };
}

$(function () {
  var form = $('#form');

  // 默认值（试卷条文 12C：入库人固定为 admin 用户）
  form.find('#createdBy').val('admin');
  form.find('#creationTime').val(today());
  form.find('#borrowed').val('0');

  // 图书类型下拉
  apiGet('/api/book-types').then(function (res) {
    var html = '<option value="">请选择</option>';
    $.each(res.data || [], function (i, t) {
      html += '<option value="' + t.id + '">' + t.typeName + '</option>';
    });
    form.find('#bookType').html(html);
  });

  $('#save').click(function () {
    if (!check(form)) {
      return;
    }
    apiPost('/api/books', collect(form)).then(function (res) {
      alert(res.success ? '新增成功！' : '新增失败！');
      location.href = 'index.html';
    });
  });

  $('#back').click(function () {
    location.href = 'index.html';
  });
});
