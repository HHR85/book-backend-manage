const express = require('express');
const ctrl = require('../controllers/book.controller');
const { wrap } = require('../middlewares/errorHandler');

const router = express.Router();

router.get('/', wrap(ctrl.list));
router.get('/:id', wrap(ctrl.detail));
router.post('/', wrap(ctrl.create));
router.put('/:id', wrap(ctrl.modify));
router.delete('/:id', wrap(ctrl.remove));

module.exports = router;
