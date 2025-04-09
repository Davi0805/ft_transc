const sessionRepository = require('../Repositories/SessionRepository');
const messageRepository = require('../Repositories/MessageRepository');


class RedisService {
    async saveSession(token, metadata)
    {
        await sessionRepository.save(token, metadata);
    }

    async getSession(token)
    {
        const metadata = await sessionRepository.findByJwt(token.substring(7));
        return metadata;
    }

    async postMessage(topic, message)
    {
        await messageRepository.send(topic, message);
    }

    /* async readTopic(topic)
    {
        const result = await messageRepository.listenWithoutGroup(topic);
        return result;
    } */
}

module.exports = new RedisService();