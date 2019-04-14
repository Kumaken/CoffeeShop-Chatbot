const bot = require('./bot')
const line = require('@line/bot-sdk');

// create LINE SDK client
let client = new line.Client(
                    {
                        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
                        channelSecret: process.env.CHANNEL_SECRET
                    });

module.exports = async (event, req) => {
  switch (event.type) {
    case "follow":
        try {
          const response = await bot.follow(event.source.userId);
          console.log(`Reply follow with: ${JSON.stringify(response)}`)
          await client.replyMessage(event.replyToken, response)
        }
        catch (e) {
          if (e.hasOwnProperty("originalError")) {
            console.log(JSON.stringify(e.originalError.response.data))
          }
          console.error(e)
          return client.replyMessage(event.replyToken, {type: 'text', 'text': 'Something goes wrong'})
        }
      break;
    case "postback":
      try {
        console.log(event.postback.data)
        const response = await bot.postback(event.source.userId, event.postback.data);
        console.log(`Reply postback with: ${JSON.stringify(response)}`)
        await client.replyMessage(event.replyToken, response)
      }
      catch (e) {
        if (e.hasOwnProperty("originalError")) {
          console.log(JSON.stringify(e.originalError.response.data))
        }
        console.error(e)
        client.replyMessage(event.replyToken, {type: 'text', 'text': 'Something goes wrong'})
      }
      break;
    case "message":
      try {
        const response = await bot.message(event.source.userId, event.message.text);
        console.log(`Reply message with \n ${response}`)
        await client.replyMessage(event.replyToken, response)
      }
      catch (e) {
        if (e.hasOwnProperty("originalError")) {
          console.log(JSON.stringify(e.originalError.response.data))
        }
        console.error(e)
        return client.replyMessage(event.replyToken, {type: 'text', 'text': 'Something goes wrong'})
      }
      break;
    default:
      return Promise.resolve(null)
      break;
  }
}