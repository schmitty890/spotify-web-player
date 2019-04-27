/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs');
// const dotenv = require('dotenv').config();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('express-flash');
const lusca = require('lusca');
const expressValidator = require('express-validator');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
// dotenv.load({ path: '.env' });

// require models
var db = require("./models");


/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spotifywebplayer';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'anything',
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: MONGODB_URI,
    autoReconnect: true,
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user &&
    (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});


/**
 * Express configuration.
 */
// set port to 8888
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set the path read the views folder that holds the handlebar html templates
app.set('views', path.join(__dirname, 'views'));

// set the teplating engine to render handlebars with default layout and any custom handlebar helper functions
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
// set the view engine to handlebars
app.set('view engine', 'handlebars');

// read the build folder when server is running
app.use('/build', express.static(__dirname + '/build'));
app.use('/public', express.static(__dirname + '/public'));

/**
 * Get all routes
 */
require('./controllers/html-routes.js')(app);
// require('./controllers/auth-routes.js')(app);

/**
 * show 404 page if no route has been hit
 */
app.get('*', function(req, res) {
  res.render('404');
});

// module.exports = {
//   sayHello: function() {
//     return 'hello1';
//   },
//   addNumbers: function(x, y) {
//     return x + y;
//   }
// }

/**
 * Start Express server.
 */
console.log('the process.env.PORT is: ' + app.get('port'));
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('Success!!'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});
