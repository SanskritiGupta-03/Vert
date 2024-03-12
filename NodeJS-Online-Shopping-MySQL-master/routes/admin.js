const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const hasAccess = require('../middlewares/authenticateUser');


// /admin/add-product
// get request
router.get('/add-product',hasAccess, adminController.getAddProduct);

// /admin/add-product
// post request
router.post('/add-product',hasAccess, adminController.postAddProduct);

// /admin/products
// get request
router.get('/products',hasAccess, adminController.getProducts);

// /admin/edit-product
// get request
router.get('/edit-product/:productId',hasAccess, adminController.getEditProduct);

// /admin/edit-product
// post request
router.post('/edit-product',hasAccess, adminController.postEditProduct);

// /admin/delete-product
// post request
router.post('/delete-product',hasAccess, adminController.postDeleteProduct);


module.exports = router;