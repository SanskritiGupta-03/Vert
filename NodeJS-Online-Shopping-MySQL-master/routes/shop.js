const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

const hasAccess = require('../middlewares/authenticateUser');

// /
// get request
router.get('/',hasAccess ,shopController.getIndex);

// /products
// get request
router.get('/products',hasAccess, shopController.getProducts);

// /products/:id
// get request
router.get('/products/:productId',hasAccess, shopController.getProduct);

// /cart
// get request
router.get('/cart',hasAccess, shopController.getCart);

// /cart
// post request
router.post('/cart',hasAccess, shopController.postCart);

// /cart-delete-item
// post request
router.post('/cart-delete-item',hasAccess, shopController.postCartDeleteProduct);

// /create-order
// post request
router.post('/create-order',hasAccess, shopController.postOrder);

// /checkout
// get request
router.get('/checkout',hasAccess, shopController.getCheckout);

// /orders
// get request
router.get('/orders',hasAccess, shopController.getOrders);

router.get('/searchresults/:prodtitle',hasAccess, shopController.getSearchResults);

router.get('/categoryresults/:category',hasAccess, shopController.getCategoryResults);

module.exports = router;