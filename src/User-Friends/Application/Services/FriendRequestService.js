const friendRequestRepo = require('../../Adapters/outbound/Repositories/FriendRequestRepository');

class FriendRequestService {
    async findAll()
    {
        return await friendRequestRepo.getAll();
    }

    async newRequest(sender_id, receiver_id)
    {
        return await friendRequestRepo.newRequest(sender_id, receiver_id);
    }
}

module.exports = new FriendRequestService();