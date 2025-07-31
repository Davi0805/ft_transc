const friendRequestRepo = require('../../Adapters/outbound/Repositories/FriendRequestRepository');
const exception = require('../../Infrastructure/config/CustomException');
const eventBroadcast = require('../../Adapters/inbound/Redis pub-sub/EventBroadcast');


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
    // TODO: refac of consumers to expect a number as user_id
    async newRequest(sender_id, receiver_id)
    {
        try {
            await friendRequestRepo.newRequest(sender_id, receiver_id);
            await eventBroadcast.publish('realTimeNotif', {user_id: String(receiver_id), event: 'new_friend_request'});
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
            const pending = await friendRequestRepo.listAllPendingRequest(user_id);
            if (!pending || pending.size === 0) throw exception('No pending requests found!', 204);
            return pending;
        } catch (error) {
            throw exception('Failed to retrieve pending friend requests', 400); 
        }
    }


    /* 
    *    @brief Method returns the number of pending requests of user
    *    @throws 400 - Bad request
    *    @returns {pendingRequestCounter: number}
    */
    async countPendingRequests(user_id)
    {
        try {
            const result = await friendRequestRepo.getPendingRequestCounter(user_id);
            return result;
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

    async blockFriend(target_id, user_id)
    {
        try {
            return await friendRequestRepo.blockFriend(target_id, user_id);
        } catch (error) {
            throw exception('Failed to block friend request', 400); 
        }
    }

    async unblockFriend(target_id, user_id)
    {
        try {
            return await friendRequestRepo.unblockFriend(target_id, user_id);
        } catch (error) {
            throw exception('Failed to unblock friend request', 400);
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

    async getAllMyBlockedFriends(user_id)
    {
        try {
            return await friendRequestRepo.getAllMyBlockedFriends(user_id);
        } catch (error) {
            throw exception('Failed to retrieve', 400);
        }
    }
}

module.exports = new FriendRequestService();