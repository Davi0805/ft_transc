const friendRequest = require('../../../Application/Services/FriendRequestService');

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
}

module.exports = new FriendRequestController();