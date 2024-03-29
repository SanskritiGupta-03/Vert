const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    name: req.session.user.username,
    isAdmin : req.session.user.is_admin
  });
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const productType= req.body.productType;
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      productType: productType
    })
    .then(result => {
      console.log('Product created successfully');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  req.user
    .getProducts({
      where: {
        id: prodId
      }
    })
    // Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        title: 'Edit Product',
        path: '/admin/products',
        editing: editMode,
        product: product,
        name: req.session.user.username,
        isAdmin : req.session.user.is_admin
      });
    })
    .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedProductType = req.body.productType;

  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.productType= updatedProductType;
      return product.save();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        products: products,
        title: 'Admin Products',
        path: '/admin/products',
        name: req.session.user.username,
        isAdmin : req.session.user.is_admin
      });
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getProducts({
      where: {
        id: prodId
      }
    })
    // Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      product.destroy();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}