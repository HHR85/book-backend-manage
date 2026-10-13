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
- **入库人默认值 = `admin`**（试卷条文 12C 硬要求，用户已确认）；前端 `add.js` 与服务端 `DEFAULT_CREATED_BY` 两处必须同步。
- 修改接口不更新 createdBy / creationTime，只更新 lastUpdateTime。
- 测试数据 12 条（试卷要求 ≥5，为演示 3 页翻页而加量）。
- 测试 8 条，其中 1 条专门锁"不传 createdBy 默认 admin"，1 条锁 400 校验。

## 试卷依据
- 原文：`C:\Users\hhr\Desktop\quiz\2016年10月学士后Java毕业考试机试试卷-2.pdf`（8页）
- 原卷要求 Java（SSH/SSM），本项目按用户要求改为 Express + MySQL + jQuery 1.8.3。
- 分值关注点：分页/降序/日期格式、模糊查询+条件记忆、详情只读、增改必填校验与提示、
  删除确认、类型下拉取库、SQL 文件随代码提交、界面美观、注释规范、异常处理。


## 已知坑
- CI 里 mysql 导入必须带 utf8mb4 参数，已修 `.github/workflows/ci.yml`。
- 本机无 `gh` CLI。
- **Git 联网必须走代理**：`http://127.0.0.1:58799`。已全局配置
  `http.proxy`/`https.proxy` + `http.sslBackend=schannel` + `http.sslVerify=false`
  + `http.schannelCheckRevoke=false`。缺任一项都会报 SSL/吊销检查错误。
- 查 CI 状态：GitHub REST API `https://api.github.com/repos/HHR85/book-backend-manage/actions/runs`，
  用 PowerShell Invoke-WebRequest 拉取（注意出网也要走代理，PowerShell 默认能通）。

## 远端仓库
- `https://github.com/HHR85/book-backend-manage.git`（public，默认分支 main）
- 首次 CI run 全绿（2026-10-13）。

