const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
var db = require("../models");
const axios = require("axios");

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
   * GET /playlist
   * Playlist page
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/playlist', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }
    console.log(hbsObject);

    var SpotifyWebApi = require('spotify-web-api-node');
    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENTSECRET
    });

    var authToken = process.env.SPOTIFY_TOKEN;
    var myPlaylist = process.env.SPOTIFY_PLAYLIST;

    spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(authToken);

        // Get a playlist
        spotifyApi.getPlaylist(myPlaylist)
          .then(function(data) {
            // console.log('Some information about this playlist', data.body);
            hbsObject.tracks = [...data.body.tracks.items].reverse();
            // console.log(hbsObject.tracks[0].track);
            res.render('playlist', {
              title: 'playlist',
              hbsObject: hbsObject
            });

          }, function(err) {
            console.log('Something went wrong!', err);
            res.send('Oh No! Tell Jason to refresh the token!');
          });

      }, function(err) {
        console.log('Something went wrong when retrieving an access token', err.message);
      });
  });

  /**
   * GET /currently-playing
   * Currently-playing endpoint
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/currently-playing', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }

    var SpotifyWebApi = require('spotify-web-api-node');
    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENTSECRET
    });

    var authToken = process.env.SPOTIFY_TOKEN;
    var myPlaylist = process.env.SPOTIFY_PLAYLIST;

    spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(authToken);

          // Get information about current playing song for signed in user
          spotifyApi.getMyCurrentPlaybackState({
          })
          .then(function(data) {
            // Output items
            console.log("Now Playing: ",data.body);
            res.send(data.body);

          }, function(err) {
            console.log('Something went wrong!', err);
          });

          }, function(err) {
            console.log('Something went wrong!', err);
            res.send('Oh No! Tell Jason to refresh the token!');
          });
  });


  /**
   * POST /remove-from-playlist
   * Playlist page
   * Ensure user is authenticated in passport first then render account page
   */
  app.post('/remove-from-playlist', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }

    var SpotifyWebApi = require('spotify-web-api-node');
    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENTSECRET
    });

    var authToken = process.env.SPOTIFY_TOKEN;
    var myPlaylist = process.env.SPOTIFY_PLAYLIST;

    spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(authToken);


        // Remove all occurrence of a track
        var theTrackToRemove = req.body.info;
        var tracks = [{ uri : `spotify:track:${theTrackToRemove}` }];
        // var options = { snapshot_id : "0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9" };
        spotifyApi.removeTracksFromPlaylist(myPlaylist, tracks)
          .then(function(data) {
            console.log('Tracks removed from playlist!');
            res.send(theTrackToRemove);
          }, function(err) {
            console.log('Something went wrong!', err);
          });

          }, function(err) {
            console.log('Something went wrong!', err);
          });
  });

  /**
   * GET /search
   * Search page
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/search', passportConfig.isAuthenticated, function(req, res) {
    console.log('SUCCESS!!!!!!');
    const hbsObject = {
      user: req.user
    }
    console.log(hbsObject);
    res.render('search', {
      title: 'search',
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
   * GET /spotify
   * Spotify page
   * Ensure user is authenticated in passport first then render account page
   */
  app.get('/spotify', passportConfig.isAuthenticated, function(req, res) {
    var SpotifyWebApi = require('spotify-web-api-node');
    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENTSECRET
    });

    var authToken = process.env.SPOTIFY_TOKEN;
    var myPlaylist = process.env.SPOTIFY_PLAYLIST;

    console.log(spotifyApi);
    console.log('we here');

    // const spotifyApi = new SpotifyWebApi({
    //   clientId: 'myClientId',
    //   clientSecret: 'myClientSecret',
    //   redirectUri: 'myRedirectUri',
    // });

    // Set an access token.
    // This is required as Spotify implemented a new auth flow since May 2017.
    // See https://developer.spotify.com/news-stories/2017/01/27/removing-unauthenticated-calls-to-the-web-api/
    spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(authToken);

// Get the authenticated user
spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get a user's playlists
spotifyApi.getUserPlaylists('schmitty890')
  .then(function(data) {
    console.log('Retrieved playlists', data.body);
  },function(err) {
    console.log('Something went wrong!', err);
  });

// Search tracks whose name, album or artist contains 'Love'
spotifyApi.searchTracks('Ransom')
  .then(function(data) {
    console.log('Search by "Ransom"', data.body.tracks);
  }, function(err) {
    console.error(err);
  });

  
// Add tracks to a playlist
// spotifyApi.addTracksToPlaylist('0TFs4Jvyajd6B8yW5o4mPs', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh"])
//   .then(function(data) {
//     console.log('Added tracks to playlist!');
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });

      }, function(err) {
        console.log('Something went wrong when retrieving an access token', err.message);
      });



    const hbsObject = {
      user: req.user
    }
    res.render('player', {
      hbsObject: hbsObject
    });
  });


  /**
   * POST /spotify-add-to-playlist
   * Spotify-add-to-playlist endpoint
   * Ensure user is authenticated in passport first then render account page
   */
  app.post('/spotify-add-to-playlist', passportConfig.isAuthenticated, function(req, res) {
    console.log(req.body);
    var SpotifyWebApi = require('spotify-web-api-node');
    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENTSECRET
    });

    var authToken = process.env.SPOTIFY_TOKEN;
    var myPlaylist = process.env.SPOTIFY_PLAYLIST;
    // console.log(spotifyApi);
    // console.log('we here');

    // Set an access token.
    // This is required as Spotify implemented a new auth flow since May 2017.
    // See https://developer.spotify.com/news-stories/2017/01/27/removing-unauthenticated-calls-to-the-web-api/
    spotifyApi.clientCredentialsGrant(authToken)
      .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(authToken);

  
      // Add tracks to a playlist
      spotifyApi.addTracksToPlaylist(myPlaylist, ["spotify:track:" + req.body.info])
        .then(function(data) {
          console.log('Added tracks to playlist!');
          res.json(req.body.info);
        }, function(err) {
          console.log('Something went wrong!', err);
        });

      }, function(err) {
        console.log('Something went wrong when retrieving an access token', err.message);
      });
  });

  /**
   * GET /spotify-search
   * Spotify page
   * Ensure user is authenticated in passport first then render account page
   */
  app.post('/spotify-search', passportConfig.isAuthenticated, function(req, res) {
    console.log(req.body);

    var SpotifyWebApi = require('spotify-web-api-node');
    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENTSECRET
    });

    var authToken = process.env.SPOTIFY_TOKEN;
    var myPlaylist = process.env.SPOTIFY_PLAYLIST;

    spotifyApi.clientCredentialsGrant(authToken)
      .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(authToken);
        

      // Search tracks whose name, album or artist contains 'Love'
      spotifyApi.searchTracks(req.body.info)
        .then(function(data) {
          console.log('Search by "Ransom"', data.body.tracks);
          res.json(data.body.tracks);
        }, function(err) {
          console.error(err);
          res.json(err);
        });

      }, function(err) {
        console.log('Something went wrong when retrieving an access token', err.message);
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

  // Endpoint for saving a liked song
  app.post("/like-song", passportConfig.isAuthenticated, function(req, res) {
    // console.log(req.body);
    var newLikedSong = {
      title: req.body.title,
      songID: req.body.songID,
      image: req.body.image,
      user: req.user.firstName
    }
    // console.log(newLikedSong);
    // Create a new liked song
    db.LikedSong.create(newLikedSong)
      .then(function(dbProperty) {
        // If saved successfully, send the the new Property document to the client
        // res.json(dbProperty);
        res.send('you saved a new song!');
        // res.redirect('/my-properties');
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Endpoint for saving a liked song
  app.post("/like-song-by-user", passportConfig.isAuthenticated, function(req, res) {
    console.log(req.body);

    // Create a new comment and pass the req.body to the entry
    db.LikedSong.create(req.body)
      .then(function(dbLike) {
        // if like creation success, find like with req.body.user match, associate it with the comment body sent from app.js by pushing it to like array
        // new true returns updated article
        return db.User.findOneAndUpdate({ _id: req.body.user }, { $push: { likedSongs: dbLike._id } }, { new: true });
      })
      
      .then(function(dbLike) {
        // we were able to successfully update a Like, send it back, otherwise send the error
        res.json(dbLike);
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
