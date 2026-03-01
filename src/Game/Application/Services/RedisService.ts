import type { RedisArgument } from "redis";
import type { RedisDataT } from "../../Infrastructure/config/Redis.js";

import { sessionRepository } from "../../Adapters/Outbound/SessionRepository.js";
import exception from "../../Infrastructure/config/customException.js";
import friendsCacheRepository from "../../Adapters/Outbound/FriendsCacheRepository.js";

class RedisService {

    // Sessions - JWT e metadata
    async saveSession(token: RedisArgument, metadata: RedisDataT)
    {
        await sessionRepository.save(token, metadata);
    }

    async validateSession(token: string)
    {
        //if (!token) { throw CustomException('Authorization token not found!', 400) };

        const metadata = await sessionRepository.findByJwt(token.substring(7));
        
        if (!metadata || Number(metadata.twofa_verified) != 1) { throw exception('Authorization failed!', 401) };

        return metadata;
    }

    async getSession(token: string)
    {
        //if (!token) throw 400;

        const metadata = await sessionRepository.findByJwt(token.substring(7));
        if (!metadata) throw 401;
        return metadata;
    }

    /* 
    *   @brief Method to retrieve user friends
    *   @params user_id (integer)
    */
    async getCachedFriends(user_id: number)
    {
        return await friendsCacheRepository.get(user_id);
    }

    /* // Friends - cache to be used by other microservices, like game
    // to for example send match invites
    // PS: probably would not be effiecient way in a bigger infrastructure
    // but for now it will work
    async cacheFriends(user_id)
    {
        const allFriends = await friendsRequestRepo.getAllFriends(user_id);
        
        await friendsCacheRepo.save(user_id, allFriends);
    }

    async getCachedFriends(user_id)
    {
        return await friendsCacheRepo.get(user_id);
    }


    // Message QUEUE - ASYNC
    async postMessage(topic, message)
    {
        await messageRepository.send(topic, message);
    }
 */
    /* async readTopic(topic)
    {
        const result = await messageRepository.listenWithoutGroup(topic);
        return result;
    } */
}

const redisService = new RedisService();

export default redisService;