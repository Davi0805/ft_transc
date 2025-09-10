//import type { RedisDataT } from "../../Infrastructure/config/Redis.js";

import redis from "../../Infrastructure/config/Redis.js";

class FriendsCacheRepository {
    //This shit is commented until I need it or I understand what type metadata is lol
    /* async save(user_id: number, metadata: RedisDataT)
    {
        console.log("FRIENDS CACHE REPO = ", user_id + ' | METADATA = ' + JSON.stringify(metadata));
        
        metadata.forEach((item: string, index: string) => {
            redis.hSet(`friends:${user_id}`, `${item.user_id}`, JSON.stringify(item));
        });
        
        await redis.expire(`friends:${user_id}`, 3600);
    } */ 

    async get(user_id: number)
    {
        const result = await redis.hGetAll(`friends:${user_id}`);
        const metadata = JSON.stringify(result);
        return Object.keys(metadata).length > 2 ? metadata : null;
    }

    async delete(user_id: number)
    {
        return await redis.del(`friends:${user_id}`);
    }
}

const friendsCacheRepository = new FriendsCacheRepository()
export default friendsCacheRepository;