const redis = require('../../../Infrastructure/config/Redis');

class Temp2FARepository {
    async save(user_id, twofaToken)
    {
       await redis.set(`2fa:${user_id}`, twofaToken); 
       await redis.expire(`2fa:${user_id}`, 900);
    }

    async get(user_id)
    {
        return await redis.get(`2fa:${user_id}`);
    }
};

module.exports = new Temp2FARepository();