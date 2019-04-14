const contextStrategy = require('./contextStrategy')
const strictStrategy = require('./strictStrategy')

module.exports = async (context, intent, message, user) => {
    console.log(`Got a message: ${message}`)
    let replies = await strictStrategy(message, user, intent) || await contextStrategy(context, intent, message, user);
    return replies;
}