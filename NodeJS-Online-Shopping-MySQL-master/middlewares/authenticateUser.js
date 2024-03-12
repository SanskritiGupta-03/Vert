const hasAccess =(req, res, next) => {
    if (!req.session.user) {
      
    if(req.url!='/favicon.ico')
     req.session.originalUrl = req.originalUrl;

      res.render("login");
      return;
    }
    //else continue
    next();
  };

  module.exports = hasAccess;