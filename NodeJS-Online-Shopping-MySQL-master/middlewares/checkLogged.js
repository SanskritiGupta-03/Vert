const isNotlogged =(req, res, next) => {
    if (req.session.user) {
      res.render("shop/index");
      return;
    }
    //else continue
    next();
  };

  module.exports = isNotlogged;