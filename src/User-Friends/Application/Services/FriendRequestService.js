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

    async listPendingRequests(user_id) {
        return await friendRequestRepo.listAllPendingRequest(user_id);
    }

    async acceptRequest(request_id, user_id) {
        return await friendRequestRepo.acceptRequest(request_id, user_id);
    }

    async rejectRequest(request_id, user_id) {
        return await friendRequestRepo.rejectRequest(request_id, user_id);
    }

    async getAllFriends(user_id) {
        return await friendRequestRepo.getAllFriends(user_id);
    }
}

module.exports = new FriendRequestService();