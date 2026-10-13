# 图书借阅系统（后台管理）

## 技术栈
Express 4 + mysql2/promise + MySQL 8；前端原生 HTML/CSS/JS + jQuery 1.8.3（AJAX）；
测试 Jest + Supertest；CI GitHub Actions。数据库名 `book_manage`。

## 分层
`routes → controllers → services → models`，单向依赖，不跨层。
models 只写 SQL；services 做默认值与业务规则；controllers 收参、调 service、统一响应。

## 数据库
- `book_type(id, typeName)`
- `book_info(bookId, bookCode, bookName, bookType→book_type.id, bookAuthor,
  publishPress, publishDate, borrowed(1已借/0未借), createdBy, creationTime, lastUpdateTime)`

## API（统一响应 `{ success, message, data }`）
- `GET /api/books` 分页 `page`(默认1)、`pageSize` 固定 5、`bookName` 模糊；
  LEFT JOIN 带出 `bookTypeName`；`creationTime DESC, bookId DESC`；
  返回 `data:{ list, total, page, pageSize, totalPages }`
- `GET /api/books/:id` 详情，不存在返回 404
- `POST /api/books` 新增：service 强制 `borrowed=0`、`createdBy='系统管理员'`、
  `creationTime=NOW()`、`lastUpdateTime=NULL`
- `PUT /api/books/:id` 修改：忽略 `createdBy`/`creationTime`，写 `lastUpdateTime=NOW()`
- `DELETE /api/books/:id` 删除
- `GET /api/book-types` 全部类型

日期一律输出 `YYYY-MM-DD`；SQL 全部参数化；异常统一走 errorHandler。

## 前端（public/）
`index.html` 列表（搜索 + 新增 + 隔行变色表格 + 分页 + 查看/修改/删除）、
`detail.html` 详情（只读）、`add.html` 新增、`edit.html` 修改（入库人/入库时间只读）。
查询条件用 `sessionStorage` 记忆，从详情/新增/修改返回时保留。
提示文案：新增成功！/ 新增失败！/ 修改成功！/ 修改失败！/ 删除成功 / 删除失败。

## 规范
- 所有数据库操作必须 try/catch，异常交给统一错误中间件。
- 提交信息：`feat` / `fix` / `docs` / `chore` + 中文描述。
- 分支：`feature/backend-api`、`feature/frontend-pages`，PR 引用对应 Issue。
