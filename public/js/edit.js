// 必填校验规则与新增页一致
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
  var id = query('id');

  // 类型下拉 + 回填数据
  apiGet('/api/book-types').then(function (res) {
    var html = '<option value="">请选择</option>';
    $.each(res.data || [], function (i, t) {
      html += '<option value="' + t.id + '">' + t.typeName + '</option>';
    });
    form.find('#bookType').html(html);

    apiGet('/api/books/' + id).then(function (res2) {
      if (!res2.success) {
        alert(res2.message);
        return;
      }
      var b = res2.data;
      form.find('#bookCode').val(b.bookCode);
      form.find('#bookName').val(b.bookName);
      form.find('#bookType').val(b.bookType);
      form.find('#bookAuthor').val(b.bookAuthor);
      form.find('#publishPress').val(b.publishPress);
      form.find('#publishDate').val(b.publishDate);
      form.find('#borrowed').val(String(b.borrowed));
      form.find('#createdBy').val(b.createdBy);          // 只读
      form.find('#creationTime').val(b.creationTime);    // 只读
    });
  });

  $('#save').click(function () {
    if (!check(form)) {
      return;
    }
    apiPut('/api/books/' + id, collect(form)).then(function (res) {
      alert(res.success ? '修改成功！' : '修改失败！');
      location.href = 'index.html';
    });
  });

  $('#back').click(function () {
    location.href = 'index.html';
  });
});
