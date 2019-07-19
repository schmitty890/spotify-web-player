const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
var db = require("../models");

const randomBytesAsync = promisify(crypto.randomBytes);
const passportConfig = require('../config/passport');

module.exports = function (app) {

  /**
   * GET /profile
   * Profile page
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/profile', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }
    console.log(hbsObject);
    res.render('profile', {
      title: 'profile',
      hbsObject: hbsObject
    });
  });

  /**
   * GET /player
   * Player page
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/player', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }
    console.log(hbsObject);
    res.render('player', {
      title: 'player',
      hbsObject: hbsObject
    });
  });

  /**
   * GET /browse
   * Player page
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/browse', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }
    console.log(hbsObject);
    res.render('browse', {
      title: 'browse',
      hbsObject: hbsObject
    });
  });

  /**
   * GET /my-properties
   * my-properties page
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/my-properties', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }

    db.Property.find({}, null, { sort: {'_id': -1} }, function(error, data) {
      if (error) throw error;
      // console.log(data);

      hbsObject.property = data;
      console.log(hbsObject);
      res.render('my-properties', {
        title: 'My Properties',
        hbsObject: hbsObject
      });
    });
  });

  // route for updating articles in db for saved/unsaved
  app.put("/my-properties/:id", function(req, res) {
    console.log(req.params.id);
    // update at req.params.id, update with req.body from app.js, throw err if err, if not - log the result, send back 200 if successful
    // db.Property.update({ _id: req.params.id }, { $set: req.body }, function(err, result) {
    //   if (err) throw err;
    //   console.log(result);
    //   res.sendStatus(200);
    // });
  });

  /**
   * GET /submit-property
   * submit-property page
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/submit-property', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }
    res.render('submit-property', {
      title: 'Submit Property',
      hbsObject: hbsObject
    });
  });

  // Route for saving a new property
  app.post("/submit-property", passportConfig.isAuthenticated, function(req, res) {
    console.log(req.body);
    // Create a new Property and pass the req.body to the entry
    db.Property.create(req.body)
      .then(function(dbProperty) {
        // If saved successfully, send the the new Property document to the client
        // res.json(dbProperty);
        res.send('you saved a property!');
        // res.redirect('/my-properties');
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  /**
   * GET /edit-property
   * edit-property page
   * Ensure user is authenticated in passport first then render account page
   */
  // route for updating articles in db for saved/unsaved
  app.get("/edit-property/:id", function(req, res) {
    console.log(req.params.id);
    // update at req.params.id, update with req.body from app.js, throw err if err, if not - log the result, send back 200 if successful
    db.Property.find({ _id: req.params.id }, function(err, property) {
      if (err) throw err;
      // console.log(property);
      const hbsObject = {
        property: property[0]
      }
      console.log(hbsObject.property);
      res.render('update-property', {
        title: 'Update Property',
        hbsObject: hbsObject
      });
    });
  });

  // route for updating property in db for saved/unsaved
  app.put("/edit-property/:id", function(req, res) {
    console.log(req.params.id);
    console.log(req.body);
    // update at req.params.id, update with req.body from app.js, throw err if err, if not - log the result, send back 200 if successful
    db.Property.update({ _id: req.params.id }, { $set: req.body }, function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send('you updated a property!');
    });
  });

  // delete property
  app.delete("/edit-property/:id", function(req, res) {
    db.Property.remove({ _id: req.params.id }, function(err, data) {
      if (err) throw err;
      console.log(data);
      res.send('you deleted a property!');
      // res.sendStatus(200);
    })
  });


  /**
   * GET /my-tenants
   * my-tenants page
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/my-tenants', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }

    db.User.find({}, null, { sort: {'_id': -1} }, function(error, data) {
      if (error) throw error;
      // console.log(data);

      hbsObject.users = data;
      console.log(hbsObject);
      res.render('my-tentants', {
        title: 'My Tentants',
        hbsObject: hbsObject
      });
    });
  });

  // route for updating property in db for saved/unsaved
  app.put("/my-tenants/:id", function(req, res) {
    console.log(req.params.id);
    console.log(req.body);
    console.log(req.body.adminVerified);
    // update at req.params.id, update with req.body from app.js, throw err if err, if not - log the result, send back 200 if successful
    // db.User.update({ _id: req.params.id }, { $set: req.body }, function(err, result) {
    //   if (err) throw err;
    //   console.log(result);
    //   res.send('you updated a property!');
    // });
    db.User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function(err, result) {
      if (err) throw err;
      console.log(result);
      console.log('you updated a user!');
      res.send('you updated a user!');
    });
  });


  /**
   * GET /my-tenants
   * my-tenants page
   * Ensure user is authenticated in passport first then render account page
   */
  // route for updating articles in db for saved/unsaved
  app.get("/my-tentants-detail/:id", function(req, res) {
    console.log(req.params.id);
    // update at req.params.id, update with req.body from app.js, throw err if err, if not - log the result, send back 200 if successful
    db.User.find({ _id: req.params.id }, function(err, tentant) {
      if (err) throw err;
      // console.log(user);
      const hbsObject = {
        user: req.user,
        tentant: tentant[0]
      }
      console.log(hbsObject.tentant);

      if(hbsObject.tentant === undefined) {
        res.render('404', {
          title: '404',
          hbsObject: hbsObject
        });
      } else {
        res.render('my-tentants-detail', {
          title: 'my tentants detail',
          hbsObject: hbsObject
        });
      }
    });
  });

  /**
   * POST /my-tentants-detail-email-message
   * my-tentants-detail-email-message route
   * Ensure user is authenticated in passport first then render account page
   */
  // route for sending email to tentant
  app.post("/my-tentants-detail-email-message", function(req, res) {
    console.log('sending email to tentant');
    console.log(req.body);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAILEMAIL,
        pass: process.env.GMAILPASS
      }
    });

    const mailOptions = {
      to: req.body.tentantEmail,
      from: process.env.GMAILEMAIL,
      subject: req.body.subject,
      text: req.body.message
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! You have subscribed.' });
      })
      .then(() => { if(!res.finished) res.send('your email has been sent'); })
      .catch(err => next(err));
  });

  /**
   * POST /my-tentants-detail-note
   * my-tentants-detail-note route
   * Ensure user is authenticated in passport first then render account page
   */
  // route for sending email to tentant
  app.post("/my-tentants-detail-note/:id", function(req, res) {
    console.log('saving note about tentant');
    console.log(req.body);
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        console.log(`our note: ${dbNote}`);
        // if note creation success, find user with req.body.tentantId match, associate it with the comment body sent from app.js by pushing it to comments array
        // new true returns updated user
        return db.User.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote } }, { new: true });
      })
      .then(function(dbNote) {
        // we were able to successfully add a Note, send it back, otherwise send the error
        res.json(dbNote);
      })
      .catch(function(err) {
        res.json(err);
      });
  });


// Route for grabbing a specific Article by id
app.get("/my-tentants-detail-note/:id", function(req, res) {
  console.log(req.params.id);
  // Using the id passed in the id parameter, find it, populate it with its comments, send back json if successful/error if not
  db.User.findById({ _id: req.params.id })
    .populate("notes")
    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// delete route for comment removal
app.delete("/my-tentants-detail-note/:id", function(req, res) {
  db.Note.remove({ _id: req.params.id }, function(err, data) {
    if (err) throw err;
    console.log(data);
    res.sendStatus(200);
  })
});

// faq routes
app.post("/api/faq", passportConfig.isAuthenticated, function(req, res) {
  console.log('an authenticated faq posting - save to the db');
});


  /**
   * GET /story-post
   * Account page
   * Ensure user is authenticated in passport first then render story-post page
   */
  app.get('/story-post', passportConfig.isAuthenticated, function(req, res) {
    const hbsObject = {
      user: req.user
    }
    res.render('story-post', {
      title: 'Story Post',
      hbsObject: hbsObject
    });
  });


  /**
   * POST /account/profile
   * Update profile information.
   * Ensure user is authenticated in passport first then render account page
   */
  app.post('/account/profile', passportConfig.isAuthenticated, function(req, res) {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if(errors) {
      req.flash('errors', errors);
      return res.redirect('/account');
    }

    User.findById(req.user.id, (err, user) => {
      if(err) { return next(err); }
      user.email = req.body.email || '';
      user.teamName = req.body.teamName || '';
      user.logo = req.body.logo || '';
      user.profile.name = req.body.name || '';
      user.profile.gender = req.body.gender || '';
      user.profile.location = req.body.location || '';
      user.profile.website = req.body.website || '';
      user.save((err) => {
        if(err) {
          if(err.code === 11000) {
            req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
            return res.redirect('/account');
          }
          return next(err);
        }
        req.flash('success', { msg: 'Profile information has been updated.' });
        res.redirect('/account');
      });
    });
  });



  /**
   * POST /account/password
   * Update current password.
   */
  app.post('/account/password', passportConfig.isAuthenticated, function(req, res) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if(errors) {
      req.flash('errors', errors);
      return res.redirect('/account');
    }

    User.findById(req.user.id, (err, user) => {
      if(err) { return next(err); }
      user.password = req.body.password;
      user.save((err) => {
        if(err) { return next(err); }
        req.flash('success', { msg: 'Password has been changed.' });
        res.redirect('/account');
      });
    });
  });


  /**
   * POST /account/delete
   * Delete user account.
   */
  app.post('/account/delete', passportConfig.isAuthenticated, function(req, res) {
    User.remove({ _id: req.user.id }, (err) => {
      if(err) { return next(err); }
      req.logout();
      req.flash('info', { msg: 'Your account has been deleted.' });
      res.redirect('/');
    });
  });


};
