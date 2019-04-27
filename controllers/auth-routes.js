// const { promisify } = require('util');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const passport = require('passport');
// const User = require('../models/User');

// const randomBytesAsync = promisify(crypto.randomBytes);
// const passportConfig = require('../config/passport');

// module.exports = function (app) {

//   /**
//    * GET /account
//    * Account page
//    * Ensure user is authenticated in passport first then render account page
//    */
//   app.get('/account', passportConfig.isAuthenticated, function(req, res) {
//     console.log('SUCCESS!!!!!!');
//     const hbsObject = {
//       user: req.user
//     }
//     res.render('account/profile', {
//       title: 'Account Management',
//       hbsObject: hbsObject
//     });
//   });

//   /**
//    * GET /story-post
//    * Account page
//    * Ensure user is authenticated in passport first then render story-post page
//    */
//   app.get('/story-post', passportConfig.isAuthenticated, function(req, res) {
//     const hbsObject = {
//       user: req.user
//     }
//     res.render('story-post', {
//       title: 'Story Post',
//       hbsObject: hbsObject
//     });
//   });


//   /**
//    * POST /account/profile
//    * Update profile information.
//    * Ensure user is authenticated in passport first then render account page
//    */
//   app.post('/account/profile', passportConfig.isAuthenticated, function(req, res) {
//     req.assert('email', 'Please enter a valid email address.').isEmail();
//     req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

//     const errors = req.validationErrors();

//     if(errors) {
//       req.flash('errors', errors);
//       return res.redirect('/account');
//     }

//     User.findById(req.user.id, (err, user) => {
//       if(err) { return next(err); }
//       user.email = req.body.email || '';
//       user.teamName = req.body.teamName || '';
//       user.logo = req.body.logo || '';
//       user.profile.name = req.body.name || '';
//       user.profile.gender = req.body.gender || '';
//       user.profile.location = req.body.location || '';
//       user.profile.website = req.body.website || '';
//       user.save((err) => {
//         if(err) {
//           if(err.code === 11000) {
//             req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
//             return res.redirect('/account');
//           }
//           return next(err);
//         }
//         req.flash('success', { msg: 'Profile information has been updated.' });
//         res.redirect('/account');
//       });
//     });
//   });



//   /**
//    * POST /account/password
//    * Update current password.
//    */
//   app.post('/account/password', passportConfig.isAuthenticated, function(req, res) {
//     req.assert('password', 'Password must be at least 4 characters long').len(4);
//     req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

//     const errors = req.validationErrors();

//     if(errors) {
//       req.flash('errors', errors);
//       return res.redirect('/account');
//     }

//     User.findById(req.user.id, (err, user) => {
//       if(err) { return next(err); }
//       user.password = req.body.password;
//       user.save((err) => {
//         if(err) { return next(err); }
//         req.flash('success', { msg: 'Password has been changed.' });
//         res.redirect('/account');
//       });
//     });
//   });


//   /**
//    * POST /account/delete
//    * Delete user account.
//    */
//   app.post('/account/delete', passportConfig.isAuthenticated, function(req, res) {
//     User.remove({ _id: req.user.id }, (err) => {
//       if(err) { return next(err); }
//       req.logout();
//       req.flash('info', { msg: 'Your account has been deleted.' });
//       res.redirect('/');
//     });
//   });


//   /**
//    * GET /spotify
//    * Account page
//    * Ensure user is authenticated in passport first then render account page
//    */
//   app.get('/spotify', passportConfig.isAuthenticated, function(req, res) {
//     var SpotifyWebApi = require('spotify-web-api-node');
//     // credentials are optional
//     var spotifyApi = new SpotifyWebApi({
//       clientId: 'd64a622709394715aac35e04674d865e',
//       clientSecret: 'dfa640a0c5324aef9823263b428890e5'
//     });

//     console.log(spotifyApi);
//     console.log('we here');

//     // const spotifyApi = new SpotifyWebApi({
//     //   clientId: 'myClientId',
//     //   clientSecret: 'myClientSecret',
//     //   redirectUri: 'myRedirectUri',
//     // });

//     // Set an access token.
//     // This is required as Spotify implemented a new auth flow since May 2017.
//     // See https://developer.spotify.com/news-stories/2017/01/27/removing-unauthenticated-calls-to-the-web-api/
//     spotifyApi.clientCredentialsGrant()
//       .then(function(data) {
//         console.log('The access token expires in ' + data.body['expires_in']);
//         console.log('The access token is ' + data.body['access_token']);

//         // Save the access token so that it's used in future calls
//         spotifyApi.setAccessToken(data.body['access_token']);

//         // // Get Elvis' albums
//         // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//         //   function(data) {
//         //     console.log('Artist albums', data.body);
//         //   },
//         //   function(err) {
//         //     console.error(err);
//         //   }
//         // );

//         // // Search tracks whose name, album or artist contains 'Love'
//         // spotifyApi.searchTracks('Love')
//         //   .then(function(data) {
//         //     console.log('Search by "Love"', data.body);
//         //   }, function(err) {
//         //     console.error(err);
//         //   });
         
//         // // Search artists whose name contains 'Love'
//         // spotifyApi.searchArtists('Love')
//         //   .then(function(data) {
//         //     console.log('Search artists by "Love"', data.body);
//         //   }, function(err) {
//         //     console.error(err);
//         //   });

//         // Search tracks whose artist's name contains 'Kendrick Lamar', and track name contains 'Alright'
//         // spotifyApi.searchTracks('track:Life is beautiful artist:Lil Peep')
//         //   .then(function(data) {
//         //     console.log('-------');
//         //     // console.log('Search tracks by "Alright" in the track name and "Kendrick Lamar" in the artist name');
//         //     console.log(data.body);
//         //     console.log('-------');
//         //     var items = data.body.tracks.items;
//         //     items.forEach(function(index) {
//         //       console.log('-------new item-------');
//         //       // console.log(index);
//         //       console.log(index.name);
//         //       console.log('-------end new item-------');
//         //     });
//         //   }, function(err) {
//         //     console.log('Something went wrong!', err);
//         //   });

//         // // Get the authenticated user
//         // spotifyApi.getMe()
//         //   .then(function(data) {
//         //     console.log('Some information about the authenticated user', data.body);
//         //   }, function(err) {
//         //     console.log('Something went wrong!', err);
//         //   });

//         // // Get a playlist
//         // spotifyApi.getPlaylist('0TFs4Jvyajd6B8yW5o4mPs')
//         //   .then(function(data) {
//         //     console.log('Some information about this playlist', data.body);
//         //     console.log('------------------------------------');
//         //     console.log(data.body.tracks.items);
//         //   }, function(err) {
//         //     console.log('Something went wrong!', err);
//         //   });

//         // Get a user's playlists
//         spotifyApi.getUserPlaylists('schmitty890')
//           .then(function(data) {
//             console.log('Retrieved playlists', data.body);
//             console.log('--------------------------------');
//             console.log(data.body.items[0].external_urls);
//           },function(err) {
//             console.log('Something went wrong!', err);
//           });

//         // Create a private playlist
//         // spotifyApi.createPlaylist('My Cool Playlist', { 'public' : false })
//         //   .then(function(data) {
//         //     console.log('Created playlist!');
//         //   }, function(err) {
//         //     console.log('Something went wrong!', err);
//         //   });


//       }, function(err) {
//         console.log('Something went wrong when retrieving an access token', err.message);
//       });

//     // Continue making other calls to Spotify API as now access token will be sent.



//     const hbsObject = {
//       user: req.user
//     }
//     res.render('spotify', {
//       hbsObject: hbsObject
//     });
//   });


// };