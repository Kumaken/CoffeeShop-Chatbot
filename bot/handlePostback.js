const querystring = require('querystring');
const postbackStrategy = require('./strategy/postbackStrategy')

module.exports = async (userId, rawData) => {
    const parsedData = querystring.parse(rawData);
    try {
      let replies = await postbackStrategy(parsedData.action, parsedData, userId);
      console.log(`Replies: ${JSON.stringify(replies)}`)
      return replies;
    }
    catch(e) {
      throw new Error(e)
    }
}