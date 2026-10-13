-- 图书借阅系统（后台管理）数据库脚本
-- 可重复执行：先删库再重建

DROP DATABASE IF EXISTS book_manage;
CREATE DATABASE book_manage DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE book_manage;

-- ----------------------------
-- 图书类型表
-- ----------------------------
CREATE TABLE book_type (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  typeName VARCHAR(50) NOT NULL COMMENT '图书类型名称'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

INSERT INTO book_type (typeName) VALUES
('小说'), ('文学'), ('传记'), ('艺术'), ('少儿'), ('经济'), ('管理'), ('科技');

-- ----------------------------
-- 图书信息表
-- ----------------------------
CREATE TABLE book_info (
  bookId         INT PRIMARY KEY AUTO_INCREMENT,
  bookCode       VARCHAR(50)  NOT NULL COMMENT '图书编号',
  bookName       VARCHAR(100) NOT NULL COMMENT '图书名称',
  bookType       INT          NOT NULL COMMENT '图书类型，关联 book_type.id',
  bookAuthor     VARCHAR(50)  NOT NULL COMMENT '作者',
  publishPress   VARCHAR(100) NOT NULL COMMENT '出版社',
  publishDate    DATE         NOT NULL COMMENT '出版日期',
  borrowed       INT          NOT NULL DEFAULT 0 COMMENT '1=已借阅，0=未借阅',
  createdBy      VARCHAR(50)  NOT NULL COMMENT '创建人',
  creationTime   DATETIME     NOT NULL COMMENT '创建时间',
  lastUpdateTime DATETIME     NULL COMMENT '最新更新时间',
  CONSTRAINT fk_book_info_type FOREIGN KEY (bookType) REFERENCES book_type (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 12 条测试数据：每页 5 条 → 共 3 页；creationTime 各不相同，便于验证降序
INSERT INTO book_info
(bookCode, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed, createdBy, creationTime, lastUpdateTime)
VALUES
('BK0001', '活着',               1, '余华',              '作家出版社',        '1993-01-01', 0, 'admin', '2026-09-01 09:10:00', NULL),
('BK0002', '三体',               1, '刘慈欣',            '重庆出版社',        '2008-01-01', 1, 'admin', '2026-09-02 10:20:00', '2026-09-12 08:30:00'),
('BK0003', '百年孤独',           2, '加西亚·马尔克斯',   '南海出版公司',      '2011-06-01', 0, 'admin', '2026-09-03 11:30:00', NULL),
('BK0004', '苏东坡传',           3, '林语堂',            '湖南文艺出版社',    '2018-01-01', 1, 'admin', '2026-09-04 14:05:00', NULL),
('BK0005', '艺术的故事',         4, '贡布里希',          '广西美术出版社',    '2008-04-01', 0, 'admin', '2026-09-05 15:40:00', NULL),
('BK0006', '小王子',             5, '圣埃克苏佩里',      '人民文学出版社',    '2003-08-01', 0, 'admin', '2026-09-06 09:00:00', NULL),
('BK0007', '国富论',             6, '亚当·斯密',         '商务印书馆',        '2015-01-01', 1, 'admin', '2026-09-07 16:15:00', NULL),
('BK0008', '卓有成效的管理者',   7, '彼得·德鲁克',       '机械工业出版社',    '2009-05-01', 0, 'admin', '2026-09-08 08:45:00', NULL),
('BK0009', '深入理解计算机系统', 8, 'Randal E. Bryant',  '机械工业出版社',    '2016-11-01', 0, 'admin', '2026-09-09 13:20:00', NULL),
('BK0010', '平凡的世界',         1, '路遥',              '北京十月文艺出版社', '2017-06-01', 1, 'admin', '2026-09-10 10:10:00', '2026-09-15 09:00:00'),
('BK0011', '人类简史',           2, '尤瓦尔·赫拉利',     '中信出版社',        '2014-11-01', 0, 'admin', '2026-09-11 17:35:00', NULL),
('BK0012', '算法导论',           8, 'Thomas H. Cormen',  '机械工业出版社',    '2013-01-01', 0, 'admin', '2026-09-12 09:55:00', NULL);
