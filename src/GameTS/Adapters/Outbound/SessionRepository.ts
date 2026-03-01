import type { RedisDataT } from "../../Infrastructure/config/Redis.js";
import type { RedisArgument } from "redis";


import redis from "../../Infrastructure/config/Redis.js";

class SessionRepository {
    
    async save(jwToken: RedisArgument, metadata: RedisDataT)
    {
        await redis.hSet(`session:${jwToken}`, metadata);
        await redis.expire(`session:${jwToken}`, 3600);
    }

    async findByJwt(jwToken: string)
    {
        const result: RedisDataT = await redis.hGetAll(`session:${jwToken}`);
        //const metadata = JSON.stringify(result);
        //return Object.keys(metadata).length > 2 ? metadata : null; // size 2 = {}

        //TODO: Doublecheck if the above is required
        return result;
    }
}

export const sessionRepository = new SessionRepository();