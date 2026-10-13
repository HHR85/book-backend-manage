const request = require('supertest');
const app = require('../app');
const pool = require('../src/config/db');

const NEW_BOOK = {
  bookCode: 'BK9999',
  bookName: '测试图书',
  bookType: 1,
  bookAuthor: '测试作者',
  publishPress: '测试出版社',
  publishDate: '2026-01-01',
  borrowed: 0,
  createdBy: '系统管理员',
  creationTime: '2026-10-13',
};

let createdId;

afterAll(async () => {
  await pool.end();
});

describe('图书管理接口', () => {
  test('GET /api/books 返回 200 且包含分页数据', async () => {
    const res = await request(app).get('/api/books').query({ page: 1 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { data } = res.body;
    expect(Array.isArray(data.list)).toBe(true);
    expect(data.list.length).toBeLessThanOrEqual(5);
    expect(data.pageSize).toBe(5);
    expect(typeof data.total).toBe('number');
    expect(typeof data.totalPages).toBe('number');
  });

  test('GET /api/book-types 返回 200 且至少 5 条类型', async () => {
    const res = await request(app).get('/api/book-types');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(5);
  });

  test('POST /api/books 新增后能查询到', async () => {
    const created = await request(app).post('/api/books').send(NEW_BOOK);
    expect(created.status).toBe(200);
    expect(created.body.success).toBe(true);
    expect(created.body.data.borrowed).toBe(0);      // 默认未借阅
    createdId = created.body.data.bookId;

    const res = await request(app).get('/api/books').query({ bookName: NEW_BOOK.bookName });
    expect(res.status).toBe(200);
    expect(res.body.data.list.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.list[0].bookName).toBe(NEW_BOOK.bookName);
  });

  test('PUT /api/books/:id 入库人与入库时间不被改写', async () => {
    const before = await request(app).get('/api/books/' + createdId);

    const res = await request(app).put('/api/books/' + createdId).send({
      ...NEW_BOOK,
      bookName: '测试图书-已改',
      createdBy: '不该生效的人',
      creationTime: '2000-01-01',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.bookName).toBe('测试图书-已改');
    expect(res.body.data.createdBy).toBe(before.body.data.createdBy);
    expect(res.body.data.creationTime).toBe(before.body.data.creationTime);
    expect(res.body.data.lastUpdateTime).not.toBeNull();
  });

  test('DELETE /api/books/:id 删除后查不到', async () => {
    const res = await request(app).delete('/api/books/' + createdId);
    expect(res.status).toBe(200);

    const after = await request(app).get('/api/books/' + createdId);
    expect(after.status).toBe(404);
    expect(after.body.success).toBe(false);
  });

  test('GET /api/books/:id 不存在的图书返回 404', async () => {
    const res = await request(app).get('/api/books/99999999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
