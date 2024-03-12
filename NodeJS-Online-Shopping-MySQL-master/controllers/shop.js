const Product = require('../models/product');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/products', {
        products: products,
        title: 'All Products',
        path: '/products',
        name: req.session.user.username,
        isAdmin : req.session.user.is_admin
      });
    })
    .catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  // Product.findAll({
  //   where: {
  //     id: productId
  //   }
  // })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       title: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        title: product.title,
        path: '/products',
        isAdmin : req.session.user.is_admin,
        name: req.session.user.username,
      });
    })
    .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        products: products,
        title: 'Shop',
        path: '/',
        name: req.session.user.username,
        isAdmin : req.session.user.is_admin
      });
    })
    .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            title: 'Your cart',
            path: '/cart',
            products: products,
            name: req.session.user.username,
            isAdmin : req.session.user.is_admin
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
  let fetchedCart;
  let newQuantity = 1;
  const productId = req.body.productId;
  const productCost = parseInt(req.body.productCost);
  let newCost = parseInt(req.body.productCost);
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({
        where: {
          id: productId
        }
      });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        // ... increase quantity by 1
        const oldQuantity = product.cartItem.quantity;
        const oldCost = parseInt(product.cartItem.cost);
        newQuantity = oldQuantity + 1;
        newCost = oldCost + productCost;
        return product;
      }
      return Product.findByPk(productId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQuantity,
          cost: newCost
        }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.getCart()
    .then(cart => {
      return cart.getProducts({
        where: {
          id: prodId
        }
      });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = {
              quantity: product.cartItem.quantity
            };
            return product;
          }));
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] , where: {
        userId: req.session.user.userid
      }})
    .then(orders => {
      res.render('shop/orders', {
        title: 'Your orders',
        path: '/orders',
        orders: orders,
        name: req.session.user.username,
        isAdmin : req.session.user.is_admin
      });
    })
    .catch(err => console.log(err));
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    title: 'Checkout',
    path: '/checkout',
    name: req.session.user.username,
    isAdmin : req.session.user.is_admin
  })
}

exports.getSearchResults = (req,res,next)=>{
let totalpath = req.url;
let title_idarr = totalpath.split("/");
let title_id = title_idarr[2];

  Product.findAll({
    where: { 
      title: {
        [Op.like]: `%${title_id}%`
      } }
}).then(products => {
  res.render('shop/searchresults', {
    products: products,
    title: 'Search Results',
    path: '/',
    name: req.session.user.username,
    isAdmin : req.session.user.is_admin
  });
})
.catch(err => console.log(err));;

}

exports.getCategoryResults = (req,res,next)=>{

  console.log("Hrllo");
  let totalpath = req.url;
  let categoryarr = totalpath.split("/");
  let category = categoryarr[2];
  console.log(category);

  Product.findAll({
    where: { 
      productType: category }
}).then(products => {
  res.render('shop/categoryresults', {
    products: products,
    title: `${category} Results`,
    path: '/',
    name: req.session.user.username,
    isAdmin : req.session.user.is_admin
  });
})
.catch(err => console.log(err));;

}

