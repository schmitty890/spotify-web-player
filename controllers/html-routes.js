// var axios = require('axios');
// const { promisify } = require('util');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const passport = require('passport');
// const User = require('../models/User');
// var db = require("../models");

// const randomBytesAsync = promisify(crypto.randomBytes);

module.exports = function (app) {
  // Home Page
  app.get('/', function (req, res) {
    // assign the handlebar object any data to be read into the template. this separates the data from the markup.
    var hbsObject = {
      user: req.user
    };
    console.log(hbsObject);
    // console.log(hbsObject);
    res.render('index', {
      hbsObject: hbsObject
    });
  });

  // Sign in Page
  app.get('/signin', function (req, res) {
    var hbsObject = {
      user: req.user
    };
    res.render('pages/signin', {
      hbsObject: hbsObject
    });
  });

  // Sign in Page
  app.get('/signup', function (req, res) {
    var hbsObject = {
      user: req.user
    };
    res.render('pages/signup', {
      hbsObject: hbsObject
    });
  });

}