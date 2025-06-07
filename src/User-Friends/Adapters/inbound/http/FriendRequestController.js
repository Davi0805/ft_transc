const friendRequest = require('../../../Application/Services/FriendRequestService');
const exception = require('../../../Infrastructure/config/CustomException');
const redisService = require('../../../Application/Services/RedisService');

class FriendRequestController {

    /* 
        Endpoint for debug purposes
        GET - localhost:8080/friend_requests
    */
    async getAll(req, reply)
    {
        const requests = await friendRequest.findAll();
        return reply.send(requests);   
    }

    /* 
        Endpoint to create/start/request a new friendship
        POST - localhost:8080/friend_requests
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params {sender_id: (Long), receiver_id: (Long)}
    */
    async create(req, reply)
    {
        if (req.session.user_id != req.body.sender_id) throw exception('Invalid sender id', 400);
        await friendRequest.newRequest(req.body.sender_id, req.body.receiver_id);
        return reply.send();        
    }

    /* 
        Endpoint to list all friend requests pending that u can accept
        GET - localhost:8080/friend_requests/pending
        @params {HTTP Header} Authorization: Bearer <JWT> 
    */
    async listPendingRequests(req, reply) {
        const pendingRequests = await friendRequest.listPendingRequests(req.session.user_id);
        return reply.send(pendingRequests);   
    }

    /* 
        Endpoint to accept the friendship requests that u received
        POST - localhost:8080/friend_requests/{request_id}/accept
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params request_id: (Long) - id of friend_request
    */
    async acceptRequest(req, reply) {
        const request_id = req.params.id;
        const data = await friendRequest.acceptRequest(request_id, req.session.user_id);
        await redisService.postMessage('newFriendshipEvent', JSON.stringify({user1: data.from_user_id, user2: data.to_user_id})); //debug
        await redisService.updateFriendsCache(data.from_user_id, data.to_user_id);
        return reply.send();    
    }
    /* 
        Endpoint to reject the friendship requests that u received
        POST - localhost:8080/friend_requests/{request_id}/reject
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params request_id: (Long) - id of friend_request
    */
    async rejectRequest(req, reply) {
        const request_id = req.params.id;
        await friendRequest.rejectRequest(request_id, req.session.user_id);
        return reply.send();   
    }
    /*
        Endpoint to retrieve all friends of user, based on friend requests table
        @params {HTTP Header} Authorization: Bearer <JWT> 
        GET -  localhost:8080/friends
    */
    async getAllFriends(req, reply) {
        // implement caching logic in getAllFriends
        const friends = await friendRequest.getAllFriends(req.session.user_id);
        return reply.send(friends);   
    }
}

module.exports = new FriendRequestController();