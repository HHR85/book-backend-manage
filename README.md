# 图书借阅系统（后台管理）

基于《2016年10月学士后Java毕业考试机试试卷-2》的需求，技术栈按要求替换为
**Express + MySQL + 原生 HTML/CSS/JS** 实现。

## 技术栈

| 层次 | 选型 |
| --- | --- |
| 后端 | Node.js + Express 4 + mysql2/promise |
| 数据库 | MySQL 8，库名 `book_manage` |
| 前端 | 原生 HTML/CSS/JS + jQuery 1.8.3 + AJAX |
| 测试 | Jest + Supertest |
| CI | GitHub Actions（Node 20 + MySQL 8 service） |

## 目录结构

```
.
├── .github/workflows/ci.yml     # CI：push / PR 到 main 时跑回归测试
├── .env.example                 # 数据库配置示例（复制为 .env 使用）
├── book_manage.sql              # 建库建表 + 测试数据（可重复执行）
├── app.js                       # Express 入口
├── src/
│   ├── config/db.js             # mysql2 连接池
│   ├── models/                  # 只写 SQL
│   ├── services/                # 业务规则（默认值、只读字段、日期格式化）
│   ├── controllers/             # 收参 + 统一响应
│   ├── routes/                  # 路由
│   ├── middlewares/errorHandler.js
│   └── utils/{response.js,date.js}
├── public/                      # 前端页面（Express 静态目录）
│   ├── index.html               # 图书列表
│   ├── detail.html              # 查看详情
│   ├── add.html                 # 新增图书
│   ├── edit.html                # 修改图书
│   ├── css/style.css
│   ├── js/{common,list,detail,add,edit}.js
│   └── lib/                     # jQuery 1.8.3（见该目录 README）
└── tests/api.test.js
```

## 环境要求

- Node.js 18+（CI 用 20）
- MySQL 8（5.7 亦可）

## 启动方式

```bash
# 1. 安装依赖
npm install

# 2. 配置数据库连接
cp .env.example .env        # Windows: copy .env.example .env

# 3. 建库并导入测试数据
mysql -h127.0.0.1 -uroot -p < book_manage.sql

# 4. 启动
npm start
```

浏览器打开 <http://localhost:3000> 即可看到图书列表页。

### 数据库配置（.env）

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| DB_HOST | 127.0.0.1 | 数据库地址 |
| DB_PORT | 3306 | 端口 |
| DB_USER | root | 用户名 |
| DB_PASSWORD | root | 密码 |
| DB_NAME | book_manage | 库名 |
| PORT | 3000 | 服务端口 |

## API 文档

所有接口统一返回 `{ success, message, data }`，失败时 HTTP 状态码同步为 400 / 404 / 500。
日期一律为 `YYYY-MM-DD`。

### GET /api/books — 图书列表

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| page | int | 页码，默认 1 |
| bookName | string | 图书名称模糊查询，可空 |

按 `creationTime` 降序排列，每页固定 5 条。

```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "bookId": 12, "bookCode": "BK0012", "bookName": "算法导论",
        "bookType": 8, "bookTypeName": "科技",
        "bookAuthor": "Thomas H. Cormen", "publishPress": "机械工业出版社",
        "publishDate": "2013-01-01", "borrowed": 0,
        "createdBy": "系统管理员", "creationTime": "2026-09-12",
        "lastUpdateTime": null
      }
    ],
    "total": 12, "page": 1, "pageSize": 5, "totalPages": 3
  }
}
```

### GET /api/books/:id — 图书详情

不存在返回 `404` 与 `{ success: false, message: "图书不存在" }`。

### POST /api/books — 新增图书

请求体（`borrowed`、`createdBy` 传空则取默认值：0 / 系统管理员；`creationTime` 由服务端取当前时间）：

```json
{
  "bookCode": "BK0013", "bookName": "围城", "bookType": 1,
  "bookAuthor": "钱锺书", "publishPress": "人民文学出版社",
  "publishDate": "1991-02-01", "borrowed": 0,
  "createdBy": "系统管理员", "creationTime": "2026-10-13"
}
```

### PUT /api/books/:id — 修改图书

字段同新增；`createdBy` 与 `creationTime` **不参与更新**，服务端自动写入 `lastUpdateTime`。

### DELETE /api/books/:id — 删除图书

### GET /api/book-types — 图书类型列表

返回 `[{ "id": 1, "typeName": "小说" }, ...]`，供新增/修改页下拉使用。

## 前端页面

| 页面 | 功能 |
| --- | --- |
| `index.html` | 图书列表：名称搜索、新增、隔行变色表格、分页（上一页/页码/下一页/共 N 页/跳转）、查看/修改/删除 |
| `detail.html` | 图书详情，全部字段只读，返回时保留列表页查询条件 |
| `add.html` | 新增图书，类型下拉取自数据库，默认 入库人=系统管理员 / 入库时间=今天 / 是否借阅=未借阅 |
| `edit.html` | 修改图书，入库人与入库时间只读 |

查询条件用 `sessionStorage` 记忆，从详情/新增/修改返回列表页时自动还原。

## 测试与 CI

```bash
npm test     # Jest + Supertest，需要先导入 book_manage.sql
```

`CI` 在 push 和 PR 到 `main` 时触发，运行器上用 `mysql:8.0` service 容器导入
`book_manage.sql` 后执行 `npm ci && npm test`。

> 注意：`npm ci` 依赖 `package-lock.json`，执行过 `npm install` 后要把它一起提交。

## Git 工作流

```
main ──●─────────────●─────────────●──▶
        \           /  \           /
         ●─feature/backend-api      ●─feature/frontend-pages
            (Issue: 后端)              (Issue: 前端)
```

1. `git init` 后提交初始骨架到 `main`
2. 在 GitHub 创建后端 Issue 与前端 Issue
3. `feature/backend-api` 开发后端 → PR（描述中用 `Closes #1` 关联 Issue）→ 合并后删除分支
4. `feature/frontend-pages` 开发前端 → PR（`Closes #2`）→ 合并后删除分支

提交信息约定：`feat` / `fix` / `docs` / `chore` + 中文描述，例如 `feat: 图书列表分页查询接口`。

## 数据库说明

- `book_type`：8 条类型数据（小说/文学/传记/艺术/少儿/经济/管理/科技）
- `book_info`：12 条图书数据，`creationTime` 各不相同，便于验证降序与分页
- `book_info.bookType` 外键关联 `book_type.id`

> 说明：试卷中「必填项」列出的是 图书编号、图书名称、图书类型、是否借阅、入库人、入库时间 6 项；
> 但 `bookAuthor`、`publishPress`、`publishDate` 在数据库中是 `NOT NULL`，表单不填必然保存失败，
> 因此前端把这三项也一并做了非空校验。
