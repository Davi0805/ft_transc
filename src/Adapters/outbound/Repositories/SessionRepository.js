const redis = require('../../../Infrastructure/config/Redis');

class SessionRepository {
    
    async save(jwToken, metadata)
    {
        await redis.hSet(`session:${jwToken}`, metadata);
        await redis.expire(`session:${jwToken}`, 3600);
    }

    async findByJwt(jwToken)
    {
        const result = await redis.hGetAll(`session:${jwToken}`);
        const metadata = JSON.stringify(result);
        return Object.keys(metadata).length > 2 ? metadata : null; // size 2 = {}
    }
}

module.exports = new SessionRepository();