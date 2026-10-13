// 统一输出 YYYY-MM-DD，空值返回 null
function toDateStr(value) {
  if (!value) return null;
  if (value instanceof Date) {
    const p = (n) => String(n).padStart(2, '0');
    return `${value.getFullYear()}-${p(value.getMonth() + 1)}-${p(value.getDate())}`;
  }
  return String(value).slice(0, 10);
}

module.exports = { toDateStr };
