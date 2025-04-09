const redis = require('../../../Infrastructure/config/Redis');

class MessageRepository {

    async send(topic, message)
    {
        const messageArray = Object.entries(message).flat();
        await redis.XADD(topic, '*', ...messageArray);
    }

}

module.exports = new MessageRepository();