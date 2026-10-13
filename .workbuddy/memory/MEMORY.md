# 项目长期笔记：图书借阅系统（月测）

## 技术栈
Express 4 + MySQL2 + Jest/Supertest，无 ORM，原生 SQL。前端 jQuery 1.8.3 + 原生 HTML。

## 环境约定（重要）
- 本机 MySQL 8.1，路径 `C:\Program Files\MySQL\MySQL Server 8.1\bin`，**root 密码 `123456`**，服务已启动。
- 导入 SQL 必须带 `--default-character-set=utf8mb4`。
- 端口 3000。启动 `npm start`，测试 `npm test`。

## 代码约定
- API 统一响应 `{ success, message, data }`（`src/utils/response.js`）。
- 列表接口查询参数：`page`（默认1）、`bookName`（模糊，参数名不是 keyword）。每页固定 5 条。
- 数据库 NOT NULL 字段：bookCode/bookName/bookType/bookAuthor/publishPress/publishDate，故 `REQUIRED` 校验 6 项（试卷字面只列 6 项中的部分，多校 3 项有注释说明）。
- 修改接口不更新 createdBy / creationTime，只更新 lastUpdateTime。
- 测试数据 12 条（试卷要求 ≥5，为演示 3 页翻页而加量）。

## 已知坑
- CI 里 mysql 导入必须带 utf8mb4 参数，已修 `.github/workflows/ci.yml`。
- 本机无 `gh` CLI。
