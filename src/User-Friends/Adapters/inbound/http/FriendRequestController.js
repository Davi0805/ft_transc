const friendRequest = require('../../../Application/Services/FriendRequestService');
const userService = require('../../../Application/Services/UserService');
const exception = require('../../../Infrastructure/config/CustomException');
const redisService = require('../../../Application/Services/RedisService');

class FriendRequestController {


    /* 
    *    Endpoint for DEBUG purposes
    *    GET - localhost:8080/friend_requests
    *    @returns list of friend requests
    */
    async getAll(req, reply)
    {
        const requests = await friendRequest.findAll();
        return reply.send(requests);   
    }


    /* 
    *    Endpoint to create/start/request a new friendship
    *    POST - localhost:8080/friend_requests
    *    @params {receiver_id: (Long)}
    */
    async create(req, reply)
    {
        await friendRequest.newRequest(req.session.user_id, req.body.receiver_id);
        return reply.send();        
    }

    async createByUsername(req, reply)
    {
        const { user_id } = await userService.findByUsername(req.params.username);
        console.log(user_id);
        await friendRequest.newRequest(req.session.user_id, user_id);
        return reply.send();
    }


    /* 
    *    Endpoint to list all friend requests pending that u can accept
    *    GET - localhost:8080/friend_requests/pending
    *    @returns list of pending requests
    */
    async listPendingRequests(req, reply)
    {
        const pendingRequests = await friendRequest.listPendingRequests(req.session.user_id);
        return reply.send(pendingRequests);   
    }


    /* 
    *    Endpoint to accept the friendship requests that u received
    *    POST - localhost:8080/friend_requests/{request_id}/accept
    *    @params request_id: (Long) - id of friend_request
    */
    async acceptRequest(req, reply)
    {
        const request_id = req.params.id;
        const data = await friendRequest.acceptRequest(request_id, req.session.user_id);
        await redisService.postMessage('newFriendshipEvent', JSON.stringify({user1: data.from_user_id, user2: data.to_user_id})); //debug
        await redisService.updateFriendsCache(data.from_user_id, data.to_user_id);
        return reply.send();    
    }


    /* 
    *    Endpoint to reject the friendship requests that u received
    *    POST - localhost:8080/friend_requests/{id}/reject
    *    @params id: (Long) - id of friend_request
    */
    async rejectRequest(req, reply)
    {
        await friendRequest.rejectRequest(req.params.id, req.session.user_id);
        return reply.send();   
    }


    /* 
    *    Endpoint to block friendship
    *    POST - localhost:8080/friend_requests/{id}/block
    *    @params id: (Long) - id of target user
    */
    async blockFriend(req, reply)
    {
        await friendRequest.blockFriend(req.params.id, req.session.user_id);
        return reply.send();
    }


    /* 
    *    Endpoint to unblock friendship
    *    POST - localhost:8080/friend_requests/{id}/unblock
    *    @params id: (Long) - id of friend_request
    */
    async unblockFriend(req, reply)
    {
        await friendRequest.unblockFriend(req.params.id, req.session.user_id);
        return reply.send();
    }


    /*
    *    Endpoint to retrieve all friends of user, based on friend requests table
    *    GET -  localhost:8080/friends
    */
    async getAllFriends(req, reply)
    {
        // implement caching logic in getAllFriends
        const friends = await friendRequest.getAllFriends(req.session.user_id);
        return reply.send(friends);   
    }


    /*
    *    Endpoint to retrieve the count of pending requests
    *    GET -  localhost:8080/friend_requests/pending/count
    */
    async getPendingRequestsCount(req, reply)
    {
        const count = await friendRequest.countPendingRequests(req.session.user_id);
        return reply.send(count);
    }
}

module.exports = new FriendRequestController();