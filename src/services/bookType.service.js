const bookTypeModel = require('../models/bookType.model');

async function list() {
  return bookTypeModel.findAll();
}

module.exports = { list };
