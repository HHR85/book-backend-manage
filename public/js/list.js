$(function () {
  var state = loadQuery();          // 上次的查询条件
  var page = state.page || 1;
  var bookName = state.bookName || '';
  var totalPages = 1;

  $('#bookName').val(bookName);

  function render(data) {
    totalPages = data.totalPages;

    var rows = '';
    $.each(data.list, function (i, b) {
      rows += '<tr>' +
        '<td>' + b.bookCode + '</td>' +
        '<td>' + (b.bookTypeName || '-') + '</td>' +
        '<td>' + b.bookName + '</td>' +
        '<td>' + b.bookAuthor + '</td>' +
        '<td>' + b.publishPress + '</td>' +
        '<td>' + (b.creationTime || '-') + '</td>' +
        '<td>' + (b.borrowed === 1 ? '已借阅' : '未借阅') + '</td>' +
        '<td class="op">' +
        '<a href="detail.html?id=' + b.bookId + '">查看</a>' +
        '<a href="edit.html?id=' + b.bookId + '">修改</a>' +
        '<a href="javascript:;" class="del" data-id="' + b.bookId + '">删除</a>' +
        '</td>' +
        '</tr>';
    });
    $('#tbody').html(rows || '<tr><td colspan="8" class="empty">暂无数据</td></tr>');

    var pager = '共 ' + data.totalPages + ' 页，共 ' + data.total + ' 条记录&nbsp;&nbsp;';
    pager += '<a href="javascript:;" class="pg" data-page="' + (data.page - 1) + '">上一页</a>';
    for (var p = 1; p <= data.totalPages; p++) {
      pager += '<a href="javascript:;" class="pg' + (p === data.page ? ' active' : '') +
        '" data-page="' + p + '">' + p + '</a>';
    }
    pager += '<a href="javascript:;" class="pg" data-page="' + (data.page + 1) + '">下一页</a>';
    pager += '&nbsp;跳转到第 <input id="jump" type="text" value="' + data.page + '"> 页' +
      '<button id="go" class="btn">GO</button>';
    $('#pager').html(pager);
  }

  function load() {
    saveQuery({ bookName: bookName, page: page });
    apiGet('/api/books', { page: page, bookName: bookName }).then(function (res) {
      if (!res.success) {
        alert(res.message);
        return;
      }
      render(res.data);
    });
  }

  // 查询
  $('#search').click(function () {
    bookName = $.trim($('#bookName').val());
    page = 1;
    load();
  });

  // 新增
  $('#add').click(function () {
    location.href = 'add.html';
  });

  // 翻页
  $(document).on('click', '.pg', function () {
    var p = parseInt($(this).attr('data-page'), 10);
    if (!p || p < 1 || p > totalPages) {
      return;
    }
    page = p;
    load();
  });

  // 跳转
  $(document).on('click', '#go', function () {
    var p = parseInt($.trim($('#jump').val()), 10);
    if (!p || p < 1 || p > totalPages) {
      alert('请输入 1 - ' + totalPages + ' 之间的页码');
      return;
    }
    page = p;
    load();
  });

  // 删除
  $(document).on('click', '.del', function () {
    if (!confirm('确定删除该图书信息？')) {
      return;
    }
    apiDelete('/api/books/' + $(this).attr('data-id')).then(function (res) {
      alert(res.success ? '删除成功' : '删除失败');
      load();
    });
  });

  load();
});
