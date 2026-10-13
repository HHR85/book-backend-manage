const path = require('path');
const express = require('express');
require('dotenv').config();

const { errorHandler } = require('./src/middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'ok', data: null }));
app.use('/api/books', require('./src/routes/book.routes'));
app.use('/api/book-types', require('./src/routes/bookType.routes'));

app.use(errorHandler);

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => console.log(`图书管理系统已启动：http://localhost:${port}`));
}

// 导出给 Supertest 用，测试时不重复监听端口
module.exports = app;
