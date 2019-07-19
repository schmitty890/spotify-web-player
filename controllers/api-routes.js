// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var db = require("../models");
var axios = require('axios');
const request = require('request');
const cheerio = require('cheerio');
// stripe keys
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);
const nodemailer = require('nodemailer');

// Routes
// =============================================================
module.exports = function(app) {
  // DigitalData object
  app.get('/api/digitalData', function(req, res) {
    res.json({
      data: req.user
    });
  });

  // Route for saving an Article's associated comment
  app.post("/story-post", function(req, res) {
    // Create a new StoryPost and pass the req.body to the entry
    db.StoryPost.create(req.body)
      .then(function(dbStoryPost) {
        // If saved successfully, send the the new User document to the client
        res.json(dbStoryPost);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // stripe api charge card
  app.post("/charge", (req, res) => {
    // console.log(keyPublishable);
    // console.log(keySecret);
    // console.log(req.body.email);
    console.log('look for memo line start');
    console.log(req.body);
    console.log('look for memo line end');
    const hbsObject = {
      user: req.user
    }
    console.log(hbsObject);
    let amount = hbsObject.user.rentAmount * 100; // charges by pennies. ex 500 = $5.00
  
    stripe.customers.create({ // creates user in stripe account to be used again in future
      email: req.body.email,
      card: req.body.id
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: hbsObject.user.firstName + ' ' + hbsObject.user.lastName + ' rent payment', // memo line
        currency: "usd",
        customer: customer.id
      }))
    .then(charge => res.send(charge))
    .then(resp => {
      console.log('then resp in stripe');
      // console.log(resp);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAILEMAIL,
          pass: process.env.GMAILPASS
        }
      });

      var bccmaillist = 'schmitty890@gmail.com, laligadelcaballeroordinario@gmail.com';
  
      const mailOptions = {
        to: req.body.email,
        bcc: bccmaillist,
        from: process.env.GMAILEMAIL,
        subject: `Your payment was successful, ${req.body.email}!`,
        text: `Thank you for your payment!`
      };
      return transporter.sendMail(mailOptions)
        .then(() => { if(!res.finished) res.redirect('/'); })
        .then(() => {
          console.log('-----------start update paid user here--------------');
          console.log(req.body);
          console.log('-----------end update paid user here--------------');
          console.log(req.user._id);
          db.User.findOneAndUpdate({ _id: req.user._id }, { $set: {paid: true} }, function(err, result) {
            if (err) throw err;
            console.log(result);
            console.log('you updated a paid to true!');
          });
        }) 
        .catch(err => next(err));
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({error: "Purchase Failed"});
    });
  });


// here are two examples of scraping / nyt and these will be converted to use app.get('/api/scraping') instead of exports.getScraping
// /**
//  * GET /api/scraping
//  * Web scraping example using Cheerio library.
//  */
// exports.getScraping = (req, res, next) => {
//   request.get('https://news.ycombinator.com/', (err, request, body) => {
//     if (err) { return next(err); }
//     const $ = cheerio.load(body);
//     const links = [];
//     $('.title a[href^="http"], a[href^="https"]').each((index, element) => {
//       links.push($(element));
//     });
//     res.render('api/scraping', {
//       title: 'Web Scraping',
//       links
//     });
//   });
// };


// /**
//  * GET /api/nyt
//  * New York Times API example.
//  */
// exports.getNewYorkTimes = (req, res, next) => {
//   const query = {
//     'list-name': 'young-adult',
//     'api-key': process.env.NYT_KEY
//   };
//   request.get({ url: 'http://api.nytimes.com/svc/books/v2/lists', qs: query }, (err, request, body) => {
//     if (err) { return next(err); }
//     if (request.statusCode === 403) {
//       return next(new Error('Invalid New York Times API Key'));
//     }
//     const books = JSON.parse(body).results;
//     res.render('api/nyt', {
//       title: 'New York Times API',
//       books
//     });
//   });
// };



  // app.post("/api/classifieds", function(req, res) {
  //   var userId = '';
  //   db.classifieds.create(req.body)
  //     .then(function(classified) {
  //       // console.log(classified, "made it here")
  //       res.json(classified);
  //     })
  //     .catch(function(err) {
  //       res.json({ status: "ERROR", message: err })
  //     })
  // });

  // app.get('/api/weather', function(req, res) {
  //   var openWeatherCreds = {
  //     apiKey: process.env.openWeatherMap,
  //     zipcode: 27510,
  //     city: 'Carrboro'
  //   }
  //   var queryURLweather = 'https://api.openweathermap.org/data/2.5/weather?zip=' + openWeatherCreds.zipcode + '&q=' + openWeatherCreds.city + '&units=imperial&appid=' + openWeatherCreds.apiKey;

  //   axios.get(queryURLweather)
  //     .then(function (resp) {
  //       res.send(resp.data);
  //     })
  //     .catch(function (error) {
  //       // console.log(error);
  //     });

  // });

  // app.get("/api/events", function(req, res) {
  //   db.event.findAll({
  //     order: [
  //       ['date', 'ASC']
  //     ]
  //   }).then( function(eventData) {
  //     res.json(eventData);
  //   })
  // })


};
