const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');

//Product routes
router.post('/', productController.post);

router.get('/:productId', productController.getById);

router.delete('/:productId', productController.delete);

module.exports = router;