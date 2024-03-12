const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const cookieSession = require("cookie-session");
const hasAccess = require('./middlewares/authenticateUser');
const isNotlogged = require('./middlewares/checkLogged');
const path = require('path');
const bcrypt = require("bcryptjs");

const errorsController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use(
  cookieSession({
    keys: ["randomStringASyoulikehjudfsajk"],
  })
);

app.use('/admin', adminRoutes);
app.get("/logout", hasAccess, (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});
app.get('/register', (req, res) => {
  res.render("register");
  //res.sendFile(path.join(initial_path, "about.ejs"));
});
app.get('/login',isNotlogged, (req, res) => {
  res.render("login");
  //res.sendFile(path.join(initial_path, "about.ejs"));
});

app
  .post("/login",isNotlogged, async (req, res) => {
    const { username, password } = req.body;

    // check for missing filds
    if (!username || !password) return res.send("Please enter all the fields");

    const doesUserExits = await User.findOne({ 
      where: { 
        username:username
     }});

    if (!doesUserExits) return res.render('relogin');

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch && password!= doesUserExits.password) return res.render('relogin');

    // else he\s logged in
    req.session.user = {
      username,
      is_admin:doesUserExits.is_admin,
      userid:doesUserExits.id
    };
    
    res.redirect("/");
  });

  app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // check for missing filds
    if (!username || !password) return res.send("Please enter all the fields");

    const doesUserExitsAlreay = await User.findOne({ 
      where: { 
        username:username
     }});

    if (doesUserExitsAlreay) return res.send("A user with that email already exits please try another one!");

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    

    User
      .create({ username, password: hashedPassword })
      .then((user) => {
        res.send("registered account!");
        res.redirect("/login");
      })
      .catch((err) => console.log(err));
  });

app.use(shopRoutes);

app.use(errorsController.get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    User.findByPk(1)
      .then(user => {
        if (!user) {
          return User.create({
            username: 'arthik',
            password: 'karthik@gmail.com',
            is_admin: true
          });
        }
        return user;
      })
      .then(user => {
        Cart.findOne({
          where: {
            userId: user.id
          }
        })
          .then(cart => {
            if (!cart) {
              return user.createCart();
            }
            return cart;
          })
      })
      .then(cart => {
        app.listen(process.env.PORT || 5000);
      })
      .catch(err => console.log(err));
  })
  .catch(err => {
    console.log(err);
  });

