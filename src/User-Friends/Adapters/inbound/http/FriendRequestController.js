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
        const session = await redisService.getSession((req.headers.authorization));
        console.log("SESSION: " + session);
        const pendingRequests = await friendRequest.listPendingRequests(session.user_id);
        return reply.send(pendingRequests);
    }

    async acceptRequest(req, reply) {
        const request_id = req.params.id;
        const user_id = req.body.user_id;
        const session = await redisService.getSession((req.headers.authorization));
        console.log("SESSION: " + session);
        await friendRequest.acceptRequest(request_id, user_id);
        return reply.send();
    }

    async rejectRequest(req, reply) {
        const request_id = req.params.id;
        const user_id = req.body.user_id;
        await friendRequest.rejectRequest(request_id, user_id);
        return reply.send();
    }

    async getAllFriends(req, reply) {
        const user_id = req.query.user_id;
        const friends = await friendRequest.getAllFriends(user_id);
        return reply.send(friends);
    }
}

module.exports = new FriendRequestController();