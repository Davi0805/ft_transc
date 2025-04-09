const sessionRepository = require('../Repositories/SessionRepository');

class RedisService {
    async saveSession(token, metadata)
    {
        console.log(token);
        await sessionRepository.save(token, metadata);
    }

    async getSession(token)
    {
        const metadata = await sessionRepository.findByJwt(token);
        return metadata;
    }
}

module.exports = new RedisService();