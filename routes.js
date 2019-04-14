const line = require('@line/bot-sdk');
const handle = require('./handle')

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

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