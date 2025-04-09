const redis = require('../config/Redis');

class MessageRepository {

    async send(topic, message)
    {
        await redis.XADD(topic, '*', message);
    }

    /* async listenWithoutGroup(topic)
    {
        await redis.xRead();
    } */

}

module.exports = new MessageRepository();