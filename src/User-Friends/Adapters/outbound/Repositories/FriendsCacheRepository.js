const redis = require('../../../Infrastructure/config/Redis');

class FriendsCacheRepository {
    async save(user_id, metadata)
    {
        console.log("FRIENDS CACHE REPO = ", user_id + ' | METADATA = ' + JSON.stringify(metadata));
        
        metadata.forEach((item, index) => {
            redis.hSet(`friends:${user_id}`, `friend_id:${item.user_id}`, JSON.stringify(item));
        });
        
        await redis.expire(`friends:${user_id}`, 3600);
    }

    async get(user_id)
    {
        const result = await redis.hGetAll(`friends:${user_id}`);
        const metadata = JSON.stringify(result);
        return Object.keys(metadata).length > 2 ? metadata : null;
    }

    async delete(user_id)
    {
        return await redis.del(`friends:${user_id}`);
    }
}

module.exports = new FriendsCacheRepository();