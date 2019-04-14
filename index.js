'use strict';

require('now-env')
const line = require('@line/bot-sdk');
const restify = require('restify');
//const server = restify.createServer();
const mongoose = require('mongoose');

//API ADDITION:
  const mongodb = require('mongodb');
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const server = express();

  //Middleware
  server.use(bodyParser.json());
  server.use(cors())

  //ADITION API:
  const posts = require('./bot/items/api');
  server.use('/api',posts); //all that goes to /api goes to posts

if (process.env.MONGODB_URI) {
  // Load the models here
}

const handle = require('./handle');

// base URL for webhook server (otomatis ada bila deploy pake NOW, gaperlu diisi)
let baseURL = process.env.NOW_URL || 'localhost';

console.log(process.env.WIT_AI_ACCESS_TOKEN)

console.log(`BASEURL: ${baseURL}`)

const port = process.env.PORT || 80;

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

/*
server.get('/', (req, res, next) => {
    console.log("ENTERED")
    res.send("Hello")
}) 
*/

if (process.env.MONGODB_URI) {
    console.log('with db')
    server.listen(port, () => {
        mongoose.set('useFindAndModify', false)
        mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true
      })
    });

    const db = mongoose.connection;
    db.on('error', (err) => console.log(err))

    db.once('open', () => {
        console.log(`Server with DB listening on PORT ${server.url}/webhook PORT ${port}`)
    })
}

else {

  server.listen(port, () => {
    console.log('no db')

    console.log(`Server listening on ${server.url}/webhook PORT ${port}`)
  })

}

module.exports = (server) => {
  server.post('/callback', (req, res, next) => {
      Promise
          .all(req.body.events.map((event) => {
              handle(event, req)
          }))
          .then((result) => res.end())
          .catch((err) => {
            console.log(JSON.stringify(err))
          });
  });
}

server.post('/webhook', function (req, res) {
  Promise
  .all(req.body.events.map((event) => {
      handle(event, req)
  }))
  .then((result) => res.end())
  .catch((err) => {
    console.log(JSON.stringify(err))
 })
})
/*
server.post('/webhook', line.middleware(config), (req, res, next) => {
     Promise
     .all(req.body.events.map((event) => {
         handle(event, req)
     }))
     .then((result) => res.end())
     .catch((err) => {
       console.log(JSON.stringify(err))
    })
});
*/