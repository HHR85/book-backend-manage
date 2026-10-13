const express = require('express');
const ctrl = require('../controllers/bookType.controller');
const { wrap } = require('../middlewares/errorHandler');

const router = express.Router();

router.get('/', wrap(ctrl.list));

module.exports = router;
