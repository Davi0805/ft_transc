const redis = require('../config/Redis');

class SessionRepository {
    
    async save(jwToken, metadata)
    {
        await redis.hSet(`session:${jwToken}`, metadata);
        await redis.expire(`session:${jwToken}`, 3600);
    }

    async findByJwt(jwToken)
    {
        const metadata = await redis.hGetAll(`session:${jwToken}`);
        return Object.keys(metadata).length > 0 ? metadata : null;
    }
}

module.exports = new SessionRepository();