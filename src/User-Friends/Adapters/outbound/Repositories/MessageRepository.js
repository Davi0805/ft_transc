const redis = require('../../../Infrastructure/config/Redis');

class MessageRepository {

    async send(topic, message)
    {
        /* const messageArray = Object.entries(message).flat(); */
        /* await redis.XADD(topic, '*', ...messageArray); */
        console.log('JSON MANDADO - ' + JSON.stringify(message));
        await redis.XADD(topic, '*', JSON.stringify(message));
    }

}

module.exports = new MessageRepository();