const sessionRepository = require('../../Adapters/outbound/Repositories/SessionRepository');
const messageRepository = require('../../Adapters/outbound/Repositories/MessageRepository');
const friendsCacheRepo = require('../../Adapters/outbound/Repositories/FriendsCacheRepository');
const friendsRequestRepo = require('../../Adapters/outbound/Repositories/FriendRequestRepository');
const exception = require('../../Infrastructure/config/CustomException');

class RedisService {


    /* 
    *    @brief Method to save JWT token and user metadata on Redis
    *    @throws 400 - Bad request
    */
    async saveSession(token, metadata)
    {
        if (!token || !metadata) throw exception('Failed to authenticate', 400);
        await sessionRepository.save(token, metadata);
    }


    /* 
    *    @brief Method to retrieve user session data from redis
    *    @throws 400 - Bad request
    *    @throws 401 - Unauthorized
    *    @returns metadata (object)
    */
    async validateSession(token)
    {
        if (!token) { throw exception('Authorization token not found!', 400) };
        const metadata = JSON.parse(await sessionRepository.findByJwt(token.substring(7)));
        if (!metadata || metadata.twofa_verified != 1) { throw exception('Authorization failed!', 401) };
        return metadata;
    }

    /* 
    *    @brief Method to retrieve user session data from redis
    *    @throws 400 - Bad request
    *    @throws 401 - Unauthorized
    *    @returns metadata (object)
    */
    async getSession(token)
    {
        if (!token) { throw exception('Failed to authenticate', 400); }
        const metadata = await sessionRepository.findByJwt(token.substring(7));
        if (!metadata) { throw exception('Failed to authenticate', 401); }
        return metadata;
    }


    // Friends - cache to be used by other microservices, like game
    // to for example send match invites
    // PS: probably would not be effiecient way in a bigger infrastructure
    // but for now it will work
    async cacheFriends(user_id)
    {
        const allFriends = await friendsRequestRepo.getAllFriends(user_id);
        
        await friendsCacheRepo.save(user_id, allFriends);
    }


    /* 
    *   @brief Method to invalidate and delete the friendsCache of both users
    *   to be replaced by the new one
    *   @params user_id1 (integer)
    *   @params user_id2 (integer)
    */
    async updateFriendsCache(user_id1, user_id2)
    {
        await friendsCacheRepo.delete(user_id1);
        await friendsCacheRepo.delete(user_id2);
        await this.cacheFriends(user_id1);
        await this.cacheFriends(user_id2);
    }


    /* 
    *   @brief Method to retrieve user friends
    *   @params user_id (integer)
    */
    async getCachedFriends(user_id)
    {
        return await friendsCacheRepo.get(user_id);
    }


    /* 
    *   @brief Method to produce messages on message broker
    *   @params topic (string)
    *   @params message (string)
    */
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