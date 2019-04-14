const handleFollow = require('./handleFollow')
const handleMessage = require('./handleMessage')
const handlePostback = require('./handlePostback')


exports.follow = async (userId) => {
	const response = await handleFollow(userId);
	return response;
}

exports.message = async (userId, text) =>  {
	const response = await handleMessage(userId, text);
	return response;
}

exports.postback = async (userId, data) => {
	const response = await handlePostback(userId, data);
	return response;
}