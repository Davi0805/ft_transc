const friendRequestRepo = require('../../Adapters/outbound/Repositories/FriendRequestRepository');

class FriendRequestService {
    async findAll()
    {
        return await friendRequestRepo.getAll();
    }

    async newRequest()
    {
        return await friendRequestRepo.newRequest();
    }
}

module.exports = new FriendRequestService();