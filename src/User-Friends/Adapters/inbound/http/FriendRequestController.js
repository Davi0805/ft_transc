const friendRequest = require('../../../Application/Services/FriendRequestService');

const redisService = require('../../../Application/Services/RedisService');

class FriendRequestController {
    async getAll(req, reply)
    {
        const requests = await friendRequest.findAll();
        return reply.send(requests);
    }

    async create(req, reply)
    {
        await friendRequest.newRequest(req.body.sender_id, req.body.receiver_id);
        return reply.send();
    }

    async listPendingRequests(req, reply) {
        const session = JSON.parse(await redisService.getSession((req.headers.authorization)));
        console.log("SESSION: " + JSON.stringify(session));
        if (!session)
            return reply.code(400).send();
        const pendingRequests = await friendRequest.listPendingRequests(session.user_id);
        return reply.send(pendingRequests);
    }

    async acceptRequest(req, reply) {
        const request_id = req.params.id;
        const session = JSON.parse(await redisService.getSession((req.headers.authorization)));
        console.log("SESSION: " + JSON.stringify(session));
        if (!session)
            return reply.code(400).send();
        // todo: make a query that change and return the row 
        await friendRequest.acceptRequest(request_id, session.user_id);
        await redisService.postMessage('newFriendshipEvent', {user1: 1, user2: 2});
        return reply.send();
    }

    async rejectRequest(req, reply) {
        const request_id = req.params.id;
        const session = JSON.parse(await redisService.getSession((req.headers.authorization)));
        console.log("SESSION: " + JSON.stringify(session));
        if (!session)
            return reply.code(400).send();
        await friendRequest.rejectRequest(request_id, session.user_id);
        return reply.send();
    }

    async getAllFriends(req, reply) {
        const session = JSON.parse(await redisService.getSession((req.headers.authorization)));
        console.log("SESSION: " + JSON.stringify(session));
        if (!session)
            return reply.code(400).send();
        const friends = await friendRequest.getAllFriends(session.user_id);
        return reply.send(friends);
    }
}

module.exports = new FriendRequestController();