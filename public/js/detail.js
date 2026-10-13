$(function () {
  apiGet('/api/books/' + query('id')).then(function (res) {
    if (!res.success) {
      alert(res.message);
      return;
    }
    var b = res.data;
    $('#bookCode').text(b.bookCode);
    $('#bookName').text(b.bookName);
    $('#bookTypeName').text(b.bookTypeName || '-');
    $('#bookAuthor').text(b.bookAuthor);
    $('#publishPress').text(b.publishPress);
    $('#borrowed').text(b.borrowed === 1 ? '已借阅' : '未借阅');
    $('#createdBy').text(b.createdBy);
    $('#creationTime').text(b.creationTime || '-');
  });

  // 返回列表：查询条件存在 sessionStorage 里，列表页会自己还原
  $('#back').click(function () {
    location.href = 'index.html';
  });
});
