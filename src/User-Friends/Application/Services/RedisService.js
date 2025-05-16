const sessionRepository = require('../../Adapters/outbound/Repositories/SessionRepository');
const messageRepository = require('../../Adapters/outbound/Repositories/MessageRepository');
const friendsCacheRepo = require('../../Adapters/outbound/Repositories/FriendsCacheRepository');
const friendsRequestRepo = require('../../Adapters/outbound/Repositories/FriendRequestRepository');

class RedisService {

    // Sessions - JWT e metadata
    async saveSession(token, metadata)
    {
        if (!token || !metadata) throw 400;

        await sessionRepository.save(token, metadata);
    }

    async validateSession(token)
    {
        if (!token) throw 400;

        const metadata = JSON.parse(await sessionRepository.findByJwt(token.substring(7)));
        
        if (!metadata || metadata.twofa_verified != 1) throw 401;

        return metadata;
    }

    async getSession(token)
    {
        if (!token) throw 400;

        const metadata = await sessionRepository.findByJwt(token.substring(7));
        if (!metadata) throw 401;
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

    async getCachedFriends(user_id)
    {
        return await friendsCacheRepo.get(user_id);
    }


    // Message QUEUE - ASYNC
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