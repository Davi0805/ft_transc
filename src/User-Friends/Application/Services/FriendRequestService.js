const friendRequestRepo = require('../../Adapters/outbound/Repositories/FriendRequestRepository');
const exception = require('../../Infrastructure/config/CustomException');


class FriendRequestService {


    /* 
    *    @brief Method returns all friends requests (DEBUG)
    *    @throws 400 - Bad request
    *    @returns a list of friend requests
    */
    async findAll()
    {
        try {
            return await friendRequestRepo.getAll();
        } catch (error) {
        }
    }


    /* 
    *    @brief Method that create a friend request
    *    @throws 400 - Bad request
    */
    async newRequest(sender_id, receiver_id)
    {
        try {
            return await friendRequestRepo.newRequest(sender_id, receiver_id);            
        } catch (error) {
            throw exception('Failed to create friend request', 400); 
        }
    }


    /* 
    *    @brief Method returns all pending requests
    *    @throws 400 - Bad request
    *    @returns a list of friend requests
    */
    async listPendingRequests(user_id)
    {
        try {
            return await friendRequestRepo.listAllPendingRequest(user_id);
        } catch (error) {
            throw exception('Failed to retrieve pending friend requests', 400); 
        }
    }


    /* 
    *    @brief Method to accept friend request
    *    @throws 400 - Bad request
    */
    async acceptRequest(request_id, user_id)
    {
        try {
            return await friendRequestRepo.acceptRequest(request_id, user_id);
        } catch (error) {
            throw exception('Failed to accept friend request', 400); 
        }
    }


    /* 
    *    @brief Method to reject friend request
    *    @throws 400 - Bad request
    */
    async rejectRequest(request_id, user_id)
    {
        try {
            return await friendRequestRepo.rejectRequest(request_id, user_id);
        } catch (error) {
            throw exception('Failed to reject friend request', 400); 
        }
    }


    /* 
    *    @brief Method to get all friends
    *    @throws 400 - Bad request
    *    @returns list of friends and their data
    */
    async getAllFriends(user_id)
    {
        try {
            return await friendRequestRepo.getAllFriends(user_id);
        } catch (error) {
            throw exception('Failed to retrieve all friends', 400); 
            
        }
    }
}

module.exports = new FriendRequestService();