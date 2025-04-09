const sessionRepository = require('../Repositories/SessionRepository');

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
}

module.exports = new RedisService();