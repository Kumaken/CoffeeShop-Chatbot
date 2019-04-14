const redis_config = require('./redis-config')

const {promisify} = require('util');
const redis = require('redis');
const redis_client = redis.createClient(redis_config);
const redisGet = promisify(redis_client.get).bind(redis_client);
const redisSetEx = promisify(redis_client.setex).bind(redis_client);
const redisDel = promisify(redis_client.del).bind(redis_client);

exports.getContext = async (user) => {
    try {
        let key = "from_" + user;
        let context = await redisGet(key);
        return context
    }
    catch(err) {
        console.log(err)
    }
}

exports.getData =  async(user, key) => {
    try {
        let k = "from_" + user + "_data_" + key;
        let data = await redisGet(k);
        return data
    }
    catch(err) {
        console.log(err)
    }
}

exports.getDataObject = async (user, key) => {
    try {
        let k = "from_" + user + "_data_" + key;
        let data = await redisGet(k);
        // console.log(`FROM REDIS KEY ${k}: ${data}`)
        data = JSON.parse(data)
        return data;
    }
    catch(err) {
        console.log(err)
    }
}

exports.setContext = async (user, context) => {
    let key = "from_" + user;
    await redisSetEx(key, 900, context);
}

exports.fillData = async (user, key, data) => {
    let k = "from_" + user + "_data_" + key;
    await redisSetEx(k, 900, data);
}

exports.fillDataObject = async (user, key, data) => {
    let k = "from_" + user + "_data_" + key;
    await redisSetEx(k, 900, JSON.stringify(data));
}

exports.clearContext = async (user) => {
    await redisDel("from_" + user);
}

// exports.resetContext = async (user) => {
//     await redisDel("from_" + user,
//         "from_" + user + "_data_" + "data1");
// }